import React, { useState, useEffect } from 'react';
import { FaShoppingBag, FaStar, FaPlus, FaExclamationTriangle } from 'react-icons/fa';
// ✅ Import ProductService from centralized API
import { ProductService } from '../../../../services/api';

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalUsers: 0,
    totalOrders: 0,
    featuredProducts: 0,
    newArrivals: 0,
    lowStock: 0
  });
  const [loading, setLoading] = useState(true);

  // ❌ Removed hardcoded API_BASE_URL (Handled in api.js)

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // ✅ Use ProductService for all calls
      const [productsRes, statsRes, lowStockRes] = await Promise.all([
        ProductService.getAll({ limit: 1 }), // Just for total count from pagination meta
        ProductService.getStats(),
        ProductService.getLowStock()
      ]);

      if (productsRes.data.success && statsRes.data.success) {
        const overall = statsRes.data.data.overall || {};
        const lowStockData = lowStockRes.data?.data || [];
        
        setStats({
          totalProducts: productsRes.data.meta?.pagination?.total || 0,
          totalCategories: 0, // You might want CategoryService.getStats() here if available
          totalUsers: 0,
          totalOrders: 0,
          featuredProducts: overall.featuredProducts || 0,
          newArrivals: overall.newArrivals || 0,
          lowStock: lowStockData.length || 0
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({
        totalProducts: 0, totalCategories: 0, totalUsers: 0, totalOrders: 0,
        featuredProducts: 0, newArrivals: 0, lowStock: 0
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    { title: 'Total Products', value: stats.totalProducts, icon: <FaShoppingBag className="text-blue-600 text-2xl" />, color: 'bg-blue-50 border-blue-200', description: 'All products in store' },
    { title: 'Featured Products', value: stats.featuredProducts, icon: <FaStar className="text-yellow-600 text-2xl" />, color: 'bg-yellow-50 border-yellow-200', description: 'Featured items' },
    { title: 'New Arrivals', value: stats.newArrivals, icon: <FaPlus className="text-green-600 text-2xl" />, color: 'bg-green-50 border-green-200', description: 'Recently added' },
    { title: 'Low Stock', value: stats.lowStock, icon: <FaExclamationTriangle className="text-red-600 text-2xl" />, color: 'bg-red-50 border-red-200', description: 'Need restocking' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <div key={index} className={`${stat.color} border rounded-xl p-6 hover:shadow-md transition-shadow`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-2">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-800">{stat.value.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
            </div>
            <div className="p-3 bg-white rounded-lg shadow-sm">
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;