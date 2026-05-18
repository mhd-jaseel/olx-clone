import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { FiEdit, FiTrash2, FiEye } from 'react-icons/fi';

const MyListings = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        // Simple way: fetch all and filter (for minimal implementation)
        // In a real app, you'd have a specific endpoint like /api/products/my-listings
        const { data } = await api.get('/products');
        const myItems = data.products.filter(p => p.seller._id === user._id || p.seller === user._id);
        setProducts(myItems);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch your listings');
        setLoading(false);
      }
    };
    if (user) {
      fetchMyProducts();
    }
  }, [user]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await api.delete(`/products/${id}`);
        setProducts(products.filter(p => p._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete');
      }
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">My Listings</h1>
        <Link to="/create-product" className="btn-primary text-sm py-2">
          Post New Ad
        </Link>
      </div>

      {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4">{error}</div>}

      {products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-md border border-dashed border-gray-300">
          <p className="text-gray-500 mb-4">You haven't listed anything yet.</p>
          <Link to="/create-product" className="btn-primary">Start Selling</Link>
        </div>
      ) : (
        <div className="bg-white rounded-md border overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                          <img className="h-10 w-10 object-cover" src={product.images[0]} alt="" />
                        ) : (
                          <span className="text-xs text-gray-400">No img</span>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-xs">{product.title}</div>
                        <div className="text-sm text-gray-500">{product.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">₹{product.price.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{new Date(product.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <Link to={`/product/${product._id}`} className="text-blue-600 hover:text-blue-900">
                        <FiEye size={18} />
                      </Link>
                      <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-900">
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyListings;
