import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiTrash2, FiShoppingCart, FiArrowLeft, FiStar, FiCheckCircle, FiEye } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useRecentlyViewed } from '../contexts/RecentlyViewedContext';

// Helper Component for Loading Skeleton
const WishlistItemSkeleton = () => (
  <div className="border rounded-lg p-6 animate-pulse">
    <div className="flex flex-col md:flex-row gap-6">
      <div className="md:w-40 md:h-40 w-full h-48 bg-gray-200 rounded-lg"></div>
      <div className="flex-1">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  </div>
);

// Wishlist Item Component
const WishlistItem = React.memo(({ item, onAddToCart, onRemoveFromWishlist }) => {
  const handleAddToCart = useCallback(() => {
    onAddToCart(item);
  }, [item, onAddToCart]);

  const handleRemove = useCallback(() => {
    onRemoveFromWishlist(item.id);
  }, [item.id, onRemoveFromWishlist]);

  return (
    <div className="border rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Product Image */}
        <div className="md:w-40 md:h-40 w-full h-48 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg flex items-center justify-center relative">
          <span className="text-orange-400 text-2xl font-semibold">📚</span>
          <button
            onClick={handleRemove}
            className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:bg-gray-50 transition-colors"
            aria-label="Remove from wishlist"
          >
            <FiTrash2 className="text-red-500 w-5 h-5" />
          </button>
          {item.discount > 0 && (
            <div className="absolute top-3 left-3 bg-orange-600 text-white text-xs font-bold px-2 py-1 rounded">
              SAVE {item.discount}%
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-medium text-gray-900 line-clamp-2">
              {item.name}
            </h3>
          </div>
          
          <p className="text-gray-600 text-sm mb-3">
            {item.brand} • {item.category}
          </p>
          
          {/* Rating */}
          <div className="flex items-center mb-3">
            {[...Array(5)].map((_, i) => (
              <FiStar 
                key={i} 
                className={`w-4 h-4 ${i < Math.floor(item.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
              />
            ))}
            <span className="ml-2 text-sm text-gray-600">({item.rating || 0})</span>
          </div>
          
          <div className="mb-4">
            <div className="text-gray-900 font-bold text-xl">
              ₹{item.currentPrice.toLocaleString('en-IN')}
            </div>
            {item.discount > 0 && (
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-gray-500 text-sm line-through">
                  ₹{item.originalPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-orange-600 text-sm font-medium">
                  Save {item.discount}%
                </span>
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <span className={`text-xs px-2 py-1 rounded ${
                item.inStock 
                  ? item.stockStatus === 'Low stock'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {item.stockStatus || (item.inStock ? 'In stock' : 'Out of stock')}
              </span>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-md font-medium flex items-center justify-center space-x-2 transition-colors duration-200"
            >
              <FiShoppingCart className="w-5 h-5" />
              <span>Add to Cart</span>
            </button>
            <button 
              onClick={handleRemove}
              className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-3 rounded-md font-medium flex items-center justify-center transition-colors duration-200"
              aria-label="Remove"
            >
              <FiTrash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

// You Might Like Component
const YouMightLike = React.memo(({ products, onAddToWishlist, onAddToCart }) => {
  if (products.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">You Might Also Like</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.slice(0, 3).map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-medium text-gray-900 line-clamp-1">{product.name}</h3>
                <p className="text-sm text-gray-600">{product.brand}</p>
              </div>
              <button
                onClick={() => onAddToWishlist(product)}
                className="text-gray-400 hover:text-orange-600 transition-colors"
                aria-label="Add to wishlist"
              >
                <FiHeart className="w-5 h-5" />
              </button>
            </div>
            <div className="mb-4">
              <div className="text-gray-900 font-bold text-lg">
                ₹{product.currentPrice.toLocaleString()}
              </div>
              {product.discount > 0 && (
                <div className="text-gray-500 text-sm line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </div>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onAddToCart(product)}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-md font-medium transition-colors duration-200"
              >
                Add to Cart
              </button>
              <button
                onClick={() => onAddToWishlist(product)}
                className="border border-orange-600 text-orange-600 hover:bg-orange-50 px-4 py-2 rounded-md font-medium transition-colors duration-200"
              >
                <FiHeart className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

// Main Wishlist Component
const Wishlist = () => {
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();
  const { 
    wishlistItems, 
    addToWishlist, 
    removeFromWishlist, 
    clearWishlist, 
    getWishlistCount 
  } = useWishlist();
  
  const { recentlyViewed } = useRecentlyViewed();

  // Handle add to cart
  const handleAddToCart = useCallback((product) => {
    addToCart({
      ...product,
      type: product.type || 'toy'
    });
  }, [addToCart]);

  // Handle move all to cart
  const handleMoveAllToCart = useCallback(() => {
    wishlistItems.forEach(item => handleAddToCart(item));
    clearWishlist();
  }, [wishlistItems, handleAddToCart, clearWishlist]);

  // Sample products for "You Might Like"
  const sampleProducts = useMemo(() => [
    {
      id: 101,
      name: "Interactive Learning Book Set",
      brand: "Brainy Toys",
      category: "Learning",
      originalPrice: 2999,
      currentPrice: 1999,
      discount: 33,
      inStock: true,
      stockStatus: "In stock",
      type: "book",
      rating: 4.5,
      image: "https://via.placeholder.com/300x300/FF6B6B/FFFFFF?text=BOOK"
    },
    {
      id: 102,
      name: "Wooden Puzzle Set",
      brand: "Brainy Toys",
      category: "Puzzles",
      originalPrice: 2499,
      currentPrice: 1799,
      discount: 28,
      inStock: true,
      stockStatus: "In stock",
      type: "toy",
      rating: 4.7,
      image: "https://via.placeholder.com/300x300/4ECDC4/FFFFFF?text=TOY"
    },
    {
      id: 103,
      name: "Science Experiment Kit",
      brand: "Brainy Toys",
      category: "STEM",
      originalPrice: 3999,
      currentPrice: 2999,
      discount: 25,
      inStock: true,
      stockStatus: "Low stock",
      type: "toy",
      rating: 4.8,
      image: "https://via.placeholder.com/300x300/45B7D1/FFFFFF?text=STEM"
    }
  ], []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow p-6">
            <WishlistItemSkeleton />
            <WishlistItemSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Empty State */}
          <div className="text-center bg-white rounded-lg shadow p-12">
            <div className="text-6xl mb-6 text-orange-400">❤️</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your wishlist is empty</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your wishlist yet. Start shopping to add your favorites!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/category/all"
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-md font-medium transition-colors duration-200"
              >
                Browse All Toys
              </Link>
              <Link
                to="/books"
                className="border border-orange-600 text-orange-600 hover:bg-orange-50 px-8 py-3 rounded-md font-medium transition-colors duration-200"
              >
                Explore Books
              </Link>
              <Link
                to="/"
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-8 py-3 rounded-md font-medium transition-colors duration-200"
              >
                Back to Home
              </Link>
            </div>
          </div>

          {/* You Might Like Section */}
          <YouMightLike 
            products={sampleProducts}
            onAddToWishlist={addToWishlist}
            onAddToCart={handleAddToCart}
          />

          {/* Recently Viewed Section */}
          {recentlyViewed.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Recently Viewed</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recentlyViewed.slice(0, 3).map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-medium text-gray-900 line-clamp-1">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.brand}</p>
                      </div>
                      <button
                        onClick={() => addToWishlist(item)}
                        className="text-gray-400 hover:text-orange-600 transition-colors"
                        aria-label="Add to wishlist"
                      >
                        <FiHeart className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="mb-4">
                      <div className="text-gray-900 font-bold text-lg">
                        ₹{item.price.toLocaleString()}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-md font-medium transition-colors duration-200"
                      >
                        Add to Cart
                      </button>
                      <Link
                        to={item.type === 'book' ? '/books' : '/category/all'}
                        className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md font-medium flex items-center justify-center transition-colors duration-200"
                      >
                        <FiEye className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/category/all"
            className="inline-flex items-center text-orange-600 hover:text-orange-700 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Continue Shopping
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">My Wishlist</h1>
          <p className="text-gray-600 mt-2">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow">
              {/* Header */}
              <div className="p-6 border-b">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Saved Items ({wishlistItems.length})
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Your favorite items are saved here
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handleMoveAllToCart}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    >
                      Move All to Cart
                    </button>
                    <button
                      onClick={clearWishlist}
                      className="text-sm text-red-600 hover:text-red-700 transition-colors"
                    >
                      Clear Wishlist
                    </button>
                  </div>
                </div>
              </div>

              {/* Wishlist Items */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {wishlistItems.map((item) => (
                    <WishlistItem
                      key={item.id}
                      item={item}
                      onAddToCart={handleAddToCart}
                      onRemoveFromWishlist={removeFromWishlist}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Benefits Section */}
            <div className="mt-6 bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-orange-900 mb-4 flex items-center">
                <FiHeart className="mr-2 text-orange-600" />
                Benefits of Wishlist
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start space-x-3">
                  <FiCheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Price Drop Alerts</p>
                    <p className="text-sm text-gray-600">Get notified when prices drop</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FiCheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Restock Notifications</p>
                    <p className="text-sm text-gray-600">Be first to know when items are back</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FiCheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Save for Later</p>
                    <p className="text-sm text-gray-600">Keep track of items you love</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            {/* Wishlist Summary */}
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Wishlist Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Items</span>
                  <span className="font-medium">{wishlistItems.length}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">In Stock Items</span>
                  <span className="font-medium text-green-600">
                    {wishlistItems.filter(item => item.inStock).length}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Value</span>
                  <span className="font-bold text-lg text-orange-600">
                    ₹{wishlistItems.reduce((total, item) => total + item.currentPrice, 0).toLocaleString('en-IN')}
                  </span>
                </div>
                
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500 mb-4">
                    Save up to ₹{wishlistItems.reduce((total, item) => 
                      total + (item.originalPrice - item.currentPrice), 0).toLocaleString('en-IN')} on these items
                  </p>
                  
                  <button
                    onClick={handleMoveAllToCart}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-medium mb-3 transition-colors duration-200"
                  >
                    Add All to Cart
                  </button>
                  
                  <Link
                    to="/category/all"
                    className="w-full border border-orange-600 text-orange-600 hover:bg-orange-50 py-3 rounded-lg font-medium block text-center transition-colors duration-200"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>

            {/* Recently Viewed */}
            {recentlyViewed.length > 0 && (
              <div className="mt-6 bg-white rounded-lg shadow p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <FiEye className="mr-2" />
                  Recently Viewed
                </h3>
                <div className="space-y-3">
                  {recentlyViewed.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-50 to-orange-100 rounded flex items-center justify-center">
                        <span className="text-orange-400 text-xs">{item.type === 'book' ? '📚' : '🎮'}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</p>
                        <p className="text-xs text-gray-600">{item.brand}</p>
                        <p className="text-sm font-bold text-orange-600">₹{item.price.toLocaleString('en-IN')}</p>
                      </div>
                      <button
                        onClick={() => addToWishlist(item)}
                        className="text-gray-400 hover:text-orange-600"
                        aria-label="Add to wishlist"
                      >
                        <FiHeart className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* You Might Like Section */}
        <YouMightLike 
          products={sampleProducts}
          onAddToWishlist={addToWishlist}
          onAddToCart={handleAddToCart}
        />

        {/* Promotional Banner */}
        <div className="mt-8 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg shadow p-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">🎁 Complete Your Collection!</h3>
              <p className="opacity-90">
                Free shipping on all orders above ₹999. Shop now and make someone smile!
              </p>
            </div>
            <Link
              to="/category/all"
              className="mt-4 md:mt-0 bg-white text-orange-600 px-6 py-2 rounded-lg font-medium hover:bg-orange-50 transition-colors duration-200"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;