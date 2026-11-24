import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
// ✅ Import centralized api and helpers
import api, { AuthService, setAuthToken as setApiToken, setUser as setApiUser, clearAuth } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authToken, setAuthToken] = useState(null);
  
  // Refs to track mounting and logout status
  const isMounted = useRef(true);
  const logoutInProgress = useRef(false);

  // ❌ Removed hardcoded API_URL (Handled in api.js)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Initialize Auth State
  useEffect(() => {
    // Check both keys to support legacy and new api.js
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        setAuthToken(token);
        
        // ✅ Set global header via api.js helper
        setApiToken(token);
      } catch (error) {
        console.error('Error parsing user data:', error);
        performLogoutCleanup();
      }
    }
    setLoading(false);
  }, []);

  // ✅ HELPER: Centralized cleanup function
  const performLogoutCleanup = () => {
    // Use api.js helper
    clearAuth(); 
    // Clear legacy keys if they exist
    localStorage.removeItem('authToken');
    localStorage.removeItem('adminToken');
    const loaderSeen = sessionStorage.getItem('mbmm-loader-seen');
    sessionStorage.clear();
    if (loaderSeen === 'true') sessionStorage.setItem('mbmm-loader-seen', 'true');
  };

  const login = (userData, token) => {
    setUser(userData);
    setIsAuthenticated(true);
    setAuthToken(token);
    
    // Set legacy key for backward compatibility
    localStorage.setItem('authToken', token);
    
    // ✅ Use api.js helpers to sync state
    setApiToken(token);
    setApiUser(userData);
  };

  // ✅ ROBUST LOGOUT FUNCTION
  const logout = useCallback(async () => {
    if (logoutInProgress.current) return;
    logoutInProgress.current = true;

    try {
        // 1. Call backend via AuthService
        try {
            await AuthService.logout(); 
        } catch (err) {
            console.warn("Backend logout warning:", err.message);
        }
    } finally {
        // 2. FORCE CLEANUP
        performLogoutCleanup();
        
        // 3. Update State if mounted
        if (isMounted.current) {
            setUser(null);
            setIsAuthenticated(false);
            setAuthToken(null);
        }

        logoutInProgress.current = false;

        // 4. Hard Redirect to Login
        window.location.replace('/login');
    }
  }, []);

  // Wrapper for safe logout
  const safeLogout = useCallback(() => {
    logout();
  }, [logout]);

  const getAuthToken = useCallback(() => {
    const userToken = localStorage.getItem('authToken');
    const adminToken = localStorage.getItem('adminToken');
    const token = userToken || adminToken || authToken || localStorage.getItem('token');
    
    if (!token) return null;
    return token;
  }, [authToken]);

  // ✅ UPDATED: Returns the centralized API instance
  const getAuthAxios = useCallback(() => {
    // Ensure token is set before returning
    const token = getAuthToken();
    if (token) setApiToken(token);
    return api;
  }, [getAuthToken]);

  // ✅ UPDATED: Returns API instance (Auto-logout logic is handled via the Effect below)
  const getAuthAxiosWithLogout = useCallback(() => {
    const token = getAuthToken();
    if (token) setApiToken(token);
    return api;
  }, [getAuthToken]);

  // ✅ NEW: Sync API 401 errors with Context Logout
  // This replaces the individual interceptors in getAuthAxiosWithLogout
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401 && !logoutInProgress.current) {
          console.log('Auth: Token expired, logging out...');
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [logout]);

  // ✅ Helper functions
  const isTokenValid = () => {
    const token = getAuthToken();
    return !!token;
  };

  const getUserRole = () => {
    return user?.role || 'user';
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  // ✅ UPDATED: Verify Token using API instance
  const checkAndRefreshToken = useCallback(async () => {
    try {
      const token = getAuthToken();
      if (!token) return false;

      // Use centralized api
      const response = await api.get('/auth/verify', { timeout: 5000 });
      return response.data.valid === true;
    } catch (error) {
      console.warn('Token validation failed:', error.message);
      return false;
    }
  }, [getAuthToken]);

  const value = {
    user, 
    isAuthenticated, 
    login, 
    logout, 
    safeLogout, 
    loading,
    getAuthToken,
    getAuthAxios,
    getAuthAxiosWithLogout,
    isTokenValid,
    getUserRole,
    isAdmin, 
    authToken,
    checkAndRefreshToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};