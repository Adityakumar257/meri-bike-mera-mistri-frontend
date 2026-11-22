import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiCreditCard,
  FiTruck,
  FiLock,
  FiCheckCircle,
  FiMapPin,
  FiUser,
  FiMail,
  FiPhone,
  FiPackage,
  FiLoader,
  FiGlobe,
  FiSmartphone,
  FiShield,
  FiAlertCircle
} from 'react-icons/fi';
import { FaUniversity, FaWallet } from 'react-icons/fa';
import { 
  FaCcVisa, 
  FaCcMastercard, 
  FaCcAmex, 
  FaCcDiscover, 
  FaCcDinersClub,
  FaCcJcb
} from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialParams = new URLSearchParams(location.search);
  const initialPayment = initialParams.get('payment');
  const initialOrderId = initialParams.get('order_id');
  const initialCancelledOrderId = initialParams.get('payment') === 'cancelled'
    ? initialOrderId
    : null;
  const initialSessionId = initialParams.get('session_id');
  const initialSuccessfulOrderId = initialPayment === 'success' && initialOrderId && initialSessionId
    ? initialOrderId
    : null;
  const hasInvalidPaymentReturn = initialPayment &&
    (initialPayment !== 'success' || !initialOrderId || !initialSessionId);
  const { cart: cartItems, getCartTotal, clearCart } = useCart();
  const { user, isAuthenticated, token } = useAuth();
  
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState(
    initialCancelledOrderId || initialSuccessfulOrderId ? 'online' : 'cod'
  );
  const [selectedPaymentType, setSelectedPaymentType] = useState(
    initialCancelledOrderId || initialSuccessfulOrderId ? 'online' : ''
  );
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [pincodeSuggestions, setPincodeSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [paymentError, setPaymentError] = useState(
    initialCancelledOrderId
      ? 'Checkout was cancelled. Your order is saved; you can retry the payment below.'
      : hasInvalidPaymentReturn
        ? 'Unable to verify the payment return. Please check your orders before trying again.'
        : null
  );
  const [pendingOrderId, setPendingOrderId] = useState(() =>
    initialCancelledOrderId || initialSuccessfulOrderId || localStorage.getItem('pendingOrderId')
  );
  const [shippingInfoOverrides, setShippingInfoOverrides] = useState({});

  const profileShippingInfo = {
    fullName: user?.name || [user?.firstName, user?.lastName].filter(Boolean).join(' '),
    email: user?.email || '',
    phone: user?.phone || user?.mobile || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    pincode: user?.pincode || '',
    landmark: ''
  };
  const shippingInfo = { ...profileShippingInfo, ...shippingInfoOverrides };
  const setShippingInfo = (updater) => {
    setShippingInfoOverrides(currentOverrides => {
      const currentInfo = { ...profileShippingInfo, ...currentOverrides };
      const nextInfo = typeof updater === 'function' ? updater(currentInfo) : updater;
      const nextOverrides = { ...currentOverrides };

      Object.keys(nextInfo).forEach(field => {
        if (nextInfo[field] === profileShippingInfo[field]) {
          delete nextOverrides[field];
        } else {
          nextOverrides[field] = nextInfo[field];
        }
      });

      return nextOverrides;
    });
  };

  // Authentication check
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to continue checkout');
      const returnPath = `${location.pathname}${location.search}`;
      localStorage.setItem('redirectPath', returnPath);
      navigate('/login');
    }
  }, [isAuthenticated, location.pathname, location.search, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const payment = params.get('payment');
    if (!payment) return;

    if (payment === 'cancelled') {
      const orderId = params.get('order_id');
      if (orderId) {
        localStorage.setItem('pendingOrderId', orderId);
      }
      navigate('/checkout', { replace: true });
      return;
    }

    const orderId = params.get('order_id');
    const sessionId = params.get('session_id');
    if (payment !== 'success' || !orderId || !sessionId) {
      navigate('/checkout', { replace: true });
      return;
    }
    if (!isAuthenticated) return;

    localStorage.setItem('pendingOrderId', orderId);

    let active = true;
    Promise.resolve().then(() => {
      if (!active) return null;
      setLoading(true);
      return api.get(`/orders/${orderId}/stripe-status`, {
        params: { session_id: sessionId },
        headers: { Authorization: `Bearer ${token}` }
      });
    }).then(response => {
      if (!response) return;
      if (!response.data?.success || response.data.data?.paymentStatus !== 'paid') {
        throw new Error('Payment is not complete yet. If you were charged, please contact support.');
      }

      if (!active) return;
      setOrderData(response.data.data.order);
      setPaymentMethod('online');
      setOrderPlaced(true);
      setPendingOrderId(null);
      localStorage.removeItem('pendingOrderId');
      clearCart();
      toast.success('Payment successful! Your order is confirmed.');
      navigate('/checkout', { replace: true });
    }).catch(error => {
      if (!active) return;
      const message = error.response?.data?.message || error.message || 'Unable to verify Stripe payment';
      setPaymentError(message);
      toast.error(message);
      navigate('/checkout', { replace: true });
    }).finally(() => {
      if (active) setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [location.search, isAuthenticated, token, navigate, clearCart]);

  // Safe cart items
  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];
  
  // Calculations
  const subtotal = getCartTotal();
  const gst = 0;
  const shipping = 0;
  const total = subtotal + gst + shipping;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // India Post API for Pincode lookup
  const fetchAddressFromPincode = async (pincode) => {
    if (pincode.length !== 6) return;
    
    setLoadingAddress(true);
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();
      
      if (data[0].Status === "Success") {
        const postOffice = data[0].PostOffice[0];
        
        setShippingInfo(prev => ({
          ...prev,
          city: postOffice.District || '',
          state: postOffice.State || '',
          address: postOffice.Name ? `${postOffice.Name}, ${postOffice.Region}` : prev.address
        }));
        
        if (data[0].PostOffice.length > 1) {
          setPincodeSuggestions(data[0].PostOffice);
          setShowSuggestions(true);
        }
        
        toast.success('Address auto-filled from pincode!');
      } else {
        toast.error('Invalid pincode or no data found');
      }
    } catch (error) {
      console.error('Error fetching pincode data:', error);
      toast.error('Failed to fetch address. Please enter manually.');
    } finally {
      setLoadingAddress(false);
    }
  };

  const handlePincodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setShippingInfo(prev => ({
      ...prev,
      pincode: value
    }));
    
    if (value.length === 6) {
      fetchAddressFromPincode(value);
    }
  };

  const selectSuggestion = (postOffice) => {
    setShippingInfo(prev => ({
      ...prev,
      city: postOffice.District || '',
      state: postOffice.State || '',
      address: `${postOffice.Name}, ${postOffice.Region}`
    }));
    setShowSuggestions(false);
    toast.success('Address selected!');
  };

  const handleNextStep = () => {
    if (step === 1) {
      const requiredFields = ['fullName', 'phone', 'address', 'pincode', 'city', 'state'];
      const missingFields = requiredFields.filter(field => !shippingInfo[field].trim());
      
      if (missingFields.length > 0) {
        toast.error(`Please fill in: ${missingFields.map(f => {
          const fieldNames = {
            fullName: 'Full Name',
            phone: 'Phone Number',
            address: 'Address',
            pincode: 'Pincode',
            city: 'City',
            state: 'State'
          };
          return fieldNames[f];
        }).join(', ')}`);
        return;
      }

      if (shippingInfo.phone.length !== 10 || !/^\d+$/.test(shippingInfo.phone)) {
        toast.error('Please enter a valid 10-digit phone number');
        return;
      }

      if (shippingInfo.pincode.length !== 6 || !/^\d+$/.test(shippingInfo.pincode)) {
        toast.error('Please enter a valid 6-digit pincode');
        return;
      }
    }
    
    if (step === 2 && !selectedPaymentType) {
      toast.error('Please select a payment method');
      return;
    }
    
    if (step === 3 && !termsAccepted) {
      toast.error('Please accept the terms and conditions');
      return;
    }
    
    if (step < 3) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  const startStripeCheckout = async (orderId) => {
    try {
      const response = await api.post(`/orders/${orderId}/stripe-checkout`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const checkoutUrl = response.data?.data?.url;
      if (!response.data?.success || !checkoutUrl) {
        throw new Error(response.data?.message || 'Unable to start secure checkout');
      }

      window.location.assign(checkoutUrl);
    } catch (error) {
      if (
        error.response?.status === 409 &&
        error.response?.data?.message === 'This order is no longer payable'
      ) {
        setPendingOrderId(null);
        localStorage.removeItem('pendingOrderId');
        throw new Error('Your saved checkout is no longer available. Please place the order again.');
      }
      throw error;
    }
  };

  const handlePlaceOrder = async () => {
    try {
      if (!termsAccepted) {
        toast.error('Please accept the terms and conditions');
        return;
      }

      setLoading(true);
      setPaymentError(null);

      if (selectedPaymentType === 'online' && pendingOrderId) {
        await startStripeCheckout(pendingOrderId);
        return;
      }

      const orderDataToSend = {
        shippingInfo,
        items: safeCartItems.map(item => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.currentPrice,
          image: item.image,
          sku: item.sku
        })),
        paymentMethod: selectedPaymentType === 'cod' ? 'cod' : 'online',
        paymentProvider: selectedPaymentType === 'cod' ? null : 'stripe',
        notes: shippingInfo.landmark
      };

      const response = await api.post('/orders', orderDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Order creation failed');
      }

      const order = response.data.data.order;

      if (order.paymentMethod === 'cod') {
        setOrderData(order);
        clearCart();
        setOrderPlaced(true);
        localStorage.setItem('lastOrderId', order._id);
        localStorage.removeItem('pendingOrderId');
        setPendingOrderId(null);
        toast.success('Order placed successfully!');
        return;
      }

      setPendingOrderId(order._id);
      localStorage.setItem('pendingOrderId', order._id);
      await startStripeCheckout(order._id);

    } catch (error) {
      console.error('Order placement error:', error);

      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to place order';

      setPaymentError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Handle payment method selection
  const handlePaymentMethodSelect = (method, type = '') => {
    setPaymentMethod(method);
    setSelectedPaymentType(type);
    setPaymentError(null);
  };

  // Show empty cart if no items
  if (safeCartItems.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center bg-white rounded-lg shadow p-12">
            <div className="text-6xl mb-6">🛒</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Add some amazing toys to your cart before proceeding to checkout!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/category/all"
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-md font-medium"
              >
                Browse Toys
              </Link>
              <Link
                to="/cart"
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-8 py-3 rounded-md font-medium"
              >
                View Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow p-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiCheckCircle className="w-10 h-10 text-green-600" />
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
              <p className="text-gray-600 mb-6">
                Thank you for your order. Your order number is:
              </p>
              <div className="bg-gray-100 rounded-lg p-4 mb-6">
                <p className="text-2xl font-bold text-gray-900">{orderData?.orderNumber}</p>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
                <p className="text-green-800">
                  <span className="font-semibold">Order Summary:</span> {orderData?.items?.length || safeCartItems.length} items • Total: ₹{(orderData?.totalAmount ?? total).toFixed(2)}
                </p>
                <p className="text-green-800 mt-2">
                  Estimated delivery: 4-5 business days
                </p>
                {paymentMethod === 'cod' && (
                  <p className="text-green-800 mt-1">
                    <span className="font-semibold">Payment:</span> Cash on Delivery
                  </p>
                )}
                {paymentMethod === 'online' && (
                  <p className="text-green-800 mt-1">
                    <span className="font-semibold">Payment:</span> Online Payment (Processed through Stripe)
                  </p>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to={`/orders/${orderData?._id}`}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-md font-medium"
                >
                  View Order Details
                </Link>
                <Link
                  to="/category/all"
                  className="border border-orange-600 text-orange-600 hover:bg-orange-50 px-8 py-3 rounded-md font-medium"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-8">
            <Link
              to="/cart"
              className="inline-flex items-center text-orange-600 hover:text-orange-700"
            >
              <FiArrowLeft className="mr-2" />
              Back to Cart
            </Link>
            <div className="text-sm text-gray-600">
              Step {step} of 3
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-12">
            <div className={`flex flex-col items-center ${step >= 1 ? 'text-orange-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step >= 1 ? 'bg-orange-600 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="text-sm font-medium">Shipping</span>
            </div>
            
            <div className={`flex-1 h-1 ${step >= 2 ? 'bg-orange-600' : 'bg-gray-200'}`}></div>
            
            <div className={`flex flex-col items-center ${step >= 2 ? 'text-orange-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step >= 2 ? 'bg-orange-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="text-sm font-medium">Payment</span>
            </div>
            
            <div className={`flex-1 h-1 ${step >= 3 ? 'bg-orange-600' : 'bg-gray-200'}`}></div>
            
            <div className={`flex flex-col items-center ${step >= 3 ? 'text-orange-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step >= 3 ? 'bg-orange-600 text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span className="text-sm font-medium">Confirm</span>
            </div>
          </div>
        </div>

        {/* Payment Error Display */}
        {paymentError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <FiAlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800">Payment Error</p>
                <p className="text-sm text-red-700 mt-1">{paymentError}</p>
                <button
                  onClick={() => setPaymentError(null)}
                  className="text-sm text-red-600 hover:text-red-800 mt-2"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Checkout Form */}
          <div className="lg:w-2/3">
            {step === 1 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <FiMapPin className="mr-3" />
                  Shipping Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={shippingInfo.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={shippingInfo.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="10-digit mobile number"
                      required
                      maxLength="10"
                      pattern="[0-9]{10}"
                    />
                  </div>
                  
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pincode *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="pincode"
                        value={shippingInfo.pincode}
                        onChange={handlePincodeChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-10"
                        placeholder="Enter 6-digit pincode"
                        required
                        maxLength="6"
                        pattern="[0-9]{6}"
                      />
                      {loadingAddress && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <FiLoader className="w-4 h-4 animate-spin text-orange-600" />
                        </div>
                      )}
                    </div>
                    {showSuggestions && pincodeSuggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {pincodeSuggestions.map((postOffice, index) => (
                          <div
                            key={index}
                            onClick={() => selectSuggestion(postOffice)}
                            className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                          >
                            <div className="font-medium">{postOffice.Name}</div>
                            <div className="text-sm text-gray-600">
                              {postOffice.District}, {postOffice.State}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="City"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={shippingInfo.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="State"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Complete Address *
                    </label>
                    <textarea
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="House no, Building, Street, Area"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      name="landmark"
                      value={shippingInfo.landmark}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Nearby landmark"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Payment Method Selection */}
            {step === 2 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <FiCreditCard className="mr-3" />
                  Select Payment Method
                </h2>
                
                <div className="space-y-4">
                  {/* Cash on Delivery */}
                  <div 
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedPaymentType === 'cod' ? 'border-orange-500 bg-orange-50' : 'border-gray-300 hover:border-orange-300'}`}
                    onClick={() => handlePaymentMethodSelect('cod', 'cod')}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="payment"
                        checked={selectedPaymentType === 'cod'}
                        onChange={() => handlePaymentMethodSelect('cod', 'cod')}
                        className="h-5 w-5 text-orange-600"
                      />
                      <div className="ml-3">
                        <span className="text-lg font-medium flex items-center">
                          <FiPackage className="mr-2" />
                          Cash on Delivery
                        </span>
                        <p className="text-gray-600 mt-1">Pay when you receive the order</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Online Payment - Stripe */}
                  <div 
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedPaymentType === 'online' ? 'border-orange-500 bg-orange-50' : 'border-gray-300 hover:border-orange-300'}`}
                    onClick={() => handlePaymentMethodSelect('online', 'online')}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="payment"
                        checked={selectedPaymentType === 'online'}
                        onChange={() => handlePaymentMethodSelect('online', 'online')}
                        className="h-5 w-5 text-orange-600"
                      />
                      <div className="ml-3 flex-1">
                        <span className="text-lg font-medium flex items-center">
                          <FiCreditCard className="mr-2" />
                          Online Payment
                        </span>
                        <p className="text-gray-600 mt-1">Secure payment by card and supported local payment methods via Stripe</p>
                        
                        {/* Accepted Cards */}
                        <div className="flex space-x-2 mt-3">
                          <FaCcVisa className="text-gray-400" title="Visa" />
                          <FaCcMastercard className="text-gray-400" title="Mastercard" />
                          <FaCcAmex className="text-gray-400" title="American Express" />
                          <FaCcDiscover className="text-gray-400" title="Discover" />
                          <FaCcDinersClub className="text-gray-400" title="Diners Club" />
                          <FaCcJcb className="text-gray-400" title="JCB" />
                          <FaUniversity className="text-gray-400" title="Net Banking" />
                          <FaWallet className="text-gray-400" title="UPI/Wallets" />
                        </div>
                      </div>
                      <FiLock className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>

                {/* Stripe Checkout Notice */}
                {selectedPaymentType === 'online' && (
                  <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <FiShield className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">Secure Stripe Checkout</p>
                        <p className="text-xs text-blue-700 mt-1">
                          You will be redirected to Stripe to complete payment securely, then returned here to confirm your order.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Order Confirmation */}
            {step === 3 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <FiCheckCircle className="mr-3" />
                  Order Confirmation
                </h2>
                
                {/* Order Summary */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                  <div className="space-y-3">
                    {safeCartItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-3 border-b">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>Qty: {item.quantity}</span>
                            <span>Price: ₹{item.currentPrice.toLocaleString()}</span>
                          </div>
                        </div>
                        <p className="font-medium text-lg">
                          ₹{(item.currentPrice * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  {/* Totals */}
                  <div className="mt-6 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-green-600">FREE</span>
                    </div>
                    <div className="flex justify-between pt-4 border-t">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-xl font-bold text-orange-600">₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Shipping Information Review */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Details</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start">
                      <FiUser className="w-5 h-5 text-gray-400 mr-3 mt-1" />
                      <div>
                        <p className="font-medium">{shippingInfo.fullName}</p>
                        <div className="flex items-center mt-1 text-sm text-gray-600">
                          <FiPhone className="w-4 h-4 mr-2" />
                          {shippingInfo.phone}
                        </div>
                        <div className="flex items-center mt-1 text-sm text-gray-600">
                          <FiMail className="w-4 h-4 mr-2" />
                          {shippingInfo.email}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-start">
                      <FiMapPin className="w-5 h-5 text-gray-400 mr-3 mt-1" />
                      <div>
                        <p className="text-gray-600">{shippingInfo.address}</p>
                        <p className="text-gray-600 mt-1">
                          {shippingInfo.city}, {shippingInfo.state} - {shippingInfo.pincode}
                        </p>
                        {shippingInfo.landmark && (
                          <p className="text-gray-500 text-sm mt-1">
                            Landmark: {shippingInfo.landmark}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Method Review */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center">
                          {selectedPaymentType === 'cod' ? (
                            <>
                              <FiPackage className="w-5 h-5 text-gray-600 mr-3" />
                              <div>
                                <p className="font-medium">Cash on Delivery</p>
                                <p className="text-sm text-gray-600 mt-1">
                                  Pay when you receive the order
                                </p>
                              </div>
                            </>
                          ) : (
                            <>
                              <FiCreditCard className="w-5 h-5 text-gray-600 mr-3" />
                              <div>
                                <p className="font-medium">Online Payment</p>
                                <p className="text-sm text-gray-600 mt-1">
                                  Secure payment through Stripe
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <FiLock className="w-6 h-6 text-green-600" />
                    </div>
                    
                    {selectedPaymentType === 'online' && (
                      <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                        <p className="text-sm text-blue-800">
                          <strong>Note:</strong> After placing your order, you will be redirected to Stripe to complete payment securely.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="border-t pt-6">
                  <label className="flex items-start cursor-pointer">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="h-5 w-5 text-orange-600 rounded focus:ring-orange-500 mt-1"
                      required
                    />
                    <span className="ml-3 text-sm text-gray-700">
                      I agree to the{' '}
                      <Link to="/terms" className="text-orange-600 hover:underline">
                        Terms & Conditions
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-orange-600 hover:underline">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              {step > 1 && (
                <button
                  onClick={handlePreviousStep}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Previous
                </button>
              )}
              
              <div className={`${step > 1 ? 'ml-auto' : 'w-full'}`}>
                {step < 3 ? (
                  <button
                    onClick={handleNextStep}
                    className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium transition-colors"
                  >
                    Continue to {step === 1 ? 'Payment' : 'Review'}
                  </button>
                ) : (
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading || !termsAccepted}
                    className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[48px]"
                  >
                    {loading ? (
                      <>
                        <FiLoader className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : selectedPaymentType === 'cod' ? (
                      'Place Order (COD)'
                    ) : (
                      'Place Order & Pay Online'
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({safeCartItems.length} items)</span>
                  <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">FREE</span>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Security Badge */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <FiShield className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">100% Secure Payment</span>
                </div>
                
                {/* Stripe Badge for Online Payment */}
                {selectedPaymentType === 'online' && (
                  <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg p-4">
                    <div className="text-center mb-3">
                      <div className="text-xs text-gray-500 mb-1">Powered by</div>
                      <div className="text-xl font-bold text-blue-600">Stripe</div>
                    </div>
                    <div className="text-xs text-gray-500 text-center">
                      Secure hosted checkout
                    </div>
                  </div>
                )}
                
                {/* COD Badge */}
                {selectedPaymentType === 'cod' && (
                  <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg p-4">
                    <div className="text-center">
                      <FiPackage className="w-8 h-8 text-orange-600 mb-2" />
                      <div className="text-sm font-medium text-gray-700">Cash on Delivery</div>
                      <div className="text-xs text-gray-500 mt-1">Pay when you receive</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Need Help Section */}
              <div className="mt-6 pt-6 border-t">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Need help with your order?</p>
                  <div className="flex items-center justify-center space-x-4 text-sm">
                    <a href="tel:+918506911777" className="text-orange-600 hover:text-orange-700">
                      <FiPhone className="inline mr-1" />
                      Call Us
                    </a>
                    <a href="mailto:brainytoys9@gmail.com" className="text-orange-600 hover:text-orange-700">
                      <FiMail className="inline mr-1" />
                      Email
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;