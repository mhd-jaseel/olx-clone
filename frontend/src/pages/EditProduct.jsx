import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    location: '',
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Mobile Phones', 'Cars', 'Motorcycles', 'Properties', 'Electronics', 'Furniture', 'Fashion', 'Other'
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        
        // Verify ownership or admin permission
        const sellerId = data.seller?._id || data.seller;
        if (user && sellerId !== user._id && user.role !== 'admin') {
          toast.error('You are not authorized to edit this product');
          navigate('/');
          return;
        }

        setFormData({
          title: data.title || '',
          description: data.description || '',
          price: data.price || '',
          category: data.category || '',
          location: data.location || '',
        });
        setLoading(false);
      } catch (err) {
        toast.error('Failed to load product details');
        navigate('/');
      }
    };

    if (user) {
      fetchProduct();
    }
  }, [id, user, navigate]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');

    try {
      await api.put(`/products/${id}`, {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        location: formData.location,
      });

      toast.success('Ad updated successfully!');
      
      // If admin, go back to admin products list, else go to product page
      if (user.role === 'admin') {
        navigate('/admin/products');
      } else {
        navigate(`/product/${id}`);
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to update product';
      setError(errMsg);
      toast.error(errMsg);
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-primary mb-6">EDIT YOUR AD</h1>
      
      <div className="bg-white border rounded-md shadow-sm p-6">
        {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6 border-b pb-6">
            <h2 className="text-xl font-semibold mb-4 text-primary">INCLUDE SOME DETAILS</h2>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">Ad title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                maxLength="100"
                className="input-field"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Mention the key features of your item (e.g. brand, model, age, type)</p>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                maxLength="1000"
                rows="4"
                className="input-field"
                required
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">Include condition, features and reason for selling</p>
            </div>

            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="City, State"
                  className="input-field"
                  required
                />
              </div>
            </div>
          </div>

          <div className="mb-6 border-b pb-6">
            <h2 className="text-xl font-semibold mb-4 text-primary">SET A PRICE</h2>
            <div className="mb-4 max-w-xs">
              <label className="block text-gray-700 mb-2 font-medium">Price *</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500 font-bold">₹</span>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  className="input-field pl-8"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => user.role === 'admin' ? navigate('/admin/products') : navigate(`/product/${id}`)}
              className="border rounded px-6 py-3 font-semibold hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updating}
              className={`btn-primary px-10 py-3 ${updating ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {updating ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
