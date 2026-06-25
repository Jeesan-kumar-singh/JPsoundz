import Song from '../models/Song.js';
import { isDbConnected, mockStore } from '../config/mockStore.js';

// @desc    Get all songs
// @route   GET /api/songs
// @access  Public
export const getSongs = async (req, res) => {
  try {
    if (isDbConnected()) {
      const songs = await Song.find().populate('artist', 'username profilePicture');
      return res.json({ success: true, songs });
    } else {
      // Mock Implementation
      return res.json({ success: true, songs: mockStore.songs });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create / Upload a new song
// @route   POST /api/songs
// @access  Private (Artist Only)
export const createSong = async (req, res) => {
  const { title, coverImage, audioUrl, genre } = req.body;

  try {
    if (!title || !audioUrl) {
      return res.status(400).json({ success: false, message: 'Please provide a title and audio URL' });
    }

    if (isDbConnected()) {
      const song = new Song({
        title,
        artist: req.user._id,
        coverImage: coverImage || undefined,
        audioUrl,
        genre: genre || 'Other',
      });

      const savedSong = await song.save();
      const populatedSong = await Song.findById(savedSong._id).populate('artist', 'username profilePicture');
      return res.status(201).json({ success: true, song: populatedSong });
    } else {
      // Mock Implementation
      const newSong = {
        _id: 'mock_song_' + Date.now(),
        title,
        artist: {
          _id: req.user._id,
          username: req.user.username,
          profilePicture: req.user.profilePicture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60'
        },
        coverImage: coverImage || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&auto=format&fit=crop&q=60',
        audioUrl,
        genre: genre || 'Other',
        plays: 0,
        createdAt: new Date().toISOString()
      };

      mockStore.songs.push(newSong);
      return res.status(201).json({ success: true, song: newSong });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Increment song play count
// @route   POST /api/songs/:id/play
// @access  Public
export const incrementPlays = async (req, res) => {
  try {
    if (isDbConnected()) {
      const song = await Song.findById(req.params.id);
      if (!song) {
        return res.status(404).json({ success: false, message: 'Song not found' });
      }

      song.plays += 1;
      await song.save();
      return res.json({ success: true, plays: song.plays });
    } else {
      // Mock Implementation
      const song = mockStore.songs.find(s => s._id === req.params.id);
      if (!song) {
        return res.status(404).json({ success: false, message: 'Song not found' });
      }

      song.plays += 1;
      return res.json({ success: true, plays: song.plays });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
