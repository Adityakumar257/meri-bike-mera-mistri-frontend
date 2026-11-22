import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../services/api';
import { FaClock, FaUserGraduate, FaArrowRight } from 'react-icons/fa';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Static Slider Images
const randomImages = [
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=1600&q=80"
];

const Workshop = () => {
  const navigate = useNavigate();

  const [physicalWorkshops, setPhysicalWorkshops] = useState([]);
  const [creativeWorkshops, setCreativeWorkshops] = useState([]);
  const [onlineCategories, setOnlineCategories] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch Physical Workshops
        // ✅ FIX: Using 'type' query param assuming backend logic: if (type) query.workshopType = type;
        // If your backend uses 'workshopType' specifically, change 'type' to 'workshopType' below.
        const physRes = await axios.get(`${API_BASE_URL}/workshops?type=Physical`);
        // Double check filtering on frontend to be safe
        const physData = (physRes.data.data || []).filter(item => item.workshopType === 'Physical');
        setPhysicalWorkshops(physData);

        // 2. Fetch Creative Workshops
        const creatRes = await axios.get(`${API_BASE_URL}/workshops?type=Creative`);
        const creatData = (creatRes.data.data || []).filter(item => item.workshopType === 'Creative');
        setCreativeWorkshops(creatData);

        // 3. Fetch CATEGORIES for Online Section
        const catRes = await axios.get(`${API_BASE_URL}/workshop-categories?isActive=true`);
        setOnlineCategories(catRes.data.data || []);

      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const sliderSettings = {
    dots: true, infinite: true, speed: 800, slidesToShow: 1, slidesToScroll: 1, autoplay: true, autoplaySpeed: 4000, fade: true
  };

  // Helper to get correct image
  const getDisplayImage = (item) => {
      if (item.images && item.images.length > 0) {
          return item.images[0].url; 
      }
      if (item.image) {
          return item.image; 
      }
      return "https://via.placeholder.com/400x300?text=No+Image"; 
  };

  // ✅ Reusable Workshop Card Component (UPDATED LAYOUT)
  const WorkshopCard = ({ item }) => (
    <div 
      onClick={() => navigate(`/workshop/${item._id}`)}
      className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer h-[450px] flex flex-col relative"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={getDisplayImage(item)} 
          alt={item.title} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800 flex items-center shadow-sm">
          <FaUserGraduate className="mr-1 text-orange-500" /> {item.ageGroup || '5-15'} Yrs
        </div>
        {item.discount > 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
            {item.discount}% OFF
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* ✅ PRICE MOVED TO TOP */}
          <div className="flex items-center justify-between mb-2">
             <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-gray-900">₹{item.price}</span>
                <span className="text-xs text-gray-400 line-through">₹{item.originalPrice}</span>
             </div>
             <span className={item.stockStatus === 'In Stock' ? "text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded" : "text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded"}>
                {item.stockStatus}
             </span>
          </div>

          <h3 className="text-lg font-bold text-gray-800 leading-tight mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
            {item.title}
          </h3>
          
          <div className="flex items-center text-xs text-gray-500 mb-3 space-x-2">
             {/* <span className="flex items-center"><FaClock className="mr-1 text-orange-400"/> {item.duration || '2 Hrs'}</span> */}
             {/* <span>•</span> */}
             <span>{item.ageGroup}</span>
          </div>
          
          
          <p className="text-sm text-gray-500 line-clamp-2">{item.instructorName}</p>
        </div>

        {/* ✅ VIEW DETAILS MOVED TO BOTTOM */}
        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-orange-600 font-semibold group-hover:text-orange-700 transition-colors">
          <span className="text-md">View Details</span>
          <button className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
            <FaArrowRight size={14}/>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-20">
      
      {/* 1. HERO SLIDER */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <Slider {...sliderSettings}>
          {randomImages.map((img, i) => (
            <div key={i} className="relative h-[50vh] md:h-[60vh]">
              <img src={img} className="w-full h-full object-cover" alt="Hero" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="text-center text-white p-4">
                  <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">Learn by Doing</h1>
                  <p className="text-lg md:text-xl font-light">Explore Science, Robotics & Creativity</p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 2. PHYSICAL WORKSHOPS */}
        <section className="py-16">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Physical Workshops</h2>
              <p className="text-gray-500 mt-1">Hands-on offline learning experiences</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {physicalWorkshops.map((item) => (
              <WorkshopCard key={item._id} item={item} />
            ))}
            {physicalWorkshops.length === 0 && <p className="text-gray-500 col-span-full text-center">No physical workshops found.</p>}
          </div>
        </section>

        {/* 3. ONLINE WORKSHOPS (CATEGORIES) */}
        <section className="py-16 bg-white rounded-3xl shadow-sm border border-gray-100 px-8 my-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-purple-500"></div>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Online Learning Paths</h2>
            <p className="text-gray-500 mt-2">Choose a category to start your journey from home</p>
          </div>

          <div className="flex flex-wrap justify-center gap-10 md:gap-16">
            {onlineCategories.map((cat) => (
              <div 
                key={cat._id} 
                onClick={() => navigate(`/workshop/category/${cat._id}`)}
                className="group flex flex-col items-center cursor-pointer"
              >
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-tr from-blue-400 to-purple-500 group-hover:scale-105 transition-transform duration-300 shadow-lg">
                  <div className="w-full h-full rounded-full border-4 border-white overflow-hidden bg-white">
                    <img 
                      src={cat.image || "https://via.placeholder.com/150"} 
                      alt={cat.name} 
                      className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                    />
                  </div>
                </div>
                <h3 className="mt-4 text-lg font-bold text-gray-800 group-hover:text-purple-600 transition-colors">{cat.name}</h3>
              </div>
            ))}
            {onlineCategories.length === 0 && <p className="text-gray-400">Loading Categories...</p>}
          </div>
        </section>

        {/* 4. CREATIVE WORKSHOPS */}
        <section className="py-16">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Creative & Arts</h2>
              <p className="text-gray-500 mt-1">Unleash your imagination</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {creativeWorkshops.map((item) => (
              <WorkshopCard key={item._id} item={item} />
            ))}
            {creativeWorkshops.length === 0 && <p className="text-gray-500 col-span-full text-center">No creative workshops found.</p>}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Workshop;