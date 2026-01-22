// Backend API Configuration
import { getAuth } from 'firebase/auth';
import { authFetch } from './authFetch';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

// ==================== AUTH ====================

export function getCurrentUser() {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return null;
  
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
}

export function isAuthenticated(): boolean {
  const auth = getAuth();
  return !!auth.currentUser;
}

export function isAdmin(): boolean {
  const auth = getAuth();
  const user = auth.currentUser;
  return user?.email === "carojas@sudamericano.edu.ec";
}

export async function logout(): Promise<void> {
  const auth = getAuth();
  await auth.signOut();
  localStorage.removeItem("fb_token");
  localStorage.removeItem("user_email");
}

// ==================== SONGS ====================

export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  fileUrl: string;
  coverUrl?: string;
  genre?: string;
  playCount: number;
  mood?: string;
}

export async function getSongs(params?: {
  page?: number;
  limit?: number;
  q?: string;
  artist?: string;
}): Promise<{ data: Song[]; total: number }> {
  try {
    const queryParams = new URLSearchParams(
      Object.entries(params || {}).map(([k, v]) => [k, String(v)]),
    );
    const res = await authFetch(`${API_URL}/songs?${queryParams}`);
    if (!res.ok) throw new Error("Failed to fetch songs");
    return res.json();
  } catch {
    return { data: [], total: 0 };
  }
}

export async function getSongById(id: string): Promise<Song> {
  const res = await authFetch(`${API_URL}/songs/${id}`);
  if (!res.ok) throw new Error("Song not found");
  return res.json();
}

// ==================== ADMIN - USERS ====================

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: "USER" | "ADMIN";
  status: "ACTIVE" | "BLOCKED";
  avatar?: string;
  createdAt: string;
}

export async function getUsers(params?: {
  page?: number;
  limit?: number;
  q?: string;
  role?: string;
  status?: string;
}): Promise<{ data: User[]; total: number }> {
  try {
    const queryParams = new URLSearchParams(
      Object.entries(params || {}).map(([k, v]) => [k, String(v)]),
    );
    const res = await authFetch(`${API_URL}/admin/users?${queryParams}`);
    if (!res.ok) throw new Error("Failed to fetch users");
    return res.json();
  } catch {
    return { data: [], total: 0 };
  }
}

export async function updateUser(
  id: string,
  data: {
    displayName?: string;
    role?: "USER" | "ADMIN";
    status?: "ACTIVE" | "BLOCKED";
  },
): Promise<User> {
  const res = await authFetch(`${API_URL}/admin/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  
  if (!res.ok) throw new Error("Failed to update user");
  return res.json();
}

export async function deleteUser(id: string): Promise<void> {
  const res = await authFetch(`${API_URL}/admin/users/${id}`, {
    method: "DELETE",
  });
  
  if (!res.ok) throw new Error("Failed to delete user");
}

// ==================== SONGS - UPLOAD ====================

export async function uploadSong(formData: FormData): Promise<Song> {
  const res = await authFetch("http://localhost:3000/api/v1/songs/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

export async function deleteSong(id: string): Promise<void> {
  const res = await authFetch(`${API_URL}/admin/songs/${id}`, {
    method: "DELETE",
  });
  
  if (!res.ok) throw new Error("Failed to delete song");
}

export async function updateSong(
  id: string,
  data: {
    title?: string;
    artist?: string;
    album?: string;
  },
): Promise<Song> {
  const res = await authFetch(`${API_URL}/admin/songs/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  
  if (!res.ok) throw new Error("Failed to update song");
  return res.json();
}

// Export default as api object
const api = {
  getCurrentUser,
  isAuthenticated,
  isAdmin,
  logout,
  getSongs,
  getSongById,
  getUsers,
  updateUser,
  deleteUser,
  uploadSong,
  deleteSong,
  updateSong,
};

export default api;
