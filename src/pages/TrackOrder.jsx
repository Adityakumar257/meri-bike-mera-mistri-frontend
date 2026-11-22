import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiSearch, 
  FiPackage, 
  FiCheckCircle, 
  FiTruck, 
  FiHome,
  FiClock,
  FiMapPin,
  FiUser,
  FiPhone,
  FiMail,
  FiArrowLeft
} from 'react-icons/fi';

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [trackingData, setTrackingData] = useState(null);
  const [searchError, setSearchError] = useState('');

  // Sample tracking data
  const sampleOrders = {
    'ORD12345678': {
      orderNumber: 'ORD12345678',
      status: 'in_transit',
      estimatedDelivery: '2024-12-20',
      placedDate: '2024-12-15',
      items: [
        { name: 'Magna Tiles Clear Colors 100 Piece Set', quantity: 1, price: 6499 },
        { name: 'LEGO 10280 Icons Flower Bouquet', quantity: 1, price: 3499 }
      ],
      shipping: {
        name: 'John Doe',
        address: '123 Main Street, Apartment 4B',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        phone: '+91 9876543210',
        email: 'john@example.com'
      },
      tracking: [
        { date: '2024-12-15 10:30', status: 'Order Placed', description: 'Your order has been confirmed' },
        { date: '2024-12-15 14:45', status: 'Processing', description: 'Order is being prepared for shipment' },
        { date: '2024-12-16 09:15', status: 'Dispatched', description: 'Order has left our warehouse' },
        { date: '2024-12-17 11:30', status: 'In Transit', description: 'Order is on its way to you' }
      ],
      carrier: 'Delhivery',
      trackingNumber: 'DLV123456789IN',
      total: 10987.90
    },
    'ORD87654321': {
      orderNumber: 'ORD87654321',
      status: 'delivered',
      deliveredDate: '2024-12-10',
      placedDate: '2024-12-05',
      items: [
        { name: 'Jar Melo Baby Roo Washable Markers', quantity: 2, price: 799 }
      ],
      shipping: {
        name: 'Jane Smith',
        address: '456 Park Avenue',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001',
        phone: '+91 9876543211',
        email: 'jane@example.com'
      },
      tracking: [
        { date: '2024-12-05 11:20', status: 'Order Placed', description: 'Your order has been confirmed' },
        { date: '2024-12-05 15:30', status: 'Processing', description: 'Order is being prepared for shipment' },
        { date: '2024-12-06 10:45', status: 'Dispatched', description: 'Order has left our warehouse' },
        { date: '2024-12-08 14:20', status: 'Out for Delivery', description: 'Courier partner has your order' },
        { date: '2024-12-10 16:15', status: 'Delivered', description: 'Order has been delivered successfully' }
      ],
      carrier: 'Blue Dart',
      trackingNumber: 'BLD987654321IN',
      total: 1757.80
    }
  };

  const handleTrackOrder = () => {
    setSearchError('');
    
    if (!orderId.trim()) {
      setSearchError('Please enter an order ID');
      return;
    }

    const order = sampleOrders[orderId.toUpperCase()];
    
    if (order) {
      setTrackingData(order);
    } else {
      setSearchError('Order ID not found. Please check and try again.');
      setTrackingData(null);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Order Placed':
        return <FiPackage className="w-6 h-6 text-blue-500" />;
      case 'Processing':
        return <FiClock className="w-6 h-6 text-yellow-500" />;
      case 'Dispatched':
        return <FiTruck className="w-6 h-6 text-purple-500" />;
      case 'In Transit':
        return <FiTruck className="w-6 h-6 text-indigo-500" />;
      case 'Out for Delivery':
        return <FiHome className="w-6 h-6 text-orange-500" />;
      case 'Delivered':
        return <FiCheckCircle className="w-6 h-6 text-green-500" />;
      default:
        return <FiPackage className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Order Placed': return 'bg-blue-100 text-blue-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Dispatched': return 'bg-purple-100 text-purple-800';
      case 'In Transit': return 'bg-indigo-100 text-indigo-800';
      case 'Out for Delivery': return 'bg-orange-100 text-orange-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-6"
          >
            <FiArrowLeft className="mr-2" />
            Back to Home
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
          <p className="text-gray-600">Enter your order ID to track your package</p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order ID / Tracking Number
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Enter your order ID (e.g., ORD12345678)"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <button
                  onClick={handleTrackOrder}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-r-lg font-medium flex items-center"
                >
                  <FiSearch className="mr-2" />
                  Track Order
                </button>
              </div>
              {searchError && (
                <p className="text-red-600 text-sm mt-2">{searchError}</p>
              )}
            </div>
          </div>

          {/* Sample IDs */}
          <div className="mt-6">
            <p className="text-sm text-gray-600 mb-2">Try these sample order IDs:</p>
            <div className="flex flex-wrap gap-2">
              {Object.keys(sampleOrders).map((id) => (
                <button
                  key={id}
                  onClick={() => setOrderId(id)}
                  className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded"
                >
                  {id}
                </button>
              ))}
            </div>
          </div>
        </div>

        {trackingData ? (
          <div className="space-y-8">
            {/* Order Summary Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Order #{trackingData.orderNumber}</h2>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trackingData.tracking[trackingData.tracking.length - 1].status)}`}>
                      {trackingData.tracking[trackingData.tracking.length - 1].status}
                    </span>
                    <span className="text-sm text-gray-600">
                      Placed on: {trackingData.placedDate}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">Rs. {trackingData.total.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">
                    {trackingData.items.length} {trackingData.items.length === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>

              {/* Carrier Info */}
              <div className="mt-6 pt-6 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                      <FiTruck className="mr-2" />
                      Carrier Information
                    </h3>
                    <p className="text-sm text-gray-600">Courier: {trackingData.carrier}</p>
                    <p className="text-sm text-gray-600">Tracking: {trackingData.trackingNumber}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                      <FiClock className="mr-2" />
                      Estimated Delivery
                    </h3>
                    <p className="text-sm text-gray-600">
                      {trackingData.status === 'delivered' 
                        ? `Delivered on: ${trackingData.deliveredDate}`
                        : `Expected by: ${trackingData.estimatedDelivery}`
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Tracking History</h2>
              
              <div className="space-y-8">
                {trackingData.tracking.map((step, index) => (
                  <div key={index} className="flex">
                    {/* Timeline Line */}
                    <div className="flex flex-col items-center mr-4">
                      <div className="w-12 h-12 rounded-full bg-white border-2 border-orange-500 flex items-center justify-center">
                        {getStatusIcon(step.status)}
                      </div>
                      {index < trackingData.tracking.length - 1 && (
                        <div className="flex-1 w-0.5 bg-orange-300 my-2"></div>
                      )}
                    </div>
                    
                    {/* Timeline Content */}
                    <div className="flex-1 pb-8">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{step.status}</h3>
                        <span className="text-sm text-gray-600">{step.date}</span>
                      </div>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Details & Shipping */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Order Items */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Items</h2>
                <div className="space-y-4">
                  {trackingData.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-3 border-b">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-medium">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <FiMapPin className="mr-3" />
                  Shipping Address
                </h2>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <FiUser className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">{trackingData.shipping.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FiMapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-gray-600">{trackingData.shipping.address}</p>
                      <p className="text-gray-600">
                        {trackingData.shipping.city}, {trackingData.shipping.state} - {trackingData.shipping.pincode}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FiPhone className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <p className="text-gray-600">{trackingData.shipping.phone}</p>
                  </div>
                  <div className="flex items-start">
                    <FiMail className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <p className="text-gray-600">{trackingData.shipping.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Need Help */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg shadow p-8">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-4">Need Help With Your Order?</h3>
                <p className="mb-6 opacity-90">
                  Our customer support team is here to help you with any questions about your order.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="bg-white text-orange-600 hover:bg-orange-50 px-6 py-3 rounded-lg font-medium">
                    Contact Support
                  </button>
                  <button className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-6 py-3 rounded-lg font-medium">
                    Live Chat
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* No Order Tracked Yet */
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-6">📦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Track Your Package</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Enter your order ID above to see real-time tracking information, delivery updates, and order details.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="p-4 bg-blue-50 rounded-lg">
                <FiSearch className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <p className="font-medium text-gray-900">Enter Order ID</p>
                <p className="text-sm text-gray-600 mt-1">Find it in your order confirmation email</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <FiTruck className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <p className="font-medium text-gray-900">Track Progress</p>
                <p className="text-sm text-gray-600 mt-1">See real-time updates of your package</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <FiHome className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <p className="font-medium text-gray-900">Receive Package</p>
                <p className="text-sm text-gray-600 mt-1">Get notified when your order arrives</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;