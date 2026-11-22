import React, { useState, useEffect } from 'react';
import { 
  FaTrash, FaEye, FaTimes, FaSpinner, 
  FaCommentDots, FaExclamationTriangle, FaStar, FaSync,
  FaCheck, FaBan 
} from 'react-icons/fa';
// ✅ Import Services
import { FeedbackService, ComplaintService, ReviewService } from '../../../services/api';

const UsefulLinksManager = () => {
  // ❌ Removed API_BASE_URL prop (handled in api.js)

  const [activeTab, setActiveTab] = useState('feedback'); // feedback | complaints | reviews
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Modal State
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- FETCH DATA ---
  const fetchData = async () => {
    setLoading(true);
    try {
      let res;
      switch (activeTab) {
        // ✅ Use corresponding service methods
        case 'feedback': 
          res = await FeedbackService.getAll(); 
          break;
        case 'complaints': 
          res = await ComplaintService.getAll(); 
          break;
        case 'reviews': 
          res = await ReviewService.getAllAdmin(); 
          break;
        default: 
          res = await FeedbackService.getAll();
      }

      // Handle varied response structures safely
      const payload = res.data;
      if (Array.isArray(payload)) setData(payload);
      else if (Array.isArray(payload.data)) setData(payload.data);
      else if (Array.isArray(payload.reviews)) setData(payload.reviews); // Specific to reviews sometimes
      else setData([]);

    } catch (err) {
      console.error("Fetch error:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // --- TOGGLE REVIEW APPROVAL STATUS ---
  const handleToggleStatus = async (id) => {
    try {
      // ✅ Use ReviewService
      await ReviewService.toggleStatus(id);
      fetchData(); // Refresh list immediately
    } catch (err) {
      alert("Failed to update status: " + (err.message || "Unknown error"));
    }
  };

  // --- DELETE HANDLER ---
  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete this record?`)) return;
    try {
      switch (activeTab) {
        case 'feedback': 
            await FeedbackService.delete(id); 
            break;
        case 'complaints': 
            await ComplaintService.delete(id); 
            break;
        case 'reviews': 
            await ReviewService.delete(id); 
            break;
        default: return;
      }
      
      fetchData();
      alert("Record deleted successfully");
    } catch (err) {
      alert("Delete failed: " + (err.message || "Unknown error"));
    }
  };

  // --- VIEW DETAILS HANDLER ---
  const handleView = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  // --- RENDER TABLE ROWS ---
  const renderTableRows = () => {
    if (data.length === 0) {
      return (
        <tr>
          <td colSpan="6" className="text-center py-10 text-gray-500">
            No {activeTab} found.
          </td>
        </tr>
      );
    }

    return data.map((item, index) => (
      <tr key={item._id || index} className="hover:bg-gray-50 border-b last:border-0 transition-colors">
        <td className="p-4 text-sm text-gray-500">
          {new Date(item.createdAt).toLocaleDateString()}
        </td>
        <td className="p-4 font-medium text-gray-800">
          {item.name || 'Anonymous'}
        </td>
        <td className="p-4 text-sm text-gray-600">
          {activeTab === 'reviews' ? (
             <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => <FaStar key={i} className={i < (item.rating || 0) ? "" : "text-gray-300"} size={12}/>)}
             </div>
          ) : (
             item.email || item.mobile || 'N/A'
          )}
        </td>

        {/* ✅ STATUS COLUMN (Only for Reviews) */}
        {activeTab === 'reviews' && (
            <td className="p-4">
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {item.isApproved ? 'Approved' : 'Pending'}
                </span>
            </td>
        )}

        <td className="p-4 text-sm text-gray-600 truncate max-w-xs">
          {item.message || item.description || '-'}
        </td>
        
        <td className="p-4 text-right space-x-2 flex justify-end">
          {/* ✅ APPROVE BUTTON (Only for Reviews) */}
          {activeTab === 'reviews' && (
             <button 
                onClick={() => handleToggleStatus(item._id)} 
                className={`p-2 rounded transition-colors ${item.isApproved ? 'text-orange-500 bg-orange-50 hover:bg-orange-100' : 'text-green-600 bg-green-50 hover:bg-green-100'}`}
                title={item.isApproved ? "Unapprove (Hide)" : "Approve (Show)"}
             >
                {item.isApproved ? <FaBan /> : <FaCheck />}
             </button>
          )}

          <button onClick={() => handleView(item)} className="text-blue-600 bg-blue-50 hover:bg-blue-100 p-2 rounded transition-colors" title="View Details">
            <FaEye />
          </button>
          <button onClick={() => handleDelete(item._id)} className="text-red-600 bg-red-50 hover:bg-red-100 p-2 rounded transition-colors" title="Delete">
            <FaTrash />
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Useful Links Manager</h1>
            <p className="text-gray-500 mt-1">Manage user interactions from footer links</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
             <button onClick={fetchData} className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <FaSync className={`mr-2 ${loading ? 'animate-spin' : ''}`}/> Refresh
             </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <button onClick={() => setActiveTab('feedback')} className={`p-4 rounded-xl flex items-center justify-center font-bold transition-all ${activeTab === 'feedback' ? 'bg-blue-600 text-white shadow-lg transform -translate-y-1' : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'}`}>
            <FaCommentDots className="mr-2 text-lg"/> Feedback
          </button>
          <button onClick={() => setActiveTab('complaints')} className={`p-4 rounded-xl flex items-center justify-center font-bold transition-all ${activeTab === 'complaints' ? 'bg-red-600 text-white shadow-lg transform -translate-y-1' : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'}`}>
            <FaExclamationTriangle className="mr-2 text-lg"/> Complaints
          </button>
          <button onClick={() => setActiveTab('reviews')} className={`p-4 rounded-xl flex items-center justify-center font-bold transition-all ${activeTab === 'reviews' ? 'bg-yellow-500 text-white shadow-lg transform -translate-y-1' : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'}`}>
            <FaStar className="mr-2 text-lg"/> Reviews
          </button>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800 capitalize">{activeTab} List</h2>
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">{data.length} Records</span>
          </div>
          
          {loading ? (
            <div className="text-center py-20"><FaSpinner className="animate-spin text-4xl mx-auto text-blue-500 mb-4"/><p className="text-gray-500">Loading data...</p></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="p-4 font-semibold border-b">Date</th>
                    <th className="p-4 font-semibold border-b">Name</th>
                    <th className="p-4 font-semibold border-b">{activeTab === 'reviews' ? 'Rating' : 'Contact'}</th>
                    {activeTab === 'reviews' && <th className="p-4 font-semibold border-b">Status</th>}
                    <th className="p-4 font-semibold border-b">{activeTab === 'reviews' ? 'Review' : 'Message'}</th>
                    <th className="p-4 font-semibold border-b text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>{renderTableRows()}</tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* View Details Modal */}
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100">
            <div className={`p-6 flex justify-between items-center text-white ${activeTab === 'feedback' ? 'bg-blue-600' : activeTab === 'complaints' ? 'bg-red-600' : 'bg-yellow-500'}`}>
              <h3 className="text-xl font-bold capitalize flex items-center gap-2">{activeTab} Details</h3>
              <button onClick={closeModal} className="text-white/80 hover:text-white"><FaTimes size={24} /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-gray-500 mb-1">Date</p><p className="font-medium text-gray-800">{new Date(selectedItem.createdAt).toLocaleString()}</p></div>
                <div><p className="text-gray-500 mb-1">Name</p><p className="font-medium text-gray-800">{selectedItem.name}</p></div>
                
                {activeTab !== 'reviews' && (
                    <>
                        <div><p className="text-gray-500 mb-1">Email</p><p className="font-medium text-gray-800 break-words">{selectedItem.email}</p></div>
                        <div><p className="text-gray-500 mb-1">Mobile</p><p className="font-medium text-gray-800">{selectedItem.mobile || 'N/A'}</p></div>
                    </>
                )}
                
                {activeTab === 'reviews' && (
                    <div><p className="text-gray-500 mb-1">Current Status</p><p className={`font-bold ${selectedItem.isApproved ? 'text-green-600' : 'text-yellow-600'}`}>{selectedItem.isApproved ? 'Approved (Visible)' : 'Pending (Hidden)'}</p></div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100">
                <p className="text-gray-500 mb-2 font-medium">Content</p>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedItem.message || selectedItem.description || selectedItem.comment || 'No content.'}
                </div>
              </div>

              {activeTab === 'reviews' && (
                 <div className="pt-4 border-t border-gray-100">
                    <p className="text-gray-500 mb-2 font-medium">Rating</p>
                    <div className="flex text-yellow-400 text-xl">
                      {[...Array(5)].map((_, i) => <FaStar key={i} className={i < (selectedItem.rating || 0) ? "" : "text-gray-300"} />)}
                    </div>
                 </div>
              )}
            </div>
            <div className="p-4 bg-gray-50 flex justify-end"><button onClick={closeModal} className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors">Close</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsefulLinksManager;