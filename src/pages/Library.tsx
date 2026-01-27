import React, { useState, useEffect } from "react";
import { IonContent, IonPage, IonIcon, IonSpinner, IonAlert, IonRefresher, IonRefresherContent } from "@ionic/react";
import { musicalNotes, play, add, heart, trashBin, sparkles, colorPalette } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { auth } from "../firebase/config";
import CreateMoodModal, { CustomMood } from "../components/CreateMoodModal";
import "./Library.css";

interface User {
  displayName: string;
  photoURL: string | null;
}

export interface CustomPlaylist {
  id: string;
  name: string;
  songCount: number;
  coverUrl: string;
  songs: Song[];
  createdAt: number;
}

interface Song {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
}

const Library: React.FC = () => {
  const history = useHistory();
  const [playlists, setPlaylists] = useState<CustomPlaylist[]>([]);
  const [customMoods, setCustomMoods] = useState<CustomMood[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showMoodModal, setShowMoodModal] = useState(false);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser({
        displayName: currentUser.displayName || "Usuario",
        photoURL: currentUser.photoURL,
      });
    }
    loadData();
  }, []);

  const loadData = () => {
    // Load playlists
    const storedPlaylists = localStorage.getItem('user_custom_playlists');
    if (storedPlaylists) {
      setPlaylists(JSON.parse(storedPlaylists));
    }
    
    // Load custom moods
    const storedMoods = localStorage.getItem('user_custom_moods');
    if (storedMoods) {
      setCustomMoods(JSON.parse(storedMoods));
    }
    
    setLoading(false);
  };

  const handleCreatePlaylist = (name: string) => {
    if (!name.trim()) return;
    
    const newPlaylist: CustomPlaylist = {
      id: `pl_${Date.now()}`,
      name: name,
      songCount: 0,
      coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&auto=format&fit=crop&q=60',
      songs: [],
      createdAt: Date.now()
    };

    const updated = [newPlaylist, ...playlists];
    setPlaylists(updated);
    localStorage.setItem('user_custom_playlists', JSON.stringify(updated));
  };

  const deletePlaylist = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = playlists.filter(p => p.id !== id);
    setPlaylists(updated);
    localStorage.setItem('user_custom_playlists', JSON.stringify(updated));
  };

  const deleteMood = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = customMoods.filter(m => m.id !== id);
    setCustomMoods(updated);
    localStorage.setItem('user_custom_moods', JSON.stringify(updated));
  };

  const handleMoodCreated = (mood: CustomMood) => {
    setCustomMoods([mood, ...customMoods]);
  };

  const doRefresh = (event: CustomEvent) => {
    loadData();
    setTimeout(() => {
      event.detail.complete();
    }, 1000);
  };

  return (
    <IonPage>
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
            <IonRefresherContent pullingIcon={musicalNotes} refreshingSpinner="crescent" />
        </IonRefresher>

        <div className="library-container">
          {/* Header */}
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
            <button className="quick-action-btn primary" onClick={() => setShowAlert(true)}>
              <IonIcon icon={add} />
              <span>Nueva Playlist</span>
            </button>
            <button className="quick-action-btn mood-create-btn" onClick={() => setShowMoodModal(true)}>
              <IonIcon icon={colorPalette} />
              <span>Crear Ambiente</span>
            </button>
            <button className="quick-action-btn" onClick={() => history.push('/main/playlist/favorites')}>
              <IonIcon icon={heart} />
              <span>Favoritas</span>
            </button>
            <button className="quick-action-btn" onClick={() => history.push('/main/mood')}>
              <IonIcon icon={sparkles} />
              <span>Explorar Ambientes</span>
            </button>
          </div>

          {loading ? (
            <div className="library-loading">
              <IonSpinner name="crescent" />
            </div>
          ) : (
            <>
              {/* Custom Moods Section */}
              {customMoods.length > 0 && (
                <div className="library-section">
                  <h3 className="section-title">Tus Ambientes</h3>
                  <div className="moods-horizontal">
                    {customMoods.map((mood) => (
                      <div
                        key={mood.id}
                        className="custom-mood-card"
                        style={{ 
                          background: `linear-gradient(135deg, ${mood.color}30 0%, rgba(20, 20, 30, 0.95) 60%)`,
                          borderColor: `${mood.color}50`
                        }}
                        onClick={() => history.push(`/main/custom-mood/${mood.id}`)}
                      >
                        <button 
                          className="delete-mood-btn"
                          onClick={(e) => deleteMood(e, mood.id)}
                        >
                          <IonIcon icon={trashBin} />
                        </button>
                        <span className="mood-emoji">{mood.emoji}</span>
                        <span className="mood-name">{mood.name}</span>
                        <span className="mood-songs">{mood.songs.length} canciones</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Playlists Section */}
              {playlists.length > 0 ? (
                <div className="library-section">
                  <h3 className="section-title">Tus Playlists</h3>
                  <div className="playlists-grid">
                    {playlists.map((playlist) => (
                      <div
                        key={playlist.id}
                        className="playlist-card"
                        onClick={() => history.push(`/main/playlist/${playlist.id}`)}
                      >
                        <div className="playlist-cover">
                          <img src={playlist.coverUrl} alt={playlist.name} />
                          <div className="playlist-overlay">
                            <IonIcon icon={play} className="play-icon" />
                          </div>
                          <button 
                              className="delete-pl-btn"
                              onClick={(e) => deletePlaylist(e, playlist.id)}
                          >
                              <IonIcon icon={trashBin} />
                          </button>
                        </div>
                        <div className="playlist-info">
                          <h4>{playlist.name}</h4>
                          <p>{playlist.songs?.length || 0} canciones</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : customMoods.length === 0 && (
                <div className="empty-state">
                  <span className="empty-icon">🎵</span>
                  <p className="empty-title">Tu biblioteca está vacía</p>
                  <p className="empty-subtitle">Crea tu primera playlist o ambiente personalizado</p>
                </div>
              )}
            </>
          )}

          {/* Alerts */}
          <IonAlert
            isOpen={showAlert}
            onDidDismiss={() => setShowAlert(false)}
            header={'Nueva Playlist'}
            inputs={[
              {
                name: 'name',
                type: 'text',
                placeholder: 'Nombre de la playlist'
              }
            ]}
            buttons={[
              {
                text: 'Cancelar',
                role: 'cancel',
                cssClass: 'secondary',
              },
              {
                text: 'Crear',
                handler: (data) => {
                   handleCreatePlaylist(data.name);
                }
              }
            ]}
          />

          {/* Create Mood Modal */}
          <CreateMoodModal
            isOpen={showMoodModal}
            onClose={() => setShowMoodModal(false)}
            onCreated={handleMoodCreated}
          />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Library;
