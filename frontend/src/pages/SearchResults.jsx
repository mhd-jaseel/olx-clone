import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';

const categoriesList = [
  'Mobile Phones', 'Cars', 'Motorcycles', 'Properties', 'Electronics', 'Furniture', 'Fashion', 'Other'
];

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const location = searchParams.get('location') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sort = searchParams.get('sort') || 'newest';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Local state for filter inputs
  const [minInput, setMinInput] = useState(minPrice);
  const [maxInput, setMaxInput] = useState(maxPrice);
  const [locInput, setLocInput] = useState(location);

  // Sync inputs with URL parameters
  useEffect(() => {
    setMinInput(minPrice);
    setMaxInput(maxPrice);
    setLocInput(location);
  }, [minPrice, maxPrice, location]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const params = [];
        if (query) params.push(`keyword=${encodeURIComponent(query)}`);
        if (category) params.push(`category=${encodeURIComponent(category)}`);
        if (location) params.push(`location=${encodeURIComponent(location)}`);
        if (minPrice) params.push(`minPrice=${minPrice}`);
        if (maxPrice) params.push(`maxPrice=${maxPrice}`);
        if (sort) params.push(`sort=${sort}`);

        const url = `/products?${params.join('&')}`;
        const { data } = await api.get(url);
        setProducts(data.products);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch search results');
        setLoading(false);
      }
    };
    
    fetchSearchResults();
  }, [query, category, location, minPrice, maxPrice, sort]);

  const updateParam = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }
    setSearchParams(nextParams);
  };

  const handlePriceSubmit = (e) => {
    e.preventDefault();
    const nextParams = new URLSearchParams(searchParams);
    if (minInput) nextParams.set('minPrice', minInput);
    else nextParams.delete('minPrice');
    
    if (maxInput) nextParams.set('maxPrice', maxInput);
    else nextParams.delete('maxPrice');
    
    setSearchParams(nextParams);
  };

  const handleLocationSubmit = (e) => {
    e.preventDefault();
    updateParam('location', locInput);
  };

  const resetFilters = () => {
    setSearchParams(query ? { q: query } : {});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Summary */}
      <div className="mb-6 pb-4 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#002f34]">
            Search results {query && `for "${query}"`} {category && `in ${category}`} {location && `in ${location}`}
          </h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} fresh recommendations found</p>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-primary whitespace-nowrap">Sort by:</label>
          <select 
            value={sort} 
            onChange={(e) => updateParam('sort', e.target.value)}
            className="border-2 border-primary rounded px-3 py-1.5 bg-white text-sm font-bold text-primary focus:outline-none"
          >
            <option value="newest">Date Published: Newest</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side Filters Panel */}
        <div className="w-full lg:w-64 flex-shrink-0 bg-white border rounded-md p-5 shadow-sm self-start">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-primary">Filters</h2>
            <button 
              onClick={resetFilters} 
              className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
            >
              Reset All
            </button>
          </div>

          {/* Categories Filter */}
          <div className="mb-6 pb-6 border-b">
            <h3 className="font-bold text-primary text-sm mb-3">Categories</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li 
                onClick={() => updateParam('category', '')}
                className={`cursor-pointer hover:text-secondary ${!category ? 'font-bold text-primary' : ''}`}
              >
                All Categories
              </li>
              {categoriesList.map((cat) => (
                <li 
                  key={cat}
                  onClick={() => updateParam('category', cat)}
                  className={`cursor-pointer hover:text-secondary transition-colors ${category === cat ? 'font-bold text-[#002f34] text-secondary' : ''}`}
                >
                  {cat}
                </li>
              ))}
            </ul>
          </div>

          {/* Location Filter */}
          <div className="mb-6 pb-6 border-b">
            <h3 className="font-bold text-primary text-sm mb-3">Location</h3>
            <form onSubmit={handleLocationSubmit} className="flex gap-2">
              <input 
                type="text" 
                placeholder="E.g. Mumbai, Kerala" 
                value={locInput}
                onChange={(e) => setLocInput(e.target.value)}
                className="w-full border rounded px-3 py-1.5 text-sm focus:outline-none focus:border-primary"
              />
              <button type="submit" className="bg-primary text-white px-3 py-1.5 rounded hover:bg-opacity-95 text-xs font-bold cursor-pointer">
                Go
              </button>
            </form>
          </div>

          {/* Price Range Filter */}
          <div>
            <h3 className="font-bold text-primary text-sm mb-3">Price Range (₹)</h3>
            <form onSubmit={handlePriceSubmit}>
              <div className="flex gap-2 mb-3">
                <input 
                  type="number" 
                  placeholder="Min" 
                  value={minInput}
                  onChange={(e) => setMinInput(e.target.value)}
                  className="w-1/2 border rounded px-3 py-1.5 text-sm focus:outline-none focus:border-primary"
                  min="0"
                />
                <input 
                  type="number" 
                  placeholder="Max" 
                  value={maxInput}
                  onChange={(e) => setMaxInput(e.target.value)}
                  className="w-1/2 border rounded px-3 py-1.5 text-sm focus:outline-none focus:border-primary"
                  min="0"
                />
              </div>
              <button 
                type="submit" 
                className="w-full btn-secondary text-xs font-bold py-2 rounded cursor-pointer"
              >
                Apply Price
              </button>
            </form>
          </div>
        </div>

        {/* Right Side Products Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 text-red-600 p-4 rounded">{error}</div>
          ) : products.length === 0 ? (
            <div className="bg-white p-12 text-center rounded border border-dashed border-gray-300">
              <h3 className="text-xl font-bold text-gray-700">No results match your search</h3>
              <p className="text-gray-500 mt-2 text-sm">Try removing some filters, updating the keywords, or choosing another category.</p>
              <button 
                onClick={resetFilters} 
                className="mt-4 btn-primary py-2 px-6 rounded-full font-bold text-sm cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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

export default SearchResults;
