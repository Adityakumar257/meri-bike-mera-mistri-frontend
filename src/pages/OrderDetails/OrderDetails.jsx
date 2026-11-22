// src/pages/OrderDetails.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FiPackage, FiTruck, FiCheckCircle, FiClock, 
  FiMapPin, FiCreditCard, FiCalendar, FiAlertCircle,
  FiArrowLeft, FiPhone, FiDownload, FiXCircle
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import axios from 'axios';
import { API_BASE_URL as API_URL } from '../../services/api';

const OrderDetails = () => {
  const { orderId } = useParams();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/order/${orderId}` } });
      return;
    }

    fetchOrderDetails();
  }, [orderId, isAuthenticated, navigate]);

  const fetchOrderDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setOrder(response.data.data.order);
      } else {
        toast.error('Failed to load order details');
        navigate('/my-orders');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Unable to load order. Please try again.');
      navigate('/my-orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      return;
    }

    setCancelling(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `${API_URL}/orders/${orderId}/cancel`,
        { reason: 'Cancelled by customer' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success('Order cancelled successfully');
        setOrder(response.data.data.order);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  // Status timeline steps
  const getStatusSteps = () => {
    const steps = [
      { status: 'pending', label: 'Order Placed', icon: FiClock },
      { status: 'confirmed', label: 'Confirmed', icon: FiCheckCircle },
      { status: 'processing', label: 'Processing', icon: FiPackage },
      { status: 'shipped', label: 'Shipped', icon: FiTruck },
      { status: 'delivered', label: 'Delivered', icon: FiCheckCircle },
    ];

    if (order?.status === 'cancelled') {
      return [{ status: 'cancelled', label: 'Cancelled', icon: FiXCircle }];
    }

    const currentIndex = steps.findIndex(s => s.status === order?.status);
    return steps.slice(0, currentIndex + 1);
  };

  const completedSteps = getStatusSteps();
  const currentStatus = order?.status || 'pending';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded-xl"></div>
              <div className="h-48 bg-gray-200 rounded-xl"></div>
              <div className="h-64 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiAlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Order not found</h1>
          <p className="text-gray-600 mt-2">The order you're looking for doesn't exist or has been removed.</p>
          <Link to="/my-orders" className="mt-6 inline-block text-orange-600 hover:text-orange-700 font-medium">
            ← Back to My Orders
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = order.subtotal || order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const gst = order.tax || subtotal * 0.1;
  const shipping = order.shipping || (subtotal >= 999 ? 0 : 99);
  const total = order.totalAmount || subtotal + gst + shipping;

  const canCancel = ['pending', 'confirmed', 'processing'].includes(order.status) && order.paymentMethod === 'cod';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back Button & Header */}
        <div className="mb-8">
          <Link
            to="/my-orders"
            className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium mb-4 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Back to My Orders
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
              <p className="text-gray-600 mt-1">Order #{order.orderNumber}</p>
            </div>
            
            <div className="mt-4 sm:mt-0 text-right">
              <div className="text-2xl font-bold text-orange-600">
                ₹{total.toLocaleString('en-IN')}
              </div>
              <span className={`inline-block mt-2 px-4 py-2 rounded-full text-sm font-semibold
                ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                  'bg-orange-100 text-orange-800'}`}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Status</h2>
          
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>
            
            {['pending', 'confirmed', 'processing', 'shipped', 'delivered'].map((status, index) => {
              const Icon = {
                pending: FiClock,
                confirmed: FiCheckCircle,
                processing: FiPackage,
                shipped: FiTruck,
                delivered: FiCheckCircle
              }[status];
              
              const isCompleted = completedSteps.some(s => s.status === status);
              const isCurrent = currentStatus === status;
              
              return (
                <div key={status} className="relative flex items-center mb-8 last:mb-0">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center z-10
                    ${isCompleted ? 'bg-green-500' : isCurrent ? 'bg-orange-500' : 'bg-gray-300'}
                    ${isCompleted || isCurrent ? 'text-white' : 'text-gray-500'}`}
                  >
                    <Icon className="w-8 h-8" />
                  </div>
                  
                  <div className="ml-6">
                    <h3 className={`font-semibold text-lg
                      ${isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'}`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </h3>
                    {order[`${status}Date`] && (
                      <p className="text-sm text-gray-600">
                        {new Date(order[`${status}Date`]).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
            
            {order.status === 'cancelled' && (
              <div className="relative flex items-center">
                <div className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center z-10">
                  <FiXCircle className="w-8 h-8" />
                </div>
                <div className="ml-6">
                  <h3 className="font-semibold text-lg text-red-700">Order Cancelled</h3>
                  {order.cancelledDate && (
                    <p className="text-sm text-gray-600">
                      {new Date(order.cancelledDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  )}
                  {order.cancellationReason && (
                    <p className="text-sm text-gray-600 mt-1">Reason: {order.cancellationReason}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Items Ordered</h2>
              
              <div className="space-y-6">
                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-6 pb-6 border-b last:border-0">
                    <div className="w-24 h-24 bg-orange-50 rounded-xl flex items-center justify-center p-2">
                      <img
                        src={item.image || 'https://via.placeholder.com/150'}
                        alt={item.productName}
                        className="w-full h-full object-contain rounded"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900">{item.productName}</h3>
                      <p className="text-gray-600 text-sm mt-1">Quantity: {item.quantity}</p>
                      <div className="mt-3 flex justify-between items-center">
                        <span className="text-gray-600">Price</span>
                        <span className="font-semibold text-orange-600">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Price Breakdown</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between py-3">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-gray-600">GST (10%)</span>
                  <span className="font-semibold">₹{gst.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
                <div className="pt-4 border-t-2">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total Paid</span>
                    <span className="text-orange-600">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            {/* Shipping Address */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <FiMapPin className="mr-2" /> Shipping Address
              </h2>
              <div className="text-gray-700">
                <p className="font-semibold">{order.shippingInfo.fullName}</p>
                <p>{order.shippingInfo.address}</p>
                {order.shippingInfo.landmark && <p>{order.shippingInfo.landmark}</p>}
                <p>{order.shippingInfo.city}, {order.shippingInfo.state} - {order.shippingInfo.pincode}</p>
                <p>Phone: {order.shippingInfo.phone}</p>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <FiCreditCard className="mr-2" /> Payment Information
              </h2>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-600">Method:</span>
                  <span className="ml-2 font-semibold capitalize">{order.paymentMethod}</span>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>
                  <span className={`ml-2 font-semibold
                    ${order.paymentStatus === 'paid' ? 'text-green-600' :
                      order.paymentStatus === 'failed' ? 'text-red-600' :
                      'text-orange-600'}`}
                  >
                    {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                  </span>
                </div>
                {order.transactionId && (
                  <div>
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="ml-2 font-medium text-sm break-all">{order.transactionId}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Order Info */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <FiCalendar className="mr-2" /> Order Information
              </h2>
              <div className="space-y-3 text-gray-700">
                <div>
                  <span className="text-gray-600">Order Date:</span>
                  <p className="font-medium">
                    {new Date(order.orderDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                {order.estimatedDelivery && (
                  <div>
                    <span className="text-gray-600">Estimated Delivery:</span>
                    <p className="font-medium text-orange-600">
                      {new Date(order.estimatedDelivery).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                )}
                {order.trackingNumber && (
                  <div>
                    <span className="text-gray-600">Tracking Number:</span>
                    <p className="font-medium">{order.trackingNumber}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {canCancel && (
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50"
                >
                  {cancelling ? 'Cancelling...' : 'Cancel Order'}
                </button>
              )}
              
              <a
                href="https://wa.me/918506911777"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg text-center"
              >
                <FiPhone className="inline mr-2" />
                Need Help? Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;