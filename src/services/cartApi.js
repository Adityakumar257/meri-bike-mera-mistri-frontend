// src/services/cartApi.js
import api from './api';

export const cartApi = {
  // Get user's cart
  async getCart() {
    try {
      const response = await api.get('/cart');
      return response.data;
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  },

  // Add item to cart
  async addToCart(itemData) {
    try {
      const response = await api.post('/cart/add', itemData);
      return response.data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  // Update item quantity
  async updateQuantity(productId, quantity, productType = 'toy') {
    try {
      const response = await api.put('/cart/update', {
        productId,
        quantity,
        type: productType
      });
      return response.data;
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    }
  },

  // Remove item from cart
  async removeFromCart(productId, productType = 'toy') {
    try {
      const response = await api.delete(`/cart/remove/${productId}`, {
        params: { type: productType }
      });
      return response.data;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  },

  // Clear entire cart
  async clearCart() {
    try {
      const response = await api.delete('/cart/clear');
      return response.data;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  },

  // Move item to wishlist
  async moveToWishlist(itemData) {
    try {
      const response = await api.post('/cart/move-to-wishlist', itemData);
      return response.data;
    } catch (error) {
      console.error('Error moving to wishlist:', error);
      throw error;
    }
  },

  // Get cart count
  async getCartCount() {
    try {
      const response = await api.get('/cart/count');
      return response.data;
    } catch (error) {
      console.error('Error getting cart count:', error);
      throw error;
    }
  }
};