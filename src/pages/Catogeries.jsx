import React, { useState, useEffect, useCallback, memo, useMemo, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Slider from 'react-slick';
import { 
  FaFilter, FaSortAmountDown, FaArrowLeft, FaArrowRight, 
  FaSearch, FaStar, FaStarHalfAlt, FaShoppingBag,
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp,
  FaGift, FaTruck, FaBox, FaHeart, FaHeart as FaHeartSolid,
  FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import axios from 'axios';
import { API_BASE_URL } from '../services/api';

// Contexts
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';

// Import Slick CSS
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// ==========================================
// 1. HELPER COMPONENTS (EXACTLY FROM ALLTOYS)
// ==========================================

const LoadingSpinner = memo(() => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading collection...</p>
    </div>
  </div>
));

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

// ==========================================
// 2. PRODUCT CARD (EXACTLY FROM ALLTOYS)
// ==========================================
const ProductCard = memo(({ product, onAddToCart, onAddToWishlist, isInCart, isInWishlist, cartItem }) => {
  const handleAddToCartClick = () => {
    onAddToCart(product);
  };

  const handleWishlistClick = () => {
    onAddToWishlist(product);
  };

  // Get product images for slider
  const productImages = useMemo(() => {
    if (product.images && product.images.length > 0) {
      return product.images.map(img => img.url || img);
    }
    // Default images if none available
    return [
      product.image || 'https://via.placeholder.com/300x300/FF6B6B/FFFFFF?text=No+Image',
      `https://via.placeholder.com/300x300/4ECDC4/FFFFFF?text=${encodeURIComponent(product.name ? product.name.split(' ')[0] : 'Toy')}+2`,
      `https://via.placeholder.com/300x300/45B7D1/FFFFFF?text=${encodeURIComponent(product.name ? product.name.split(' ')[0] : 'Toy')}+3`,
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
      <div style={{ backgroundColor: "transparent", borderRadius: "10px", padding: "10px", bottom: "-30px" }}>
        <ul style={{ margin: "0px" }}> {dots} </ul>
      </div>
    ),
    customPaging: i => (
      <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#f97316" }}></div>
    )
  };

  // Render Rating Stars
  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) stars.push(<FaStar key={`full-${i}`} className="text-yellow-500" />);
    if (hasHalfStar) stars.push(<FaStarHalfAlt key="half" className="text-yellow-500" />);
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) stars.push(<FaStar key={`empty-${i}`} className="text-gray-300" />);

    return <div className="flex items-center">{/* Stars logic */}</div>;
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
                alt={`${product.name} - Image ${index + 1}`}
                className="w-full h-full object-contain p-4"
                loading="lazy"
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/300x300/FF6B6B/FFFFFF?text=${encodeURIComponent(product.name ? product.name.split(' ')[0] : 'Toy')}`;
                }}
              />
            </div>
          ))}
        </Slider>
        
        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded z-10">
            Save {product.discount}%
          </div>
        )}
        
        {/* Stock Badge */}
        <div className={`absolute top-3 right-3 text-xs font-medium px-2 py-1 rounded z-10 ${
          product.inStock ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {product.stockStatus || (product.inStock ? 'In Stock' : 'Out of Stock')}
        </div>
        
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-12 right-3 bg-white p-2 rounded-full shadow hover:shadow-md transition-shadow z-10"
        >
          {isInWishlist ? <FaHeartSolid className="text-red-500" /> : <FaHeart className="text-gray-400 hover:text-red-500" />}
        </button>
        
        {/* Quick Shop Button */}
        <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-95 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
          {isInCart ? (
            <div className="flex items-center justify-between">
              <span className="text-green-600 font-medium">In Cart ({cartItem?.quantity || 0})</span>
              <button onClick={() => onAddToCart(product)} className="bg-orange-600 text-white px-3 py-1 rounded hover:bg-orange-700 text-sm">Add More</button>
            </div>
          ) : (
            <button 
              onClick={handleAddToCartClick}
              className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center text-sm"
            >
              <FaShoppingBag className="mr-2" /> Add to Cart
            </button>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1">{product.name}</h3>
            <p className="text-sm text-gray-500 mb-2">
              {product.brand} • {product.category || product.categoryName}
            </p>
            {renderRating(product.rating || 0)}
          </div>
        </div>
        
        {/* Age Group */}
        {product.ageGroup && (
          <div className="mb-3">
            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
              {product.ageGroup || product.ageGroupName}
            </span>
          </div>
        )}
        
        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl font-bold text-orange-600">
            ₹{product.currentPrice?.toLocaleString('en-IN') || product.price?.toLocaleString('en-IN')}
          </span>
          {product.originalPrice && product.originalPrice > (product.currentPrice || product.price) && (
            <span className="text-gray-500 line-through text-sm">
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
          {product.discount > 0 && (
            <span className="text-green-600 text-sm font-medium">({product.discount}% off)</span>
          )}
        </div>
        
        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
        
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
        
        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Link 
            to={`/product/${product.id || product._id}`}
            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium text-center"
          >
            View Details
          </Link>
          <button 
            onClick={handleAddToCartClick}
            className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
            disabled={!product.inStock}
          >
            {!product.inStock ? 'Out of Stock' : isInCart ? `Add (${cartItem?.quantity || 0})` : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
});

// ==========================================
// 3. FILTER SIDEBAR (EXACTLY FROM ALLTOYS)
// ==========================================
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
          <FaFilter className="mr-2" /> Filters
        </h2>
        <button onClick={onClearFilters} className="text-sm text-orange-600 hover:text-orange-700">Clear all</button>
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
            />
            <input
              type="number"
              value={filters.priceRange[1]}
              onChange={(e) => onPriceChange(filters.priceRange[0], parseInt(e.target.value))}
              className="w-1/2 px-3 py-1 border rounded text-sm"
              placeholder="To"
            />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      {categories && categories.length > 0 && (
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-gray-700">Categories</h3>
          <span className="text-xs text-gray-500">{filters.categories.length} selected</span>
        </div>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {categories.map((cat) => {
             const id = cat._id || cat; // Handle both object and string based on API
             const name = cat.name || cat;
             return (
              <label key={id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(id)}
                  onChange={() => onCategoryToggle(id)}
                  className="h-4 w-4 text-orange-600 rounded"
                />
                <span className="ml-2 text-gray-600">{name}</span>
              </label>
             );
          })}
        </div>
      </div>
      )}

      {/* Brand Filter */}
      {brands && brands.length > 0 && (
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-gray-700">Brands</h3>
          <span className="text-xs text-gray-500">{filters.brands.length} selected</span>
        </div>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {brands.map((brand) => {
            const id = brand._id || brand;
            const name = brand.name || brand;
            return (
              <label key={id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.brands.includes(id)}
                  onChange={() => onBrandToggle(id)}
                  className="h-4 w-4 text-orange-600 rounded"
                />
                <span className="ml-2 text-gray-600">{name}</span>
              </label>
            );
          })}
        </div>
      </div>
      )}

      {/* Age Group Filter */}
      {ageGroups && ageGroups.length > 0 && (
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-gray-700">Age Groups</h3>
          <span className="text-xs text-gray-500">{filters.ageGroups.length} selected</span>
        </div>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {ageGroups.map((age) => {
             const id = age._id || age;
             const name = age.name || age;
             return (
              <label key={id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.ageGroups.includes(id)}
                  onChange={() => onAgeGroupToggle(id)}
                  className="h-4 w-4 text-orange-600 rounded"
                />
                <span className="ml-2 text-gray-600">{name}</span>
              </label>
            );
          })}
        </div>
      </div>
      )}

      {/* Contact Information */}
      <div className="mt-8 pt-8 border-t border-gray-200">
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
      </div>
    </div>
  </div>
));

// ==========================================
// 4. PAGINATION (EXACTLY FROM ALLTOYS)
// ==========================================
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

    if (currentPage > 3) {
      pages.push(
        <span key="left-ellipsis" className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500">...</span>
      );
    }

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

    if (currentPage < totalPages - 2) {
      pages.push(
        <span key="right-ellipsis" className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500">...</span>
      );
    }

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
              currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            <FaArrowLeft className="mr-3 h-5 w-5" /> Previous
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
              currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Next <FaArrowRight className="ml-3 h-5 w-5" />
          </button>
        </div>
      </nav>
      
      <div className="mt-4 text-center text-sm text-gray-500">
        Page {currentPage} of {totalPages} • Showing {indexOfFirstItem}-{indexOfLastItem} of {totalItems} toys
      </div>
    </div>
  );
});

// ==========================================
// 5. MAIN COMPONENT
// ==========================================

const Categories = () => {
  const { type, slug } = useParams();
  
  // Contexts
  const { addToCart, cart, isInCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();

  // State
  const [categoryMetadata, setCategoryMetadata] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Filter State (Matches AllToys structure, mapped to original logic)
  const [filters, setFilters] = useState({
    priceRange: [0, 500000],
    categories: [],
    brands: [],
    ageGroups: [],
    availability: 'all',
    sortBy: 'featured',
    search: ''
  });

  // Sidebar Options State
  const [availableFilters, setAvailableFilters] = useState({
    categories: [],
    brands: [],
    ageGroups: []
  });

  // Static Data
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
    { value: 'rating', label: 'Highest Rated' }
  ], []);

  // 1. Initial Load: Fetch Sidebar Data & Category Metadata
  useEffect(() => {
    fetchSidebarData();
    if (slug) {
      fetchCategoryMetadata();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug, type]);

  // 2. Fetch Products when filters/page change
  useEffect(() => {
    if (categoryMetadata?._id) {
      fetchProducts(categoryMetadata._id);
    }
  }, [categoryMetadata, currentPage, filters]);

  const fetchSidebarData = async () => {
    try {
        const [catRes, brandRes, ageRes] = await Promise.all([
            axios.get(`${API_BASE_URL}/categories/type/category`),
            axios.get(`${API_BASE_URL}/categories/type/brand`),
            axios.get(`${API_BASE_URL}/categories/type/age-group`)
        ]);

        if (catRes.data.success) setAvailableFilters(prev => ({ ...prev, categories: catRes.data.data }));
        if (brandRes.data.success) setAvailableFilters(prev => ({ ...prev, brands: brandRes.data.data }));
        if (ageRes.data.success) setAvailableFilters(prev => ({ ...prev, ageGroups: ageRes.data.data }));

    } catch (error) {
        console.error('Error fetching sidebar filters:', error);
    }
  };

  const fetchCategoryMetadata = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/categories/slug/${slug}`);
      if (res.data.success && res.data.data) {
        setCategoryMetadata(res.data.data);
        document.title = `${res.data.data.name} - Brainy Toys`;
      }
    } catch (error) {
      console.error('Error fetching category:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (id) => {
    setProductsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        sort: filters.sortBy,
        minPrice: filters.priceRange[0],
        maxPrice: filters.priceRange[1],
        status: 'active',
        search: filters.search
      });

      // Main Context Filter (from URL)
      if (type === 'brand') params.append('brand', id);
      else if (type === 'age-group') params.append('ageGroup', id);
      else params.append('category', id);

      // Additional Sidebar Filters
      if (filters.brands.length > 0) params.append('brands', filters.brands.join(','));
      if (filters.categories.length > 0) params.append('categories', filters.categories.join(','));
      if (filters.ageGroups.length > 0) params.append('ageGroups', filters.ageGroups.join(','));
      
      const res = await axios.get(`${API_BASE_URL}/products?${params.toString()}`);
      
      if (res.data.success) {
        const data = res.data.data;
        const meta = res.data.meta || {};

        let productList = [];
        let total = 0;
        let pages = 1;

        if (Array.isArray(data)) {
            productList = data;
            total = meta.pagination?.total || 0;
            pages = meta.pagination?.pages || 1;
        } else if (data.products) {
            productList = data.products;
            total = data.pagination?.totalProducts || 0;
            pages = data.pagination?.totalPages || 1;
        }

        setProducts(productList);
        setTotalPages(pages);
        setTotalProducts(total);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  // Logic Handlers (Mapped to match AllToys signatures)
  const handlePriceChange = useCallback((min, max) => {
    setFilters(prev => ({ ...prev, priceRange: [min, max] }));
    setCurrentPage(1);
  }, []);

  const handleCategoryToggle = useCallback((id) => {
    setFilters(prev => ({
        ...prev,
        categories: prev.categories.includes(id) 
            ? prev.categories.filter(c => c !== id) 
            : [...prev.categories, id]
    }));
    setCurrentPage(1);
  }, []);

  const handleBrandToggle = useCallback((id) => {
    setFilters(prev => ({
        ...prev,
        brands: prev.brands.includes(id)
            ? prev.brands.filter(b => b !== id)
            : [...prev.brands, id]
    }));
    setCurrentPage(1);
  }, []);

  const handleAgeGroupToggle = useCallback((id) => {
    setFilters(prev => ({
        ...prev,
        ageGroups: prev.ageGroups.includes(id)
            ? prev.ageGroups.filter(a => a !== id)
            : [...prev.ageGroups, id]
    }));
    setCurrentPage(1);
  }, []);

  const handleAvailabilityChange = useCallback((value) => {
    setFilters(prev => ({ ...prev, availability: value }));
    setCurrentPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      priceRange: [0, 500000],
      categories: [],
      brands: [],
      ageGroups: [],
      availability: 'all',
      sortBy: 'featured',
      search: ''
    });
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((value) => {
    setFilters(prev => ({ ...prev, sortBy: value }));
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((e) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Cart/Wishlist Actions
  const handleAddToCart = useCallback((product) => {
    addToCart({
        id: product.id || product._id,
        name: product.name,
        price: product.price,
        currentPrice: product.price,
        originalPrice: product.originalPrice,
        image: product.images?.[0]?.url || product.images?.[0],
        inStock: product.inStock,
        category: product.categoryName,
        type: 'toy' // Ensuring type matches AllToys expectation
    });
  }, [addToCart]);

  const handleAddToWishlist = useCallback((product) => {
    addToWishlist({
        id: product.id || product._id,
        name: product.name,
        price: product.price,
        currentPrice: product.price,
        image: product.images?.[0]?.url || product.images?.[0],
        inStock: product.inStock,
        type: 'toy'
    });
  }, [addToWishlist]);

  // Calculate Pagination variables for the Pagination component
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage + 1;
  const indexOfLastItem = Math.min(currentPage * itemsPerPage, totalProducts);

  if (loading && !categoryMetadata) return <LoadingSpinner />;
  if (!categoryMetadata) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-50 to-pink-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link to="/" className="text-gray-700 hover:text-orange-600">Home</Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <Link to={`/${type}s`} className="text-gray-700 hover:text-orange-600 capitalize">{type?.replace('-', ' ')}s</Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-orange-600 font-medium">{categoryMetadata.name}</span>
                </div>
              </li>
            </ol>
          </nav>

          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              <FaBox className="inline mr-3 text-orange-600" />
              {categoryMetadata.name} Collection
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {categoryMetadata.description || `Explore our curated collection of ${categoryMetadata.name}. Designed to spark creativity and provide endless hours of enjoyment.`}
            </p>
          </div>

          {/* Feature Badges */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2"><FaStar className="text-orange-600 text-xl" /></div>
              <h3 className="font-semibold text-gray-900">11 Years Experience</h3>
              <p className="text-sm text-gray-600">Curating best toys since 2012</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-2"><FaTruck className="text-pink-600 text-xl" /></div>
              <h3 className="font-semibold text-gray-900">Next Day Shipping</h3>
              <p className="text-sm text-gray-600">Fast delivery across India</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2"><FaGift className="text-green-600 text-xl" /></div>
              <h3 className="font-semibold text-gray-900">Gift Services</h3>
              <p className="text-sm text-gray-600">Wrapping & personalized notes</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2"><FaWhatsapp className="text-blue-600 text-xl" /></div>
              <h3 className="font-semibold text-gray-900">Expert Advice</h3>
              <p className="text-sm text-gray-600">{contactInfo.whatsapp} for help</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
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
            onAgeGroupToggle={handleAgeGroupToggle}
            onAvailabilityChange={handleAvailabilityChange}
            onClearFilters={handleClearFilters}
            searchTerm={filters.search}
            onSearchChange={handleSearchChange}
          />

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Sort & Info Bar */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center text-gray-600">
                        <FaFilter className="mr-2 text-gray-500" />
                        <span>{totalProducts} toys found</span>
                    </div>
                    <div className="flex items-center">
                        <FaSortAmountDown className="mr-2 text-gray-500" />
                        <select
                            value={filters.sortBy}
                            onChange={(e) => handleSortChange(e.target.value)}
                            className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        >
                            {sortOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Grid */}
            {productsLoading ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 {[1,2,3,4,5,6].map(n => <div key={n} className="bg-white rounded-xl h-96 animate-pulse shadow-sm border"></div>)}
               </div>
            ) : products.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                    <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No toys found</h3>
                    <p className="text-gray-500 mb-6">Try adjusting your filters or search term</p>
                    <button onClick={handleClearFilters} className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">Reset Filters</button>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map(product => {
                            const pId = product._id || product.id;
                            const inCart = isInCart ? isInCart(pId) : false;
                            const inWishlist = isInWishlist ? isInWishlist(pId) : false;
                            const cartItem = cart ? cart.find(item => item.id === pId) : null;

                            return (
                                <ProductCard 
                                    key={`${pId}-${currentPage}`}
                                    product={product}
                                    onAddToCart={handleAddToCart}
                                    onAddToWishlist={handleAddToWishlist}
                                    isInCart={inCart}
                                    isInWishlist={inWishlist}
                                    cartItem={cartItem}
                                />
                            );
                        })}
                    </div>

                    {/* Pagination */}
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
          </div>
        </div>

        {/* WhatsApp Banner */}
        <div className="mt-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-4 md:mb-0 md:mr-6">
                    <div className="flex items-center mb-2">
                        <FaWhatsapp className="text-3xl mr-3" />
                        <h3 className="text-2xl font-bold">Need Toy Recommendations?</h3>
                    </div>
                    <p className="text-green-100">WhatsApp us on {contactInfo.whatsapp} for personalized advice!</p>
                </div>
                <a href={`https://wa.me/91${contactInfo.whatsapp}`} className="bg-white text-green-600 px-6 py-3 rounded-lg font-bold hover:bg-green-50 transition-colors inline-flex items-center">
                    <FaWhatsapp className="mr-2" /> Chat Now
                </a>
            </div>
        </div>

        {/* Why Choose & Footer Info */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Choose BrainyToys?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">11 Years of Excellence</h3>
              <p className="text-gray-600 mb-4">For the last 11 years, we have been carefully selecting the best, most unique toys and games from all corners of the world.</p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start"><span className="text-orange-600 mr-2">•</span><span>Personally curated by our co-founders</span></li>
                <li className="flex items-start"><span className="text-orange-600 mr-2">•</span><span>12,000 sq ft showroom in Gurgaon</span></li>
                <li className="flex items-start"><span className="text-orange-600 mr-2">•</span><span>Over 5,000+ happy customers</span></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Our Promise</h3>
              <p className="text-gray-600 mb-4">We believe in toys that are both developmental and super fun! Our collection is designed to spark creativity.</p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start"><span className="text-orange-600 mr-2">•</span><span>100% authentic products</span></li>
                <li className="flex items-start"><span className="text-orange-600 mr-2">•</span><span>Next day shipping across India</span></li>
                <li className="flex items-start"><span className="text-orange-600 mr-2">•</span><span>Gift wrapping and personalized notes</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Info Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3 text-orange-600"><FaBox /></div>
                    <h3 className="text-lg font-bold text-gray-900">Curated Selection</h3>
                </div>
                <p className="text-gray-600 text-sm">Personally selected by our experts for quality and safety.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 text-blue-600"><FaGift /></div>
                    <h3 className="text-lg font-bold text-gray-900">Gift Services</h3>
                </div>
                <p className="text-gray-600 text-sm">Special wrapping and personalized notes available.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3 text-green-600"><FaTruck /></div>
                    <h3 className="text-lg font-bold text-gray-900">Fast Shipping</h3>
                </div>
                <p className="text-gray-600 text-sm">Next day delivery options across major Indian cities.</p>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Categories;