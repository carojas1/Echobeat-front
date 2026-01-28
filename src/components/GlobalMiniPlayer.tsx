import React from 'react';
import { IonIcon } from '@ionic/react';
import { play, pause, close } from 'ionicons/icons';
import { usePlayer } from '../contexts/PlayerContext';
import { DEFAULT_COVER_IMAGE } from '../config/constants';
import './GlobalMiniPlayer.css';

export const GlobalMiniPlayer: React.FC = () => {
    const { currentSong, isPlaying, progress, togglePlayPause, setShowNowPlaying, stopSong } = usePlayer();

    if (!currentSong) return null;

    return (
        <div className="global-mini-player glass">
            {/* Progress Bar */}
            <div className="mini-progress-bar">
                <div
                    className="mini-progress-fill"
                    style={{ width: `${progress * 100}%` }}
                />
            </div>

            {/* Content */}
            <div className="mini-player-content" onClick={() => setShowNowPlaying(true)}>
                {/* Cover */}
                <div className="mini-cover">
                    <img
                        src={currentSong.coverUrl || DEFAULT_COVER_IMAGE}
                        alt={currentSong.title}
                    />
                </div>

                {/* Info */}
                <div className="mini-info">
                    <h4>{currentSong.title}</h4>
                    <p>{currentSong.artist}</p>
                </div>
            </div>

            {/* Controls */}
            <div className="mini-controls">
                <button
                    className="mini-play-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        togglePlayPause();
                    }}
                >
                    <IonIcon icon={isPlaying ? pause : play} />
                </button>
                
                <button
                    className="mini-close-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        stopSong();
                    }}
                >
                    <IonIcon icon={close} />
                </button>
            </div>
        </div>
    );
};
