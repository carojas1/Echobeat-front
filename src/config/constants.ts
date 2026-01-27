// Constantes de la aplicación EchoBeat

// 🎨 Imagen por defecto para covers de canciones (diseño elegante oscuro)
export const DEFAULT_COVER_IMAGE =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Cdefs%3E%3ClinearGradient id="bg" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%231a1a2e"%3E%3C/stop%3E%3Cstop offset="100%25" style="stop-color:%2316161a"%3E%3C/stop%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23bg)" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" font-size="48" text-anchor="middle" dy=".35em" fill="%23404040" font-family="Arial"%3E♪%3C/text%3E%3C/svg%3E';

// 📧 Emails de administradores
export const ADMIN_EMAIL = "carojas@sudamericano.edu.ec";
export const ADMIN_EMAILS = [
  "carojas@sudamericano.edu.ec",
  "andres2007benavides@gmail.com"
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
