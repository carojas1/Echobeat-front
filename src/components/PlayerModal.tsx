import React, { useRef, useState, useEffect } from 'react';
import { IonModal, IonIcon, IonContent, IonRange, IonButton } from '@ionic/react';
import { chevronDown, play, pause, playSkipBack, playSkipForward, volumeHigh, heart, heartOutline, shareSocialOutline, listOutline, shuffle } from 'ionicons/icons';
import { useMusic } from '../contexts/MusicContext';
import './PlayerModal.css';

interface PlayerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PlayerModal: React.FC<PlayerModalProps> = ({ isOpen, onClose }) => {
    const { currentTrack, isPlaying, togglePlay, progress, seekTo, nextTrack, prevTrack } = useMusic();
    const [localProgress, setLocalProgress] = useState<number | null>(null);
    const [isLiked, setIsLiked] = useState(false); // Local state for demo

    if (!currentTrack) return null;

    const handleSeekChange = (e: any) => {
        setLocalProgress(e.detail.value as number);
    };

    const handleSeekEnd = (e: any) => {
        seekTo(e.detail.value as number);
        setLocalProgress(null);
    };

    const currentProgress = localProgress !== null ? localProgress : progress;

    // Helper to format time
    const formatTime = (seconds: number) => {
        if (!seconds || isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // Estimate current time based on progress percentage and duration string (if available)
    // Note: Ideally Track interface should have duration in seconds. 
    // For now, valid for the demo if duration is consistent.
    // We'll use a placeholder or calculate if durationMs exists.
    const durationSec = currentTrack.durationMs ? currentTrack.durationMs / 1000 : 180; // Default 3 mins
    const currentTimeSec = (currentProgress / 100) * durationSec;

    return (
        <IonModal isOpen={isOpen} onDidDismiss={onClose} className="full-screen-player-modal">
            <IonContent className="player-content-dark">
                {/* Header with dismiss button */}
                <div className="player-header">
                    <button className="header-button" onClick={onClose}>
                        <IonIcon icon={chevronDown} />
                    </button>
                    <div className="header-title">
                        <span>REPRODUCIENDO DESDE ÁLBUM</span>
                        <strong>{currentTrack.album || 'Unknown Album'}</strong>
                    </div>
                    <button className="header-button">
                        <IonIcon icon={listOutline} />
                    </button>
                </div>

                {/* Main Content */}
                <div className="player-body">
                    <div className="player-artwork-container">
                        <img src={currentTrack.cover} alt={currentTrack.title} className="player-artwork-large" />
                    </div>

                    <div className="player-track-info">
                        <div className="track-text">
                            <h2 className="track-title-large">{currentTrack.title}</h2>
                            <p className="track-artist-large">{currentTrack.artist}</p>
                        </div>
                        <div
                            className={`track-like ${isLiked ? 'liked' : ''}`}
                            onClick={() => setIsLiked(!isLiked)}
                        >
                            <IonIcon icon={isLiked ? heart : heartOutline} />
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="player-progress-container">
                        <IonRange
                            min={0}
                            max={100}
                            value={currentProgress}
                            onIonChange={handleSeekChange}
                            onIonKnobMoveEnd={handleSeekEnd}
                            mode="md"
                        ></IonRange>
                        <div className="time-labels">
                            <span>{formatTime(currentTimeSec)}</span>
                            <span>{currentTrack.duration}</span>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="player-controls-large">
                        <div className="control-button-secondary">
                            <IonIcon icon={shuffle} />
                        </div>
                        <div className="control-button-prev" onClick={prevTrack}>
                            <IonIcon icon={playSkipBack} />
                        </div>
                        <div className="control-button-play-large" onClick={(e) => {
                            e.stopPropagation();
                            togglePlay();
                        }}>
                            <IonIcon icon={isPlaying ? pause : play} />
                        </div>
                        <div className="control-button-next" onClick={nextTrack}>
                            <IonIcon icon={playSkipForward} />
                        </div>
                        <div className="control-button-secondary">
                            <IonIcon icon={shareSocialOutline} />
                        </div>
                    </div>
                </div>
            </IonContent>
        </IonModal>
    );
};

export default PlayerModal;
