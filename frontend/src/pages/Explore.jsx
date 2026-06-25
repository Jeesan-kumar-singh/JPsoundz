import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SongCard from '../components/SongCard';
import { Compass, Sparkles, Flame, Radio } from 'lucide-react';

const Explore = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('trending'); // trending | new
  const [selectedGenre, setSelectedGenre] = useState('All');

  const genres = ['All', 'Lofi', 'Synthwave', 'Hip-Hop', 'Indie Pop', 'Electronic', 'Ambient'];

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);
        const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await axios.get(`${backendUrl}/songs`);
        
        if (res.data.success) {
          setSongs(res.data.songs);
        } else {
          setError('Failed to fetch songs');
        }
      } catch (err) {
        console.error('Error fetching songs:', err);
        setError('Error connecting to JPSoundz servers.');
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  // Filter by genre first
  const genreFilteredSongs = selectedGenre === 'All' 
    ? songs 
    : songs.filter(song => song.genre.toLowerCase() === selectedGenre.toLowerCase());

  // Sort based on active tab
  const getProcessedSongs = () => {
    const songsToProcess = [...genreFilteredSongs];
    if (activeTab === 'trending') {
      // Sort by plays descending
      return songsToProcess.sort((a, b) => b.plays - a.plays);
    } else {
      // Sort by date descending
      return songsToProcess.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  };

  const processedSongs = getProcessedSongs();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
      {/* Hero Banner Section */}
      <div className="relative rounded-2xl overflow-hidden mb-10 bg-gradient-to-r from-brand-surfaceCard via-brand-surfaceHover to-brand-black border border-brand-border p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
        <div className="text-left md:max-w-xl z-10">
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-brand-green/10 text-brand-green border border-brand-green/20 mb-4 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Ready Music Hub</span>
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
            Discover the Future of <span className="text-brand-green">Independent Sound</span>
          </h1>
          <p className="text-brand-textMuted text-base md:text-lg mb-6 font-medium">
            Listen to original tracks, connect with visionary sound artists, and co-create next-gen masterpieces on JPSoundz.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2 bg-brand-black/40 border border-white/5 rounded-lg px-4 py-2">
              <span className="text-2xl font-bold text-white">3.2k</span>
              <span className="text-xs text-brand-textMuted font-medium">Global Artists</span>
            </div>
            <div className="flex items-center space-x-2 bg-brand-black/40 border border-white/5 rounded-lg px-4 py-2">
              <span className="text-2xl font-bold text-white">12.5k</span>
              <span className="text-xs text-brand-textMuted font-medium">Tracks Created</span>
            </div>
          </div>
        </div>

        {/* Decorative Graphic */}
        <div className="relative mt-8 md:mt-0 flex items-center justify-center">
          <div className="w-48 h-48 rounded-full bg-brand-green/5 border border-brand-green/10 absolute animate-pulse"></div>
          <div className="w-36 h-36 rounded-full bg-brand-green/10 border border-brand-green/20 absolute flex items-center justify-center shadow-glow-green">
            <Radio className="w-16 h-16 text-brand-green animate-bounce" />
          </div>
        </div>
      </div>

      {/* Filter and Tab Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-brand-border pb-5 mb-8 gap-4">
        
        {/* Category Tabs (Trending / New Releases) */}
        <div className="flex bg-brand-surfaceCard border border-brand-border p-1 rounded-xl w-fit self-start">
          <button
            onClick={() => setActiveTab('trending')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
              activeTab === 'trending'
                ? 'bg-brand-green text-black shadow-glow-green'
                : 'text-brand-textMuted hover:text-white'
            }`}
          >
            <Flame className="w-4 h-4 fill-current" />
            <span>Trending</span>
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
              activeTab === 'new'
                ? 'bg-brand-green text-black shadow-glow-green'
                : 'text-brand-textMuted hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>New Releases</span>
          </button>
        </div>

        {/* Genre Chips list */}
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-300 ${
                selectedGenre === genre
                  ? 'bg-brand-green/10 text-brand-green border-brand-green/45 shadow-glow-green/10'
                  : 'bg-brand-surfaceCard border-brand-border text-brand-textMuted hover:text-white hover:border-brand-border/60'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid View */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 rounded-full border-4 border-brand-border border-t-brand-green animate-spin mb-4" />
          <p className="text-brand-textMuted font-medium">Tuning into audio streams...</p>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center text-red-400 max-w-md mx-auto">
          <p className="font-semibold">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : processedSongs.length === 0 ? (
        <div className="text-center py-20 bg-brand-surfaceCard rounded-2xl border border-brand-border p-8 max-w-xl mx-auto">
          <Compass className="w-12 h-12 text-brand-green/40 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">No tracks discovered</h3>
          <p className="text-brand-textMuted text-sm">
            We couldn't find any {selectedGenre !== 'All' ? selectedGenre : ''} songs matching the criteria. Be the first to upload one!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {processedSongs.map((song) => (
            <SongCard key={song._id} song={song} playlistQueue={processedSongs} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Explore;
