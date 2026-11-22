import React from 'react';
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaBox, FaStar, FaGift } from 'react-icons/fa';

const Products = ({
  products,
  activeForm,
  setActiveForm,
  loading,
  isAuthenticated,
  requireAuth,
  setActiveSection,
  setEditingId,
  deleteProductFromAPI,
  handleEditProduct
}) => {
  const allProducts = products.all || [...products.toys, ...products.books, ...products.workshops];

  const handleDelete = async (type, id) => {
    if (!requireAuth('delete product')) return;
    const success = await deleteProductFromAPI(id);
    if (success) {
      // Product deleted successfully
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">View Products</h1>
        <div className="flex space-x-2">
          <select
            value={activeForm}
            onChange={(e) => setActiveForm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Products</option>
            <option value="spare_part">Motorcycle Spare Parts</option>
            <option value="toy">Toys</option>
            <option value="educational_toy">Educational Toys</option>
            <option value="robotic_kit">Robotic Kits</option>
            <option value="book">Books</option>
            <option value="workshop">Workshops</option>
          </select>
          <button
            onClick={() => { setActiveSection('add'); setEditingId(null); setActiveForm('spare_part'); }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            disabled={!isAuthenticated()}
          >
            <FaPlus />
            Add Product
          </button>
        </div>
      </div>
      
      {loading.products ? (
        <div className="flex justify-center py-12">
          <FaSpinner className="animate-spin text-3xl text-blue-600" />
        </div>
      ) : allProducts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow">
          <FaBox className="text-4xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700">No products found</h3>
          <p className="text-gray-500 mt-1">Start by adding your first product</p>
          <button
            onClick={() => { setActiveForm('spare_part'); setActiveSection('add'); }}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Product
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allProducts
                  .filter(product => activeForm === 'all' || product.type === activeForm)
                  .map(product => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.images?.[0] ? (
                          <img
                            src={typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url}
                            alt={product.name}
                            className="h-10 w-10 rounded object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center">
                            <FaBox className="text-gray-400" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          product.type === 'toy' ? 'bg-blue-100 text-blue-800' :
                          product.type === 'book' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {product.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.category?.name || product.category || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{product.price}
                        {product.discount > 0 && (
                          <span className="text-xs text-green-600 ml-2">
                            ({product.discount}% off)
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          {product.isFeatured && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                              <FaStar className="mr-1" size={8} /> Featured
                            </span>
                          )}
                          {product.isNewArrival && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              <FaGift className="mr-1" size={8} /> New
                            </span>
                          )}
                          {product.type === 'toy' && product.stockStatus && (
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              product.stockStatus === 'In Stock' ? 'bg-green-100 text-green-800' :
                              product.stockStatus === 'Out of Stock' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {product.stockStatus}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditProduct(product.type, product)}
                            className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                            title="Edit"
                            disabled={!isAuthenticated()}
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(product.type, product._id)}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            title="Delete"
                            disabled={!isAuthenticated()}
                          >
                            <FaTrash />
                          </button>
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
  );
};

export default Products;