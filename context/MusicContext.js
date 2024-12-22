// /context/MusicContext.js

import React, { createContext, useState, useContext } from 'react';

// Create a Music Context
const MusicContext = createContext();

// MusicProvider component to wrap around your app and provide the music state
export const MusicProvider = ({ children }) => {
  const [songs, setSongs] = useState([]); // Store songs in state

  // Add song function
  const addSong = (song) => {
    setSongs((prevSongs) => [...prevSongs, song]);
  };

  // Delete song function
  const deleteSong = (id) => {
    setSongs((prevSongs) => prevSongs.filter((song) => song.id !== id));
  };

  // Update song name
  const updateSongName = (id, newName) => {
    setSongs((prevSongs) =>
      prevSongs.map((song) =>
        song.id === id ? { ...song, name: newName } : song
      )
    );
  };

  return (
    <MusicContext.Provider value={{ songs, addSong, deleteSong, updateSongName }}>
      {children}
    </MusicContext.Provider>
  );
};

// Custom hook to use music context in components
export const useMusic = () => {
  return useContext(MusicContext);
};
