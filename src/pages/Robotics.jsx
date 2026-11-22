// components/Robotics.jsx
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Filter, Search, Heart, Star, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useNavigate } from 'react-router-dom';

const Robotics = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cart, addToCart, isInCart, getItemQuantity } = useCart();
  const { wishlistItems, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const [roboticKits, setRoboticKits] = useState([]);
  const [filteredKits, setFilteredKits] = useState([]);
  const [sortBy, setSortBy] = useState('mostRecent');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [showWishlistAlert, setShowWishlistAlert] = useState(false);

  const initialRoboticKits = [
    {
      id: 1,
      name: 'Brainy Toys Bot Kit, Wolf bot-BTAB-010',
      description: 'Plastic And Metal Kit, Multicolor, 55+ Parts',
      price: 2220,
      currentPrice: 2220,
      originalPrice: 2500,
      discount: 11,
      category: 'Animal Robots',
      rating: 4.5,
      reviews: 12,
      parts: '55+',
      color: 'Multicolor',
      image: 'https://images.unsplash.com/photo-1620287343716-61f5c16d0aa8?w=400',
      sku: 'BTAB-010',
      type: 'toy',
      brand: 'Brainy Toys',
      ageGroup: '8+ years',
      inStock: true,
      stockStatus: 'In Stock'
    },
    {
      id: 2,
      name: 'Brainy Toys Bot Kit, Kicker bot -BTRK-006',
      description: 'Plastic And Metal Kit, Multicolor, 55+ Parts',
      price: 1700,
      currentPrice: 1700,
      originalPrice: 2000,
      discount: 15,
      category: 'Sports Robots',
      rating: 4.2,
      reviews: 8,
      parts: '55+',
      color: 'Multicolor',
      image: 'https://images.unsplash.com/photo-1535378620166-273708d44e4c?w=400',
      sku: 'BTRK-006',
      type: 'toy',
      brand: 'Brainy Toys',
      ageGroup: '7+ years',
      inStock: true,
      stockStatus: 'In Stock'
    },
    {
      id: 3,
      name: 'Brainy Toys Bot Kit, Glass cleaner bot -BTRK-002',
      description: 'Plastic And Metal Kit, Multicolor, 55+ Parts',
      price: 1750,
      currentPrice: 1750,
      originalPrice: 2100,
      discount: 17,
      category: 'Utility Robots',
      rating: 4.3,
      reviews: 15,
      parts: '55+',
      color: 'Multicolor',
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400',
      sku: 'BTRK-002',
      type: 'toy',
      brand: 'Brainy Toys',
      ageGroup: '9+ years',
      inStock: true,
      stockStatus: 'In Stock'
    },
    {
      id: 4,
      name: 'Brainy Toys Bot Kit, football playing bot -BTRK-004',
      description: 'Plastic And Metal Kit, Multicolor, 55+ Parts',
      price: 1705,
      currentPrice: 1705,
      originalPrice: 2000,
      discount: 15,
      category: 'Sports Robots',
      rating: 4.6,
      reviews: 20,
      parts: '55+',
      color: 'Multicolor',
      image: 'https://images.unsplash.com/photo-1589256469067-ea99122bbdc4?w=400',
      sku: 'BTRK-004',
      type: 'toy',
      brand: 'Brainy Toys',
      ageGroup: '8+ years',
      inStock: true,
      stockStatus: 'In Stock'
    },
    {
      id: 5,
      name: 'Brainy Toys Bot Kit, Floor cleaner bot -BTRK-003',
      description: 'Plastic And Metal Kit, Multicolor, 55+ Parts',
      price: 1750,
      currentPrice: 1750,
      originalPrice: 2100,
      discount: 17,
      category: 'Utility Robots',
      rating: 4.4,
      reviews: 18,
      parts: '55+',
      color: 'Multicolor',
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400',
      sku: 'BTRK-003',
      type: 'toy',
      brand: 'Brainy Toys',
      ageGroup: '9+ years',
      inStock: true,
      stockStatus: 'In Stock'
    },
    {
      id: 6,
      name: 'Brainy Toys Bot Kit, Earthworm bot-BTAB-008',
      description: 'Plastic And Metal Kit, Multicolor, 55+ Parts',
      price: 2250,
      currentPrice: 2250,
      originalPrice: 2800,
      discount: 20,
      category: 'Animal Robots',
      rating: 4.7,
      reviews: 25,
      parts: '55+',
      color: 'Multicolor',
      image: 'https://images.unsplash.com/photo-1620287343716-61f5c16d0aa8?w=400',
      sku: 'BTAB-008',
      type: 'toy',
      brand: 'Brainy Toys',
      ageGroup: '10+ years',
      inStock: true,
      stockStatus: 'In Stock'
    },
    {
      id: 7,
      name: 'Brainy Toys Bot Kit, Baseball bot -BTRK-001',
      description: 'Plastic And Metal Kit, Multicolor, 55+ Parts',
      price: 1705,
      currentPrice: 1705,
      originalPrice: 2000,
      discount: 15,
      category: 'Sports Robots',
      rating: 4.3,
      reviews: 10,
      parts: '55+',
      color: 'Multicolor',
      image: 'https://images.unsplash.com/photo-1589256469067-ea99122bbdc4?w=400',
      sku: 'BTRK-001',
      type: 'toy',
      brand: 'Brainy Toys',
      ageGroup: '8+ years',
      inStock: true,
      stockStatus: 'In Stock'
    },
    {
      id: 8,
      name: 'Brainy Toys Bot Kit, 5 combo -ABP-001',
      description: 'make 5 robots using 1 kit, Plastic And Metal Kit, Multicolor, 30+ Parts',
      price: 1240,
      currentPrice: 1240,
      originalPrice: 1500,
      discount: 17,
      category: 'Combo Kits',
      rating: 4.8,
      reviews: 35,
      parts: '30+',
      color: 'Multicolor',
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400',
      sku: 'ABP-001',
      type: 'toy',
      brand: 'Brainy Toys',
      ageGroup: '7+ years',
      inStock: true,
      stockStatus: 'In Stock'
    },
    {
      id: 9,
      name: 'Brainy Toys Bot Kit, 10 combo -BTAB-011',
      description: 'make 10 robots using 1 kit, Plastic And Metal Kit, Multicolor, 60+ Parts',
      price: 3250,
      currentPrice: 3250,
      originalPrice: 4000,
      discount: 19,
      category: 'Combo Kits',
      rating: 4.9,
      reviews: 42,
      parts: '60+',
      color: 'Multicolor',
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400',
      sku: 'BTAB-011',
      type: 'toy',
      brand: 'Brainy Toys',
      ageGroup: '10+ years',
      inStock: true,
      stockStatus: 'In Stock'
    },
    {
      id: 10,
      name: 'Brainy Toys Bot Kit Racer bot -BTRK-008',
      description: 'Plastic And Metal Kit, Multicolor, 30+ Parts',
      price: 1145,
      currentPrice: 1145,
      originalPrice: 1400,
      discount: 18,
      category: 'Vehicle Robots',
      rating: 4.1,
      reviews: 7,
      parts: '30+',
      color: 'Multicolor',
      image: 'https://images.unsplash.com/photo-1589256469067-ea99122bbdc4?w=400',
      sku: 'BTRK-008',
      type: 'toy',
      brand: 'Brainy Toys',
      ageGroup: '6+ years',
      inStock: true,
      stockStatus: 'In Stock'
    },
    {
      id: 11,
      name: 'Brainy Toys Bot Kit Lifting bot -BTRK-007',
      description: 'Plastic And Metal Kit, Multicolor, 55+ Parts',
      price: 1750,
      currentPrice: 1750,
      originalPrice: 2100,
      discount: 17,
      category: 'Utility Robots',
      rating: 4.4,
      reviews: 16,
      parts: '55+',
      color: 'Multicolor',
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400',
      sku: 'BTRK-007',
      type: 'toy',
      brand: 'Brainy Toys',
      ageGroup: '9+ years',
      inStock: true,
      stockStatus: 'In Stock'
    },
    {
      id: 12,
      name: 'Brainy Toys Bot Kit hammer car bot -BTRK-005',
      description: 'Plastic And Metal Kit, Multicolor, 55+ Parts',
      price: 1700,
      currentPrice: 1700,
      originalPrice: 2000,
      discount: 15,
      category: 'Vehicle Robots',
      rating: 4.2,
      reviews: 9,
      parts: '55+',
      color: 'Multicolor',
      image: 'https://images.unsplash.com/photo-1589256469067-ea99122bbdc4?w=400',
      sku: 'BTRK-005',
      type: 'toy',
      brand: 'Brainy Toys',
      ageGroup: '8+ years',
      inStock: true,
      stockStatus: 'In Stock'
    },
    {
      id: 13,
      name: 'Brainy Toys Bot Kit Aqua racer bot -BTRK-010',
      description: 'Plastic And Metal Kit, Multicolor, 30+ Parts',
      price: 1890,
      currentPrice: 1890,
      originalPrice: 2300,
      discount: 18,
      category: 'Vehicle Robots',
      rating: 4.5,
      reviews: 14,
      parts: '30+',
      color: 'Multicolor',
      image: 'https://images.unsplash.com/photo-1589256469067-ea99122bbdc4?w=400',
      sku: 'BTRK-010',
      type: 'toy',
      brand: 'Brainy Toys',
      ageGroup: '7+ years',
      inStock: true,
      stockStatus: 'In Stock'
    },
    {
      id: 14,
      name: 'Brainy Toys Bot Kit, Hippo bot-BTAB-009',
      description: 'Plastic And Metal Kit, Multicolor, 50+ Parts',
      price: 2240,
      currentPrice: 2240,
      originalPrice: 2800,
      discount: 20,
      category: 'Animal Robots',
      rating: 4.6,
      reviews: 22,
      parts: '50+',
      color: 'Multicolor',
      image: 'https://images.unsplash.com/photo-1620287343716-61f5c16d0aa8?w=400',
      sku: 'BTAB-009',
      type: 'toy',
      brand: 'Brainy Toys',
      ageGroup: '9+ years',
      inStock: true,
      stockStatus: 'In Stock'
    },
    {
      id: 15,
      name: 'Brainy Toys Bot Kit, Deragon bot-BTAB-007',
      description: 'Plastic And Metal Kit, Multicolor, 50+ Parts',
      price: 2250,
      currentPrice: 2250,
      originalPrice: 2800,
      discount: 20,
      category: 'Animal Robots',
      rating: 4.7,
      reviews: 28,
      parts: '50+',
      color: 'Multicolor',
      image: 'https://images.unsplash.com/photo-1620287343716-61f5c16d0aa8?w=400',
      sku: 'BTAB-007',
      type: 'toy',
      brand: 'Brainy Toys',
      ageGroup: '10+ years',
      inStock: true,
      stockStatus: 'In Stock'
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setRoboticKits(initialRoboticKits);
      setFilteredKits(initialRoboticKits);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    let filtered = [...roboticKits];

    if (searchTerm) {
      filtered = filtered.filter(kit =>
        kit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kit.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kit.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(kit => kit.category === selectedCategory);
    }

    filtered = filtered.filter(kit =>
      kit.price >= priceRange.min && kit.price <= priceRange.max
    );

    switch (sortBy) {
      case 'priceLowHigh':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'priceHighLow':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'mostRecent':
      default:
        filtered.sort((a, b) => b.id - a.id);
        break;
    }

    setFilteredKits(filtered);
  }, [sortBy, priceRange, searchTerm, selectedCategory, roboticKits]);

  const handleAddToCart = (kit) => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      navigate('/login');
      return;
    }

    addToCart({
      id: kit.id,
      name: kit.name,
      price: kit.price,
      currentPrice: kit.currentPrice,
      originalPrice: kit.originalPrice,
      discount: kit.discount,
      image: kit.image,
      type: 'toy',
      category: kit.category,
      brand: kit.brand,
      ageGroup: kit.ageGroup,
      quantity: 1
    });
  };

  const handleWishlistToggle = (kit) => {
    if (!isAuthenticated) {
      setShowWishlistAlert(true);
      setTimeout(() => {
        setShowWishlistAlert(false);
      }, 3000);
      return;
    }

    if (isInWishlist(kit.id)) {
      removeFromWishlist(kit.id);
    } else {
      addToWishlist({
        id: kit.id,
        name: kit.name,
        brand: kit.brand,
        category: kit.category,
        originalPrice: kit.originalPrice,
        currentPrice: kit.currentPrice,
        discount: kit.discount,
        image: kit.image,
        inStock: kit.inStock,
        stockStatus: kit.stockStatus,
        type: 'toy',
        ageGroup: kit.ageGroup,
        description: kit.description,
        rating: kit.rating
      });
    }
  };

  const categories = ['All', 'Animal Robots', 'Sports Robots', 'Utility Robots', 'Vehicle Robots', 'Combo Kits'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading robotic kits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Wishlist Alert */}
      {showWishlistAlert && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <div>
                <p className="text-sm font-medium text-red-800">
                  Please login to add items to wishlist
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Robotic Kits</h1>
              <p className="text-gray-600 mt-2">Build, Learn and Create with our Robotics Kits</p>
            </div>
            {isAuthenticated && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Heart className="h-5 w-5 text-red-400" />
                <span>{wishlistItems.length} items in wishlist</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4 space-y-6">
            {/* Search */}
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search robotic kits..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-lg text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`block w-full text-left px-3 py-2 rounded transition-colors ${selectedCategory === category ? 'bg-orange-100 text-orange-600' : 'text-gray-700 hover:bg-gray-100'}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-lg text-gray-900 mb-4">Price Range</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Min (₹)</label>
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({...priceRange, min: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Max (₹)</label>
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({...priceRange, max: parseInt(e.target.value) || 5000})}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({...priceRange, max: parseInt(e.target.value)})}
                  className="w-full"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Filter className="h-5 w-5" />
                <span>{filteredKits.length} products found</span>
              </div>
              {!isAuthenticated && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-4">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-yellow-600" />
                    <span className="text-sm text-yellow-700">Login required to add items to cart/wishlist</span>
                  </div>
                </div>
              )}
              {isAuthenticated && (
                <div className="bg-green-50 border border-green-200 rounded p-3 mt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-red-400" />
                      <span className="text-sm text-green-700">Wishlist: {wishlistItems.length} items</span>
                    </div>
                    <button
                      onClick={() => navigate('/wishlist')}
                      className="text-xs text-green-600 hover:text-green-800 font-medium"
                    >
                      View →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Sort Bar */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Sort By:</span>
                  <select
                    className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-orange-500"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="mostRecent">Most Recent</option>
                    <option value="priceLowHigh">Price: Low to High</option>
                    <option value="priceHighLow">Price: High to Low</option>
                    <option value="rating">Highest Rating</option>
                  </select>
                </div>
                <div className="text-sm text-gray-600">
                  Showing {filteredKits.length} of {roboticKits.length} products
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredKits.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No robotic kits found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredKits.map((kit) => {
                  const inCart = isInCart(kit.id, 'toy');
                  const quantityInCart = getItemQuantity(kit.id, 'toy');
                  const inWishlist = isInWishlist(kit.id);
                  
                  return (
                    <div 
                      key={kit.id} 
                      // 1. ADDED: Navigation logic
                      onClick={() => navigate('/robotics-landing-page')}
                      // 2. ADDED: cursor-pointer class
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    >
                      {/* Product Image */}
                      <div className="relative">
                        <img
                          src={kit.image}
                          alt={kit.name}
                          className="w-full h-48 object-cover"
                        />
                        <button
                          onClick={(e) => {
                            // 3. ADDED: Stop navigation when clicking wishlist
                            e.stopPropagation(); 
                            handleWishlistToggle(kit);
                          }}
                          className={`absolute top-2 right-2 p-2 rounded-full shadow transition-colors ${
                            inWishlist 
                              ? 'bg-red-50 hover:bg-red-100' 
                              : 'bg-white hover:bg-gray-100'
                          }`}
                          title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                        >
                          <Heart
                            className={`h-5 w-5 ${
                              inWishlist 
                                ? 'fill-red-500 text-red-500' 
                                : 'text-gray-400'
                            }`}
                          />
                        </button>
                        {kit.discount > 0 && (
                          <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
                            {kit.discount}% OFF
                          </div>
                        )}
                        {kit.category === 'Combo Kits' && (
                          <div className="absolute bottom-2 left-2 bg-orange-600 text-white px-2 py-1 rounded text-xs font-semibold">
                            COMBO OFFER
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {kit.category}
                          </span>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="ml-1 text-sm font-semibold">{kit.rating}</span>
                            <span className="text-xs text-gray-500 ml-1">({kit.reviews})</span>
                          </div>
                        </div>

                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1 hover:text-orange-600 transition-colors">
                          {kit.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{kit.description}</p>

                        <div className="flex items-center justify-between mb-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">SKU:</span>
                              <span className="text-xs font-mono">{kit.sku}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">Age:</span>
                              <span className="text-xs font-semibold">{kit.ageGroup}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">₹{kit.currentPrice.toLocaleString()}</div>
                            {kit.originalPrice > kit.currentPrice && (
                              <div className="text-sm text-gray-500 line-through">
                                ₹{kit.originalPrice.toLocaleString()}
                              </div>
                            )}
                            <div className="text-xs text-green-600 font-semibold">{kit.stockStatus}</div>
                          </div>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                          onClick={(e) => {
                            // 4. ADDED: Stop navigation when clicking Add to Cart
                            e.stopPropagation(); 
                            handleAddToCart(kit);
                          }}
                          disabled={!isAuthenticated}
                          className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${isAuthenticated
                            ? inCart 
                              ? 'bg-green-600 hover:bg-green-700 text-white'
                              : 'bg-orange-600 hover:bg-orange-700 text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          <ShoppingCart className="h-5 w-5" />
                          {!isAuthenticated 
                            ? 'Login to Add' 
                            : inCart 
                              ? `Added (${quantityInCart})` 
                              : 'Add To Cart'
                          }
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {filteredKits.length > 0 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center gap-2">
                  <button className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="px-4 py-2 bg-orange-600 text-white rounded">1</button>
                  <button className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">
                    2
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Wishlist Login Alert Animation */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Robotics;