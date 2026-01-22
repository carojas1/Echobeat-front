import React, { useState, useCallback, useRef, useEffect } from 'react';
import { IonIcon, IonModal } from '@ionic/react';
import {
    close,
    play,
    pause,
    playSkipForward,
    playSkipBack,
    heart,
    heartOutline
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
        setShowNowPlaying,
        setEQ
    } = usePlayer();

    const [isFavorite, setIsFavorite] = useState(false);
    const [activePreset, setActivePreset] = useState('flat');
    const containerRef = useRef<HTMLDivElement>(null);

    const formatTime = useCallback((seconds: number) => {
        if (!seconds || isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return mins + ':' + secs.toString().padStart(2, '0');
    }, []);

    const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = x / rect.width;
        seek(percentage);
    }, [seek]);

    const applyPreset = useCallback((name: string, bass: number, mid: number, treble: number) => {
        setEQ({ bass, mid, treble });
        setActivePreset(name);
    }, [setEQ]);

    useEffect(() => {
        if (showNowPlaying && containerRef.current) {
            containerRef.current.scrollTo({ top: 0 });
        }
    }, [showNowPlaying]);

    if (!currentSong) return null;

    const coverUrl = currentSong.coverUrl || DEFAULT_COVER_IMAGE;

    return (
        <IonModal
            isOpen={showNowPlaying}
            onDidDismiss={() => setShowNowPlaying(false)}
            className="now-playing-modal"
            keepContentsMounted={true}
        >
            <div className="now-playing-page" ref={containerRef}>
                <div className="now-playing-header">
                    <button className="close-btn" onClick={() => setShowNowPlaying(false)}>
                        <IonIcon icon={close} />
                    </button>
                    <h3>REPRODUCIENDO</h3>
                    <div style={{ width: 40 }}></div>
                </div>

                <div className="now-playing-cover-container">
                    <div
                        className="now-playing-cover"
                        style={{ backgroundImage: 'url(' + coverUrl + ')' }}
                    >
                        <div className="cover-overlay"></div>
                    </div>
                </div>

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

                <div className="now-playing-progress-section">
                    <div className="progress-bar" onClick={handleSeek}>
                        <div 
                            className="progress-fill" 
                            style={{ width: (progress * 100) + '%' }}
                        ></div>
                        <div 
                            className="progress-thumb" 
                            style={{ left: (progress * 100) + '%' }}
                        ></div>
                    </div>
                    <div className="progress-time">
                        <span>{formatTime(progress * duration)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

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

                {/* EQ con solo presets - NO sliders */}
                <div className="eq-presets-final">
                    <span className="eq-label">Ecualizador:</span>
                    <div className="eq-buttons">
                        <button 
                            className={activePreset === 'flat' ? 'eq-btn-final active' : 'eq-btn-final'}
                            onClick={() => applyPreset('flat', 0, 0, 0)}
                        >Normal</button>
                        <button 
                            className={activePreset === 'bass' ? 'eq-btn-final active' : 'eq-btn-final'}
                            onClick={() => applyPreset('bass', 8, 0, -2)}
                        >Bass+</button>
                        <button 
                            className={activePreset === 'rock' ? 'eq-btn-final active' : 'eq-btn-final'}
                            onClick={() => applyPreset('rock', 6, -1, 5)}
                        >Rock</button>
                        <button 
                            className={activePreset === 'pop' ? 'eq-btn-final active' : 'eq-btn-final'}
                            onClick={() => applyPreset('pop', 3, 4, 2)}
                        >Pop</button>
                    </div>
                </div>
            </div>
        </IonModal>
    );
};
