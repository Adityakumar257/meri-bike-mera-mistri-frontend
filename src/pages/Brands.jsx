import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFilter, FaSortAmountDown, FaArrowLeft, FaArrowRight, 
  FaSearch, FaStar, FaStarHalfAlt, FaShoppingBag,
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp,
  FaGift, FaTruck, FaTag
} from 'react-icons/fa';

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [filters, setFilters] = useState({
    categories: [],
    sortBy: 'name_asc'
  });

  // Contact Information
  const contactInfo = {
    phones: ['+919818327437', '+918750052475'],
    emails: ['brainytoys9@gmail.com', 'vardhman099@gmail.com'],
    address: 'VARDHMAN INTERNATIONAL, House No. D252, Sushant Lok II, Golf Course Road, Gurgaon (Haryana)',
    whatsapp: '9818327437'
  };

  // Brands Data
  const brandsData = [
    {
      id: 1,
      name: "LEGO",
      description: "World's leading construction toys, sparking creativity and imagination.",
      productCount: 150,
      categories: ["Building Blocks", "Educational", "Creative Play"],
      image: "https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=LEGO",
      featured: true,
      discount: "Up to 30% Off"
    },
    {
      id: 2,
      name: "Barbie",
      description: "Iconic fashion dolls that inspire storytelling and imaginative play.",
      productCount: 85,
      categories: ["Dolls", "Fashion", "Role Play"],
      image: "https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=Barbie",
      featured: true,
      discount: "Up to 25% Off"
    },
    {
      id: 3,
      name: "Hot Wheels",
      description: "Die-cast toy cars for thrilling racing adventures and collections.",
      productCount: 120,
      categories: ["Vehicles", "Action", "Collectibles"],
      image: "https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=Hot+Wheels",
      featured: false,
      discount: "Up to 20% Off"
    },
    {
      id: 4,
      name: "Fisher-Price",
      description: "Early learning toys for babies and toddlers' development.",
      productCount: 95,
      categories: ["Baby Toys", "Educational", "Early Learning"],
      image: "https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=Fisher-Price",
      featured: true,
      discount: "Up to 15% Off"
    },
    {
      id: 5,
      name: "Nerf",
      description: "Action-packed blasters for outdoor play and adventure.",
      productCount: 65,
      categories: ["Outdoor", "Action", "Sports"],
      image: "https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=Nerf",
      featured: false,
      discount: "Up to 25% Off"
    },
    {
      id: 6,
      name: "Hasbro",
      description: "Diverse range of games, toys, and entertainment products.",
      productCount: 110,
      categories: ["Board Games", "Action Figures", "Collectibles"],
      image: "https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=Hasbro",
      featured: true,
      discount: "Up to 30% Off"
    },
    {
      id: 7,
      name: "Mattel",
      description: "Creating innovative products that inspire play and learning.",
      productCount: 90,
      categories: ["Dolls", "Vehicles", "Games"],
      image: "https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=Mattel",
      featured: false,
      discount: "Up to 20% Off"
    },
    {
      id: 8,
      name: "Magna-Tiles",
      description: "Magnetic building tiles that inspire creativity and STEM learning.",
      productCount: 45,
      categories: ["Educational", "STEM", "Building"],
      image: "https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=Magna-Tiles",
      featured: true,
      discount: "Up to 15% Off"
    },
    {
      id: 9,
      name: "Play-Doh",
      description: "Creative modeling compound for artistic expression and fun.",
      productCount: 55,
      categories: ["Arts & Crafts", "Creative", "Educational"],
      image: "https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=Play-Doh",
      featured: false,
      discount: "Up to 10% Off"
    },
    {
      id: 10,
      name: "Melissa & Doug",
      description: "Wooden educational toys promoting creative play and learning.",
      productCount: 75,
      categories: ["Wooden Toys", "Educational", "Puzzles"],
      image: "https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=Melissa+%26+Doug",
      featured: true,
      discount: "Up to 20% Off"
    },
    {
      id: 11,
      name: "VTech",
      description: "Electronic learning toys for early childhood development.",
      productCount: 60,
      categories: ["Electronic", "Educational", "Learning"],
      image: "https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=VTech",
      featured: false,
      discount: "Up to 25% Off"
    },
    {
      id: 12,
      name: "Crayola",
      description: "Art supplies and creative tools for young artists.",
      productCount: 80,
      categories: ["Arts & Crafts", "Creative", "Educational"],
      image: "https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=Crayola",
      featured: true,
      discount: "Up to 15% Off"
    },
    {
      id: 13,
      name: "Schleich",
      description: "Highly detailed animal and fantasy figurines for collectors.",
      productCount: 40,
      categories: ["Collectibles", "Animals", "Role Play"],
      image: "https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=Schleich",
      featured: false,
      discount: "Up to 10% Off"
    },
    {
      id: 14,
      name: "Ravensburger",
      description: "High-quality puzzles and games for all ages.",
      productCount: 70,
      categories: ["Puzzles", "Board Games", "Family Games"],
      image: "https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=Ravensburger",
      featured: true,
      discount: "Up to 20% Off"
    },
    {
      id: 15,
      name: "Playmobil",
      description: "Detailed playsets and figures for imaginative storytelling.",
      productCount: 85,
      categories: ["Role Play", "Collectibles", "Creative"],
      image: "https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=Playmobil",
      featured: false,
      discount: "Up to 15% Off"
    },
    {
      id: 16,
      name: "Disney",
      description: "Toys and games featuring beloved Disney characters.",
      productCount: 100,
      categories: ["Characters", "Role Play", "Collectibles"],
      image: "https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=Disney",
      featured: true,
      discount: "Up to 30% Off"
    },
    {
      id: 17,
      name: "Marvel",
      description: "Action figures and toys featuring Marvel superheroes.",
      productCount: 75,
      categories: ["Action Figures", "Collectibles", "Superheroes"],
      image: "https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=Marvel",
      featured: true,
      discount: "Up to 25% Off"
    },
    {
      id: 18,
      name: "Star Wars",
      description: "Toys and collectibles from the Star Wars universe.",
      productCount: 65,
      categories: ["Action Figures", "Collectibles", "Sci-Fi"],
      image: "https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=Star+Wars",
      featured: false,
      discount: "Up to 20% Off"
    }
  ];

  const categories = [
    "Building Blocks", "Dolls", "Vehicles", "Educational", 
    "Action Figures", "Board Games", "Arts & Crafts", "Collectibles",
    "Role Play", "Electronic", "Outdoor", "STEM"
  ];

  const sortOptions = [
    { value: 'name_asc', label: 'Name: A to Z' },
    { value: 'name_desc', label: 'Name: Z to A' },
    { value: 'count_high', label: 'Most Products' },
    { value: 'count_low', label: 'Fewest Products' }
  ];

  // Initialize
  useEffect(() => {
    setBrands(brandsData);
    setFilteredBrands(brandsData);
    setLoading(false);
  }, []);

  // Apply Filters and Search
  useEffect(() => {
    let result = [...brands];

    // Search Filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(brand =>
        brand.name.toLowerCase().includes(term) ||
        brand.description.toLowerCase().includes(term)
      );
    }

    // Category Filter
    if (filters.categories.length > 0) {
      result = result.filter(brand =>
        filters.categories.some(category => 
          brand.categories.includes(category)
        )
      );
    }

    // Sorting
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        case 'count_high':
          return b.productCount - a.productCount;
        case 'count_low':
          return a.productCount - b.productCount;
        default:
          return 0;
      }
    });

    setFilteredBrands(result);
    setCurrentPage(1);
  }, [filters, brands, searchTerm]);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBrands = filteredBrands.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);

  const handleCategoryToggle = (category) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading brands...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
                  <span className="text-orange-600 font-medium">Brands</span>
                </div>
              </li>
            </ol>
          </nav>

          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              <FaTag className="inline mr-3 text-orange-600" />
              Toy Brands Collection
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore toys from the world's most trusted and beloved brands. 
              From educational toys to action figures, find the perfect brand for your child.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <FaStar className="text-orange-600 text-xl" />
              </div>
              <h3 className="font-semibold text-gray-900">Premium Brands</h3>
              <p className="text-sm text-gray-600">World's top toy manufacturers</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <FaTruck className="text-pink-600 text-xl" />
              </div>
              <h3 className="font-semibold text-gray-900">Genuine Products</h3>
              <p className="text-sm text-gray-600">100% authentic and safe</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <FaGift className="text-green-600 text-xl" />
              </div>
              <h3 className="font-semibold text-gray-900">Best Prices</h3>
              <p className="text-sm text-gray-600">Competitive prices with discounts</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <FaWhatsapp className="text-blue-600 text-xl" />
              </div>
              <h3 className="font-semibold text-gray-900">Brand Advice</h3>
              <p className="text-sm text-gray-600">Get recommendations from experts</p>
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
                    categories: [],
                    sortBy: 'name_asc'
                  })}
                  className="text-sm text-orange-600 hover:text-orange-700"
                >
                  Clear all
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-3">Search Brands</h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search brands..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
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
                        onChange={() => handleCategoryToggle(category)}
                        className="h-4 w-4 text-orange-600 rounded"
                      />
                      <span className="ml-2 text-gray-600">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
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

          {/* Brands Grid */}
          <div className="lg:col-span-3">
            {/* Sort and Results Info */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center">
                  <FaFilter className="mr-2 text-gray-500" />
                  <span className="text-gray-600">
                    {filteredBrands.length} brands found
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

            {/* Brands Grid */}
            {filteredBrands.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <FaTag className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No brands found
                </h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your filters or search term
                </p>
                <button
                  onClick={() => {
                    setFilters({ categories: [], sortBy: 'name_asc' });
                    setSearchTerm('');
                  }}
                  className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentBrands.map((brand) => (
                    <div key={brand.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden bg-gray-100">
                        <img
                          src={brand.image}
                          alt={brand.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        
                        {/* Featured Badge */}
                        {brand.featured && (
                          <div className="absolute top-3 left-3 bg-orange-600 text-white text-xs font-bold px-2 py-1 rounded">
                            Featured
                          </div>
                        )}
                        
                        {/* Discount Badge */}
                        {brand.discount && (
                          <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                            {brand.discount}
                          </div>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="p-5">
                        <h3 className="font-bold text-gray-900 text-xl mb-2">
                          {brand.name}
                        </h3>
                        
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {brand.description}
                        </p>
                        
                        {/* Categories */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {brand.categories.slice(0, 3).map((category, idx) => (
                            <span key={idx} className="px-2 py-1 bg-orange-50 text-orange-700 rounded text-xs">
                              {category}
                            </span>
                          ))}
                          {brand.categories.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                              +{brand.categories.length - 3} more
                            </span>
                          )}
                        </div>
                        
                        {/* Product Count */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-sm text-gray-500">
                            <span className="font-medium text-gray-700">{brand.productCount}+</span> products available
                          </div>
                        </div>
                        
                        {/* Action Button */}
                        <Link
                          to={`/brands/${brand.name.toLowerCase().replace(/\s+/g, '-')}`}
                          className="block w-full bg-orange-600 hover:bg-orange-700 text-white text-center py-3 rounded-lg transition-colors font-medium"
                        >
                          View Products
                        </Link>
                      </div>
                    </div>
                  ))}
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
                      Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredBrands.length)} of {filteredBrands.length} brands
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
                <h3 className="text-2xl font-bold">Need Brand Recommendations?</h3>
              </div>
              <p className="text-green-100">
                WhatsApp us on {contactInfo.whatsapp} for personalized brand recommendations based on age, interest, and budget!
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
        
        {/* Why Choose Our Brands */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Choose Our Brands?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaStar className="text-orange-600 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Authentic Products</h3>
              <p className="text-gray-600">We guarantee 100% genuine products from authorized distributors</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaGift className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Best Prices</h3>
              <p className="text-gray-600">Competitive pricing with regular discounts and offers</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTruck className="text-green-600 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Warranty Support</h3>
              <p className="text-gray-600">Full manufacturer warranty and customer support</p>
            </div>
          </div>
        </div>
        
        {/* Footer Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                <FaTag className="text-orange-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Brand Diversity</h3>
            </div>
            <p className="text-gray-600">
              We offer toys from over 50+ international and Indian brands, carefully 
              selected for quality, safety, and educational value.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <FaShoppingBag className="text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Bulk Orders</h3>
            </div>
            <p className="text-gray-600">
              Special discounts available for schools, institutions, and bulk orders. 
              Contact us for custom quotations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Brands;