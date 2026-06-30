import express from 'express';
import {
  sendMessage,
  getConversations,
  getChatHistory,
} from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, sendMessage);
router.route('/conversations').get(protect, getConversations);
router.route('/chat/:productId/:otherUserId').get(protect, getChatHistory);

export default router;
