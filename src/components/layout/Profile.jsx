import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { 
  User, 
  ShoppingBag, 
  Heart, 
  ShoppingCart, 
  Settings, 
  Lock, 
  MapPin, 
  Phone, 
  Mail, 
  Edit,
  Package,
  Truck,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
// ✅ Import AuthService from centralized API
import { AuthService } from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';

const Profile = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    mobile: '',
    address: ''
  });
  
  // ❌ Removed hardcoded API_BASE_URL (Handled in api.js)

  useEffect(() => {
    setCartCount(getCartCount());
    setWishlistCount(getWishlistCount());
    
    // Fetch user details
    if (user) {
      setUserDetails({
        // Construct full name from firstName and lastName
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || '', 
        email: user.email || '',
        mobile: user.mobile || '',
        address: user.address || '' // Note: addresses is an array in your JSON, so you might need user.addresses[0] if you want the first one
      });
    }
    
    // Fetch orders
    fetchOrders();
  }, [user, getCartCount, getWishlistCount]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Mock orders data - Replace with actual API call
      const mockOrders = [
        {
          id: 'ORD001',
          date: '2024-01-15',
          total: 2499,
          items: 3,
          status: 'Delivered',
          statusColor: 'bg-green-100 text-green-800',
          icon: <CheckCircle className="w-4 h-4 mr-2" />
        },
        {
          id: 'ORD002',
          date: '2024-01-10',
          total: 1899,
          items: 2,
          status: 'Shipped',
          statusColor: 'bg-blue-100 text-blue-800',
          icon: <Truck className="w-4 h-4 mr-2" />
        },
        {
          id: 'ORD003',
          date: '2024-01-05',
          total: 3299,
          items: 4,
          status: 'Processing',
          statusColor: 'bg-yellow-100 text-yellow-800',
          icon: <Package className="w-4 h-4 mr-2" />
        },
        {
          id: 'ORD004',
          date: '2024-01-01',
          total: 1599,
          items: 1,
          status: 'Pending',
          statusColor: 'bg-gray-100 text-gray-800',
          icon: <Clock className="w-4 h-4 mr-2" />
        }
      ];
      setOrders(mockOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      // ✅ Use AuthService instead of direct axios
      const response = await AuthService.updateProfile(userDetails);
      if (response.data.success) {
        alert(t('Profile updated successfully!'));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(t('Failed to update profile. Please try again.'));
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const oldPassword = formData.get('oldPassword');
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');

    if (newPassword !== confirmPassword) {
      alert(t('New password and confirm password do not match!'));
      return;
    }

    try {
      // ✅ Use AuthService instead of direct axios
      const response = await AuthService.changePassword({
        oldPassword,
        newPassword
      });
      
      if (response.data.success) {
        alert(t('Password changed successfully!'));
        e.target.reset();
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert(t(error.response?.data?.message || 'Failed to change password. Please try again.'));
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">{t('Welcome back,')} {userDetails.name}!</h2>
            <p className="text-orange-100">{t('Manage your account, orders, and preferences here.')}</p>
          </div>
          <div className="bg-white/20 p-3 rounded-full">
            <User className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">{t('Total Orders')}</p>
              <p className="text-3xl font-bold text-gray-800">{orders.length}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <Link to="/account/orders" className="text-orange-600 text-sm font-medium hover:text-orange-700 mt-4 inline-block">
            View all orders →
          </Link>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">{t('Wishlist Items')}</p>
              <p className="text-3xl font-bold text-gray-800">{wishlistCount}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <Link to="/wishlist" className="text-red-600 text-sm font-medium hover:text-red-700 mt-4 inline-block">
            View wishlist →
          </Link>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">{t('Cart Items')}</p>
              <p className="text-3xl font-bold text-gray-800">{cartCount}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <Link to="/cart" className="text-blue-600 text-sm font-medium hover:text-blue-700 mt-4 inline-block">
            View cart →
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">{t('Recent Orders')}</h3>
          <Link to="/account/orders" className="text-orange-600 text-sm font-medium hover:text-orange-700">
            View all →
          </Link>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            <p className="text-gray-500 mt-2">{t('Loading orders...')}</p>
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {orders.slice(0, 3).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-800">{t('Order')} #{order.id}</span>
                    <span className={`ml-3 text-xs px-3 py-1 rounded-full flex items-center ${order.statusColor}`}>
                      {order.icon}
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{t('Placed on')} {order.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">₹{order.total}</p>
                  <p className="text-sm text-gray-500">{order.items} item{order.items > 1 ? 's' : ''}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">{t('No orders yet')}</p>
            <Link to="/category/all" className="text-orange-600 font-medium hover:text-orange-700 mt-2 inline-block">
              Start Shopping →
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">{t('Profile Information')}</h3>
        <button 
          onClick={() => document.getElementById('edit-profile-form').classList.toggle('hidden')}
          className="flex items-center text-orange-600 hover:text-orange-700 font-medium"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Profile
        </button>
      </div>

      {/* Display Profile Info */}
      <div id="profile-info" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center p-4 border border-gray-100 rounded-lg">
            <div className="bg-orange-100 p-3 rounded-lg mr-4">
              <User className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t('Full Name')}</p>
              <p className="font-semibold text-gray-800">{userDetails.name || 'Not provided'}</p>
            </div>
          </div>

          <div className="flex items-center p-4 border border-gray-100 rounded-lg">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t('Email Address')}</p>
              <p className="font-semibold text-gray-800">{userDetails.email}</p>
            </div>
          </div>

          <div className="flex items-center p-4 border border-gray-100 rounded-lg">
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              <Phone className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t('Mobile Number')}</p>
              <p className="font-semibold text-gray-800">{userDetails.mobile || 'Not provided'}</p>
            </div>
          </div>

          <div className="flex items-center p-4 border border-gray-100 rounded-lg">
            <div className="bg-purple-100 p-3 rounded-lg mr-4">
              <MapPin className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t('Delivery Address')}</p>
              <p className="font-semibold text-gray-800">{userDetails.address || 'Not provided'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Form (Hidden by default) */}
      <form id="edit-profile-form" className="hidden mt-8 space-y-6" onSubmit={handleSaveProfile}>
        <h4 className="text-lg font-semibold text-gray-800">{t('Edit Profile')}</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={userDetails.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number
            </label>
            <input
              type="tel"
              name="mobile"
              value={userDetails.mobile}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              placeholder="Enter your mobile number"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delivery Address
            </label>
            <textarea
              name="address"
              value={userDetails.address}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              placeholder="Enter your complete address"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => document.getElementById('edit-profile-form').classList.add('hidden')}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );

  const renderChangePassword = () => (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
      <div className="flex items-center mb-6">
        <div className="bg-red-100 p-3 rounded-lg mr-4">
          <Lock className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">{t('Change Password')}</h3>
          <p className="text-gray-500">{t('Update your password to keep your account secure')}</p>
        </div>
      </div>

      <form onSubmit={handleChangePassword} className="space-y-6 max-w-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Password
          </label>
          <input
            type="password"
            name="oldPassword"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            placeholder="Enter current password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <input
            type="password"
            name="newPassword"
            required
            minLength="6"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            placeholder="Enter new password (min. 6 characters)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            placeholder="Confirm new password"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
          >
            Change Password
          </button>
          
          <Link 
            to="/forgot-password" 
            className="ml-4 text-orange-600 hover:text-orange-700 font-medium"
          >
            Forgot Password?
          </Link>
        </div>
      </form>
    </div>
  );

  const renderOrders = () => (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">{t('My Orders')}</h3>
      
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          <p className="text-gray-500 mt-4">{t('Loading your orders...')}</p>
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <span className="font-bold text-gray-800">{t('Order')} #{order.id}</span>
                    <span className="text-gray-500 text-sm ml-4">{t('Placed on')} {order.date}</span>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <span className={`text-xs px-3 py-1.5 rounded-full flex items-center ${order.statusColor}`}>
                      {order.icon}
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600">{order.items} item{order.items > 1 ? 's' : ''}</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">₹{order.total}</p>
                  </div>
                  <div className="space-x-3">
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      View Details
                    </button>
                    <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                      Track Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-800 mb-2">{t('No orders yet')}</h4>
          <p className="text-gray-500 mb-6">{t("You haven't placed any orders yet.")}</p>
          <Link to="/category/all" className="px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors inline-block">
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <User className="w-4 h-4 mr-3" /> },
    { id: 'profile', label: 'Profile', icon: <Settings className="w-4 h-4 mr-3" /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingBag className="w-4 h-4 mr-3" /> },
    { id: 'password', label: 'Change Password', icon: <Lock className="w-4 h-4 mr-3" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-6">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white flex items-center justify-center font-bold text-2xl shadow-md">
                  {userDetails.name ? userDetails.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-bold text-gray-800">{userDetails.name}</h2>
                  <p className="text-gray-500 text-sm">{userDetails.email}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-orange-50 text-orange-600 font-semibold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-800 mb-4">{t('Quick Stats')}</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{t('Total Orders')}</span>
                  <span className="font-bold text-gray-800">{orders.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{t('Wishlist Items')}</span>
                  <span className="font-bold text-gray-800">{wishlistCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{t('Cart Items')}</span>
                  <span className="font-bold text-gray-800">{cartCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'profile' && renderProfile()}
            {activeTab === 'orders' && renderOrders()}
            {activeTab === 'password' && renderChangePassword()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;