// Guest cart ke liye helper functions (Utility functions only - No React component)
export const getGuestCart = () => {
  const cart = localStorage.getItem('guestCart');
  try {
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error parsing guest cart:', error);
    return [];
  }
};

export const addToGuestCart = (product) => {
  const cart = getGuestCart();
  const existingItem = cart.find(item => 
    item.productId === product.productId && item.type === product.type
  );
  
  if (existingItem) {
    existingItem.quantity += product.quantity || 1;
  } else {
    cart.push({
      productId: product.productId,
      name: product.name,
      currentPrice: product.currentPrice || product.price,
      originalPrice: product.originalPrice || product.price,
      image: product.image,
      type: product.type || 'toy',
      quantity: product.quantity || 1,
      category: product.category,
      brand: product.brand,
      ageGroup: product.ageGroup,
      discount: product.discount || 0
    });
  }
  
  localStorage.setItem('guestCart', JSON.stringify(cart));
  return cart;
};

export const updateGuestCartQuantity = (productId, quantity, type = 'toy') => {
  const cart = getGuestCart();
  const itemIndex = cart.findIndex(item => 
    item.productId === productId && item.type === type
  );
  
  if (itemIndex !== -1) {
    if (quantity <= 0) {
      cart.splice(itemIndex, 1);
    } else {
      cart[itemIndex].quantity = quantity;
    }
    localStorage.setItem('guestCart', JSON.stringify(cart));
  }
  
  return cart;
};

export const removeFromGuestCart = (productId, type = 'toy') => {
  const cart = getGuestCart().filter(item => 
    !(item.productId === productId && item.type === type)
  );
  localStorage.setItem('guestCart', JSON.stringify(cart));
  return cart;
};

export const clearGuestCart = () => {
  localStorage.removeItem('guestCart');
};

export const getGuestCartTotal = () => {
  const cart = getGuestCart();
  return cart.reduce((total, item) => {
    return total + (item.currentPrice * item.quantity);
  }, 0);
};

export const getGuestCartCount = () => {
  const cart = getGuestCart();
  return cart.reduce((count, item) => count + item.quantity, 0);
};

// Merge guest cart with user cart data
export const prepareGuestCartForMerge = () => {
  return getGuestCart().map(item => ({
    productId: item.productId,
    type: item.type,
    quantity: item.quantity
  }));
};