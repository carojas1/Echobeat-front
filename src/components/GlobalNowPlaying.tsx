import React, { useState, useCallback, useRef, useEffect } from 'react';
import { IonIcon } from '@ionic/react';
import {
    close,
    play,
    pause,
    playSkipForward,
    playSkipBack,
    heart,
    heartOutline,
    micOffOutline,
    cloudDownload
} from 'ionicons/icons';
import { usePlayer } from '../contexts/PlayerContext';
import { DEFAULT_COVER_IMAGE } from '../config/constants';
import './GlobalNowPlaying.css';
// ✅ Componente de EQ estable con Sliders y Vocal Remover
const StableEqualizer: React.FC<{ visible: boolean }> = React.memo(({ visible }) => {
    const { eq, setEQ } = usePlayer();
    const [active, setActive] = useState<string>('flat');

    // Safe setter with error handling
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const safeSetEQ = useCallback((settings: any) => {
        try {
            setEQ(settings);
        } catch (e) {
            console.error("EQ Error:", e);
        }
    }, [setEQ]);

    const apply = useCallback((name: string, bass: number, mid: number, treble: number) => {
        // Karaoke uses specific Q logic handled by API, just pass preset name for tracking if needed
        // but audio.service logic uses the values passed here. 
        // Wait, setEQ in context calls audioService.setEQ.
        // If I want to use the 'midQ', I need to pass it.
        // But the previous implementation hardcoded values.
        
        // For Karaoke (No Vocals), we use the special values:
        if (name === 'karaoke') {
             safeSetEQ({ bass, mid, treble, midQ: 0.1, preset: 'karaoke' });
        } else {
             safeSetEQ({ bass, mid, treble, midQ: 1, preset: name });
        }
        setActive(name);
    }, [safeSetEQ]);

    const handleSlider = useCallback((type: 'bass' | 'mid' | 'treble', val: number) => {
        safeSetEQ({ [type]: val, midQ: active === 'karaoke' ? 0.1 : 1 });
        if (active !== 'karaoke') setActive('custom');
    }, [safeSetEQ, active]);

    // if (!visible) return null; // ❌ Removed to prevent crash: Always mount, hide with CSS

    return (
        <div 
            className="eq-container-stable" 
            onClick={(e) => e.stopPropagation()}
            style={{ display: visible ? 'block' : 'none' }}
        >
            <div className="eq-header-section">
                <span className="eq-title">🎛️ Mezclador Pro</span>
                <button 
                    className="eq-reset-btn-small"
                    onClick={() => apply('flat', 0, 0, 0)}
                >
                    Reset
                </button>
            </div>

            {/* Presets Rápidos */}
            <div className="eq-presets-grid-scroll">
                <button 
                    className={active === 'flat' ? 'eq-p-btn active' : 'eq-p-btn'} 
                    onClick={() => apply('flat', 0, 0, 0)}
                >Normal</button>
                <button 
                    className={active === 'bass' ? 'eq-p-btn active' : 'eq-p-btn'} 
                    onClick={() => apply('bass', 8, 0, -2)}
                >Bass+</button>
                <button 
                    className={active === 'rock' ? 'eq-p-btn active' : 'eq-p-btn'} 
                    onClick={() => apply('rock', 6, -1, 5)}
                >Rock</button>
                <button 
                    className={active === 'pop' ? 'eq-p-btn active' : 'eq-p-btn'} 
                    onClick={() => apply('pop', 3, 4, 2)}
                >Pop</button>
                <button 
                    className={active === 'karaoke' ? 'eq-p-btn active special' : 'eq-p-btn special'} 
                    onClick={() => apply('karaoke', 4, -40, 4)}
                >
                   <IonIcon icon={micOffOutline} style={{ marginRight: 4, verticalAlign: 'middle', fontSize: 16 }} />
                   No Vocals
                </button>
            </div>

            {/* Sliders Profesionales */}
            <div className="eq-sliders-vertical-container">
                <div className="eq-slider-col">
                    <div className="slider-track-container">
                        <input
                            type="range"
                            min="-40"
                            max="12"
                            step="1"
                            value={eq.bass || 0}
                            onChange={(e) => handleSlider('bass', parseInt(e.target.value))}
                            className="eq-vertical-slider"
                        />
                        <div className="slider-fill" style={{ height: `${((eq.bass || 0) + 40) * 1.92}%` }}></div>
                    </div>
                    <span className="slider-label">Bajos</span>
                    <span className="slider-val">{`${(eq.bass || 0) > 0 ? '+' : ''}${eq.bass || 0}`}</span>
                </div>

                <div className="eq-slider-col">
                    <div className="slider-track-container">
                        <input
                            type="range"
                            min="-40"
                            max="12"
                            step="1"
                            value={eq.mid || 0}
                            onChange={(e) => handleSlider('mid', parseInt(e.target.value))}
                            className="eq-vertical-slider"
                        />
                         <div className="slider-fill" style={{ height: `${((eq.mid || 0) + 40) * 1.92}%` }}></div>
                    </div>
                    <span className="slider-label">Medios</span>
                    <span className="slider-val">{`${(eq.mid || 0) > 0 ? '+' : ''}${eq.mid || 0}`}</span>
                </div>

                <div className="eq-slider-col">
                    <div className="slider-track-container">
                        <input
                            type="range"
                            min="-40"
                            max="12"
                            step="1"
                            value={eq.treble || 0}
                            onChange={(e) => handleSlider('treble', parseInt(e.target.value))}
                            className="eq-vertical-slider"
                        />
                         <div className="slider-fill" style={{ height: `${((eq.treble || 0) + 40) * 1.92}%` }}></div>
                    </div>
                    <span className="slider-label">Altos</span>
                    <span className="slider-val">{`${(eq.treble || 0) > 0 ? '+' : ''}${eq.treble || 0}`}</span>
                </div>
            </div>
        </div>
    );
});


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
    const [showEQ, setShowEQ] = useState(false); // Por defecto cerrado
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

    // Scroll inteligente cuando se abre el EQ
    useEffect(() => {
        if (showEQ && containerRef.current) {
            setTimeout(() => {
                const eqEl = containerRef.current?.querySelector('.eq-container-stable');
                eqEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }, [showEQ]);

    if (!currentSong) return null;

    const coverUrl = currentSong.coverUrl || DEFAULT_COVER_IMAGE;

    // ⚡️ NUCLEAR FIX: Custom Overlay instead of IonModal to prevent crashes
    return (
        <div 
            className="now-playing-overlay"
            style={{ 
                display: showNowPlaying ? 'block' : 'none',
                position: 'fixed',
                top: 0, 
                left: 0, 
                right: 0, 
                bottom: 0, 
                zIndex: 99999,
                background: '#090909' // Dark background matching app theme
            }}
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
                    <div className="now-playing-actions">
                        <button
                            className="download-btn"
                            onClick={() => window.open(currentSong.audioUrl, '_blank')}
                            title="Descargar canción"
                        >
                            <IonIcon icon={cloudDownload} />
                        </button>
                        <button
                            className="favorite-btn"
                            onClick={() => setIsFavorite(!isFavorite)}
                        >
                            <IonIcon icon={isFavorite ? heart : heartOutline} />
                        </button>
                    </div>
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

                {/* EQ Estable siempre montado */}
                <StableEqualizer visible={showEQ} />

                <button 
                    className="eq-toggle-bottom"
                    onClick={() => setShowEQ(!showEQ)}
                >
                    {showEQ ? '🔻 Ocultar Controles' : '🎛️ Abrir Ecualizador'}
                </button>
            </div>
        </div>
    );
};
