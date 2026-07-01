import express from 'express';
import { getUsers, deleteUser, getWishlist, toggleWishlist } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/wishlist').get(protect, getWishlist).post(protect, toggleWishlist);

router.route('/').get(protect, admin, getUsers);
router.route('/:id').delete(protect, admin, deleteUser);

export default router;
