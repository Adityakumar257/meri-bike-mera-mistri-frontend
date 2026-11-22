import React, { useState } from 'react';
import { Filter, Search, User, Heart, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RoboticsSidebar = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  categories, // kept for prop compatibility, but we use fixed list below
  totalCount,
  isAuthenticated,
  wishlistCount
}) => {
  const navigate = useNavigate();

  // ✅ Defined specific categories for Robotics Sidebar as requested
  const sidebarCategories = ["Robotic Kits", "New Arrival"];

  return (
    // ✅ Width 1/5 (20%) on large screens
    <div className="lg:w-1/5 space-y-4">
      
      {/* Search */}
      <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Categories - Specific List */}
      <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
        <h3 className="font-bold text-sm text-gray-800 mb-3 uppercase tracking-wide">Categories</h3>
        <div className="space-y-1">
          {sidebarCategories.map((category) => (
            <button
              key={category}
              className={`block w-full text-left px-2 py-1.5 text-sm rounded transition-colors ${
                selectedCategory === category 
                  ? 'bg-orange-50 text-orange-600 font-medium border-l-2 border-orange-500' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range - Compact */}
      <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
        <h3 className="font-bold text-sm text-gray-800 mb-3 uppercase tracking-wide">Price Range</h3>
        <div className="space-y-3">
          <div className="flex gap-2 items-center">
            <div className="flex-1">
              <input
                type="number"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) || 0 })}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:border-orange-500 outline-none"
                placeholder="Min"
              />
            </div>
            <span className="text-gray-400">-</span>
            <div className="flex-1">
              <input
                type="number"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) || 50000 })}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:border-orange-500 outline-none"
                placeholder="Max"
              />
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="50000"
            step="100"
            value={priceRange.max}
            onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
          <div className="text-xs text-gray-500 text-right">
            Up to ₹{priceRange.max.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Stats - Compact */}
      <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 text-gray-600 mb-2 text-sm">
          <Filter className="h-4 w-4" />
          <span className="font-medium">{totalCount} Results</span>
        </div>
        
        {!isAuthenticated && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mt-2">
            <div className="flex items-start gap-2">
              <User className="h-4 w-4 text-yellow-600 mt-0.5" />
              <span className="text-xs text-yellow-700 leading-tight">Login to use wishlist</span>
            </div>
          </div>
        )}

        {isAuthenticated && (
          <div className="bg-green-50 border border-green-200 rounded p-2 mt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                <span className="text-xs font-medium text-green-700">Wishlist: {wishlistCount}</span>
              </div>
              <button
                onClick={() => navigate('/wishlist')}
                className="text-xs text-green-700 hover:underline font-bold"
              >
                View
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoboticsSidebar;