import mongoose from 'mongoose';

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a song title'],
      trim: true,
    },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&auto=format&fit=crop&q=60',
    },
    audioUrl: {
      type: String,
      required: [true, 'Please add an audio URL'],
    },
    genre: {
      type: String,
      default: 'Other',
    },
    plays: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      default: 9.99,
    },
  },
  {
    timestamps: true,
  }
);

const Song = mongoose.model('Song', songSchema);
export default Song;
