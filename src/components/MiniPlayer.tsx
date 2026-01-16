import React, { useState } from 'react';
import { IonIcon, IonProgressBar } from '@ionic/react';
import { play, pause, heart, heartOutline } from 'ionicons/icons';
import { useMusic } from '../contexts/MusicContext';
import PlayerModal from './PlayerModal';
import './MiniPlayer.css';

const MiniPlayer: React.FC = () => {
    const { currentTrack, isPlaying, togglePlay, progress } = useMusic();
    const [showFullPlayer, setShowFullPlayer] = useState(false);
    const [isLiked, setIsLiked] = useState(false); // Demo state

    if (!currentTrack) return null;

    return (
        <>
            <div className="mini-player-container">
                <div className="mini-player-content" onClick={() => setShowFullPlayer(true)}>
                    {/* Progress Bar Top */}
                    <div className="mini-progress-bar">
                        <div
                            className="mini-progress-fill"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>

                    <div className="mini-player-info">
                        <div className="mini-cover">
                            <img src={currentTrack.cover} alt={currentTrack.title} />
                        </div>
                        <div className="mini-text">
                            <span className="mini-title">{currentTrack.title}</span>
                            <span className="mini-artist">{currentTrack.artist}</span>
                        </div>
                    </div>

                    <div className="mini-controls">
                        <div
                            className={`mini-control-icon favorite-icon ${isLiked ? 'active' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsLiked(!isLiked);
                            }}
                        >
                            <IonIcon icon={isLiked ? heart : heartOutline} />
                        </div>
                        <div className="mini-control-icon play-icon" onClick={(e) => {
                            e.stopPropagation();
                            togglePlay();
                        }}>
                            <IonIcon icon={isPlaying ? pause : play} />
                        </div>
                    </div>
                </div>
            </div>

            <PlayerModal
                isOpen={showFullPlayer}
                onClose={() => setShowFullPlayer(false)}
            />
        </>
    );
};

export default MiniPlayer;
