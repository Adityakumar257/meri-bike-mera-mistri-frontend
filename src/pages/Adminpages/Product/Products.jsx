import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaSpinner,
  FaTrash,
  FaSearch,
  FaFilter,
  FaUser,
  FaStar,
  FaImage,
  FaTable,
  FaTh,
  FaCheckCircle,
  FaTimes,
  FaExclamationTriangle,
  FaEdit,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
// ✅ Import ProductService
import { ProductService } from '../../../services/api';
import { useUser } from "./context/UserContext.jsx";
import DashboardStats from "./components/DashboardStats.jsx";

const Products = ({
  activeSection,
  setActiveSection,
  setError,
  setSuccessMessage,
  setEditingId,
  setActiveForm,
}) => {
  const { currentUser } = useUser();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [bulkDeleteLoading, setBulkDeleteLoading] = useState(false);
  const [showUserFilter, setShowUserFilter] = useState(false);
  const [viewMode, setViewMode] = useState("table");
  const ITEMS_PER_PAGE = 10;

  // ❌ Removed API_BASE_URL prop

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage, filterType, filterStatus, showUserFilter]);

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: ITEMS_PER_PAGE,
      };
      
      if (searchTerm) params.search = searchTerm;
      if (filterType !== "all") params.type = filterType;
      if (filterStatus !== "all") params.status = filterStatus;
      if (showUserFilter && currentUser?.id) params.userId = currentUser.id;

      // ✅ Use ProductService.getAll with params
      const response = await ProductService.getAll(params);
      
      if (response.data.success) {
        setProducts(response.data.data || []);
        setTotalPages(response.data.meta?.pagination?.pages || 1);
        setTotalProducts(response.data.meta?.pagination?.total || 0);
      } else {
        setError("Failed to load products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products. Please try again.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) {
      setError("Please select products to delete");
      return;
    }
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedProducts.length} product(s)? This action cannot be undone.`
      )
    ) {
      return;
    }
    setBulkDeleteLoading(true);
    try {
      // ✅ Use ProductService.bulkDelete
      const response = await ProductService.bulkDelete({
        productIds: selectedProducts,
        userId: currentUser?.id || "public_user",
      });

      if (response.data.success) {
        setSuccessMessage(
          `${selectedProducts.length} product(s) deleted successfully!`
        );
        setSelectedProducts([]);
        fetchProducts(currentPage);
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setError("Failed to delete products");
      }
    } catch (error) {
      console.error("Error bulk deleting products:", error);
      setError(error.message || "Failed to delete products");
    } finally {
      setBulkDeleteLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id || id === "undefined") {
      setError("Invalid product ID");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }
    try {
      // ✅ Use ProductService.delete
      const response = await ProductService.delete(id);
      
      if (response.data.success) {
        setSuccessMessage("Product deleted successfully!");
        fetchProducts(currentPage);
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setError("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      setError(error.message || "Failed to delete product");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts(1);
  };

  const toggleProductSelection = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id)
        ? prev.filter((productId) => productId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((product) => product.id || product._id));
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchProducts(page);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterType("all");
    setFilterStatus("all");
    setShowUserFilter(false);
    setCurrentPage(1);
    fetchProducts(1);
  };

  // ✅ Helper to show detailed type name (Removed Workshop Logic)
  const getProductTypeLabel = (product) => {
    return product.type?.charAt(0).toUpperCase() + product.type?.slice(1);
  };

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <div
          key={product.id || product._id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden"
        >
          <div className="relative h-48 bg-gray-100">
            {product.images && product.images[0] ? (
              <img
                src={product.images[0].url || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=No+Image";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FaImage className="text-gray-300 text-4xl" />
              </div>
            )}
            <div className="absolute top-3 left-3 flex flex-col gap-1">
              {product.isFeatured && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  Featured
                </span>
              )}
              {product.isNewArrival && (
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  New
                </span>
              )}
            </div>
            <div className="absolute top-3 right-3">
              <input
                type="checkbox"
                checked={selectedProducts.includes(product.id || product._id)}
                onChange={() =>
                  toggleProductSelection(product.id || product._id)
                }
                className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 truncate">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {product.categoryName ||
                    product.category?.name ||
                    "Uncategorized"}
                </p>
              </div>
              <span
                className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                  product.type === "toy"
                    ? "bg-green-100 text-green-800"
                    : product.type === "book"
                    ? "bg-purple-100 text-purple-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {getProductTypeLabel(product)}
              </span>
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-gray-900">
                    ₹{product.price?.toFixed(2) || "0.00"}
                  </span>
                  {product.discount > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 line-through">
                        ₹{product.originalPrice?.toFixed(2) || "0.00"}
                      </span>
                      <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">
                        {product.discount}% off
                      </span>
                    </div>
                  )}
                </div>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    product.status === "active"
                      ? "bg-green-100 text-green-800"
                      : product.status === "inactive"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {product.status?.charAt(0).toUpperCase() +
                    product.status?.slice(1)}
                </span>
              </div>

              {product.rating > 0 && (
                <div className="flex items-center mt-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`text-sm ${
                          i < Math.floor(product.rating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {product.rating?.toFixed(1) || "0.0"}
                      {product.ratingCount > 0 && (
                        <span className="text-xs text-gray-500 ml-1">
                          ({product.ratingCount})
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <FaUser className="mr-1" size={12} />
                  <span className="truncate max-w-[120px]">
                    {product.createdByName || product.createdBy || "Unknown"}
                  </span>
                  {currentUser?.id === product.createdBy && (
                    <span className="ml-1 text-xs text-blue-600">(You)</span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingId(product.id || product._id);
                      setActiveForm(product.type || "toy");
                      setActiveSection("add-product");
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id || product._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTableView = () => (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left">
              <input
                type="checkbox"
                checked={
                  products.length > 0 &&
                  selectedProducts.length === products.length
                }
                onChange={toggleSelectAll}
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Product
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created By
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rating
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr
              key={product.id || product._id}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="px-6 py-4">
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product.id || product._id)}
                  onChange={() =>
                    toggleProductSelection(product.id || product._id)
                  }
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    {product.images && product.images[0] ? (
                      <img
                        className="h-12 w-12 object-cover"
                        src={product.images[0].url || product.images[0]}
                        alt={product.name}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/150";
                        }}
                      />
                    ) : (
                      <div className="h-12 w-12 flex items-center justify-center">
                        <FaImage className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="ml-2 flex gap-1">
                        {product.isFeatured && (
                          <span className="px-1.5 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">
                            F
                          </span>
                        )}
                        {product.isNewArrival && (
                          <span className="px-1.5 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                            N
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {product.categoryName ||
                        product.category?.name ||
                        "Uncategorized"}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    product.type === "toy"
                      ? "bg-green-100 text-green-800"
                      : product.type === "book"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {getProductTypeLabel(product)}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center text-sm text-gray-900">
                  <FaUser className="text-gray-400 mr-2" size={12} />
                  <div>
                    <div>
                      {product.createdByName ||
                        product.createdBy ||
                        "Unknown User"}
                    </div>
                    {currentUser?.id === product.createdBy && (
                      <span className="text-xs text-blue-600">(You)</span>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">
                  ₹{product.price?.toFixed(2) || "0.00"}
                </div>
                {product.discount > 0 && (
                  <>
                    <div className="text-xs text-gray-500 line-through">
                      ₹{product.originalPrice?.toFixed(2) || "0.00"}
                    </div>
                    <div className="text-xs text-green-600">
                      {product.discount}% off
                    </div>
                  </>
                )}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`text-xs ${
                          i < Math.floor(product.rating || 0)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-700">
                    {product.rating?.toFixed(1) || "0.0"}
                  </span>
                  {product.ratingCount > 0 && (
                    <span className="ml-1 text-xs text-gray-500">
                      ({product.ratingCount})
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    product.status === "active"
                      ? "bg-green-100 text-green-800"
                      : product.status === "inactive"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {product.status?.charAt(0).toUpperCase() +
                    product.status?.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setEditingId(product.id || product._id);
                      setActiveForm(product.type || "toy");
                      setActiveSection("add-product");
                    }}
                    className="text-blue-600 hover:text-blue-900 flex items-center text-sm font-medium"
                    title="Edit"
                  >
                    <FaEdit className="mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id || product._id)}
                    className="text-red-600 hover:text-red-900 flex items-center text-sm font-medium"
                    title="Delete"
                  >
                    <FaTrash className="mr-1" /> Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (loading && products.length === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <FaSpinner className="animate-spin text-3xl text-blue-600 mr-3" />
          <span className="text-lg text-gray-600">Loading products...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-gray-800">Products</h1>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full flex items-center">
              <FaUser className="mr-1" size={12} />{" "}
              {currentUser?.name || "Guest"}
            </span>
          </div>
          <p className="text-gray-600 mt-1">Manage your products inventory</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <button
            onClick={() => {
              setActiveForm("toy");
              setActiveSection("add-product");
              setEditingId(null);
            }}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 flex items-center shadow-sm"
          >
            <FaPlus className="mr-2" /> Add Product
          </button>
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-2 ${
                viewMode === "table"
                  ? "bg-blue-50 text-blue-600"
                  : "bg-white text-gray-600"
              }`}
            >
              <FaTable />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-2 ${
                viewMode === "grid"
                  ? "bg-blue-50 text-blue-600"
                  : "bg-white text-gray-600"
              }`}
            >
              <FaTh />
            </button>
          </div>
        </div>
      </div>

      <DashboardStats />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
            <div className="flex items-center space-x-2">
              <FaFilter className="text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value);
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="all">All Types</option>
                <option value="toy">Toys</option>
                <option value="book">Books</option>
                <option value="educational">Educational</option>
                <option value="game">Games</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <FaCheckCircle className="text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            {currentUser && (
              <button
                onClick={() => {
                  setShowUserFilter(!showUserFilter);
                  setCurrentPage(1);
                }}
                className={`px-3 py-2 rounded-lg flex items-center space-x-2 text-sm ${
                  showUserFilter
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <FaUser size={14} />{" "}
                <span>{showUserFilter ? "All Products" : "My Products"}</span>
              </button>
            )}
            {(searchTerm ||
              filterType !== "all" ||
              filterStatus !== "all" ||
              showUserFilter) && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center space-x-2 text-sm"
              >
                <FaTimes size={14} /> <span>Clear Filters</span>
              </button>
            )}
          </div>
          <form onSubmit={handleSearch} className="flex">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-600"
              >
                <FaSearch />
              </button>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
            >
              Search
            </button>
          </form>
        </div>
        {selectedProducts.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FaExclamationTriangle className="text-blue-600" />
                <span className="text-sm text-blue-800">
                  {selectedProducts.length} product(s) selected
                </span>
              </div>
              <button
                onClick={handleBulkDelete}
                disabled={bulkDeleteLoading}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center"
              >
                {bulkDeleteLoading ? (
                  <FaSpinner className="animate-spin mr-1" />
                ) : (
                  <FaTrash className="mr-1" />
                )}{" "}
                Delete Selected
              </button>
            </div>
          </div>
        )}
      </div>

      {products.length === 0 && !loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <FaSearch className="text-gray-300 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            {searchTerm || filterType !== "all" || filterStatus !== "all"
              ? "Try changing your search criteria or filters"
              : "Get started by adding your first product"}
          </p>
          <button
            onClick={() => {
              setActiveForm("toy");
              setActiveSection("add-product");
              setEditingId(null);
            }}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 flex items-center mx-auto shadow-sm"
          >
            <FaPlus className="mr-2" /> Add Your First Product
          </button>
        </div>
      ) : viewMode === "grid" ? (
        renderGridView()
      ) : (
        renderTableView()
      )}

      {totalPages > 1 && (
        <div className="mt-8 bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(currentPage * ITEMS_PER_PAGE, totalProducts)}
                </span>{" "}
                of <span className="font-medium">{totalProducts}</span> results
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 flex items-center text-sm"
              >
                <FaArrowLeft className="mr-2" /> Previous
              </button>
              <div className="hidden sm:flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) pageNum = i + 1;
                  else if (currentPage <= 3) pageNum = i + 1;
                  else if (currentPage >= totalPages - 2)
                    pageNum = totalPages - 4 + i;
                  else pageNum = currentPage - 2 + i;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      className={`w-10 h-10 flex items-center justify-center border text-sm font-medium rounded-lg ${
                        currentPage === pageNum
                          ? "bg-blue-50 border-blue-500 text-blue-600"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 flex items-center text-sm"
              >
                Next <FaArrowRight className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;