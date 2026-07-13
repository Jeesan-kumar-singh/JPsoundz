import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

// Models for Seeding
import User from './models/User.js';
import Song from './models/Song.js';
import CollabPost from './models/CollabPost.js';

const app = express();

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors({
  origin: '*', // For development, allow any origin. In production, specify frontend domain.
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Basic Route
app.get('/', (req, res) => {
  res.send('JPSoundz API is running...');
});

// Import Routes
import authRoutes from './routes/authRoutes.js';
import songRoutes from './routes/songRoutes.js';
import collabRoutes from './routes/collabRoutes.js';
import checkoutRoutes from './routes/checkoutRoutes.js';

// Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/collabs', collabRoutes);
app.use('/api/checkout', checkoutRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Server Error'
  });
});

// Seed Data Function
const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Seeding Database with sample JPSoundz content...');

      // 1. Create Artists & Listeners
      // Password is 'password123'
      const artist1 = new User({
        username: 'kai_beats',
        email: 'kai@jpsoundz.com',
        password: 'password123',
        bio: 'Lo-fi & Chillhop producer based in Tokyo. Crafting nostalgic vibes for late nights.',
        role: 'artist',
        profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60'
      });

      const artist2 = new User({
        username: 'luna_vocals',
        email: 'luna@jpsoundz.com',
        password: 'password123',
        bio: 'Indie singer/songwriter. Electronic synth-pop vocalist looking for collaboration.',
        role: 'artist',
        profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=60'
      });

      const listener = new User({
        username: 'music_lover99',
        email: 'listener@jpsoundz.com',
        password: 'password123',
        bio: 'Curating the finest playlists. Synthwave & Hip-Hop enthusiast.',
        role: 'listener',
        profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=60'
      });

      await artist1.save();
      await artist2.save();
      await listener.save();

      // Setup some following/followers relationships
      artist1.followers.push(listener._id);
      listener.following.push(artist1._id);
      await artist1.save();
      await listener.save();

      // 2. Create Songs
      const adjectives = ['Midnight', 'Neon', 'Summer', 'Cozy', 'Lazy', 'Cyber', 'Rainy', 'Lost', 'Golden', 'Retro', 'Lunar', 'Solar', 'Ocean', 'Forest', 'Dreamy', 'Nostalgic', 'Velocity', 'Urban', 'Ethereal', 'Echoing', 'Starlight', 'Velvet', 'Autumn', 'Winter', 'Spring', 'Future', 'Static', 'Ghostly', 'Distant', 'Shadow', 'Liquid', 'Neon', 'Vapor', 'Echo', 'Drifting'];
      const nouns = ['Coffee', 'Horizon', 'Echoes', 'Breeze', 'Arcade', 'Underground', 'Odyssey', 'Space', 'Dreams', 'Vibe', 'Drift', 'Chamber', 'Waves', 'Rain', 'Night', 'Sunset', 'Sunrise', 'Heart', 'Whisper', 'Glow', 'Beats', 'Memories', 'Echo', 'Journey', 'Portal', 'Skies', 'Fireside', 'Thoughts', 'Aura', 'Reflections', 'Wanderer', 'Stardust', 'Gravity', 'Solitude'];
      const genres = ['Lofi', 'Synthwave', 'Hip-Hop', 'Indie Pop', 'Electronic', 'Ambient'];
      const covers = [
        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60', // Studio Desk
        'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=60', // Concert DJ
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=60', // Stage Lights
        'https://images.unsplash.com/photo-1487180142328-0c4e37023af5?w=500&auto=format&fit=crop&q=60', // Vinyl player
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60', // Yellow Headphones
        'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&auto=format&fit=crop&q=60', // Guitars wall
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&auto=format&fit=crop&q=60', // Singer stage
        'https://images.unsplash.com/photo-1516280440614-37939bbacd6a?w=500&auto=format&fit=crop&q=60', // Neon Microphone
        'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=500&auto=format&fit=crop&q=60', // Guitar performance
        'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500&auto=format&fit=crop&q=60', // Cassette player
        'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=500&auto=format&fit=crop&q=60', // Abstract glow
        'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=500&auto=format&fit=crop&q=60', // Violin instrument
        'https://images.unsplash.com/photo-1484876064900-309d885a6ab6?w=500&auto=format&fit=crop&q=60', // Synth controller
        'https://images.unsplash.com/photo-1453090927415-5f45085b65c0?w=500&auto=format&fit=crop&q=60', // Guitar Amp cables
        'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=500&auto=format&fit=crop&q=60'  // Guitar close-up
      ];

      const artists = [artist1, artist2];
      
      for (let i = 1; i <= 100; i++) {
        const artist = artists[i % artists.length];
        
        const adjIdx = Math.floor(Math.abs(Math.sin(i * 31)) * adjectives.length);
        const nounIdx = Math.floor(Math.abs(Math.cos(i * 17)) * nouns.length);
        const title = `${adjectives[adjIdx]} ${nouns[nounIdx]}`;
        
        const genre = genres[i % genres.length];
        const coverImage = covers[i % covers.length];
        
        const helixIndex = (i % 16) + 1;
        const audioUrl = `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${helixIndex}.mp3`;
        const plays = Math.floor(Math.abs(Math.sin(i) * 9800)) + 50;
        const price = i % 2 === 0 ? 9.99 : 14.99;
        
        const dateOffset = i * 4 * 3600000;
        
        const song = new Song({
          title,
          artist: artist._id,
          genre,
          plays,
          price,
          coverImage,
          audioUrl,
          createdAt: new Date(Date.now() - dateOffset)
        });
        
        await song.save();
      }

      // 3. Create Collaboration Posts
      const collab1 = new CollabPost({
        author: artist1._id,
        title: 'Need a Vocalist for Chillhop EP',
        roleNeeded: 'Singer',
        description: 'Working on a 4-track lo-fi album. Need smooth, breathy vocals for a couple of hooks. Dm me with examples of your work!',
        status: 'open'
      });

      const collab2 = new CollabPost({
        author: artist2._id,
        title: 'Looking for a Synthwave Producer',
        roleNeeded: 'Producer',
        description: 'I have written a set of vocal tracks and lyrics. Looking for an 80s synthwave style producer to build retro beats around the vocals.',
        status: 'open'
      });

      await collab1.save();
      await collab2.save();

      console.log('Database successfully seeded!');
    }
  } catch (error) {
    console.error('Seeding database failed:', error.message);
  }
};

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await seedDatabase();
});
