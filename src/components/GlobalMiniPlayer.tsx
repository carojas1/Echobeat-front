import React from 'react';
import { IonIcon } from '@ionic/react';
import { play, pause } from 'ionicons/icons';
import { usePlayer } from '../contexts/PlayerContext';
import { DEFAULT_COVER_IMAGE } from '../config/constants';
import './GlobalMiniPlayer.css';

export const GlobalMiniPlayer: React.FC = () => {
    const { currentSong, isPlaying, progress, togglePlayPause, setShowNowPlaying } = usePlayer();

    if (!currentSong) return null;

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="global-mini-player glass" onClick={() => setShowNowPlaying(true)}>
            {/* Progress Bar */}
            <div className="mini-progress-bar">
                <div
                    className="mini-progress-fill"
                    style={{ width: `${progress * 100}%` }}
                />
            </div>

            {/* Content */}
            <div className="mini-player-content">
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

                {/* Controls */}
                <button
                    className="mini-play-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        togglePlayPause();
                    }}
                >
                    <IonIcon icon={isPlaying ? pause : play} />
                </button>
            </div>
        </div>
    );
};
