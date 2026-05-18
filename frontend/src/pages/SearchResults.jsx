import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        let url = `/products?keyword=${query}`;
        if (category) {
          url += `&category=${category}`;
        }
        
        const { data } = await api.get(url);
        setProducts(data.products);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch search results');
        setLoading(false);
      }
    };
    
    fetchSearchResults();
  }, [query, category]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 pb-4 border-b">
        <h1 className="text-2xl font-bold text-gray-900">
          Search results {query && `for "${query}"`} {category && `in ${category}`}
        </h1>
        <p className="text-gray-500 mt-2">{products.length} ads found</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-600 p-4 rounded">{error}</div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-xl font-bold text-gray-700">Oops... we didn't find anything that matches this search</h3>
          <p className="text-gray-500 mt-2">Try to search for something more general, change the filters or check for spelling mistakes</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
