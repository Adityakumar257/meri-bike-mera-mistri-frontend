import React from 'react';
import { FaSave, FaSpinner } from 'react-icons/fa';
// ✅ Import api instance
import api from '../../services/api';

const HomePageManagement = ({
  homePageSettings,
  setHomePageSettings,
  loading,
  isAuthenticated,
  requireAuth,
  setError,
  setSuccessMessage
}) => {
  // ❌ Removed API_BASE_URL and getAuthHeaders props (handled by api.js)

  const saveHomePageSettings = async () => {
    if (!requireAuth('update home page settings')) return false;
    
    try {
      // ✅ Use api instance
      const response = await api.put('/settings/homepage', homePageSettings);
      
      if (response.data.success) {
        setSuccessMessage('Home page settings saved successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        return true;
      }
    } catch (error) {
      console.error('Error saving home page settings:', error);
      setError('Failed to save home page settings');
    }
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await saveHomePageSettings();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Home Page Management</h1>
      
      <div className="bg-white rounded-xl shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Hero Section</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hero Title *
                  </label>
                  <input
                    type="text"
                    value={homePageSettings.heroTitle}
                    onChange={(e) => setHomePageSettings({...homePageSettings, heroTitle: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={!isAuthenticated()}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hero Image URL
                  </label>
                  <input
                    type="url"
                    value={homePageSettings.heroImage}
                    onChange={(e) => setHomePageSettings({...homePageSettings, heroImage: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com/hero-image.jpg"
                    disabled={!isAuthenticated()}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hero Description *
                  </label>
                  <textarea
                    value={homePageSettings.heroDescription}
                    onChange={(e) => setHomePageSettings({...homePageSettings, heroDescription: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="2"
                    required
                    disabled={!isAuthenticated()}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Page Sections</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Featured Products Title
                  </label>
                  <input
                    type="text"
                    value={homePageSettings.featuredSectionTitle}
                    onChange={(e) => setHomePageSettings({...homePageSettings, featuredSectionTitle: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={!isAuthenticated()}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Arrivals Title
                  </label>
                  <input
                    type="text"
                    value={homePageSettings.newArrivalsTitle}
                    onChange={(e) => setHomePageSettings({...homePageSettings, newArrivalsTitle: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={!isAuthenticated()}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Testimonial Title
                  </label>
                  <input
                    type="text"
                    value={homePageSettings.testimonialTitle}
                    onChange={(e) => setHomePageSettings({...homePageSettings, testimonialTitle: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={!isAuthenticated()}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Banner Text
                  </label>
                  <input
                    type="text"
                    value={homePageSettings.bannerText}
                    onChange={(e) => setHomePageSettings({...homePageSettings, bannerText: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={!isAuthenticated()}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Section Visibility</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={homePageSettings.showTestimonials}
                    onChange={(e) => setHomePageSettings({...homePageSettings, showTestimonials: e.target.checked})}
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                    disabled={!isAuthenticated()}
                  />
                  <span className="ml-2 text-gray-700">Show Testimonials Section</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={homePageSettings.showCategories}
                    onChange={(e) => setHomePageSettings({...homePageSettings, showCategories: e.target.checked})}
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                    disabled={!isAuthenticated()}
                  />
                  <span className="ml-2 text-gray-700">Show Categories Section</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={homePageSettings.showFeatured}
                    onChange={(e) => setHomePageSettings({...homePageSettings, showFeatured: e.target.checked})}
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                    disabled={!isAuthenticated()}
                  />
                  <span className="ml-2 text-gray-700">Show Featured Products</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={homePageSettings.showNewArrivals}
                    onChange={(e) => setHomePageSettings({...homePageSettings, showNewArrivals: e.target.checked})}
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                    disabled={!isAuthenticated()}
                  />
                  <span className="ml-2 text-gray-700">Show New Arrivals</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Color Scheme</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={homePageSettings.primaryColor}
                      onChange={(e) => setHomePageSettings({...homePageSettings, primaryColor: e.target.value})}
                      className="w-12 h-12 cursor-pointer"
                      disabled={!isAuthenticated()}
                    />
                    <input
                      type="text"
                      value={homePageSettings.primaryColor}
                      onChange={(e) => setHomePageSettings({...homePageSettings, primaryColor: e.target.value})}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                      disabled={!isAuthenticated()}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secondary Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={homePageSettings.secondaryColor}
                      onChange={(e) => setHomePageSettings({...homePageSettings, secondaryColor: e.target.value})}
                      className="w-12 h-12 cursor-pointer"
                      disabled={!isAuthenticated()}
                    />
                    <input
                      type="text"
                      value={homePageSettings.secondaryColor}
                      onChange={(e) => setHomePageSettings({...homePageSettings, secondaryColor: e.target.value})}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                      disabled={!isAuthenticated()}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t">
              <button
                type="submit"
                disabled={loading.sections || !isAuthenticated()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
              >
                {loading.sections ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    Save Home Page Settings
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HomePageManagement;