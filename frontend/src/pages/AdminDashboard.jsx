import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold text-primary mb-4">Admin Dashboard</h1>
        <p className="text-gray-600 mb-8">
          Welcome back, <span className="font-semibold text-secondary">{user?.name}</span>. You have admin privileges.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 shadow-sm">
            <h2 className="text-xl font-semibold text-blue-800 mb-2">Manage Users</h2>
            <p className="text-blue-600 text-sm mb-4">View, edit, or remove users from the platform.</p>
            <Link to="/admin/users" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors">
              Go to Users
            </Link>
          </div>

          <div className="bg-green-50 p-6 rounded-lg border border-green-100 shadow-sm">
            <h2 className="text-xl font-semibold text-green-800 mb-2">Manage Products</h2>
            <p className="text-green-600 text-sm mb-4">Review all listings and remove violating content.</p>
            <Link to="/admin/products" className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors">
              Go to Products
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
