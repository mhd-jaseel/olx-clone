import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from './AuthContext';
import toast from 'react-hot-toast';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch wishlist when user logs in
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) {
        setWishlist([]);
        return;
      }
      try {
        setLoading(true);
        const { data } = await api.get('/users/wishlist');
        setWishlist(data || []);
      } catch (err) {
        console.error('Error fetching wishlist:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user]);

  const toggleWishlist = async (productId) => {
    if (!user) {
      toast.error('Please login to add items to your wishlist');
      return false;
    }
    try {
      // Send toggle request to backend
      await api.post('/users/wishlist', { productId });
      
      // Fetch updated wishlist to sync state with backend
      const res = await api.get('/users/wishlist');
      const updatedWishlist = res.data || [];
      setWishlist(updatedWishlist);
      
      const isNowWishlisted = updatedWishlist.some(item => item._id === productId);
      if (isNowWishlisted) {
        toast.success('Added to wishlist');
      } else {
        toast.success('Removed from wishlist');
      }
      return true;
    } catch (err) {
      console.error('Error toggling wishlist:', err);
      toast.error('Failed to update wishlist');
      return false;
    }
  };

  const isWishlisted = (productId) => {
    return wishlist.some(item => item._id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, loading, toggleWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
};
