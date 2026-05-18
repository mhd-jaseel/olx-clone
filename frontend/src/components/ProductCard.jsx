import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product._id}`} className="block">
      <div className="bg-white border rounded-md overflow-hidden card-hover h-full flex flex-col">
        <div className="h-48 overflow-hidden relative bg-gray-100 flex items-center justify-center">
          {product.images && product.images.length > 0 ? (
            <img 
              src={product.images[0]} 
              alt={product.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-400">No Image</span>
          )}
          {/* Featured badge (optional) */}
          <div className="absolute top-2 left-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded shadow-sm">
            FEATURED
          </div>
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            ₹{product.price.toLocaleString()}
          </h2>
          <p className="text-gray-600 text-sm truncate mb-2">{product.title}</p>
          <div className="mt-auto pt-3 flex justify-between items-center text-xs text-gray-500 border-t border-gray-100">
            <span className="truncate max-w-[60%]">{product.location}</span>
            <span>{new Date(product.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
