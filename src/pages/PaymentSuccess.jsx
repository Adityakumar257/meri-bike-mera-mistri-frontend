import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiCheckCircle, FiAlertCircle, FiHome, FiPackage } from 'react-icons/fi';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);
  
  const orderId = searchParams.get('order_id');
  const trackingId = searchParams.get('tracking_id');
  const status = searchParams.get('order_status');
  
  useEffect(() => {
    const verifyPayment = async () => {
      try {
        if (orderId) {
          // Update payment status in backend
          await api.post('/orders/verify-payment', {
            orderId,
            trackingId,
            status
          }, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          setPaymentStatus(status === 'Success' ? 'success' : 'failed');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setPaymentStatus('failed');
      } finally {
        setLoading(false);
      }
    };
    
    verifyPayment();
  }, [orderId, trackingId, status, token]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying payment status...</p>
        </div>
      </div>
    );
  }
  
  const isSuccess = paymentStatus === 'success';
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${isSuccess ? 'bg-green-100' : 'bg-red-100'}`}>
              {isSuccess ? (
                <FiCheckCircle className="w-12 h-12 text-green-600" />
              ) : (
                <FiAlertCircle className="w-12 h-12 text-red-600" />
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {isSuccess ? 'Payment Successful!' : 'Payment Failed'}
            </h1>
            
            <p className="text-gray-600 mb-6">
              {isSuccess 
                ? 'Your payment has been processed successfully. Your order will be shipped soon.'
                : 'We could not process your payment. Please try again or use a different payment method.'
              }
            </p>
            
            {orderId && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600">Order Reference</p>
                <p className="font-medium text-gray-900">{orderId}</p>
              </div>
            )}
            
            {trackingId && isSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-green-800">Transaction ID: {trackingId}</p>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium transition-colors flex items-center justify-center gap-2"
              >
                <FiHome className="w-5 h-5" />
                Back to Home
              </button>
              
              {isSuccess ? (
                <button
                  onClick={() => navigate('/orders')}
                  className="px-6 py-3 border border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <FiPackage className="w-5 h-5" />
                  View Orders
                </button>
              ) : (
                <button
                  onClick={() => navigate('/checkout')}
                  className="px-6 py-3 border border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 font-medium transition-colors"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;