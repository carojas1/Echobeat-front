import React, { useState, useEffect } from 'react';
import { IonContent, IonPage, IonIcon, IonSpinner } from '@ionic/react';
import { arrowBack, play, shuffle, musicalNotes, trashBin } from 'ionicons/icons';
import { useHistory, useParams } from 'react-router-dom';
import { usePlayer } from '../contexts/PlayerContext';
import { CustomMood } from '../components/CreateMoodModal';
import './CustomMoodPlaylist.css';

interface Song {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
}

const CustomMoodPlaylist: React.FC = () => {
  const history = useHistory();
  const { moodId } = useParams<{ moodId: string }>();
  const { currentSong, playSong } = usePlayer();
  const [mood, setMood] = useState<CustomMood | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user_custom_moods');
    if (stored) {
      const moods: CustomMood[] = JSON.parse(stored);
      const found = moods.find(m => m.id === moodId);
      if (found) {
        setMood(found);
      }
    }
    setLoading(false);
  }, [moodId]);

  const handlePlayAll = () => {
    if (mood && mood.songs.length > 0) {
      playSong(mood.songs[0]);
    }
  };

  const handleShuffle = () => {
    if (mood && mood.songs.length > 0) {
      const shuffled = [...mood.songs].sort(() => Math.random() - 0.5);
      playSong(shuffled[0]);
    }
  };

  const handleSongClick = (song: Song) => {
    playSong(song);
  };



  const removeSong = (e: React.MouseEvent, songId: string) => {
    e.stopPropagation();
    if (!mood) return;
    
    const updatedSongs = mood.songs.filter(s => s.id !== songId);
    const updatedMood = { ...mood, songs: updatedSongs };
    
    // Update in localStorage
    const stored = localStorage.getItem('user_custom_moods');
    if (stored) {
      const moods: CustomMood[] = JSON.parse(stored);
      const updated = moods.map(m => m.id === moodId ? updatedMood : m);
      localStorage.setItem('user_custom_moods', JSON.stringify(updated));
    }
    
    setMood(updatedMood);
  };

  if (loading) {
    return (
      <IonPage>
        <IonContent>
          <div className="custom-mood-loading">
            <IonSpinner name="crescent" />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  if (!mood) {
    return (
      <IonPage>
        <IonContent>
          <div className="custom-mood-error">
            <p>Ambiente no encontrado</p>
            <button onClick={() => history.goBack()}>Volver</button>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonContent>
        <div className="custom-mood-container">
          {/* Hero Section */}
          <div 
            className="mood-hero"
            style={{ 
              background: `linear-gradient(180deg, ${mood.color}40 0%, rgba(0, 0, 0, 0.95) 70%)`
            }}
          >
            {/* Back Button */}
            <button className="back-btn" onClick={() => history.goBack()}>
              <IonIcon icon={arrowBack} />
            </button>

            {/* Mood Info */}
            <div className="mood-info">
              <span className="mood-emoji">{mood.emoji}</span>
              <h1 className="mood-title">{mood.name}</h1>
              <p className="mood-subtitle">{mood.songs.length} canciones</p>
            </div>

            {/* Action Buttons */}
            <div className="mood-actions">
              <button 
                className="play-btn-large"
                style={{ backgroundColor: mood.color }}
                onClick={handlePlayAll}
                disabled={mood.songs.length === 0}
              >
                <IonIcon icon={play} />
              </button>
              <button 
                className="shuffle-btn"
                onClick={handleShuffle}
                disabled={mood.songs.length === 0}
              >
                <IonIcon icon={shuffle} />
              </button>
            </div>
          </div>

          {/* Songs List */}
          <div className="songs-section">
            {mood.songs.length === 0 ? (
              <div className="empty-songs">
                <IonIcon icon={musicalNotes} />
                <p>No hay canciones en este ambiente</p>
                <span>Edita el ambiente para añadir canciones</span>
              </div>
            ) : (
              <div className="songs-list">
                {mood.songs.map((song, index) => (
                  <div
                    key={song.id}
                    className={`song-row ${currentSong?.id === song.id ? 'playing' : ''}`}
                    onClick={() => handleSongClick(song)}
                  >
                    <span className="song-number">{index + 1}</span>
                    <div className="song-cover">
                      {song.coverUrl ? (
                        <img src={song.coverUrl} alt={song.title} />
                      ) : (
                        <div className="cover-placeholder">
                          <IonIcon icon={musicalNotes} />
                        </div>
                      )}
                      {currentSong?.id === song.id && (
                        <div className="now-playing-indicator">
                          <div className="bar"></div>
                          <div className="bar"></div>
                          <div className="bar"></div>
                        </div>
                      )}
                    </div>
                    <div className="song-info">
                      <h4 style={{ color: currentSong?.id === song.id ? mood.color : 'white' }}>
                        {song.title}
                      </h4>
                      <p>{song.artist}</p>
                    </div>
                    <button 
                      className="remove-song-btn"
                      onClick={(e) => removeSong(e, song.id)}
                    >
                      <IonIcon icon={trashBin} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CustomMoodPlaylist;
