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
import { person, play, add, cloudDownload } from "ionicons/icons";
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
    let isMounted = true;

    const loadSongs = async () => {
      if (isMounted) setLoading(true);

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response: any = await getSongs({ page: 1, limit: 50 });

        // ✅ extrae array de canciones sin asumir forma
        const raw =
          (Array.isArray(response?.data) && response.data) ||
          (Array.isArray(response?.items) && response.items) ||
          (Array.isArray(response?.data?.data) && response.data.data) ||
          (Array.isArray(response?.data?.items) && response.data.items) ||
          [];

        console.log("🔍 getSongs response:", response);
        console.log("🔍 raw songs array length:", raw.length);
        console.log("🔍 raw[0]:", raw[0]);

        // ✅ mapper que filtra canciones inválidas directamente
        const backendSongs = raw
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((s: any) => {
            const fileUrl =
              s?.fileUrl ??
              s?.file_url ??
              s?.audioUrl ??
              s?.audio_url ??
              s?.url ??
              s?.file?.url ??
              s?.file?.secure_url ??
              null;

            // ✅ si falta algo crítico, retorna null (se filtra después)
            if (!s?.id || !s?.title || !s?.artist || !fileUrl) return null;
            
            // ✅ Filtrar URLs falsas/mock
            const urlStr = String(fileUrl).toLowerCase();
            if (urlStr.includes('example.com') || 
                urlStr.includes('placeholder') || 
                urlStr.includes('sample.mp3') ||
                !urlStr.startsWith('http')) {
              console.warn('⚠️ Canción con URL inválida ignorada:', s.title, fileUrl);
              return null;
            }

            return {
              id: String(s.id),
              title: String(s.title),
              artist: String(s.artist),
              coverUrl: s.coverUrl || DEFAULT_COVER_IMAGE,
              audioUrl: String(fileUrl),
              duration: Number(s.duration || 0),
            };
          })
          .filter(Boolean) as Song[];

        console.log("✅ valid songs:", backendSongs.length);
        if (raw.length > 0 && backendSongs.length === 0) {
          console.warn("⚠️ Todas las canciones llegaron sin URL/título/artista. raw[0]:", raw[0]);
        }

        if (isMounted) setSongs(backendSongs);
      } catch (e) {
        console.error("❌ loadSongs error:", e);
        if (isMounted) setSongs([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadSongs();
    return () => {
      isMounted = false;
    };
  }, []);

  // ✅ Helper: valida que una canción tenga todos los campos necesarios
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isValidSong = (s: any): s is Song => {
    return (
      s &&
      typeof s.id === "string" &&
      s.id.trim() !== "" &&
      typeof s.title === "string" &&
      s.title.trim() !== "" &&
      typeof s.artist === "string" &&
      s.artist.trim() !== "" &&
      typeof s.audioUrl === "string" &&
      s.audioUrl.trim() !== ""
    );
  };

  const handlePlaySong = (song: Song) => {
    const missing: string[] = [];
    if (!song?.id) missing.push("id");
    if (!song?.title?.trim()) missing.push("title");
    if (!song?.artist?.trim()) missing.push("artist");
    if (!song?.audioUrl?.trim()) missing.push("audioUrl");

    if (missing.length) {
      console.error("❌ Song inválida:", song);
      setToastMessage(`❌ Esta canción está incompleta (sin ${missing.join("/")}).`);
      setShowToast(true);
      return;
    }

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

  // ✅ Maneja cualquier formato de respuesta del backend
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSongsUpdated = (updatedSongs: any) => {
    const arr =
      (Array.isArray(updatedSongs) && updatedSongs) ||
      (Array.isArray(updatedSongs?.data) && updatedSongs.data) ||
      (Array.isArray(updatedSongs?.data?.data) && updatedSongs.data.data) ||
      [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const backendSongs = arr.map((song: any) => ({
      id: String(song.id ?? song._id ?? ""),
      title: String(song.title ?? ""),
      artist: String(song.artist ?? ""),
      coverUrl: song.coverUrl || DEFAULT_COVER_IMAGE,
      audioUrl: String(song.fileUrl ?? song.file_url ?? song.audioUrl ?? song.url ?? ""),
      duration: Number(song.duration ?? 0),
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
                {songs.filter(isValidSong).map((song) => (
                  <div
                    key={song.id}
                    className="song-card glass"
                    onClick={() => handlePlaySong(song)}
                  >
                    <div className="song-cover">
                      <img
                        src={song.coverUrl || DEFAULT_COVER_IMAGE}
                        alt={song.title}
                        onError={(e) => {
                          e.currentTarget.src = DEFAULT_COVER_IMAGE;
                        }}
                      />
                      <div className="song-overlay">
                        <button
                          className="download-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(song.audioUrl, '_blank');
                          }}
                          title="Descargar"
                        >
                          <IonIcon icon={cloudDownload} />
                        </button>
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
