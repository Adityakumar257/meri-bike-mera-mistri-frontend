// pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    if (!email) {
      setError('Email is required');
      setIsLoading(false);
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, {
        email: email
      });
      
      if (response.data.success) {
        setSuccess('Password reset link has been sent to your email');
        setIsSubmitted(true);
      } else {
        setError(response.data.message || 'Something went wrong');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-12 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Back to Login */}
        <div className="mb-8">
          <Link 
            to="/login" 
            className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isSubmitted ? 'Check Your Email' : 'Forgot Password'}
            </h1>
            <p className="text-gray-600">
              {isSubmitted 
                ? 'We\'ve sent password reset instructions to your email'
                : 'Enter your email to reset your password'
              }
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  We'll send a password reset link to this email
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : 'Send Reset Link'}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-6">
              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <p className="text-green-700 font-medium">{success}</p>
                  </div>
                </div>
              )}
              
              <div className="p-4 bg-blue-50 text-blue-700 rounded-lg">
                <p className="font-medium">
                  Password reset email sent to <span className="font-bold">{email}</span>
                </p>
                <p className="text-sm mt-1">
                  Check your inbox and follow the instructions to reset your password.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-1">Didn't receive the email?</p>
                  <ul className="list-disc list-inside text-left space-y-1">
                    <li>Check your spam folder</li>
                    <li>Make sure you entered the correct email</li>
                    <li>Wait a few minutes and try again</li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setEmail('');
                      setError('');
                      setSuccess('');
                    }}
                    className="w-full py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Additional Help */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600">
              Need help?{' '}
              <Link 
                to="/contact" 
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                Contact Support
              </Link>
            </p>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800 text-center">
            <span className="font-semibold">Security Note:</span> We never ask for your password via email or phone.
            Only reset through this secure portal.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;