import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// ✅ Import AuthService from centralized API
import { AuthService } from '../../services/api';

const VerificationPage = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // ❌ Removed hardcoded API_URL

  useEffect(() => {
    const verifyEmail = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');

      if (!token) {
        setMessage('No verification token found');
        setIsLoading(false);
        return;
      }

      try {
        // ✅ Use AuthService instead of direct axios
        // Passing token in body as per api.js definition (POST request)
        const response = await AuthService.verifyEmail({ token });

        if (response.data.success) {
          setIsSuccess(true);
          setMessage('Email verified successfully! Redirecting to login...');
          
          // 3 seconds ke baad login page par redirect
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else {
          setMessage('Verification failed: ' + response.data.message);
        }
      } catch (error) {
        console.error('Verification error:', error);
        setMessage(error.response?.data?.message || 'Verification failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-md">
        <div className="bg-orange-600 p-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            Email Verification
          </h1>
        </div>
        
        <div className="p-8 text-center">
          {isLoading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
              <p className="text-gray-600">Verifying your email...</p>
            </div>
          ) : (
            <div>
              <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4 ${
                isSuccess ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {isSuccess ? (
                  <span className="text-green-600 text-2xl">✓</span>
                ) : (
                  <span className="text-red-600 text-2xl">✗</span>
                )}
              </div>
              
              <p className={`text-lg mb-4 ${
                isSuccess ? 'text-green-800' : 'text-red-800'
              }`}>
                {message}
              </p>
              
              {!isSuccess && (
                <button
                  onClick={() => navigate('/login')}
                  className="mt-4 bg-orange-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-orange-700"
                >
                  Go to Login
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;