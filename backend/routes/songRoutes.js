import express from 'express';
import { getSongs, createSong, incrementPlays } from '../controllers/songController.js';
import { protect, artistOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getSongs);
router.post('/', protect, artistOnly, createSong);
router.post('/:id/play', incrementPlays);

export default router;
