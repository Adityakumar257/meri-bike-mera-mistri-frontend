import React, { createContext, useState, useContext, useCallback, useMemo, useEffect } from 'react';

const RecentlyViewedContext = createContext();

export const useRecentlyViewed = () => {
  const context = useContext(RecentlyViewedContext);
  if (!context) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  }
  return context;
};

export const RecentlyViewedProvider = ({ children }) => {
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('brainytoys_recently_viewed');
        return saved ? JSON.parse(saved) : [];
      } catch (error) {
        console.error('Error loading recently viewed:', error);
        return [];
      }
    }
    return [];
  });

  // Add to recently viewed
  const addToRecentlyViewed = useCallback((product) => {
    setRecentlyViewed(prev => {
      try {
        // Remove if already exists
        const filtered = prev.filter(item => item.id !== product.id);
        
        const newItem = {
          id: product.id,
          name: product.name || product.title || 'Product',
          type: product.type || 'toy',
          image: product.image || '/placeholder-image.jpg',
          price: Number(product.currentPrice || product.price || 0),
          category: product.category || 'General',
          brand: product.brand || '',
          viewedAt: Date.now()
        };
        
        // Add to beginning and keep only last 10 items
        const updated = [newItem, ...filtered].slice(0, 10);
        return updated;
      } catch (error) {
        console.error('Error adding to recently viewed:', error);
        return prev;
      }
    });
  }, []);

  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewed([]);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('brainytoys_recently_viewed', JSON.stringify(recentlyViewed));
      } catch (error) {
        console.error('Error saving recently viewed:', error);
      }
    }
  }, [recentlyViewed]);

  const value = useMemo(() => ({
    recentlyViewed,
    addToRecentlyViewed,
    clearRecentlyViewed
  }), [recentlyViewed, addToRecentlyViewed, clearRecentlyViewed]);

  return (
    <RecentlyViewedContext.Provider value={value}>
      {children}
    </RecentlyViewedContext.Provider>
  );
};