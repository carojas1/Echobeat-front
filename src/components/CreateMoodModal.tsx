import React, { useState, useEffect } from 'react';
import { IonIcon, IonSpinner } from '@ionic/react';
import { close, add, musicalNotes, checkmark } from 'ionicons/icons';
import { getSongs } from '../services/api.service';
import './CreateMoodModal.css';

interface Song {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
}

export interface CustomMood {
  id: string;
  name: string;
  emoji: string;
  color: string;
  songs: Song[];
  createdAt: number;
}

interface CreateMoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (mood: CustomMood) => void;
}

const EMOJI_OPTIONS = ['🎵', '🎸', '🎹', '🎤', '💫', '✨', '🌙', '☀️', '🔥', '💜', '💙', '💚', '❤️', '🧡', '💛', '🖤', '🌈', '⭐', '🎧', '🎶'];

const COLOR_OPTIONS = [
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#EF4444', // Red
  '#F97316', // Orange
  '#EAB308', // Yellow
  '#22C55E', // Green
  '#06B6D4', // Cyan
  '#6366F1', // Indigo
  '#A855F7', // Violet
];

const CreateMoodModal: React.FC<CreateMoodModalProps> = ({ isOpen, onClose, onCreated }) => {
  const [name, setName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🎵');
  const [selectedColor, setSelectedColor] = useState('#3B82F6');
  const [availableSongs, setAvailableSongs] = useState<Song[]>([]);
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSongs, setLoadingSongs] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadAvailableSongs();
    }
  }, [isOpen]);

  const loadAvailableSongs = async () => {
    setLoadingSongs(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await getSongs({ page: 1, limit: 100 });
      const raw = Array.isArray(response?.data) ? response.data : 
                  Array.isArray(response?.items) ? response.items : 
                  Array.isArray(response) ? response : [];
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const songs = raw.map((s: any) => ({
        id: String(s.id),
        title: String(s.title || ''),
        artist: String(s.artist || ''),
        coverUrl: s.coverUrl || '',
        audioUrl: s.fileUrl || s.audioUrl || '',
      })).filter((s: Song) => s.id && s.title);

      setAvailableSongs(songs);
    } catch (error) {
      console.error('Error loading songs:', error);
    } finally {
      setLoadingSongs(false);
    }
  };

  const toggleSong = (song: Song) => {
    if (selectedSongs.find(s => s.id === song.id)) {
      setSelectedSongs(selectedSongs.filter(s => s.id !== song.id));
    } else {
      setSelectedSongs([...selectedSongs, song]);
    }
  };

  const handleCreate = () => {
    if (!name.trim()) return;
    
    setLoading(true);
    
    const newMood: CustomMood = {
      id: `custom_mood_${Date.now()}`,
      name: name.trim(),
      emoji: selectedEmoji,
      color: selectedColor,
      songs: selectedSongs,
      createdAt: Date.now(),
    };

    // Save to localStorage
    const stored = localStorage.getItem('user_custom_moods');
    const existing = stored ? JSON.parse(stored) : [];
    localStorage.setItem('user_custom_moods', JSON.stringify([newMood, ...existing]));

    setLoading(false);
    onCreated(newMood);
    
    // Reset form
    setName('');
    setSelectedEmoji('🎵');
    setSelectedColor('#3B82F6');
    setSelectedSongs([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="create-mood-overlay" onClick={onClose}>
      <div className="create-mood-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2>Crear Ambiente</h2>
          <button className="close-btn" onClick={onClose}>
            <IonIcon icon={close} />
          </button>
        </div>

        {/* Name Input */}
        <div className="input-group">
          <label>Nombre del ambiente</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Ej: Noches de estudio"
            className="mood-name-input"
          />
        </div>

        {/* Emoji Selector */}
        <div className="input-group">
          <label>Elige un emoji</label>
          <div className="emoji-grid">
            {EMOJI_OPTIONS.map(emoji => (
              <button
                key={emoji}
                className={`emoji-btn ${selectedEmoji === emoji ? 'selected' : ''}`}
                onClick={() => setSelectedEmoji(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Color Selector */}
        <div className="input-group">
          <label>Elige un color</label>
          <div className="color-grid">
            {COLOR_OPTIONS.map(color => (
              <button
                key={color}
                className={`color-btn ${selectedColor === color ? 'selected' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
              >
                {selectedColor === color && <IonIcon icon={checkmark} />}
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="mood-preview">
          <div 
            className="preview-card"
            style={{ 
              background: `linear-gradient(135deg, ${selectedColor}20 0%, rgba(20, 20, 30, 0.95) 60%)`,
              borderColor: `${selectedColor}40`
            }}
          >
            <span className="preview-emoji">{selectedEmoji}</span>
            <span className="preview-name">{name || 'Mi ambiente'}</span>
          </div>
        </div>

        {/* Songs Selector */}
        <div className="input-group songs-section">
          <label>
            Añadir canciones 
            <span className="song-count">({selectedSongs.length} seleccionadas)</span>
          </label>
          
          {loadingSongs ? (
            <div className="songs-loading">
              <IonSpinner name="crescent" />
            </div>
          ) : availableSongs.length === 0 ? (
            <div className="no-songs">
              <IonIcon icon={musicalNotes} />
              <p>No hay canciones disponibles</p>
            </div>
          ) : (
            <div className="songs-list">
              {availableSongs.map(song => (
                <div 
                  key={song.id}
                  className={`song-item ${selectedSongs.find(s => s.id === song.id) ? 'selected' : ''}`}
                  onClick={() => toggleSong(song)}
                >
                  <div className="song-cover">
                    {song.coverUrl ? (
                      <img src={song.coverUrl} alt={song.title} />
                    ) : (
                      <div className="cover-placeholder">
                        <IonIcon icon={musicalNotes} />
                      </div>
                    )}
                  </div>
                  <div className="song-info">
                    <h4>{song.title}</h4>
                    <p>{song.artist}</p>
                  </div>
                  <div className="song-check">
                    {selectedSongs.find(s => s.id === song.id) && (
                      <IonIcon icon={checkmark} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Button */}
        <button 
          className="create-btn"
          onClick={handleCreate}
          disabled={!name.trim() || loading}
          style={{ backgroundColor: selectedColor }}
        >
          {loading ? (
            <IonSpinner name="crescent" />
          ) : (
            <>
              <IonIcon icon={add} />
              <span>Crear Ambiente</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CreateMoodModal;
