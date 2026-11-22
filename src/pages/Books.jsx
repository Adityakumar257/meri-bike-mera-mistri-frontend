import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaShoppingBag, FaFilter, FaSortAmountDown, FaTimes,
  FaStar, FaStarHalfAlt, FaWhatsapp, FaGift, FaTruck,
  FaArrowLeft, FaArrowRight, FaSearch, FaBookOpen,
  FaBook, FaBookReader, FaPhone, FaEnvelope,
  FaMapMarkerAlt, FaShoppingCart
} from 'react-icons/fa';

// Create Cart Context
const CartContext = React.createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('brainytoys_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const addToCart = (book) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === book.id);
      let updatedCart;
      
      if (existingItem) {
        updatedCart = prevCart.map(item =>
          item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        updatedCart = [...prevCart, { ...book, quantity: 1 }];
      }
      
      localStorage.setItem('brainytoys_cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const removeFromCart = (id) => {
    setCart(prevCart => {
      const updatedCart = prevCart.filter(item => item.id !== id);
      localStorage.setItem('brainytoys_cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    
    setCart(prevCart => {
      const updatedCart = prevCart.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
      localStorage.setItem('brainytoys_cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('brainytoys_cart');
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => useContext(CartContext);

const Books = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [searchTerm, setSearchTerm] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  
  const { addToCart, cart, removeFromCart, updateQuantity, getCartTotal } = useCart();

  const [filters, setFilters] = useState({
    priceRange: [0, 7500],
    categories: [],
    brands: [],
    availability: [],
    ageGroups: [],
    sortBy: 'newest'
  });

  // Contact Information - Updated as requested
  const contactInfo = {
    phones: ['+919818327437', '+918750052475'],
    emails: ['brainytoys9@gmail.com', 'vardhman099@gmail.com'],
    address: 'VARDHMAN INTERNATIONAL, House No. D252, Sushant Lok II, Golf Course Road, Gurgaon (Haryana)',
    whatsapp: '9818327437'
  };

  // Books Data
  const booksData = [
    {
      id: 1,
      title: "Rory And The Monstersitter",
      price: 399,
      originalPrice: 499,
      discount: 20,
      brand: "Bl",
      category: "Picture Books",
      subCategory: "Picture Book",
      availability: "In stock",
      image: "https://via.placeholder.com/300x400/FF6B6B/FFFFFF?text=Rory+Book",
      rating: 4.5,
      description: "A delightful picture book about Rory and his monster adventures.",
      ageGroup: "2-5 Years",
      publisher: "Toycra",
      pages: 32,
      language: "English",
      tags: ["Adventure", "Monsters", "Bedtime"]
    },
    {
      id: 2,
      title: "Be Wild, Little One",
      price: 399,
      originalPrice: 450,
      discount: 11,
      brand: "Bl",
      category: "Picture Books",
      subCategory: "Picture Book",
      availability: "In stock",
      image: "https://via.placeholder.com/300x400/4ECDC4/FFFFFF?text=Be+Wild",
      rating: 4.2,
      description: "Encourage your little one to embrace their wild side.",
      ageGroup: "3-6 Years",
      publisher: "Toycra",
      pages: 28,
      language: "English",
      tags: ["Nature", "Adventure", "Self-expression"]
    },
    // ... (keep all other book objects as they are)
    {
      id: 18,
      title: "Ten Little Elves",
      price: 499,
      originalPrice: 550,
      discount: 9,
      brand: "Hi",
      category: "Board Books",
      subCategory: "Board Book",
      availability: "In stock",
      image: "https://via.placeholder.com/300x400/A8FFC3/FFFFFF?text=Elves",
      rating: 4.4,
      description: "Count along with ten little elves.",
      ageGroup: "1-3 Years",
      publisher: "Toycra",
      pages: 22,
      language: "English",
      tags: ["Elves", "Counting", "Christmas"]
    }
  ];

  // Filter Options
  const categories = [
    "Books for Toddlers",
    "Activity Books",
    "Cloth Books",
    "Board Books",
    "Picture Books",
    "Books-Encyclopedia",
    "Story Books"
  ];

  const brands = ["Bl", "Sch", "Pegasus", "Hc", "Hi", "Toycra"];
  const availabilityOptions = ["In stock", "Low stock"];
  const ageGroups = ["0-2 Years", "2-4 Years", "4-7 Years", "7-12 Years"];

  const sortOptions = [
    { value: 'newest', label: 'Date, new to old' },
    { value: 'oldest', label: 'Date, old to new' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'name_asc', label: 'Name: A to Z' },
    { value: 'name_desc', label: 'Name: Z to A' },
    { value: 'discount', label: 'Best Discount' }
  ];

  // Initialize
  useEffect(() => {
    setBooks(booksData);
    setFilteredBooks(booksData);
    setLoading(false);
  }, []);

  // Apply Filters and Search
  useEffect(() => {
    let result = [...books];

    // Search Filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(book =>
        book.title.toLowerCase().includes(term) ||
        book.description.toLowerCase().includes(term) ||
        (book.tags && book.tags.some(tag => tag.toLowerCase().includes(term))) ||
        book.category.toLowerCase().includes(term)
      );
    }

    // Price Range Filter
    result = result.filter(book => 
      book.price >= filters.priceRange[0] && 
      book.price <= filters.priceRange[1]
    );

    // Category Filter
    if (filters.categories.length > 0) {
      result = result.filter(book => 
        filters.categories.includes(book.category) || 
        filters.categories.includes(book.subCategory)
      );
    }

    // Brand Filter
    if (filters.brands.length > 0) {
      result = result.filter(book => 
        filters.brands.includes(book.brand)
      );
    }

    // Availability Filter
    if (filters.availability.length > 0) {
      result = result.filter(book => 
        filters.availability.includes(book.availability)
      );
    }

    // Age Group Filter
    if (filters.ageGroups.length > 0) {
      result = result.filter(book => 
        filters.ageGroups.includes(book.ageGroup)
      );
    }

    // Sorting
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest':
          return b.id - a.id;
        case 'oldest':
          return a.id - b.id;
        case 'price_low':
          return a.price - b.price;
        case 'price_high':
          return b.price - a.price;
        case 'name_asc':
          return a.title.localeCompare(b.title);
        case 'name_desc':
          return b.title.localeCompare(a.title);
        case 'discount':
          return (b.discount || 0) - (a.discount || 0);
        default:
          return 0;
      }
    });

    setFilteredBooks(result);
    setCurrentPage(1);
  }, [filters, books, searchTerm]);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  // Handle Filter Changes
  const handlePriceChange = (min, max) => {
    setFilters(prev => ({
      ...prev,
      priceRange: [min, max]
    }));
  };

  const handleCategoryToggle = (category) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleBrandToggle = (brand) => {
    setFilters(prev => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand]
    }));
  };

  const handleAvailabilityToggle = (availability) => {
    setFilters(prev => ({
      ...prev,
      availability: prev.availability.includes(availability)
        ? prev.availability.filter(a => a !== availability)
        : [...prev.availability, availability]
    }));
  };

  const handleAgeGroupToggle = (ageGroup) => {
    setFilters(prev => ({
      ...prev,
      ageGroups: prev.ageGroups.includes(ageGroup)
        ? prev.ageGroups.filter(a => a !== ageGroup)
        : [...prev.ageGroups, ageGroup]
    }));
  };

  const handleSortChange = (value) => {
    setFilters(prev => ({
      ...prev,
      sortBy: value
    }));
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (book) => {
  addToCart({
    id: book.id,
    name: book.title,
    price: book.price,
    currentPrice: book.price,
    originalPrice: book.originalPrice,
    discount: book.discount,
    category: book.category,
    brand: book.brand,
    image: book.image,
    type: 'book',
    ageGroup: book.ageGroup,
    description: book.description
  });
  alert(`${book.title} added to cart!`);
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
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* REMOVED: Header with Cart and Search */}
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-50 to-pink-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  <span className="text-orange-600 font-medium">Books</span>
                </div>
              </li>
            </ol>
          </nav>

          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              <FaBookOpen className="inline mr-3 text-orange-600" />
              Books Collection
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our curated selection of Board Books, Picture Books, Activity Books, 
              Story Books and Encyclopedias - picked right off the shelves of our 12,000 sq ft showroom.
            </p>
          </div>

          {/* Categories Bar */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => handleCategoryToggle(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filters.categories.includes(category)
                    ? 'bg-orange-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <FaBook className="text-orange-600 text-xl" />
              </div>
              <h3 className="font-semibold text-gray-900">Curated Collection</h3>
              <p className="text-sm text-gray-600">Personally curated by our co-founders</p>
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
              <h3 className="font-semibold text-gray-900">WhatsApp Support</h3>
              <p className="text-sm text-gray-600">9818327437 for recommendations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <FaFilter className="mr-2" />
                  Filters
                </h2>
                <button 
                  onClick={() => setFilters({
                    priceRange: [0, 7500],
                    categories: [],
                    brands: [],
                    availability: [],
                    ageGroups: [],
                    sortBy: 'newest'
                  })}
                  className="text-sm text-orange-600 hover:text-orange-700"
                >
                  Clear all
                </button>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-3">Price</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>₹{filters.priceRange[0]}</span>
                    <span>₹{filters.priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="7500"
                    step="100"
                    value={filters.priceRange[1]}
                    onChange={(e) => handlePriceChange(filters.priceRange[0], parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={filters.priceRange[0]}
                      onChange={(e) => handlePriceChange(parseInt(e.target.value), filters.priceRange[1])}
                      className="w-1/2 px-3 py-1 border rounded text-sm"
                      placeholder="From"
                    />
                    <input
                      type="number"
                      value={filters.priceRange[1]}
                      onChange={(e) => handlePriceChange(filters.priceRange[0], parseInt(e.target.value))}
                      className="w-1/2 px-3 py-1 border rounded text-sm"
                      placeholder="To"
                    />
                  </div>
                </div>
              </div>

              {/* Brand Filter */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-3">Brand</h3>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <label key={brand} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.brands.includes(brand)}
                        onChange={() => handleBrandToggle(brand)}
                        className="h-4 w-4 text-orange-600 rounded"
                      />
                      <span className="ml-2 text-gray-600">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Availability Filter */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-3">Availability</h3>
                <div className="space-y-2">
                  {availabilityOptions.map((option) => (
                    <label key={option} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.availability.includes(option)}
                        onChange={() => handleAvailabilityToggle(option)}
                        className="h-4 w-4 text-orange-600 rounded"
                      />
                      <span className="ml-2 text-gray-600">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Age Filter */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-3">Age</h3>
                <div className="space-y-2">
                  {ageGroups.map((ageGroup) => (
                    <label key={ageGroup} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.ageGroups.includes(ageGroup)}
                        onChange={() => handleAgeGroupToggle(ageGroup)}
                        className="h-4 w-4 text-orange-600 rounded"
                      />
                      <span className="ml-2 text-gray-600">{ageGroup}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Search Box in Sidebar */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-3">Search</h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search books..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>

              {/* Contact Info in Sidebar */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-3">Contact Us</h3>
                <div className="space-y-2 text-sm">
                  {contactInfo.phones.map((phone, idx) => (
                    <div key={idx} className="flex items-center text-gray-600">
                      <FaPhone className="mr-2 text-orange-600" />
                      {phone}
                    </div>
                  ))}
                  {contactInfo.emails.map((email, idx) => (
                    <div key={idx} className="flex items-center text-gray-600">
                      <FaEnvelope className="mr-2 text-orange-600" />
                      {email}
                    </div>
                  ))}
                  <div className="flex items-start text-gray-600">
                    <FaMapMarkerAlt className="mr-2 text-orange-600 mt-1" />
                    <span>{contactInfo.address}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Books Grid */}
          <div className="lg:col-span-3">
            {/* Sort and Results Info */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center">
                  <FaFilter className="mr-2 text-gray-500" />
                  <span className="text-gray-600">
                    {filteredBooks.length} products found
                    {filters.categories.length > 0 && (
                      <span className="ml-2">
                        in {filters.categories.join(', ')}
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

            {/* Books Grid */}
            {filteredBooks.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <FaBookReader className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No books found
                </h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your filters or browse all books
                </p>
                <button
                  onClick={() => setFilters({
                    priceRange: [0, 7500],
                    categories: [],
                    brands: [],
                    availability: [],
                    ageGroups: [],
                    sortBy: 'newest'
                  })}
                  className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentBooks.map((book) => {
                    const isInCart = cart.some(item => item.id === book.id);
                    const cartItem = cart.find(item => item.id === book.id);
                    
                    return (
                      <div key={book.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
                        {/* Image */}
                        <div className="relative h-64 overflow-hidden bg-gray-100">
                          <img
                            src={book.image}
                            alt={book.title}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/300x400/CCCCCC/666666?text=Book+Image';
                            }}
                          />
                          
                          {/* Discount Badge */}
                          {book.discount > 0 && (
                            <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                              Save {book.discount}%
                            </div>
                          )}
                          
                          {/* Stock Badge */}
                          <div className={`absolute top-3 right-3 text-xs font-medium px-2 py-1 rounded ${
                            book.availability === 'In stock' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {book.availability}
                          </div>
                          
                          {/* Quick Shop Button */}
                          <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-95 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                            {isInCart ? (
                              <div className="flex items-center justify-between">
                                <span className="text-green-600 font-medium">In Cart ({cartItem.quantity})</span>
                                <button 
                                  onClick={() => updateQuantity(book.id, cartItem.quantity + 1)}
                                  className="bg-orange-600 text-white px-3 py-1 rounded hover:bg-orange-700"
                                >
                                  Add More
                                </button>
                              </div>
                            ) : (
                              <button 
                                onClick={() => handleAddToCart(book)}
                                className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center"
                              >
                                <FaShoppingBag className="mr-2" />
                                Add to Cart
                              </button>
                            )}
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1">
                                {book.title}
                              </h3>
                              <p className="text-sm text-gray-500 mb-2">
                                {book.subCategory} - {book.brand}
                              </p>
                              
                              {/* Rating */}
                              {renderRating(book.rating)}
                            </div>
                          </div>
                          
                          {/* Price */}
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xl font-bold text-orange-600">
                              ₹{book.price.toLocaleString('en-IN')}
                            </span>
                            {book.originalPrice && (
                              <span className="text-gray-500 line-through text-sm">
                                ₹{book.originalPrice.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>
                          
                          {/* Age & Category Badges */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                              {book.ageGroup}
                            </span>
                            <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
                              {book.category}
                            </span>
                            {book.tags && book.tags.slice(0, 2).map((tag, idx) => (
                              <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                          
                          {/* Description */}
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                            {book.description}
                          </p>
                          
                          {/* Action Buttons */}
                          <div className="flex space-x-2">
                            <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                              View Details
                            </button>
                            <button 
                              onClick={() => handleAddToCart(book)}
                              className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
                            >
                              {isInCart ? `Add More (${cartItem.quantity})` : 'Add to Cart'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8">
                    <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
                      <div className="-mt-px flex w-0 flex-1">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
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
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                          if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          ) {
                            return (
                              <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium ${
                                  currentPage === page
                                    ? 'border-orange-500 text-orange-600'
                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                }`}
                              >
                                {page}
                              </button>
                            );
                          } else if (
                            page === currentPage - 2 ||
                            page === currentPage + 2
                          ) {
                            return (
                              <span key={page} className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500">
                                ...
                              </span>
                            );
                          }
                          return null;
                        })}
                      </div>
                      
                      <div className="-mt-px flex w-0 flex-1 justify-end">
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
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
                      Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredBooks.length)} of {filteredBooks.length} books
                    </div>
                  </div>
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
                <h3 className="text-2xl font-bold">Need Help Choosing Books?</h3>
              </div>
              <p className="text-green-100">
                WhatsApp us on {contactInfo.whatsapp} for personalized book recommendations based on age and interest!
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
        
        {/* Contact Information Section */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaPhone className="text-orange-600 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone Numbers</h3>
              {contactInfo.phones.map((phone, idx) => (
                <p key={idx} className="text-gray-600">{phone}</p>
              ))}
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaEnvelope className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Addresses</h3>
              {contactInfo.emails.map((email, idx) => (
                <p key={idx} className="text-gray-600">{email}</p>
              ))}
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaMapMarkerAlt className="text-green-600 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Address</h3>
              <p className="text-gray-600">{contactInfo.address}</p>
            </div>
          </div>
        </div>
        
        {/* Footer Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                <FaBookOpen className="text-orange-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Curated Selection</h3>
            </div>
            <p className="text-gray-600">
              All books are personally curated by our co-founders, and will be fantastic 
              additions to your little one's library!
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
              We offer return gift orders, gift wrapping and personalized notes to make 
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
              We offer next day shipping across major cities in India. Your books will 
              reach you quickly and safely.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main export with CartProvider
const BooksWithCart = () => (
  <CartProvider>
    <Books />
  </CartProvider>
);

export default BooksWithCart;