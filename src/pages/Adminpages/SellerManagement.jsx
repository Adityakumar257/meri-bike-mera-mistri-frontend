import React, { useState } from 'react';
import { FaEdit, FaTrash, FaBox, FaStore, FaSpinner, FaSearch } from 'react-icons/fa';
import { UserService } from '../../services/api';

const SellerManagement = ({
  sellers,
  loading,
  isAuthenticated,
  requireAuth,
  setError,
  setSuccessMessage,
  fetchSellers
}) => {

  const [editingId, setEditingId] = useState(null);
  const [sellerForm, setSellerForm] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    gstNumber: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    businessType: 'manufacturer',
    status: 'pending',
    commissionRate: 15,
    totalProducts: 0,
    totalSales: 0,
    joiningDate: new Date().toISOString().split('T')[0]
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const saveSellerToAPI = async (sellerData, isUpdate = false) => {
    if (!requireAuth(isUpdate ? 'update seller' : 'add seller')) return false;
    
    try {
      let response;

      if (isUpdate && editingId) {
         const { default: api } = await import('../../../services/api'); 
         response = await api.put(`/sellers/${editingId}`, sellerData);
      } else {
         const { default: api } = await import('../../../services/api');
         response = await api.post('/sellers', sellerData);
      }
      
      if (response.data.success) {
        setSuccessMessage(isUpdate ? 'Seller updated successfully!' : 'Seller added successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        await fetchSellers();
        return true;
      }
    } catch (error) {
      console.error('Error saving seller:', error);
      setError(error.message || 'Failed to save seller');
    }
    return false;
  };

  const deleteSellerFromAPI = async (id) => {
    if (!window.confirm('Are you sure you want to delete this seller?')) return false;
    
    if (!requireAuth('delete seller')) return false;
    
    try {
      const { default: api } = await import('../../../services/api');
      const response = await api.delete(`/sellers/${id}`);
      
      if (response.data.success) {
        setSuccessMessage('Seller deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        await fetchSellers();
        return true;
      }
    } catch (error) {
      console.error('Error deleting seller:', error);
      setError(error.message || 'Failed to delete seller');
    }
    return false;
  };

  const filteredSellers = sellers.filter(seller => {
    const matchesSearch = seller.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          seller.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          seller.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || seller.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Seller/Partner Management</h1>
          <p className="text-gray-600 mt-2">Manage all sellers and partners</p>
        </div>
        <button
          onClick={() => {
            setSellerForm({
              companyName: '',
              contactPerson: '',
              email: '',
              phone: '',
              gstNumber: '',
              address: '',
              city: '',
              state: '',
              pincode: '',
              businessType: 'manufacturer',
              status: 'pending',
              commissionRate: 15,
              totalProducts: 0,
              totalSales: 0,
              joiningDate: new Date().toISOString().split('T')[0]
            });
            setEditingId(null);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          disabled={!isAuthenticated()}
        >
          <FaStore />
          Add New Seller
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search sellers by name, company, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="md:w-48">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Seller List Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSellers.map(seller => (
                <tr key={seller.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold mr-3">
                        {seller.companyName?.charAt(0) || 'S'}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{seller.companyName}</div>
                        <div className="text-sm text-gray-500">{seller.contactPerson}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{seller.email}</div>
                    <div className="text-sm text-gray-500">{seller.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{seller.totalProducts || 0}</div>
                    <div className="text-xs text-gray-500">products</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">₹{seller.totalSales?.toLocaleString() || '0'}</div>
                    <div className="text-xs text-gray-500">total</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{seller.commissionRate || 15}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      seller.status === 'active' ? 'bg-green-100 text-green-800' :
                      seller.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      seller.status === 'suspended' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {seller.status || 'pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSellerForm({
                            ...seller,
                            joiningDate: seller.joiningDate || new Date().toISOString().split('T')[0]
                          });
                          setEditingId(seller.id);
                        }}
                        className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                        title="Edit"
                        disabled={!isAuthenticated()}
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => deleteSellerFromAPI(seller.id)}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        title="Delete"
                        disabled={!isAuthenticated()}
                      >
                        <FaTrash />
                      </button>
                      <button
                        className="text-green-600 hover:text-green-900"
                        title="View Products"
                      >
                        <FaBox />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SellerManagement;