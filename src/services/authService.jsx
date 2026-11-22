import axios from 'axios';
import { API_BASE_URL } from './api';
import { 
  prepareGuestCartForMerge, 
  clearGuestCart,
  getGuestCart 
} from '../utils/cartUtils';
import { 
  prepareGuestWishlistForMerge, 
  clearGuestWishlist 
} from '../utils/wishlistUtils';

// Login user with guest cart merge
export const loginUser = async (email, password) => {
  try {
    // Prepare guest cart data for merge
    const guestCart = prepareGuestCartForMerge();
    const guestWishlist = prepareGuestWishlistForMerge();
    
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password,
      guestCart,
      guestWishlist
    });
    
    if (response.data.success) {
      // Clear guest data after successful login
      clearGuestCart();
      clearGuestWishlist();
    }
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Signup user with guest cart merge
export const signupUser = async (userData) => {
  try {
    const guestCart = prepareGuestCartForMerge();
    const guestWishlist = prepareGuestWishlistForMerge();
    
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      ...userData,
      guestCart,
      guestWishlist
    });
    
    if (response.data.success) {
      // Clear guest data after successful signup
      clearGuestCart();
      clearGuestWishlist();
    }
    
    return response.data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

// Get guest cart data for API calls
export const getGuestCartData = () => {
  return getGuestCart();
};