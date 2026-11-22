import React, { useState } from 'react';
import { FaArrowLeft, FaSpinner, FaSearch, FaFilter, FaTimes, FaPlus, FaImage } from 'react-icons/fa';
// ✅ Import ProductService from centralized API
import { ProductService } from '../../../services/api';

const ProductSearch = ({ setActiveSection, setActiveForm, setEditingId, setError }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ minPrice: '', maxPrice: '', type: 'all', status: 'all' });

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {

      const params = {
          search: searchQuery,
          ...(filters.minPrice && { minPrice: filters.minPrice }),
          ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
          ...(filters.type !== 'all' && { type: filters.type }),
          ...(filters.status !== 'all' && { status: filters.status })
      };

      
      const response = await ProductService.getAll(params);
      
      if (response.data.success) {
          // Adjust based on your API response structure (data.products or just data)
          setSearchResults(response.data.data?.products || response.data.data || []);
      }
    } catch (error) { console.error(error); setError('Failed to search'); } 
    finally { setSearching(false); }
  };

  return (
    <div className="p-6">
        <div className="mb-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Search Products</h1>
            <button onClick={() => setActiveSection('products')} className="px-4 py-2 border rounded-lg flex items-center"><FaArrowLeft className="mr-2" /> Back</button>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <form onSubmit={handleSearch}>
                <div className="flex">
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search name, tags..." className="w-full px-4 py-3 border rounded-l-lg" />
                    <button type="submit" disabled={searching} className="px-6 py-3 bg-blue-600 text-white rounded-r-lg">{searching ? <FaSpinner className="animate-spin" /> : 'Search'}</button>
                </div>
                <div className="mt-4"><button type="button" onClick={() => setShowFilters(!showFilters)} className="text-blue-600 flex items-center"><FaFilter className="mr-2" /> {showFilters ? 'Hide Filters' : 'Show Filters'}</button></div>
                {showFilters && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded">
                         <input type="number" placeholder="Min Price" value={filters.minPrice} onChange={e => setFilters({...filters, minPrice: e.target.value})} className="border p-2 rounded" />
                         <input type="number" placeholder="Max Price" value={filters.maxPrice} onChange={e => setFilters({...filters, maxPrice: e.target.value})} className="border p-2 rounded" />
                         <select value={filters.type} onChange={e => setFilters({...filters, type: e.target.value})} className="border p-2 rounded"><option value="all">All Types</option><option value="toy">Toys</option></select>
                         <button type="button" onClick={() => setFilters({ minPrice: '', maxPrice: '', type: 'all', status: 'all' })} className="border p-2 bg-white rounded">Clear</button>
                    </div>
                )}
            </form>
        </div>
        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {searchResults.map(p => (
                <div key={p.id || p._id} className="bg-white border rounded-xl overflow-hidden shadow-sm">
                    <div className="h-48 bg-gray-100 relative">{p.images?.[0] ? <img src={p.images[0].url || p.images[0]} alt={p.name} className="w-full h-full object-cover" /> : <FaImage className="text-gray-300 text-3xl m-auto h-full block" />}</div>
                    <div className="p-4"><h3 className="font-bold">{p.name}</h3><p>₹{p.price}</p><button onClick={() => { setEditingId(p.id || p._id); setActiveForm(p.type); setActiveSection('add-product'); }} className="text-blue-600 mt-2 text-sm">Edit</button></div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default ProductSearch;