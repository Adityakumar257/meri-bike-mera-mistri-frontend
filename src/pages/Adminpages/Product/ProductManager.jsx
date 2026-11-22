import React, { useState, useEffect } from 'react';
import { 
    FaUser, FaShoppingBag, FaStar, FaPlus, FaSearch, FaTimes, FaCheckCircle,
    FaPuzzlePiece, FaRunning, FaRobot, FaBookOpen, FaChevronDown, FaChevronRight
} from 'react-icons/fa';
import { UserProvider, useUser } from './context/UserContext.jsx';

// Components Imports
import Login from './components/Login.jsx';
import Products from './Products.jsx';
import FeaturedProducts from './FeaturedProducts.jsx';
import NewArrivals from './NewArrivals.jsx';
import ProductSearch from './ProductSearch.jsx';
import AddProduct from './components/ProductForm.jsx'; 
import SpecialProducts from './SpecialProducts.jsx'; 

const MainApp = () => {
  const [activeSection, setActiveSection] = useState('products');
  const [activeForm, setActiveForm] = useState('educational_toy');
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [openDropdown, setOpenDropdown] = useState(''); 

  const { currentUser, login, logout } = useUser();
  // ❌ Removed hardcoded API_BASE_URL (Child components use api.js now)

  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => { setError(''); setSuccessMessage(''); }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, successMessage]);

  if (!currentUser) return <Login onLogin={login} />;

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? '' : id);
  };

  const SidebarLink = ({ section, icon, label, onClick }) => (
    <button 
      onClick={onClick || (() => setActiveSection(section))} 
      className={`w-full text-left px-6 py-3 flex items-center transition-colors ${
        activeSection === section 
          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 border-r-4 border-blue-600' 
          : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      <span className="mr-3">{icon}</span>
      {label}
    </button>
  );

  const DropdownParent = ({ id, icon, label, children }) => {
     const isOpen = openDropdown === id;
     return (
        <div>
            <button 
                onClick={() => toggleDropdown(id)}
                className={`w-full text-left px-6 py-3 flex items-center justify-between transition-colors text-gray-700 hover:bg-gray-50 font-medium`}
            >
                <div className="flex items-center">
                    <span className="mr-3 text-lg">{icon}</span>
                    {label}
                </div>
                {isOpen ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
            </button>
            {isOpen && <div className="bg-gray-50 py-1">{children}</div>}
        </div>
     );
  };

  const DropdownItem = ({ section, label, onClick }) => (
    <button
        onClick={onClick || (() => setActiveSection(section))}
        className={`w-full text-left pl-14 pr-6 py-2 text-sm flex items-center transition-colors ${
            activeSection === section ? 'text-blue-600 font-semibold' : 'text-gray-500 hover:text-gray-800'
        }`}
    >
        {activeSection === section && <FaCheckCircle size={10} className="mr-2" />}
        {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Navigation Sidebar */}
        <div className="w-64 bg-white min-h-screen shadow-lg border-r border-gray-200 sticky top-0 h-screen overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                <FaUser className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800 truncate w-32">{currentUser.name}</h1>
                <p className="text-xs text-gray-500">Product Manager</p>
              </div>
            </div>
          </div>
          
          <nav className="mt-6 pb-20">
            <div className="px-4 mb-2"><p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Inventory</p></div>
            
            <SidebarLink section="products" icon={<FaShoppingBag />} label="All Products" />
            <SidebarLink section="search" icon={<FaSearch />} label="Search Products" />
            <SidebarLink section="add-product" icon={<FaPlus />} label="Add Product" />

            <div className="px-4 mt-6 mb-2"><p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Collections</p></div>
            
            <SidebarLink section="featured" icon={<FaStar />} label="Featured Products" />
            <SidebarLink section="new-arrivals" icon={<FaPlus className="text-green-600" />} label="All New Arrivals" />
            
            <div className="px-4 mt-6 mb-2"><p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Categories</p></div>

            {/* 1. Educational Toys Dropdown */}
            <DropdownParent id="toys" icon={<FaPuzzlePiece className="text-blue-500" />} label="Educational Toys">
                <DropdownItem section="edu-all" label="All Toys" onClick={() => { setActiveSection('products'); }} />
                <DropdownItem section="edu-open" label="Open Ended Play" />
                <DropdownItem section="edu-action" label="Action Figures" />
                <DropdownItem section="edu-set" label="Educational Sets" />
                <DropdownItem section="edu-new" label="New Arrival Toys" />
            </DropdownParent>

            {/* 2. Robotic Kits Dropdown */}
            <DropdownParent id="robotics" icon={<FaRobot className="text-orange-500" />} label="Robotic Kits">
                <DropdownItem section="robo-all" label="All Kits" />
                <DropdownItem section="robo-new" label="New Arrival Kits" />
            </DropdownParent>

            {/* 3. Books Dropdown */}
            <DropdownParent id="books" icon={<FaBookOpen className="text-purple-500" />} label="Books">
                <DropdownItem section="books-all" label="All Books" />
                <DropdownItem section="books-new" label="New Arrival Books" />
            </DropdownParent>
            
            <div className="px-6 py-4 mt-8 border-t border-gray-200">
              <button onClick={logout} className="w-full px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:from-red-600 hover:to-pink-700 flex items-center justify-center shadow-sm"><FaTimes className="mr-2" /> Logout</button>
            </div>
          </nav>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-x-hidden">
          {error && <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4"><div className="flex"><FaTimes className="text-red-400 mr-3" /><p className="text-sm text-red-700">{error}</p></div></div>}
          {successMessage && <div className="bg-green-50 border-l-4 border-green-500 p-4 m-4"><div className="flex"><FaCheckCircle className="text-green-400 mr-3" /><p className="text-sm text-green-700">{successMessage}</p></div></div>}
          
          {/* Default Views - API_BASE_URL prop removed */}
          {activeSection === 'products' && <Products activeSection={activeSection} setActiveSection={setActiveSection} setError={setError} setSuccessMessage={setSuccessMessage} setEditingId={setEditingId} setActiveForm={setActiveForm} />}
          {activeSection === 'featured' && <FeaturedProducts setActiveSection={setActiveSection} setActiveForm={setActiveForm} setEditingId={setEditingId} setError={setError} setSuccessMessage={setSuccessMessage} />}
          {activeSection === 'new-arrivals' && <NewArrivals setActiveSection={setActiveSection} setActiveForm={setActiveForm} setEditingId={setEditingId} setError={setError} setSuccessMessage={setSuccessMessage} />}
          {activeSection === 'search' && <ProductSearch setActiveSection={setActiveSection} setActiveForm={setActiveForm} setEditingId={setEditingId} setError={setError} />}
          {activeSection === 'add-product' && <AddProduct currentUser={currentUser} activeForm={activeForm} setActiveForm={setActiveForm} editingId={editingId} setEditingId={setEditingId} setError={setError} setSuccessMessage={setSuccessMessage} setActiveSection={setActiveSection} />}

          {/* --- Dropdown Views --- */}
          
          {/* Educational Toys Views */}
          {activeSection === 'edu-open' && <SpecialProducts categoryType="educational_toy" type="isOpenEndedPlay" title="Open Ended Play Toys" icon={<FaPuzzlePiece />} setActiveSection={setActiveSection} setActiveForm={setActiveForm} setEditingId={setEditingId} setError={setError} setSuccessMessage={setSuccessMessage} />}
          {activeSection === 'edu-action' && <SpecialProducts categoryType="educational_toy" type="isActionFigure" title="Action Figures" icon={<FaRunning />} setActiveSection={setActiveSection} setActiveForm={setActiveForm} setEditingId={setEditingId} setError={setError} setSuccessMessage={setSuccessMessage} />}
          {activeSection === 'edu-set' && <SpecialProducts categoryType="educational_toy" type="isEducationalToy" title="Educational Sets" icon={<FaRobot />} setActiveSection={setActiveSection} setActiveForm={setActiveForm} setEditingId={setEditingId} setError={setError} setSuccessMessage={setSuccessMessage} />}
          {activeSection === 'edu-new' && <SpecialProducts categoryType="educational_toy" type="isNewArrival" title="New Arrival Toys" icon={<FaStar />} setActiveSection={setActiveSection} setActiveForm={setActiveForm} setEditingId={setEditingId} setError={setError} setSuccessMessage={setSuccessMessage} />}

          {/* Robotic Kits Views */}
          {activeSection === 'robo-all' && <SpecialProducts categoryType="robotic_kit" type="all" title="All Robotic Kits" icon={<FaRobot />} setActiveSection={setActiveSection} setActiveForm={setActiveForm} setEditingId={setEditingId} setError={setError} setSuccessMessage={setSuccessMessage} />}
          {activeSection === 'robo-new' && <SpecialProducts categoryType="robotic_kit" type="isNewArrival" title="New Robotic Kits" icon={<FaRobot />} setActiveSection={setActiveSection} setActiveForm={setActiveForm} setEditingId={setEditingId} setError={setError} setSuccessMessage={setSuccessMessage} />}

          {/* Books Views */}
          {activeSection === 'books-all' && <SpecialProducts categoryType="book" type="all" title="All Books" icon={<FaBookOpen />} setActiveSection={setActiveSection} setActiveForm={setActiveForm} setEditingId={setEditingId} setError={setError} setSuccessMessage={setSuccessMessage} />}
          {activeSection === 'books-new' && <SpecialProducts categoryType="book" type="isNewArrival" title="New Books" icon={<FaBookOpen />} setActiveSection={setActiveSection} setActiveForm={setActiveForm} setEditingId={setEditingId} setError={setError} setSuccessMessage={setSuccessMessage} />}
        </div>
      </div>
    </div>
  );
};

const ProductManager = () => (<UserProvider><MainApp /></UserProvider>);

export default ProductManager;