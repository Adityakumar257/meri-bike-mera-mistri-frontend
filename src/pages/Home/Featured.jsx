import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../services/api';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch 5 Featured Products
        const response = await axios.get(`${API_BASE_URL}/products`, {
          params: { isFeatured: true, status: 'active', limit: 5 }
        });
        if (response.data.success) {
          setProducts(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching featured products:", error);
      }
    };
    fetchData();
  }, []);

  // Helper to generate dynamic URL (Name + 8 Random Chars)
  const generateSlug = (product) => {
    const randomSuffix = Math.random().toString(36).substring(2, 10);
    const slugName = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    return `/robotics-landing-page/${slugName}-${randomSuffix}`;
  };

  if (products.length === 0) return null;

  return (
    <div className="w-full bg-gradient-to-r from-purple-50 to-fuchsia-50 py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-8 md:mb-12">
          Featured Products
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 mb-10">
          {products.map((product, index) => (
            <Link 
              key={product.id || index}
              to="/category/all"
              state={{ id: product.id || product._id }}
              className="flex flex-col items-center p-5 md:p-6 bg-white rounded-2xl hover:shadow-2xl transition-all duration-300 group hover:-translate-y-3 border border-purple-100"
            >
              <div className="relative w-36 h-36 md:w-40 md:h-40 lg:w-44 lg:h-44 bg-gradient-to-br from-purple-50 to-fuchsia-50 rounded-full flex items-center justify-center mb-5 md:mb-6 group-hover:scale-105 transition-transform duration-300 border-8 border-purple-200 shadow-lg">
                <div className="w-28 h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 bg-white rounded-full overflow-hidden shadow-md">
                  <img 
                    src={product.image || (product.images && product.images[0]?.url) || 'https://via.placeholder.com/150'} 
                    alt={product.name} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="absolute -bottom-2 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Featured
                </div>
              </div>
              <span className="text-lg md:text-xl font-bold text-gray-800 text-center mt-2 line-clamp-1 capitalize">{product.name}</span>
              <span className="text-sm text-gray-600 mt-1 text-center">Explore Collection</span>
            </Link>
          ))}
        </div>

        {/* View More Button */}
        <div className="flex justify-center">
            <button 
                onClick={() => navigate('/category/all')}
                className="px-8 py-3 bg-purple-600 text-white font-bold rounded-full shadow-lg hover:bg-purple-700 hover:scale-105 transition-all duration-300"
            >
                View More Featured
            </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;