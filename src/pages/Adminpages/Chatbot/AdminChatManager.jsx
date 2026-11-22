import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext'; 
// ✅ Import Services from centralized API
import { ChatService, ResponseService } from '../../../services/api';

const AdminChatManager = () => {
  const { user } = useAuth(); // Token is handled automatically by api.js

  const [activeTab, setActiveTab] = useState('chats'); 
  const [isLoading, setIsLoading] = useState(false);
  
  // Data States
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null); 
  const [responses, setResponses] = useState([]);
  
  // Form State
  const [responseForm, setResponseForm] = useState({ 
    keyword: '', 
    response: '', 
    isQuickReply: false, 
    id: null 
  });
  const [isEditingResponse, setIsEditingResponse] = useState(false);

  // Fetching Data - IMPROVED VERSION
  const fetchChats = async () => {
    setIsLoading(true);
    try {
      const res = await ChatService.getAllChats();
      
      
      // Improved transformation with better user type detection
      const transformedChats = res.data.map(chat => {
        let userDisplay = 'Unknown User';
        let userType = 'guest';
        let userEmail = '';
        let isGuest = true;
        let userDetails = null;
        if (chat.messages && chat.messages.length > 0) {
          const userMessages = chat.messages.filter(m => m.sender === 'user');
          if (userMessages.length > 0) {
            const lastUserMessage = userMessages[userMessages.length - 1];
            
            if (lastUserMessage.userType === 'registered') {
              userType = 'registered';
              isGuest = false;
            }
            
            if (lastUserMessage.userName && lastUserMessage.userName !== 'Guest User') {
              userDisplay = lastUserMessage.userName;
            }
            
            if (lastUserMessage.userEmail) {
              userEmail = lastUserMessage.userEmail;
            }
            
            if (lastUserMessage.userDetails) {
              userDetails = lastUserMessage.userDetails;
            }
          }
        }
        
        // Method 2: Check userId format
        if (chat.userId && !String(chat.userId).startsWith('guest_')) {
          userType = 'registered';
          isGuest = false;
        }
        
        // Method 3: Check userDetails in chat object
        if (chat.userDetails) {
          userDetails = chat.userDetails;
          
          if (chat.userDetails._id && !String(chat.userDetails._id).startsWith('guest_')) {
            userType = 'registered';
            isGuest = false;
          }
          
          if (chat.userDetails.name && chat.userDetails.name !== 'Guest User') {
            userDisplay = chat.userDetails.name;
          }
          
          if (chat.userDetails.email) {
            userEmail = chat.userDetails.email;
          }
          
          // Check if isGuest field exists
          if (chat.userDetails.isGuest === false) {
            userType = 'registered';
            isGuest = false;
          }
        }
        
        // Method 4: Check if user has email (likely registered)
        if (userEmail && userEmail.includes('@') && !userEmail.includes('example')) {
          userType = 'registered';
          isGuest = false;
        }
        
        // Method 5: Final fallback - if userDisplay has real name, likely registered
        if (userDisplay && 
            userDisplay !== 'Guest User' && 
            userDisplay !== 'Unknown User' &&
            !String(userDisplay).startsWith('guest_')) {
          userType = 'registered';
          isGuest = false;
          console.log("✅ Registered user from name:", userDisplay);
        }

        // Get last message
        const lastMessage = chat.messages && chat.messages.length > 0 
          ? chat.messages[chat.messages.length - 1].text 
          : 'No messages';

        return {
          ...chat,
          userDisplay: userDisplay,
          userType: userType,
          isGuest: isGuest,
          userEmail: userEmail,
          userDetails: userDetails,
          lastMessage: lastMessage,
          messageCount: chat.messages ? chat.messages.length : 0
        };
      });
      
      setChats(transformedChats);
      
      // Log summary for debugging
      const guestCount = transformedChats.filter(c => c.isGuest).length;
      const registeredCount = transformedChats.filter(c => !c.isGuest).length;
      
    } catch (error) { 
      console.error("Error fetching chats:", error);
    } 
    finally { 
      setIsLoading(false); 
    }
  };

  const fetchResponses = async () => {
    setIsLoading(true);
    try {
      // ✅ Use ResponseService instead of axios
      const res = await ResponseService.getAll();
      setResponses(res.data);
    } catch (error) { 
      console.error("Error fetching responses", error); 
    } 
    finally { setIsLoading(false); }
  };

  useEffect(() => {
    if (activeTab === 'chats') {
      fetchChats();
    }
    if (activeTab === 'responses') {
      fetchResponses();
    }
  }, [activeTab]);

  // Auto-refresh chats
  useEffect(() => {
    let interval;
    if (activeTab === 'chats') {
      fetchChats();
      interval = setInterval(fetchChats, 10000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTab]);

  // Helper functions
  const handleCancelEdit = () => {
    setResponseForm({ keyword: '', response: '', isQuickReply: false, id: null });
    setIsEditingResponse(false);
  };

  const handleResponseSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { 
        keyword: responseForm.keyword, 
        response: responseForm.response,
        isQuickReply: responseForm.isQuickReply 
      };

      if (isEditingResponse) {
        // ✅ Use ResponseService.update
        await ResponseService.update(responseForm.id, payload);
        alert('Response updated successfully');
      } else {
        // ✅ Use ResponseService.create
        await ResponseService.create(payload);
        alert('Response added successfully');
      }
      
      handleCancelEdit();
      fetchResponses();
    } catch (error) {
      alert('Error saving response: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEditResponse = (item) => {
    setResponseForm({ 
      keyword: item.keyword, 
      response: item.response, 
      isQuickReply: item.isQuickReply || false, 
      id: item._id 
    });
    setIsEditingResponse(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteResponse = async (id) => {
    if(!window.confirm("Are you sure you want to delete this response?")) return;
    try {
      // ✅ Use ResponseService.delete
      await ResponseService.delete(id);
      fetchResponses();
      alert('Response deleted successfully');
    } catch (error) { 
      alert("Error deleting response: " + error.message);
    }
  };

  const handleDeleteChat = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this chat history?")) return;

    try {
      // ✅ Use ChatService.deleteHistory
      await ChatService.deleteHistory(userId);
      fetchChats();
      if (selectedChat && selectedChat.userId === userId) {
        setSelectedChat(null);
      }
      alert('Chat deleted successfully');
    } catch (error) {
      console.error("Error deleting chat:", error);
      alert("Failed to delete chat: " + error.message);
    }
  };

  // Helper for toggle switch UI
  const ToggleSwitch = ({ checked, onChange }) => (
    <div 
      className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${checked ? 'bg-orange-500' : 'bg-gray-300'}`}
      onClick={() => onChange(!checked)}
    >
      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-0'}`}></div>
    </div>
  );

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get user initials for avatar
  const getUserInitials = (name, isGuest) => {
    if (isGuest) return 'G';
    if (!name || name === 'Guest User') return 'U';
    return String(name).charAt(0).toUpperCase();
  };

  // Get user badge color based on type
  const getUserBadgeClass = (isGuest) => {
    return isGuest 
      ? 'bg-gray-100 text-gray-600' 
      : 'bg-green-100 text-green-600';
  };

  // Get avatar background color based on user type
  const getAvatarClass = (isGuest) => {
    return isGuest 
      ? 'bg-gray-100 text-gray-600' 
      : 'bg-orange-100 text-orange-600';
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Support Dashboard</h1>
            <p className="text-gray-500">Manage customer chats & bot configuration</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-orange-50 text-orange-700 px-4 py-2 rounded-lg text-sm font-medium">
              Admin Mode
            </div>
            <div className="text-sm text-gray-600">
              Logged in as: <span className="font-semibold">{user?.name || 'Admin'}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button 
            onClick={() => setActiveTab('chats')} 
            className={`flex-1 py-4 rounded-xl font-semibold transition-all shadow-sm ${activeTab === 'chats' ? 'bg-orange-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
          >
            Chat Enquiries ({chats.length})
          </button>
          <button 
            onClick={() => setActiveTab('responses')} 
            className={`flex-1 py-4 rounded-xl font-semibold transition-all shadow-sm ${activeTab === 'responses' ? 'bg-orange-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
          >
            Bot Responses ({responses.length})
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 min-h-[500px]">
          {/* Chats Tab */}
          {activeTab === 'chats' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Recent Chat Enquiries</h2>
                  <p className="text-gray-500 text-sm">Total {chats.length} chats found</p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={fetchChats} 
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    Refresh
                  </button>
                </div>
              </div>
              
              {isLoading ? (
                <div className="text-center py-10 text-gray-500">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500 mb-4"></div>
                  <p>Loading chats...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  {chats.length === 0 ? (
                    <div className="text-center py-10">
                      <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                      </svg>
                      <h3 className="text-lg font-medium text-gray-700 mb-2">No Chats Found</h3>
                      <p className="text-gray-500 mb-4">Start chatting from the ChatSupport widget to see chats here.</p>
                    </div>
                  ) : (
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 border-b text-gray-600 text-sm uppercase">
                        <tr>
                          <th className="p-4">User</th>
                          <th className="p-4">Last Message</th>
                          <th className="p-4">Messages</th>
                          <th className="p-4">Last Active</th>
                          <th className="p-4">Type</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {chats.map(chat => {
                          const isGuest = chat.isGuest || chat.userType === 'guest';
                          
                          return (
                            <tr key={chat._id} className="hover:bg-gray-50">
                              <td className="p-4">
                                <div className="flex items-center">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${getAvatarClass(isGuest)}`}>
                                    <span className="font-medium">
                                      {getUserInitials(chat.userDisplay, isGuest)}
                                    </span>
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-800 flex items-center">
                                      {chat.userDisplay}
                                      {!isGuest && (
                                        <span className="ml-2 text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full flex items-center">
                                          <svg className="w-2 h-2 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                          </svg>
                                          Verified
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-xs text-gray-500 font-mono truncate max-w-[150px]" title={chat.userId}>
                                      ID: {String(chat.userId).substring(0, 12)}...
                                    </div>
                                    {chat.userEmail && (
                                      <div className="text-xs text-gray-500 truncate max-w-[150px]" title={chat.userEmail}>
                                        {chat.userEmail}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="max-w-xs truncate text-gray-700" title={chat.lastMessage}>
                                  {chat.lastMessage}
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="text-center">
                                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold">
                                    {chat.messageCount}
                                  </span>
                                </div>
                              </td>
                              <td className="p-4 text-gray-600 text-sm">
                                {formatDate(chat.lastActive)}
                              </td>
                              <td className="p-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUserBadgeClass(isGuest)}`}>
                                  {isGuest ? 'Guest' : 'Registered'}
                                </span>
                              </td>
                              <td className="p-4 text-right">
                                <div className="flex justify-end space-x-2">
                                  <button
                                    onClick={() => setSelectedChat(chat)}
                                    className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm flex items-center"
                                  >
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                    </svg>
                                    View
                                  </button>
                                  <button
                                    onClick={() => handleDeleteChat(chat.userId)}
                                    className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm flex items-center"
                                  >
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                    </svg>
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Responses Tab */}
          {activeTab === 'responses' && (
            <div className="p-6 grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 sticky top-4">
                  <h3 className="font-bold text-gray-800 mb-4">
                    {isEditingResponse ? 'Edit Bot Response' : 'Add New Response'}
                  </h3>
                  <form onSubmit={handleResponseSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Keyword *
                      </label>
                      <input 
                        type="text" 
                        required 
                        className="w-full rounded-lg border-gray-300 p-2.5 border focus:border-orange-500 focus:ring-orange-500" 
                        placeholder="e.g. refund, delivery, price" 
                        value={responseForm.keyword} 
                        onChange={e => setResponseForm({...responseForm, keyword: e.target.value})} 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Response Message *
                      </label>
                      <textarea 
                        required 
                        rows="4" 
                        className="w-full rounded-lg border-gray-300 p-2.5 border focus:border-orange-500 focus:ring-orange-500" 
                        placeholder="Bot answer..." 
                        value={responseForm.response} 
                        onChange={e => setResponseForm({...responseForm, response: e.target.value})} 
                      />
                    </div>
                    <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Quick Reply Button</span>
                        <p className="text-xs text-gray-500">Show as quick question button</p>
                      </div>
                      <ToggleSwitch 
                        checked={responseForm.isQuickReply} 
                        onChange={val => setResponseForm({...responseForm, isQuickReply: val})} 
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button 
                        type="submit" 
                        className={`flex-1 py-2.5 px-4 rounded-lg text-white font-medium shadow-md transition-colors ${isEditingResponse ? 'bg-orange-600 hover:bg-orange-700' : 'bg-green-600 hover:bg-green-700'}`}
                      >
                        {isEditingResponse ? 'Update Response' : 'Add Response'}
                      </button>
                      {isEditingResponse && (
                        <button 
                          type="button" 
                          onClick={handleCancelEdit} 
                          className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 p-4 border-b">
                    <h3 className="font-bold text-gray-800">All Bot Responses ({responses.length})</h3>
                    <p className="text-sm text-gray-500">Manage automated bot responses</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-100 border-b">
                        <tr>
                          <th className="p-4 text-xs font-bold text-gray-500 uppercase">Keyword</th>
                          <th className="p-4 text-xs font-bold text-gray-500 uppercase">Response</th>
                          <th className="p-4 text-xs font-bold text-gray-500 uppercase">Quick Reply</th>
                          <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {responses.map((item) => (
                          <tr key={item._id} className="bg-white hover:bg-gray-50">
                            <td className="p-4">
                              <div className="font-mono text-sm font-semibold text-orange-600">
                                {item.keyword}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="text-sm text-gray-600 max-w-xs truncate" title={item.response}>
                                {item.response}
                              </div>
                            </td>
                            <td className="p-4">
                              {item.isQuickReply ? 
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                  </svg>
                                  Yes
                                </span> : 
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  No
                                </span>
                              }
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex justify-end space-x-2">
                                <button 
                                  onClick={() => handleEditResponse(item)} 
                                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm flex items-center"
                                >
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                  </svg>
                                  Edit
                                </button>
                                <button 
                                  onClick={() => handleDeleteResponse(item._id)} 
                                  className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm flex items-center"
                                >
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                  </svg>
                                  Delete
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
            </div>
          )}
        </div>
      </div>
      
      {/* View Chat Modal */}
      {selectedChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className={`p-4 ${selectedChat.isGuest ? 'bg-gray-600' : 'bg-orange-600'} text-white flex justify-between items-center`}>
              <div>
                <h3 className="font-bold">Chat History: {selectedChat.userDisplay}</h3>
                <p className="text-sm opacity-90">
                  {selectedChat.messageCount} messages • 
                  Last active: {formatDate(selectedChat.lastActive)} •
                  Type: <span className="font-semibold">{selectedChat.isGuest ? 'Guest' : 'Registered'}</span>
                </p>
                <div className="text-xs mt-1 space-y-1">
                  <p>
                    User ID: <span className="font-mono bg-black bg-opacity-20 px-2 py-0.5 rounded">{selectedChat.userId}</span>
                  </p>
                  {selectedChat.userEmail && (
                    <p>
                      Email: <span className="font-mono bg-black bg-opacity-20 px-2 py-0.5 rounded">{selectedChat.userEmail}</span>
                    </p>
                  )}
                </div>
              </div>
              <button 
                onClick={() => setSelectedChat(null)} 
                className="text-white hover:text-gray-200 p-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-4">
              {selectedChat.messages && selectedChat.messages.length > 0 ? (
                selectedChat.messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-lg ${msg.sender === 'user' ? 'bg-blue-100 text-blue-900 rounded-br-none' : 'bg-white border border-gray-200 rounded-bl-none'}`}>
                      <div className="flex items-center mb-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs font-bold ${msg.sender === 'user' ? (selectedChat.isGuest ? 'bg-gray-200 text-gray-800' : 'bg-blue-200 text-blue-800') : 'bg-orange-200 text-orange-800'}`}>
                          {msg.sender === 'user' ? (selectedChat.isGuest ? 'G' : 'U') : 'B'}
                        </div>
                        <span className="text-xs font-semibold">
                          {msg.sender === 'user' ? selectedChat.userDisplay : 'Meri Bike Mera Mistri Support'}
                          {msg.sender === 'user' && !selectedChat.isGuest && (
                            <span className="ml-1 text-[10px] bg-green-100 text-green-700 px-1 rounded">✓</span>
                          )}
                        </span>
                        <span className="text-xs text-gray-500 ml-auto">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm">{msg.text}</p>
                      {msg.userType && msg.sender === 'user' && (
                        <div className="text-xs text-gray-500 mt-1">
                          User Type: <span className="font-medium">{msg.userType}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-gray-500">
                  No messages in this chat
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminChatManager;