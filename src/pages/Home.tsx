import React from "react";
import {
  IonContent,
  IonPage,
  IonSearchbar,
  IonIcon,
  IonSpinner,
  IonFab,
  IonFabButton,
  IonToast,
} from "@ionic/react";
import { person, play, add } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { auth } from "../firebase/config";
import { usePlayer } from "../contexts/PlayerContext";
import { DEFAULT_COVER_IMAGE } from "../config/constants";
import { getSongs } from "../services/api.service";
import UploadSongModal from "../components/UploadSongModal";
import "./Home.css";

interface User {
  displayName: string;
  photoURL: string | null;
}

interface Song {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
  duration: number;
}

const Home: React.FC = () => {
  const history = useHistory();
  const { playSong } = usePlayer();
  const [user, setUser] = React.useState<User | null>(null);
  const [songs, setSongs] = React.useState<Song[]>([]); // 🔥 Iniciar vacío
  const [loading, setLoading] = React.useState(false);
  const [showUploadModal, setShowUploadModal] = React.useState(false);
  const [showToast, setShowToast] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState("");

  React.useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser({
        displayName: currentUser.displayName || "Usuario",
        photoURL: currentUser.photoURL,
      });
    }
  }, []);

  // 🔥 Cargar canciones solo del backend
  React.useEffect(() => {
    let isMounted = true; // Flag para evitar setState en componente desmontado

    const loadSongs = async () => {
      if (isMounted) setLoading(true);
      try {
        const response = await getSongs({ page: 1, limit: 50 });
        if (
          isMounted &&
          response &&
          response.data &&
          response.data.length > 0
        ) {
          const backendSongs = response.data.map((song) => ({
            id: song.id,
            title: song.title,
            artist: song.artist,
            coverUrl: song.coverUrl || DEFAULT_COVER_IMAGE,
            audioUrl: song.fileUrl,
            duration: song.duration || 0,
          }));
          setSongs(backendSongs);
        } else if (isMounted) {
          setSongs([]);
        }
      } catch {
        if (isMounted) {
          setSongs([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadSongs();

    // Cleanup
    return () => {
      isMounted = false;
    };
  }, []);

  const handlePlaySong = (song: Song) => {
    console.log("🎵 Playing song:", song.title, song.audioUrl);
    playSong({
      id: song.id,
      title: song.title,
      artist: song.artist,
      coverUrl: song.coverUrl,
      audioUrl: song.audioUrl,
      duration: song.duration || 0,
    });
  };

  const handleUploadSuccess = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const handleUploadError = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const handleSongsUpdated = (updatedSongs: Array<{
    id: string;
    title: string;
    artist: string;
    album?: string;
    duration: number;
    fileUrl: string;
    coverUrl?: string;
  }>) => {
    const backendSongs = updatedSongs.map((song) => ({
      id: song.id,
      title: song.title,
      artist: song.artist,
      coverUrl: song.coverUrl || DEFAULT_COVER_IMAGE,
      audioUrl: song.fileUrl,
      duration: song.duration || 0,
    }));
    setSongs(backendSongs);
  };

  return (
    <IonPage>
      <IonContent fullscreen className="home-content">
        <div className="home-container">
          <div className="home-header">
            <h2>EchoBeat</h2>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button
                onClick={() => history.push("/admin")}
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                  borderRadius: "12px",
                  padding: "8px 16px",
                  color: "white",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Admin
              </button>
              <div
                className="profile-button"
                onClick={() => history.push("/main/profile")}
              >
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="profile-avatar"
                  />
                ) : (
                  <div className="profile-avatar-placeholder">
                    <IonIcon icon={person} />
                  </div>
                )}
              </div>
            </div>
          </div>


          <IonSearchbar
            placeholder="¿Qué quieres escuchar?"
            className="search-bar"
          />

          <div className="section">
            <div className="section-header">
              <h3>Descubre</h3>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <IonSpinner />
                <p>Cargando canciones...</p>
              </div>
            ) : songs.length === 0 ? (
              <div
                style={{ textAlign: "center", padding: "40px", opacity: 0.6 }}
              >
                <p>🎵 No hay canciones disponibles</p>
                <p style={{ fontSize: "14px", marginTop: "10px" }}>
                  El administrador aún no ha subido contenido
                </p>
              </div>
            ) : (
              <div className="songs-grid">
                {songs.map((song) => (
                  <div
                    key={song.id}
                    className="song-card glass"
                    onClick={() => handlePlaySong(song)}
                  >
                    <div className="song-cover">
                      <img
                        src={song.coverUrl}
                        alt={song.title}
                        onError={(e) => {
                          e.currentTarget.src = DEFAULT_COVER_IMAGE;
                        }}
                      />
                      <div className="song-overlay">
                        <div className="play-button">
                          <IonIcon icon={play} />
                        </div>
                      </div>
                    </div>
                    <div className="song-info">
                      <h4>{song.title}</h4>
                      <p>{song.artist}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Upload FAB Button - Available to ALL users */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => setShowUploadModal(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        {/* Upload Modal */}
        <UploadSongModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onSuccess={handleUploadSuccess}
          onError={handleUploadError}
          onSongsUpdated={handleSongsUpdated}
        />

        {/* Toast Messages */}
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          position="top"
          color={toastMessage.includes("✅") ? "success" : "danger"}
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;
