import React, { createContext, useContext, useMemo, useRef, useState, useCallback, useEffect } from "react";

// ============ TYPES ============
type EQ = { bass: number; mid: number; treble: number };

export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  coverUrl?: string;
  audioUrl: string;
  duration?: number;
}

interface PlayerContextType {
  currentSong: Song | undefined;
  isPlaying: boolean;
  progress: number;
  duration: number;
  eq: EQ;
  playSong: (song: Song) => Promise<void>;
  togglePlayPause: () => Promise<void>;
  seek: (position: number) => void;
  setEQ: (next: Partial<EQ>) => void;
  showNowPlaying: boolean;
  setShowNowPlaying: (show: boolean) => void;
}

// ============ CONTEXT ============
const PlayerContext = createContext<PlayerContextType | null>(null);

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
};

// ============ PROVIDER ============
export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const acRef = useRef<AudioContext | null>(null);
  const srcRef = useRef<MediaElementAudioSourceNode | null>(null);

  const bassRef = useRef<BiquadFilterNode | null>(null);
  const midRef = useRef<BiquadFilterNode | null>(null);
  const trebleRef = useRef<BiquadFilterNode | null>(null);

  const [currentSong, setCurrentSong] = useState<Song | undefined>(undefined);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [eq, setEqState] = useState<EQ>({ bass: 0, mid: 0, treble: 0 });
  const [showNowPlaying, setShowNowPlaying] = useState(false);

  // ✅ Token anti-race para playSong
  const playTokenRef = useRef(0);

  // Ensure audio element exists
  const ensureAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.crossOrigin = "anonymous";
      audioRef.current.preload = "auto";
    }
    return audioRef.current;
  }, []);

  // Setup Web Audio API graph with EQ
  const ensureGraph = useCallback(() => {
    const audio = ensureAudio();

    if (!acRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      acRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ac = acRef.current;

    // Create source once per audio element
    if (!srcRef.current) {
      srcRef.current = ac.createMediaElementSource(audio);
    }

    // Create filters
    if (!bassRef.current) {
      bassRef.current = ac.createBiquadFilter();
      bassRef.current.type = "lowshelf";
      bassRef.current.frequency.value = 120;
      bassRef.current.gain.value = eq.bass;
    }
    if (!midRef.current) {
      midRef.current = ac.createBiquadFilter();
      midRef.current.type = "peaking";
      midRef.current.frequency.value = 1000;
      midRef.current.Q.value = 1;
      midRef.current.gain.value = eq.mid;
    }
    if (!trebleRef.current) {
      trebleRef.current = ac.createBiquadFilter();
      trebleRef.current.type = "highshelf";
      trebleRef.current.frequency.value = 4000;
      trebleRef.current.gain.value = eq.treble;
    }

    // Connect: source -> bass -> mid -> treble -> destination
    try { srcRef.current.disconnect(); } catch { /* ignore */ }
    srcRef.current.connect(bassRef.current);
    bassRef.current.connect(midRef.current);
    midRef.current.connect(trebleRef.current);
    trebleRef.current.connect(ac.destination);

    return { audio, ac };
  }, [ensureAudio, eq.bass, eq.mid, eq.treble]);

  // Update progress
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setProgress(audio.currentTime / audio.duration);
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentSong]);

  // Set EQ values
  const setEQ = useCallback((next: Partial<EQ>) => {
    setEqState((prev) => {
      const merged = { ...prev, ...next };
      if (bassRef.current) bassRef.current.gain.value = merged.bass;
      if (midRef.current) midRef.current.gain.value = merged.mid;
      if (trebleRef.current) trebleRef.current.gain.value = merged.treble;
      return merged;
    });
  }, []);

  // ✅ Safe play that ignores AbortError
  const safePlay = useCallback(async () => {
    try {
      await audioRef.current!.play();
      setIsPlaying(true);
    } catch (e) {
      // AbortError is normal when play is interrupted by pause/src change
      if (e instanceof Error && e.name === "AbortError") return;
      setIsPlaying(false);
      throw e;
    }
  }, []);

  // Play a song with anti-race token
  const playSong = useCallback(async (song: Song) => {
    if (!song?.audioUrl) {
      console.error("❌ Song sin audioUrl:", song);
      return; // No lanzar error, solo retornar
    }

    // Validar URL
    const urlStr = song.audioUrl.toLowerCase();
    if (urlStr.includes('example.com') || !urlStr.startsWith('http')) {
      console.error("❌ URL inválida:", song.audioUrl);
      return;
    }

    // ✅ Token anti-race: si otro playSong se llama, este se aborta
    const token = ++playTokenRef.current;

    console.log("🎵 PlayerContext: Playing", song.title, "| URL:", song.audioUrl);

    try {
      const { audio, ac } = ensureGraph();
      await ac.resume();

      setCurrentSong(song);
      audio.src = song.audioUrl;
      audio.load(); // ✅ Important: reset audio state before playing

      // ✅ Si otro playSong fue llamado mientras tanto, abortar este
      if (token !== playTokenRef.current) {
        console.log("⏭️ Play aborted (newer request)");
        return;
      }

      await safePlay();
    } catch (e) {
      console.error("❌ Error playing song:", e);
      // No re-lanzar el error para no crashear la UI
    }
  }, [ensureGraph, safePlay]);

  // Toggle play/pause
  const togglePlayPause = useCallback(async () => {
    const audio = ensureAudio();
    
    if (audio.paused) {
      if (acRef.current) await acRef.current.resume();
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (e) {
        if (e instanceof Error && e.name !== "AbortError") {
          console.error("❌ Toggle play error:", e);
        }
      }
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, [ensureAudio]);

  // Seek to position
  const seek = useCallback((position: number) => {
    const audio = audioRef.current;
    if (audio && audio.duration && !isNaN(audio.duration)) {
      audio.currentTime = position * audio.duration;
    }
  }, []);

  const value = useMemo(
    () => ({
      currentSong,
      isPlaying,
      progress,
      duration,
      eq,
      playSong,
      togglePlayPause,
      seek,
      setEQ,
      showNowPlaying,
      setShowNowPlaying,
    }),
    [currentSong, isPlaying, progress, duration, eq, playSong, togglePlayPause, seek, setEQ, showNowPlaying],
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
};
