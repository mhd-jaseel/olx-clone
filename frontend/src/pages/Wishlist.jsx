import React, { useContext } from 'react';
import { WishlistContext } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';

const Wishlist = () => {
  const { wishlist, loading } = useContext(WishlistContext);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-2.5 mb-6">
        <FiHeart size={28} className="text-red-500" fill="currentColor" />
        <h1 className="text-2xl font-bold text-primary">My Wishlist</h1>
        <span className="text-sm font-semibold text-gray-500">({wishlist.length} {wishlist.length === 1 ? 'item' : 'items'})</span>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-md border border-dashed border-gray-300">
          <p className="text-gray-500 mb-4">Your wishlist is empty.</p>
          <Link to="/" className="btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
