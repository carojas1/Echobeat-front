// Constantes de la aplicación EchoBeat

// 🎨 Imagen por defecto para covers de canciones (logo EchoBeat)
export const DEFAULT_COVER_IMAGE = '/echobeat-logo.png';

// 📧 Emails de administradores
export const ADMIN_EMAIL = "carojas@sudamericano.edu.ec";
export const ADMIN_EMAILS = [
  "carojas@sudamericano.edu.ec"
];

// 🔑 Keys de localStorage
export const STORAGE_KEYS = {
  SONGS: "echobeat_songs",
  USERS: "echobeat_users",
  TOKEN: "token",
  USER: "user",
  THEME: "echobeat_theme",
  FAVORITES: "echobeat_favorites",
} as const;

// 🎵 Tipos de archivos de audio permitidos
export const ALLOWED_AUDIO_FORMATS = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/ogg",
  "audio/m4a",
];

// 📊 Configuración de paginación
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// 🌐 URL del backend (configurable por ambiente)
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://echobeatback-production.up.railway.app/api/v1";

// 🎨 Géneros musicales
export const MUSIC_GENRES = [
  "Rock",
  "Pop",
  "Hip Hop",
  "Electronic",
  "Jazz",
  "Classical",
  "R&B",
  "Country",
  "Reggaeton",
  "Indie",
  "Metal",
  "Blues",
  "Soul",
  "Funk",
  "Disco",
] as const;

// 🎭 Estados de ánimo para el modo Mood
export const MOODS = [
  { id: "happy", name: "Feliz", emoji: "😊", color: "#FFD700" },
  { id: "energetic", name: "Energético", emoji: "⚡", color: "#FF4500" },
  { id: "chill", name: "Relajado", emoji: "😌", color: "#87CEEB" },
  { id: "sad", name: "Triste", emoji: "😢", color: "#4682B4" },
  { id: "romantic", name: "Romántico", emoji: "❤️", color: "#FF1493" },
  { id: "party", name: "Fiesta", emoji: "🎉", color: "#FF6347" },
] as const;

export type MoodId = (typeof MOODS)[number]["id"];
export type MusicGenre = (typeof MUSIC_GENRES)[number];
