import User from '../models/User.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      if (user.role === 'admin') {
        res.status(400);
        throw new Error('Cannot delete an admin user');
      }
      await user.deleteOne();
      res.json({ message: 'User removed' });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user wishlist
// @route   GET /api/users/wishlist
// @access  Private
export const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    res.json(user.wishlist || []);
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle wishlist item (add/remove)
// @route   POST /api/users/wishlist
// @access  Private
export const toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    if (!user.wishlist) {
      user.wishlist = [];
    }

    const isAlreadyWishlisted = user.wishlist.some(id => id.toString() === productId);

    if (isAlreadyWishlisted) {
      // Remove it
      user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    } else {
      // Add it
      user.wishlist.push(productId);
    }

    await user.save();
    res.json(user.wishlist);
  } catch (error) {
    next(error);
  }
};
