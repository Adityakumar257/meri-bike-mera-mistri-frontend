import React, { useState, useEffect } from 'react';
import { FaSpinner, FaArrowLeft, FaPlus, FaImage, FaEdit, FaTrash } from 'react-icons/fa';
// ✅ Import ProductService from centralized API
import { ProductService } from '../../../services/api';
import { useUser } from './context/UserContext.jsx';

const SpecialProducts = ({ 
    setActiveSection, setActiveForm, setEditingId, 
    setError, setSuccessMessage, 
    type, // The specific flag (e.g., 'isOpenEndedPlay', 'isPhysicalWorkshop')
    categoryType, // The Main Type (e.g., 'educational_toy', 'robotic_kit', 'book', 'workshop')
    title, icon 
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useUser();

  useEffect(() => { fetchSpecialProducts(); }, [type, categoryType]);

  const fetchSpecialProducts = async () => {
    setLoading(true);
    try {
      // ✅ Use ProductService.getAll with params
      const params = { type: categoryType };
      
      // If type is not 'all', we send it as a specialFilter to the backend
      if (type !== 'all') {
          params.specialFilter = type;
      }

      const response = await ProductService.getAll(params);

      if (response.data.success) {
          let allProducts = response.data.data || [];
          
          // ✅ Client-side safety filter:
          if (type !== 'all') {
             allProducts = allProducts.filter(p => 
                p[type] === true || p[type] === 'true'
             );
          }
          setProducts(allProducts);
      }
    } catch (error) { 
        console.error(error); 
        setError(`Failed to load ${title}`); 
    } finally { 
        setLoading(false); 
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      // ✅ Use ProductService.delete
      const response = await ProductService.delete(id);
      if (response.data.success) { setSuccessMessage('Deleted!'); fetchSpecialProducts(); }
    } catch (error) { setError('Failed to delete'); }
  };

  if (loading) return <div className="p-6 text-center"><FaSpinner className="animate-spin text-3xl inline text-blue-600" /> Loading {title}...</div>;

  return (
    <div className="p-6">
       <div className="flex justify-between items-center mb-8">
         <div className="flex items-center">
             <span className="bg-blue-100 p-3 rounded-xl mr-4 text-blue-600">{icon}</span>
             <div>
                <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
                <p className="text-gray-500 text-sm">Category: {categoryType.replace('_', ' ').toUpperCase()}</p>
             </div>
         </div>
         <div className="flex space-x-3">
            <button onClick={() => setActiveSection('products')} className="px-4 py-2 border rounded-lg flex items-center hover:bg-gray-50"><FaArrowLeft className="mr-2" /> Back</button>
            <button onClick={() => { setActiveForm(categoryType); setActiveSection('add-product'); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center hover:bg-blue-700 shadow-sm"><FaPlus className="mr-2" /> Add New {categoryType === 'educational_toy' ? 'Toy' : 'Item'}</button>
         </div>
       </div>

       {products.length === 0 ? (
         <div className="text-center p-12 bg-white border border-gray-200 rounded-xl shadow-sm">
             <div className="text-gray-300 text-6xl mb-4 flex justify-center">{icon}</div>
             <h3 className="text-xl font-medium text-gray-900">No {title} Found</h3>
             <p className="text-gray-500 mt-2 mb-6">No products found for this category and filter.</p>
             <button onClick={() => { setActiveForm(categoryType); setActiveSection('add-product'); }} className="mx-auto px-6 py-2 bg-blue-600 text-white rounded-lg flex items-center hover:bg-blue-700"><FaPlus className="mr-2" /> Add Product</button>
         </div>
       ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(p => (
               <div key={p.id || p._id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
                   <div className="relative h-48 bg-gray-100 group">
                       {p.images?.[0] ? <img src={p.images[0].url || p.images[0]} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" /> : <FaImage className="text-gray-300 text-4xl m-auto h-full block" />}
                       {/* Badge Logic */}
                       <div className="absolute top-2 right-2 flex flex-col gap-1">
                           {p.isNewArrival && <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full shadow-sm">New</span>}
                           {/* Show custom badge if filter is active */}
                           {type !== 'all' && type !== 'isNewArrival' && <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full shadow-sm">{title.split(' ')[0]}</span>}
                       </div>
                   </div>
                   <div className="p-4">
                       <h3 className="font-bold text-gray-800 truncate text-lg">{p.name}</h3>
                       <p className="text-sm text-gray-500 mb-3">{p.categoryName || 'General'}</p>
                       <div className="flex justify-between items-center">
                           <span className="text-lg font-bold text-gray-900">₹{p.price}</span>
                           <div className="flex gap-2">
                               <button onClick={() => { setEditingId(p.id || p._id); setActiveForm(p.type); setActiveSection('add-product'); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"><FaEdit /></button>
                               <button onClick={() => handleDelete(p.id || p._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-full"><FaTrash /></button>
                           </div>
                       </div>
                   </div>
               </div>
            ))}
         </div>
       )}
    </div>
  );
};

export default SpecialProducts;