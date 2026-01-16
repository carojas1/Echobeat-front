import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

interface Track {
    id: string | number; // Support both for flexibility
    title: string;
    artist: string;
    album?: string;
    cover: string;
    previewUrl: string | null;
    duration: string;
    durationMs?: number;
    explicit?: boolean;
}

interface MusicContextType {
    currentTrack: Track | null;
    isPlaying: boolean;
    progress: number;
    volume: number;
    playTrack: (track: Track) => void;
    playPlaylist: (tracks: Track[], startIndex?: number) => void;
    togglePlay: () => void;
    setVolume: (volume: number) => void;
    seekTo: (time: number) => void;
    nextTrack: () => void;
    prevTrack: () => void;
    queue: Track[];
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [queue, setQueue] = useState<Track[]>([]);
    const [queueIndex, setQueueIndex] = useState<number>(-1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolumeState] = useState(0.7);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Refs for accessing latest state inside event listeners
    const queueRef = useRef<Track[]>([]);
    const queueIndexRef = useRef<number>(-1);

    useEffect(() => {
        queueRef.current = queue;
        queueIndexRef.current = queueIndex;
    }, [queue, queueIndex]);

    useEffect(() => {
        // Create audio element
        audioRef.current = new Audio();
        audioRef.current.volume = volume;

        // Update progress
        const updateProgress = () => {
            if (audioRef.current) {
                const current = audioRef.current.currentTime;
                const duration = audioRef.current.duration;
                if (!isNaN(duration) && duration > 0) {
                    setProgress((current / duration) * 100);
                }
            }
        };

        const handleEnded = () => {
            handleNextTrackAuto();
        };

        audioRef.current.addEventListener('timeupdate', updateProgress);
        audioRef.current.addEventListener('ended', handleEnded);

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.removeEventListener('timeupdate', updateProgress);
                audioRef.current.removeEventListener('ended', handleEnded);
            }
        };
    }, []);

    const playTrack = (track: Track) => {
        if (!track.previewUrl) {
            console.warn('No preview URL available for this track');
            return;
        }
        setQueue([track]);
        setQueueIndex(0);
        loadAndPlay(track);
    };

    const playPlaylist = (tracks: Track[], startIndex: number = 0) => {
        if (tracks.length === 0) return;
        setQueue(tracks);
        setQueueIndex(startIndex);
        loadAndPlay(tracks[startIndex]);
    };

    const loadAndPlay = (track: Track) => {
        if (!track.previewUrl) return;

        // Ensure id is consistent
        const consistentTrack = { ...track };
        setCurrentTrack(consistentTrack);

        if (audioRef.current) {
            audioRef.current.src = track.previewUrl;
            audioRef.current.load();
            const playPromise = audioRef.current.play();

            if (playPromise !== undefined) {
                playPromise
                    .then(() => setIsPlaying(true))
                    .catch(e => console.error("Playback error:", e));
            }
        }
    };

    const togglePlay = () => {
        if (!audioRef.current || !currentTrack) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const setVolume = (newVolume: number) => {
        setVolumeState(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    const seekTo = (percentage: number) => {
        if (audioRef.current && currentTrack) {
            const time = (percentage / 100) * audioRef.current.duration;
            audioRef.current.currentTime = time;
            setProgress(percentage);
        }
    };

    const nextTrack = () => {
        if (queueIndex < queue.length - 1) {
            const newIndex = queueIndex + 1;
            setQueueIndex(newIndex);
            loadAndPlay(queue[newIndex]);
        }
    };

    const prevTrack = () => {
        // If playing more than 3 seconds, restart track
        if (audioRef.current && audioRef.current.currentTime > 3) {
            audioRef.current.currentTime = 0;
            return;
        }

        if (queueIndex > 0) {
            const newIndex = queueIndex - 1;
            setQueueIndex(newIndex);
            loadAndPlay(queue[newIndex]);
        }
    };

    const handleNextTrackAuto = () => {
        const currentQ = queueRef.current;
        const currentIdx = queueIndexRef.current;

        if (currentIdx < currentQ.length - 1) {
            const newIndex = currentIdx + 1;
            setQueueIndex(newIndex);

            const track = currentQ[newIndex];
            if (audioRef.current && track.previewUrl) {
                setCurrentTrack(track);
                audioRef.current.src = track.previewUrl;
                audioRef.current.load();
                audioRef.current.play()
                    .then(() => setIsPlaying(true))
                    .catch(e => console.error("Auto-play error:", e));
            }
        } else {
            setIsPlaying(false);
        }
    };

    return (
        <MusicContext.Provider
            value={{
                currentTrack,
                isPlaying,
                progress,
                volume,
                playTrack,
                playPlaylist,
                togglePlay,
                setVolume,
                seekTo,
                nextTrack,
                prevTrack,
                queue
            }}
        >
            {children}
        </MusicContext.Provider>
    );
};

export const useMusic = () => {
    const context = useContext(MusicContext);
    if (!context) {
        throw new Error('useMusic must be used within MusicProvider');
    }
    return context;
};
