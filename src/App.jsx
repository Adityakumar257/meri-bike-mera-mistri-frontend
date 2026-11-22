import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useParams, useSearchParams } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext.jsx";
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from "./components/layout/Header.jsx";
import Footer from "./components/layout/Footer.jsx";
import ChatSupport from "./pages/ChatSupport.jsx";

// Import Components
import Home from "./pages/Home/HomePage.jsx";
import BulkOrder from "./pages/BulkOrder.jsx";
import Cart from "./pages/Cart.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Login from "./pages/Login.jsx";
import Contact from "./pages/Contact.jsx";
import Checkout from "./pages/Checkout.jsx";
import Blog from "./pages/Blog.jsx";
import Signup from "./pages/Signup.jsx";
import PostData from "./pages/PostData.jsx";
import Profile from "./components/layout/Profile.jsx";
import AccountOrders from "./pages/AccountOrders.jsx";
import StoreCatalog from "./pages/StoreCatalog.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import { RecentlyViewedProvider } from './contexts/RecentlyViewedContext';
import Terms from './pages/FooterLinks/Terms.jsx';
import VerificationPage from './components/layout/VerificationPage.jsx';
import ForgotPassword from './pages/ForgotPassword';
import ScrollToTop from "./pages/ScrollToTop/ScrollToTop.jsx";
// import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/common/ProtectedRoute';
import ProtectedAdminRoute from './components/common/ProtectedAdminRoute';
import GuestRoute from './components/common/GuestRoute';
import NotFound from './pages/NotFound';
import AdminLogin from "./pages/AdminLogin/AdminLogin.jsx";
import PrivacyPolicy from "./pages/FooterLinks/PrivacyPolicy.jsx";
import ShippingPolicy from "./pages/FooterLinks/ShippingPolicy.jsx";
import ReturnPolicy from "./pages/FooterLinks/Refund.jsx";
import Feedback from "./pages/FooterLinks/Feedback.jsx";
import Complaint from "./pages/FooterLinks/Complaints.jsx";
import CustomerReviews from "./pages/FooterLinks/CustomerReviews.jsx";
import OrderDetails from './pages/OrderDetails/OrderDetails.jsx';
import { categoryPath, searchPath } from './utils/storeRoutes';

const LegacyAllToysRedirect = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('search')?.trim() || searchParams.get('q')?.trim();
  return <Navigate replace to={query ? searchPath(query) : categoryPath('all')} />;
};

const LegacyCollectionRedirect = () => {
  const { type, slug = '' } = useParams();
  const destination = type === 'brand'
    ? searchPath(slug.replace(/-/g, ' '))
    : categoryPath(slug);
  return <Navigate replace to={destination} />;
};

const LegacyCategoryRedirect = () => {
  const { slug = '' } = useParams();
  return <Navigate replace to={categoryPath(slug)} />;
};

const LegacyBrandRedirect = () => {
  const { slug = '' } = useParams();
  return <Navigate replace to={searchPath(slug.replace(/-/g, ' '))} />;
};

// Create a separate component for conditional chat support
const ConditionalChatSupport = () => {
  const { isAuthenticated } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      setIsLoggedIn(!!(token && user));
    };
    
    checkLoginStatus();
    const interval = setInterval(checkLoginStatus, 5000);
    return () => clearInterval(interval);
  }, []);
  
  return (isAuthenticated || isLoggedIn) ? <ChatSupport /> : null;
};

// Loading Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// ✅ New Component: Handles Layout Logic (Header/Footer Visibility)
const AppContent = () => {
  const location = useLocation();

  // Define routes where Header and Footer should be hidden
  const shouldHideHeaderFooter = location.pathname.startsWith('/postdata')
    || location.pathname.startsWith('/admin');

  return (
    <div className="App">
      {/* ✅ Conditionally Render Header */}
      {!shouldHideHeaderFooter && <Header />}

      <main className="min-h-screen">
        <Routes>
          {/* ==================== PUBLIC ROUTES ==================== */}
          <Route path="/" element={<Home />} />
          <Route path="/bulkorder" element={<BulkOrder />} />
          <Route path="/search" element={<StoreCatalog key={location.search} mode="search" />} />
          <Route path="/category/:slug" element={<StoreCatalog key={location.pathname} mode="category" />} />
          <Route path="/product/:slug" element={<ProductDetail key={location.pathname} />} />
          <Route path="/alltoys/*" element={<LegacyAllToysRedirect />} />
          <Route path="/categories" element={<Navigate replace to={categoryPath('all')} />} />
          <Route path="/categories/:slug" element={<LegacyCategoryRedirect />} />
          <Route path="/brands" element={<Navigate replace to={categoryPath('all')} />} />
          <Route path="/brands/:slug" element={<LegacyBrandRedirect />} />
          <Route path="/collection/:type/:slug" element={<LegacyCollectionRedirect />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/return" element={<ReturnPolicy />} />
          <Route path="/feedback" element={<Feedback/>} />
           <Route path="/complaint" element={<Complaint />} />
          <Route path="/reviews" element={<CustomerReviews />} /> 
          
          {/* ==================== GUEST ONLY ROUTES ==================== */}
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Signup /></GuestRoute>} />
          <Route path="/admin/login" element={<GuestRoute><AdminLogin /></GuestRoute>} />
          <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
          <Route path="/verify-email" element={<GuestRoute><VerificationPage /></GuestRoute>} />
          <Route path="/order/:orderId" element={<OrderDetails />} />
          <Route path="/profile" element={<Navigate replace to="/account" />} />
          
          {/* ==================== PROTECTED USER ROUTES ==================== */}
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/track-order" element={<ProtectedRoute><Navigate replace to="/account/orders" /></ProtectedRoute>} />
          <Route path="/account" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/account/orders" element={<ProtectedRoute><AccountOrders /></ProtectedRoute>} />
          
          {/* ==================== PROTECTED ADMIN ROUTES ==================== */}
          <Route path="/admin" element={<Navigate replace to="/admin/dashboard" />} />
          <Route path="/admin/dashboard" element={<ProtectedAdminRoute><PostData key={location.pathname} initialSection="dashboard" /></ProtectedAdminRoute>} />
          <Route path="/admin/products" element={<ProtectedAdminRoute><PostData key={location.pathname} initialSection="products" /></ProtectedAdminRoute>} />
          <Route path="/admin/categories" element={<ProtectedAdminRoute><PostData key={location.pathname} initialSection="categories" /></ProtectedAdminRoute>} />
          <Route path="/admin/customers" element={<ProtectedAdminRoute><PostData key={location.pathname} initialSection="users" /></ProtectedAdminRoute>} />
          <Route path="/admin/orders" element={<ProtectedAdminRoute><PostData key={location.pathname} initialSection="payments" /></ProtectedAdminRoute>} />
          <Route path="/postdata" element={<ProtectedAdminRoute><PostData /></ProtectedAdminRoute>} />
          
          {/* ==================== 404 PAGE ==================== */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      {/* ✅ Conditionally Render Chat Support */}
      {!shouldHideHeaderFooter && <ConditionalChatSupport />}
      
      {/* ✅ Conditionally Render Footer */}
      {!shouldHideHeaderFooter && <Footer />}
    </div>
  );
};

function App() {
  return (
    <>
      {/* ✅ Toast Notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <RecentlyViewedProvider>
              <Router>
                <ScrollToTop />
                <AppContent />
              </Router>
            </RecentlyViewedProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </>
  );
}

export default App;