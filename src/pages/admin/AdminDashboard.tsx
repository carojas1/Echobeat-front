import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonIcon,
  IonButton,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonAvatar,
  IonBadge,
  IonToast,
  IonFab,
  IonFabButton,
  IonInput,
  IonTextarea,
} from "@ionic/react";
import {
  people,
  musicalNotes,
  settings,
  statsChart,
  add,
  trash,
  cloudUpload,
  logOut,
  personCircle,
  checkmarkCircle,
  play,
  ban,
} from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { auth } from "../../firebase/config";
import { usePlayer } from "../../contexts/PlayerContext";
import {
  getSongs,
  deleteSong as apiDeleteSong,
  getUsers,
} from "../../services/api.service";
import UploadSongModal from "../../components/UploadSongModal";
import "./AdminDashboard.css";

interface User {
  id: string;
  email: string;
  displayName: string;
  role: "USER" | "ADMIN";
  status: "ACTIVE" | "BLOCKED";
  createdAt: string;
  avatar?: string;
}

interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  fileUrl: string;
  coverUrl?: string;
  duration: number;
  playCount: number;
  mood?: string;
}

const AdminDashboard: React.FC = () => {
  const history = useHistory();
  const { playSong } = usePlayer();

  const [activeTab, setActiveTab] = useState<
    "overview" | "users" | "songs" | "settings"
  >("overview");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Data - Start completely empty
  const [users, setUsers] = useState<User[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);

  // 🧹 CLEANUP: Remove mock data on mount
  useEffect(() => {
    localStorage.removeItem("echobeat_songs");
    localStorage.removeItem("echobeat_users");
    localStorage.removeItem("token"); // Old backend JWT
    localStorage.removeItem("user"); // Old backend user
  }, []);

  // 🔥 BACKEND: Load data from backend on mount
  useEffect(() => {
    let isMounted = true; // Flag para evitar setState en componente desmontado

    const loadDataFromBackend = async () => {
      try {
        // Cargar canciones del backend
        const songsResponse = await getSongs({ page: 1, limit: 100 });
        // DEFENSIVE: Asegurar que siempre sea un array
        if (isMounted && songsResponse && Array.isArray(songsResponse.data)) {
          setSongs(songsResponse.data);
        } else if (isMounted) {
          setSongs([]); // Asegurar array vacío
        }
      } catch {
        if (isMounted) {
          setSongs([]); // Array vacío si falla
        }
      }

      try {
        // Cargar usuarios del backend
        const usersResponse = await getUsers({ page: 1, limit: 100 });
        // DEFENSIVE: Asegurar que siempre sea un array
        if (isMounted && usersResponse && Array.isArray(usersResponse.data)) {
          setUsers(usersResponse.data);
        } else if (isMounted) {
          setUsers([]);
        }
      } catch {
        if (isMounted) {
          setUsers([]);
        }
      }
    };

    loadDataFromBackend();

    // Cleanup: marcar como desmontado cuando el componente se desmonte
    return () => {
      isMounted = false;
    };
  }, []);

  // 🔥 ELIMINAR: Ya no guardamos en localStorage, el backend es la fuente de verdad
  // useEffect(() => {
  //     try {
  //         localStorage.setItem('echobeat_songs', JSON.stringify(songs));
  //     } catch (error) {
  //         console.error('Error guardando canciones:', error);
  //     }
  // }, [songs]);

  // useEffect(() => {
  //     try {
  //         localStorage.setItem('echobeat_users', JSON.stringify(users));
  //     } catch (error) {
  //         console.error('Error guardando usuarios:', error);
  //     }
  // }, [users]);

  // Stats calculated from data
  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter((u) => u.status === "ACTIVE").length,
    blockedUsers: users.filter((u) => u.status === "BLOCKED").length,
    totalSongs: songs.length,
    totalPlays:
      Array.isArray(songs) && songs.length > 0
        ? songs.reduce((acc, s) => acc + (s.playCount || 0), 0)
        : 0,
  };

  const handleLogout = async () => {
    await auth.signOut();
    localStorage.removeItem("fb_token");
    localStorage.removeItem("user_email");
    history.push("/login");
  };

  // Toggle user status
  const toggleUserStatus = (userId: string) => {
    setUsers(
      users.map((u) =>
        u.id === userId
          ? {
              ...u,
              status:
                u.status === "ACTIVE"
                  ? ("BLOCKED" as const)
                  : ("ACTIVE" as const),
            }
          : u,
      ),
    );
    setToastMessage("✅ Estado del usuario actualizado");
    setShowToast(true);
  };

  // Delete user
  const handleDeleteUser = (userId: string) => {
    if (!confirm("¿Estás seguro de eliminar este usuario?")) return;
    setUsers(users.filter((u) => u.id !== userId));
    setToastMessage("✅ Usuario eliminado");
    setShowToast(true);
  };

  // Delete song - Backend version
  const handleDeleteSong = async (songId: string) => {
    if (!confirm("¿Estás seguro de eliminar esta canción?")) return;

    try {
      await apiDeleteSong(songId);
      // Recargar canciones del backend
      const songsResponse = await getSongs({ page: 1, limit: 100 });
      if (songsResponse && songsResponse.data) {
        setSongs(songsResponse.data);
      }
      setToastMessage("✅ Canción eliminada");
      setShowToast(true);
    } catch (error) {
      console.error("Error eliminando canción:", error);
      setToastMessage("❌ Error al eliminar canción");
      setShowToast(true);
    }
  };

  // Play song
  const handlePlaySong = (song: Song) => {
    playSong({
      id: song.id,
      title: song.title,
      artist: song.artist,
      coverUrl: song.coverUrl,
      audioUrl: song.fileUrl,
      duration: song.duration,
    });
    setToastMessage(`▶️ Reproduciendo: ${song.title}`);
    setShowToast(true);
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
    if (updatedSongs && Array.isArray(updatedSongs)) {
      setSongs(updatedSongs as Song[]);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-EC", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="admin-toolbar">
          <IonTitle>🛡️ Panel de Administración</IonTitle>
          <IonButton slot="end" fill="clear" onClick={handleLogout}>
            <IonIcon icon={logOut} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent className="admin-content">
        {/* Tabs */}
        <IonSegment
          value={activeTab}
          onIonChange={(e) =>
            setActiveTab(
              e.detail.value as "overview" | "users" | "songs" | "settings",
            )
          }
          className="admin-tabs"
        >
          <IonSegmentButton value="overview">
            <IonIcon icon={statsChart} />
            <IonLabel>Resumen</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="users">
            <IonIcon icon={people} />
            <IonLabel>Usuarios</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="songs">
            <IonIcon icon={musicalNotes} />
            <IonLabel>Canciones</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="settings">
            <IonIcon icon={settings} />
            <IonLabel>Config</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="admin-overview">
            <h2>Bienvenida, Carolina 👋</h2>
            <p className="admin-subtitle">Dashboard de EchoBeat</p>

            <div className="stats-grid">
              <IonCard className="stat-card">
                <IonCardContent>
                  <IonIcon icon={people} className="stat-icon" />
                  <div className="stat-value">{stats.totalUsers}</div>
                  <div className="stat-label">Usuarios Totales</div>
                </IonCardContent>
              </IonCard>

              <IonCard className="stat-card">
                <IonCardContent>
                  <IonIcon
                    icon={checkmarkCircle}
                    className="stat-icon success"
                  />
                  <div className="stat-value">{stats.activeUsers}</div>
                  <div className="stat-label">Usuarios Activos</div>
                </IonCardContent>
              </IonCard>

              <IonCard className="stat-card">
                <IonCardContent>
                  <IonIcon icon={musicalNotes} className="stat-icon" />
                  <div className="stat-value">{stats.totalSongs}</div>
                  <div className="stat-label">Canciones</div>
                </IonCardContent>
              </IonCard>

              <IonCard className="stat-card">
                <IonCardContent>
                  <IonIcon icon={statsChart} className="stat-icon" />
                  <div className="stat-value">
                    {stats.totalPlays.toLocaleString()}
                  </div>
                  <div className="stat-label">Reproducciones</div>
                </IonCardContent>
              </IonCard>
            </div>

            <div className="quick-actions">
              <h3>Acciones Rápidas</h3>
              <div className="action-buttons">
                <IonButton onClick={() => setActiveTab("users")}>
                  <IonIcon slot="start" icon={people} />
                  Ver Usuarios
                </IonButton>
                <IonButton onClick={() => setShowUploadModal(true)}>
                  <IonIcon slot="start" icon={cloudUpload} />
                  Subir Canción
                </IonButton>
                <IonButton onClick={() => setActiveTab("songs")}>
                  <IonIcon slot="start" icon={musicalNotes} />
                  Ver Canciones
                </IonButton>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="admin-users">
            <h2>Gestión de Usuarios ({users.length})</h2>
            <IonList>
              {users.map((user) => (
                <IonItem key={user.id} className="user-item">
                  <IonAvatar slot="start">
                    <IonIcon
                      icon={personCircle}
                      style={{
                        fontSize: "40px",
                        color: user.role === "ADMIN" ? "#f59e0b" : "#3b82f6",
                      }}
                    />
                  </IonAvatar>
                  <IonLabel>
                    <h2>{user.displayName}</h2>
                    <p>{user.email}</p>
                    <p>
                      Registrado: {formatDate(user.createdAt)}{" "}
                      {user.role === "ADMIN" && "• 👑 Admin"}
                    </p>
                  </IonLabel>
                  <IonBadge
                    color={user.status === "ACTIVE" ? "success" : "danger"}
                    slot="end"
                  >
                    {user.status === "ACTIVE" ? "Activo" : "Bloqueado"}
                  </IonBadge>
                  <IonButton
                    fill="clear"
                    onClick={() => toggleUserStatus(user.id)}
                    slot="end"
                  >
                    <IonIcon
                      icon={user.status === "ACTIVE" ? ban : checkmarkCircle}
                    />
                  </IonButton>
                  {user.role !== "ADMIN" && (
                    <IonButton
                      fill="clear"
                      className="delete-btn"
                      onClick={() => handleDeleteUser(user.id)}
                      slot="end"
                    >
                      <IonIcon icon={trash} />
                    </IonButton>
                  )}
                </IonItem>
              ))}
            </IonList>
          </div>
        )}

        {/* Songs Tab */}
        {activeTab === "songs" && (
          <div className="admin-songs">
            <h2>
              Gestión de Canciones ({Array.isArray(songs) ? songs.length : 0})
            </h2>
            {!Array.isArray(songs) || songs.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  opacity: 0.6,
                }}
              >
                <p style={{ fontSize: "48px", marginBottom: "16px" }}>🎵</p>
                <p style={{ fontSize: "18px", marginBottom: "8px" }}>
                  No hay canciones subidas
                </p>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>
                  Usa el botón + para subir tu primera canción
                </p>
              </div>
            ) : (
              <IonList>
                {songs.map((song) => (
                  <IonItem key={song.id} className="song-item">
                    <IonIcon icon={musicalNotes} slot="start" />
                    <IonLabel>
                      <h2>{song.title}</h2>
                      <p>
                        {song.artist} • {song.album || "Sin álbum"}
                      </p>
                      <p>{song.playCount.toLocaleString()} reproducciones</p>
                    </IonLabel>
                    <IonButton
                      fill="clear"
                      slot="end"
                      onClick={() => handlePlaySong(song)}
                    >
                      <IonIcon icon={play} />
                    </IonButton>
                    <IonButton
                      fill="clear"
                      className="delete-btn"
                      slot="end"
                      onClick={() => handleDeleteSong(song.id)}
                    >
                      <IonIcon icon={trash} />
                    </IonButton>
                  </IonItem>
                ))}
              </IonList>
            )}

            <IonFab vertical="bottom" horizontal="end" slot="fixed">
              <IonFabButton onClick={() => setShowUploadModal(true)}>
                <IonIcon icon={add} />
              </IonFabButton>
            </IonFab>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="admin-settings">
            <h2>Configuración</h2>

            <IonCard>
              <IonCardHeader>
                <IonCardTitle>General</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonItem>
                  <IonLabel>Nombre del Sitio</IonLabel>
                  <IonInput value="EchoBeat" />
                </IonItem>
                <IonItem>
                  <IonLabel>Descripción</IonLabel>
                  <IonTextarea value="Tu música, tu ritmo" />
                </IonItem>
              </IonCardContent>
            </IonCard>

            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Estado del Sistema</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonItem>
                  <IonLabel>Modo</IonLabel>
                  <IonBadge color="warning">Demo Local</IonBadge>
                </IonItem>
                <IonItem>
                  <IonLabel>Backend</IonLabel>
                  <IonBadge color="medium">No conectado</IonBadge>
                </IonItem>
              </IonCardContent>
            </IonCard>

            <IonButton expand="block" className="save-settings-btn">
              Guardar Configuración
            </IonButton>
          </div>
        )}

        {/* Upload Modal - Use new reusable component */}
        <UploadSongModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onSuccess={handleUploadSuccess}
          onError={handleUploadError}
          onSongsUpdated={handleSongsUpdated}
        />

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2500}
          position="top"
          color={
            toastMessage.includes("✅") || toastMessage.includes("▶️")
              ? "success"
              : "danger"
          }
        />
      </IonContent>
    </IonPage>
  );
};

export default AdminDashboard;
