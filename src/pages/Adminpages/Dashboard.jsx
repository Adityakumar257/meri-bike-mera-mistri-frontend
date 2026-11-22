import React from 'react';
import {
  FaShoppingBag, FaBookOpen, FaRobot, FaFolder,
  FaUsers, FaClipboardList, FaCreditCard, FaUser,
  FaHome, FaChartPie, FaBox, FaDollarSign,
  FaShoppingCart, FaComments,
  FaExclamationTriangle, FaGlobe // ✅ Switched to FaGlobe (safer import)
} from 'react-icons/fa';

const Dashboard = ({
  user,
  dashboardStats,
  categories,
  products,
  loading,
  isAuthenticated,
  requireAuth,
  setActiveSection,
  setActiveForm,
  navigate,
  fetchAllData,
}) => {
  
  const dashboardCards = [
    {
      id: 'toy',
      title: 'Manage Toys',
      description: 'Add, edit or delete toy products',
      icon: <FaShoppingBag className="text-3xl text-blue-500" />,
      count: products.toys.length,
      color: 'blue'
    },
    {
      id: 'book',
      title: 'Manage Books',
      description: 'Add, edit or delete books',
      icon: <FaBookOpen className="text-3xl text-green-500" />,
      count: products.books.length,
      color: 'green'
    },
    // --- "Footer Useful Links" Card ---
    {
      id: 'useful-links',
      title: 'Footer Useful Links',
      description: 'Feedback, Complaints & Reviews',
      icon: <FaGlobe className="text-3xl text-purple-500" />, // ✅ Using FaGlobe
      count: 'Manage', 
      color: 'purple'
    },
    {
      id: 'categories',
      title: 'Categories',
      description: 'Manage product categories',
      icon: <FaFolder className="text-3xl text-orange-500" />,
      count: categories.toys.length + categories.books.length + categories.workshops.length,
      color: 'orange'
    },
    {
      id: 'inquiries',
      title: 'Enquiry Management',
      description: 'Manage generic enquiries',
      icon: <FaUsers className="text-3xl text-red-500" />,
      count: dashboardStats.totalCustomers || 0,
      color: 'red'
    },
    {
      id: 'workshop-manager',
      title: 'Workshop Manager',
      description: 'Full control: Workshops & Categories',
      icon: <FaClipboardList className="text-3xl text-yellow-500" />,
      count: products.workshops.length, 
      color: 'yellow'
    },
    {
      id: 'payments',
      title: 'Payments',
      description: 'View sales and revenue',
      icon: <FaCreditCard className="text-3xl text-indigo-500" />,
      count: `₹${dashboardStats.totalRevenue?.toLocaleString() || 0}`,
      color: 'indigo'
    },
    {
      id: 'users',
      title: 'User Management',
      description: 'Manage system users',
      icon: <FaUser className="text-3xl text-purple-500" />,
      count: dashboardStats.totalUsers || 0,
      color: 'purple'
    },
    {
      id: 'chatsupport', 
      title: 'Chat Support',
      description: 'Customer tickets & Live Chat',
      icon: <FaComments className="text-3xl text-teal-500" />,
      count: dashboardStats.totalEnquiries ? dashboardStats.totalEnquiries : 'Active',
      color: 'teal'
    },
    {
      id: 'homepage',
      title: 'Home Page',
      description: 'Customize home page content',
      icon: <FaHome className="text-3xl text-pink-500" />,
      count: 'Edit',
      color: 'pink'
    }
  ];

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <div className="flex items-center mt-2">
            <div className={`w-3 h-3 rounded-full mr-2 ${isAuthenticated() ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <p className="text-sm text-gray-600">
              {isAuthenticated() ? (
                <>
                  Welcome back, <span className="font-semibold text-blue-600">{user.name}</span>!
                  <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Authenticated</span>
                </>
              ) : (
                <>
                  <span className="text-red-600">Not authenticated</span>
                  <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Please login</span>
                </>
              )}
            </p>
          </div>
        </div>
        <button
          onClick={fetchAllData}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          disabled={loading.products || loading.categories}
        >
          <FaChartPie className={loading.products || loading.categories ? 'animate-spin' : ''} />
          Refresh Data
        </button>
      </div>
      
      {/* User Info Card */}
      {isAuthenticated() && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                {user.name?.charAt(0) || 'U'}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{user.name}</h3>
                <p className="text-gray-600">{user.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Role: {user.role}
                  </span>
                  {user.emailVerified && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      Email Verified
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-sm text-gray-600">Member since</p>
              <p className="font-medium">
                {user.joiningDate ? new Date(user.joiningDate).toLocaleDateString() : 'Recently'}
              </p>
              {user.lastLogin && (
                <p className="text-xs text-gray-500 mt-1">
                  Last login: {new Date(user.lastLogin).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Dashboard Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
        {dashboardCards.map(card => (
          <div 
            key={card.id}
            onClick={() => {
              if (!isAuthenticated()) {
                navigate('/admin/login');
                return;
              }
              // Redirect Logic
              if (['toy', 'book'].includes(card.id)) {
                setActiveSection('add');
                setActiveForm(card.id);
              } else {
                setActiveSection(card.id);
              }
            }}
            className={`bg-white rounded-xl shadow-md p-6 cursor-pointer transform transition-transform hover:-translate-y-1 hover:shadow-lg border-l-4 ${
              card.color === 'blue' ? 'border-blue-500' :
              card.color === 'green' ? 'border-green-500' :
              card.color === 'purple' ? 'border-purple-500' :
              card.color === 'orange' ? 'border-orange-500' :
              card.color === 'red' ? 'border-red-500' :
              card.color === 'yellow' ? 'border-yellow-500' :
              card.color === 'indigo' ? 'border-indigo-500' :
              card.color === 'teal' ? 'border-teal-500' :
              card.color === 'pink' ? 'border-pink-500' :
              'border-gray-500'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              {card.icon}
              <span className={`${
                card.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                card.color === 'green' ? 'bg-green-100 text-green-800' :
                card.color === 'purple' ? 'bg-purple-100 text-purple-800' :
                card.color === 'orange' ? 'bg-orange-100 text-orange-800' :
                card.color === 'red' ? 'bg-red-100 text-red-800' :
                card.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                card.color === 'indigo' ? 'bg-indigo-100 text-indigo-800' :
                card.color === 'teal' ? 'bg-teal-100 text-teal-800' :
                card.color === 'pink' ? 'bg-pink-100 text-pink-800' :
                'bg-gray-100 text-gray-800'
              } text-sm font-medium px-3 py-1 rounded-full`}>
                {card.count}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{card.title}</h3>
            <p className="text-gray-600 text-sm">{card.description}</p>
          </div>
        ))}
      </div>

      {/* Quick Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Revenue</p>
              <p className="text-3xl font-bold">₹{dashboardStats.totalRevenue?.toLocaleString() || 0}</p>
            </div>
            <FaDollarSign className="text-3xl opacity-80" />
          </div>
          <div className="mt-2 text-sm opacity-90">Recorded payments</div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Active Orders</p>
              <p className="text-3xl font-bold">{dashboardStats.activeOrders || 0}</p>
            </div>
            <FaShoppingCart className="text-3xl opacity-80" />
          </div>
          <div className="mt-2 text-sm opacity-90">Orders awaiting fulfillment</div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Users</p>
              <p className="text-3xl font-bold">{dashboardStats.totalUsers || 0}</p>
            </div>
            <FaUsers className="text-3xl opacity-80" />
          </div>
          <div className="mt-2 text-sm opacity-90">Registered accounts</div>
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="font-semibold mb-4 text-lg">Recent Activity</h3>
          <div className="space-y-3">
            {dashboardStats.recentOrders?.length ? dashboardStats.recentOrders.map(order => (
              <div key={order._id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center min-w-0">
                  <div className="h-8 w-8 shrink-0 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                    <FaShoppingCart />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 truncate">Order #{order.orderNumber}</p>
                    <p className="text-xs text-gray-500 truncate">{order.userName || 'Customer'} · ₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400 ml-3 shrink-0">
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : '—'}
                </span>
              </div>
            )) : (
              <p className="text-sm text-gray-500 py-4">No recent orders are available.</p>
            )}
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="font-semibold mb-4 text-lg">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => { 
                if (!requireAuth('add product')) return;
                setActiveSection('add'); 
                setActiveForm('toy'); 
              }}
              className="bg-blue-100 text-blue-700 px-4 py-3 rounded-lg hover:bg-blue-200 transition-colors font-medium text-sm flex flex-col items-center justify-center gap-2 disabled:opacity-50"
              disabled={!isAuthenticated()}
            >
              <FaBox className="text-lg" />
              Add Product
            </button>
            <button
              onClick={() => { 
                if (!requireAuth('add customer')) return;
                setActiveSection('inquiries'); 
              }}
              className="bg-green-100 text-green-700 px-4 py-3 rounded-lg hover:bg-green-200 transition-colors font-medium text-sm flex flex-col items-center justify-center gap-2 disabled:opacity-50"
              disabled={!isAuthenticated()}
            >
              <FaUsers className="text-lg" />
              View Enquiries
            </button>
            <button
              onClick={() => { 
                if (!requireAuth('view orders')) return;
                setActiveSection('payments'); 
              }}
              className="bg-purple-100 text-purple-700 px-4 py-3 rounded-lg hover:bg-purple-200 transition-colors font-medium text-sm flex flex-col items-center justify-center gap-2 disabled:opacity-50"
              disabled={!isAuthenticated()}
            >
              <FaCreditCard className="text-lg" />
              View Orders
            </button>
            <button
              onClick={() => { 
                if (!requireAuth('view chat')) return;
                setActiveSection('chatsupport'); 
              }}
              className="bg-teal-100 text-teal-700 px-4 py-3 rounded-lg hover:bg-teal-200 transition-colors font-medium text-sm flex flex-col items-center justify-center gap-2 disabled:opacity-50"
              disabled={!isAuthenticated()}
            >
              <FaComments className="text-lg" />
              View Support
            </button>
          </div>
          
          {!isAuthenticated() && (
            <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <FaExclamationTriangle className="text-yellow-500 mr-2" />
                <span className="text-yellow-700 text-sm font-medium">Authentication Required</span>
              </div>
              <p className="text-xs text-yellow-600 mt-1 pl-6">
                You must be logged in to access these features.
              </p>
              <button
                onClick={() => navigate('/admin/login')}
                className="mt-2 ml-6 text-blue-600 hover:text-blue-800 text-sm font-semibold hover:underline"
              >
                Go to Login Page →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;