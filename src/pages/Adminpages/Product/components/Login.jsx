import React, { useState } from 'react';
import { FaShoppingBag, FaUser, FaBookOpen, FaSpinner } from 'react-icons/fa';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLogin({
        id: 'user_' + Date.now(),
        name: username || 'Demo User',
        email: `${username}@example.com`,
        role: 'admin'
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mb-4"><FaShoppingBag className="text-white text-4xl" /></div>
          <h2 className="text-3xl font-bold text-gray-800">Product Management</h2>
          <p className="text-gray-600 mt-2">Login to manage your products</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Username</label><div className="relative"><FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /><input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg" placeholder="Enter your username" required /></div></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Password</label><div className="relative"><FaBookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg" placeholder="Enter your password" required /></div></div>
          <button type="submit" disabled={loading} className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg flex items-center justify-center">{loading ? <><FaSpinner className="animate-spin mr-2" /> Logging in...</> : 'Login'}</button>
          <div className="text-center text-sm text-gray-600 pt-4 border-t border-gray-200"><p>Demo: Enter any username and password</p></div>
        </form>
      </div>
    </div>
  );
};

export default Login;