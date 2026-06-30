import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import { 
  FiSmartphone, FiHome, FiTv, FiBox, FiShoppingBag, FiCompass 
} from 'react-icons/fi';
import { FaCar, FaMotorcycle } from 'react-icons/fa';

const categories = [
  { name: 'Mobile Phones', icon: FiSmartphone },
  { name: 'Cars', icon: FaCar },
  { name: 'Motorcycles', icon: FaMotorcycle },
  { name: 'Properties', icon: FiHome },
  { name: 'Electronics', icon: FiTv },
  { name: 'Furniture', icon: FiBox },
  { name: 'Fashion', icon: FiShoppingBag },
  { name: 'Other', icon: FiCompass }
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data.products);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products');
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleCategoryClick = (catName) => {
    navigate(`/search?category=${encodeURIComponent(catName)}`);
  };

  return (
    <div className="bg-[#f2f4f5] min-h-screen">
      {/* Categories Bar */}
      <div className="bg-white border-b hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex space-x-8 text-sm font-bold text-primary overflow-x-auto items-center">
            <span className="cursor-pointer hover:text-secondary uppercase whitespace-nowrap" onClick={() => navigate('/search')}>
              ALL CATEGORIES
            </span>
            {categories.map((cat, idx) => (
              <span 
                key={idx} 
                className="font-normal text-gray-700 hover:text-secondary cursor-pointer whitespace-nowrap transition-colors"
                onClick={() => handleCategoryClick(cat.name)}
              >
                {cat.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#23e5db] via-[#24ebe1] to-[#3a77ff] text-white py-12 px-4 shadow-sm border-b">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-left">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2 text-primary leading-tight">
              Buy, Sell & Find Anything
            </h1>
            <p className="text-primary font-bold text-lg opacity-85">
              More than 1,000,000+ items registered locally near you.
            </p>
          </div>
          <div className="hidden lg:block bg-white p-2 rounded-lg shadow-md max-w-sm">
            <img 
              src="https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&w=400&q=80" 
              alt="OLX Shopping" 
              className="rounded object-cover h-36 w-64"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories Icon Row */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-primary mb-6">Browse Categories</h2>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {categories.map((cat, idx) => {
              const IconComponent = cat.icon;
              return (
                <div 
                  key={idx} 
                  onClick={() => handleCategoryClick(cat.name)}
                  className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:border-primary hover:shadow-md cursor-pointer transition-all duration-200"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-primary mb-2 border border-blue-100">
                    <IconComponent size={24} />
                  </div>
                  <span className="text-xs font-bold text-center text-gray-700 truncate w-full">
                    {cat.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommendations Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-primary">Fresh recommendations</h2>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 text-red-600 p-4 rounded">{error}</div>
          ) : products.length === 0 ? (
            <div className="bg-white p-8 rounded-lg text-center border text-gray-500 font-medium">
              No recommendations found. Be the first to post an ad!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
