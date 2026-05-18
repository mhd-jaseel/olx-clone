import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { FiMapPin, FiClock, FiUser, FiShare2, FiHeart } from 'react-icons/fi';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);

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
                <button className="hover:text-primary"><FiShare2 size={24} /></button>
                <button className="hover:text-red-500"><FiHeart size={24} /></button>
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
            <button className="w-full btn-secondary py-3 flex items-center justify-center font-bold text-lg">
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
    </div>
  );
};

export default ProductDetails;
