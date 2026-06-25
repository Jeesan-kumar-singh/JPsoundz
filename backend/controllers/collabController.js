import CollabPost from '../models/CollabPost.js';
import { isDbConnected, mockStore } from '../config/mockStore.js';

// @desc    Get all collaboration posts
// @route   GET /api/collabs
// @access  Public
export const getCollabPosts = async (req, res) => {
  try {
    if (isDbConnected()) {
      const posts = await CollabPost.find()
        .populate('author', 'username profilePicture role')
        .sort({ createdAt: -1 });
      return res.json({ success: true, posts });
    } else {
      // Mock Implementation
      // Sort mock array by date descending
      const sortedMock = [...mockStore.collabPosts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json({ success: true, posts: sortedMock });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a collaboration post
// @route   POST /api/collabs
// @access  Private
export const createCollabPost = async (req, res) => {
  const { title, roleNeeded, description } = req.body;

  try {
    if (!title || !roleNeeded || !description) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    if (isDbConnected()) {
      const post = new CollabPost({
        author: req.user._id,
        title,
        roleNeeded,
        description,
      });

      const savedPost = await post.save();
      const populatedPost = await CollabPost.findById(savedPost._id).populate('author', 'username profilePicture role');
      return res.status(201).json({ success: true, post: populatedPost });
    } else {
      // Mock Implementation
      const newPost = {
        _id: 'mock_collab_' + Date.now(),
        author: {
          _id: req.user._id,
          username: req.user.username,
          profilePicture: req.user.profilePicture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60',
          role: req.user.role
        },
        title,
        roleNeeded,
        description,
        status: 'open',
        createdAt: new Date().toISOString()
      };

      mockStore.collabPosts.push(newPost);
      return res.status(201).json({ success: true, post: newPost });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle status of collaboration post (open <-> closed)
// @route   PUT /api/collabs/:id/status
// @access  Private
export const togglePostStatus = async (req, res) => {
  try {
    if (isDbConnected()) {
      const post = await CollabPost.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ success: false, message: 'Collaboration post not found' });
      }

      // Check if user is the author
      if (post.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to modify this post' });
      }

      post.status = post.status === 'open' ? 'closed' : 'open';
      await post.save();

      const populatedPost = await CollabPost.findById(post._id).populate('author', 'username profilePicture role');
      return res.json({ success: true, post: populatedPost });
    } else {
      // Mock Implementation
      const post = mockStore.collabPosts.find(p => p._id === req.params.id);
      if (!post) {
        return res.status(404).json({ success: false, message: 'Collaboration post not found' });
      }

      // Check author
      const authorId = post.author?._id || post.author;
      if (authorId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to modify this post' });
      }

      post.status = post.status === 'open' ? 'closed' : 'open';
      return res.json({ success: true, post });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
