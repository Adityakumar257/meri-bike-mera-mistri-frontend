// AllToys.jsx - COMPLETELY FIXED INFINITE LOOP VERSION
import React, { useState, useEffect, useCallback, memo, useMemo, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import { 
  FaFilter, FaSortAmountDown, FaArrowLeft, FaArrowRight, 
  FaSearch, FaStar, FaStarHalfAlt, FaShoppingBag,
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp,
  FaGift, FaTruck, FaBox, FaHeart, FaShoppingCart,
  FaTimes, FaShoppingBasket, FaHeart as FaHeartSolid,
  FaChevronLeft, FaChevronRight, FaCheck, FaSpinner,
  FaEye, FaInfoCircle
} from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
// Replaced axios and hardcoded URL with service import
import api from '../services/api'; 
import { toast } from 'react-hot-toast';

// Import Slick CSS
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Get auth token helper (can still be useful if not handled by interceptor)
const getToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

// Create a Loading component
const LoadingSpinner = memo(() => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading toys...</p>
    </div>
  </div>
));

// Custom Arrow Components for Slick Slider
const SamplePrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-prev-arrow`}
      style={{ ...style, display: "block", background: "rgba(0,0,0,0.5)", borderRadius: "50%", width: "32px", height: "32px", zIndex: 1 }}
      onClick={onClick}
    >
      <FaChevronLeft className="text-white" />
    </div>
  );
};

const SampleNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-next-arrow`}
      style={{ ...style, display: "block", background: "rgba(0,0,0,0.5)", borderRadius: "50%", width: "32px", height: "32px" }}
      onClick={onClick}
    >
      <FaChevronRight className="text-white" />
    </div>
  );
};

// Product Card Component with Image Slider
const ProductCard = memo(({ product, onAddToCart, onAddToWishlist, isInCart, isInWishlist, cartItem, addingToCart, addingToWishlist, onViewDetails }) => {
  const [localAdding, setLocalAdding] = useState(false);
  const [localWishlistAdding, setLocalWishlistAdding] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleAddToCartClick = async () => {
    setLocalAdding(true);
    try {
      await onAddToCart(product);
    } finally {
      setLocalAdding(false);
    }
  };

  const handleWishlistClick = async () => {
    setLocalWishlistAdding(true);
    try {
      await onAddToWishlist(product);
    } finally {
      setLocalWishlistAdding(false);
    }
  };

  // Check if this specific product is being added
  const isProductAdding = addingToCart === product._id || localAdding;
  const isProductWishlistAdding = addingToWishlist === product._id || localWishlistAdding;

  // Get product images for slider
  const productImages = useMemo(() => {
    if (product.images && product.images.length > 0) {
      return product.images.map(img => img.url);
    }
    // Default images if none available
    return [
      product.image || 'https://via.placeholder.com/300x300/FF6B6B/FFFFFF?text=No+Image',
      `https://via.placeholder.com/300x300/4ECDC4/FFFFFF?text=${encodeURIComponent(product.name?.split(' ')[0] || 'Product')}+2`,
      `https://via.placeholder.com/300x300/45B7D1/FFFFFF?text=${encodeURIComponent(product.name?.split(' ')[0] || 'Product')}+3`,
    ];
  }, [product.images, product.image, product.name]);

  // Slick slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    prevArrow: <SamplePrevArrow />,
    nextArrow: <SampleNextArrow />,
    appendDots: dots => (
      <div
        style={{
          backgroundColor: "transparent",
          borderRadius: "10px",
          padding: "10px",
          bottom: "-30px"
        }}
      >
        <ul style={{ margin: "0px" }}> {dots} </ul>
      </div>
    ),
    customPaging: i => (
      <div
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: "#f97316"
        }}
      >
      </div>
    )
  };

  // Render Rating Stars
  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-500" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-500" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-gray-300" />);
    }

    return (
      <div className="flex items-center">
        <div className="flex">{stars}</div>
        <span className="ml-1 text-sm text-gray-600">({rating || 0})</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
      {/* Image Slider */}
      <div className="relative h-64 overflow-hidden bg-gray-100">
        <Slider {...sliderSettings}>
          {productImages.map((img, index) => (
            <div key={index} className="h-64">
              <img
                src={img}
                alt={`${product.name || 'Product'} - Image ${index + 1}`}
                className="w-full h-full object-contain p-4"
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/300x300/FF6B6B/FFFFFF?text=${encodeURIComponent(product.name?.split(' ')[0] || 'Product')}`;
                  setImageLoaded(true);
                }}
              />
            </div>
          ))}
        </Slider>
        
        {/* Loading overlay */}
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <FaSpinner className="w-6 h-6 animate-spin text-orange-600" />
          </div>
        )}
        
        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded z-10">
            Save {product.discount}%
          </div>
        )}
        
        {/* Stock Badge */}
        <div className={`absolute top-3 right-3 text-xs font-medium px-2 py-1 rounded z-10 ${
          product.inStock 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {product.stockStatus || (product.inStock ? 'In Stock' : 'Out of Stock')}
        </div>
        
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          disabled={isProductWishlistAdding || isInWishlist}
          className="absolute top-12 right-3 bg-white p-2 rounded-full shadow hover:shadow-md transition-shadow z-10 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isProductWishlistAdding ? (
            <FaSpinner className="w-4 h-4 animate-spin text-gray-400" />
          ) : isInWishlist ? (
            <FaHeartSolid className="text-red-500" />
          ) : (
            <FaHeart className="text-gray-400 hover:text-red-500" />
          )}
        </button>
        
        {/* REMOVED: Quick Shop Button that appears on hover */}
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1">
              {product.name || 'Unnamed Product'}
            </h3>
            <p className="text-sm text-gray-500 mb-2">
              {product.brandName || product.brand || ''} • {product.categoryName || product.category || ''}
            </p>
            
            {/* Rating */}
            {/* {renderRating(product.rating || 0)} */}
          </div>
        </div>
        
        {/* Age Group */}
        {product.ageGroupName && (
          <div className="mb-3">
            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
              {product.ageGroupName}
            </span>
          </div>
        )}
        
        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl font-bold text-orange-600">
            ₹{((product.currentPrice || product.price || 0)?.toLocaleString('en-IN') || '0')}
          </span>
          {product.originalPrice && product.originalPrice > (product.currentPrice || product.price || 0) && (
            <span className="text-gray-500 line-through text-sm">
              ₹{(product.originalPrice.toLocaleString('en-IN') || '0')}
            </span>
          )}
          {product.discount > 0 && (
            <span className="text-green-600 text-sm font-medium">
              ({product.discount}% off)
            </span>
          )}
        </div>
        
        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {product.description || ''}
        </p>
        
        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {product.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Action Buttons - UPDATED: Removed View Details, Added Wishlist */}
        <div className="flex space-x-2">
          <Link 
            to={`/product/${product._id || product.id}`}
            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium text-center"
          >
            View Details
          </Link>
          <button 
            onClick={handleAddToCartClick}
            disabled={isProductAdding || !product.inStock}
            className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProductAdding ? (
              <FaSpinner className="animate-spin inline mr-2" />
            ) : !product.inStock ? 'Out of Stock' : 
             isInCart ? `Add More (${cartItem?.quantity || 0})` : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
});

// Filter Sidebar Component
const FilterSidebar = memo(({ 
  filters, 
  categories, 
  brands, 
  ageGroups, 
  availabilityOptions, 
  contactInfo,
  onPriceChange,
  onCategoryToggle,
  onBrandToggle,
  onAvailabilityChange,
  onAgeGroupToggle,
  onClearFilters,
  searchTerm,
  onSearchChange
}) => (
  <div className="lg:col-span-1">
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <FaFilter className="mr-2" />
          Filters
        </h2>
        <button 
          onClick={onClearFilters}
          className="text-sm text-orange-600 hover:text-orange-700"
        >
          Clear all
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-3">Search Toys</h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Search toys..."
            value={searchTerm}
            onChange={onSearchChange}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      {/* Price Filter */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-3">Price Range</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>₹{filters.priceRange[0].toLocaleString()}</span>
            <span>₹{filters.priceRange[1].toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="0"
            max="500000"
            step="1000"
            value={filters.priceRange[1]}
            onChange={(e) => onPriceChange(filters.priceRange[0], parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex space-x-2">
            <input
              type="number"
              value={filters.priceRange[0]}
              onChange={(e) => onPriceChange(parseInt(e.target.value), filters.priceRange[1])}
              className="w-1/2 px-3 py-1 border rounded text-sm"
              placeholder="From"
              min="0"
            />
            <input
              type="number"
              value={filters.priceRange[1]}
              onChange={(e) => onPriceChange(filters.priceRange[0], parseInt(e.target.value))}
              className="w-1/2 px-3 py-1 border rounded text-sm"
              placeholder="To"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-gray-700">Categories</h3>
          <span className="text-xs text-gray-500">
            {filters.categories.length} selected
          </span>
        </div>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {categories.map((category) => (
            <label key={category} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={() => onCategoryToggle(category)}
                className="h-4 w-4 text-orange-600 rounded"
              />
              <span className="ml-2 text-gray-600">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-gray-700">Brands</h3>
          <span className="text-xs text-gray-500">
            {filters.brands.length} selected
          </span>
        </div>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => onBrandToggle(brand)}
                className="h-4 w-4 text-orange-600 rounded"
              />
              <span className="ml-2 text-gray-600">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Age Group Filter */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-gray-700">Age Groups</h3>
          <span className="text-xs text-gray-500">
            {filters.ageGroups.length} selected
          </span>
        </div>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {ageGroups.map((ageGroup) => (
            <label key={ageGroup} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.ageGroups.includes(ageGroup)}
                onChange={() => onAgeGroupToggle(ageGroup)}
                className="h-4 w-4 text-orange-600 rounded"
              />
              <span className="ml-2 text-gray-600">{ageGroup}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Contact Information */}
      {/* <div className="mt-8 pt-8 border-t border-gray-200">
        <h3 className="font-semibold text-gray-700 mb-4">Contact Information</h3>
        <div className="space-y-3">
          {contactInfo.phones.map((phone, index) => (
            <div key={index} className="flex items-center text-gray-600">
              <FaPhone className="mr-3 text-orange-500" />
              <a href={`tel:${phone}`} className="hover:text-orange-600">{phone}</a>
            </div>
          ))}
          {contactInfo.emails.map((email, index) => (
            <div key={index} className="flex items-center text-gray-600">
              <FaEnvelope className="mr-3 text-orange-500" />
              <a href={`mailto:${email}`} className="hover:text-orange-600">{email}</a>
            </div>
          ))}
          <div className="flex items-start text-gray-600">
            <FaMapMarkerAlt className="mr-3 text-orange-500 mt-1" />
            <span className="text-sm">{contactInfo.address}</span>
          </div>
        </div>
      </div> */}
    </div>
  </div>
));

// Pagination Component
const Pagination = memo(({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  indexOfFirstItem, 
  indexOfLastItem, 
  totalItems 
}) => {
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    
    // Always show first page
    pages.push(
      <button
        key={1}
        onClick={() => onPageChange(1)}
        className={`inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium ${
          currentPage === 1
            ? 'border-orange-500 text-orange-600'
            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
        }`}
      >
        1
      </button>
    );

    // Show ellipsis if needed
    if (currentPage > 3) {
      pages.push(
        <span key="left-ellipsis" className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500">
          ...
        </span>
      );
    }

    // Show pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i > 1 && i < totalPages) {
        pages.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium ${
              currentPage === i
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            {i}
          </button>
        );
      }
    }

    // Show ellipsis if needed
    if (currentPage < totalPages - 2) {
      pages.push(
        <span key="right-ellipsis" className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500">
          ...
        </span>
      );
    }

    // Always show last page if there is more than 1 page
    if (totalPages > 1) {
      pages.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className={`inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium ${
            currentPage === totalPages
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
          }`}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="mt-8">
      <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
        <div className="-mt-px flex w-0 flex-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium ${
              currentPage === 1
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            <FaArrowLeft className="mr-3 h-5 w-5" />
            Previous
          </button>
        </div>
        
        <div className="hidden md:-mt-px md:flex">
          {renderPageNumbers()}
        </div>
        
        <div className="-mt-px flex w-0 flex-1 justify-end">
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium ${
              currentPage === totalPages
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Next
            <FaArrowRight className="ml-3 h-5 w-5" />
          </button>
        </div>
      </nav>
      
      {/* Page Info */}
      <div className="mt-4 text-center text-sm text-gray-500">
        Page {currentPage} of {totalPages} • 
        Showing {indexOfFirstItem}-{indexOfLastItem} of {totalItems} toys
      </div>
    </div>
  );
});

// Main AllToys Component
const AllToysCatalog = ({ initialSearchTerm }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(16); // Increased items per page since we have 4 cols
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  
  const { addToCart, cart, isInCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  // Track which products are being added
  const [addingToCart, setAddingToCart] = useState(null);
  const [addingToWishlist, setAddingToWishlist] = useState(null);

  const [filters, setFilters] = useState({
    priceRange: [0, 500000],
    categories: [],
    brands: [],
    availability: 'all',
    ageGroups: [],
    sortBy: 'featured'
  });

  const [availableFilters, setAvailableFilters] = useState({
    categories: [],
    brands: [],
    ageGroups: [],
    priceRange: [0, 500000]
  });

  // Add this ref to track if we've already fetched initial data
  const hasFetchedInitialData = useRef(false);
  const isFetchingRef = useRef(false);
  const filtersRef = useRef(filters);
  const searchTermRef = useRef(searchTerm);
  const currentPageRef = useRef(currentPage);

  // Update refs when state changes
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    searchTermRef.current = searchTerm;
  }, [searchTerm]);

  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  // Contact Information
  const contactInfo = useMemo(() => ({
    phones: ['+919818327437', '+918750052475'],
    emails: ['brainytoys9@gmail.com', 'vardhman099@gmail.com'],
    address: 'VARDHMAN INTERNATIONAL, House No. D252, Sushant Lok II, Golf Course Road, Gurgaon (Haryana)',
    whatsapp: '9818327437'
  }), []);

  const availabilityOptions = useMemo(() => [
    { value: 'all', label: 'All Products' },
    { value: 'in-stock', label: 'In Stock' },
    { value: 'low-stock', label: 'Low Stock' }
  ], []);

  const sortOptions = useMemo(() => [
    { value: 'featured', label: 'Featured' },
    { value: 'newest', label: 'Newest' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'name_asc', label: 'Name: A to Z' },
    { value: 'name_desc', label: 'Name: Z to A' },
    { value: 'discount', label: 'Best Discount' },
    { value: 'rating', label: 'Highest Rated' }
  ], []);

  // Fetch products from API with server-side pagination
  const fetchProducts = useCallback(async (page = currentPageRef.current) => {
    // Prevent multiple simultaneous calls
    if (isFetchingRef.current) return;
    
    isFetchingRef.current = true;
    setLoading(true);
    
    try {
      const params = {
        page: page,
        limit: itemsPerPage,
        minPrice: filtersRef.current.priceRange[0],
        maxPrice: filtersRef.current.priceRange[1],
        availability: filtersRef.current.availability,
        search: searchTermRef.current,
        sortBy: filtersRef.current.sortBy
      };

      // Only include array parameters if they have values
      if (filtersRef.current.categories.length > 0) {
        params.categories = filtersRef.current.categories;
      }
      if (filtersRef.current.brands.length > 0) {
        params.brands = filtersRef.current.brands;
      }
      if (filtersRef.current.ageGroups.length > 0) {
        params.ageGroups = filtersRef.current.ageGroups;
      }

      // Changed from axios to api
      const response = await api.get('/products/toys/all', { 
        params,
        timeout: 30000
      });
      
      if (response.data.success) {
        const productsData = Array.isArray(response.data.data) ? response.data.data : [];
        setProducts(productsData);
        
        // Set pagination metadata from backend
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.totalPages || 1);
          setTotalProducts(response.data.pagination.total || 0);
        } else {
          // Fallback if backend doesn't send pagination
          const total = response.data.total || response.data.data?.length || 0;
          const calculatedTotalPages = Math.ceil(total / itemsPerPage);
          setTotalPages(calculatedTotalPages);
          setTotalProducts(total);
        }
        
        // Update available filters
        if (response.data.filters) {
          setAvailableFilters({
            categories: response.data.filters.categories || [],
            brands: response.data.filters.brands || [],
            ageGroups: response.data.filters.ageGroups || [],
            priceRange: response.data.filters.priceRange || [0, 500000]
          });
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      setTotalPages(1);
      setTotalProducts(0);
      toast.error('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [itemsPerPage]);

  // Initialize - fetch only once on mount
  useEffect(() => {
    if (!hasFetchedInitialData.current) {
      fetchProducts();
      hasFetchedInitialData.current = true;
    }
  }, []);

  // Fetch products when filters or page changes (with proper cleanup)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (hasFetchedInitialData.current) {
        fetchProducts(currentPage);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [currentPage]);

  // Calculate pagination display info
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage + 1;
  const indexOfLastItem = Math.min(currentPage * itemsPerPage, totalProducts);

  // Handle Filter Changes
  const handlePriceChange = useCallback((min, max) => {
    setFilters(prev => ({
      ...prev,
      priceRange: [min, max]
    }));
    setCurrentPage(1);
  }, []);

  const handleCategoryToggle = useCallback((category) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
    setCurrentPage(1);
  }, []);

  const handleBrandToggle = useCallback((brand) => {
    setFilters(prev => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand]
    }));
    setCurrentPage(1);
  }, []);

  const handleAvailabilityChange = useCallback((value) => {
    setFilters(prev => ({
      ...prev,
      availability: value
    }));
    setCurrentPage(1);
  }, []);

  const handleAgeGroupToggle = useCallback((ageGroup) => {
    setFilters(prev => ({
      ...prev,
      ageGroups: prev.ageGroups.includes(ageGroup)
        ? prev.ageGroups.filter(a => a !== ageGroup)
        : [...prev.ageGroups, ageGroup]
    }));
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((value) => {
    setFilters(prev => ({
      ...prev,
      sortBy: value
    }));
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Handle View Details
  const handleViewDetails = useCallback((productId) => {
    navigate(`/product/${productId}`);
  }, [navigate]);

  // Add to Cart with Backend Integration - FIXED: Only one toast notification
  const handleAddToCart = useCallback(async (product) => {
    if (!product?._id && !product?.id) {
      toast.error('Invalid product');
      return;
    }

    setAddingToCart(product._id || product.id);
    
    try {
      // Prepare product data for cart
      const productData = {
        id: product._id || product.id,
        name: product.name || product.title || 'Product',
        currentPrice: product.currentPrice || product.price || 0,
        originalPrice: product.originalPrice || product.price || 0,
        discount: product.discount || 0,
        category: product.categoryName || product.category || '',
        brand: product.brandName || product.brand || '',
        image: product.images?.[0]?.url || product.image || '',
        type: 'toy',
        ageGroup: product.ageGroupName || product.ageGroup || '',
        stockStatus: product.stockStatus,
        inStock: product.inStock,
        quantity: 1
      };

      // Try to add to backend first if user is logged in
      const token = getToken();
      if (token) {
        try {
          // Changed from axios to api
          await api.post('/cart/add', {
            productId: product._id || product.id,
            quantity: 1
          }, {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
        } catch (backendError) {
          console.error('Backend cart error:', backendError);
          // Continue with local cart even if backend fails
        }
      }

      // Add to local cart context - REMOVED: Don't show toast here
      await addToCart(productData);
      
      // Show single success toast and redirect to cart
      const productName = product.name || 'Product';
      toast.success(`${productName} added to cart!`, {
        duration: 2000,
        position: 'bottom-right'
      });
      
      // Redirect to cart page after 500ms
      setTimeout(() => {
        navigate('/cart');
      }, 500);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart. Please try again.');
    } finally {
      setAddingToCart(null);
    }
  }, [addToCart, navigate]);

  // Add to Wishlist with Backend Integration
  const handleAddToWishlist = useCallback(async (product) => {
    if (!product?._id && !product?.id) {
      toast.error('Invalid product');
      return;
    }

    setAddingToWishlist(product._id || product.id);
    
    try {
      // Prepare product data for wishlist
      const productData = {
        id: product._id || product.id,
        name: product.name || product.title || 'Product',
        currentPrice: product.currentPrice || product.price || 0,
        originalPrice: product.originalPrice || product.price || 0,
        discount: product.discount || 0,
        brand: product.brandName || product.brand || '',
        category: product.categoryName || product.category || '',
        image: product.images?.[0]?.url || product.image || '',
        inStock: product.inStock || true,
        stockStatus: product.stockStatus || 'In Stock',
        type: 'toy',
        ageGroup: product.ageGroupName || product.ageGroup || ''
      };

      // Add to local wishlist context
      await addToWishlist(productData);
      
      const productName = product.name || 'Product';
      toast.success(`${productName} added to wishlist!`);
      
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add to wishlist. Please try again.');
    } finally {
      setAddingToWishlist(null);
    }
  }, [addToWishlist]);

  const handleClearFilters = useCallback(() => {
    setFilters({
      priceRange: [0, 500000],
      categories: [],
      brands: [],
      availability: 'all',
      ageGroups: [],
      sortBy: 'featured'
    });
    setSearchTerm('');
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }, []);

  // Add effect to handle filter changes
  useEffect(() => {
    if (hasFetchedInitialData.current) {
      const timeoutId = setTimeout(() => {
        fetchProducts(1);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [filters, searchTerm]);

  if (loading && !hasFetchedInitialData.current) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-50 to-pink-50 py-8">
        {/* MODIFIED: Increased width to 1600px */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link to="/" className="text-gray-700 hover:text-orange-600">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-orange-600 font-medium">All Toys</span>
                </div>
              </li>
            </ol>
          </nav>

          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              <FaBox className="inline mr-3 text-orange-600" />
              All Toys Collection
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Play To Grow - this was the mantra that kickstarted a passionate dream called BrainyToys. 
              A dream to ensure every child gets access to the most mindblowing, quality educational toys & 
              games that are both developmental & super fun!
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <FaStar className="text-orange-600 text-xl" />
              </div>
              <h3 className="font-semibold text-gray-900">11 Years Experience</h3>
              <p className="text-sm text-gray-600">Curating the best toys since 2012</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <FaTruck className="text-pink-600 text-xl" />
              </div>
              <h3 className="font-semibold text-gray-900">Next Day Shipping</h3>
              <p className="text-sm text-gray-600">Fast delivery across India</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <FaGift className="text-green-600 text-xl" />
              </div>
              <h3 className="font-semibold text-gray-900">Gift Services</h3>
              <p className="text-sm text-gray-600">Wrapping & personalized notes</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <FaWhatsapp className="text-blue-600 text-xl" />
              </div>
              <h3 className="font-semibold text-gray-900">Expert Advice</h3>
              <p className="text-sm text-gray-600">9818327437 for recommendations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {/* MODIFIED: Increased width to 1600px */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* MODIFIED: Changed grid to 5 columns to make sidebar smaller (20%) */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Filters Sidebar - takes 1 col out of 5 */}
          <FilterSidebar 
            filters={filters}
            categories={availableFilters.categories}
            brands={availableFilters.brands}
            ageGroups={availableFilters.ageGroups}
            availabilityOptions={availabilityOptions}
            contactInfo={contactInfo}
            onPriceChange={handlePriceChange}
            onCategoryToggle={handleCategoryToggle}
            onBrandToggle={handleBrandToggle}
            onAvailabilityChange={handleAvailabilityChange}
            onAgeGroupToggle={handleAgeGroupToggle}
            onClearFilters={handleClearFilters}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
          />

          {/* Products Grid - takes 4 cols out of 5 */}
          <div className="lg:col-span-4">
            {/* Sort and Results Info */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center">
                  <FaFilter className="mr-2 text-gray-500" />
                  <span className="text-gray-600">
                    {totalProducts} toys found
                    {filters.categories.length > 0 && (
                      <span className="ml-2">
                        in {filters.categories.length} categories
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex items-center">
                  <FaSortAmountDown className="mr-2 text-gray-500" />
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {products.length === 0 && !loading ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No toys found
                </h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your filters or search term
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading toys...</p>
                  </div>
                ) : (
                  <>
                    {/* MODIFIED: Added xl:grid-cols-4 for 4 cards in one row on large screens */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {products.map((product, index) => {
                        const productId = product._id || product.id;
                        const inCart = isInCart(productId, 'toy');
                        const cartItem = cart.find(item => item.id === productId && item.type === 'toy');
                        
                        return (
                          <ProductCard
                            key={`${productId || `product-${index}`}-${currentPage}`}
                            product={product}
                            onAddToCart={handleAddToCart}
                            onAddToWishlist={handleAddToWishlist}
                            isInCart={inCart}
                            isInWishlist={isInWishlist(productId)}
                            cartItem={cartItem}
                            addingToCart={addingToCart}
                            addingToWishlist={addingToWishlist}
                            onViewDetails={handleViewDetails}
                          />
                        );
                      })}
                    </div>
                    
                    {/* Pagination - Only show if more than 1 page */}
                    {totalPages > 1 && (
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        indexOfFirstItem={indexOfFirstItem}
                        indexOfLastItem={indexOfLastItem}
                        totalItems={totalProducts}
                      />
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
        
        {/* WhatsApp Banner */}
        <div className="mt-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0 md:mr-6">
              <div className="flex items-center mb-2">
                <FaWhatsapp className="text-3xl mr-3" />
                <h3 className="text-2xl font-bold">Need Toy Recommendations?</h3>
              </div>
              <p className="text-green-100">
                WhatsApp us on {contactInfo.whatsapp} for personalized toy recommendations based on age, interest, and budget!
              </p>
            </div>
            <a
              href={`https://wa.me/91${contactInfo.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors inline-flex items-center"
            >
              <FaWhatsapp className="mr-2" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
        
        {/* About Us Section */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Choose BrainyToys?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">11 Years of Excellence</h3>
              <p className="text-gray-600 mb-4">
                For the last 11 years, we have been carefully selecting the best, most unique toys 
                and games from all corners of the world. We are proud of our toys of unparalleled 
                quality and innovative concepts.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">•</span>
                  <span>Personally curated by our co-founders</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">•</span>
                  <span>12,000 sq ft showroom in Gurgaon</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">•</span>
                  <span>Over 5,000+ happy customers</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Our Promise</h3>
              <p className="text-gray-600 mb-4">
                We believe in toys that are both developmental and super fun! Our collection 
                is designed to spark creativity, encourage learning, and provide endless hours 
                of enjoyment.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">•</span>
                  <span>100% authentic products</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">•</span>
                  <span>Next day shipping across India</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">•</span>
                  <span>Gift wrapping and personalized notes</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Footer Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                <FaBox className="text-orange-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Curated Selection</h3>
            </div>
            <p className="text-gray-600">
              Every toy in our collection is personally selected by our experts for quality, 
              safety, and educational value.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <FaGift className="text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Gift Services</h3>
            </div>
            <p className="text-gray-600">
              We offer gift wrapping, personalized notes, and special packaging to make 
              your gift extra special.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <FaTruck className="text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Fast Shipping</h3>
            </div>
            <p className="text-gray-600">
              We offer next day shipping across major cities in India. Your toys will 
              reach you quickly and safely.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const AllToys = () => {
  const location = useLocation();
  const initialSearchTerm = new URLSearchParams(location.search).get('search') || '';

  return <AllToysCatalog key={location.search} initialSearchTerm={initialSearchTerm} />;
};

export default AllToys;