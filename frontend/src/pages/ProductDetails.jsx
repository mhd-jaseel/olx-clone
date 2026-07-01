import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { FiMapPin, FiClock, FiUser, FiShare2, FiHeart, FiX } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';
import { WishlistContext } from '../context/WishlistContext';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { toggleWishlist, isWishlisted } = useContext(WishlistContext);
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);

  const handleChatClick = () => {
    if (!user) {
      toast.error('Please login to contact the seller');
      navigate('/login');
      return;
    }
    if (user._id === product.seller?._id) {
      toast.error('You cannot chat with yourself for your own listing');
      return;
    }
    setChatOpen(true);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    setSending(true);
    try {
      await api.post('/messages', {
        receiver: product.seller?._id,
        product: product._id,
        content: messageText
      });
      toast.success('Message sent! Opening chats...');
      navigate('/chats');
    } catch (err) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch product details');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !product) {
    return <div className="max-w-7xl mx-auto px-4 py-8 text-center text-red-600">{error || 'Product not found'}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Column - Images & Details */}
        <div className="lg:w-2/3">
          {/* Image Gallery */}
          <div className="bg-black rounded-md overflow-hidden flex items-center justify-center h-96 md:h-[500px] mb-4">
            {product.images && product.images.length > 0 ? (
              <img 
                src={product.images[activeImage]} 
                alt={product.title} 
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <span className="text-gray-400">No Image Available</span>
            )}
          </div>
          
          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 mb-6 overflow-x-auto py-2">
              {product.images.map((img, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setActiveImage(idx)}
                  className={`cursor-pointer border-2 rounded w-20 h-20 flex-shrink-0 ${activeImage === idx ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'}`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* Description Box */}
          <div className="bg-white border rounded-md shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-primary mb-4">Description</h2>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>

        {/* Right Column - Price & Seller Info */}
        <div className="lg:w-1/3 flex flex-col gap-4">
          
          {/* Price & Title Box */}
          <div className="bg-white border rounded-md shadow-sm p-6">
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-4xl font-bold text-gray-900">₹{product.price.toLocaleString()}</h1>
              <div className="flex gap-4 text-gray-500">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success('Link copied to clipboard!');
                  }}
                  className="hover:text-primary cursor-pointer"
                  title="Share listing"
                >
                  <FiShare2 size={24} />
                </button>
                <button 
                  onClick={() => toggleWishlist(product._id)}
                  className={`cursor-pointer transition-colors duration-200 ${
                    isWishlisted(product._id) ? 'text-red-500 hover:text-red-600' : 'hover:text-red-500'
                  }`}
                  title={isWishlisted(product._id) ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <FiHeart size={24} fill={isWishlisted(product._id) ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>
            <p className="text-xl text-gray-700 mb-6">{product.title}</p>
            
            <div className="flex justify-between items-center text-sm text-gray-500 border-t pt-4">
              <span className="flex items-center"><FiMapPin className="mr-1" /> {product.location}</span>
              <span className="flex items-center"><FiClock className="mr-1" /> {new Date(product.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Seller Box */}
          <div className="bg-white border rounded-md shadow-sm p-6">
            <h2 className="text-lg font-bold text-primary mb-4">Seller description</h2>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                {product.seller?.profileImage !== 'default.jpg' ? (
                  <img src={product.seller.profileImage} alt={product.seller.name} className="w-full h-full object-cover" />
                ) : (
                  <FiUser size={32} className="text-gray-400" />
                )}
              </div>
              <div>
                <p className="font-bold text-lg">{product.seller?.name || 'Unknown Seller'}</p>
                <p className="text-sm text-gray-500">Member since {new Date().getFullYear()}</p>
              </div>
            </div>
            <button 
              onClick={handleChatClick}
              className="w-full btn-secondary py-3 flex items-center justify-center font-bold text-lg cursor-pointer"
            >
              Chat with seller
            </button>
          </div>

          {/* Location Box */}
          <div className="bg-white border rounded-md shadow-sm p-6">
            <h2 className="text-lg font-bold text-primary mb-4">Posted in</h2>
            <p className="text-gray-700 flex items-center">
              <FiMapPin className="mr-2" size={20} />
              {product.location}
            </p>
          </div>
          
        </div>
      </div>

      {/* Chat Modal */}
      {chatOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden border">
            <div className="flex justify-between items-center p-4 bg-primary text-white">
              <h3 className="font-bold text-lg">Send Message to Seller</h3>
              <button onClick={() => setChatOpen(false)} className="hover:text-gray-200 cursor-pointer">
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleSendMessage} className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product: <span className="font-normal text-gray-600">{product.title}</span>
                </label>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price: <span className="font-normal text-gray-600">₹{product.price.toLocaleString()}</span>
                </label>
              </div>
              <div className="mb-4">
                <textarea
                  rows="4"
                  placeholder="Type your message here..."
                  className="w-full border rounded p-2.5 text-sm focus:outline-none focus:border-primary"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setChatOpen(false)}
                  className="border rounded px-4 py-2 text-sm font-medium hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="btn-primary px-5 py-2 text-sm rounded font-bold cursor-pointer"
                >
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
