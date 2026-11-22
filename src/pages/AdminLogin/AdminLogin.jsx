import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaSpinner, FaExclamationTriangle, FaEye, FaEyeSlash } from 'react-icons/fa';
// ✅ Import AdminService from centralized API
import { AdminService } from '../../services/api';

const AdminLogin = () => {
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ❌ Removed hardcoded API_URL (Handled in api.js)

  useEffect(() => {
    if (!loading && user) {
      navigate(['admin', 'superadmin'].includes(user.role) ? '/postdata' : '/', { replace: true });
    }
  }, [loading, navigate, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await AdminService.login({
        email: formData.email,
        password: formData.password
      });

      if (response.data.success) {
        const userRole = response.data.user.role; 

        if (!['admin', 'superadmin'].includes(userRole)) {
          setError('Access Denied: You do not have administrator privileges.');
          setIsLoading(false);
          return;
        }

        // Login successful
        login(response.data.user, response.data.token);
        navigate('/postdata');
      }
    } catch (err) {
      const msg = err.message || 'Login failed. Please check your credentials.';
      setError(msg);
      
      if (err.status === 0) {
        setError(prev => prev + ' Network error. Check if backend is running.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Network test function
  const testNetworkConnection = async () => {
    try {
      setIsLoading(true);
      // ✅ Use AdminService to get server info (acts as a health check)
      const testResponse = await AdminService.getServerInfo();
      console.log('✅ Network test successful:', testResponse.data);
      alert(`✅ Backend is accessible!\nServer: ${testResponse.data.server?.name || 'Online'}`);
    } catch {
      alert(`❌ Cannot connect to backend.\n\nPlease check:\n1. Backend is running\n2. Firewall allows connection\n3. Correct API URL in environment`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f6fa] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-md border border-[#dce5ef]">
        
        {/* Admin Header */}
        <div className="bg-gradient-to-r from-[#07346f] to-[#0b4b96] p-6 text-center border-b border-[#dce5ef]">
          <img
            src="/mbmm-logo.webp"
            alt="Meri Bike Mera Mistri"
            className="mx-auto mb-3 h-24 w-24 rounded-lg bg-white p-2 object-contain"
          />
          <h1 className="text-2xl font-bold text-white mb-1">Admin Portal</h1>
          <p className="text-blue-100 text-sm">Secure Access</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#17243b] mb-2">Admin Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-white text-[#17243b] border border-[#dce5ef] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0b4b96]"
                placeholder="name@company.com"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block text-sm font-medium text-[#17243b] mb-2">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-white text-[#17243b] border border-[#dce5ef] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0b4b96]"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[42px] text-gray-400 hover:text-[#07346f]"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Network Info */}
            <div className="bg-[#f3f6fa] rounded-lg p-3 border border-[#dce5ef]">
              <p className="text-sm text-[#17243b]">
                Sign in using an active administrator account.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/50 border border-red-500/50 rounded-lg p-3 flex items-start">
                <FaExclamationTriangle className="text-red-500 mt-1 mr-2" />
                <div className="flex-1">
                  <p className="text-sm text-red-200">{error}</p>
                  <button 
                    type="button"
                    onClick={testNetworkConnection}
                    className="text-xs text-[#0b4b96] hover:text-[#07346f] mt-2 underline"
                  >
                    Test backend connection
                  </button>
                </div>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0b4b96] hover:bg-[#07346f] text-white font-bold py-3 rounded-lg transition duration-200 flex items-center justify-center disabled:opacity-50"
            >
              {isLoading ? <FaSpinner className="animate-spin mr-2" /> : 'Login to Dashboard'}
            </button>

            {/* Test Connection Button */}
            <button
              type="button"
              onClick={testNetworkConnection}
              disabled={isLoading}
              className="w-full bg-white hover:bg-[#f3f6fa] text-[#07346f] border border-[#dce5ef] py-3 rounded-lg transition duration-200 flex items-center justify-center text-sm"
            >
              Test Backend Connection
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;