import React, { useState } from 'react';
import { FaUserPlus, FaEdit, FaTrash, FaShoppingCart, FaSave, FaSpinner, FaSearch } from 'react-icons/fa';
// ✅ Import UserService
import { UserService } from '../../../services/api';

const CustomerManagement = ({
  customers,
  loading,
  isAuthenticated,
  requireAuth,
  setError,
  setSuccessMessage,
  fetchCustomers
}) => {
  // ❌ Removed API_BASE_URL and getAuthHeaders (handled by api.js)

  const [editingId, setEditingId] = useState(null);
  const [customerForm, setCustomerForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    status: 'active',
    totalOrders: 0,
    totalSpent: 0,
    lastOrderDate: '',
    registrationDate: new Date().toISOString().split('T')[0]
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const saveCustomerToAPI = async (customerData, isUpdate = false) => {
    if (!requireAuth(isUpdate ? 'update customer' : 'add customer')) return false;
    
    try {
      let response;
      
      if (isUpdate && editingId) {
        // ✅ Use UserService.update
        response = await UserService.update(editingId, customerData);
      } else {
        // ✅ Use UserService.create (assuming you add this method to UserService in api.js)
        // If create doesn't exist, you might need to add: create: (data) => api.post('/users', data) to UserService
        // For now, assuming you might be repurposing registration or a specific admin create route
        // If not available in UserService, you should add it to api.js first.
        // Assuming a standard create route exists:
        response = await UserService.create(customerData); 
      }
      
      if (response.data.success) {
        setSuccessMessage(isUpdate ? 'Customer updated successfully!' : 'Customer added successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        await fetchCustomers();
        return true;
      }
    } catch (error) {
      console.error('Error saving customer:', error);
      setError(error.message || 'Failed to save customer');
    }
    return false;
  };

  const deleteCustomerFromAPI = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return false;
    
    if (!requireAuth('delete customer')) return false;
    
    try {
      // ✅ Use UserService.delete
      const response = await UserService.delete(id);
      
      if (response.data.success) {
        setSuccessMessage('Customer deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        await fetchCustomers();
        return true;
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      setError(error.message || 'Failed to delete customer');
    }
    return false;
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          customer.phone?.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Customer Management</h1>
          <p className="text-gray-600 mt-2">Manage all customers and their orders</p>
        </div>
        <button
          onClick={() => {
            setCustomerForm({
              name: '',
              email: '',
              phone: '',
              address: '',
              city: '',
              state: '',
              pincode: '',
              status: 'active',
              totalOrders: 0,
              totalSpent: 0,
              lastOrderDate: '',
              registrationDate: new Date().toISOString().split('T')[0]
            });
            setEditingId(null);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          disabled={!isAuthenticated()}
        >
          <FaUserPlus />
          Add New Customer
        </button>
      </div>

      {/* Add/Edit Customer Form */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          {editingId ? 'Edit Customer' : 'Add New Customer'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer Name *
            </label>
            <input
              type="text"
              value={customerForm.name}
              onChange={(e) => setCustomerForm({...customerForm, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter customer name"
              required
              disabled={!isAuthenticated()}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={customerForm.email}
              onChange={(e) => setCustomerForm({...customerForm, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter email address"
              required
              disabled={!isAuthenticated()}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone *
            </label>
            <input
              type="tel"
              value={customerForm.phone}
              onChange={(e) => setCustomerForm({...customerForm, phone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter phone number"
              required
              disabled={!isAuthenticated()}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={customerForm.status}
              onChange={(e) => setCustomerForm({...customerForm, status: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={!isAuthenticated()}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <textarea
              value={customerForm.address}
              onChange={(e) => setCustomerForm({...customerForm, address: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter full address"
              rows="2"
              disabled={!isAuthenticated()}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <input
              type="text"
              value={customerForm.city}
              onChange={(e) => setCustomerForm({...customerForm, city: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter city"
              disabled={!isAuthenticated()}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pincode
            </label>
            <input
              type="text"
              value={customerForm.pincode}
              onChange={(e) => setCustomerForm({...customerForm, pincode: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter pincode"
              disabled={!isAuthenticated()}
            />
          </div>
        </div>
        
        <div className="flex gap-4 mt-6 pt-4 border-t">
          <button
            onClick={async () => {
              const success = await saveCustomerToAPI(customerForm, !!editingId);
              if (success) {
                setCustomerForm({
                  name: '',
                  email: '',
                  phone: '',
                  address: '',
                  city: '',
                  state: '',
                  pincode: '',
                  status: 'active',
                  totalOrders: 0,
                  totalSpent: 0,
                  lastOrderDate: '',
                  registrationDate: new Date().toISOString().split('T')[0]
                });
                setEditingId(null);
              }
            }}
            className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50"
            disabled={loading.customers || !customerForm.name || !customerForm.email || !customerForm.phone || !isAuthenticated()}
          >
            {loading.customers ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                {editingId ? 'Updating...' : 'Adding...'}
              </>
            ) : (
              <>
                {editingId ? <FaSave className="mr-2" /> : <FaUserPlus className="mr-2" />}
                {editingId ? 'Update Customer' : 'Add Customer'}
              </>
            )}
          </button>
          
          {editingId && (
            <button
              onClick={() => {
                setCustomerForm({
                  name: '',
                  email: '',
                  phone: '',
                  address: '',
                  city: '',
                  state: '',
                  pincode: '',
                  status: 'active',
                  totalOrders: 0,
                  totalSpent: 0,
                  lastOrderDate: '',
                  registrationDate: new Date().toISOString().split('T')[0]
                });
                setEditingId(null);
              }}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Customers List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">All Customers ({filteredCustomers.length})</h3>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map(customer => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-3">
                        {customer.name?.charAt(0) || 'C'}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                        <div className="text-sm text-gray-500">{customer.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{customer.phone}</div>
                    <div className="text-sm text-gray-500">{customer.city || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{customer.totalOrders || 0}</div>
                    <div className="text-xs text-gray-500">orders</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">₹{customer.totalSpent?.toLocaleString() || '0'}</div>
                    <div className="text-xs text-gray-500">total</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      customer.status === 'active' ? 'bg-green-100 text-green-800' :
                      customer.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {customer.status || 'active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setCustomerForm({
                            ...customer,
                            registrationDate: customer.registrationDate || new Date().toISOString().split('T')[0]
                          });
                          setEditingId(customer.id);
                        }}
                        className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                        title="Edit"
                        disabled={!isAuthenticated()}
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => deleteCustomerFromAPI(customer.id)}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        title="Delete"
                        disabled={!isAuthenticated()}
                      >
                        <FaTrash />
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-900"
                        title="View Orders"
                      >
                        <FaShoppingCart />
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

export default CustomerManagement;