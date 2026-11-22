import React, { useState, useEffect } from 'react';
import { FaSpinner, FaArrowLeft, FaPlus, FaImage, FaEdit, FaTrash } from 'react-icons/fa';
// ✅ Import ProductService
import { ProductService } from '../../../services/api';
import { useUser } from './context/UserContext';

const NewArrivals = ({ setActiveSection, setActiveForm, setEditingId, setError, setSuccessMessage }) => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useUser();
  useEffect(() => { fetchNewArrivals(); }, []);

  const fetchNewArrivals = async () => {
    setLoading(true);
    try {
      const response = await ProductService.getNewArrivals();
      if (response.data.success) setNewArrivals(response.data.data || []);
    } catch (error) { console.error(error); setError('Failed to load new arrivals'); } 
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      const response = await ProductService.delete(id);
      if (response.data.success) { setSuccessMessage('Deleted!'); fetchNewArrivals(); }
    } catch (error) { setError('Failed to delete'); }
  };

  if (loading) return <div className="p-6 text-center"><FaSpinner className="animate-spin text-3xl inline" /> Loading...</div>;

  return (
    <div className="p-6">
       <div className="flex justify-between items-center mb-8">
         <div><h1 className="text-2xl font-bold text-gray-800">New Arrivals</h1></div>
         <div className="flex space-x-3">
            <button onClick={() => setActiveSection('products')} className="px-4 py-2 border rounded-lg flex items-center"><FaArrowLeft className="mr-2" /> Back</button>
            <button onClick={() => { setActiveForm('toy'); setActiveSection('add-product'); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center"><FaPlus className="mr-2" /> Add New</button>
         </div>
       </div>
       {newArrivals.length === 0 ? <div className="text-center p-12 bg-white border rounded-xl"><FaPlus className="text-gray-300 text-5xl mx-auto mb-4" /><h3>No new arrivals</h3></div> : 
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">{newArrivals.map(p => (
            <div key={p.id || p._id} className="bg-white border rounded-xl overflow-hidden hover:shadow-md">
                <div className="relative h-48 bg-gray-100">
                    {p.images?.[0] ? <img src={p.images[0].url || p.images[0]} alt={p.name} className="w-full h-full object-cover" /> : <FaImage className="text-gray-300 text-4xl m-auto h-full block" />}
                    <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">New</span>
                </div>
                <div className="p-4">
                    <h3 className="font-bold truncate">{p.name}</h3>
                    <div className="flex justify-between mt-2">
                        <span>₹{p.price}</span>
                        <div className="flex gap-2">
                            <button onClick={() => { setEditingId(p.id || p._id); setActiveForm(p.type); setActiveSection('add-product'); }} className="text-blue-600"><FaEdit /></button>
                            <button onClick={() => handleDelete(p.id || p._id)} className="text-red-600"><FaTrash /></button>
                        </div>
                    </div>
                </div>
            </div>
         ))}</div>
       }
    </div>
  );
};

export default NewArrivals;