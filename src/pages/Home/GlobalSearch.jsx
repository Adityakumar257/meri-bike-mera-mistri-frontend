import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { allSearchableProducts } from '../../data/homeData';

const GlobalSearch = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Close suggestions if clicked outside
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 0) {
      const filtered = allSearchableProducts.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase()) || 
        item.category.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 6)); // Limit to 6 suggestions
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectProduct = (product) => {
    setQuery('');
    setShowSuggestions(false);
    // Redirect to the product's section link 
    // You can pass specific state if you want to scroll to ID, 
    // but for now, we redirect to the page defined in data
    navigate(product.link); 
  };

  return (
    <div className="relative w-full max-w-md mx-auto" ref={searchRef}>
      <div className="relative flex items-center bg-gray-100 rounded-full px-4 py-2 border border-transparent focus-within:border-orange-500 focus-within:bg-white transition-all">
        <Search className="w-5 h-5 text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Search for Robotic kits, Nerf..."
          className="bg-transparent border-none outline-none w-full text-gray-700 placeholder-gray-500 text-sm"
          value={query}
          onChange={handleSearch}
          onFocus={() => query.length > 0 && setShowSuggestions(true)}
        />
        {query && (
          <button onClick={() => { setQuery(''); setShowSuggestions(false); }}>
            <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
          <div className="p-2">
            <div className="text-xs font-semibold text-gray-400 px-3 py-1 uppercase">Suggested Products</div>
            {suggestions.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelectProduct(item)}
                className="flex items-center gap-3 p-2 hover:bg-orange-50 rounded-lg cursor-pointer transition-colors"
              >
                <img src={item.img} alt={item.name} className="w-10 h-10 rounded-md object-cover" />
                <div>
                  <div className="text-sm font-medium text-gray-800">{item.name}</div>
                  <div className="text-xs text-gray-500">{item.category}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {showSuggestions && query.length > 0 && suggestions.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl p-4 text-center text-gray-500 z-50">
          No products found.
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;