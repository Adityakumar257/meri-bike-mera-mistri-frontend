import React, { useState, useEffect } from 'react';
import { Heart, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { API_BASE_URL } from '../../services/api';
import RoboticsSidebar from './RoboticsSidebar'; 
import RoboticsContent from './RoboticsContent'; 

const Robotics = () => {
  const { isAuthenticated } = useAuth();
  const { wishlistItems } = useWishlist();
  
  const [roboticKits, setRoboticKits] = useState([]);
  const [filteredKits, setFilteredKits] = useState([]);
  
  // ✅ Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24; // 4 cards * 6 rows

  const [sortBy, setSortBy] = useState('mostRecent');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [showWishlistAlert, setShowWishlistAlert] = useState(false);

  const categories = [
    'All', 'Featured', 'New Arrivals', 'Educational Toys', 
    'Open Ended Play', 'Action Figures', 'Workshops for Kids'
  ];

  // 1. Fetching Data
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let params = { 
          type: 'robotic_kit',
          status: 'active',
          limit: 1000 // Fetch all valid items so client-side pagination works smoothly
        };

        // ... (Same Backend Filter Logic as before) ...
        if (selectedCategory === 'Featured') {
            params.isFeatured = true;
            delete params.type; 
        } else if (selectedCategory === 'New Arrivals') {
            params.isNewArrival = true;
            delete params.type;
        } else if (selectedCategory === 'Educational Toys') {
            params.isEducationalToy = true;
            delete params.type; 
        } else if (selectedCategory === 'Open Ended Play') {
            params.isOpenEndedPlay = true;
            delete params.type;
        } else if (selectedCategory === 'Action Figures') {
            params.isActionFigure = true;
            delete params.type;
        } else if (selectedCategory === 'Workshops for Kids') {
            params.isWorkshopForKids = true;
            delete params.type;
        }

        const response = await axios.get(`${API_BASE_URL}/products`, { params });

        if (response.data.success) {
          const mappedData = response.data.data.map(item => ({
            ...item,
            reviews: item.ratingCount || 0,
            sku: item.sku || item.id.substring(0, 8).toUpperCase()
          }));

          setRoboticKits(mappedData);
          setFilteredKits(mappedData);
        }
      } catch (error) {
        console.error("Error fetching robotics products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  // 2. Client-Side Filtering
  useEffect(() => {
    let filtered = [...roboticKits];

    // Reset Page to 1 if filters change
    setCurrentPage(1);

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(kit =>
        kit.name.toLowerCase().includes(term) ||
        (kit.description && kit.description.toLowerCase().includes(term)) ||
        (kit.categoryName && kit.categoryName.toLowerCase().includes(term))
      );
    }

    filtered = filtered.filter(kit =>
      (kit.currentPrice || kit.price) >= priceRange.min && 
      (kit.currentPrice || kit.price) <= priceRange.max
    );

    switch (sortBy) {
      case 'priceLowHigh':
        filtered.sort((a, b) => (a.currentPrice || a.price) - (b.currentPrice || b.price));
        break;
      case 'priceHighLow':
        filtered.sort((a, b) => (b.currentPrice || b.price) - (a.currentPrice || a.price));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'mostRecent':
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    setFilteredKits(filtered);
  }, [sortBy, priceRange, searchTerm, roboticKits]);

  // ✅ 3. Calculate Pagination Indices
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredKits.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredKits.length / itemsPerPage);

  const paginate = (pageNumber) => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setCurrentPage(pageNumber);
  };

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
              <p className="text-sm font-medium text-red-800">Please login to add items to wishlist</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
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

      {/* Main Layout Area */}
      <div className="max-w-[1600px] mx-auto pl-4 sm:pl-6 lg:pl-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          <RoboticsSidebar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            categories={categories}
            totalCount={filteredKits.length}
            isAuthenticated={isAuthenticated}
            wishlistCount={wishlistItems.length}
          />

          <RoboticsContent 
            currentItems={currentItems} // ✅ Passing sliced items
            totalItems={filteredKits.length}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalPages={totalPages}
            paginate={paginate}
            sortBy={sortBy}
            setSortBy={setSortBy}
            setShowWishlistAlert={setShowWishlistAlert}
          />

        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default Robotics;