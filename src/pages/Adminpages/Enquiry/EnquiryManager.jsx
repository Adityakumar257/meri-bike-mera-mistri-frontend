import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
// ✅ Import EnquiryService from centralized API
import { EnquiryService } from '../../../services/api';

const EnquiryManager = () => {
  const { user } = useAuth();
  
  // State Management
  const [activeTab, setActiveTab] = useState('bulk'); // 'bulk' or 'contact'
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); // To show connection errors
  const [selectedItem, setSelectedItem] = useState(null); 
  const getArrayFromResponse = (res) => {

    if (!res) return [];
    if (Array.isArray(res)) return res;
    const payload = res.data;
    if (!payload) return [];

    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload.data)) return payload.data;
    if (Array.isArray(payload.orders)) return payload.orders;       // Common for bulk orders
    if (Array.isArray(payload.bulkOrders)) return payload.bulkOrders; 
    if (Array.isArray(payload.contacts)) return payload.contacts;   // Common for contacts
    if (Array.isArray(payload.inquiries)) return payload.inquiries;
    if (Array.isArray(payload.items)) return payload.items;

    console.warn("⚠️ Could not find an array in the response payload:", payload);
    return [];
  };

  // --- API Calls ---

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let res;
      
      if (activeTab === 'bulk') {
        res = await EnquiryService.getAllBulkOrders();
      } else {
        res = await EnquiryService.getAllContacts();
      }
      
      const rawData = getArrayFromResponse(res);
      
      setData(rawData);
      
    } catch (err) {
      console.error(`❌ Error fetching ${activeTab}:`, err);
      setError(err.message || "Failed to load data");
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this inquiry?")) return;

    try {
      if (activeTab === 'bulk') {
        await EnquiryService.deleteBulkOrder(id);
      } else {
        await EnquiryService.deleteContact(id);
      }
      
      // Update UI locally
      setData(prev => prev.filter(item => item._id !== id));
      if (selectedItem && selectedItem._id === id) setSelectedItem(null);
      alert("Deleted successfully.");

    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete: " + (error.message || "Unknown error"));
    }
  };

  // --- Effects ---

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Helper Functions ---

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      });
    } catch (e) { return 'Invalid Date'; }
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  // --- Render Components ---

  return (
    <div className="bg-gray-50 min-h-screen p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Error Banner */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-sm flex justify-between items-center">
            <div>
              <p className="font-bold">Error Loading Data</p>
              <p className="text-sm">{error}</p>
            </div>
            <button onClick={fetchData} className="bg-white px-3 py-1 rounded text-red-600 border border-red-200 text-sm hover:bg-red-50">Retry</button>
          </div>
        )}

        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Inquiry Management</h1>
            <p className="text-gray-500">View and manage form submissions</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium">
              Admin Access
            </div>
            <div className="text-sm text-gray-600">
              Logged in as: <span className="font-semibold">{user?.name || 'Admin'}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button 
            onClick={() => setActiveTab('bulk')} 
            className={`flex-1 py-4 rounded-xl font-semibold transition-all shadow-sm flex items-center justify-center space-x-2 ${
              activeTab === 'bulk' 
                ? 'bg-orange-600 text-white' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <span>📦</span>
            <span>Bulk Orders</span>
          </button>
          <button 
            onClick={() => setActiveTab('contact')} 
            className={`flex-1 py-4 rounded-xl font-semibold transition-all shadow-sm flex items-center justify-center space-x-2 ${
              activeTab === 'contact' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <span>📧</span>
            <span>Contact Inquiries</span>
          </button>
        </div>

        {/* Main Content Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 min-h-[500px]">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {activeTab === 'bulk' ? 'Bulk Order Requests' : 'Contact Form Submissions'}
                </h2>
                <p className="text-gray-500 text-sm">Total {data.length} records found</p>
              </div>
              <button 
                onClick={fetchData} 
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center border border-gray-300"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Refresh
              </button>
            </div>

            {isLoading ? (
              <div className="text-center py-20 text-gray-500">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500 mb-4"></div>
                <p>Loading data...</p>
              </div>
            ) : data.length === 0 ? (
              <div className="text-center py-20">
                <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-700">No Records Found</h3>
                <p className="text-gray-500">No submissions have been received yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b text-gray-600 text-sm uppercase">
                    <tr>
                      <th className="p-4">Name</th>
                      <th className="p-4">Contact Info</th>
                      {activeTab === 'contact' && <th className="p-4">Details</th>}
                      <th className="p-4">Message Snippet</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {data.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 text-white font-bold shadow-sm ${activeTab === 'bulk' ? 'bg-orange-400' : 'bg-blue-400'}`}>
                              {getInitials(item.name)}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{item.name}</div>
                              {item.company && (
                                <div className="text-xs text-gray-500 flex items-center mt-0.5">
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                                  {item.company}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm">
                            <div className="text-gray-900 mb-1 flex items-center">
                              <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-xs mr-2">Email</span>
                              {item.email}
                            </div>
                            <div className="text-gray-600 flex items-center">
                              <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-xs mr-2">Tel</span>
                              {item.phone}
                            </div>
                          </div>
                        </td>
                        {activeTab === 'contact' && (
                          <td className="p-4">
                            <div className="text-sm">
                              <div className="mb-1"><span className="font-semibold text-gray-700">City:</span> {item.city}</div>
                              <div><span className="font-semibold text-gray-700">Type:</span> <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full text-xs">{item.inquiryType || 'General'}</span></div>
                            </div>
                          </td>
                        )}
                        <td className="p-4">
                          <p className="text-sm text-gray-600 max-w-xs truncate italic">
                            "{item.message}"
                          </p>
                        </td>
                        <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                          {formatDate(item.createdAt)}
                        </td>
                        <td className="p-4">
                           <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                             item.status === 'New' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                           }`}>
                             {item.status || 'New'}
                           </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => setSelectedItem(item)}
                              className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm flex items-center font-medium"
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm flex items-center font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* --- VIEW MODAL --- */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden transform transition-all scale-100">
              
              {/* Modal Header */}
              <div className={`p-5 text-white flex justify-between items-center ${activeTab === 'bulk' ? 'bg-gradient-to-r from-orange-500 to-orange-600' : 'bg-gradient-to-r from-blue-500 to-blue-600'}`}>
                <div>
                  <h3 className="font-bold text-xl flex items-center">
                    {activeTab === 'bulk' ? '📦 Bulk Order Details' : '📧 Contact Inquiry Details'}
                  </h3>
                  <p className="text-white text-opacity-80 text-sm mt-1">
                    ID: {selectedItem._id}
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedItem(null)} 
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-8 max-h-[75vh] overflow-y-auto">
                
                {/* Status Bar */}
                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl mb-8 border border-gray-100">
                   <div>
                     <p className="text-xs text-gray-500 uppercase tracking-wide font-bold">Submission Date</p>
                     <p className="font-medium text-gray-800">{formatDate(selectedItem.createdAt)}</p>
                   </div>
                   <div className="text-right">
                     <p className="text-xs text-gray-500 uppercase tracking-wide font-bold">Current Status</p>
                     <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-bold ${selectedItem.status === 'New' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-700'}`}>
                       {selectedItem.status || 'New'}
                     </span>
                   </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  
                  <div className="col-span-2 pb-2 border-b border-gray-100">
                    <h4 className="text-gray-800 font-bold text-lg">Client Information</h4>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                    <p className="text-gray-900 font-medium text-lg">{selectedItem.name}</p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
                    <p className="text-gray-900 font-medium font-mono text-lg">{selectedItem.phone}</p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
                    <a href={`mailto:${selectedItem.email}`} className="text-blue-600 hover:underline font-medium text-lg block truncate">
                      {selectedItem.email}
                    </a>
                  </div>

                  {activeTab === 'contact' && (
                    <>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">City</label>
                        <p className="text-gray-900 font-medium text-lg">{selectedItem.city}</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Company</label>
                        <p className="text-gray-900 font-medium text-lg">{selectedItem.company || 'N/A'}</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Inquiry Type</label>
                        <p className="text-gray-900 font-medium text-lg">{selectedItem.inquiryType || 'General'}</p>
                      </div>
                    </>
                  )}

                  <div className="col-span-2 pt-6 pb-2 border-b border-gray-100">
                    <h4 className="text-gray-800 font-bold text-lg">Message Content</h4>
                  </div>

                  <div className="col-span-2 bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-base">
                      {selectedItem.message}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 p-5 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-sm"
                >
                  Close
                </button>
                <a
                  href={`mailto:${selectedItem.email}?subject=Re: Inquiry from ${selectedItem.name}`}
                  className={`px-5 py-2.5 text-white rounded-lg font-medium shadow-sm flex items-center ${activeTab === 'bulk' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-blue-600 hover:bg-blue-700'} transition-colors`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  Reply via Email
                </a>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default EnquiryManager;