import React, { useState, useEffect } from "react";
import { IonContent, IonPage, IonIcon, IonSpinner } from "@ionic/react";
import { musicalNotes, play, add, heart } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { auth } from "../firebase/config";
import "./Library.css";

interface User {
  displayName: string;
  photoURL: string | null;
}

interface Playlist {
  id: string;
  name: string;
  songCount: number;
  coverUrl: string;
}

const Library: React.FC = () => {
  const history = useHistory();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser({
        displayName: currentUser.displayName || "Usuario",
        photoURL: currentUser.photoURL,
      });
    }

    // ✅ No mock data - will load from backend in the future
    setPlaylists([]);
    setLoading(false);
  }, []);

  return (
    <IonPage>
      <IonContent>
        <div className="library-container">
          {/* Header con Avatar */}
          <div className="library-header">
            <div className="header-top">
              <h2>Biblioteca</h2>
              <div
                className="profile-avatar-btn"
                onClick={() => history.push("/main/profile")}
              >
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="avatar-image"
                  />
                ) : (
                  <div className="avatar-placeholder">
                    <IonIcon icon={musicalNotes} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="library-quick-actions">
            <button className="quick-action-btn primary">
              <IonIcon icon={add} />
              <span>Nueva Playlist</span>
            </button>
            <button className="quick-action-btn">
              <IonIcon icon={heart} />
              <span>Favoritas</span>
            </button>
          </div>

          {/* Playlists */}
          {loading ? (
            <div className="library-loading">
              <IonSpinner name="crescent" />
            </div>
          ) : playlists.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                opacity: 0.6,
              }}
            >
              <p style={{ fontSize: "48px", marginBottom: "16px" }}>🎵</p>
              <p style={{ fontSize: "18px", marginBottom: "8px" }}>
                No tienes playlists aún
              </p>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>
                Crea tu primera playlist para empezar
              </p>
            </div>
          ) : (
            <>
              <div className="library-section">
                <h3 className="section-title">Tus Playlists</h3>
                <div className="playlists-grid">
                  {playlists.map((playlist) => (
                    <div
                      key={playlist.id}
                      className="playlist-card glass"
                      onClick={() =>
                        history.push(`/main/playlist/${playlist.id}`)
                      }
                    >
                      <div className="playlist-cover">
                        <img src={playlist.coverUrl} alt={playlist.name} />
                        <div className="playlist-overlay">
                          <IonIcon icon={play} className="play-icon" />
                        </div>
                      </div>
                      <div className="playlist-info">
                        <h4>{playlist.name}</h4>
                        <p>{playlist.songCount} canciones</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Library;
