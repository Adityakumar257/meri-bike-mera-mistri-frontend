import React, { useState, useEffect } from 'react';
import { FaSpinner, FaArrowLeft, FaPlus, FaStar, FaImage, FaUser, FaEdit, FaTrash } from 'react-icons/fa';
// ✅ Import ProductService from centralized API
import { ProductService } from '../../../services/api';
import { useUser } from './context/UserContext.jsx';

const FeaturedProducts = ({ setActiveSection, setActiveForm, setEditingId, setError, setSuccessMessage }) => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useUser();
  useEffect(() => { fetchFeaturedProducts(); }, []);
  const fetchFeaturedProducts = async () => {
    setLoading(true);
    try {
      const response = await ProductService.getFeatured();
      if (response.data.success) setFeaturedProducts(response.data.data || []);
    } catch (error) { 
      console.error(error); 
      setError('Failed to load featured products'); 
    } 
    finally { setLoading(false); }
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this featured product?')) return;
    try {
      const response = await ProductService.delete(id);
      if (response.data.success) { 
        setSuccessMessage('Product deleted successfully!'); 
        fetchFeaturedProducts(); 
        setTimeout(() => setSuccessMessage(''), 3000); 
      }
    } catch (error) { 
      setError(error.message || 'Failed to delete product'); 
    }
  };

  if (loading) return <div className="p-6"><div className="flex items-center justify-center h-64"><FaSpinner className="animate-spin text-3xl text-blue-600 mr-3" /><span className="text-lg text-gray-600">Loading featured products...</span></div></div>;

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div><h1 className="text-2xl font-bold text-gray-800">Featured Products</h1><p className="text-gray-600 mt-1">Browse our specially curated featured products</p></div>
          <div className="flex space-x-3">
            <button onClick={() => setActiveSection('products')} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"><FaArrowLeft className="mr-2" /> Back to All Products</button>
            <button onClick={() => { setActiveForm('toy'); setActiveSection('add-product'); }} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 flex items-center"><FaPlus className="mr-2" /> Add Featured</button>
          </div>
        </div>
        {featuredProducts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center"><FaStar className="text-gray-300 text-5xl mx-auto mb-4" /><h3 className="text-xl font-medium text-gray-900 mb-2">No featured products found</h3><p className="text-gray-500 mb-6">No products have been marked as featured yet</p><button onClick={() => { setActiveForm('toy'); setActiveSection('add-product'); }} className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 flex items-center mx-auto shadow-sm"><FaPlus className="mr-2" /> Add Featured Product</button></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div key={product.id || product._id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden">
                <div className="relative h-48 bg-gray-100">
                  {product.images && product.images[0] ? <img src={product.images[0].url || product.images[0]} alt={product.name} className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200'; }} /> : <div className="w-full h-full flex items-center justify-center"><FaImage className="text-gray-300 text-4xl" /></div>}
                  <div className="absolute top-3 left-3"><span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">Featured</span></div>
                  {product.isNewArrival && <div className="absolute top-3 right-3"><span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">New</span></div>}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{product.categoryName || product.category?.name || 'Uncategorized'}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div><span className="font-bold text-gray-900">₹{product.price?.toFixed(2)}</span>{product.discount > 0 && <span className="ml-2 text-xs text-green-600">{product.discount}% off</span>}</div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${product.type === 'toy' ? 'bg-green-100 text-green-800' : product.type === 'book' ? 'bg-purple-100 text-purple-800' : 'bg-yellow-100 text-yellow-800'}`}>{product.type?.charAt(0).toUpperCase() + product.type?.slice(1)}</span>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="text-xs text-gray-500"><FaUser className="inline mr-1" size={10} />{product.createdByName || product.createdBy || 'Unknown'}</div>
                    <div className="flex space-x-2"><button onClick={() => { setEditingId(product.id || product._id); setActiveForm(product.type || 'toy'); setActiveSection('add-product'); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit"><FaEdit size={14} /></button><button onClick={() => handleDelete(product.id || product._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete"><FaTrash size={14} /></button></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedProducts;