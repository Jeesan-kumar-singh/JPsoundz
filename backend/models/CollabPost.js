import mongoose from 'mongoose';

const collabPostSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please add a collaboration post title'],
      trim: true,
    },
    roleNeeded: {
      type: String,
      required: [true, 'Please specify the role needed (e.g., Singer, Vocalist, Producer, Rapper)'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description for the collaboration'],
    },
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },
  },
  {
    timestamps: true,
  }
);

const CollabPost = mongoose.model('CollabPost', collabPostSchema);
export default CollabPost;
