import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { isDbConnected, mockStore } from '../config/mockStore.js';

export const protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (Bearer <token>)
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'jpsoundz_super_secret_ai_music_platform_key_2026');

      if (isDbConnected()) {
        // Get user from DB
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        // Fallback to mockStore
        const localUser = mockStore.users.find(u => u._id === decoded.id);
        if (localUser) {
          const { password, ...userWithoutPassword } = localUser;
          req.user = userWithoutPassword;
        }
      }
      
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error('Auth middleware error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

// Check if user is an artist
export const artistOnly = (req, res, next) => {
  if (req.user && req.user.role === 'artist') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied: Artist role required' });
  }
};
