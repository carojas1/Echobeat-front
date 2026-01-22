import React, { useState } from 'react';
import { IonIcon, IonModal } from '@ionic/react';
import {
    close,
    play,
    pause,
    playSkipForward,
    playSkipBack,
    heart,
    heartOutline,
    musicalNotes
} from 'ionicons/icons';
import { usePlayer } from '../contexts/PlayerContext';
import { DEFAULT_COVER_IMAGE } from '../config/constants';
import './GlobalNowPlaying.css';

export const GlobalNowPlaying: React.FC = () => {
    const {
        currentSong,
        isPlaying,
        progress,
        duration,
        togglePlayPause,
        seek,
        showNowPlaying,
        setShowNowPlaying
    } = usePlayer();

    const [isFavorite, setIsFavorite] = useState(false);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = x / rect.width;
        seek(percentage);
    };

    if (!currentSong) return null;

    return (
        <IonModal
            isOpen={showNowPlaying}
            onDidDismiss={() => setShowNowPlaying(false)}
            className="now-playing-modal"
        >
            <div className="now-playing-page">
                {/* Header */}
                <div className="now-playing-header">
                    <button className="close-btn" onClick={() => setShowNowPlaying(false)}>
                        <IonIcon icon={close} />
                    </button>
                    <h3>Reproduciendo</h3>
                    <div style={{ width: 40 }} />
                </div>

                {/* Cover */}
                <div className="now-playing-cover-container">
                    <div
                        className="now-playing-cover"
                        style={{ backgroundImage: `url(${currentSong.coverUrl || DEFAULT_COVER_IMAGE})` }}
                    >
                        <div className="cover-overlay" />
                    </div>
                </div>

                {/* Song Info */}
                <div className="now-playing-info">
                    <h2>{currentSong.title}</h2>
                    <p>{currentSong.artist}</p>
                    <button
                        className="favorite-btn"
                        onClick={() => setIsFavorite(!isFavorite)}
                    >
                        <IonIcon icon={isFavorite ? heart : heartOutline} />
                    </button>
                </div>

                {/* Progress */}
                <div className="now-playing-progress-section">
                    <div className="progress-bar" onClick={handleSeek}>
                        <div
                            className="progress-fill"
                            style={{ width: `${progress * 100}%` }}
                        />
                        <div
                            className="progress-thumb"
                            style={{ left: `${progress * 100}%` }}
                        />
                    </div>
                    <div className="progress-time">
                        <span>{formatTime(progress * duration)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Controls */}
                <div className="now-playing-controls">
                    <button className="control-btn">
                        <IonIcon icon={playSkipBack} />
                    </button>

                    <button className="play-btn-large" onClick={togglePlayPause}>
                        <IonIcon icon={isPlaying ? pause : play} />
                    </button>

                    <button className="control-btn">
                        <IonIcon icon={playSkipForward} />
                    </button>
                </div>

                {/* EQ Info - simplificado */}
                <div className="eq-toggle-section">
                    <button className="eq-toggle-btn">
                        <IonIcon icon={musicalNotes} />
                        <span>Ecualizador (Próximamente)</span>
                    </button>
                </div>
            </div>
        </IonModal>
    );
};
