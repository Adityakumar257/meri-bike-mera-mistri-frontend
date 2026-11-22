import React from 'react';
import { FaSpinner, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const Settings = ({
  user,
  dashboardStats,
  products,
  loading,
  isAuthenticated,
  API_BASE_URL,
  fetchAuthenticatedUser
}) => {
  const getTotalProducts = () => {
    return products.toys.length + products.books.length + products.workshops.length;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="space-y-6">
          <div>
            <h3 className="mb-4 font-semibold">Brand Identity</h3>
            <div className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4">
              <img
                src="/mbmm-logo.webp"
                alt="Meri Bike Mera Mistri official logo"
                className="h-24 w-24 rounded-md border border-slate-100 object-contain"
              />
              <p className="text-sm text-slate-600">
                Official Meri Bike Mera Mistri branding used across the storefront and admin panel.
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">User Information</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-sm text-gray-600 w-32">Name:</span>
                <span className="font-medium">{user.name}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 w-32">Email:</span>
                <span className="font-medium">{user.email || 'Not available'}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 w-32">Role:</span>
                <span className="font-medium">{user.role}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 w-32">Status:</span>
                <span className={`font-medium ${isAuthenticated() ? 'text-green-600' : 'text-red-600'}`}>
                  {isAuthenticated() ? 'Authenticated' : 'Not Authenticated'}
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">API Configuration</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">API Base URL: <code className="bg-gray-100 px-2 py-1 rounded">{API_BASE_URL}</code></p>
              <p className="text-sm text-gray-600">Token Status: 
                <span className={`ml-2 font-medium ${isAuthenticated() ? 'text-green-600' : 'text-red-600'}`}>
                  {isAuthenticated() ? 'Valid Token' : 'No Token'}
                </span>
              </p>
              <button 
                onClick={fetchAuthenticatedUser}
                disabled={loading.user}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center disabled:opacity-50"
              >
                {loading.user ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Refreshing...
                  </>
                ) : (
                  'Refresh User Data'
                )}
              </button>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">System Information</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Total Products: <span className="font-medium">{getTotalProducts()}</span></p>
              <p className="text-sm text-gray-600">Total Categories: <span className="font-medium">{dashboardStats.totalCategories}</span></p>
              <p className="text-sm text-gray-600">Featured Products: <span className="font-medium">{dashboardStats.featuredProducts}</span></p>
              <p className="text-sm text-gray-600">New Arrivals: <span className="font-medium">{dashboardStats.newArrivals}</span></p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 mr-3">
                    <FaCheckCircle />
                  </div>
                  <div>
                    <p className="font-medium">Database Connection</p>
                    <p className="text-sm text-gray-600">Connected to MongoDB</p>
                  </div>
                </div>
                <span className="text-xs text-green-600 font-medium">Active</span>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 mr-3">
                    <FaCheckCircle />
                  </div>
                  <div>
                    <p className="font-medium">File Upload Service</p>
                    <p className="text-sm text-gray-600">Image upload enabled</p>
                  </div>
                </div>
                <span className="text-xs text-green-600 font-medium">Active</span>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mr-3">
                    <FaExclamationTriangle />
                  </div>
                  <div>
                    <p className="font-medium">Email Service</p>
                    <p className="text-sm text-gray-600">SMTP not configured</p>
                  </div>
                </div>
                <span className="text-xs text-yellow-600 font-medium">Warning</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;