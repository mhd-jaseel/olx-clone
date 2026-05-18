import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { FiUploadCloud, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CreateProduct = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    location: '',
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Electronics', 'Vehicles', 'Property', 'Furniture', 'Fashion', 'Other'
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > 5) {
      setError('You can only upload a maximum of 5 images');
      return;
    }

    setImages([...images, ...files]);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('description', formData.description);
    submitData.append('price', formData.price);
    submitData.append('category', formData.category);
    submitData.append('location', formData.location);
    
    images.forEach(image => {
      submitData.append('images', image);
    });

    try {
      console.log('Submitting data to /products...');
      const { data } = await api.post('/products', submitData);
      console.log('Upload successful:', data);
      toast.success('Ad posted successfully!');
      navigate(`/product/${data._id}`);
    } catch (err) {
      console.error('Error submitting product:', err);
      // Determine the best error message available
      let errMsg = 'Failed to create product';
      
      if (err.response && err.response.data && err.response.data.message) {
        errMsg = err.response.data.message; // Backend error
      } else if (err.message) {
        errMsg = err.message; // Axios error (e.g., Network Error)
      }
      
      setError(`Error: ${errMsg}`);
      toast.error(errMsg);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-primary mb-6">POST YOUR AD</h1>
      
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

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-primary">UPLOAD UP TO 5 PHOTOS</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative aspect-square border rounded bg-gray-50">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              ))}
              
              {imagePreviews.length < 5 && (
                <label className="aspect-square border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                  <FiUploadCloud size={32} className="text-primary mb-2" />
                  <span className="text-sm font-semibold text-primary">Add photo</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`btn-primary px-10 py-3 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Posting...' : 'Post now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
