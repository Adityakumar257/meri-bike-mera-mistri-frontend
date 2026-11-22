// pages/AdminLogin.jsx - SIMPLE WORKING VERSION
import React, { useState } from 'react';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  
  // Admin credentials
  const ADMIN_EMAIL = 'admin@brainytoys.com';
  const ADMIN_PASSWORD = 'Admin@123';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }

    // Check credentials
    const cleanEmail = formData.email.trim().toLowerCase();
    
    if (cleanEmail === ADMIN_EMAIL && formData.password === ADMIN_PASSWORD) {
      console.log('✅ Admin login successful');
      
      // Store admin login info
      const adminUser = {
        email: cleanEmail,
        name: 'BrainyToys Admin',
        role: 'admin'
      };
      
      localStorage.setItem('adminToken', 'admin-token-' + Date.now());
      localStorage.setItem('adminUser', JSON.stringify(adminUser));
      
      setSuccess('Login successful! Redirecting...');
      
      // ✅ FORCE REDIRECT - THIS ALWAYS WORKS
      setTimeout(() => {
        window.location.href = '/postdata'; // This will definitely work
      }, 1000);
      
    } else {
      setError('Invalid email or password. Use: admin@brainytoys.com / Admin@123');
    }
    
    setLoading(false);
  };

  const autoFillCredentials = () => {
    setFormData({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white text-2xl">🔐</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">BrainyToys Admin</h1>
          <p className="text-gray-600">Direct Admin Login</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✅</span>
                <span className="font-medium text-green-700">{success}</span>
              </div>
            </div>
          )}
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <span className="text-red-500 mr-2">❌</span>
                <span className="font-medium text-red-700">{error}</span>
              </div>
            </div>
          )}

          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-blue-700 mb-2">Test Credentials</p>
            <p className="text-sm text-blue-600">Email: admin@brainytoys.com</p>
            <p className="text-sm text-blue-600">Password: Admin@123</p>
            <button
              onClick={autoFillCredentials}
              className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
            >
              Auto-fill
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="admin@brainytoys.com"
                required
              />
            </div>

            <div className="mb-8">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none pr-10"
                  placeholder="Admin@123"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-4 rounded-lg transition flex items-center justify-center disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Logging in...
                </>
              ) : (
                'Login to Dashboard'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>You'll be redirected to /postdata after login</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;