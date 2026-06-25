import express from 'express';
import { getCollabPosts, createCollabPost, togglePostStatus } from '../controllers/collabController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getCollabPosts);
router.post('/', protect, createCollabPost);
router.put('/:id/status', protect, togglePostStatus);

export default router;
