import React, { createContext, useState, useContext, useCallback, useMemo, useEffect } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedWishlist = localStorage.getItem('brainytoys_wishlist');
        return savedWishlist ? JSON.parse(savedWishlist) : [];
      } catch (error) {
        console.error('Error loading wishlist:', error);
        return [];
      }
    }
    return [];
  });

  // Add to wishlist
  const addToWishlist = useCallback((product) => {
    setWishlistItems(prevItems => {
      try {
        const existingItem = prevItems.find(item => item.id === product.id);
        
        if (existingItem) {
          return prevItems;
        }
        
        const newItem = {
          id: product.id,
          name: product.name || product.title || 'Product',
          brand: product.brand || '',
          category: product.category || 'General',
          originalPrice: Number(product.originalPrice || 0),
          currentPrice: Number(product.currentPrice || product.price || 0),
          discount: Number(product.discount || 0),
          image: product.image || '/placeholder-image.jpg',
          inStock: product.inStock !== undefined ? product.inStock : true,
          stockStatus: product.stockStatus || 'In stock',
          type: product.type || 'toy',
          ageGroup: product.ageGroup || '',
          description: product.description || '',
          rating: product.rating || 0,
          addedAt: Date.now()
        };
        
        return [...prevItems, newItem];
      } catch (error) {
        console.error('Error adding to wishlist:', error);
        return prevItems;
      }
    });
  }, []);

  const removeFromWishlist = useCallback((itemId) => {
    setWishlistItems(prevItems => 
      prevItems.filter(item => item.id !== itemId)
    );
  }, []);

  const clearWishlist = useCallback(() => {
    setWishlistItems([]);
  }, []);

  const getWishlistCount = useCallback(() => {
    return wishlistItems.length;
  }, [wishlistItems]);

  const isInWishlist = useCallback((productId) => {
    return wishlistItems.some(item => item.id === productId);
  }, [wishlistItems]);

  // Save to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('brainytoys_wishlist', JSON.stringify(wishlistItems));
      } catch (error) {
        console.error('Error saving wishlist:', error);
      }
    }
  }, [wishlistItems]);

  const value = useMemo(() => ({
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    getWishlistCount,
    isInWishlist
  }), [wishlistItems, addToWishlist, removeFromWishlist, clearWishlist, getWishlistCount, isInWishlist]);

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};