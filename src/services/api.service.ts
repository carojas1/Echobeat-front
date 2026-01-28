// Backend API Configuration
import { getAuth } from "firebase/auth";
import { authFetch } from "./auth-fetch";

const API_URL = import.meta.env.VITE_API_URL || "https://echobeatback-production.up.railway.app/api/v1";

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
  const ADMIN_EMAILS = [
    "carojas@sudamericano.edu.ec"
  ];
  return user?.email ? ADMIN_EMAILS.includes(user.email) : false;
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
    // ✅ Usar fetch normal (público, sin auth)
    const res = await fetch(`${API_URL}/songs?${queryParams}`);
    if (!res.ok) throw new Error("Failed to fetch songs");
    const json = await res.json();
    console.log("🔍 Backend response:", json);
    
    // ✅ Manejar formato: { success, data: { songs: [...] } }
    const songs = json?.data?.songs || json?.songs || json?.data || [];
    const total = json?.data?.total || json?.total || songs.length;
    
    return { data: songs, total };
  } catch (e) {
    console.error("❌ getSongs error:", e);
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

export interface FirebaseUser {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  metadata?: {
    creationTime?: string;
    lastSignInTime?: string;
  };
  disabled: boolean;
}

// Get users from PostgreSQL (Sync status)
export async function getUsers(params?: {
  page?: number;
  limit?: number;
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

interface FirebaseUserResponse {
  data?: { users: any[] };
  users?: any[];
}

// Get raw Firebase Users (The "Real" list)
export async function getFirebaseUsers(): Promise<FirebaseUserResponse | any> {
  try {
    const res = await authFetch(`${API_URL}/admin/firebase-users`);
    if (!res.ok) throw new Error("Failed to fetch firebase users");
    return res.json();
  } catch {
    console.warn("Using mock users due to API error");
    return { users: [] };
  }
}

// Delete Firebase User
export async function deleteFirebaseUser(uid: string): Promise<void> {
  const res = await authFetch(`${API_URL}/admin/firebase-users/${uid}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete firebase user");
}

// Toggle Block/Unblock (Disable in Firebase)
export async function toggleFirebaseUser(uid: string, disabled: boolean): Promise<void> {
   const res = await authFetch(`${API_URL}/admin/firebase-users/${uid}/status`, {
    method: "PATCH",
    body: JSON.stringify({ disabled })
  });
  if (!res.ok) throw new Error("Failed to toggle user status");
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

// ==================== SUPPORT ====================

export interface SupportMessage {
    id: string;
    userId: string;
    userEmail: string;
    message: string;
    createdAt: string;
    isAdmin?: boolean; // True if sent by admin
    status: 'PENDING' | 'REPLIED';
}

// Admin: Get all messages
export async function getSupportMessages(): Promise<{ data: { messages: SupportMessage[] } } | any> {
    try {
        const res = await authFetch(`${API_URL}/admin/support/messages`);
        if (!res.ok) return { data: { messages: [] } };
        return res.json();
    } catch {
        return { data: { messages: [] } };
    }
}

// Admin: Reply to user
export async function sendAdminSupportReply(data: { targetUserId: string, message: string }): Promise<void> {
    const res = await authFetch(`${API_URL}/admin/support/reply`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to send reply');
}

// User: Send message
export async function sendSupportMessage(data: { userId: string, message: string, userEmail: string }): Promise<void> {
    const res = await authFetch(`${API_URL}/support/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to send message');
}

// User: Get my history
export async function getUserSupportMessages(): Promise<SupportMessage[]> {
    try {
        const res = await authFetch(`${API_URL}/support/messages`);
        if (!res.ok) return [];
        const json = await res.json();
        // Handle potential nested data structure similar to admin
        if (json.data && Array.isArray(json.data.messages)) return json.data.messages;
        if (json.data && Array.isArray(json.data)) return json.data;
        if (Array.isArray(json)) return json;
        return [];
    } catch {
        return [];
    }
}


// ==================== SONGS - UPLOAD ====================

export async function uploadSong(formData: FormData): Promise<Song> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 60000); // 60s

  try {
    const res = await authFetch("https://echobeatback-production.up.railway.app/api/v1/songs/upload", {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });

    if (res.status === 401) throw new Error("Sesión expirada. Inicia sesión.");
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `Error ${res.status}`);
    }
    return await res.json();
  } catch (e: unknown) {
    if (e instanceof Error && e.name === "AbortError") {
      throw new Error(
        "Upload tardó demasiado (timeout). Revisa backend/Cloudinary.",
      );
    }
    throw e;
  } finally {
    window.clearTimeout(timeout);
  }
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
  // Support
  getSupportMessages,
  sendAdminSupportReply,
  sendSupportMessage,
  getUserSupportMessages,
  // Songs
  uploadSong,
  deleteSong,
  updateSong,
};

export default api;
