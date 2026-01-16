import React from 'react';
import { IonContent, IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonIcon } from '@ionic/react';
import { play, pause, heart, ellipsisHorizontal, time } from 'ionicons/icons';
import { useParams } from 'react-router-dom';
import { useMusic } from '../contexts/MusicContext';
import { mockAlbums } from '../data/mockMusic';
import './AlbumDetail.css';

const AlbumDetail: React.FC = () => {
    const { albumId } = useParams<{ albumId: string }>();
    const { playTrack, currentTrack, isPlaying, togglePlay, playPlaylist } = useMusic();

    // Get album data from our mock source
    const albumData = mockAlbums[albumId];

    if (!albumData) {
        return (
            <IonPage>
                <IonContent>
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                        <h2>Álbum no encontrado</h2>
                    </div>
                </IonContent>
            </IonPage>
        );
    }

    const { album, tracks } = albumData;

    const totalDuration = tracks.reduce((acc: number, track: any) => acc + track.durationMs, 0);
    const hours = Math.floor(totalDuration / 3600000);
    const minutes = Math.floor((totalDuration % 3600000) / 60000);
    const durationText = hours > 0 ? `${hours} h ${minutes} min` : `${minutes} min`;

    const handlePlayAlbum = () => {
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
            <IonHeader className="album-header-transparent">
                <IonToolbar className="album-toolbar">
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/main/home" color="light" />
                    </IonButtons>
                    <IonButtons slot="end">
                        <IonIcon icon={ellipsisHorizontal} className="header-icon" />
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <div className="album-detail-container">
                    {/* Album Header */}
                    <div className="album-hero">
                        <div className="album-cover-large">
                            <img src={album.cover} alt={album.name} />
                        </div>
                        <div className="album-info-main">
                            <h1 className="album-title">{album.name}</h1>
                            <p className="album-artist">{album.artist}</p>
                            <div className="album-meta">
                                <span>{album.year}</span>
                                <span className="separator">•</span>
                                <span>{tracks.length} canciones</span>
                                <span className="separator">•</span>
                                <span>{durationText}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="album-actions">
                        <button className="play-button-large" onClick={handlePlayAlbum}>
                            <IonIcon icon={isPlaying && currentTrack?.album === album.name ? pause : play} />
                            <span>{isPlaying && currentTrack?.album === album.name ? 'Pausar' : 'Reproducir'}</span>
                        </button>
                        <button className="icon-button">
                            <IonIcon icon={heart} />
                        </button>
                    </div>

                    {/* Track List */}
                    <div className="track-list">
                        {tracks.map((track: any, index: number) => {
                            const isCurrentTrack = currentTrack?.id === track.id;

                            return (
                                <div
                                    key={track.id}
                                    className={`track-item ${isCurrentTrack ? 'active' : ''}`}
                                    onClick={() => handlePlayTrack(track)}
                                >
                                    <div className="track-number">
                                        {isCurrentTrack && isPlaying ? (
                                            <IonIcon icon={play} className="playing-icon" />
                                        ) : (
                                            index + 1
                                        )}
                                    </div>
                                    <div className="track-info">
                                        <h4 className={`track-title ${isCurrentTrack ? 'highlight' : ''}`}>
                                            {track.title}
                                            {track.explicit && <span className="explicit-badge">E</span>}
                                        </h4>
                                        <p className="track-artist">{track.artist}</p>
                                    </div>
                                    <div className="track-duration">
                                        {isCurrentTrack ? (
                                            <span className="playing-text">Reproduciendo</span>
                                        ) : (
                                            <>
                                                <IonIcon icon={time} className="duration-icon" />
                                                {track.duration}
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Album Footer */}
                    <div className="album-footer">
                        <p className="album-date">{album.year}</p>
                        <p className="album-copyright">℗ {album.year} Cactus Jack Records</p>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default AlbumDetail;
