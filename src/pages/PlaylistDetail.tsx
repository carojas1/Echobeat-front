import React, { useState, useEffect } from 'react';
import { IonContent, IonPage, IonIcon, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonButton, IonModal, IonSearchbar, IonCheckbox, IonList, IonItem, IonLabel, IonNote } from '@ionic/react';
import { play, add, trash, musicalNotes, time, checkmarkCircle } from 'ionicons/icons';
import { useParams, useHistory } from 'react-router-dom';
import { usePlayer, Song } from '../contexts/PlayerContext';
import { CustomPlaylist } from './Library';
import api from '../services/api.service';
import './PlaylistDetail.css';

const PlaylistDetail: React.FC = () => {
    const { playlistId } = useParams<{ playlistId: string }>();
    const history = useHistory();
    const { playSong } = usePlayer();
    
    const [playlist, setPlaylist] = useState<CustomPlaylist | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [allSongs, setAllSongs] = useState<Song[]>([]);
    const [selectedSongs, setSelectedSongs] = useState<string[]>([]);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        loadPlaylist();
    }, [playlistId]);

    const loadPlaylist = () => {
        if (playlistId === 'favorites') {
             // Mock Favorites for now or load from localStorage 'user_favorites'
             const favs = localStorage.getItem('user_favorites');
             setPlaylist({
                 id: 'favorites',
                 name: 'Mis Favoritas',
                 songCount: favs ? JSON.parse(favs).length : 0,
                 coverUrl: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=500&auto=format&fit=crop&q=60',
                 songs: favs ? JSON.parse(favs) : [],
                 createdAt: 0
             });
        } else {
            const stored = localStorage.getItem('user_custom_playlists');
            if (stored) {
                const playlists: CustomPlaylist[] = JSON.parse(stored);
                const found = playlists.find(p => p.id === playlistId);
                if (found) setPlaylist(found);
            }
        }
    };

    const handlePlayAll = () => {
        if (playlist && playlist.songs.length > 0) {
            playSong(playlist.songs[0]);
            // Logic to queue the rest would go here if queue system existed
        }
    };

    const openAddSongs = async () => {
        try {
            const res = await api.getSongs();
            if (res && res.data && res.data.songs) {
                setAllSongs(res.data.songs);
                setShowAddModal(true);
            }
        } catch (error) {
            console.error("Error fetching songs", error);
        }
    };

    const toggleSongSelection = (songId: string) => {
        if (selectedSongs.includes(songId)) {
            setSelectedSongs(selectedSongs.filter(id => id !== songId));
        } else {
            setSelectedSongs([...selectedSongs, songId]);
        }
    };

    const saveAddedSongs = () => {
        if (!playlist || playlist.id === 'favorites') return;

        const songsToAdd = allSongs.filter(s => selectedSongs.includes(s.id));
        
        // Prevent duplicates
        const currentIds = playlist.songs.map(s => s.id);
        const newUnique = songsToAdd.filter(s => !currentIds.includes(s.id));
        
        const updatedPlaylist = {
            ...playlist,
            songs: [...playlist.songs, ...newUnique],
            songCount: playlist.songs.length + newUnique.length
        };

        setPlaylist(updatedPlaylist);
        setShowAddModal(false);
        setSelectedSongs([]);

        // Update localStorage
        const stored = localStorage.getItem('user_custom_playlists');
        if (stored) {
            const playlists: CustomPlaylist[] = JSON.parse(stored);
            const index = playlists.findIndex(p => p.id === playlist.id);
            if (index !== -1) {
                playlists[index] = updatedPlaylist;
                localStorage.setItem('user_custom_playlists', JSON.stringify(playlists));
            }
        }
    };

    const removeSong = (e: any, songId: string) => {
        e.stopPropagation();
        if (!playlist || playlist.id === 'favorites') return; // Favorites logic might differ

        const updatedPlaylist = {
            ...playlist,
            songs: playlist.songs.filter(s => s.id !== songId),
            songCount: playlist.songs.length - 1
        };
        setPlaylist(updatedPlaylist);

        const stored = localStorage.getItem('user_custom_playlists');
        if (stored) {
            const playlists: CustomPlaylist[] = JSON.parse(stored);
            const index = playlists.findIndex(p => p.id === playlist.id);
            if (index !== -1) {
                playlists[index] = updatedPlaylist;
                localStorage.setItem('user_custom_playlists', JSON.stringify(playlists));
            }
        }
    };

    if (!playlist) return null;

    const filteredSongsToAdd = allSongs.filter(s => 
        s.title.toLowerCase().includes(searchText.toLowerCase()) || 
        s.artist.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <IonPage>
            <IonHeader className="playlist-header-transparent">
                <IonToolbar className="playlist-toolbar">
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/main/library" />
                    </IonButtons>
                    <IonTitle>{playlist.name}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <div className="playlist-detail-container">
                    <div className="playlist-hero">
                        <div className="playlist-hero-cover">
                            <img src={playlist.coverUrl} alt={playlist.name} />
                        </div>
                        <h1 className="playlist-title">{playlist.name}</h1>
                        <p className="playlist-subtitle">{playlist.songCount} canciones • Creada por ti</p>
                    </div>

                    <div className="playlist-actions">
                        <button className="play-button-large" onClick={handlePlayAll}>
                            <IonIcon icon={play} /> Reproducir
                        </button>
                        {playlist.id !== 'favorites' && (
                            <button className="add-songs-btn secondary" onClick={openAddSongs}>
                                <IonIcon icon={add} /> Agregar Canciones
                            </button>
                        )}
                    </div>

                    <div className="playlist-track-list">
                        {playlist.songs.length === 0 ? (
                            <div className="empty-state">
                                <IonIcon icon={musicalNotes} />
                                <p>Esta playlist está vacía</p>
                            </div>
                        ) : (
                            playlist.songs.map((song, index) => (
                                <div key={song.id} className="track-item" onClick={() => playSong(song)}>
                                    <span className="track-number">{index + 1}</span>
                                    <div className="track-cover-small">
                                        <img src={song.coverUrl || 'assets/cover-placeholder.jpg'} alt={song.title} />
                                    </div>
                                    <div className="track-info">
                                        <h4 className="track-title">{song.title}</h4>
                                        <p className="track-artist">{song.artist}</p>
                                    </div>
                                    <div className="track-meta">
                                        <span className="track-duration">{Math.floor((song.duration || 180)/60)}:{((song.duration || 180)%60).toString().padStart(2, '0')}</span>
                                        {playlist.id !== 'favorites' && (
                                            <button className="remove-btn" onClick={(e) => removeSong(e, song.id)}>
                                                <IonIcon icon={trash} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Add Songs Modal */}
                <IonModal isOpen={showAddModal} onDidDismiss={() => setShowAddModal(false)}>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>Agregar Canciones</IonTitle>
                            <IonButtons slot="end">
                                <IonButton onClick={() => setShowAddModal(false)}>Cerrar</IonButton>
                            </IonButtons>
                        </IonToolbar>
                        <IonToolbar>
                            <IonSearchbar 
                                value={searchText} 
                                onIonInput={e => setSearchText(e.detail.value!)} 
                                placeholder="Buscar canciones..."
                            />
                        </IonToolbar>
                    </IonHeader>
                    <IonContent>
                        <IonList>
                            {filteredSongsToAdd.map(song => {
                                const isAdded = selectedSongs.includes(song.id);
                                const alreadyInPlaylist = playlist.songs.some(s => s.id === song.id);

                                return (
                                    <IonItem key={song.id} button onClick={() => !alreadyInPlaylist && toggleSongSelection(song.id)} disabled={alreadyInPlaylist}>
                                        <div className="add-song-item">
                                            <img src={song.coverUrl} className="thumb" />
                                            <div className="info">
                                                <h4>{song.title}</h4>
                                                <p>{song.artist}</p>
                                            </div>
                                            {alreadyInPlaylist ? (
                                                <IonNote slot="end">Añadida</IonNote>
                                            ) : (
                                                <IonIcon 
                                                    icon={isAdded ? checkmarkCircle : add} 
                                                    slot="end" 
                                                    color={isAdded ? "primary" : "medium"} 
                                                />
                                            )}
                                        </div>
                                    </IonItem>
                                );
                            })}
                        </IonList>
                    </IonContent>
                    <div className="modal-footer">
                        <IonButton expand="block" onClick={saveAddedSongs} disabled={selectedSongs.length === 0}>
                            Agregar {selectedSongs.length} Canciones
                        </IonButton>
                    </div>
                </IonModal>
            </IonContent>
        </IonPage>
    );
};

export default PlaylistDetail;
