/**
 * Firestore Service - EchoBeat
 * 
 * Servicio centralizado para todas las operaciones de Firestore y Storage
 * Reemplaza las llamadas al backend NestJS con operaciones directas a Firebase
 */

import { db, storage, auth } from '../firebase/config';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    setDoc,
    query,
    where,
    orderBy,
    limit,
    Timestamp,
    increment,
    DocumentData,
} from 'firebase/firestore';
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
} from 'firebase/storage';

// ==================== TYPES ====================

export interface Song {
    id: string;
    title: string;
    artist: string;
    album?: string;
    duration: number; // segundos
    genre?: string;
    coverUrl?: string;
    audioUrl: string;
    uploadedBy: string;
    uploadedByName: string;
    plays: number;
    likes: number;
    isPublic: boolean;
    createdAt: any; // Timestamp
}

export interface Playlist {
    id: string;
    userId: string;
    name: string;
    description?: string;
    coverUrl?: string;
    isPublic: boolean;
    songs: PlaylistSong[];
    songCount: number;
    followers: number;
    createdAt: any;
    updatedAt: any;
}

export interface PlaylistSong {
    songId: string;
    addedAt: any; // Timestamp
    position: number;
}

export interface UserProfile {
    id: string;
    email: string;
    displayName: string;
    avatarUrl?: string;
    bio?: string;
    premium: boolean;
    favoriteGenres?: string[];
    followingCount: number;
    followersCount: number;
    createdAt: any;
}

// ==================== SONGS ====================

/**
 * Obtener todas las canciones públicas
 */
export const getAllSongs = async (): Promise<Song[]> => {
    try {
        const songsRef = collection(db, 'songs');
        const q = query(
            songsRef,
            where('isPublic', '==', true),
            orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Song));
    } catch (error) {
        console.error('Error getting songs:', error);
        throw error;
    }
};

/**
 * Obtener canción por ID
 */
export const getSongById = async (songId: string): Promise<Song> => {
    try {
        const songRef = doc(db, 'songs', songId);
        const snapshot = await getDoc(songRef);
        
        if (!snapshot.exists()) {
            throw new Error('Song not found');
        }
        
        return {
            id: snapshot.id,
            ...snapshot.data()
        } as Song;
    } catch (error) {
        console.error('Error getting song:', error);
        throw error;
    }
};

/**
 * Buscar canciones por título o artista
 * NOTA: Firestore no tiene full-text search nativo, esto filtra en el cliente
 */
export const searchSongs = async (searchQuery: string): Promise<Song[]> => {
    try {
        const songsRef = collection(db, 'songs');
        const snapshot = await getDocs(songsRef);
        
        const results = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() } as Song))
            .filter((song: Song) =>
                song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (song.album && song.album.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        
        return results;
    } catch (error) {
        console.error('Error searching songs:', error);
        throw error;
    }
};

/**
 * Subir canción (MP3 + metadata)
 */
export const uploadSong = async (
    file: File,
    metadata: {
        title: string;
        artist: string;
        album?: string;
        genre?: string;
        duration: number;
    },
    coverFile?: File
): Promise<string> => {
    if (!auth.currentUser) {
        throw new Error('Not authenticated');
    }
    
    try {
        // 1. Crear documento inicial en Firestore
        const songRef = await addDoc(collection(db, 'songs'), {
            ...metadata,
            uploadedBy: auth.currentUser.uid,
            uploadedByName: auth.currentUser.displayName || 'Unknown',
            plays: 0,
            likes: 0,
            isPublic: true,
            createdAt: Timestamp.now(),
            audioUrl: '',
            coverUrl: ''
        });
        
        // 2. Subir archivo MP3 a Storage
        const audioStorageRef = ref(storage, `songs/${songRef.id}.mp3`);
        await uploadBytes(audioStorageRef, file);
        const audioUrl = await getDownloadURL(audioStorageRef);
        
        // 3. Subir cover si existe
        let coverUrl = '';
        if (coverFile) {
            const coverStorageRef = ref(storage, `covers/${songRef.id}.jpg`);
            await uploadBytes(coverStorageRef, coverFile);
            coverUrl = await getDownloadURL(coverStorageRef);
        }
        
        // 4. Actualizar documento con URLs
        await updateDoc(songRef, {
            audioUrl,
            ...(coverUrl && { coverUrl })
        });
        
        return songRef.id;
    } catch (error) {
        console.error('Error uploading song:', error);
        throw error;
    }
};

/**
 * Incrementar contador de reproducciones
 */
export const incrementPlayCount = async (songId: string): Promise<void> => {
    try {
        const songRef = doc(db, 'songs', songId);
        await updateDoc(songRef, {
            plays: increment(1)
        });
    } catch (error) {
        console.error('Error incrementing play count:', error);
        // No lanzar error, es una operación secundaria
    }
};

/**
 * Eliminar canción (solo el creador)
 */
export const deleteSong = async (songId: string): Promise<void> => {
    if (!auth.currentUser) throw new Error('Not authenticated');
    
    try {
        const songRef = doc(db, 'songs', songId);
        const songSnap = await getDoc(songRef);
        
        if (!songSnap.exists()) {
            throw new Error('Song not found');
        }
        
        const songData = songSnap.data();
        
        // Verificar que el usuario es el creador
        if (songData.uploadedBy !== auth.currentUser.uid) {
            throw new Error('Unauthorized');
        }
        
        // Eliminar archivos de Storage
        try {
            const audioRef = ref(storage, `songs/${songId}.mp3`);
            await deleteObject(audioRef);
        } catch (e) {
            console.warn('Audio file not found in storage');
        }
        
        if (songData.coverUrl) {
            try {
                const coverRef = ref(storage, `covers/${songId}.jpg`);
                await deleteObject(coverRef);
            } catch (e) {
                console.warn('Cover file not found in storage');
            }
        }
        
        // Eliminar documento
        await deleteDoc(songRef);
    } catch (error) {
        console.error('Error deleting song:', error);
        throw error;
    }
};

// ==================== PLAYLISTS ====================

/**
 * Obtener playlists del usuario actual
 */
export const getMyPlaylists = async (): Promise<Playlist[]> => {
    if (!auth.currentUser) throw new Error('Not authenticated');
    
    try {
        const playlistsRef = collection(db, 'playlists');
        const q = query(
            playlistsRef,
            where('userId', '==', auth.currentUser.uid),
            orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Playlist));
    } catch (error) {
        console.error('Error getting playlists:', error);
        throw error;
    }
};

/**
 * Obtener playlist por ID
 */
export const getPlaylistById = async (playlistId: string): Promise<Playlist> => {
    try {
        const playlistRef = doc(db, 'playlists', playlistId);
        const snapshot = await getDoc(playlistRef);
        
        if (!snapshot.exists()) {
            throw new Error('Playlist not found');
        }
        
        return {
            id: snapshot.id,
            ...snapshot.data()
        } as Playlist;
    } catch (error) {
        console.error('Error getting playlist:', error);
        throw error;
    }
};

/**
 * Crear nueva playlist
 */
export const createPlaylist = async (data: {
    name: string;
    description?: string;
    isPublic?: boolean;
}): Promise<string> => {
    if (!auth.currentUser) throw new Error('Not authenticated');
    
    try {
        const playlistRef = await addDoc(collection(db, 'playlists'), {
            ...data,
            userId: auth.currentUser.uid,
            songs: [],
            songCount: 0,
            followers: 0,
            isPublic: data.isPublic ?? true,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        });
        
        return playlistRef.id;
    } catch (error) {
        console.error('Error creating playlist:', error);
        throw error;
    }
};

/**
 * Agregar canción a playlist
 */
export const addSongToPlaylist = async (
    playlistId: string,
    songId: string
): Promise<void> => {
    if (!auth.currentUser) throw new Error('Not authenticated');
    
    try {
        const playlistRef = doc(db, 'playlists', playlistId);
        const playlistSnap = await getDoc(playlistRef);
        
        if (!playlistSnap.exists()) {
            throw new Error('Playlist not found');
        }
        
        const playlistData = playlistSnap.data();
        
        // Verificar que el usuario es el dueño
        if (playlistData.userId !== auth.currentUser.uid) {
            throw new Error('Unauthorized');
        }
        
        const currentSongs = playlistData.songs || [];
        
        // Verificar si la canción ya existe
        const songExists = currentSongs.some(
            (s: PlaylistSong) => s.songId === songId
        );
        
        if (songExists) {
            throw new Error('Song already in playlist');
        }
        
        await updateDoc(playlistRef, {
            songs: [...currentSongs, {
                songId,
                addedAt: Timestamp.now(),
                position: currentSongs.length
            }],
            songCount: increment(1),
            updatedAt: Timestamp.now()
        });
    } catch (error) {
        console.error('Error adding song to playlist:', error);
        throw error;
    }
};

/**
 * Quitar canción de playlist
 */
export const removeSongFromPlaylist = async (
    playlistId: string,
    songId: string
): Promise<void> => {
    if (!auth.currentUser) throw new Error('Not authenticated');
    
    try {
        const playlistRef = doc(db, 'playlists', playlistId);
        const playlistSnap = await getDoc(playlistRef);
        
        if (!playlistSnap.exists()) {
            throw new Error('Playlist not found');
        }
        
        const playlistData = playlistSnap.data();
        
        if (playlistData.userId !== auth.currentUser.uid) {
            throw new Error('Unauthorized');
        }
        
        const currentSongs = playlistData.songs || [];
        const updatedSongs = currentSongs.filter(
            (s: PlaylistSong) => s.songId !== songId
        );
        
        await updateDoc(playlistRef, {
            songs: updatedSongs,
            songCount: updatedSongs.length,
            updatedAt: Timestamp.now()
        });
    } catch (error) {
        console.error('Error removing song from playlist:', error);
        throw error;
    }
};

/**
 * Eliminar playlist
 */
export const deletePlaylist = async (playlistId: string): Promise<void> => {
    if (!auth.currentUser) throw new Error('Not authenticated');
    
    try {
        const playlistRef = doc(db, 'playlists', playlistId);
        const playlistSnap = await getDoc(playlistRef);
        
        if (!playlistSnap.exists()) {
            throw new Error('Playlist not found');
        }
        
        const playlistData = playlistSnap.data();
        
        if (playlistData.userId !== auth.currentUser.uid) {
            throw new Error('Unauthorized');
        }
        
        await deleteDoc(playlistRef);
    } catch (error) {
        console.error('Error deleting playlist:', error);
        throw error;
    }
};

// ==================== FAVORITES ====================

/**
 * Obtener favoritos del usuario actual
 */
export const getFavorites = async (): Promise<any[]> => {
    if (!auth.currentUser) throw new Error('Not authenticated');
    
    try {
        const favoritesRef = collection(db, `users/${auth.currentUser.uid}/favorites`);
        const snapshot = await getDocs(favoritesRef);
        
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error getting favorites:', error);
        throw error;
    }
};

/**
 * Agregar canción a favoritos
 */
export const addFavorite = async (songId: string, songData: Song): Promise<void> => {
    if (!auth.currentUser) throw new Error('Not authenticated');
    
    try {
        const favoriteRef = doc(db, `users/${auth.currentUser.uid}/favorites`, songId);
        await setDoc(favoriteRef, {
            songId,
            songTitle: songData.title,
            songArtist: songData.artist,
            songCoverUrl: songData.coverUrl || '',
            addedAt: Timestamp.now()
        });
    } catch (error) {
        console.error('Error adding favorite:', error);
        throw error;
    }
};

/**
 * Quitar canción de favoritos
 */
export const removeFavorite = async (songId: string): Promise<void> => {
    if (!auth.currentUser) throw new Error('Not authenticated');
    
    try {
        const favoriteRef = doc(db, `users/${auth.currentUser.uid}/favorites`, songId);
        await deleteDoc(favoriteRef);
    } catch (error) {
        console.error('Error removing favorite:', error);
        throw error;
    }
};

/**
 * Verificar si una canción es favorita
 */
export const isFavorite = async (songId: string): Promise<boolean> => {
    if (!auth.currentUser) return false;
    
    try {
        const favoriteRef = doc(db, `users/${auth.currentUser.uid}/favorites`, songId);
        const snapshot = await getDoc(favoriteRef);
        return snapshot.exists();
    } catch (error) {
        console.error('Error checking favorite:', error);
        return false;
    }
};

// ==================== USERS ====================

/**
 * Obtener perfil de usuario
 */
export const getUserProfile = async (userId: string): Promise<UserProfile> => {
    try {
        const userRef = doc(db, 'users', userId);
        const snapshot = await getDoc(userRef);
        
        if (!snapshot.exists()) {
            throw new Error('User not found');
        }
        
        return {
            id: snapshot.id,
            ...snapshot.data()
        } as UserProfile;
    } catch (error) {
        console.error('Error getting user profile:', error);
        throw error;
    }
};

/**
 * Crear o actualizar perfil de usuario
 * Se llama después del registro con Firebase Auth
 */
export const createOrUpdateUserProfile = async (data: {
    email: string;
    displayName: string;
    avatarUrl?: string;
}): Promise<void> => {
    if (!auth.currentUser) throw new Error('Not authenticated');
    
    try {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
            // Actualizar usuario existente
            await updateDoc(userRef, data);
        } else {
            // Crear nuevo usuario
            await setDoc(userRef, {
                ...data,
                premium: false,
                favoriteGenres: [],
                followingCount: 0,
                followersCount: 0,
                createdAt: Timestamp.now()
            });
        }
    } catch (error) {
        console.error('Error creating/updating user profile:', error);
        throw error;
    }
};

/**
 * Actualizar perfil de usuario
 */
export const updateUserProfile = async (data: {
    displayName?: string;
    bio?: string;
    avatarUrl?: string;
}): Promise<void> => {
    if (!auth.currentUser) throw new Error('Not authenticated');
    
    try {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, data);
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
};

/**
 * Subir avatar de usuario
 */
export const uploadAvatar = async (file: File): Promise<string> => {
    if (!auth.currentUser) throw new Error('Not authenticated');
    
    try {
        const avatarRef = ref(storage, `avatars/${auth.currentUser.uid}/avatar.jpg`);
        await uploadBytes(avatarRef, file);
        const avatarUrl = await getDownloadURL(avatarRef);
        
        // Actualizar perfil con nueva URL
        await updateUserProfile({ avatarUrl });
        
        return avatarUrl;
    } catch (error) {
        console.error('Error uploading avatar:', error);
        throw error;
    }
};

// ==================== HELPERS ====================

/**
 * Convertir segundos a formato MM:SS
 */
export const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Obtener información completa de canciones en una playlist
 */
export const getPlaylistSongsDetails = async (playlistId: string): Promise<Song[]> => {
    try {
        const playlist = await getPlaylistById(playlistId);
        const songPromises = playlist.songs.map(ps => getSongById(ps.songId));
        return await Promise.all(songPromises);
    } catch (error) {
        console.error('Error getting playlist songs details:', error);
        return [];
    }
};
