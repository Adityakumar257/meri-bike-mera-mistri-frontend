// contexts/CartContext.jsx
import React, { createContext, useState, useContext, useCallback, useMemo, useEffect } from 'react';
import { toast } from 'react-hot-toast';
// ✅ Import CartService from centralized API
import { CartService } from '../services/api';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // ❌ Removed hardcoded API_URL (Handled in api.js)

  // Get token from localStorage (Helper for auth check only)
  const getToken = useCallback(() => {
    return localStorage.getItem('authToken') || 
           localStorage.getItem('adminToken') || 
           localStorage.getItem('token') || 
           sessionStorage.getItem('token');
  }, []);

  // Check if user is authenticated
  const isAuthenticated = useMemo(() => {
    const token = getToken();
    const user = localStorage.getItem('user');
    return !!(token && user);
  }, [getToken]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem('brainytoys_cart');
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          setCart(Array.isArray(parsedCart) ? parsedCart : []);
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        setCart([]);
      }
    };
    
    loadCart();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('brainytoys_cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('brainytoys_cart');
    }
  }, [cart]);

  // Fetch cart from server if authenticated
  const fetchCartFromServer = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      // ✅ Use CartService
      const response = await CartService.getCart();
      
      if (response.data.success) {
        const serverCart = response.data.data?.cart || response.data.data || [];
        setCart(Array.isArray(serverCart) ? serverCart : []);
      }
    } catch (error) {
      console.warn('Failed to fetch cart from server:', error.message);
      // Keep local cart on error
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Sync guest cart with server on login
  const syncGuestCartToUser = useCallback(async () => {
    if (!isAuthenticated || syncing) return;

    setSyncing(true);
    try {
      // First fetch server cart
      await fetchCartFromServer();
      
      // Merge logic (handled by backend usually, or simple fetch here)
      toast.success('Cart synced with account!');
    } catch (error) {
      console.error('Error syncing cart:', error);
    } finally {
      setSyncing(false);
    }
  }, [isAuthenticated, syncing, fetchCartFromServer]);

  // Cart calculation functions
  const getCartTotal = useCallback(() => {
    return cart.reduce((total, item) => {
      const price = Number(item?.currentPrice || item?.price || 0);
      const quantity = Number(item?.quantity || 1);
      return total + (price * quantity);
    }, 0);
  }, [cart]);

  const getCartCount = useCallback(() => {
    return cart.reduce((count, item) => count + (Number(item?.quantity) || 0), 0);
  }, [cart]);

  const isInCart = useCallback((id, type = 'toy') => {
    return cart.some(item => 
      (item?.id === id || item?.productId === id) && item?.type === type
    );
  }, [cart]);

  const getItemQuantity = useCallback((id, type = 'toy') => {
    const item = cart.find(item => 
      (item?.id === id || item?.productId === id) && item?.type === type
    );
    return item ? Number(item.quantity) : 0;
  }, [cart]);

  // Add to cart
  const addToCart = useCallback(async (product) => {
    try {
      const cartProduct = {
        id: product.id || product.productId,
        name: product.name,
        currentPrice: product.currentPrice || product.price,
        image: product.image,
        type: product.type || 'toy',
        quantity: product.quantity || 1,
        minimumOrderQuantity: product.minimumOrderQuantity || 1
      };

      // Sync with server if authenticated
      if (isAuthenticated) {
        await CartService.add({
          productId: cartProduct.id,
          quantity: cartProduct.quantity,
          type: cartProduct.type
        });
      }

      setCart(prev => {
        const existingIndex = prev.findIndex(item =>
          item.id === cartProduct.id && item.type === cartProduct.type
        );
        if (existingIndex < 0) return [...prev, cartProduct];
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + cartProduct.quantity
        };
        return updated;
      });

      toast.success(`${product.name || 'Product'} added to cart!`);
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
      return false;
    }
  }, [isAuthenticated]);

  // Remove from cart
  const removeFromCart = useCallback(async (id, type = 'toy') => {
    try {
      // Update local state
      setCart(prev => prev.filter(item => !(item.id === id && item.type === type)));

      // Sync with server if authenticated
      if (isAuthenticated) {
        try {
          // ✅ Use CartService
          // Appending type to ID because api.js expects ID in the URL
          await CartService.remove(`${id}?type=${type}`);
        } catch (error) {
          console.warn('Server sync failed, keeping local:', error.message);
        }
      }

      toast.success('Item removed from cart');
      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item');
      return false;
    }
  }, [isAuthenticated]);

  // Update quantity
  const updateQuantity = useCallback(async (id, quantity, type = 'toy') => {
    try {
      if (quantity < 1) {
        await removeFromCart(id, type);
        return true;
      }

      // Sync with server if authenticated
      if (isAuthenticated) {
        await CartService.updateQuantity({
          productId: id,
          quantity,
          type
        });
      }

      setCart(prev => prev.map(item =>
        item.id === id && item.type === type ? { ...item, quantity } : item
      ));

      toast.success('Quantity updated');
      return true;
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
      return false;
    }
  }, [isAuthenticated, removeFromCart]);

  // Clear cart
  const clearCart = useCallback(async () => {
    try {
      setCart([]);

      // Sync with server if authenticated
      if (isAuthenticated) {
        try {
          // ✅ Use CartService
          await CartService.clear();
        } catch (error) {
          console.warn('Server sync failed, keeping local:', error.message);
        }
      }

      toast.success('Cart cleared');
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
      return false;
    }
  }, [isAuthenticated]);

  // Refresh cart
  const refreshCart = useCallback(async () => {
    if (isAuthenticated) {
      await fetchCartFromServer();
    }
  }, [isAuthenticated, fetchCartFromServer]);

  const value = useMemo(() => ({
    cart,
    loading,
    syncing,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    isInCart,
    getItemQuantity,
    syncGuestCartToUser,
    fetchCartFromServer,
    refreshCart
  }), [
    cart,
    loading,
    syncing,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    isInCart,
    getItemQuantity,
    syncGuestCartToUser,
    fetchCartFromServer,
    refreshCart
  ]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};