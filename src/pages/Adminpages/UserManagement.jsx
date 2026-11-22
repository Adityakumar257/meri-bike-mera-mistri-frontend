import React, { useState, useEffect } from 'react';
import { 
  FaEdit, FaTrash, FaKey, FaUserPlus, FaSpinner, FaSearch, 
  FaUser, FaEnvelope, FaPhone, FaChartBar, FaDownload, 
  FaFilter, FaEye, FaUserCheck, FaUserTimes, FaUserShield,
  FaTimes, FaCheck, FaHistory, FaCog, FaArrowLeft
} from 'react-icons/fa';
// ✅ Import API and Services
import api, { UserService, AuthService } from '../../services/api';

const UserManagement = ({
  isAuthenticated,
  requireAuth,
  setError,
  setSuccessMessage
}) => {
  // ❌ Removed API_BASE_URL and getAuthHeaders props (handled by api.js)

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [userForm, setUserForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    mobile: '',
    role: 'user',
    emailVerified: false
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [detailedStats, setDetailedStats] = useState(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userActivity, setUserActivity] = useState(null);
  const [exportData, setExportData] = useState(null);
  
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [resetPasswordData, setResetPasswordData] = useState({
    token: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [changePasswordData, setChangePasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [stats, setStats] = useState({
    totalUsers: 0,
    verifiedUsers: 0,
    adminUsers: 0,
    superadminUsers: 0,
    userUsers: 0
  });

  // Improved fetch users function
  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // ✅ Use UserService.getAll
      const response = await UserService.getAll();
      
      if (response.data && response.data.success) {
        // Handle format 1: response.data.data
        if (response.data.data && Array.isArray(response.data.data)) {
          setUsers(response.data.data);
          
          // Extract stats if available
          if (response.data.meta?.statistics) {
            setStats({
              totalUsers: response.data.meta.statistics.totalUsers || 0,
              verifiedUsers: response.data.meta.statistics.verifiedUsers || 0,
              adminUsers: response.data.meta.statistics.adminUsers || response.data.meta.statistics.adminCount || 0,
              superadminUsers: response.data.meta.statistics.superAdminUsers || response.data.meta.statistics.superAdminCount || 0,
              userUsers: response.data.meta.statistics.userUsers || response.data.meta.statistics.userCount || 0
            });
          }
        }
        // Handle format 2: response.data.users
        else if (response.data.users && Array.isArray(response.data.users)) {
          setUsers(response.data.users);
        }
        // Handle format 3: response.data is the array
        else if (Array.isArray(response.data)) {
          setUsers(response.data);
        }
      }
      
    } catch (err) {
      console.error('❌ Error in fetchUsers:', err);
      // Fallback to demo data logic if needed, or show error
      if (users.length === 0) {
        setError('Failed to load users. ' + (err.message || ''));
      }
      
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    
    // Refresh users every 30 seconds if needed
    const interval = setInterval(() => {
      if (!showForm && !loading) {
        fetchUsers();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Save user function
  const saveUserToAPI = async (userData, isUpdate = false) => {
    if (!requireAuth(isUpdate ? 'update user' : 'add user')) return false;
    
    try {
      let response;
      
      if (isUpdate && editingId) {
        // ✅ Use UserService.update
        response = await UserService.update(editingId, userData);
      } else {
        // ✅ Use direct API for create if not in service
        response = await api.post('/users', userData);
      }
      
      if (response.data.success) {
        setSuccessMessage(isUpdate ? 'User updated successfully!' : 'User added successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        
        // Refresh users list
        await fetchUsers();
        
        // Reset form
        setShowForm(false);
        setEditingId(null);
        setUserForm({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          mobile: '',
          role: 'user',
          emailVerified: false
        });
        
        return true;
      } else {
        setError(response.data.message || 'Failed to save user');
        return false;
      }
      
    } catch (error) {
      console.error('❌ Error saving user:', error);
      setError(`Failed to save user: ${error.message}`);
      return false;
    }
  };

  // Delete user function
  const deleteUserFromAPI = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return false;
    
    if (!requireAuth('delete user')) return false;
    
    try {
      // ✅ Use UserService.delete
      const response = await UserService.delete(id);
      
      if (response.data.success) {
        setSuccessMessage('User deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        
        // Remove from local state immediately
        setUsers(prev => prev.filter(user => user._id !== id && user.id !== id));
        
        return true;
      } else {
        setError(response.data.message || 'Failed to delete user');
        return false;
      }
      
    } catch (error) {
      console.error('❌ Error deleting user:', error);
      setError(`Failed to delete user: ${error.message}`);
      return false;
    }
  };

  // Update user role function
  const updateUserRole = async (id, newRole) => {
    if (!requireAuth('update user role')) return false;
    
    try {
      // ✅ Use UserService.updateRole
      const response = await UserService.updateRole(id, { role: newRole });
      
      if (response.data.success) {
        setSuccessMessage('User role updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        
        // Update local state
        setUsers(prev => prev.map(user => 
          (user._id === id || user.id === id) 
            ? { ...user, role: newRole }
            : user
        ));
        
        return true;
      } else {
        setError(response.data.message || 'Failed to update role');
        return false;
      }
      
    } catch (error) {
      console.error('❌ Error updating user role:', error);
      setError(`Failed to update role: ${error.message}`);
      return false;
    }
  };

  const updateRetailerStatus = async (id, retailerStatus) => {
    if (!requireAuth('update retailer approval')) return false;

    try {
      const response = await UserService.updateRetailerStatus(id, retailerStatus);
      if (!response.data.success) {
        setError(response.data.message || 'Failed to update retailer access');
        return false;
      }

      setUsers(prev => prev.map(user =>
        (user._id === id || user.id === id) ? { ...user, retailerStatus } : user
      ));
      setSuccessMessage('Retailer access status updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      return true;
    } catch (error) {
      console.error('Error updating retailer status:', error);
      setError(`Failed to update retailer access: ${error.message}`);
      return false;
    }
  };

  // Fetch detailed statistics
  const fetchDetailedStats = async () => {
    try {
      // ✅ Use direct api call for custom endpoint
      const response = await api.get('/users/stats/detailed');
      
      if (response.data.success) {
        setDetailedStats(response.data.data);
        setShowStats(true);
        setSuccessMessage('Detailed statistics loaded!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('❌ Error fetching detailed stats:', error);
      setError('Failed to load detailed statistics.');
    }
  };

  // Forgot password
  const handleForgotPassword = async () => {
    if (!forgotPasswordEmail) {
      setError('Please enter your email address');
      return;
    }
    
    try {
      // ✅ Use AuthService.forgotPassword
      const response = await AuthService.forgotPassword({ email: forgotPasswordEmail });
      
      if (response.data.success) {
        setSuccessMessage(response.data.message);
        setShowForgotPassword(false);
        setForgotPasswordEmail('');
      }
    } catch (error) {
      setError(error.message || 'Failed to process request');
    }
  };

  // Change password
  const handleChangePassword = async () => {
    if (changePasswordData.newPassword !== changePasswordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (changePasswordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    try {
      // ✅ Use AuthService.changePassword
      const response = await AuthService.changePassword({
          currentPassword: changePasswordData.currentPassword,
          newPassword: changePasswordData.newPassword
      });
      
      if (response.data.success) {
        setSuccessMessage(response.data.message);
        setShowChangePassword(false);
        setChangePasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      setError(error.message || 'Failed to change password');
    }
  };

  // Reset password (Admin override or self)
  const handleResetPassword = async () => {
    // Similar implementation if needed
  };

  // Bulk actions
  const handleBulkAction = async (action, data = null) => {
    if (selectedUsers.length === 0) {
      setError('Please select users first');
      return;
    }
    
    if (action === 'delete' && !window.confirm(`Delete ${selectedUsers.length} users?`)) {
      return;
    }
    
    try {
      // ✅ Use direct api call for bulk actions
      const response = await api.post('/users/bulk', {
        action: action,
        userIds: selectedUsers,
        data: data
      });
      
      if (response.data.success) {
        setSuccessMessage(response.data.message);
        setSelectedUsers([]);
        fetchUsers();
      }
    } catch (error) {
      setError(error.message || 'Failed to perform bulk action');
    }
  };

  // Export users
  const exportUsersData = async () => {
    try {
      const response = await api.get('/users/export/all');
      
      if (response.data.success) {
        setExportData(response.data);
        
        // Create downloadable file
        const dataStr = JSON.stringify(response.data.data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `users_export_${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        setSuccessMessage(`Exported ${response.data.count} users to JSON`);
      }
    } catch (error) {
      console.error('Export error:', error);
      setError('Failed to export users.');
    }
  };

  // Fetch user activity
  const fetchUserActivity = async (userId) => {
    try {
      const response = await api.get(`/users/activity/${userId}`);
      
      if (response.data.success) {
        setUserActivity(response.data);
      }
    } catch (error) {
      console.error('Error fetching user activity:', error);
      setError('Failed to load user activity');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveUserToAPI(userForm, !!editingId);
  };

  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
    const email = user.email?.toLowerCase() || '';
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || 
                          email.includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
                          (statusFilter === 'verified' ? user.emailVerified : !user.emailVerified);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const roleCounts = {
    admin: users.filter(u => u.role === 'admin').length,
    superadmin: users.filter(u => u.role === 'superadmin').length,
    user: users.filter(u => u.role === 'user').length
  };

  const verifiedCount = users.filter(u => u.emailVerified).length;

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-600 mt-2">Manage system users and their permissions</p>
          <div className="mt-1">
            <button 
              onClick={fetchUsers}
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
            >
              <FaSpinner className={`mr-1 ${loading ? 'animate-spin' : ''}`} size={10} />
              {loading ? 'Refreshing...' : 'Refresh Users'}
            </button>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowStats(!showStats)}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <FaChartBar />
            {showStats ? 'Hide Stats' : 'Show Stats'}
          </button>
          <button
            onClick={() => {
              setUserForm({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                mobile: '',
                role: 'user',
                emailVerified: false
              });
              setEditingId(null);
              setShowForm(!showForm);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaUserPlus />
            {showForm ? 'Cancel' : 'Add New User'}
          </button>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={fetchDetailedStats}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          <FaChartBar /> Detailed Stats
        </button>
        
        <button
          onClick={() => setShowForgotPassword(true)}
          className="flex items-center gap-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
        >
          <FaKey /> Forgot Password
        </button>
        
        <button
          onClick={() => setShowChangePassword(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <FaCog /> Change Password
        </button>
        
        {selectedUsers.length > 0 && (
          <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
            <span className="text-sm text-gray-700">{selectedUsers.length} selected</span>
            <button
              onClick={() => handleBulkAction('verify')}
              className="bg-green-500 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
            >
              <FaUserCheck /> Verify
            </button>
            <button
              onClick={() => handleBulkAction('unverify')}
              className="bg-yellow-500 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
            >
              <FaUserTimes /> Unverify
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              className="bg-red-500 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
            >
              <FaTrash /> Delete
            </button>
          </div>
        )}
        
        <button
          onClick={exportUsersData}
          className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 ml-auto"
        >
          <FaDownload /> Export Users
        </button>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalUsers || users.length}</p>
            </div>
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
              <FaUser className="text-xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Verified</p>
              <p className="text-2xl font-bold text-gray-800">{stats.verifiedUsers || verifiedCount}</p>
            </div>
            <div className="p-2 rounded-lg bg-green-100 text-green-600">
              <FaEnvelope className="text-xl" />
            </div>
          </div>
        </div>

        {Object.entries(roleCounts).map(([role, count]) => (
          <div key={role} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 capitalize">{role}</p>
                <p className="text-2xl font-bold text-gray-800">
                  {role === 'admin' ? stats.adminUsers || count :
                   role === 'superadmin' ? stats.superadminUsers || count :
                   stats.userUsers || count}
                </p>
              </div>
              <div className={`p-2 rounded-lg ${
                role === 'admin' ? 'bg-red-100 text-red-600' :
                role === 'superadmin' ? 'bg-purple-100 text-purple-600' :
                'bg-gray-100 text-gray-600'
              }`}>
                <span className="text-sm font-bold capitalize">{role.charAt(0)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Statistics Panel */}
      {showStats && detailedStats && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">📈 Detailed User Statistics</h2>
            <button
              onClick={() => setShowStats(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Overview</h3>
              <p className="text-sm">Total: <span className="font-bold">{detailedStats.overview.totalUsers}</span></p>
              <p className="text-sm">Verified: <span className="font-bold">{detailedStats.overview.verifiedUsers}</span></p>
              <p className="text-sm">Admins: <span className="font-bold">{detailedStats.overview.adminUsers}</span></p>
              <p className="text-sm">Super Admins: <span className="font-bold">{detailedStats.overview.superadminUsers}</span></p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Activity</h3>
              <p className="text-sm">Today's New: <span className="font-bold">{detailedStats.activity.todaysNewUsers}</span></p>
              <p className="text-sm">Weekly Active: <span className="font-bold">{detailedStats.activity.weeklyActiveUsers}</span></p>
              <p className="text-sm">Active Rate: <span className="font-bold">{detailedStats.activity.activeRate}</span></p>
              <p className="text-sm">Avg Logins: <span className="font-bold">{detailedStats.activity.avgLoginCount}</span></p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">Monthly Growth</h3>
              <p className="text-2xl font-bold">{detailedStats.activity.monthlyGrowth}</p>
              <p className="text-sm text-gray-600 mt-1">new users this month</p>
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-600"
                  style={{ width: `${Math.min((detailedStats.activity.monthlyGrowth / 100) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">Engagement</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm">Total Sessions</p>
                  <p className="font-bold">{Math.round(detailedStats.overview.totalUsers * detailedStats.activity.avgLoginCount)}</p>
                </div>
                <div>
                  <p className="text-sm">Engagement Score</p>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-yellow-600 h-2 rounded-full"
                        style={{ width: `${parseFloat(detailedStats.activity.activeRate)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm">{detailedStats.activity.activeRate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Activity Table */}
          {detailedStats.recentActivity && detailedStats.recentActivity.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-3">Recent User Activity</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm bg-gray-50 rounded-lg">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="text-left p-3">User</th>
                      <th className="text-left p-3">Role</th>
                      <th className="text-left p-3">Last Login</th>
                      <th className="text-left p-3">Login Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailedStats.recentActivity.map((activity, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="p-3">
                          <div className="font-medium">{activity.firstName} {activity.lastName}</div>
                          <div className="text-xs text-gray-500">{activity.email}</div>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded text-xs ${
                            activity.role === 'admin' ? 'bg-red-100 text-red-800' :
                            activity.role === 'superadmin' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {activity.role}
                          </span>
                        </td>
                        <td className="p-3">
                          {activity.lastLogin ? new Date(activity.lastLogin).toLocaleString() : 'Never'}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${Math.min(activity.loginCount || 0, 100)}%` }}
                              ></div>
                            </div>
                            <span className="font-medium">{activity.loginCount || 0}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* User Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit User' : 'Add New User'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  value={userForm.firstName}
                  onChange={(e) => setUserForm({...userForm, firstName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={userForm.lastName}
                  onChange={(e) => setUserForm({...userForm, lastName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  placeholder="Doe"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  placeholder="user@example.com"
                  disabled={!!editingId}
                />
                {editingId && (
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-lg">
                    <FaPhone className="text-sm" />
                  </span>
                  <input
                    type="tel"
                    value={userForm.mobile}
                    onChange={(e) => setUserForm({...userForm, mobile: e.target.value})}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="1234567890"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {editingId ? 'New Password (leave blank to keep current)' : 'Password *'}
                </label>
                <input
                  type="password"
                  value={userForm.password}
                  onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  minLength="6"
                  required={!editingId}
                  placeholder="••••••"
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role *
                </label>
                <select 
                  value={userForm.role}
                  onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="emailVerified"
                checked={userForm.emailVerified}
                onChange={(e) => setUserForm({...userForm, emailVerified: e.target.checked})}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="emailVerified" className="ml-2 block text-sm text-gray-700">
                Email Verified
              </label>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setUserForm({
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    mobile: '',
                    role: 'user',
                    emailVerified: false
                  });
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingId ? 'Update User' : 'Add User'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modals */}
      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">🔑 Forgot Password</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Enter your email"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotPasswordEmail('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleForgotPassword}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Send Reset Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">🔐 Change Password</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Current Password</label>
                <input
                  type="password"
                  value={changePasswordData.currentPassword}
                  onChange={(e) => setChangePasswordData({
                    ...changePasswordData,
                    currentPassword: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">New Password</label>
                <input
                  type="password"
                  value={changePasswordData.newPassword}
                  onChange={(e) => setChangePasswordData({
                    ...changePasswordData,
                    newPassword: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={changePasswordData.confirmPassword}
                  onChange={(e) => setChangePasswordData({
                    ...changePasswordData,
                    confirmPassword: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowChangePassword(false);
                    setChangePasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleChangePassword}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Activity Modal */}
      {userActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">📝 User Activity</h2>
              <button
                onClick={() => setUserActivity(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-xl mr-4">
                  {(userActivity.user.firstName?.charAt(0) || 'U').toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{userActivity.user.firstName} {userActivity.user.lastName}</h3>
                  <p className="text-gray-600">{userActivity.user.email}</p>
                  <div className="flex gap-2 mt-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      userActivity.user.role === 'admin' ? 'bg-red-100 text-red-800' :
                      userActivity.user.role === 'superadmin' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {userActivity.user.role}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      userActivity.user.emailVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {userActivity.user.emailVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded">
                <p className="text-sm text-blue-800 font-medium">Total Logins</p>
                <p className="text-2xl font-bold">{userActivity.activity.totalLogins}</p>
              </div>
              <div className="bg-green-50 p-4 rounded">
                <p className="text-sm text-green-800 font-medium">Account Age</p>
                <p className="text-2xl font-bold">{userActivity.activity.accountAge}</p>
              </div>
            </div>
            
            <h4 className="font-semibold mb-3">Recent Activity</h4>
            <div className="space-y-3">
              {userActivity.activity.recentActivity.map((activity, idx) => (
                <div key={idx} className="flex items-start p-3 bg-gray-50 rounded-lg">
                  <div className="mr-3 mt-1">
                    <div className={`w-3 h-3 rounded-full ${
                      activity.action === 'login' ? 'bg-green-500' :
                      activity.action === 'logout' ? 'bg-red-500' :
                      'bg-blue-500'
                    }`}></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="font-medium capitalize">{activity.action.replace('_', ' ')}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {activity.ip && `IP: ${activity.ip}`}
                      {activity.device && ` • Device: ${activity.device}`}
                      {activity.details && ` • ${activity.details}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-end">
                <button
                  onClick={() => setUserActivity(null)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <FaSpinner className="animate-spin text-blue-600 text-2xl mr-2" />
            <span className="text-gray-600">Loading users...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <FaUser className="text-4xl mx-auto" />
            </div>
            <p className="text-gray-600">No users found</p>
            {searchTerm && (
              <p className="text-sm text-gray-500 mt-1">
                Try a different search term or clear filters
              </p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers(filteredUsers.map(u => u._id || u.id));
                        } else {
                          setSelectedUsers([]);
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map(user => {
                  const userId = user._id || user.id;
                  return (
                    <tr key={userId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(userId)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUsers([...selectedUsers, userId]);
                            } else {
                              setSelectedUsers(selectedUsers.filter(id => id !== userId));
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold mr-3">
                            {(user.firstName?.charAt(0) || 'U').toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                            {user.mobile && (
                              <div className="text-xs text-gray-400 flex items-center mt-1">
                                <FaPhone className="mr-1" size={10} />
                                {user.mobile}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          <span className={`px-2 py-1 text-xs rounded-full w-20 text-center ${
                            user.role === 'admin' ? 'bg-red-100 text-red-800' :
                            user.role === 'superadmin' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {user.role}
                          </span>
                          {isAuthenticated?.() && (
                            <select 
                              value={user.role}
                              onChange={(e) => updateUserRole(userId, e.target.value)}
                              className="text-xs border border-gray-300 rounded px-2 py-1 w-20"
                            >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                              <option value="superadmin">Super Admin</option>
                            </select>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          <span className={`px-2 py-1 text-xs rounded-full w-20 text-center ${
                            user.emailVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {user.emailVerified ? 'Verified' : 'Unverified'}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full w-20 text-center bg-blue-100 text-blue-800`}>
                            {user.status || 'active'}
                          </span>
                          {isAuthenticated?.() && user.role === 'user' && (
                            <select
                              value={user.retailerStatus || 'not_requested'}
                              onChange={(e) => updateRetailerStatus(userId, e.target.value)}
                              className="text-xs border border-gray-300 rounded px-2 py-1"
                              aria-label={`Retailer approval for ${user.email}`}
                            >
                              <option value="not_requested">Retailer: None</option>
                              <option value="pending">Retailer: Pending</option>
                              <option value="approved">Retailer: Approved</option>
                              <option value="rejected">Retailer: Rejected</option>
                            </select>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                        </div>
                        <div className="text-xs text-gray-500">
                          Logins: {user.loginCount || 0} • Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => fetchUserActivity(userId)}
                            className="text-purple-600 hover:text-purple-900 p-1 hover:bg-purple-50 rounded transition-colors"
                            title="View Activity"
                          >
                            <FaHistory />
                          </button>
                          <button
                            onClick={() => {
                              setUserForm({
                                firstName: user.firstName || '',
                                lastName: user.lastName || '',
                                email: user.email || '',
                                password: '',
                                mobile: user.mobile || '',
                                role: user.role || 'user',
                                emailVerified: user.emailVerified || false
                              });
                              setEditingId(userId);
                              setShowForm(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => deleteUserFromAPI(userId)}
                            className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                            disabled={user.role === 'admin' || user.role === 'superadmin'}
                          >
                            <FaTrash />
                          </button>
                          <button
                            className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded transition-colors"
                            title="Reset Password"
                            onClick={() => {
                              setUserForm({
                                firstName: user.firstName || '',
                                lastName: user.lastName || '',
                                email: user.email || '',
                                password: '',
                                mobile: user.mobile || '',
                                role: user.role || 'user',
                                emailVerified: user.emailVerified || false
                              });
                              setEditingId(userId);
                              setShowForm(true);
                            }}
                          >
                            <FaKey />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;