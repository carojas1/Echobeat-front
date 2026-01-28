import React, { useState, useEffect } from 'react';
import { IonContent, IonPage, IonIcon, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonSpinner } from '@ionic/react';
import { play, cloudDownload } from 'ionicons/icons';
import { useParams } from 'react-router-dom';
import { usePlayer } from '../contexts/PlayerContext';
import { DEFAULT_COVER_IMAGE } from '../config/constants';
import { downloadSong } from '../services/download.service';
import './MoodPlaylist.css';

const API_URL = import.meta.env.VITE_API_URL || "https://echobeatback-production.up.railway.app/api/v1";

// Mapeo de moods a info visual - colores oscuros elegantes
const moodInfo: { [key: string]: { name: string; color: string; backendMood: string } } = {
    'feliz': { name: 'Feliz', color: 'linear-gradient(135deg, rgba(252, 211, 77, 0.3) 0%, #1a1a2e 100%)', backendMood: 'happy' },
    'triste': { name: 'Triste', color: 'linear-gradient(135deg, rgba(96, 165, 250, 0.3) 0%, #1a1a2e 100%)', backendMood: 'sad' },
    'energico': { name: 'Enérgico', color: 'linear-gradient(135deg, rgba(244, 114, 182, 0.3) 0%, #1a1a2e 100%)', backendMood: 'energetic' },
    'relajado': { name: 'Relajado', color: 'linear-gradient(135deg, rgba(167, 139, 250, 0.3) 0%, #1a1a2e 100%)', backendMood: 'chill' },
    'enfocado': { name: 'Enfocado', color: 'linear-gradient(135deg, rgba(52, 211, 153, 0.3) 0%, #1a1a2e 100%)', backendMood: 'focus' },
    'romantico': { name: 'Romántico', color: 'linear-gradient(135deg, rgba(251, 113, 133, 0.3) 0%, #1a1a2e 100%)', backendMood: 'romantic' },
    'motivador': { name: 'Motivador', color: 'linear-gradient(135deg, rgba(251, 191, 36, 0.3) 0%, #1a1a2e 100%)', backendMood: 'party' },
    'nostalgico': { name: 'Nostálgico', color: 'linear-gradient(135deg, rgba(129, 140, 248, 0.3) 0%, #1a1a2e 100%)', backendMood: 'sad' },
};

interface Song {
    id: string;
    title: string;
    artist: string;
    coverUrl: string;
    audioUrl: string;
    duration: number;
}

const MoodPlaylist: React.FC = () => {
    const { moodId } = useParams<{ moodId: string }>();
    const { playSong, currentSong, isPlaying } = usePlayer();
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);

    const moodDetails = moodInfo[moodId];

    // Cargar canciones filtradas por mood desde el backend
    useEffect(() => {
        const loadSongsByMood = async () => {
            setLoading(true);
            try {
                const backendMood = moodDetails?.backendMood || moodId;
                const res = await fetch(`${API_URL}/songs?mood=${backendMood}&limit=100`);
                if (!res.ok) throw new Error("Failed to fetch");
                const json = await res.json();
                console.log("🎵 Mood songs response:", json);

                // Extraer canciones del formato del backend
                const raw = json?.data?.songs || json?.songs || json?.data || [];
                
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const mappedSongs = raw.map((s: any) => {
                    const fileUrl = s.fileUrl || s.file_url || s.audioUrl || s.url || "";
                    const urlStr = String(fileUrl).toLowerCase();
                    
                    // Filtrar URLs falsas
                    if (urlStr.includes('example.com') || 
                        urlStr.includes('placeholder') ||
                        !urlStr.startsWith('http')) {
                        return null;
                    }

                    // ✅ Validar MOOD estricto (si el backend devuelve canciones incorrectas)
                    if (String(s.mood).toLowerCase() !== String(backendMood).toLowerCase()) {
                        console.warn(`⚠️ Canción descartada por mood incorrecto: ${s.title} (${s.mood} != ${backendMood})`);
                        return null;
                    }
                    
                    return {
                        id: String(s.id),
                        title: String(s.title || "Sin título"),
                        artist: String(s.artist || "Artista desconocido"),
                        coverUrl: s.coverUrl || DEFAULT_COVER_IMAGE,
                        audioUrl: String(fileUrl),
                        duration: Number(s.duration || 0),
                    };
                }).filter(Boolean) as Song[];

                setSongs(mappedSongs);
            } catch (e) {
                console.error("❌ Error loading mood songs:", e);
                setSongs([]);
            } finally {
                setLoading(false);
            }
        };

        loadSongsByMood();
    }, [moodId, moodDetails?.backendMood]);

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handlePlaySong = (song: Song) => {
        playSong({
            id: song.id,
            title: song.title,
            artist: song.artist,
            coverUrl: song.coverUrl,
            audioUrl: song.audioUrl,
            duration: song.duration,
        });
    };

    const handlePlayAll = () => {
        if (songs.length > 0) {
            handlePlaySong(songs[0]);
        }
    };

    if (!moodDetails) {
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
                        <p className="mood-subtitle">{songs.length} canciones</p>
                    </div>

                    {/* Play Button */}
                    <div className="mood-actions">
                        <button className="play-button-large" onClick={handlePlayAll} disabled={songs.length === 0}>
                            <IonIcon icon={play} />
                            <span>Reproducir</span>
                        </button>
                    </div>

                    {/* Track List */}
                    <div className="mood-track-list">
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '40px' }}>
                                <IonSpinner />
                                <p>Cargando canciones...</p>
                            </div>
                        ) : songs.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', opacity: 0.7 }}>
                                <p>🎵 No hay canciones en este mood</p>
                                <p style={{ fontSize: '14px' }}>Sube canciones con este estado de ánimo</p>
                            </div>
                        ) : (
                            songs.map((song, index) => {
                                const isCurrentTrack = currentSong?.id === song.id;

                                return (
                                    <div
                                        key={song.id}
                                        className={`mood-track-item ${isCurrentTrack ? 'active' : ''}`}
                                        onClick={() => handlePlaySong(song)}
                                    >
                                        <div className="track-number">
                                            {isCurrentTrack && isPlaying ? (
                                                <IonIcon icon={play} className="playing-icon" />
                                            ) : (
                                                index + 1
                                            )}
                                        </div>
                                        <div className="track-cover">
                                            <img 
                                                src={song.coverUrl || DEFAULT_COVER_IMAGE} 
                                                alt={song.title}
                                                onError={(e) => { e.currentTarget.src = DEFAULT_COVER_IMAGE; }}
                                            />
                                        </div>
                                        <div className="track-info">
                                            <h4 className={`track-title ${isCurrentTrack ? 'highlight' : ''}`}>{song.title}</h4>
                                            <p className="track-artist">{song.artist}</p>
                                        </div>
                                        <button
                                            className="track-download-btn"
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                const result = await downloadSong(
                                                    song.audioUrl,
                                                    `${song.artist} - ${song.title}.mp3`
                                                );
                                                if (!result.success) {
                                                    console.error('Download failed:', result.error);
                                                }
                                            }}
                                            title="Descargar"
                                        >
                                            <IonIcon icon={cloudDownload} />
                                        </button>
                                        <div className="track-duration">
                                            {isCurrentTrack && isPlaying ? 'Reproduciendo' : formatDuration(song.duration)}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default MoodPlaylist;
