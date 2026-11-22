import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ProductService } from '../../services/api';

const RoboticKits = () => {
  const [kits, setKits] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ProductService.getAll({
          type: 'robotic_kit',
          status: 'active',
          sortBy: 'createdAt',
          sortOrder: 'desc',
          limit: 12
        });
        if (response.data.success) {
          setKits(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching robotic kits:", error);
      }
    };
    fetchData();
  }, []);

  const generateSlug = (product) => {
    const randomSuffix = Math.random().toString(36).substring(2, 10);
    const slugName = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    return `/robotics-landing-page/${slugName}-${randomSuffix}`;
  };

  if (kits.length === 0) return null;

  return (
    <div className="w-full bg-gradient-to-r from-orange-50 to-amber-50 py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-8 md:mb-12">
          Latest Robotic Kits
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 mb-10">
          {kits.map((kit, index) => (
            <Link 
              key={kit.id || index}
              to={generateSlug(kit)} 
              state={{ id: kit.id || kit._id }} 
              className="flex flex-col items-center p-5 md:p-6 bg-white rounded-2xl hover:shadow-2xl transition-all duration-300 group hover:-translate-y-3 border border-orange-100"
            >
              <div className="relative w-36 h-36 md:w-40 md:h-40 lg:w-44 lg:h-44 bg-gradient-to-br from-orange-50 to-amber-50 rounded-full flex items-center justify-center mb-5 md:mb-6 group-hover:scale-105 transition-transform duration-300 border-8 border-orange-200 shadow-lg">
                <div className="w-28 h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 bg-white rounded-full overflow-hidden shadow-md">
                  <img 
                    src={kit.image || (kit.images && kit.images[0]?.url) || 'https://via.placeholder.com/150'} 
                    alt={kit.name} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="absolute -bottom-2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  New Arrival
                </div>
              </div>
              <span className="text-lg md:text-xl font-bold text-gray-800 text-center mt-2 line-clamp-1 capitalize">{kit.name}</span>
              
              <div className="mt-2 flex items-center gap-2">
                 <span className="text-lg font-bold text-orange-600">₹{Math.floor(kit.price)}</span>
                 {kit.originalPrice > kit.price && (
                    <span className="text-sm text-gray-400 line-through">₹{Math.floor(kit.originalPrice)}</span>
                 )}
              </div>

              <span className="text-sm text-gray-500 mt-1 text-center line-clamp-2 px-2">
                {kit.description || "Explore the world of robotics"}
              </span>
            </Link>
          ))}
        </div>

        <div className="flex justify-center">
            <button 
                onClick={() => navigate('/robotics')}
                className="px-8 py-3 bg-orange-600 text-white font-bold rounded-full shadow-lg hover:bg-orange-700 hover:scale-105 transition-all duration-300"
            >
                View All Robotics
            </button>
        </div>
      </div>
    </div>
  );
};

export default RoboticKits;