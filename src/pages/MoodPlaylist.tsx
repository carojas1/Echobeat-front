import React from 'react';
import { IonContent, IonPage, IonIcon, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle } from '@ionic/react';
import { play, pause } from 'ionicons/icons';
import { useParams } from 'react-router-dom';
import { useMusic } from '../contexts/MusicContext';
import { mockMoodPlaylists } from '../data/mockMusic';
import './MoodPlaylist.css';

const moodInfo: { [key: string]: { name: string; color: string } } = {
    'feliz': { name: 'Feliz', color: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' },
    'triste': { name: 'Triste', color: 'linear-gradient(135deg, #4169E1 0%, #1E3A8A 100%)' },
    'energetico': { name: 'Energético', color: 'linear-gradient(135deg, #FF1744 0%, #D50000 100%)' },
    'relajado': { name: 'Relajado', color: 'linear-gradient(135deg, #00BFA5 0%, #00796B 100%)' },
    'fiesta': { name: 'Fiesta', color: 'linear-gradient(135deg, #9A00FF 0%, #4B2E83 100%)' },
    'concentracion': { name: 'Concentración', color: 'linear-gradient(135deg, #607D8B 0%, #37474F 100%)' },
    'romantico': { name: 'Romántico', color: 'linear-gradient(135deg, #FF4081 0%, #C2185B 100%)' },
    'chill': { name: 'Chill', color: 'linear-gradient(135deg, #C7A7FF 0%, #9A00FF 100%)' }
};

const MoodPlaylist: React.FC = () => {
    const { moodId } = useParams<{ moodId: string }>();
    const { playTrack, currentTrack, isPlaying, togglePlay, playPlaylist } = useMusic();

    // Get tracks for this mood from our mock source
    const tracks = mockMoodPlaylists[moodId];
    const moodDetails = moodInfo[moodId];

    if (!moodDetails || !tracks) {
        return (
            <IonPage>
                <IonContent>
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                        <h2>Mood no encontrado</h2>
                    </div>
                </IonContent>
            </IonPage>
        );
    }

    const handlePlayPlaylist = () => {
        if (tracks.length > 0) {
            playPlaylist(tracks);
        }
    };

    const handlePlayTrack = (track: any) => {
        if (currentTrack?.id === track.id) {
            togglePlay();
        } else {
            const trackIndex = tracks.findIndex((t: any) => t.id === track.id);
            if (trackIndex !== -1) {
                playPlaylist(tracks, trackIndex);
            }
        }
    };

    return (
        <IonPage>
            <IonHeader className="mood-header-transparent">
                <IonToolbar className="mood-toolbar">
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/main/mood" color="light" />
                    </IonButtons>
                    <IonTitle>{moodDetails.name}</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <div className="mood-playlist-container">
                    {/* Mood Header */}
                    <div className="mood-hero" style={{ background: moodDetails.color }}>
                        <h1 className="mood-title">{moodDetails.name}</h1>
                        <p className="mood-subtitle">{tracks.length} canciones seleccionadas</p>
                    </div>

                    {/* Play Button */}
                    <div className="mood-actions">
                        <button className="play-button-large" onClick={handlePlayPlaylist}>
                            <IonIcon icon={play} />
                            <span>Reproducir</span>
                        </button>
                    </div>

                    {/* Track List */}
                    <div className="mood-track-list">
                        {tracks.map((track, index) => {
                            const isCurrentTrack = currentTrack?.id === track.id;

                            return (
                                <div
                                    key={track.id}
                                    className={`mood-track-item ${isCurrentTrack ? 'active' : ''}`}
                                    onClick={() => handlePlayTrack(track)}
                                >
                                    <div className="track-number">
                                        {isCurrentTrack && isPlaying ? (
                                            <IonIcon icon={play} className="playing-icon" />
                                        ) : (
                                            index + 1
                                        )}
                                    </div>
                                    <div className="track-cover">
                                        <img src={track.cover} alt={track.album} />
                                    </div>
                                    <div className="track-info">
                                        <h4 className={`track-title ${isCurrentTrack ? 'highlight' : ''}`}>{track.title}</h4>
                                        <p className="track-artist">{track.artist}</p>
                                    </div>
                                    <div className="track-duration">
                                        {isCurrentTrack ? 'Reproduciendo' : track.duration}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default MoodPlaylist;
