import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';

const AudioContext = createContext(undefined);

export const AudioProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  
  const audioRef = useRef(null);

  // Initialize Audio Object on mount
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;

    const audio = audioRef.current;

    // Audio event listeners
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      // Handle auto-advance
      nextSong();
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.pause();
    };
  }, [playlist, currentSong]); // depend on playlist and currentSong to have access to correct state references

  // Synchronize audio volume state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Track the play function to register increment in server
  const trackPlayOnServer = async (songId) => {
    try {
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      await axios.post(`${backendUrl}/songs/${songId}/play`);
    } catch (err) {
      console.warn('Could not register play analytics on server:', err.message);
    }
  };

  // Play a specific song and optionally load a playlist queue
  const playSong = (song, customPlaylist = []) => {
    if (!song || !audioRef.current) return;

    const isSameSong = currentSong && currentSong._id === song._id;

    if (customPlaylist.length > 0) {
      setPlaylist(customPlaylist);
    } else if (playlist.length === 0) {
      setPlaylist([song]);
    }

    if (isSameSong) {
      // Toggle play/pause if clicking the same song
      togglePlay();
    } else {
      // Play new song
      audioRef.current.src = song.audioUrl;
      audioRef.current.load();
      
      setCurrentSong(song);
      setIsPlaying(true);
      setCurrentTime(0);

      // Play audio and handle browser autoplay policy
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error('Autoplay prevented or audio load failed:', error);
          setIsPlaying(false);
        });
      }

      // Track play in background
      trackPlayOnServer(song._id);
    }
  };

  // Toggle play/pause state
  const togglePlay = () => {
    if (!audioRef.current || !currentSong) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(err => console.error("Playback error:", err));
      setIsPlaying(true);
    }
  };

  // Move to next song in playlist queue
  const nextSong = () => {
    if (playlist.length === 0 || !currentSong) return;

    const currentIndex = playlist.findIndex((s) => s._id === currentSong._id);
    if (currentIndex === -1) return;

    const nextIndex = (currentIndex + 1) % playlist.length;
    playSong(playlist[nextIndex]);
  };

  // Move to previous song in playlist queue
  const prevSong = () => {
    if (playlist.length === 0 || !currentSong) return;

    const currentIndex = playlist.findIndex((s) => s._id === currentSong._id);
    if (currentIndex === -1) return;

    // Loop backwards
    const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    playSong(playlist[prevIndex]);
  };

  // Seek to specific timestamp (0 to duration)
  const seek = (time) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  // Adjust volume levels (0.0 to 1.0)
  const changeVolume = (val) => {
    const parsedVal = Math.max(0, Math.min(1, parseFloat(val)));
    setVolume(parsedVal);
    if (parsedVal > 0) {
      setIsMuted(false);
    }
  };

  // Toggle mute status
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <AudioContext.Provider
      value={{
        currentSong,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        playlist,
        playSong,
        togglePlay,
        nextSong,
        prevSong,
        seek,
        changeVolume,
        toggleMute,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
