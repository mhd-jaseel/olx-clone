import Message from '../models/Message.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
export const sendMessage = async (req, res, next) => {
  try {
    const { receiver, product, content } = req.body;

    if (!receiver || !product || !content) {
      res.status(400);
      throw new Error('Please provide receiver, product, and content');
    }

    const message = await Message.create({
      sender: req.user._id,
      receiver,
      product,
      content,
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name profileImage')
      .populate('receiver', 'name profileImage')
      .populate('product', 'title price');

    res.status(201).json(populatedMessage);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all conversations for logged in user
// @route   GET /api/messages/conversations
// @access  Private
export const getConversations = async (req, res, next) => {
  try {
    const userId = req.user._id.toString();

    // Fetch all messages where user is either sender or receiver
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    })
      .populate('sender', 'name profileImage')
      .populate('receiver', 'name profileImage')
      .populate('product', 'title price images')
      .sort({ createdAt: -1 }); // Newest first

    // Group messages by unique conversation key (productId + otherUserId)
    const conversationMap = {};

    messages.forEach((msg) => {
      if (!msg.product) return; // If product was deleted, skip

      const productId = msg.product._id.toString();
      const senderId = msg.sender._id.toString();
      const receiverId = msg.receiver._id.toString();

      // Find the counterpart user ID in this message
      const otherUser = senderId === userId ? msg.receiver : msg.sender;
      const otherUserId = otherUser._id.toString();

      // Conversation key is unique per product + participant pair
      const key = `${productId}_${otherUserId}`;

      if (!conversationMap[key]) {
        conversationMap[key] = {
          product: msg.product,
          otherUser: {
            _id: otherUser._id,
            name: otherUser.name,
            profileImage: otherUser.profileImage,
          },
          lastMessage: {
            content: msg.content,
            createdAt: msg.createdAt,
            senderId: msg.sender._id,
          },
        };
      }
    });

    const conversations = Object.values(conversationMap);
    res.json(conversations);
  } catch (error) {
    next(error);
  }
};

// @desc    Get chat history for a specific product and user
// @route   GET /api/messages/chat/:productId/:otherUserId
// @access  Private
export const getChatHistory = async (req, res, next) => {
  try {
    const { productId, otherUserId } = req.params;
    const userId = req.user._id;

    const messages = await Message.find({
      product: productId,
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId },
      ],
    })
      .populate('sender', 'name profileImage')
      .populate('receiver', 'name profileImage')
      .sort({ createdAt: 1 }); // Oldest first (chronological for chat logs)

    res.json(messages);
  } catch (error) {
    next(error);
  }
};
