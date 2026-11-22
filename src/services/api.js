// src/services/api.js
import axios from 'axios';

const defaultApiBaseUrl = import.meta.env.PROD
  ? 'https://meri-bike-mera-mistri-backend.onrender.com/api'
  : 'http://localhost:5000/api';
export const API_BASE_URL = (import.meta.env.VITE_API_URL || defaultApiBaseUrl).replace(/\/+$/, '');

// ============================================================================
// 1. AXIOS CONFIGURATION
// ============================================================================

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
  withCredentials: true
});

// Request Interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (token) config.headers.Authorization = `Bearer ${token}`;
  
  if (user) {
    try {
      const userData = JSON.parse(user);
      if (userData._id || userData.id) config.headers['X-User-Id'] = userData._id || userData.id;
    } catch (e) { console.warn('User parsing error', e); }
  }

  if (config.data instanceof FormData) delete config.headers['Content-Type'];
  if (config.method === 'get') config.headers['Cache-Control'] = 'no-cache';

  console.log(`🌐 ${config.method.toUpperCase()} ${config.url}`);
  return config;
}, (error) => Promise.reject(error));

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    if (response.data && response.data.success === false) {
      return Promise.reject(new Error(response.data.message || 'Request failed'));
    }
    return response;
  },
  (error) => {
    console.error(`❌ API Error: ${error.response?.status} - ${error.message}`);
    const isConnectionFailure = !error.response && Boolean(error.request) && error.code !== 'ERR_CANCELED';
    return Promise.reject({
      status: error.response?.status || 0,
      message: error.response?.data?.message
        || (isConnectionFailure ? 'Unable to connect to the server. Please try again later.' : error.message)
        || 'Request failed',
      data: error.response?.data || null
    });
  }
);

// ============================================================================
// 2. HELPER FUNCTIONS
// ============================================================================

export const setAuthToken = (token) => token ? localStorage.setItem('token', token) : localStorage.removeItem('token');
export const setUser = (user) => user ? localStorage.setItem('user', JSON.stringify(user)) : localStorage.removeItem('user');
export const clearAuth = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); };

// ============================================================================
// 3. API SERVICES (One Line Per Route)
// ============================================================================

// --- Authentication ---
export const AuthService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  verifyEmail: (data) => api.post('/auth/verify-email', data),
  resendOTP: (data) => api.post('/auth/resend-otp', data),
  verifyToken: (data) => api.post('/auth/verify-token', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/update-profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  logout: () => api.post('/auth/logout'),
};

// --- Admin (Direct Routes) ---
export const AdminService = {
  login: (data) => api.post('/admin/login', data),
  getStats: () => api.get('/admin/stats'),
  getServerInfo: () => api.get('/server-info'),
  getRoutes: () => api.get('/routes'),
};

// --- Users (Direct Routes) ---
export const UserService = {
  getAll: () => api.get('/users'),
  getCustomers: () => api.get('/customers'),
  getSellers: () => api.get('/sellers'),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  updateRole: (id, data) => api.put(`/users/${id}/role`, data),
  updateRetailerStatus: (id, retailerStatus) => api.put(`/users/${id}/retailer-status`, { retailerStatus }),
};

// --- Payments ---
export const PaymentService = {
  getAll: () => api.get('/payments'),
};

// --- Categories ---
export const CategoryService = {
  getAll: () => api.get('/categories'),
  getMenu: () => api.get('/categories/menu'),
  getHierarchy: () => api.get('/categories/hierarchy'),
  search: (q) => api.get('/categories/search', { params: { q } }),
  getByType: (type) => api.get(`/categories/type/${type}`),
  getBySlug: (slug) => api.get(`/categories/slug/${slug}`),
  getAdminAll: () => api.get('/categories/admin/all'),
  create: (data) => api.post('/categories', data),
  rebuildCounts: () => api.post('/categories/rebuild-counts'),
  updateOrder: (data) => api.put('/categories/order/update', data),
  getById: (id) => api.get(`/categories/${id}`),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// --- Products ---
export const ProductService = {
  getAll: (params) => api.get('/products', { params }),
  getAdminAll: (params) => api.get('/products/admin/all', { params }),
  getAdminById: (id) => api.get(`/products/admin/${id}`),
  getToys: (params) => api.get('/products/toys/all', { params }),
  getFeatured: () => api.get('/products/featured'),
  getNewArrivals: () => api.get('/products/new-arrivals'),
  getPopular: () => api.get('/products/popular'),
  getOnSale: () => api.get('/products/on-sale'),
  getLowStock: () => api.get('/products/low-stock'),
  search: (q) => api.get('/products/search', { params: { q } }),
  getByCategory: (id, params) => api.get(`/products/category/${id}`, { params }),
  getByType: (type) => api.get(`/products/type/${type}`),
  getByTag: (tag) => api.get(`/products/tag/${tag}`),
  getSimilar: (id) => api.get(`/products/${id}/similar`),
  getByUser: (userId) => api.get(`/products/user/${userId}`),
  getByIds: (ids) => api.get('/products/bulk/ids', { params: { ids } }),
  getById: (id) => api.get(`/products/${id}`),
  getStats: () => api.get('/products/stats/all'),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  updateStock: (id, data) => api.patch(`/products/${id}/stock`, data),
  bulkDelete: (data) => api.post('/products/bulk-delete', data),
  bulkUpdateStatus: (data) => api.post('/products/bulk-status', data),
};

// --- Cart ---
export const CartService = {
  getCart: () => api.get('/cart'),
  getCount: () => api.get('/cart/count'),
  add: (data) => api.post('/cart/add', data),
  mergeGuest: (data) => api.post('/cart/merge-guest', data),
  updateQuantity: (data) => api.put('/cart/update', data),
  remove: (id) => api.delete(`/cart/remove/${id}`),
  clear: () => api.delete('/cart/clear'),
  checkout: (data) => api.post('/cart/checkout', data),
  moveToWishlist: (data) => api.post('/cart/move-to-wishlist', data),
};

// --- Orders ---
export const OrderService = {
  create: (data) => api.post('/orders/create', data),
  getAll: (params) => api.get('/orders', { params }),
  getUserOrders: (params) => api.get('/orders/my-orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  cancel: (id) => api.post(`/orders/${id}/cancel`),
};

// --- Workshops ---
export const WorkshopService = {
  getAll: (params) => api.get('/workshops', { params }),
  getById: (id) => api.get(`/workshops/${id}`),
  create: (data) => api.post('/workshops', data),
  update: (id, data) => api.put(`/workshops/${id}`, data),
  delete: (id) => api.delete(`/workshops/${id}`),
  updateStock: (id, data) => api.patch(`/workshops/${id}/stock`, data),
};

// --- Workshop Categories ---
export const WorkshopCategoryService = {
  getAll: () => api.get('/workshop-categories'),
  getById: (id) => api.get(`/workshop-categories/${id}`),
  create: (data) => api.post('/workshop-categories', data),
  update: (id, data) => api.put(`/workshop-categories/${id}`, data),
  delete: (id) => api.delete(`/workshop-categories/${id}`),
};

// --- Enrollments ---
export const EnrollmentService = {
  create: (data) => api.post('/enrollments', data),
  getAll: (params) => api.get('/enrollments', { params }),
  getById: (id) => api.get(`/enrollments/${id}`),
  update: (id, data) => api.put(`/enrollments/${id}`, data),
  delete: (id) => api.delete(`/enrollments/${id}`),
};

// --- Enquiry (Bulk Order & Contact) ---
export const EnquiryService = {
  createBulkOrder: (data) => api.post('/bulk-order', data),
  getAllBulkOrders: (params) => api.get('/bulk-order', { params }),
  getBulkOrderById: (id) => api.get(`/bulk-order/${id}`),
  updateBulkOrder: (id, data) => api.put(`/bulk-order/${id}`, data),
  deleteBulkOrder: (id) => api.delete(`/bulk-order/${id}`),
  createContact: (data) => api.post('/contact', data),
  getAllContacts: (params) => api.get('/contact', { params }),
  getContactById: (id) => api.get(`/contact/${id}`),
  updateContact: (id, data) => api.put(`/contact/${id}`, data),
  deleteContact: (id) => api.delete(`/contact/${id}`),
};

// --- Feedbacks ---
export const FeedbackService = {
  create: (data) => api.post('/feedbacks', data),
  getAll: (params) => api.get('/feedbacks', { params }),
  getById: (id) => api.get(`/feedbacks/${id}`),
  update: (id, data) => api.put(`/feedbacks/${id}`, data),
  delete: (id) => api.delete(`/feedbacks/${id}`),
};

// --- Complaints ---
export const ComplaintService = {
  create: (data) => api.post('/complaints', data),
  getAll: (params) => api.get('/complaints', { params }),
  getById: (id) => api.get(`/complaints/${id}`),
  update: (id, data) => api.put(`/complaints/${id}`, data),
  delete: (id) => api.delete(`/complaints/${id}`),
};

// --- Reviews ---
export const ReviewService = {
  create: (data) => api.post('/reviews', data),
  getPublic: (params) => api.get('/reviews/public', { params }),
  getAllAdmin: (params) => api.get('/reviews/admin', { params }),
  toggleStatus: (id) => api.patch(`/reviews/${id}/status`),
  delete: (id) => api.delete(`/reviews/${id}`),
};

// --- Chat (Matches chatRoutes.js) ---
export const ChatService = {
  getHistory: (userId) => api.get(`/chat/history/${userId}`),
  sendMessage: (userId, data) => api.post(`/chat/message/${userId}`, data),
  getAllChats: () => api.get('/chat/all'),
  deleteHistory: (userId) => api.delete(`/chat/history/${userId}`),
  getStats: () => api.get('/chat/stats'),
};

// --- Robotics ---
export const RoboticsService = {
  create: (data) => api.post('/robotics', data),
  getAll: (params) => api.get('/robotics', { params }),
  getById: (id) => api.get(`/robotics/${id}`),
  update: (id, data) => api.put(`/robotics/${id}`, data),
  delete: (id) => api.delete(`/robotics/${id}`),
  addImage: (id, data) => api.put(`/robotics/${id}/image`, data),
  setPrimaryImage: (id, data) => api.put(`/robotics/${id}/primary-image`, data),
};

// --- Responses (Matches responseRoutes.js) ---
export const ResponseService = {
  create: (data) => api.post('/responses', data),
  getAll: (params) => api.get('/responses', { params }),
  getById: (id) => api.get(`/responses/${id}`),
  update: (id, data) => api.put(`/responses/${id}`, data),
  delete: (id) => api.delete(`/responses/${id}`),
};

// --- Uploads ---
export const UploadService = {
  upload: (data) => api.post('/upload', data),
  delete: (id) => api.delete(`/upload/${id}`),
};

// --- Brand ---
export const BrandService = {
  getHomeSections: () => api.get('/home-sections'),
  getFeatured: () => api.get('/featured'),
  getTrending: () => api.get('/trending'),
  updateSectionStatus: (id, data) => api.patch(`/products/${id}/section-status`, data),
  bulkUpdateSection: (data) => api.post('/bulk-update-section', data),
};

export default api;