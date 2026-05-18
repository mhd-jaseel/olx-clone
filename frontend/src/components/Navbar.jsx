import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiPlus, FiUser, FiLogOut } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search?q=${keyword}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-primary text-3xl font-bold tracking-tighter">
              O<span className="text-secondary">L</span>X
            </Link>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-2xl ml-8">
            <form onSubmit={handleSearch} className="w-full flex">
              <input
                type="text"
                placeholder="Find Cars, Mobile Phones and more..."
                className="w-full border-2 border-primary border-r-0 rounded-l-md py-2 px-4 focus:outline-none focus:ring-0"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <button type="submit" className="bg-primary text-white px-6 rounded-r-md hover:bg-opacity-90 flex items-center justify-center">
                <FiSearch size={20} />
              </button>
            </form>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="hidden md:flex items-center text-primary font-semibold cursor-pointer">
                  <FiUser className="mr-1" /> {user.name} {user.role === 'admin' && '(Admin)'}
                </span>
                {user.role !== 'admin' && (
                  <Link to="/my-listings" className="text-gray-600 hover:text-primary font-bold underline-offset-4 hover:underline hidden md:inline">
                    My Ads
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-600 flex items-center font-bold underline-offset-4 hover:underline"
                >
                  <FiLogOut className="md:hidden" size={20} />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-primary font-bold hover:underline underline-offset-4">
                Login
              </Link>
            )}
            
            {user?.role === 'admin' ? (
              <Link 
                to="/admin" 
                className="hidden md:flex items-center justify-center bg-white border-[4px] border-t-purple-500 border-l-purple-500 border-b-primary border-r-primary rounded-full px-5 py-1.5 font-bold text-primary shadow-sm hover:shadow-md transition-shadow"
              >
                ADMIN
              </Link>
            ) : (
              <Link 
                to="/create-product" 
                className="hidden md:flex items-center justify-center bg-white border-[4px] border-t-secondary border-l-secondary border-b-primary border-r-primary rounded-full px-5 py-1.5 font-bold text-primary shadow-sm hover:shadow-md transition-shadow"
              >
                <FiPlus className="mr-1" size={18}/> SELL
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
