import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext'; 
import { API_BASE_URL as API_URL } from '../services/api';

const ChatSupport = () => {
  const { user, isAuthenticated, token } = useAuth();
  
  // State variables
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Dynamic Data States
  const [botResponses, setBotResponses] = useState({});
  const [quickReplies, setQuickReplies] = useState([]);
  
  const messagesEndRef = useRef(null);

  // --- ADMIN CHECK ---
  const isAdmin = user && (user.role === 'admin' || user.isAdmin === true);
  if (isAdmin) return null;

  // --- USER IDENTIFICATION LOGIC ---

  // For logged-in users
  const getUserInfo = () => {
    if (isAuthenticated && user) {
      return {
        id: user._id,
        name: user.name || user.fullName || user.username || user.firstName || 'User',
        email: user.email || '',
        isGuest: false
      };
    }
    
    // For guest users - create unique guest ID
    return {
      id: generateGuestId(),
      name: 'Guest User',
      email: '',
      isGuest: true
    };
  };

  // Generate unique guest ID
  const generateGuestId = () => {
    // Get or create guest ID from localStorage
    let guestId = localStorage.getItem('chat_guest_id');
    if (!guestId) {
      guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('chat_guest_id', guestId);
    }
    return guestId;
  };

  // Get current user info
  const currentUser = getUserInfo();
  
  // --- HELPERS ---
  const getFirstName = () => {
    return currentUser.isGuest ? 'Guest' : currentUser.name.split(' ')[0];
  };

  const getUserInitial = () => {
    return currentUser.isGuest ? 'G' : currentUser.name.charAt(0).toUpperCase();
  };

  // --- API LOGIC ---

  // 1. Fetch Bot Responses & Quick Replies
  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const res = await axios.get(`${API_URL}/responses?format=map`);
        if(res.data.map) {
            setBotResponses(res.data.map);
            setQuickReplies(res.data.quickReplies || []);
        } else {
            setBotResponses(res.data);
        }
      } catch (error) {
        console.error("Failed to load bot responses", error);
      }
    };
    fetchResponses();
  }, []);

  // 2. Load History on Open
  useEffect(() => {
    if (isOpen) {
      loadChatHistory();
    }
  }, [isOpen, currentUser.id]);

  const loadChatHistory = async () => {
    try {
      console.log("Loading chat history for userId:", currentUser.id);
      
      const headers = isAuthenticated && token ? 
        { Authorization: `Bearer ${token}` } : {};
      
      const res = await axios.get(
        `${API_URL}/chat/history/${currentUser.id}`,
        { headers }
      );
      
      if (res.data && res.data.messages && res.data.messages.length > 0) {
        const formatted = res.data.messages.map((m, i) => ({
          id: m._id || i,
          text: m.text,
          sender: m.sender === 'admin' ? 'bot' : m.sender,
          time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          userName: m.sender === 'user' ? (currentUser.isGuest ? 'Guest User' : currentUser.name) : 'Bot'
        }));
        setMessages(formatted);
      } else {
        // Show welcome message if no history
        const welcomeText = currentUser.isGuest 
          ? 'Hello! Welcome to Meri Bike Mera Mistri. How can I help with your two-wheeler parts today?'
          : `Welcome back ${getFirstName()}! How can I help with your two-wheeler parts today?`;
        
        setMessages([{ 
          id: 1, 
          text: welcomeText, 
          sender: 'bot', 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }
    } catch (err) {
      console.error("Error loading chat history:", err);
      // Show welcome message on error
      const welcomeText = currentUser.isGuest 
        ? 'Hello! Welcome to Meri Bike Mera Mistri. How can I help with your two-wheeler parts today?'
        : `Welcome back ${getFirstName()}! How can I help with your two-wheeler parts today?`;
      
      setMessages([{ 
        id: 1, 
        text: welcomeText, 
        sender: 'bot', 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  };

  // 3. Send Message & Save
// ChatSupport.jsx - handleSendMessage function update
// ChatSupport.jsx में handleSendMessage function update करें:

// 3. Send Message & Save - IMPROVED VERSION
const handleSendMessage = async (textOverride = null) => {
  const textToSend = textOverride || userInput;
  if (!textToSend.trim()) return;
  
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // UI Update - Add user message
  const newUserMessage = {
    id: Date.now(),
    text: textToSend,
    sender: 'user',
    time: currentTime,
    userName: currentUser.name
  };
  
  setMessages(prev => [...prev, newUserMessage]);
  setUserInput('');
  setIsTyping(true);

  // API Save - User message
  try {
    console.log("💾 Saving message for:", currentUser.name, 
                "ID:", currentUser.id, 
                "isGuest:", currentUser.isGuest,
                "isAuthenticated:", isAuthenticated);
    
    const headers = isAuthenticated && token ? 
      { Authorization: `Bearer ${token}` } : {};
    
    // IMPORTANT: Send proper userType
    const userType = isAuthenticated && user && user._id ? 'registered' : 'guest';
    
    await axios.post(
      `${API_URL}/chat/message/${currentUser.id}`,
      { 
        text: textToSend, 
        sender: 'user',
        userName: currentUser.name,
        userType: userType, // Explicitly send userType
        userEmail: currentUser.email,
        // Send additional user info for registered users
        ...(isAuthenticated && user && {
          userId: user._id,
          userDetails: {
            _id: user._id,
            name: user.name,
            email: user.email,
            isGuest: false
          }
        })
      },
      { headers }
    );
    console.log("✅ Message saved for:", currentUser.name, "as", userType);
  } catch(e) { 
    console.error("❌ Message save failed:", e.response?.data || e.message);
  }

  // Bot Response after delay
  setTimeout(async () => {
    const botResponseText = generateResponse(textToSend.toLowerCase());
    
    // UI Update - Add bot message
    const newBotMessage = {
      id: Date.now() + 1,
      text: botResponseText,
      sender: 'bot',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, newBotMessage]);
    setIsTyping(false);

    // API Save - Bot response
    try {
      console.log("🤖 Saving bot response for:", currentUser.name);
      
      const headers = isAuthenticated && token ? 
        { Authorization: `Bearer ${token}` } : {};
      
      await axios.post(
        `${API_URL}/chat/message/${currentUser.id}`,
        { 
          text: botResponseText, 
          sender: 'bot',
          userName: 'Meri Bike Mera Mistri Support',
          userType: 'bot'
        },
        { headers }
      );
      console.log("✅ Bot response saved");
    } catch(e) { 
      console.error("❌ Bot response save failed:", e);
    }
  }, 1000);
};

  // 4. Generate bot response
  const generateResponse = (input) => {
    // Check for specific keywords
    if (input.includes('connect') || input.includes('contact') || input.includes('whatsapp') || input.includes('number')) {
      return "Connect with us on WhatsApp at +91 85069 11777.";
    }
    
    if (input.includes('order') || input.includes('track') || input.includes('delivery')) {
      return "For order tracking, please provide your order ID and we'll check the status for you.";
    }
    
    if (input.includes('return') || input.includes('refund')) {
      return "We accept returns within 30 days of delivery. Please visit our Returns page or contact support for assistance.";
    }
    
    if (input.includes('price') || input.includes('cost') || input.includes('expensive')) {
      return "Please check the product page for current pricing and availability.";
    }
    
    // Dynamic check from bot responses database
    const keywords = Object.keys(botResponses);
    for (let key of keywords) {
      if (key !== 'default' && input.includes(key.toLowerCase())) {
        return botResponses[key];
      }
    }
    
    return botResponses['default'] || "Thank you for contacting Meri Bike Mera Mistri. Our support team will get back to you shortly.";
  };

  // 5. End Chat
  const handleEndChat = async () => {
    if (!window.confirm("Are you sure you want to end this chat?")) return;
    
    try {
      const headers = isAuthenticated && token ? 
        { Authorization: `Bearer ${token}` } : {};
      
      await axios.delete(
        `${API_URL}/chat/history/${currentUser.id}`,
        { headers }
      );
      
      setMessages([]);
      setIsOpen(false);
      // Clear guest ID from localStorage
      if (currentUser.isGuest) {
        localStorage.removeItem('chat_guest_id');
      }
      alert("Chat ended successfully");
    } catch (err) {
      console.error("Error ending chat:", err);
      alert("Failed to end chat. Please try again.");
    }
  };

  // 6. Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => { 
    scrollToBottom(); 
  }, [messages, isTyping]);

  // 7. Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // --- RENDER ---
  return (
    <div className="fixed bottom-24 right-6 z-50">
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center w-16 h-16 rounded-full shadow-lg transition-all duration-300 ${
          isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-orange-600 hover:bg-orange-700'
        }`}
      >
        {isOpen ? (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
            </svg>
            <span className="text-xs text-white mt-1">Help</span>
          </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 md:w-96 h-[500px] bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col">
          
          {/* Header */}
          <div className="bg-orange-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3 overflow-hidden border-2 border-orange-100">
                <img src="/mbmm-logo.webp" alt="Meri Bike Mera Mistri" className="w-8 h-8 object-contain"/>
              </div>
              <div>
                <h3 className="font-bold">Meri Bike Mera Mistri Support</h3>
                <div className="flex items-center">
                  <p className="text-xs opacity-90">Two-Wheeler Parts</p>
                  <div className="ml-2 px-2 py-0.5 bg-orange-500 rounded-full text-xs flex items-center">
                    <span className="w-1.5 h-1.5 bg-green-300 rounded-full mr-1"></span>
                    {currentUser.isGuest ? 'Guest' : getFirstName()}
                  </div>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-white hover:text-orange-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs md:max-w-sm rounded-lg p-3 ${message.sender === 'user' ? 'bg-orange-100 text-gray-800 rounded-br-none border border-orange-200' : 'bg-white text-gray-800 rounded-bl-none border border-orange-100'}`}>
                    {message.sender === 'user' && message.userName && (
                      <p className="text-xs font-semibold text-orange-700 mb-1 flex items-center">
                        {message.userName}
                      </p>
                    )}
                    {message.sender === 'bot' && (
                      <p className="text-xs font-semibold text-orange-600 mb-1 flex items-center">Meri Bike Mera Mistri Support</p>
                    )}
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs text-gray-500 mt-1 text-right">{message.time}</p>
                  </div>
                </div>
              ))}
              
              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-800 rounded-lg rounded-bl-none p-3 border border-orange-100">
                    <div className="flex items-center space-x-1">
                      <span className="text-xs font-semibold text-orange-600 mr-2">Support</span>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: "0.4s"}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Quick Buttons */}
          <div className="px-4 pt-3 border-t border-gray-200 bg-orange-50">
            <p className="text-xs font-medium text-orange-700 mb-2">
              {currentUser.isGuest ? "Quick questions:" : `Quick questions ${getFirstName()}:`}
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {["How to connect?", "Track my order", "Return policy", "Bulk discount", "WhatsApp support"].map((query, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(query)}
                  className="px-3 py-1.5 bg-orange-100 hover:bg-orange-200 text-orange-800 text-xs rounded-full transition-colors border border-orange-200 hover:border-orange-300"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4 bg-white">
            <div className="flex items-center">
              {currentUser.isGuest ? (
                <div className="mr-2 flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-300">
                    <span className="text-sm font-medium text-gray-700">G</span>
                  </div>
                </div>
              ) : (
                <div className="mr-2 flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center border border-orange-200">
                    <span className="text-sm font-medium text-orange-700">{getUserInitial()}</span>
                  </div>
                </div>
              )}
              
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={currentUser.isGuest ? "Type your message here..." : `Ask your question ${getFirstName()}...`}
                className="flex-grow border border-orange-300 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                rows="1"
              />
              <button
                onClick={() => handleSendMessage()}
                className="ml-2 bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-lg transition-all duration-300 flex items-center justify-center"
                disabled={!userInput.trim()}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                </svg>
              </button>
            </div>
            
            {/* Footer */}
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">
                Typically replies in seconds <span className="text-orange-600 font-medium ml-1">Bot</span>
              </p>
              <button 
                onClick={handleEndChat}
                className="text-xs text-red-500 hover:text-red-700 hover:underline font-medium flex items-center"
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                End Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatSupport;