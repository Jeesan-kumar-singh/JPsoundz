import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { isDbConnected, mockStore } from '../config/mockStore.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'jpsoundz_super_secret_ai_music_platform_key_2026', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
export const registerUser = async (req, res) => {
  const { username, email, password, role, bio } = req.body;

  try {
    if (isDbConnected()) {
      // Check if user already exists
      const userExists = await User.findOne({ $or: [{ email }, { username }] });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists with this email or username' });
      }

      // Create user
      const user = await User.create({
        username,
        email,
        password,
        role: role || 'listener',
        bio: bio || '',
      });

      if (user) {
        return res.status(201).json({
          success: true,
          token: generateToken(user._id),
          user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            bio: user.bio,
            profilePicture: user.profilePicture,
            followers: user.followers,
            following: user.following,
          },
        });
      }
    } else {
      // Mock Implementation
      const userExists = mockStore.users.find(u => u.email === email || u.username === username);
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists with this email or username' });
      }

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      const newUser = {
        _id: 'mock_user_' + Date.now(),
        username,
        email,
        password: hashedPassword,
        role: role || 'listener',
        bio: bio || '',
        profilePicture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60',
        followers: [],
        following: []
      };

      mockStore.users.push(newUser);
      
      const { password: _, ...userWithoutPassword } = newUser;

      return res.status(201).json({
        success: true,
        token: generateToken(newUser._id),
        user: userWithoutPassword
      });
    }

    res.status(400).json({ success: false, message: 'Invalid user data' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (isDbConnected()) {
      // Find user by email
      const user = await User.findOne({ email });

      if (user && (await user.matchPassword(password))) {
        return res.json({
          success: true,
          token: generateToken(user._id),
          user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            bio: user.bio,
            profilePicture: user.profilePicture,
            followers: user.followers,
            following: user.following,
          },
        });
      }
    } else {
      // Mock Implementation
      const user = mockStore.users.find(u => u.email === email);
      if (user && bcrypt.compareSync(password, user.password)) {
        const { password: _, ...userWithoutPassword } = user;
        return res.json({
          success: true,
          token: generateToken(user._id),
          user: userWithoutPassword
        });
      }
    }

    res.status(401).json({ success: false, message: 'Invalid email or password' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    if (isDbConnected()) {
      const user = await User.findById(req.user._id).select('-password');
      if (user) {
        return res.json({ success: true, user });
      }
    } else {
      const user = mockStore.users.find(u => u._id === req.user._id);
      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        return res.json({ success: true, user: userWithoutPassword });
      }
    }
    
    res.status(404).json({ success: false, message: 'User not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
