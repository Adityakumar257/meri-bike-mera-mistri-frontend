import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import api, { API_BASE_URL } from '../services/api';
import toast from 'react-hot-toast';

const PaymentTest = () => {
  const { orderId } = useParams();
  const [loading, setLoading] = useState(false);
  const [testDetails, setTestDetails] = useState({
    cardNumber: '5123456789012346',
    expiryMonth: '05',
    expiryYear: '30',
    cvv: '123',
    cardName: 'TEST CARD'
  });

  const handleTestPayment = async () => {
    try {
      setLoading(true);
      
      // Create a test order first
      const testOrder = {
        shippingInfo: {
          fullName: 'Test Customer',
          email: 'test@example.com',
          phone: '9876543210',
          address: 'Test Address, Mumbai',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001'
        },
        items: [{
          productId: 'test_product_1',
          name: 'Test Toy',
          quantity: 1,
          price: 1,
          image: 'test.jpg',
          sku: 'TEST001'
        }],
        paymentMethod: 'online',
        paymentProvider: 'ccavenue',
        subtotal: 1,
        shipping: 0,
        gst: 0,
        total: 1,
        notes: 'Test payment order'
      };

      const response = await api.post('/orders', testOrder);
      
      if (response.data.success) {
        const newOrderId = response.data.data.order._id;
        
        // Initiate payment for the test order
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = `${API_BASE_URL}/orders/${newOrderId}/pay`;
        
        const orderIdInput = document.createElement('input');
        orderIdInput.type = 'hidden';
        orderIdInput.name = 'orderId';
        orderIdInput.value = newOrderId;
        
        form.appendChild(orderIdInput);
        document.body.appendChild(form);
        form.submit();
      }
      
    } catch (error) {
      console.error('Test payment error:', error);
      toast.error('Test payment failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            CCAvenue Payment Gateway Test
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Test Card Details */}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h2 className="text-xl font-bold text-blue-900 mb-4">
                🧪 Test Card Details
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={testDetails.cardNumber}
                    readOnly
                    className="w-full px-4 py-2 bg-white border border-blue-300 rounded-md font-mono"
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1">
                      MM
                    </label>
                    <input
                      type="text"
                      value={testDetails.expiryMonth}
                      readOnly
                      className="w-full px-4 py-2 bg-white border border-blue-300 rounded-md text-center"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1">
                      YY
                    </label>
                    <input
                      type="text"
                      value={testDetails.expiryYear}
                      readOnly
                      className="w-full px-4 py-2 bg-white border border-blue-300 rounded-md text-center"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      value={testDetails.cvv}
                      readOnly
                      className="w-full px-4 py-2 bg-white border border-blue-300 rounded-md text-center"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={testDetails.cardName}
                    readOnly
                    className="w-full px-4 py-2 bg-white border border-blue-300 rounded-md"
                  />
                </div>
              </div>
              
              <div className="mt-6 bg-blue-100 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> ये CCAvenue के test mode के लिए valid test card details हैं। 
                  किसी real पेमेंट के लिए इनका use न करें।
                </p>
              </div>
            </div>
            
            {/* Test Instructions */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                📋 Test Instructions
              </h2>
              
              <ol className="space-y-3 list-decimal pl-5 text-gray-700">
                <li>CCAvenue के test environment में redirect होगा</li>
                <li>"Enter Test Card Number" पर click करें</li>
                <li>Card details automatically fill हो जाएँगे</li>
                <li>"Pay" button पर click करें</li>
                <li>Success page पर redirect होना चाहिए</li>
                <li>Order database में payment status update check करें</li>
              </ol>
              
              <div className="mt-8">
                <button
                  onClick={handleTestPayment}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Start Test Payment (₹1)'}
                </button>
                
                <p className="text-sm text-gray-600 mt-4 text-center">
                  This will create a test order and redirect to CCAvenue
                </p>
              </div>
            </div>
          </div>
          
          {/* CCAvenue Test URLs */}
          <div className="mt-8 bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <h3 className="text-lg font-bold text-yellow-900 mb-3">
              🔗 CCAvenue Test URLs
            </h3>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-sm text-yellow-800 font-medium w-32">Test URL:</span>
                <code className="flex-1 bg-white p-2 rounded text-sm border">
                  https://test.ccavenue.com
                </code>
              </div>
              
              <div className="flex items-center">
                <span className="text-sm text-yellow-800 font-medium w-32">Merchant ID:</span>
                <code className="flex-1 bg-white p-2 rounded text-sm border">
                  {process.env.REACT_APP_CCA_MERCHANT_ID || '15172'}
                </code>
              </div>
              
              <div className="flex items-center">
                <span className="text-sm text-yellow-800 font-medium w-32">Access Code:</span>
                <code className="flex-1 bg-white p-2 rounded text-sm border">
                  {process.env.REACT_APP_CCA_ACCESS_CODE || 'SOYGZGXSF3JTWRWZ'}
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentTest;