import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiPlus, FiUser, FiLogOut, FiMapPin, FiMessageSquare } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = [];
    if (keyword.trim()) params.push(`q=${encodeURIComponent(keyword)}`);
    if (location.trim()) params.push(`location=${encodeURIComponent(location)}`);
    
    navigate(`/search?${params.join('&')}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-[#f2f4f5] border-b shadow-sm sticky top-0 z-50 py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 gap-4">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-primary text-3xl font-extrabold tracking-tighter">
              O<span className="text-[#002f34]">L</span>X
            </Link>
          </div>

          {/* Dual Search Bar (Desktop) */}
          <div className="hidden md:flex flex-grow max-w-4xl gap-2 items-center">
            <form onSubmit={handleSearch} className="w-full flex gap-3">
              {/* Location Selector */}
              <div className="flex border-2 border-primary rounded bg-white w-72 h-12">
                <div className="flex items-center pl-3 text-primary">
                  <FiMapPin size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Search city, state..."
                  className="w-full py-2 px-3 focus:outline-none text-sm text-primary font-medium"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              {/* Keyword Search */}
              <div className="flex flex-1 border-2 border-primary rounded bg-white h-12">
                <input
                  type="text"
                  placeholder="Find Cars, Mobile Phones and more..."
                  className="w-full py-2 px-4 focus:outline-none text-sm text-primary font-medium"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
                <button type="submit" className="bg-primary text-white px-6 hover:bg-opacity-95 flex items-center justify-center cursor-pointer transition-colors">
                  <FiSearch size={22} />
                </button>
              </div>
            </form>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-6">
            {user ? (
              <div className="flex items-center space-x-6">
                <span className="hidden md:flex items-center text-primary font-bold cursor-pointer text-sm">
                  <FiUser className="mr-1" size={18} /> {user.name} {user.role === 'admin' && '(Admin)'}
                </span>
                
                {/* Chat Link */}
                <Link to="/chats" className="text-primary hover:text-[#002f34] font-bold flex items-center gap-1.5 text-sm transition-colors">
                  <FiMessageSquare size={20} />
                  <span className="hidden md:inline">Chats</span>
                </Link>

                {user.role !== 'admin' && (
                  <Link to="/my-listings" className="text-primary hover:text-[#002f34] font-bold text-sm hidden md:inline transition-colors">
                    My Ads
                  </Link>
                )}
                
                <button 
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-600 flex items-center font-bold text-sm transition-colors"
                >
                  <FiLogOut className="md:hidden" size={20} />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-primary font-bold hover:no-underline border-b-2 border-primary pb-0.5 hover:border-transparent text-sm transition-all">
                Login
              </Link>
            )}
            
            {user?.role === 'admin' && (
              <Link 
                to="/admin" 
                className="hidden md:flex items-center justify-center bg-white border-[5px] border-t-[#3b82f6] border-l-[#f59e0b] border-b-[#ef4444] border-r-[#10b981] rounded-full px-5 py-1 font-extrabold text-primary shadow-sm hover:shadow transition-all uppercase tracking-wider text-xs"
              >
                ADMIN
              </Link>
            )}
            
            <Link 
              to="/create-product" 
              className="hidden md:flex items-center justify-center bg-white border-[5px] border-t-[#23e5db] border-l-[#ffce32] border-b-[#3a77ff] border-r-[#23e5db] rounded-full px-5 py-1 font-extrabold text-primary shadow-sm hover:shadow transition-all tracking-wider text-sm"
            >
              <FiPlus className="mr-1" size={18}/> SELL
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
