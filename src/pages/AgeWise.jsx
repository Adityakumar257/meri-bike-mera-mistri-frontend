import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFilter, FaSortAmountDown, FaArrowLeft, FaArrowRight, 
  FaSearch, FaStar, FaShoppingBag, FaBaby,
  FaChild, FaGraduationCap, FaBrain, FaUsers, 
  FaHeart, FaLayerGroup, FaCheck, FaRupeeSign
} from 'react-icons/fa';

// Import Services
import { CategoryService, ProductService } from '../services/api'; 

const AgeWise = () => {
  // ==========================================
  // 1. STATE MANAGEMENT
  // ==========================================
  
  // Data States
  const [ageGroups, setAgeGroups] = useState([]); 
  const [products, setProducts] = useState([]); 
  const [selectedGroup, setSelectedGroup] = useState(null); 
  
  // Filter Data States (for Sidebar Options)
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableBrands, setAvailableBrands] = useState([]);

  // Selected Filters
  const [filterCategories, setFilterCategories] = useState([]);
  const [filterBrands, setFilterBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });
  
  // UI States
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination & Sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [sortBy, setSortBy] = useState('newest');

  // Static Config for Styling
  const styleConfig = {
    "0-2 Years": { icon: <FaBaby className="text-3xl" />, color: "bg-pink-100", textColor: "text-pink-600", image: "https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=0-2+Years" },
    "2-4 Years": { icon: <FaChild className="text-3xl" />, color: "bg-teal-100", textColor: "text-teal-600", image: "https://via.placeholder.com/400x300/4ECDC4/FFFFFF?text=2-4+Years" },
    "4-7 Years": { icon: <FaGraduationCap className="text-3xl" />, color: "bg-blue-100", textColor: "text-blue-600", image: "https://via.placeholder.com/400x300/45B7D1/FFFFFF?text=4-7+Years" },
    "7-12 Years": { icon: <FaBrain className="text-3xl" />, color: "bg-green-100", textColor: "text-green-600", image: "https://via.placeholder.com/400x300/96CEB4/FFFFFF?text=7-12+Years" },
    "Teens": { icon: <FaUsers className="text-3xl" />, color: "bg-yellow-100", textColor: "text-yellow-600", image: "https://via.placeholder.com/400x300/FECA57/FFFFFF?text=Teens" },
    "All Ages": { icon: <FaHeart className="text-3xl" />, color: "bg-purple-100", textColor: "text-purple-600", image: "https://via.placeholder.com/400x300/FF9FF3/FFFFFF?text=All+Ages" },
    "default": { icon: <FaLayerGroup className="text-3xl" />, color: "bg-gray-100", textColor: "text-gray-600", image: "https://via.placeholder.com/400x300/CCCCCC/FFFFFF?text=Toy" }
  };

  const sortOptions = [
    { value: 'newest', label: 'Newest Arrivals' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'name_asc', label: 'Name: A to Z' }
  ];

  // ==========================================
  // 2. INITIAL DATA FETCHING
  // ==========================================
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch Age Groups
        const ageRes = await CategoryService.getByType('age-group');
        if (ageRes.data && ageRes.data.data) {
          const mergedData = ageRes.data.data.map(group => {
            const style = styleConfig[group.name] || styleConfig['default'];
            return {
              ...group,
              ...style,
              image: group.image || style.image,
              development: ["Skill Development", "Creativity", "Learning"], 
              safety: "Safe non-toxic materials"
            };
          });
          setAgeGroups(mergedData);
        }

        // 2. Fetch Categories (for sidebar filter)
        const catRes = await CategoryService.getByType('category');
        if (catRes.data && catRes.data.data) {
          setAvailableCategories(catRes.data.data);
        }

        // 3. Fetch Brands (for sidebar filter)
        const brandRes = await CategoryService.getByType('brand');
        if (brandRes.data && brandRes.data.data) {
          setAvailableBrands(brandRes.data.data);
        }

      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // ==========================================
  // 3. HANDLERS
  // ==========================================
  const handleGroupSelect = async (group) => {
    setSelectedGroup(group);
    setLoadingProducts(true);
    setProducts([]);
    setCurrentPage(1);
    
    try {
      // Fetch ALL products for this age group so we can filter them on the client side
      const response = await ProductService.getAll({ 
        ageGroup: group._id,
        status: 'active',
        limit: 1000 // Ensure we get enough products to filter
      });

      // Handle different API response structures (data.products OR data.data)
      const fetchedProducts = response.data?.products || response.data?.data || [];
      setProducts(fetchedProducts);

    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoadingProducts(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackToGroups = () => {
    setSelectedGroup(null);
    setProducts([]);
    setSearchTerm('');
  };

  const toggleCategory = (id) => {
    const strId = String(id);
    setFilterCategories(prev => 
      prev.includes(strId) ? prev.filter(c => c !== strId) : [...prev, strId]
    );
    setCurrentPage(1);
  };

  const toggleBrand = (id) => {
    const strId = String(id);
    setFilterBrands(prev => 
      prev.includes(strId) ? prev.filter(b => b !== strId) : [...prev, strId]
    );
    setCurrentPage(1);
  };

  // ==========================================
  // 4. ROBUST FILTERING LOGIC
  // ==========================================
  
  // A. Filter Age Groups (Main View)
  const filteredAgeGroups = ageGroups.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (group.description && group.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // B. Filter Products (Product View)
  const filteredProducts = products.filter(product => {
    // 1. Search Term
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 2. Category Filter (Fixed: Forces String Comparison)
    let matchesCategory = true;
    if (filterCategories.length > 0) {
      // Check if product.category exists
      if (!product.category) {
        matchesCategory = false;
      } else {
        // Handle if category is an Object (populated) or a String (ID)
        const productCatId = String(product.category._id || product.category);
        matchesCategory = filterCategories.includes(productCatId);
      }
    }

    // 3. Brand Filter (Fixed: Forces String Comparison)
    let matchesBrand = true;
    if (filterBrands.length > 0) {
      if (!product.brand) {
        matchesBrand = false;
      } else {
         // Handle if brand is an Object (populated) or a String (ID)
        const productBrandId = String(product.brand._id || product.brand);
        matchesBrand = filterBrands.includes(productBrandId);
      }
    }

    // 4. Price Filter
    const price = Number(product.price) || 0;
    const matchesPrice = (price >= priceRange.min) && (price <= priceRange.max);

    return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price_low': return a.price - b.price;
      case 'price_high': return b.price - a.price;
      case 'name_asc': return a.name.localeCompare(b.name);
      default: return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  // Pagination Logic
  const itemsToPaginate = selectedGroup ? filteredProducts : filteredAgeGroups;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = itemsToPaginate.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(itemsToPaginate.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ==========================================
  // 5. RENDER
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
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
                <Link to="/" className="text-gray-700 hover:text-orange-600">Home</Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <button onClick={handleBackToGroups} className="text-gray-700 hover:text-orange-600">Age Wise</button>
                  {selectedGroup && (
                    <>
                      <span className="mx-2 text-gray-400">/</span>
                      <span className="text-orange-600 font-medium">{selectedGroup.name}</span>
                    </>
                  )}
                </div>
              </li>
            </ol>
          </nav>

          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {selectedGroup ? (
                <span className="flex items-center justify-center gap-3">
                  {selectedGroup.icon} {selectedGroup.name} Collection
                </span>
              ) : (
                <>
                  <FaChild className="inline mr-3 text-orange-600" />
                  Age Wise Selection
                </>
              )}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {selectedGroup 
                ? selectedGroup.description 
                : "Select an age group to browse tailored educational toys and games."}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* ================================================= */}
          {/* SIDEBAR (Filters: Category, Brand, Price, Search) */}
          {/* ================================================= */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <FaFilter className="mr-2" />
                  Filters
                </h2>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setFilterCategories([]);
                    setFilterBrands([]);
                    setPriceRange({ min: 0, max: 50000 });
                  }}
                  className="text-sm text-orange-600 hover:text-orange-700"
                >
                  Reset
                </button>
              </div>

              {/* 1. Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Toys</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>

              {/* 2. Price Range */}
              <div className="mb-6 pb-6 border-b border-gray-100">
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <FaRupeeSign className="mr-2 text-xs" /> Price Range
                </h3>
                <div className="flex items-center space-x-2">
                   <input 
                     type="number" 
                     value={priceRange.min}
                     onChange={(e) => setPriceRange({...priceRange, min: Number(e.target.value)})}
                     className="w-full border rounded px-2 py-1 text-sm"
                     placeholder="Min"
                   />
                   <span className="text-gray-400">-</span>
                   <input 
                     type="number" 
                     value={priceRange.max}
                     onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})}
                     className="w-full border rounded px-2 py-1 text-sm"
                     placeholder="Max"
                   />
                </div>
              </div>

              {/* 3. Categories Filter */}
              <div className="mb-6 pb-6 border-b border-gray-100">
                <h3 className="font-semibold text-gray-700 mb-3">Categories</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                  {availableCategories.length === 0 && <p className="text-xs text-gray-400">No categories loaded</p>}
                  {availableCategories.map((cat) => (
                    <label key={cat._id} className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          checked={filterCategories.includes(String(cat._id))}
                          onChange={() => toggleCategory(cat._id)}
                          className="peer h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                      </div>
                      <span className="ml-2 text-sm text-gray-600">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 4. Brands Filter */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-3">Brands</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                   {availableBrands.length === 0 && <p className="text-xs text-gray-400">No brands loaded</p>}
                   {availableBrands.map((brand) => (
                    <label key={brand._id} className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          checked={filterBrands.includes(String(brand._id))}
                          onChange={() => toggleBrand(brand._id)}
                          className="peer h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                      </div>
                      <span className="ml-2 text-sm text-gray-600">{brand.name}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* ================================================= */}
          {/* MAIN DISPLAY AREA */}
          {/* ================================================= */}
          <div className="lg:col-span-3">
            
            {/* Top Toolbar */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center">
                  {selectedGroup && (
                    <button 
                      onClick={handleBackToGroups} 
                      className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                      title="Back to all groups"
                    >
                      <FaArrowLeft className="text-gray-600" />
                    </button>
                  )}
                  <span className="text-gray-600 font-medium">
                    {itemsToPaginate.length} {selectedGroup ? 'products' : 'age groups'} found
                  </span>
                </div>
                
                {/* Sorting */}
                {selectedGroup && (
                  <div className="flex items-center">
                    <FaSortAmountDown className="mr-2 text-gray-500" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* ================= VIEW 1: AGE GROUP CARDS (No Group Selected) ================= */}
            {!selectedGroup && (
              <div className="space-y-6">
                {currentItems.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No age groups found matching your search.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {currentItems.map((group) => (
                      <div 
                        key={group._id} 
                        className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer border border-transparent hover:border-orange-200"
                        onClick={() => handleGroupSelect(group)}
                      >
                        <div className="md:flex h-full">
                          {/* Left Side - Icon/Color */}
                          <div className={`md:w-1/3 ${group.color} flex flex-col items-center justify-center p-6 text-center`}>
                            <div className={`${group.textColor} mb-3 transform scale-125`}>
                              {group.icon}
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">{group.name}</h3>
                          </div>
                          
                          {/* Right Side - Content */}
                          <div className="md:w-2/3 p-5 flex flex-col justify-between">
                            <div>
                              <p className="text-gray-600 mb-3 text-sm line-clamp-2">
                                {group.description || `Explore the best collection of toys for ${group.name}.`}
                              </p>
                              
                              {/* Development Areas */}
                              <div className="flex flex-wrap gap-2 mb-3">
                                {(group.development || ["Fun", "Learning"]).slice(0,3).map((area, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                    {area}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            <div className="mt-2 pt-3 border-t border-gray-100 flex justify-between items-center">
                                <span className="text-xs text-gray-500 italic">
                                  Safety: {group.safety || "Standard"}
                                </span>
                                <span className="text-orange-600 text-sm font-medium hover:underline flex items-center">
                                  View Products <FaArrowRight className="ml-1 text-xs" />
                                </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ================= VIEW 2: PRODUCT GRID (Group Selected) ================= */}
            {selectedGroup && (
              <div>
                {loadingProducts ? (
                   <div className="flex justify-center items-center py-20">
                     <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600"></div>
                   </div>
                ) : currentItems.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                    <FaShoppingBag className="text-6xl text-gray-200 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-500 mb-6">
                      {filterCategories.length > 0 || filterBrands.length > 0 
                        ? "Try adjusting your filters to see more results."
                        : "No products currently available in this age group."}
                    </p>
                    <button onClick={() => { setFilterCategories([]); setFilterBrands([]); }} className="text-orange-600 hover:underline">
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentItems.map((product) => (
                      <Link 
                        to={`/product/${product._id}`} 
                        key={product._id}
                        className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-100"
                      >
                        <div className="relative aspect-square overflow-hidden bg-gray-100">
                          {product.images && product.images.length > 0 ? (
                            <img 
                              src={product.images[0].url} 
                              alt={product.name}
                              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <FaShoppingBag className="text-4xl" />
                            </div>
                          )}
                          
                          {/* Discount Badge */}
                          {product.discount > 0 && (
                            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                              {product.discount}% OFF
                            </div>
                          )}
                        </div>

                        <div className="p-4">
                          <h3 className="text-gray-900 font-semibold line-clamp-1 mb-1 group-hover:text-orange-600 transition-colors">
                            {product.name}
                          </h3>
                          <div className="flex items-center mb-2">
                             <div className="flex text-yellow-400 text-xs">
                               {[...Array(5)].map((_, i) => (
                                 <FaStar key={i} className={i < (product.rating || 0) ? "fill-current" : "text-gray-200"} />
                               ))}
                             </div>
                             <span className="text-xs text-gray-400 ml-1">({product.ratingCount || 0})</span>
                          </div>
                          
                          <div className="flex items-end justify-between">
                            <div>
                              <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                              {product.originalPrice > product.price && (
                                <span className="ml-2 text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
                              )}
                            </div>
                            <button className="text-orange-600 bg-orange-50 p-2 rounded-full hover:bg-orange-600 hover:text-white transition-colors">
                               <FaShoppingBag />
                            </button>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-8">
                <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
                  <div className="-mt-px flex w-0 flex-1">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium ${
                        currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <FaArrowLeft className="mr-3 h-5 w-5" />
                      Previous
                    </button>
                  </div>
                  
                  <div className="hidden md:-mt-px md:flex">
                    <span className="inline-flex items-center border-t-2 border-orange-500 px-4 pt-4 text-sm font-medium text-orange-600">
                      Page {currentPage} of {totalPages}
                    </span>
                  </div>

                  <div className="-mt-px flex w-0 flex-1 justify-end">
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium ${
                        currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Next
                      <FaArrowRight className="ml-3 h-5 w-5" />
                    </button>
                  </div>
                </nav>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default AgeWise;