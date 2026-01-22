import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IonIcon } from '@ionic/react';
import {
    chevronDownOutline,
    play,
    pause,
    playSkipBack,
    playSkipForward,
    shuffle,
    repeat,
    heartOutline,
    heart,
    ellipsisHorizontal,
    statsChartOutline
} from 'ionicons/icons';
import { audioService } from '../../services/audio.service';
import { DEFAULT_COVER_IMAGE } from '../../config/constants';
import EqualizerConsole from './EqualizerConsole';
import './NowPlaying.css';

interface NowPlayingProps {
    onClose: () => void;
    isOpen: boolean;
}

export const NowPlaying: React.FC<NowPlayingProps> = ({ onClose, isOpen }) => {
    const [isPlaying, setIsPlaying] = useState(audioService.getIsPlaying());
    const [isFavorite, setIsFavorite] = useState(false);
    const [showEQ, setShowEQ] = useState(false);

    const currentSong = audioService.getCurrentSong();

    const handlePlayPause = () => {
        audioService.togglePlayPause();
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = x / rect.width;
        audioService.seek(percentage);
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!isOpen || !currentSong) return null;

    return (
        <motion.div
            className="now-playing"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        >
            {/* Header */}
            <div className="now-playing-header">
                <button className="now-playing-btn" onClick={onClose}>
                    <IonIcon icon={chevronDownOutline} />
                </button>
                <h3 className="now-playing-header-title">Now Playing</h3>
                <button className="now-playing-btn">
                    <IonIcon icon={ellipsisHorizontal} />
                </button>
            </div>

            {/* Cover with parallax effect */}
            <div className="now-playing-cover-container">
                <motion.div
                    className="now-playing-cover"
                    layoutId={`cover-${currentSong.id}`}
                    style={{
                        backgroundImage: `url(${currentSong.coverUrl || DEFAULT_COVER_IMAGE})`,
                    }}
                >
                    <div className="now-playing-cover-overlay"></div>
                </motion.div>
            </div>

            {/* Song info */}
            <div className="now-playing-info">
                <motion.h2
                    className="now-playing-title"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {currentSong.title}
                </motion.h2>
                <motion.p
                    className="now-playing-artist"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                >
                    {currentSong.artist}
                </motion.p>

                <button
                    className="now-playing-favorite"
                    onClick={() => setIsFavorite(!isFavorite)}
                >
                    <IonIcon icon={isFavorite ? heart : heartOutline} />
                </button>
            </div>

            {/* Progress */}
            <div className="now-playing-progress-container">
                <div className="now-playing-progress" onClick={handleSeek}>
                    <motion.div
                        className="now-playing-progress-fill"
                        style={{ width: '0%' }}
                    />
                    <motion.div
                        className="now-playing-progress-thumb"
                        style={{ left: '0%' }}
                    />
                </div>
                <div className="now-playing-time">
                    <span>{formatTime(0)}</span>
                    <span>{formatTime(currentSong?.duration || 0)}</span>
                </div>
            </div>

            {/* Controls */}
            <div className="now-playing-controls">
                <button className="now-playing-control-btn">
                    <IonIcon icon={shuffle} />
                </button>

                <button className="now-playing-control-btn">
                    <IonIcon icon={playSkipBack} />
                </button>

                <button className="now-playing-play-btn" onClick={handlePlayPause}>
                    <IonIcon icon={isPlaying ? pause : play} />
                </button>

                <button className="now-playing-control-btn">
                    <IonIcon icon={playSkipForward} />
                </button>

                <button className="now-playing-control-btn">
                    <IonIcon icon={repeat} />
                </button>
            </div>

            {/* EQ Button */}
            <div className="now-playing-eq-toggle">
                <button
                    className="now-playing-eq-btn"
                    onClick={() => setShowEQ(!showEQ)}
                >
                    <IonIcon icon={statsChartOutline} />
                    {showEQ ? 'Ocultar Ecualizador' : 'Mostrar Ecualizador'}
                </button>
            </div>

            {/* EQ Console */}
            <AnimatePresence mode="wait">
                {showEQ && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <EqualizerConsole />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
