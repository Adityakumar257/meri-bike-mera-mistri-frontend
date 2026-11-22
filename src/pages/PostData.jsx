import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext.jsx";
import axios from 'axios';
import { API_BASE_URL } from '../services/api';
import '../styles/AdminTheme.css';

// Import all admin components
import Dashboard from '../pages/Adminpages/Dashboard.jsx';
import CategoryManager from '../pages/Adminpages/CategoryManager.jsx';
import Products from '../pages/Adminpages/Products.jsx';
import AddProduct from '../pages/Adminpages/Product/components/ProductForm.jsx';
import CustomerManagement from '../pages/Adminpages/Enquiry/EnquiryManager.jsx';
import WorkshopManager from '../pages/Adminpages/WorkshopManager/WorkshopManager.jsx'; 
import PaymentsManagement from '../pages/Adminpages/PaymentsManagement.jsx';
import UserManagement from '../pages/Adminpages/UserManagement.jsx';
import AdminChatManager from './Adminpages/Chatbot/AdminChatManager.jsx'; 
import HomePageManagement from '../pages/Adminpages/HomePageManagement.jsx';
import Settings from '../pages/Adminpages/Settings.jsx';
import UsefulLinksManager from './Adminpages/UsefulLinksManager/UsefulLinksManager.jsx';

import {
  FiHome,
  FiGrid,
  FiPackage,
  FiPlusCircle,
  FiUsers,
  FiClipboard, 
  FiCreditCard,
  FiUser,
  FiLayout,
  FiSettings,
  FiMenu,
  FiChevronLeft,
  FiLogOut,
  FiChevronDown,
  FiBell,
  FiMessageSquare,
  FiTag,
  FiBookOpen,
  FiCalendar,
  FiSun,
  FiMoon,
  FiDownload,
  FiUpload,
  FiRefreshCw,
  FiHelpCircle,
  FiInfo,
  FiTrendingUp,
  FiDollarSign,
  FiShoppingBag,
  FiTruck,
  FiAlertCircle,
  FiExternalLink,
  FiChevronUp,
  FiLink,
  FiChevronDown as FiChevronDownIcon
} from 'react-icons/fi';

const PostData = ({ initialSection = 'dashboard' }) => {
  const { user: authUser, logout: authLogout, getAuthToken } = useAuth();
  const navigate = useNavigate();
  // Refs
  const sidebarRef = useRef(null);
  const sidebarContentRef = useRef(null);
  
  // ✅ FIX 1: Main Content Ref created
  const mainContentRef = useRef(null);
    
  // State for API integration
  const [loading, setLoading] = useState({
    products: false,
    categories: false,
    upload: false,
    sections: false,
    user: false,
    customers: false,
    payments: false,
    users: false
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
    
  const [activeSection, setActiveSection] = useState(initialSection);
  const [activeForm, setActiveForm] = useState('spare_part');
  const [editingId, setEditingId] = useState(null);
  const [initialProductCategoryId, setInitialProductCategoryId] = useState('');
  const [uploading, setUploading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [theme, setTheme] = useState('light'); // 'light' or 'dark'
  const [sidebarScrollTop, setSidebarScrollTop] = useState(0);
  const [showScrollTopButton, setShowScrollTopButton] = useState(false);
  const [showScrollBottomButton, setShowScrollBottomButton] = useState(false);
    
  // User state
  const [user, setUser] = useState({
    name: 'Admin User',
    email: 'admin@toystore.com',
    phone: '',
    profileImage: null,
    role: 'Super Admin',
    address: '',
    joiningDate: '',
    firstName: '',
    lastName: '',
    userId: ''
  });

  const [notifications, setNotifications] = useState([]);

  // Dashboard Stats
  const [dashboardStats, setDashboardStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    featuredProducts: 0,
    newArrivals: 0,
    lowStockProducts: 0,
    totalCategories: 0,
    activeUsers: 0,
    pendingOrders: 0,
    totalSales: 0,
    totalCustomers: 0,
    totalSellers: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    monthlyRevenueByMonth: [],
    recentOrders: [],
    activeOrders: 0
  });

  // Data states
  const [customers, setCustomers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [users, setUsers] = useState([]);
  
  // NOTE: Seller state removed as requested
    
  const [homePageSettings, setHomePageSettings] = useState({
    heroTitle: 'Welcome to Toy Store',
    heroDescription: 'Best educational toys for your kids',
    heroImage: '',
    featuredSectionTitle: 'Featured Products',
    newArrivalsTitle: 'New Arrivals',
    testimonialTitle: 'What Parents Say',
    bannerText: 'Special Offer - 20% Off on All Toys',
    showTestimonials: true,
    showCategories: true,
    showFeatured: true,
    showNewArrivals: true,
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981'
  });

  // Categories State
  const [categories, setCategories] = useState({
    toys: [],
    books: [],
    workshops: []
  });

  // Products State
  const [products, setProducts] = useState({
    all: [],
    toys: [],
    books: [],
    workshops: []
  });

  // Form States
  const [toyForm, setToyForm] = useState({ 
    name: '', 
    description: '', 
    brand: '', 
    category: '', 
    ageGroup: '',
    originalPrice: '', 
    currentPrice: '', 
    stockStatus: 'In Stock', 
    tags: '',
    discount: '', 
    rating: '4.5', 
    images: '',
    isFeatured: false, 
    isNewArrival: false,
    type: 'toy'
  });

  const [workshopForm, setWorkshopForm] = useState({
    name: '', 
    description: '', 
    workshopType: 'Online', 
    price: '', 
    date: '',
    time: '', 
    duration: '', 
    instructor: '', 
    location: '', 
    rating: '4.5', 
    category: '', 
    tags: '', 
    maxParticipants: '',
    requirements: '', 
    learningOutcomes: '', 
    images: '',
    type: 'workshop'
  });

  const [bookForm, setBookForm] = useState({
    name: '', 
    author: '', 
    description: '', 
    category: '', 
    ageGroup: '',
    price: '', 
    publisher: '', 
    pages: '', 
    language: 'English',
    originalPrice: '', 
    discount: '', 
    rating: '4.5', 
    isbn: '',
    publicationYear: '', 
    bindingType: '', 
    tags: '', 
    subCategory: '', 
    images: '',
    type: 'book'
  });

  // ============= HELPER FUNCTIONS =============

  const getAuthHeaders = () => {
    const token = getAuthToken?.() || localStorage.getItem('token') || localStorage.getItem('authToken');
    
    if (!token) {
      console.warn('No authentication token found');
      return {};
    }
    
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const getAuthHeadersForFormData = () => {
    const token = getAuthToken?.() || localStorage.getItem('token') || localStorage.getItem('authToken');
    
    if (!token) {
      console.warn('No authentication token found for FormData');
      return {};
    }
    
    return {
      'Authorization': `Bearer ${token}`
    };
  };

  const isAuthenticated = () => {
    const token = getAuthToken?.() || localStorage.getItem('token') || localStorage.getItem('authToken');
    
    if (token) {
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          return true;
        }
      } catch (e) {
        console.log('Error checking token:', e);
        return false;
      }
      return !!token;
    }
    
    return false;
  };

  const requireAuth = (action) => {
    if (!isAuthenticated()) {
      navigate('/admin/login');
      return false;
    }
    return true;
  };

  // ✅ FIX 2: FORCE Scroll to Top immediately when Active Section or Form Changes
  useEffect(() => {
    if (mainContentRef.current) {
      // Setting scrollTop to 0 is faster and more reliable than scrollTo({ behavior: 'smooth' }) for navigation
      mainContentRef.current.scrollTop = 0; 
    }
  }, [activeSection, activeForm]); // Added activeForm so it scrolls up when switching forms too

  // ============= SIDEBAR SCROLL HANDLING =============
  useEffect(() => {
    const handleSidebarScroll = () => {
      if (sidebarContentRef.current) {
        const scrollTop = sidebarContentRef.current.scrollTop;
        const scrollHeight = sidebarContentRef.current.scrollHeight;
        const clientHeight = sidebarContentRef.current.clientHeight;
        
        setSidebarScrollTop(scrollTop);
        setShowScrollTopButton(scrollTop > 50);
        setShowScrollBottomButton(scrollTop < scrollHeight - clientHeight - 50);
      }
    };

    if (sidebarContentRef.current) {
      sidebarContentRef.current.addEventListener('scroll', handleSidebarScroll);
      handleSidebarScroll(); // Initial check
    }

    return () => {
      if (sidebarContentRef.current) {
        sidebarContentRef.current.removeEventListener('scroll', handleSidebarScroll);
      }
    };
  }, [sidebarOpen]);

  const scrollSidebarToTop = () => {
    if (sidebarContentRef.current) {
      sidebarContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollSidebarToBottom = () => {
    if (sidebarContentRef.current) {
      sidebarContentRef.current.scrollTo({ 
        top: sidebarContentRef.current.scrollHeight, 
        behavior: 'smooth' 
      });
    }
  };

  // ============= THEME TOGGLE =============
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('adminTheme', newTheme);
  };

  // ============= SIDEBAR NAVIGATION ITEMS =============
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FiHome />, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { id: 'categories', label: 'Categories', icon: <FiGrid />, color: 'text-green-600', bgColor: 'bg-green-50' },
    { id: 'products', label: 'Products', icon: <FiPackage />, color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { id: 'add', label: 'Add Product', icon: <FiPlusCircle />, color: 'text-pink-600', bgColor: 'bg-pink-50' },
    { id: 'inquiries', label: 'Enquiries', icon: <FiUsers />, color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
    { id: 'workshop-manager', label: 'Workshop Manager', icon: <FiClipboard />, color: 'text-orange-600', bgColor: 'bg-orange-50' },
    { id: 'useful-links', label: 'Useful Links', icon: <FiLink />, color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { id: 'payments', label: 'Payments', icon: <FiCreditCard />, color: 'text-red-600', bgColor: 'bg-red-50' },
    { id: 'users', label: 'Users', icon: <FiUser />, color: 'text-cyan-600', bgColor: 'bg-cyan-50' },
    { id: 'chatsupport', label: 'Chat Support', icon: <FiMessageSquare />, color: 'text-teal-600', bgColor: 'bg-teal-50' },
    { id: 'homepage', label: 'Homepage', icon: <FiLayout />, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
    { id: 'settings', label: 'Settings', icon: <FiSettings />, color: 'text-gray-600', bgColor: 'bg-gray-50' },
  ];

  // Product type submenu items
  const productTypeItems = [
    { id: 'spare_part', label: 'Motorcycle Spare Parts', icon: <FiPackage /> },
    { id: 'toy', label: 'Toys', icon: <FiTag /> },
    { id: 'book', label: 'Books', icon: <FiBookOpen /> },
    { id: 'workshop', label: 'Workshops', icon: <FiCalendar /> }
  ];

  // Quick actions for header
  const quickActions = [
    { label: 'Export Data', icon: <FiDownload />, action: () => exportData() },
    { label: 'Import Data', icon: <FiUpload />, action: () => importData() },
    { label: 'Refresh', icon: <FiRefreshCw />, action: () => fetchAllData() },
    { label: 'Help', icon: <FiHelpCircle />, action: () => showHelp() }
  ];

  // ============= API FUNCTIONS =============

  const fetchAllData = async () => {
    try {
      setLoading(prev => ({ ...prev, all: true }));
      await Promise.all([
        fetchProducts(),
        fetchCategories(),
        fetchDashboardStats(),
        fetchCustomers(),
        fetchPayments(),
        fetchUsers()
      ]);
      setSuccessMessage('Data refreshed successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error fetching all data:', error);
      setError('Failed to refresh data. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, all: false }));
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/stats`, {
        headers: getAuthHeaders()
      });
      
      if (response.data.success) {
        const stats = response.data.data;
        setDashboardStats({
          totalProducts: stats.totalProducts || 0,
          totalUsers: stats.totalUsers || 0,
          totalOrders: stats.totalOrders || 0,
          featuredProducts: stats.featuredProducts || 0,
          newArrivals: stats.newArrivals || 0,
          lowStockProducts: stats.lowStockProducts || 0,
          totalCategories: stats.totalCategories || 0,
          activeUsers: stats.activeUsers || 0,
          pendingOrders: stats.pendingOrders || 0,
          totalSales: stats.totalSales || 0,
          totalCustomers: stats.totalCustomers || 0,
          totalSellers: stats.totalSellers || 0,
          totalRevenue: stats.totalRevenue || 0,
          monthlyRevenue: stats.monthlyRevenue || 0,
          monthlyRevenueByMonth: stats.monthlyRevenueByMonth || [],
          recentOrders: stats.recentOrders || [],
          activeOrders: stats.activeOrders || 0
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError('Dashboard analytics could not be loaded from the server.');
    }
  };

  const fetchCustomers = async () => {
    setLoading(prev => ({ ...prev, customers: true }));
    try {
      const response = await axios.get(`${API_BASE_URL}/customers`, {
        headers: getAuthHeaders()
      });
      
      if (response.data.success) {
        setCustomers(response.data.data || response.data.customers || []);
      } else {
        setCustomers([]);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      setCustomers([]);
    } finally {
      setLoading(prev => ({ ...prev, customers: false }));
    }
  };

  const fetchPayments = async () => {
    setLoading(prev => ({ ...prev, payments: true }));
    try {
      const response = await axios.get(`${API_BASE_URL}/payments`, {
        headers: getAuthHeaders()
      });
      
      if (response.data.success) {
        setPayments(response.data.data || response.data.payments || []);
      } else {
        setPayments([]);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      setPayments([]);
    } finally {
      setLoading(prev => ({ ...prev, payments: false }));
    }
  };

  const fetchUsers = async () => {
    setLoading(prev => ({ ...prev, users: true }));
    try {
      const response = await axios.get(`${API_BASE_URL}/users`, {
        headers: getAuthHeaders()
      });
      
      if (response.data.success) {
        setUsers(response.data.data || response.data.users || []);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  };

  const fetchProducts = async () => {
    setLoading(prev => ({ ...prev, products: true }));
    setError(null);
    
    try {
      const response = await axios.get(`${API_BASE_URL}/products/admin/all`, {
        headers: getAuthHeaders()
      });
      
      if (response.data.success) {
        const productsData = response.data.data || response.data.products || [];

        const toys = productsData.filter(product => ['toy', 'educational_toy', 'robotic_kit'].includes(product.type));
        const books = productsData.filter(product => product.type === 'book');
        const workshops = productsData.filter(product => product.type === 'workshop');
        
        setProducts({
          all: productsData,
          toys,
          books,
          workshops
        });

        setDashboardStats(prev => ({
          ...prev,
          totalProducts: response.data.meta?.pagination?.total || productsData.length,
          featuredProducts: productsData.filter(p => p.isFeatured).length,
          newArrivals: productsData.filter(p => p.isNewArrival).length
        }));
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setProducts({ all: [], toys: [], books: [], workshops: [] });
    } finally {
      setLoading(prev => ({ ...prev, products: false }));
    }
  };

  const fetchCategories = async () => {
    setLoading(prev => ({ ...prev, categories: true }));
    setError(null);
    
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      
      if (response.data.success) {
        const categoriesData = response.data.data || response.data.categories || [];
        
        const updatedCategories = {
          toys: [],
          books: [],
          workshops: []
        };
        
        categoriesData.forEach(cat => {
          const categoryObj = {
            id: cat._id || cat.id,
            name: cat.name,
            description: cat.description || '',
            type: cat.type || '',
            isActive: cat.isActive !== false,
            displayOrder: cat.displayOrder || 0,
            parentCategory: cat.parentCategory || '',
            image: cat.image || '',
            slug: cat.slug || '',
            productCount: cat.productCount || 0,
            createdAt: cat.createdAt || ''
          };
          
          if (cat.type === 'toy') {
            updatedCategories.toys.push(categoryObj);
          } else if (cat.type === 'book') {
            updatedCategories.books.push(categoryObj);
          } else if (cat.type === 'workshop') {
            updatedCategories.workshops.push(categoryObj);
          }
        });
        
        setCategories(updatedCategories);
        
        setDashboardStats(prev => ({
          ...prev,
          totalCategories: categoriesData.length
        }));
      }
    } catch (err) {
      console.error('Error fetching categories:', err.response?.data || err.message);
      setCategories({
        toys: [],
        books: [],
        workshops: []
      });
    } finally {
      setLoading(prev => ({ ...prev, categories: false }));
    }
  };

  // Fetch authenticated user data
  const fetchAuthenticatedUser = async () => {
    setLoading(prev => ({ ...prev, user: true }));
    
    try {
      const token = getAuthToken?.() || localStorage.getItem('token') || localStorage.getItem('authToken');
      
      if (!token) {
        console.log('No token found, user is not authenticated');
        setLoading(prev => ({ ...prev, user: false }));
        return;
      }
      
      const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        const userData = response.data.user || response.data.data;
        
        setUser({
          name: userData.name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'Admin',
          email: userData.email || '',
          phone: userData.mobile || userData.phone || '',
          profileImage: userData.profileImage || null,
          role: userData.role || 'Admin',
          address: userData.address || '',
          joiningDate: userData.createdAt || userData.joiningDate || '',
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          emailVerified: userData.emailVerified || false,
          loginCount: userData.loginCount || 0,
          lastLogin: userData.lastLogin || '',
          userId: userData._id || userData.id || ''
        });
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      if (authUser) {
        setUser({
          name: authUser.name || `${authUser.firstName || ''} ${authUser.lastName || ''}`.trim() || 'Admin',
          email: authUser.email || '',
          role: authUser.role || 'Admin',
          phone: authUser.mobile || authUser.phone || '',
          profileImage: authUser.profileImage || null,
          userId: authUser._id || authUser.id || ''
        });
      }
    } finally {
      setLoading(prev => ({ ...prev, user: false }));
    }
  };

  // ============= QUICK ACTION FUNCTIONS =============
  const exportData = () => {
    setSuccessMessage('Data export started...');
  };

  const importData = () => {
    setSuccessMessage('Please select file to import...');
  };

  const showHelp = () => {
    window.open('https://toystore.com/help/admin', '_blank');
  };

  const goToFrontend = () => {
    window.open('/', '_blank');
  };

  // ============= USER FUNCTIONS =============
  const getUserInitials = () => {
    if (!user || !user.name) return "A";
    const nameParts = user.name.split(" ");
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      authLogout();
      navigate('/admin/login');
    }
  };

  // Mark notification as read
  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  // Mark all notifications as read
  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  // Get unread notifications count
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  // ============= EFFECTS =============
  useEffect(() => {
    const checkAuthAndFetchUser = async () => {
      if (isAuthenticated()) {
        await fetchAuthenticatedUser();
      } else {
        navigate('/admin/login');
      }
    };
    
    checkAuthAndFetchUser();
  }, [authUser, navigate]);

  useEffect(() => {
    if (isAuthenticated()) {
      fetchAllData();
    }
  }, []);

  // Check authentication on component mount
  if (!isAuthenticated()) {
    navigate('/admin/login');
    return null;
  }

  // ============= RENDER LOGIC =============
  const renderActiveSection = () => {
    const commonProps = {
      user,
      loading,
      error,
      successMessage,
      isAuthenticated,
      requireAuth,
      setError,
      setSuccessMessage,
      setActiveSection,
      setActiveForm,
      setEditingId,
      setInitialProductCategoryId,
      navigate,
      API_BASE_URL,
      getAuthHeaders,
      getAuthHeadersForFormData
    };

    switch (activeSection) {
      case 'dashboard':
        return (
          <Dashboard
            {...commonProps}
            dashboardStats={dashboardStats}
            categories={categories}
            products={products}
            fetchAllData={fetchAllData}
            customers={customers}
            payments={payments}
            users={users}
          />
        );
      case 'categories':
        return (
          <CategoryManager
            {...commonProps}
            categories={categories}
            fetchCategories={fetchCategories}
          />
        );
      case 'add':
        return (
          <AddProduct
            {...commonProps}
            currentUser={{ id: user.userId, name: user.name }}
            activeForm={activeForm}
            setActiveForm={setActiveForm}
            initialCategoryId={initialProductCategoryId}
            setInitialCategoryId={setInitialProductCategoryId}
            editingId={editingId}
            toyForm={toyForm}
            setToyForm={setToyForm}
            bookForm={bookForm}
            setBookForm={setBookForm}
            workshopForm={workshopForm}
            setWorkshopForm={setWorkshopForm}
            categories={categories}
            uploading={uploading}
            setUploading={setUploading}
            fetchAllData={fetchAllData}
          />
        );
      case 'products':
        return (
          <Products
            {...commonProps}
            products={products}
            activeForm={activeForm}
            setActiveForm={setActiveForm}
            deleteProductFromAPI={deleteProductFromAPI}
            handleEditProduct={(type, product) => {
              handleEditProduct(type, product);
              setActiveSection('add');
            }}
          />
        );
      case 'inquiries':
        return (
          <CustomerManagement
            {...commonProps}
            customers={customers}
            fetchCustomers={fetchCustomers}
          />
        );
      // --- CHANGED: Workshop Manager Case (Replaces sellers) ---
      case 'workshop-manager':
        return (
          <WorkshopManager
            {...commonProps}
            // Passing pre-fetched data if needed, but component likely fetches its own
            workshops={products.workshops} 
          />
        );
        case 'useful-links':
        return (
          <UsefulLinksManager 
              {...commonProps}
          />
        );
      case 'payments':
        return (
          <PaymentsManagement
            {...commonProps}
            payments={payments}
            dashboardStats={dashboardStats}
            fetchPayments={fetchPayments}
          />
        );
      case 'users':
        return (
          <UserManagement
            {...commonProps}
            users={users}
            fetchUsers={fetchUsers}
          />
        );
      case 'chatsupport':
        return (
          <AdminChatManager
              {...commonProps}
          />
        );
      case 'homepage':
        return (
          <HomePageManagement
            {...commonProps}
            homePageSettings={homePageSettings}
            setHomePageSettings={setHomePageSettings}
          />
        );
      case 'settings':
        return (
          <Settings
            {...commonProps}
            dashboardStats={dashboardStats}
            products={products}
            API_BASE_URL={API_BASE_URL}
            fetchAuthenticatedUser={fetchAuthenticatedUser}
          />
        );
      default:
        return (
          <Dashboard
            {...commonProps}
            dashboardStats={dashboardStats}
            categories={categories}
            products={products}
            fetchAllData={fetchAllData}
            customers={customers}
            payments={payments}
            users={users}
          />
        );
    }
  };

  // Helper function for editing products
  const handleEditProduct = (type, product) => {
    setEditingId(product._id || product.id);
    setActiveForm(type);
    
    if (type === 'toy') {
      setToyForm({
        name: product.title || product.name || '',
        description: product.description || '',
        brand: product.brand || '',
        category: product.category?._id || product.category || '',
        ageGroup: product.ageGroup || '',
        originalPrice: product.originalPrice?.toString() || '',
        currentPrice: product.currentPrice?.toString() || product.price?.toString() || '',
        stockStatus: product.stockStatus || 'In Stock',
        tags: product.tags ? (Array.isArray(product.tags) ? product.tags.join(', ') : product.tags) : '',
        discount: product.discount?.toString() || '',
        rating: product.rating?.toString() || '4.5',
        images: product.images || [],
        isFeatured: product.isFeatured || false,
        isNewArrival: product.isNewArrival || false,
        type: 'toy'
      });
    } else if (type === 'book') {
      setBookForm({
        name: product.title || product.name || '',
        author: product.author || '',
        description: product.description || '',
        category: product.category?._id || product.category || '',
        ageGroup: product.ageGroup || '',
        price: product.currentPrice?.toString() || product.price?.toString() || '',
        publisher: product.publisher || '',
        pages: product.pages?.toString() || '',
        language: product.language || 'English',
        originalPrice: product.originalPrice?.toString() || '',
        discount: product.discount?.toString() || '',
        rating: product.rating?.toString() || '4.5',
        isbn: product.isbn || '',
        publicationYear: product.publicationYear?.toString() || '',
        bindingType: product.bindingType || '',
        tags: product.tags ? (Array.isArray(product.tags) ? product.tags.join(', ') : product.tags) : '',
        subCategory: product.subCategory || '',
        images: product.images || [],
        type: 'book'
      });
    } else {
      setWorkshopForm({
        name: product.title || product.name || '',
        description: product.description || '',
        workshopType: product.workshopType || product.type || 'Online',
        price: product.currentPrice?.toString() || product.price?.toString() || '',
        date: product.workshopDate || product.date || '',
        time: product.workshopTime || product.time || '',
        duration: product.duration || '',
        instructor: product.instructor || '',
        location: product.location || '',
        rating: product.rating?.toString() || '4.5',
        category: product.category?._id || product.category || '',
        tags: product.tags ? (Array.isArray(product.tags) ? product.tags.join(', ') : product.tags) : '',
        maxParticipants: product.maxParticipants?.toString() || '',
        requirements: product.requirements || '',
        learningOutcomes: product.learningOutcomes || '',
        images: product.images || [],
        type: 'workshop'
      });
    }
  };

  const deleteProductFromAPI = async (id) => {
    if (!requireAuth('delete product')) return false;

    try {
      const response = await axios.delete(`${API_BASE_URL}/products/${id}`, {
        headers: getAuthHeaders()
      });
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete product.');
      }

      setSuccessMessage('Product deleted successfully.');
      await fetchProducts();
      return true;
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Failed to delete product.');
      return false;
    }
  };

  return (
    <div data-theme={theme} className={`mbmm-admin flex min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      {/* Sidebar with full viewport height */}
      <aside 
        ref={sidebarRef}
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r transition-all duration-300 fixed left-0 top-0 bottom-0 z-40 shadow-lg flex flex-col`}
        style={{ height: '100vh' }}
      >
        {/* Sidebar Toggle - Fixed at top */}
        <div className={`flex items-center justify-between p-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} border-b flex-shrink-0`}>
          {sidebarOpen ? (
            <>
              <div className="flex items-center space-x-3">
                <img
                  src="/mbmm-logo.webp"
                  alt="Meri Bike Mera Mistri"
                  className="h-10 w-10 rounded-md bg-white object-contain p-0.5"
                />
                <span className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>MBMM Admin</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                <FiChevronLeft />
              </button>
            </>
          ) : (
            <div className="flex justify-center w-full">
              <button
                onClick={() => setSidebarOpen(true)}
                aria-label="Expand admin sidebar"
                className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                <img
                  src="/mbmm-logo.webp"
                  alt="Expand admin sidebar"
                  className="h-8 w-8 rounded-md bg-white object-contain p-0.5"
                />
              </button>
            </div>
          )}
        </div>

        {/* User Profile - Fixed */}
        <div className={`p-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} border-b flex-shrink-0 ${sidebarOpen ? 'text-left' : 'text-center'}`}>
          <div className="flex items-center space-x-3">
            <div className="relative">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-blue-100"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-semibold">{getUserInitials()}</span>
                </div>
              )}
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} truncate`}>{user.name}</p>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} truncate`}>{user.role}</p>
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Navigation Area */}
        <div 
          ref={sidebarContentRef}
          className="flex-1 overflow-y-auto py-4"
          style={{ 
            scrollbarWidth: 'thin',
            scrollbarColor: theme === 'dark' ? '#4B5563 transparent' : '#D1D5DB transparent'
          }}
        >
          <div className="px-3 space-y-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center ${
                    sidebarOpen ? 'justify-start px-4' : 'justify-center'
                  } py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? `${item.bgColor} ${item.color} font-semibold`
                      : `${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`
                  }`}
                >
                  <span className={`text-lg ${sidebarOpen ? 'mr-3' : ''}`}>
                    {item.icon}
                  </span>
                  {sidebarOpen && <span>{item.label}</span>}
                </button>
              );
            })}
          </div>
          
          {/* Quick Stats */}
          {sidebarOpen && (
            <div className="mt-8 px-4 pb-8">
              <h3 className={`text-xs font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider mb-3`}>
                Quick Stats
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Products</span>
                  <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{dashboardStats.totalProducts}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Orders</span>
                  <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{dashboardStats.activeOrders}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Revenue</span>
                  <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>₹{dashboardStats.totalRevenue.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Users</span>
                  <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{dashboardStats.activeUsers}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Logout Button - Fixed at bottom */}
        <div className={`p-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} border-t flex-shrink-0`}>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${
              sidebarOpen ? 'justify-start px-4' : 'justify-center'
            } py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors`}
          >
            <FiLogOut className="text-lg" />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Header */}
        <header className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-30 shadow-sm flex-shrink-0`}>
          <div className="flex items-center justify-between px-6 py-4">
            {/* Left Section */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}
              >
                <FiMenu className="text-xl" />
              </button>
              <h1 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} capitalize`}>
                {activeSection === 'add' ? 'Add Product' : 
                 activeSection === 'chatsupport' ? 'Chat Support' :
                 activeSection === 'inquiries' ? 'Enquiry Management' :
                 activeSection === 'workshop-manager' ? 'Workshop Manager' :
                 activeSection === 'homepage' ? 'Homepage Management' :
                 `${activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}`}
              </h1>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Quick Actions */}
              <div className="hidden md:flex items-center space-x-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
                    title={action.label}
                  >
                    {action.icon}
                  </button>
                ))}
              </div>

              {/* View Frontend Button */}
              <button
                onClick={goToFrontend}
                className={`hidden md:flex items-center space-x-2 px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-50 hover:bg-blue-100 text-blue-600'}`}
              >
                <FiExternalLink className="w-4 h-4" />
                <span>View Store</span>
              </button>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700 text-yellow-300' : 'hover:bg-gray-100 text-gray-600'}`}
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                  }}
                  className={`p-2 rounded-full relative ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}
                >
                  <FiBell className="text-xl" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
                
                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className={`absolute right-0 mt-2 w-80 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-xl border z-50`}>
                    <div className={`p-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                      <div className="flex items-center justify-between">
                        <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Notifications</h3>
                        <button
                          onClick={markAllNotificationsAsRead}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Mark all as read
                        </button>
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => markNotificationAsRead(notification.id)}
                          className={`p-4 ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'} border-b cursor-pointer ${
                            !notification.read ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-start">
                            <div className={`mr-3 mt-1 ${
                              notification.type === 'order' ? 'text-green-500' :
                              notification.type === 'payment' ? 'text-blue-500' :
                              notification.type === 'warning' ? 'text-yellow-500' :
                              'text-gray-500'
                            }`}>
                              {notification.type === 'order' && <FiShoppingBag className="w-4 h-4" />}
                              {notification.type === 'payment' && <FiDollarSign className="w-4 h-4" />}
                              {notification.type === 'warning' && <FiAlertCircle className="w-4 h-4" />}
                              {notification.type === 'system' && <FiInfo className="w-4 h-4" />}
                              {notification.type === 'user' && <FiUser className="w-4 h-4" />}
                            </div>
                            <div className="flex-1">
                              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>{notification.text}</p>
                              <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'} mt-1`}>{notification.time}</p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown (Keep as is) */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className={`flex items-center space-x-3 p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  <div className="flex items-center space-x-2">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">{getUserInitials()}</span>
                      </div>
                    )}
                    <div className="hidden md:block text-left">
                      <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{user.name}</p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{user.role}</p>
                    </div>
                    <FiChevronDown className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} />
                  </div>
                </button>

                {/* Profile Dropdown Menu */}
                {showProfileDropdown && (
                  <div className={`absolute right-0 mt-2 w-56 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-xl border z-50`}>
                    <div className={`p-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                      <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{user.name}</p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{user.email}</p>
                      <div className="mt-2 flex items-center">
                        <span className={`text-xs px-2 py-1 rounded-full ${theme === 'dark' ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-600'}`}>
                          {user.role}
                        </span>
                        {user.emailVerified && (
                          <span className="ml-2 text-xs px-2 py-1 rounded-full bg-green-100 text-green-600">
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setActiveSection('settings');
                          setShowProfileDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} rounded-lg`}
                      >
                        <div className="flex items-center">
                          <FiSettings className="w-4 h-4 mr-3" />
                          Settings
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          fetchAuthenticatedUser();
                          setShowProfileDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} rounded-lg`}
                      >
                        <div className="flex items-center">
                          <FiRefreshCw className="w-4 h-4 mr-3" />
                          Refresh Profile
                        </div>
                      </button>
                      <button
                        onClick={fetchAllData}
                        className={`w-full text-left px-4 py-2 text-sm ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} rounded-lg`}
                      >
                        <div className="flex items-center">
                          <FiTrendingUp className="w-4 h-4 mr-3" />
                          Refresh Data
                        </div>
                      </button>
                    </div>
                    <div className={`p-2 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} border-t`}>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center"
                      >
                        <FiLogOut className="w-4 h-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats Bar */}
          <div className={`px-6 py-3 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between overflow-x-auto">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-blue-900 text-blue-300' : 'bg-blue-50 text-blue-600'}`}>
                    <FiShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Total Products</div>
                    <div className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{dashboardStats.totalProducts}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-green-900 text-green-300' : 'bg-green-50 text-green-600'}`}>
                    <FiDollarSign className="w-4 h-4" />
                  </div>
                  <div>
                    <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Total Revenue</div>
                    <div className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>₹{dashboardStats.totalRevenue.toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-purple-900 text-purple-300' : 'bg-purple-50 text-purple-600'}`}>
                    <FiUsers className="w-4 h-4" />
                  </div>
                  <div>
                    <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Total Users</div>
                    <div className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{dashboardStats.activeUsers}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-orange-900 text-orange-300' : 'bg-orange-50 text-orange-600'}`}>
                    <FiTruck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Pending Orders</div>
                    <div className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{dashboardStats.pendingOrders}</div>
                  </div>
                </div>
              </div>
              <button
                onClick={fetchAllData}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-white hover:bg-gray-100 text-gray-700 border'}`}
              >
                <FiRefreshCw className={`w-4 h-4 ${loading.all ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area - Scrollable */}
        {/* ✅ FIX 3: Attached ref here */}
        <main ref={mainContentRef} className="flex-1 overflow-y-auto p-6">
          {/* Error and Success Messages */}
          {error && (
            <div className={`mb-6 p-4 ${theme === 'dark' ? 'bg-red-900 border-red-700' : 'bg-red-50 border-red-200'} border rounded-lg`}>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className={`text-sm ${theme === 'dark' ? 'text-red-300' : 'text-red-800'}`}>{error}</p>
                </div>
                <div className="ml-auto pl-3">
                  <button
                    onClick={() => setError(null)}
                    className={theme === 'dark' ? 'text-red-300 hover:text-red-400' : 'text-red-800 hover:text-red-900'}
                  >
                    <span className="sr-only">Dismiss</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {successMessage && (
            <div className={`mb-6 p-4 ${theme === 'dark' ? 'bg-green-900 border-green-700' : 'bg-green-50 border-green-200'} border rounded-lg`}>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className={`text-sm ${theme === 'dark' ? 'text-green-300' : 'text-green-800'}`}>{successMessage}</p>
                </div>
                <div className="ml-auto pl-3">
                  <button
                    onClick={() => setSuccessMessage('')}
                    className={theme === 'dark' ? 'text-green-300 hover:text-green-400' : 'text-green-800 hover:text-green-900'}
                  >
                    <span className="sr-only">Dismiss</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Render Active Section */}
          {renderActiveSection()}
        </main>

        {/* Footer */}
        <footer className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t py-4 px-6 flex-shrink-0`}>
          <div className="flex items-center justify-between">
            <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              © {new Date().getFullYear()} ToyStore Admin Panel. All rights reserved.
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={goToFrontend}
                className={`text-sm ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}
              >
                View Store
              </button>
              <button
                onClick={showHelp}
                className={`text-sm ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}
              >
                Help & Support
              </button>
              <button
                onClick={() => setActiveSection('settings')}
                className={`text-sm ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}
              >
                Settings
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Close dropdowns when clicking outside */}
      {(showProfileDropdown || showNotifications) && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => {
            setShowProfileDropdown(false);
            setShowNotifications(false);
          }}
        />
      )}
    </div>
  );
};

export default PostData;