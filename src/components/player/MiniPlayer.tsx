import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IonIcon } from '@ionic/react';
import {
    play,
    pause,
    playSkipForward,
    playSkipBack,
    closeOutline,
    chevronDownOutline
} from 'ionicons/icons';
import { usePlayer } from '../../contexts/PlayerContext';
import { DEFAULT_COVER_IMAGE } from '../../config/constants';
import { audioService } from '../../services/audio.service';
import './MiniPlayer.css';

interface MiniPlayerProps {
    onExpand: () => void;
    isVisible: boolean;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({ onExpand, isVisible }) => {
    const { currentSong, isPlaying, togglePlayPause, progress } = usePlayer();
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    // No necesitamos onTimeUpdate ya que usePlayer proporciona progress
    useEffect(() => {
        if (currentSong) {
            setDuration(currentSong.duration || 0);
        }
    }, [currentSong]);

    const handlePlayPause = (e: React.MouseEvent) => {
        e.stopPropagation();
        togglePlayPause();
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = x / rect.width;
        audioService.seek(percentage);
    };

    if (!isVisible || !currentSong) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="mini-player glass"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={onExpand}
            >
                {/* Progress bar */}
                <div className="mini-player-progress" onClick={handleSeek}>
                    <motion.div
                        className="mini-player-progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress * 100}%` }}
                        transition={{ duration: 0.1 }}
                    />
                </div>

                {/* Content */}
                <div className="mini-player-content">
                    {/* Cover */}
                    <motion.div
                        className="mini-player-cover"
                        layoutId={`cover-${currentSong.id}`}
                    >
                        <img
                            src={currentSong.coverUrl || DEFAULT_COVER_IMAGE}
                            alt={currentSong.title}
                        />
                    </motion.div>

                    {/* Info */}
                    <div className="mini-player-info">
                        <h4 className="mini-player-title">{currentSong.title}</h4>
                        <p className="mini-player-artist">{currentSong.artist}</p>
                    </div>

                    {/* Controls */}
                    <div className="mini-player-controls">
                        <button className="mini-player-btn" onClick={handlePlayPause}>
                            <IonIcon icon={isPlaying ? pause : play} />
                        </button>
                        <button className="mini-player-btn mini-player-btn-close">
                            <IonIcon icon={closeOutline} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
