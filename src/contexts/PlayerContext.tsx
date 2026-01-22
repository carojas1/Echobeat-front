import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { audioService, Song } from '../services/audio.service';

interface PlayerContextType {
    currentSong: Song | null;
    isPlaying: boolean;
    progress: number;
    duration: number;
    playSong: (song: Song) => void;
    togglePlayPause: () => void;
    seek: (position: number) => void;
    showNowPlaying: boolean;
    setShowNowPlaying: (show: boolean) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showNowPlaying, setShowNowPlaying] = useState(false);
    
    // CRITICAL: Track if component is mounted to prevent state updates after unmount
    const isMountedRef = useRef(true);

    useEffect(() => {
        // Set mounted flag
        isMountedRef.current = true;
        
        // Actualizar tiempo cada segundo
        const interval = setInterval(() => {
            // ONLY update state if component is still mounted
            if (isMountedRef.current && isPlaying) {
                const current = audioService.getCurrentTime();
                const dur = audioService.getDuration();
                setProgress(current / dur || 0);
                setDuration(dur);
            }
        }, 1000);

        // Cleanup: clear interval and mark as unmounted
        return () => {
            isMountedRef.current = false;
            clearInterval(interval);
        };
    }, [isPlaying]);

    const playSong = async (song: Song) => {
        try {
            await audioService.play(song);
            setCurrentSong(song);
            setIsPlaying(true);
        } catch (error) {
            console.error('Error playing song:', error);
        }
    };

    const togglePlayPause = () => {
        audioService.togglePlayPause();
        setIsPlaying(!isPlaying);
    };

    const seek = (position: number) => {
        audioService.seek(position);
    };

    return (
        <PlayerContext.Provider
            value={{
                currentSong,
                isPlaying,
                progress,
                duration,
                playSong,
                togglePlayPause,
                seek,
                showNowPlaying,
                setShowNowPlaying
            }}
        >
            {children}
        </PlayerContext.Provider>
    );
};

export const usePlayer = () => {
    const context = useContext(PlayerContext);
    if (!context) {
        throw new Error('usePlayer must be used within PlayerProvider');
    }
    return context;
};
