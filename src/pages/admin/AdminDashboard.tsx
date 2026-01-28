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
  IonList,
  IonItem,
  IonAvatar,
  IonBadge,
  IonToast,
  IonFab,
  IonFabButton,
} from "@ionic/react";
import {
  people,
  musicalNotes,
  add,
  trash,
  logOut,
  personCircle,
  play,
  chatbubbles,
  send,
  chevronForward,
  download,
  refresh
} from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { auth } from "../../firebase/config";
import { usePlayer } from "../../contexts/PlayerContext";
import {
  getSongs,
  deleteSong as apiDeleteSong,
  getFirebaseUsers,
  deleteFirebaseUser,
  getSupportMessages,
  SupportMessage,
} from "../../services/api.service";
import { getAllSupportMessages } from "../../services/firestore.service";
import UploadSongModal from "../../components/UploadSongModal";
import "./AdminDashboard.css";
import "./AdminChat.css";

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

interface FirebaseUser {
  uid: string;
  id?: string;
  email?: string;
  displayName?: string;
  disabled?: boolean;
}

const AdminDashboard: React.FC = () => {
  const history = useHistory();
  const { playSong } = usePlayer();

  const [activeTab, setActiveTab] = useState<
    "users" | "songs" | "support"
  >("users");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Data
  const [users, setUsers] = useState<FirebaseUser[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>([]);
  const [selectedChatUser, setSelectedChatUser] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Load data from backend
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        // Parallel fetching
        const [songsRes, usersRes, supportRes, firestoreSupportRes] = await Promise.all([
          getSongs({ page: 1, limit: 100 }).catch(() => ({ data: [], total: 0 })),
          getFirebaseUsers().catch(() => ({ users: [] })),
          getSupportMessages().catch(() => ({ data: { messages: [] } })),
          getAllSupportMessages().catch(() => [])
        ]);

        if (isMounted) {
            // ... (rest of logic) ...
            
            // Re-run this logic? 
            // Better to factor out loadData vs loadSupport, but for minimal diff:
            // logic inside loadData handles it.
        }


        if (isMounted) {
            // 1. Songs extraction (Simple format: { data: Song[] })
            const loadedSongs = songsRes?.data || [];
            
            // 2. Firebase Users extraction (CRITICAL FIX)
            // Backend returns: { "users": [...], "total": 50 }
            const realUsers = usersRes.data?.users || usersRes.users || [];
            console.log("✅ Fixed Firebase Users Loaded:", realUsers.length);

            // 3. Support Messages extraction (API)
            let apiMessages: SupportMessage[] = [];
            if (supportRes.data?.data?.messages && Array.isArray(supportRes.data.data.messages)) {
                apiMessages = supportRes.data.data.messages;
            } else if (supportRes.data?.messages && Array.isArray(supportRes.data.messages)) {
                apiMessages = supportRes.data.messages;
            } else if (Array.isArray(supportRes.data)) {
                apiMessages = supportRes.data;
            } else if (Array.isArray(supportRes.messages)) {
                apiMessages = supportRes.messages;
            } else if (Array.isArray(supportRes)) {
                apiMessages = supportRes;
            }

            // 4. Merge API + Firestore Messages (Avoiding duplicates if possible)
            // We use Firestore messages mostly for New messages that API doesn't have
            const firestoreMessages = firestoreSupportRes as unknown as SupportMessage[];
            
            // Simple merge: Firestore is source of truth for new stuff
            const allMessages = [...apiMessages, ...firestoreMessages];
            
            // Remove duplicates by ID? 
            // Firestore IDs are strings, API/Postgres IDs might be UUIDs. usually disjoint sets if systems are split.
            const uniqueMessages = Array.from(new Map(allMessages.map(item => [item.id, item])).values());
             
            console.log("✅ Merged Messages Loaded:", uniqueMessages.length);
            
            setSongs(loadedSongs);
            setUsers(realUsers);
            setSupportMessages(uniqueMessages);
        }
      } catch (error) {
        console.error("❌ Error loading dashboard data:", error);
      }
    };

    loadData();

    // Auto-refresh support messages every 15 seconds (API)
    const intervalId = setInterval(() => {
        if (activeTab === 'support') {
             getSupportMessages().then(res => {
                 if (!isMounted) return;
                 
                 let newMsgs: SupportMessage[] = [];
                 // Parse Logic same as loadData
                 if (res.data?.data?.messages && Array.isArray(res.data.data.messages)) {
                    newMsgs = res.data.data.messages;
                 } else if (res.data?.messages && Array.isArray(res.data.messages)) {
                    newMsgs = res.data.messages;
                 } else if (Array.isArray(res.data)) {
                    newMsgs = res.data;
                 } else if (Array.isArray(res.messages)) {
                    newMsgs = res.messages;
                 } else if (Array.isArray(res)) {
                    newMsgs = res;
                 }

                 if (newMsgs.length > 0) {
                     console.log("🔄 Auto-refreshing API messages...");
                     setSupportMessages(prev => {
                         // Merge strategy: Unique IDs
                         const combined = [...prev, ...newMsgs];
                         const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
                         return unique;
                     });
                 }
             }).catch(err => console.error("Poll error:", err));
        }
    }, 15000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [activeTab, refreshKey]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem("fb_token");
      localStorage.removeItem("user_email");
      history.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Delete user
  const handleDeleteUser = async (uid: string, email: string) => {
    if (email === 'carojas@sudamericano.edu.ec') {
        setToastMessage("⚠️ No puedes eliminar al administrador principal");
        setShowToast(true);
        return;
    }

    if (!confirm("¿Estás seguro de eliminar este usuario de Firebase?")) return;
    try {
        await deleteFirebaseUser(uid);
        setUsers(users.filter((u) => u.uid !== uid));
        setToastMessage("✅ Usuario eliminado de Firebase");
        setShowToast(true);
    } catch {
        setToastMessage("❌ Error al eliminar usuario");
        setShowToast(true);
    }
  };

  // Delete song - Backend version
  const handleDeleteSong = async (songId: string) => {
    if (!confirm("¿Estás seguro de eliminar esta canción?")) return;

    try {
      await apiDeleteSong(songId);
      // Recargar canciones del backend
      const songsResponse = await getSongs({ page: 1, limit: 100 });
      if (songsResponse && songsResponse.data) {
        setSongs(songsResponse.data as Song[]);
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

  const handleDownloadSong = (song: Song) => {
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = song.fileUrl;
    link.target = '_blank';
    link.download = `${song.artist} - ${song.title}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setToastMessage(`⬇️ Descargando: ${song.title}`);
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



  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="admin-toolbar">
          <IonTitle>
            <div className="admin-title">
              <img src="/logo.png" alt="EchoBeat" className="admin-logo" />
              <span>Admin</span>
            </div>
          </IonTitle>
          <IonButton slot="end" fill="clear" onClick={handleLogout}>
            <IonIcon icon={logOut} />
          </IonButton>
        </IonToolbar>
        
        <IonToolbar className="admin-tabs-toolbar">
          <IonSegment 
            value={activeTab} 
            onIonChange={(e) => setActiveTab(e.detail.value as "users" | "songs" | "support")}
            className="admin-segment"
          >
            <IonSegmentButton value="users">
              <IonIcon icon={people} />
              <IonLabel>USUARIOS</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="songs">
              <IonIcon icon={musicalNotes} />
              <IonLabel>CANCIONES</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="support">
              <IonIcon icon={chatbubbles} />
              {/* Badge for unread could go here */}
              <IonLabel>SOPORTE</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <IonContent className="admin-content">
        
        {/* Main Content Area */}
        <div className="admin-container">

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="admin-users">
            <h2>Gestión de Usuarios ({users.length})</h2>
            {users.length === 0 ? (
              <div className="empty-state-container">
                <IonIcon icon={people} className="empty-icon" />
                <h3>No hay usuarios registrados</h3>
                <p>Los usuarios aparecerán aquí cuando se registren en Firebase</p>
              </div>
            ) : (
              <IonList className="users-list">
                {users.map((user) => (
                  <IonItem key={user.uid || user.id} className="user-item">
                    <IonAvatar slot="start">
                      <IonIcon
                        icon={personCircle}
                        style={{
                          fontSize: "40px",
                          color: "#3b82f6",
                        }}
                      />
                    </IonAvatar>
                    <IonLabel>
                      <h2>{user.displayName || user.email?.split('@')[0]}</h2>
                      <p>{user.email}</p>
                      <p>
                        ID: <span style={{ fontFamily: 'monospace', opacity: 0.7 }}>{user.uid || user.id}</span>
                      </p>
                    </IonLabel>
                    <IonBadge
                      color={user.disabled ? "danger" : "success"}
                      slot="end"
                    >
                      {user.disabled ? "Bloqueado" : "Activo"}
                    </IonBadge>
                   
                    {/* Protected Delete Button */}
                    {user.email !== 'carojas@sudamericano.edu.ec' && (
                      <IonButton
                        fill="clear"
                        className="delete-btn"
                        onClick={() => user.uid && handleDeleteUser(user.uid, user.email || '')}
                        slot="end"
                      >
                        <IonIcon icon={trash} />
                      </IonButton>
                    )}
                  </IonItem>
                ))}
              </IonList>
            )}
          </div>
        )}

        {/* Songs Tab */}
        {activeTab === "songs" && (
          <div className="admin-songs">
            <h2>
              Canciones ({Array.isArray(songs) ? songs.length : 0})
            </h2>
            {!Array.isArray(songs) || songs.length === 0 ? (
              <div className="empty-state-container">
                <IonIcon icon={musicalNotes} className="empty-icon" />
                <h3>No hay canciones</h3>
                <p>Usa el botón + para subir canciones</p>
              </div>
            ) : (
              <div className="songs-grid">
                {songs.map((song) => (
                  <div key={song.id} className="song-card">
                    <div className="song-cover">
                      {song.coverUrl ? (
                        <img src={song.coverUrl} alt={song.title} />
                      ) : (
                        <IonIcon icon={musicalNotes} />
                      )}
                    </div>
                    <div className="song-info">
                      <h3>{song.title}</h3>
                      <p>{song.artist}</p>
                    </div>
                    <div className="song-actions">
                      <button className="download-btn" onClick={() => handleDownloadSong(song)} title="Descargar">
                        <IonIcon icon={download} />
                      </button>
                      <button className="play-btn" onClick={() => handlePlaySong(song)} title="Reproducir">
                        <IonIcon icon={play} />
                      </button>
                      <button className="delete-btn" onClick={() => handleDeleteSong(song.id)} title="Eliminar">
                        <IonIcon icon={trash} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <IonFab vertical="bottom" horizontal="end" slot="fixed">
              <IonFabButton onClick={() => setShowUploadModal(true)}>
                <IonIcon icon={add} />
              </IonFabButton>
            </IonFab>
          </div>
        )}



        {/* Support Tab - Re-implemented Chat UI */}
        {activeTab === "support" && (
          <div className="admin-support-chat-container">
            {/* Sidebar: User List */}
            <div className={`chat-sidebar ${selectedChatUser ? 'hidden-mobile' : ''}`}>
              <div className="chat-header">
                <h2>Mensajes</h2>
                <IonButton fill="clear" size="small" onClick={() => setRefreshKey(prev => prev + 1)}>
                    <IonIcon icon={refresh} />
                </IonButton>
              </div>
              <div className="chat-user-list">
                {Array.from(new Set(supportMessages.map(m => m.userId)))
                  .map(userId => {
                    const userMsgs = supportMessages.filter(m => m.userId === userId);
                    const lastMsg = userMsgs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
                    const userName = lastMsg.userEmail?.split('@')[0] || 'Usuario';
                    
                    return (
                      <div 
                        key={userId} 
                        className={`chat-user-item ${selectedChatUser === userId ? 'active' : ''}`}
                        onClick={() => setSelectedChatUser(userId)}
                      >
                        <IonAvatar className="chat-avatar">
                          <IonIcon icon={personCircle} />
                        </IonAvatar>
                        <div className="chat-user-info">
                          <h3>{userName}</h3>
                          <p>{lastMsg.message.substring(0, 30)}...</p>
                        </div>
                        <span className="chat-time">
                          {new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })}
                  {supportMessages.length === 0 && (
                     <div className="empty-chat-list">
                        <IonIcon icon={chatbubbles} />
                        <p>No hay mensajes</p>
                     </div>
                  )}
              </div>
            </div>

            {/* Main: Chat Window */}
            <div className={`chat-window ${!selectedChatUser ? 'hidden-mobile' : ''}`}>
               {selectedChatUser ? (
                 <>
                   <div className="chat-window-header">
                      <IonButton fill="clear" className="back-button-mobile" onClick={() => setSelectedChatUser(null)}>
                        <IonIcon icon={chevronForward} style={{ transform: 'rotate(180deg)' }} />
                      </IonButton>
                      <div className="chat-user-details">
                        <IonAvatar>
                           <IonIcon icon={personCircle} />
                        </IonAvatar>
                        <div>
                            <h3>{supportMessages.find(m => m.userId === selectedChatUser)?.userEmail}</h3>
                            <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>Conectado</span>
                        </div>
                      </div>
                   </div>
                   
                   <div className="chat-messages-area">
                      {supportMessages
                        .filter(m => m.userId === selectedChatUser)
                        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                        .map(msg => (
                          <div key={msg.id} className={`chat-bubble ${msg.isAdmin ? 'sent' : 'received'}`}>
                             <div className="message-content">{msg.message}</div>
                             <div className="message-timestamp">
                               {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                             </div>
                          </div>
                      ))}
                      
                      <div className="chat-reply-placeholder">
                        <p>ℹ️ Responde a este usuario vía email: <strong>{supportMessages.find(m => m.userId === selectedChatUser)?.userEmail}</strong></p>
                        <a 
                          href={`mailto:${supportMessages.find(m => m.userId === selectedChatUser)?.userEmail}?subject=Respuesta a tu mensaje de soporte&body=Hola, respondiendo a tu mensaje: ...`}
                          target="_blank"
                          rel="noreferrer"
                          className="reply-button-link"
                        >
                          <IonIcon icon={send} /> Responder por Email
                        </a>
                      </div>
                   </div>
                 </>
               ) : (
                 <div className="no-chat-selected">
                    <IonIcon icon={chatbubbles} />
                    <h3>Selecciona un usuario para ver sus mensajes</h3>
                 </div>
               )}
            </div>
          </div>
        )}
        
        </div>

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
