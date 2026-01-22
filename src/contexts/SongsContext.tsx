import React, { createContext, useContext, useState, ReactNode } from "react";

interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  fileUrl: string;
  coverUrl?: string;
  duration: number;
  playCount: number;
}

// No demo songs - all songs come from backend
const INITIAL_SONGS: Song[] = [];

interface SongsContextType {
  songs: Song[];
  addSong: (song: Song) => void;
  removeSong: (id: string) => void;
  getSongsByMood: (mood: string) => Song[];
}

const SongsContext = createContext<SongsContextType | undefined>(undefined);

export const SongsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [songs, setSongs] = useState<Song[]>(INITIAL_SONGS);

  const addSong = (song: Song) => {
    setSongs((prev) => [song, ...prev]);
  };

  const removeSong = (id: string) => {
    setSongs((prev) => prev.filter((s) => s.id !== id));
  };

  // Get songs by mood type based on genre/album
  const getSongsByMood = (): Song[] => {
    // For now, return all songs. In the future, this can filter by genre/mood.
    return songs;
  };

  return (
    <SongsContext.Provider
      value={{ songs, addSong, removeSong, getSongsByMood }}
    >
      {children}
    </SongsContext.Provider>
  );
};

export const useSongs = () => {
  const context = useContext(SongsContext);
  if (!context) {
    throw new Error("useSongs must be used within SongsProvider");
  }
  return context;
};

export type { Song };
