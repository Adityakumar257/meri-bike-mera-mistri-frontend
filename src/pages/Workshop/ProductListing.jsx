import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../services/api';
import { FaArrowLeft, FaClock, FaUserGraduate, FaArrowRight, FaStar } from 'react-icons/fa';

const ProductListing = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [workshops, setWorkshops] = useState([]);
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Get Category Info
        const catRes = await axios.get(`${API_BASE_URL}/workshop-categories/${categoryId}`);
        setCategoryInfo(catRes.data.data);

        // 2. Get Workshops by Category
        const prodRes = await axios.get(`${API_BASE_URL}/workshops?category=${categoryId}&workshopType=Online`);
        
        console.log("Filtered Products:", prodRes.data.data); 
        setWorkshops(prodRes.data.data || []);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    if (categoryId) fetchData();
  }, [categoryId]);

  // Helper to get the correct image URL safely
  const getDisplayImage = (item) => {
      if (item.images && item.images.length > 0) {
          return item.images[0].url; 
      }
      if (item.image) {
          return item.image; 
      }
      return "https://via.placeholder.com/400x300?text=No+Image"; 
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Button */}
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 mb-6 hover:text-orange-600 transition">
          <FaArrowLeft className="mr-2" /> Back to Workshops
        </button>

        {/* Category Banner */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-10 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
           <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-orange-50 shadow-md flex-shrink-0 z-10">
              <img src={categoryInfo?.image || "https://via.placeholder.com/100"} className="w-full h-full object-cover" alt="" />
           </div>
           <div className="z-10 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-800">{categoryInfo?.name || 'Category'} Workshops</h1>
              <p className="text-gray-500 mt-2 max-w-2xl">{categoryInfo?.description || 'Explore our engaging online workshops designed to boost creativity and STEM skills.'}</p>
           </div>
        </div>

        {/* Grid - using same styles as PhysicalWorkshop */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading workshops...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {workshops.map(item => (
              <div 
                key={item._id}
                onClick={() => navigate(`/workshop/${item._id}`)}
                className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer h-[450px] flex flex-col relative"
              >
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={getDisplayImage(item)} 
                    alt={item.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Age Tag */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800 flex items-center shadow-sm">
                    <FaUserGraduate className="mr-1 text-orange-500" /> {item.ageGroup || '5-15'} Yrs
                  </div>
                  {/* Discount Tag */}
                  {item.discount > 0 && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                      {item.discount}% OFF
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Price and Stock Status */}
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-bold text-gray-900">₹{item.price}</span>
                          {item.originalPrice > item.price && (
                             <span className="text-xs text-gray-400 line-through">₹{item.originalPrice}</span>
                          )}
                        </div>
                        <span className={item.stockStatus === 'In Stock' ? "text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded" : "text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded"}>
                          {item.stockStatus || 'In Stock'}
                        </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-800 leading-tight mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    
                    <div className="flex items-center text-xs text-gray-500 mb-3 space-x-2">
                       <span className="flex items-center"><FaClock className="mr-1 text-orange-400"/> {item.duration || 'Flexible'}</span>
                       {/* Rating (Optional addition if data exists) */}
                       <span className="flex items-center"><FaStar className="mr-1 text-yellow-400"/> {item.rating || 4.5}</span>
                    </div>
                    
                    <p className="text-sm text-gray-500 line-clamp-2">{item.instructorName || 'Expert Instructor'}</p>
                  </div>

                  {/* View Details Button */}
                  <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-orange-600 font-semibold group-hover:text-orange-700 transition-colors">
                    <span className="text-md">View Details</span>
                    <button className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                      <FaArrowRight size={14}/>
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {workshops.length === 0 && (
                <div className="col-span-full py-16 text-center">
                    <div className="inline-block p-4 rounded-full bg-gray-100 mb-3">
                        <FaClock className="text-4xl text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-600">No Workshops Found</h3>
                    <p className="text-gray-500">Check back later for new online workshops in this category.</p>
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListing;