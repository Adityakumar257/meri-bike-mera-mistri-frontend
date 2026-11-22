import React from 'react';
import { ShoppingCart, Star, Heart, ExternalLink, Package, ChevronLeft, ChevronRight, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { API_BASE_URL } from '../../services/api';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const RoboticsContent = ({ 
  currentItems = [], 
  totalItems = 0, 
  currentPage, 
  itemsPerPage, 
  totalPages, 
  paginate, 
  sortBy, 
  setSortBy, 
  setShowWishlistAlert 
}) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart, isInCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // Get auth token
  const getToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  const getKitId = (kit) => kit.id || kit._id;

  // Check if product is out of stock
  const isOutOfStock = (kit) => {
    return kit.stockStatus === 'Out of Stock' || 
           kit.stockStatus === 'out of stock' || 
           kit.inStock === false ||
           (kit.stockQuantity !== undefined && kit.stockQuantity <= 0);
  };

  // Add to Cart with Backend Integration
  const handleAddToCart = async (kit) => {
    try {
      const productId = getKitId(kit);
      
      // Prepare product data for cart
      const productData = {
        id: productId,
        name: kit.name || kit.title || 'Product',
        currentPrice: kit.currentPrice || kit.price || 0,
        originalPrice: kit.originalPrice || kit.price || 0,
        discount: kit.discount || 0,
        category: kit.categoryName || kit.category || '',
        brand: kit.brandName || kit.brand || '',
        image: kit.image || (kit.images && kit.images[0]?.url) || '',
        type: 'robotic_kit',
        ageGroup: kit.ageGroupName || kit.ageGroup || '',
        stockStatus: kit.stockStatus,
        inStock: kit.inStock !== false,
        quantity: 1
      };

      // Try to add to backend first if user is logged in
      const token = getToken();
      if (token) {
        try {
          await axios.post(`${API_BASE_URL}/cart/add`, {
            productId: productId,
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

      // Add to local cart context
      await addToCart(productData);
      
      // Show single success toast and redirect to cart
      const productName = kit.name || 'Product';
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
    }
  };

  // Handle Notify Me button click
  const handleNotifyMe = (kit) => {
    const productName = kit.name || 'Product';
    toast.success(`We will notify you when "${productName}" is back in stock!`, {
      duration: 3000,
      position: 'bottom-right'
    });
  };

  const handleWishlistToggle = (kit) => {
    const kitId = getKitId(kit);
    if (!isAuthenticated) {
      setShowWishlistAlert(true);
      setTimeout(() => setShowWishlistAlert(false), 3000);
      return;
    }

    if (isInWishlist(kitId)) {
      removeFromWishlist(kitId);
    } else {
      addToWishlist({
        id: kitId,
        name: kit.name,
        price: kit.price,
        currentPrice: kit.currentPrice,
        image: kit.image || (kit.images && kit.images[0]?.url),
      });
    }
  };

  // ✅ NEW: Handle Navigation with Title + 8 Random Chars
  const handleVisitNow = (e, kit) => {
    e.stopPropagation(); 
    const kitId = getKitId(kit);
    
    const randomSuffix = Math.random().toString(36).substring(2, 10);
    const slugTitle = kit.name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');   
      
    navigate(`/robotics-landing-page/${slugTitle}-${randomSuffix}`, { 
      state: { id: kitId } 
    }); 
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const minPagesToShow = 4;
  const displayPages = Math.max(totalPages, minPagesToShow);

  return (
    <div className="lg:w-3/4">
      {/* Sort & Count Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-gray-600 font-medium">Sort By:</span>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none text-sm text-gray-700 cursor-pointer hover:border-orange-400 transition-colors"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="mostRecent">Most Recent</option>
              <option value="priceLowHigh">Price: Low to High</option>
              <option value="priceHighLow">Price: High to Low</option>
              <option value="rating">Highest Rating</option>
            </select>
          </div>
          <div className="text-sm font-medium text-gray-500">
            Showing <span className="text-orange-600 font-bold">{totalItems > 0 ? `${startItem}–${endItem}` : 0}</span> of {totalItems} products
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {!currentItems || currentItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
             <Package className="text-gray-400 h-8 w-8" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No products found</h3>
          <p className="text-gray-500 mt-1">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentItems.map((kit) => {
            const kitId = getKitId(kit);
            const inCart = isInCart(kitId, 'robotic_kit');
            const inWishlist = isInWishlist(kitId);
            const displayImage = kit.image || (kit.images && kit.images[0]?.url) || 'https://via.placeholder.com/300';
            const price = kit.currentPrice || kit.price || 0;
            const originalPrice = kit.originalPrice || 0;
            const outOfStock = isOutOfStock(kit);
            
            // Dynamic Age Group
            const ageGroup = kit.ageGroupName || kit.ageGroup || '';
            const formattedAgeGroup = ageGroup ? `${ageGroup}` : 'All Ages';
            
            // Rating from database
            const rating = kit.rating || 0;
            const ratingCount = kit.ratingCount || 0;

            return (
              <div 
                key={kitId} 
                onClick={(e) => handleVisitNow(e, kit)}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-orange-200 transition-all duration-300 cursor-pointer flex flex-col h-full group"
              >
                {/* Image Area */}
                <div className="relative overflow-hidden h-52 bg-gray-50 p-4">
                  <img
                    src={displayImage}
                    alt={kit.name}
                    className="w-full h-full object-contain mix-blend-multiply transform group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWishlistToggle(kit);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-all duration-200 z-10 ${
                      inWishlist 
                        ? 'bg-red-50 text-red-500 hover:bg-red-100 scale-110' 
                        : 'bg-white text-gray-400 hover:text-red-500 hover:bg-red-50'
                    }`}
                    title="Wishlist"
                  >
                    <Heart className={`h-4 w-4 ${inWishlist ? 'fill-current' : ''}`} />
                  </button>

                  {/* Badges */}
                  {kit.discount > 0 && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm">
                      {kit.discount}% OFF
                    </div>
                  )}
                  {kit.isFeatured && (
                    <div className="absolute bottom-3 left-3 bg-orange-500 text-white px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm flex items-center gap-1">
                      <Star size={10} fill="currentColor" /> Featured
                    </div>
                  )}
                </div>

                {/* Details Area */}
                <div className="p-4 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md tracking-wider truncate max-w-[50%] capitalize">
                      {kit.categoryName || 'Robot'}
                    </span>
                    <div className="flex items-center bg-yellow-50 px-1.5 py-0.5 rounded-md">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span className="ml-1 text-xs font-bold text-yellow-700">{rating.toFixed(1)}</span>
                      <span className="text-[10px] text-gray-400 ml-1">({ratingCount})</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1 line-clamp-2 min-h-[2.5rem] group-hover:text-orange-600 transition-colors capitalize">
                    {kit.name}
                  </h3>
                  
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <span className="truncate max-w-[80px]">SKU: {kit.sku}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span className="truncate">{formattedAgeGroup}</span>
                  </div>

                  <div className="mt-auto pt-3 border-t border-dashed border-gray-100">
                    <div className="flex items-end justify-between mb-4">
                        <div className="flex flex-col">
                            {originalPrice > price && (
                                <span className="text-xs text-gray-400 line-through mb-0.5">₹{originalPrice.toLocaleString()}</span>
                            )}
                            <span className="text-lg font-extrabold text-gray-900 leading-none">₹{price.toLocaleString()}</span>
                        </div>
                        <div className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide ${
                            outOfStock 
                            ? 'bg-red-50 text-red-700 border border-red-100' 
                            : 'bg-green-50 text-green-700 border border-green-100'
                        }`}>
                            {outOfStock ? 'Out of Stock' : 'In Stock'}
                        </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={(e) => handleVisitNow(e, kit)}
                        className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-600 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 transition-all flex items-center justify-center gap-1.5 text-xs font-semibold"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Details
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(kit);
                        }}
                        className={`flex-1 py-2 rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 text-xs font-bold active:scale-95 ${
                          inCart 
                            ? 'bg-green-600 hover:bg-green-700 text-white shadow-green-200'
                            : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-orange-200'
                        }`}
                      >
                        <ShoppingCart className="h-3.5 w-3.5" />
                        {inCart ? 'Added' : 'Add'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-12 flex justify-center">
        <nav className="flex items-center gap-2 bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
          <button 
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            <ChevronLeft size={16} className="mr-1" /> Previous
          </button>

          <div className="flex items-center gap-1">
              {[...Array(displayPages)].map((_, index) => {
                  const pageNum = index + 1;
                  const isDisabled = pageNum > totalPages;

                  return (
                      <button
                          key={pageNum}
                          onClick={() => !isDisabled && paginate(pageNum)}
                          disabled={isDisabled}
                          className={`w-8 h-8 flex items-center justify-center text-sm font-bold rounded-lg transition-all ${
                              currentPage === pageNum 
                                  ? 'bg-orange-600 text-white shadow-md' 
                                  : isDisabled
                                    ? 'text-gray-300 cursor-not-allowed bg-gray-50'
                                    : 'text-gray-600 hover:bg-gray-100'
                          }`}
                      >
                          {pageNum}
                      </button>
                  );
              })}
          </div>

          <button 
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            Next <ChevronRight size={16} className="ml-1" />
          </button>
        </nav>
      </div>
    </div>
  );
};

export default RoboticsContent;