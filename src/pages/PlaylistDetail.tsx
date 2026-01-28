import React, { useState, useEffect, useCallback } from "react";
import {
  IonContent,
  IonPage,
  IonIcon,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonButton,
  IonModal,
  IonSearchbar,
  IonList,
  IonItem,
  IonNote,
} from "@ionic/react";
import {
  play,
  add,
  trash,
  musicalNotes,
  checkmarkCircle,
} from "ionicons/icons";
import { useParams } from "react-router-dom";
import { usePlayer, Song as PlayerSong } from "../contexts/PlayerContext";
import api from "../services/api.service";
import "./PlaylistDetail.css";

// Local Song type compatible with both API and Player
interface Song {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
  duration?: number;
}

interface CustomPlaylist {
  id: string;
  name: string;
  songCount: number;
  coverUrl: string;
  songs: Song[];
  createdAt: number;
}

const PlaylistDetail: React.FC = () => {
  const { playlistId } = useParams<{ playlistId: string }>();
  const { playSong } = usePlayer();

  const [playlist, setPlaylist] = useState<CustomPlaylist | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [allSongs, setAllSongs] = useState<Song[]>([]);
  const [selectedSongs, setSelectedSongs] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");

  const loadPlaylist = useCallback(() => {
    if (playlistId === "favorites") {
      const favs = localStorage.getItem("user_favorites");
      const parsedFavs = favs ? JSON.parse(favs) : [];
      setPlaylist({
        id: "favorites",
        name: "Mis Favoritas",
        songCount: parsedFavs.length,
        coverUrl:
          "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=500&auto=format&fit=crop&q=60",
        songs: parsedFavs.map((s: Song) => ({
          ...s,
          coverUrl: s.coverUrl || "",
          audioUrl: s.audioUrl || "",
          duration: s.duration || 180,
        })),
        createdAt: 0,
      });
    } else {
      const stored = localStorage.getItem("user_custom_playlists");
      if (stored) {
        const playlists: CustomPlaylist[] = JSON.parse(stored);
        const found = playlists.find((p) => p.id === playlistId);
        if (found) setPlaylist(found);
      }
    }
  }, [playlistId]);

  useEffect(() => {
    loadPlaylist();
  }, [playlistId, loadPlaylist]);

  const handlePlayAll = () => {
    if (playlist && playlist.songs.length > 0) {
      const song = playlist.songs[0];
      playSong({
        id: song.id,
        title: song.title,
        artist: song.artist,
        coverUrl: song.coverUrl,
        audioUrl: song.audioUrl,
        duration: song.duration,
      } as PlayerSong);
    }
  };

  const openAddSongs = async () => {
    try {
      const res = await api.getSongs();
      if (res && res.data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mappedSongs: Song[] = res.data.map((s: any) => ({
          id: String(s.id),
          title: String(s.title || "Sin título"),
          artist: String(s.artist || "Artista desconocido"),
          coverUrl: s.coverUrl || "",
          audioUrl: s.audioUrl || s.fileUrl || "",
          duration: Number(s.duration || 0),
        }));
        setAllSongs(mappedSongs);
        setShowAddModal(true);
      }
    } catch (error) {
      console.error("Error loading songs:", error);
    }
  };

  const toggleSongSelection = (songId: string) => {
    if (selectedSongs.includes(songId)) {
      setSelectedSongs(selectedSongs.filter((id: string) => id !== songId));
    } else {
      setSelectedSongs([...selectedSongs, songId]);
    }
  };

  const saveAddedSongs = () => {
    if (!playlist || playlist.id === "favorites") return;

    const songsToAdd = allSongs.filter((s: Song) =>
      selectedSongs.includes(s.id),
    );

    const currentIds = playlist.songs.map((s: Song) => s.id);
    const newUnique = songsToAdd.filter(
      (s: Song) => !currentIds.includes(s.id),
    );

    const updatedPlaylist: CustomPlaylist = {
      ...playlist,
      songs: [...playlist.songs, ...newUnique],
      songCount: playlist.songs.length + newUnique.length,
    };

    setPlaylist(updatedPlaylist);
    setShowAddModal(false);
    setSelectedSongs([]);

    // Update localStorage
    const stored = localStorage.getItem("user_custom_playlists");
    if (stored) {
      const playlists: CustomPlaylist[] = JSON.parse(stored);
      const index = playlists.findIndex((p) => p.id === playlist.id);
      if (index !== -1) {
        playlists[index] = updatedPlaylist;
        localStorage.setItem(
          "user_custom_playlists",
          JSON.stringify(playlists),
        );
      }
    }
  };

  const removeSong = (e: React.MouseEvent, songId: string) => {
    e.stopPropagation();
    if (!playlist || playlist.id === "favorites") return;

    const updatedPlaylist: CustomPlaylist = {
      ...playlist,
      songs: playlist.songs.filter((s: Song) => s.id !== songId),
      songCount: playlist.songs.length - 1,
    };

    setPlaylist(updatedPlaylist);

    // Update localStorage
    const stored = localStorage.getItem("user_custom_playlists");
    if (stored) {
      const playlists: CustomPlaylist[] = JSON.parse(stored);
      const index = playlists.findIndex((p) => p.id === playlist.id);
      if (index !== -1) {
        playlists[index] = updatedPlaylist;
        localStorage.setItem(
          "user_custom_playlists",
          JSON.stringify(playlists),
        );
      }
    }
  };

  const filteredSongs = allSongs.filter(
    (s: Song) =>
      s.title.toLowerCase().includes(searchText.toLowerCase()) ||
      s.artist.toLowerCase().includes(searchText.toLowerCase()),
  );

  const handlePlaySong = (song: Song) => {
    playSong({
      id: song.id,
      title: song.title,
      artist: song.artist,
      coverUrl: song.coverUrl,
      audioUrl: song.audioUrl,
      duration: song.duration,
    } as PlayerSong);
  };

  if (!playlist) {
    return (
      <IonPage>
        <IonContent className="playlist-detail-content">
          <div className="loading-state">Cargando...</div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="playlist-toolbar">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/main/library" text="" />
          </IonButtons>
          <IonTitle>{playlist.name}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="playlist-detail-content">
        <div className="playlist-detail-container">
          {/* Hero Section */}
          <div className="playlist-hero">
            <div className="playlist-cover-large">
              <img src={playlist.coverUrl} alt={playlist.name} />
            </div>
            <h1 className="playlist-title">{playlist.name}</h1>
            <p className="playlist-meta">{playlist.songs.length} canciones</p>
          </div>

          {/* Actions */}
          <div className="playlist-actions">
            <button
              className="play-all-btn"
              onClick={handlePlayAll}
              disabled={playlist.songs.length === 0}
            >
              <IonIcon icon={play} /> Reproducir Todo
            </button>
            {playlist.id !== "favorites" && (
              <button className="add-songs-btn" onClick={openAddSongs}>
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
                <div
                  key={song.id}
                  className="track-item"
                  onClick={() => handlePlaySong(song)}
                >
                  <span className="track-number">{index + 1}</span>
                  <div className="track-cover-small">
                    <img
                      src={song.coverUrl || "assets/cover-placeholder.jpg"}
                      alt={song.title}
                    />
                  </div>
                  <div className="track-info">
                    <h4 className="track-title">{song.title}</h4>
                    <p className="track-artist">{song.artist}</p>
                  </div>
                  <div className="track-meta">
                    <span className="track-duration">
                      {Math.floor((song.duration || 180) / 60)}:
                      {((song.duration || 180) % 60)
                        .toString()
                        .padStart(2, "0")}
                    </span>
                    {playlist.id !== "favorites" && (
                      <button
                        className="remove-btn"
                        onClick={(e) => removeSong(e, song.id)}
                      >
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
        <IonModal
          isOpen={showAddModal}
          onDidDismiss={() => setShowAddModal(false)}
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>Agregar Canciones</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowAddModal(false)}>
                  Cerrar
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonSearchbar
              value={searchText}
              onIonInput={(e) => setSearchText(e.detail.value || "")}
              placeholder="Buscar canciones..."
            />
            <IonList>
              {filteredSongs.map((song) => (
                <IonItem
                  key={song.id}
                  onClick={() => toggleSongSelection(song.id)}
                  button
                >
                  <div className="song-select-cover" slot="start">
                    <img
                      src={song.coverUrl || "assets/cover-placeholder.jpg"}
                      alt={song.title}
                    />
                  </div>
                  <div className="song-select-info">
                    <h4>{song.title}</h4>
                    <p>{song.artist}</p>
                  </div>
                  <IonNote slot="end">
                    {selectedSongs.includes(song.id) && (
                      <IonIcon
                        icon={checkmarkCircle}
                        color="success"
                        style={{ fontSize: "24px" }}
                      />
                    )}
                  </IonNote>
                </IonItem>
              ))}
            </IonList>
            {selectedSongs.length > 0 && (
              <div className="add-selected-btn-container">
                <IonButton expand="block" onClick={saveAddedSongs}>
                  Agregar {selectedSongs.length} canciones
                </IonButton>
              </div>
            )}
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default PlaylistDetail;
