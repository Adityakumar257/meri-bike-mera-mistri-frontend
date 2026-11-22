// Guest wishlist ke liye helper functions
export const getGuestWishlist = () => {
  const wishlist = localStorage.getItem('guestWishlist');
  try {
    return wishlist ? JSON.parse(wishlist) : [];
  } catch (error) {
    console.error('Error parsing guest wishlist:', error);
    return [];
  }
};

export const addToGuestWishlist = (product) => {
  const wishlist = getGuestWishlist();
  const exists = wishlist.some(item => 
    item.productId === product.productId && item.type === product.type
  );
  
  if (!exists) {
    wishlist.push({
      productId: product.productId,
      name: product.name,
      currentPrice: product.currentPrice || product.price,
      originalPrice: product.originalPrice || product.price,
      image: product.image,
      type: product.type || 'toy',
      category: product.category,
      brand: product.brand,
      ageGroup: product.ageGroup,
      discount: product.discount || 0
    });
    localStorage.setItem('guestWishlist', JSON.stringify(wishlist));
  }
  return wishlist;
};

export const removeFromGuestWishlist = (productId, type = 'toy') => {
  const wishlist = getGuestWishlist().filter(item => 
    !(item.productId === productId && item.type === type)
  );
  localStorage.setItem('guestWishlist', JSON.stringify(wishlist));
  return wishlist;
};

export const clearGuestWishlist = () => {
  localStorage.removeItem('guestWishlist');
};

export const getGuestWishlistCount = () => {
  return getGuestWishlist().length;
};

// Merge guest wishlist with user wishlist data
export const prepareGuestWishlistForMerge = () => {
  return getGuestWishlist().map(item => ({
    productId: item.productId,
    type: item.type
  }));
};