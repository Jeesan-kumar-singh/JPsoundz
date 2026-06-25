import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UploadCloud, Music, Play, Pause, Headphones, FileAudio, LayoutDashboard, ShieldAlert, Sparkles, Image } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

const ArtistDashboard = () => {
  const navigate = useNavigate();
  const { currentSong, isPlaying, playSong } = useAudio();

  // User state
  const token = localStorage.getItem('token');
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const isLoggedIn = !!token && !!user;

  // Track list and status states
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form inputs states
  const [title, setTitle] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [audioUrl, setAudioUrl] = useState('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'); // Populate helper default for testing
  const [genre, setGenre] = useState('Lofi');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const genres = ['Lofi', 'Synthwave', 'Hip-Hop', 'Indie Pop', 'Electronic', 'Rock', 'Ambient', 'Other'];

  useEffect(() => {
    // Redirect if not logged in
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    // Redirect if logged in but not an artist
    if (user.role !== 'artist') {
      return; // Handled in render below
    }

    const fetchMySongs = async () => {
      try {
        setLoading(true);
        const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await axios.get(`${backendUrl}/songs`);
        
        if (res.data.success) {
          // Filter songs owned by this artist
          const mySongs = res.data.songs.filter(
            (song) => song.artist?._id === user._id || song.artist === user._id
          );
          setSongs(mySongs);
        }
      } catch (err) {
        console.error('Error fetching artist songs:', err);
        setError('Could not load your uploaded tracks.');
      } finally {
        setLoading(false);
      }
    };

    fetchMySongs();
  }, [isLoggedIn, navigate, user?._id, user?.role]);

  // Form submission handler
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title || !audioUrl) {
      setUploadError('Title and Audio URL are required');
      return;
    }

    try {
      setUploadError('');
      setUploadSuccess(false);
      setUploading(true);

      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await axios.post(
        `${backendUrl}/songs`,
        {
          title,
          coverImage: coverImage || undefined,
          audioUrl,
          genre,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setUploadSuccess(true);
        // Prepend new song to list
        setSongs([res.data.song, ...songs]);
        
        // Reset form controls
        setTitle('');
        setCoverImage('');
        setAudioUrl('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3');
        setGenre('Lofi');
      } else {
        setUploadError(res.data.message || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      setUploadError(err.response?.data?.message || 'Error uploading metadata to server.');
    } finally {
      setUploading(false);
    }
  };

  // Safe checks for non-artist roles
  if (isLoggedIn && user.role !== 'artist') {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 pb-32">
        <div className="glassmorphic rounded-2xl p-8 border border-brand-border text-center">
          <ShieldAlert className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-brand-textMuted text-sm mb-6">
            The Artist Dashboard is reserved for creator accounts. Your current profile role is set to <strong>Listener</strong>.
          </p>
          <div className="border border-brand-border bg-brand-surface p-4 rounded-lg text-left text-xs text-brand-textMuted mb-6 leading-relaxed">
            <span className="text-brand-green font-semibold">Tip:</span> To publish music, create a new profile with the **Artist / Producer** role selected on the signup screen.
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 bg-brand-green text-black font-semibold rounded-full hover:bg-brand-green-light hover:scale-105 transition-all duration-300"
          >
            Return to Explore
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
      
      {/* Header */}
      <div className="border-b border-brand-border pb-5 mb-8 text-left">
        <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-brand-green/10 text-brand-green border border-brand-green/20 mb-3 uppercase tracking-wider">
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>Creator Analytics</span>
        </span>
        <h1 className="text-3xl font-extrabold text-white">Artist Studio</h1>
        <p className="text-brand-textMuted text-sm mt-1">Upload new recordings and review analytics of your sound library.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-brand-surfaceCard border border-brand-border rounded-2xl p-6 text-left">
            <div className="flex flex-col items-center text-center pb-6 border-b border-brand-border">
              <img
                src={user?.profilePicture}
                alt={user?.username}
                className="w-24 h-24 rounded-full border-2 border-brand-green/45 p-0.5 object-cover mb-4"
              />
              <h2 className="text-xl font-bold text-white">@{user?.username}</h2>
              <span className="mt-1 px-3 py-0.5 rounded-full text-[10px] uppercase font-semibold bg-brand-green/15 text-brand-green border border-brand-green/25">
                {user?.role}
              </span>
              <p className="text-xs text-brand-textMuted mt-4 leading-relaxed max-w-xs">{user?.bio || "No biography added yet."}</p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-4 py-6 border-b border-brand-border text-center">
              <div>
                <div className="text-xl font-bold text-white">{user?.followers?.length || 0}</div>
                <div className="text-xs text-brand-textMuted">Followers</div>
              </div>
              <div>
                <div className="text-xl font-bold text-white">{user?.following?.length || 0}</div>
                <div className="text-xs text-brand-textMuted">Following</div>
              </div>
            </div>

            {/* Quick tips */}
            <div className="pt-6 text-xs text-brand-textMuted leading-relaxed space-y-2">
              <div className="flex items-start space-x-2">
                <Sparkles className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" />
                <span>Publish high-quality audio files (.mp3 URL format) for standard playability.</span>
              </div>
              <div className="flex items-start space-x-2">
                <Music className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" />
                <span>Specify accurate genres so listeners discover your tracks on explore filters.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Upload Forms & My Songs */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Upload Form */}
          <div className="bg-brand-surfaceCard border border-brand-border rounded-2xl p-6 md:p-8 text-left shadow-glow-green/5">
            <div className="flex items-center space-x-2.5 mb-6">
              <UploadCloud className="w-6 h-6 text-brand-green" />
              <h2 className="text-xl font-bold text-white">Publish a Song</h2>
            </div>

            {uploadError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg p-3.5 mb-4">
                {uploadError}
              </div>
            )}

            {uploadSuccess && (
              <div className="bg-brand-green/10 border border-brand-green/20 text-brand-green text-xs rounded-lg p-3.5 mb-4">
                Track successfully compiled, cataloged, and released to the explore feeds!
              </div>
            )}

            <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="flex flex-col space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-brand-textMuted uppercase tracking-wider">Song Title</label>
                <input
                  type="text"
                  placeholder="Midnight Drive"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-semibold text-brand-textMuted uppercase tracking-wider">Audio URL (.mp3)</label>
                <div className="relative">
                  <FileAudio className="absolute left-3.5 top-3.5 w-4 h-4 text-brand-textMuted" />
                  <input
                    type="url"
                    placeholder="https://domain.com/track.mp3"
                    value={audioUrl}
                    onChange={(e) => setAudioUrl(e.target.value)}
                    className="w-full pl-11"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-semibold text-brand-textMuted uppercase tracking-wider">Genre</label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="bg-brand-surfaceCard border border-brand-border text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-brand-green"
                >
                  {genres.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-brand-textMuted uppercase tracking-wider">Cover Image URL (Optional)</label>
                <div className="relative">
                  <Image className="absolute left-3.5 top-3.5 w-4 h-4 text-brand-textMuted" />
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    className="w-full pl-11"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="md:col-span-2 w-full mt-4 flex items-center justify-center space-x-1.5 py-3 rounded-xl bg-brand-green hover:bg-brand-green-light text-black font-semibold shadow-glow-green hover:scale-[1.01] disabled:opacity-50 disabled:scale-100 transition-all duration-300"
              >
                {uploading ? (
                  <div className="w-5 h-5 rounded-full border-2 border-black border-t-transparent animate-spin" />
                ) : (
                  <>
                    <UploadCloud className="w-5 h-5 text-black stroke-[2.5]" />
                    <span>Upload Track</span>
                  </>
                )}
              </button>

            </form>
          </div>

          {/* Songs List */}
          <div className="bg-brand-surfaceCard border border-brand-border rounded-2xl p-6 text-left">
            <div className="flex items-center space-x-2.5 mb-6">
              <Music className="w-6 h-6 text-brand-green" />
              <h2 className="text-xl font-bold text-white">Your Uploaded Tracks ({songs.length})</h2>
            </div>

            {loading ? (
              <div className="py-10 text-center text-brand-textMuted text-sm">
                Fetching catalog...
              </div>
            ) : songs.length === 0 ? (
              <div className="py-16 text-center text-brand-textMuted border border-dashed border-brand-border rounded-xl">
                <Music className="w-10 h-10 text-brand-green/20 mx-auto mb-2" />
                <p className="text-sm font-semibold">No tracks published yet</p>
                <p className="text-xs text-brand-textMuted/70 mt-1">Fill the upload form above to add your first song.</p>
              </div>
            ) : (
              <div className="divide-y divide-brand-border">
                {songs.map((song) => {
                  const isCurrent = currentSong && currentSong._id === song._id;
                  const isThisPlaying = isCurrent && isPlaying;

                  return (
                    <div 
                      key={song._id}
                      className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0 hover:bg-brand-surface/20 px-2 -mx-2 rounded-lg transition-colors group"
                    >
                      <div className="flex items-center space-x-3.5 truncate">
                        {/* Play trigger overlay */}
                        <div 
                          onClick={() => playSong(song, songs)}
                          className="relative w-10 h-10 rounded-md overflow-hidden bg-brand-surface border border-brand-border cursor-pointer flex-shrink-0"
                        >
                          <img src={song.coverImage} alt={song.title} className="w-full h-full object-cover" />
                          <div className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-all ${
                            isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                          }`}>
                            {isThisPlaying ? (
                              <Pause className="w-4 h-4 text-brand-green fill-brand-green" />
                            ) : (
                              <Play className="w-4 h-4 text-brand-green fill-brand-green ml-0.5" />
                            )}
                          </div>
                        </div>

                        <div className="text-left truncate">
                          <h4 className={`text-sm font-semibold truncate ${isCurrent ? 'text-brand-green' : 'text-white'}`}>
                            {song.title}
                          </h4>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-brand-surface border border-brand-border text-brand-textMuted uppercase mt-1 inline-block">
                            {song.genre}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1 text-xs text-brand-textMuted">
                          <Headphones className="w-3.5 h-3.5 text-brand-green" />
                          <span>{song.plays.toLocaleString()} plays</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default ArtistDashboard;
