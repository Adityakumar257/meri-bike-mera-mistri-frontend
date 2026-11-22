import React, { useState, useEffect } from 'react';
import { 
  FaSave, FaSpinner, FaTimes, FaCamera, FaTag, FaPercent, 
  FaDollarSign, FaChalkboardTeacher, FaLaptopHouse, FaUsers,
  FaLayerGroup, FaTrash, FaEdit, FaPlus, FaChild, FaUserGraduate,
  FaEye
} from 'react-icons/fa';
// ✅ Import Services
import { WorkshopService, WorkshopCategoryService, EnrollmentService } from '../../../services/api';

const WorkshopManager = () => { 
  // ❌ Removed API_BASE_URL prop (handled in api.js)
  
  const [activeTab, setActiveTab] = useState('view-workshops'); 
  const [editingId, setEditingId] = useState(null);
  
  // State for editing category
  const [editingCategory, setEditingCategory] = useState(null);
  
  // ✅ NEW: State for Enrollments
  const [enrollments, setEnrollments] = useState([]);
  const [viewEnrollment, setViewEnrollment] = useState(null); // For View Modal
  const [editEnrollment, setEditEnrollment] = useState(null); // For Edit Modal

  const [loading, setLoading] = useState(false);
  const [workshops, setWorkshops] = useState([]);
  const [categories, setCategories] = useState([]);

  // --- FETCH DATA ---
  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'view-workshops') {
        // ✅ Use WorkshopService
        const res = await WorkshopService.getAll();
        setWorkshops(res.data.data || []);
      } else if (activeTab === 'view-enrollments') { 
        // ✅ Use EnrollmentService
        const res = await EnrollmentService.getAll();
        setEnrollments(res.data.data || []);
      }
      
      // Always fetch categories to ensure dropdowns and lists are up to date
      // ✅ Use WorkshopCategoryService
      const catRes = await WorkshopCategoryService.getAll(); 
      setCategories(catRes.data.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // --- DELETE HANDLER ---
  const handleDelete = async (id, type) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      if (type === 'workshop') {
          await WorkshopService.delete(id);
      } else if (type === 'category') {
          await WorkshopCategoryService.delete(id);
      } else if (type === 'enrollment') {
          await EnrollmentService.delete(id);
      }

      fetchData();
      alert(`${type} deleted successfully`);
    } catch (err) {
      alert("Delete failed: " + (err.message || "Unknown error"));
    }
  };

  // --- EDIT HANDLER (WORKSHOP) ---
  const handleEdit = (id) => {
    setEditingId(id);
    setActiveTab('add-workshop');
  };

  // --- EDIT HANDLER (CATEGORY) ---
  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setActiveTab('add-category');
  };

  // --- ✅ HANDLE UPDATE ENROLLMENT ---
  const handleUpdateEnrollment = async (e) => {
    e.preventDefault();
    try {
        // ✅ Use EnrollmentService
        await EnrollmentService.update(editEnrollment._id, editEnrollment);
        alert('Enrollment Updated Successfully');
        setEditEnrollment(null);
        fetchData();
    } catch (err) {
        alert("Update failed: " + (err.message || "Unknown error"));
    }
  };
  const AddWorkshopForm = () => {
    const [formData, setFormData] = useState({
        title: '', description: '', workshopType: 'Online', category: '', 
        categoryName: '', instructorName: '', ageGroup: '', price: '', 
        discount: '0', originalPrice: '', currentPrice: '', stockQuantity: '0', 
        stockStatus: 'In Stock', tags: '', status: 'active'
    });

    const [existingImages, setExistingImages] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [newPreviews, setNewPreviews] = useState([]);
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        if (editingId) {
            const fetchDetails = async () => {
                try {
                    // ✅ Use WorkshopService
                    const res = await WorkshopService.getById(editingId);
                    const data = res.data.data;
                    const catId = data.category && typeof data.category === 'object' ? data.category._id : data.category;
                    
                    setFormData({ 
                        ...formData, 
                        title: data.title, description: data.description, workshopType: data.workshopType || 'Online',
                        category: catId || '', instructorName: data.instructorName || '', ageGroup: data.ageGroup || '', 
                        price: data.price, discount: data.discount, originalPrice: data.originalPrice, currentPrice: data.currentPrice,
                        stockQuantity: data.stockQuantity, stockStatus: data.stockStatus, status: data.status,
                        tags: Array.isArray(data.tags) ? data.tags.join(', ') : data.tags || '' 
                    });

                    if (data.images && data.images.length > 0) {
                        setExistingImages(data.images);
                    }
                } catch (err) { console.error(err); }
            };
            fetchDetails();
        }
    }, [editingId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'discount' || name === 'price') {
            const price = name === 'price' ? parseFloat(value) || 0 : parseFloat(formData.price) || 0;
            const discount = name === 'discount' ? parseFloat(value) || 0 : parseFloat(formData.discount) || 0;
            const currentPrice = discount > 0 ? price * (1 - discount / 100) : price;
            setFormData(prev => ({ ...prev, [name]: value, originalPrice: price, currentPrice: currentPrice.toFixed(2) }));
        } else if (name === 'workshopType') {
             setFormData(prev => ({ ...prev, workshopType: value, category: value !== 'Online' ? '' : prev.category }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setSelectedFiles(prev => [...prev, ...files]);
            const previews = files.map(file => URL.createObjectURL(file));
            setNewPreviews(prev => [...prev, ...previews]);
        }
        e.target.value = null; 
    };

    const removeNewImage = (index) => {
        setNewPreviews(prev => prev.filter((_, i) => i !== index));
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => data.append(key, formData[key]));
            selectedFiles.forEach(file => { data.append('images', file); });

            // ✅ Use WorkshopService
            if (editingId) await WorkshopService.update(editingId, data);
            else await WorkshopService.create(data);

            alert(editingId ? 'Workshop Updated!' : 'Workshop Created!');
            setEditingId(null);
            setActiveTab('view-workshops');
            fetchData();
        } catch (err) {
            alert('Failed to save: ' + (err.message || "Unknown error"));
        } finally {
            setFormLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{editingId ? 'Edit Workshop' : 'Add New Workshop'}</h2>
                <button type="button" onClick={() => { setActiveTab('view-workshops'); setEditingId(null); }} className="text-gray-600 hover:text-gray-900 flex items-center">
                   <FaTimes className="mr-2"/> Cancel
                </button>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-6 pb-4 border-b">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Workshop Title *</label><input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Details</label><div className="relative"><FaChalkboardTeacher className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input type="text" name="instructorName" value={formData.instructorName} onChange={handleInputChange} className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg" placeholder="Product Main Details"/></div></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Age Group</label><div className="relative"><FaChild className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input type="text" name="ageGroup" value={formData.ageGroup} onChange={handleInputChange} className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg" placeholder="e.g. 5-10 Years" required /></div></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Workshop Type</label><div className="relative"><FaLaptopHouse className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><select name="workshopType" value={formData.workshopType} onChange={handleInputChange} className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg"><option value="Online">Online</option><option value="Physical">Physical</option><option value="Creative">Creative</option></select></div></div>
                    {formData.workshopType === 'Online' && (
                        <div><label className="block text-sm font-medium text-gray-700 mb-2">Category</label><select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg"><option value="">Select Category</option>{categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
                    )}
                </div>
                <div className="mt-6"><label className="block text-sm font-medium text-gray-700 mb-2">Description</label><textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" className="w-full px-4 py-3 border border-gray-300 rounded-lg" /></div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-6 pb-4 border-b">Pricing & Status</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Original Price</label><div className="relative"><FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg" required /></div></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label><div className="relative"><FaPercent className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input type="number" name="discount" value={formData.discount} onChange={handleInputChange} className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg" /></div></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Current Price</label><input value={formData.currentPrice} readOnly className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-green-50 font-bold" /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div><label className="block text-sm font-medium text-gray-700 mb-2">Total Seats</label><div className="relative"><FaUsers className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleInputChange} className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg"/></div></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-2">Stock Status</label><select name="stockStatus" value={formData.stockStatus} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg"><option value="In Stock">In Stock / Open</option><option value="Out of Stock">Out of Stock / Full</option><option value="Pre Order">Pre-Registration</option></select></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-2">Tags</label><div className="relative"><FaTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input name="tags" value={formData.tags} onChange={handleInputChange} className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg" placeholder="comma, separated"/></div></div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                 <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Workshop Images</h2>
                 <div className="flex flex-wrap gap-4">
                     <label className="cursor-pointer w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-lg hover:bg-blue-50 transition bg-gray-50">
                        <FaCamera className="text-2xl text-blue-500 mb-2"/> <span className="text-xs text-blue-600 font-semibold text-center px-2">Add</span><input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden"/>
                     </label>
                     {existingImages.map((img, index) => (
                        <div key={`exist-${index}`} className="relative w-32 h-32 group"><img src={img.url} className="w-full h-full object-cover rounded-lg border border-orange-200" alt="existing" /><span className="absolute bottom-0 left-0 bg-orange-500 text-white text-[10px] px-2 py-1 rounded-tr-lg">Saved</span></div>
                     ))}
                     {newPreviews.map((src, index) => (
                        <div key={`new-${index}`} className="relative w-32 h-32 group"><img src={src} className="w-full h-full object-cover rounded-lg border border-green-300" alt="new preview" /><span className="absolute bottom-0 left-0 bg-green-600 text-white text-[10px] px-2 py-1 rounded-tr-lg">New</span><button type="button" onClick={() => removeNewImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"><FaTimes size={12}/></button></div>
                     ))}
                 </div>
            </div>

            <div className="flex justify-end gap-4">
                <button type="button" onClick={() => { setActiveTab('view-workshops'); setEditingId(null); }} className="px-6 py-3 border rounded-lg text-gray-700">Cancel</button>
                <button type="submit" disabled={formLoading} className="px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center">{formLoading ? <FaSpinner className="animate-spin mr-2"/> : <FaSave className="mr-2"/>} Save Workshop</button>
            </div>
        </form>
    );
  };

  // ==========================================
  //  COMPONENT: ADD CATEGORY FORM
  // ==========================================
  const AddCategoryForm = () => {
    const [catForm, setCatForm] = useState({ 
        name: editingCategory ? editingCategory.name : '', description: editingCategory ? editingCategory.description : '', isActive: editingCategory ? editingCategory.isActive : true 
    });
    const [catImage, setCatImage] = useState(null);
    const [catPreview, setCatPreview] = useState(editingCategory ? editingCategory.image : null);
    const [catLoading, setCatLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCatLoading(true);
        try {
            const fd = new FormData();
            fd.append('name', catForm.name);
            fd.append('description', catForm.description);
            fd.append('isActive', catForm.isActive);
            if(catImage) fd.append('image', catImage);
            
            // ✅ Use WorkshopCategoryService
            if (editingCategory) await WorkshopCategoryService.update(editingCategory._id, fd);
            else await WorkshopCategoryService.create(fd);
            
            alert(editingCategory ? 'Category Updated' : 'Category Added');
            setCatForm({ name: '', description: '', isActive: true }); 
            setCatImage(null); setCatPreview(null); setEditingCategory(null);
            setActiveTab('view-categories'); fetchData();
        } catch (e) { alert('Error: ' + e.message); } finally { setCatLoading(false); }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold">{editingCategory ? 'Edit Category' : 'Add Category'}</h2><button onClick={() => {setEditingCategory(null); setActiveTab('view-categories')}} className="text-gray-500"><FaTimes/></button></div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div><label className="block text-sm font-medium mb-2">Name</label><input value={catForm.name} onChange={e => setCatForm({...catForm, name: e.target.value})} className="w-full px-4 py-3 border rounded-lg" required /></div>
                <div><label className="block text-sm font-medium mb-2">Description</label><textarea value={catForm.description} onChange={e => setCatForm({...catForm, description: e.target.value})} rows="3" className="w-full px-4 py-3 border rounded-lg"/></div>
                <div><label className="block text-sm font-medium mb-2">Image</label><input type="file" onChange={e => { const f = e.target.files[0]; if(f){ setCatImage(f); setCatPreview(URL.createObjectURL(f)); }}} className="w-full"/></div>
                {catPreview && <img src={catPreview} className="h-32 rounded-lg object-cover"/>}
                <button type="submit" disabled={catLoading} className="w-full py-3 bg-purple-600 text-white rounded-lg font-bold">{catLoading ? 'Saving...' : 'Save Category'}</button>
            </form>
        </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border">
            <div><h1 className="text-2xl font-bold text-gray-800">Workshop Manager</h1><p className="text-gray-500">Manage your events, classes and categories</p></div>
            <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Admin Panel</div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <button onClick={() => setActiveTab('view-workshops')} className={`p-4 rounded-xl flex items-center justify-center font-bold transition-all ${activeTab === 'view-workshops' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50'}`}><FaChalkboardTeacher className="mr-2"/> Workshops</button>
            <button onClick={() => { setActiveTab('add-workshop'); setEditingId(null); }} className={`p-4 rounded-xl flex items-center justify-center font-bold transition-all ${activeTab === 'add-workshop' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50'}`}><FaPlus className="mr-2"/> Add Workshop</button>
            <button onClick={() => setActiveTab('view-categories')} className={`p-4 rounded-xl flex items-center justify-center font-bold transition-all ${activeTab === 'view-categories' ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50'}`}><FaLayerGroup className="mr-2"/> Categories</button>
            <button onClick={() => { setActiveTab('add-category'); setEditingCategory(null); }} className={`p-4 rounded-xl flex items-center justify-center font-bold transition-all ${activeTab === 'add-category' ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50'}`}><FaPlus className="mr-2"/> Add Category</button>
            {/* ✅ NEW ENROLLMENT TAB BUTTON */}
            <button onClick={() => setActiveTab('view-enrollments')} className={`p-4 rounded-xl flex items-center justify-center font-bold transition-all ${activeTab === 'view-enrollments' ? 'bg-green-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50'}`}><FaUserGraduate className="mr-2"/> Enrollments</button>
        </div>
        
        {/* WORKSHOPS TABLE */}
        {activeTab === 'view-workshops' && (
            <div className="bg-white rounded-xl shadow border p-6">
                <div className="flex justify-between mb-4"><h2 className="text-xl font-bold">Total Workshops ({workshops.length})</h2><button onClick={fetchData} className="text-blue-600 hover:underline">Refresh</button></div>
                {loading ? <div className="text-center py-10"><FaSpinner className="animate-spin text-3xl mx-auto text-blue-600"/></div> : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-600 text-sm uppercase"><tr><th className="p-4">Workshop</th><th className="p-4">Type</th><th className="p-4">Price</th><th className="p-4">Age</th><th className="p-4 text-right">Actions</th></tr></thead>
                            <tbody className="divide-y">
                                {workshops.map(item => (
                                    <tr key={item._id} className="hover:bg-gray-50">
                                        <td className="p-4 flex items-center"><div className="h-12 w-12 rounded bg-gray-200 overflow-hidden mr-3"><img src={item.images?.[0]?.url || 'https://via.placeholder.com/50'} className="h-full w-full object-cover" alt="Workshop"/></div><div><p className="font-bold text-gray-900">{item.title}</p><p className="text-xs text-gray-500">{item.instructorName}</p></div></td>
                                        <td className="p-4"><span className="px-2 py-1 rounded text-xs font-bold bg-green-100 text-green-700">{item.workshopType}</span></td>
                                        <td className="p-4 font-bold text-gray-700">₹{item.price}</td>
                                        <td className="p-4 text-sm">{item.ageGroup}</td>
                                        <td className="p-4 text-right"><button onClick={() => handleEdit(item._id)} className="text-blue-600 hover:bg-blue-50 p-2 rounded mr-2"><FaEdit/></button><button onClick={() => handleDelete(item._id, 'workshop')} className="text-red-600 hover:bg-red-50 p-2 rounded"><FaTrash/></button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        )}

        {/* ✅ ENROLLMENTS TABLE */}
        {activeTab === 'view-enrollments' && (
            <div className="bg-white rounded-xl shadow border p-6">
                <div className="flex justify-between mb-4"><h2 className="text-xl font-bold">Enrollments ({enrollments.length})</h2><button onClick={fetchData} className="text-blue-600 hover:underline">Refresh</button></div>
                {loading ? <div className="text-center py-10"><FaSpinner className="animate-spin text-3xl mx-auto text-blue-600"/></div> : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-600 text-sm uppercase"><tr><th className="p-4">Date</th><th className="p-4">Student</th><th className="p-4">Workshop</th><th className="p-4">Type</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th></tr></thead>
                            <tbody className="divide-y">
                                {enrollments.map(item => (
                                    <tr key={item._id} className="hover:bg-gray-50">
                                        <td className="p-4 text-sm text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4"><p className="font-bold text-gray-900">{item.studentName}</p><p className="text-xs text-gray-500">{item.mobileNumber}</p></td>
                                        <td className="p-4"><p className="text-gray-800">{item.workshopName}</p><p className="text-xs text-gray-500">ID: {item.workshopId?._id || 'N/A'}</p></td>
                                        <td className="p-4"><span className="px-2 py-1 rounded text-xs font-bold bg-purple-100 text-purple-700">{item.workshopId?.workshopType || 'Unknown'}</span></td>
                                        <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold ${item.paymentStatus === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{item.paymentStatus}</span></td>
                                        <td className="p-4 text-right space-x-2">
                                            <button onClick={() => setViewEnrollment(item)} className="text-blue-600 hover:bg-blue-50 p-2 rounded" title="View"><FaEye/></button>
                                            <button onClick={() => setEditEnrollment(item)} className="text-green-600 hover:bg-green-50 p-2 rounded" title="Edit"><FaEdit/></button>
                                            <button onClick={() => handleDelete(item._id, 'enrollment')} className="text-red-600 hover:bg-red-50 p-2 rounded" title="Delete"><FaTrash/></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {enrollments.length === 0 && <p className="text-center py-10 text-gray-500">No enrollments found.</p>}
                    </div>
                )}
            </div>
        )}

        {/* ✅ CATEGORIES GRID VIEW (Existing) */}
        {activeTab === 'view-categories' && (
            <div className="bg-white rounded-xl shadow border p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {categories.map(cat => (
                        <div key={cat._id} className="group border rounded-xl p-4 hover:shadow-md transition bg-gray-50 flex flex-col items-center text-center relative">
                             <div className="h-16 w-16 rounded-full bg-gray-200 overflow-hidden mb-3">{cat.image ? <img src={cat.image} className="h-full w-full object-cover" alt={cat.name}/> : <FaLayerGroup className="text-3xl text-gray-400 mt-4 mx-auto"/>}</div>
                             <h3 className="font-bold text-gray-800">{cat.name}</h3>
                             <p className="text-xs text-gray-500 mb-2">{cat.description}</p>
                             
                             {/* Action Buttons: Edit & Delete */}
                             <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <button onClick={() => handleEditCategory(cat)} className="bg-blue-100 text-blue-600 p-2 rounded-full hover:bg-blue-200 transition"><FaEdit size={12}/></button>
                                 <button onClick={() => handleDelete(cat._id, 'category')} className="bg-red-100 text-red-600 p-2 rounded-full hover:bg-red-200 transition"><FaTrash size={12}/></button>
                             </div>
                        </div>
                    ))}
                    {categories.length === 0 && <p className="col-span-full text-center text-gray-500">No categories found.</p>}
                </div>
            </div>
        )}

        {/* FORMS */}
        {activeTab === 'add-workshop' && <AddWorkshopForm />}
        {activeTab === 'add-category' && <AddCategoryForm />}

        {/* ✅ VIEW ENROLLMENT MODAL */}
        {viewEnrollment && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
                    <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                        <h3 className="text-lg font-bold">Enrollment Details</h3>
                        <button onClick={() => setViewEnrollment(null)} className="text-gray-500"><FaTimes/></button>
                    </div>
                    <div className="p-6 grid grid-cols-2 gap-4 text-sm">
                        <div><p className="text-gray-500">Student Name</p><p className="font-bold">{viewEnrollment.studentName}</p></div>
                        <div><p className="text-gray-500">Age / Class</p><p className="font-bold">{viewEnrollment.age} Yrs / {viewEnrollment.classGrade}</p></div>
                        <div className="col-span-2"><p className="text-gray-500">Workshop</p><p className="font-bold text-blue-600">{viewEnrollment.workshopName} ({viewEnrollment.workshopId?.workshopType})({viewEnrollment.workshopId?._id})</p></div>
                        <div><p className="text-gray-500">Parent Name</p><p className="font-bold">{viewEnrollment.parentName}</p></div>
                        <div><p className="text-gray-500">Mobile</p><p className="font-bold">{viewEnrollment.mobileNumber}</p></div>
                        <div className="col-span-2"><p className="text-gray-500">Email</p><p className="font-bold">{viewEnrollment.email}</p></div>
                        <div className="col-span-2"><p className="text-gray-500">Address</p><p className="font-bold">{viewEnrollment.address}</p></div>
                        <div><p className="text-gray-500">Payment Status</p><p className={`font-bold ${viewEnrollment.paymentStatus === 'Completed' ? 'text-green-600' : 'text-yellow-600'}`}>{viewEnrollment.paymentStatus}</p></div>
                        <div><p className="text-gray-500">Amount</p><p className="font-bold">₹{viewEnrollment.amount}</p></div>
                    </div>
                    <div className="p-4 bg-gray-50 text-right"><button onClick={() => setViewEnrollment(null)} className="px-4 py-2 bg-white border rounded text-sm">Close</button></div>
                </div>
            </div>
        )}

        {/* ✅ EDIT ENROLLMENT MODAL */}
        {editEnrollment && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
                    <div className="p-6 border-b flex justify-between items-center bg-blue-50">
                        <h3 className="text-lg font-bold text-blue-800">Edit Enrollment</h3>
                        <button onClick={() => setEditEnrollment(null)} className="text-blue-500"><FaTimes/></button>
                    </div>
                    <form onSubmit={handleUpdateEnrollment} className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">Student Name</label><input className="w-full px-3 py-2 border rounded" value={editEnrollment.studentName} onChange={(e) => setEditEnrollment({...editEnrollment, studentName: e.target.value})} /></div>
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">Age</label><input className="w-full px-3 py-2 border rounded" value={editEnrollment.age} onChange={(e) => setEditEnrollment({...editEnrollment, age: e.target.value})} /></div>
                        </div>
                        <div><label className="block text-xs font-bold text-gray-500 mb-1">Payment Status</label><select className="w-full px-3 py-2 border rounded" value={editEnrollment.paymentStatus} onChange={(e) => setEditEnrollment({...editEnrollment, paymentStatus: e.target.value})}><option value="Pending">Pending</option><option value="Completed">Completed</option></select></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">Mobile</label><input className="w-full px-3 py-2 border rounded" value={editEnrollment.mobileNumber} onChange={(e) => setEditEnrollment({...editEnrollment, mobileNumber: e.target.value})} /></div>
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">Email</label><input className="w-full px-3 py-2 border rounded" value={editEnrollment.email} onChange={(e) => setEditEnrollment({...editEnrollment, email: e.target.value})} /></div>
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <button type="button" onClick={() => setEditEnrollment(null)} className="px-4 py-2 border rounded text-sm text-gray-600">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-bold">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default WorkshopManager;