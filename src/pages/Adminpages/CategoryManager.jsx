import React, { useState, useEffect } from 'react';
import { 
    FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaSpinner,
    FaTags, FaChild, FaBuilding, FaFilter, FaEye
} from 'react-icons/fa';
// ✅ Import CategoryService
import { CategoryService, ProductService } from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';

const CategoryManager = ({
    fetchCategories: refreshParentCategories,
    setActiveSection,
    setActiveForm,
    setEditingId,
    setInitialProductCategoryId
}) => {
    const { t } = useLanguage();
    // ❌ Removed API_BASE_URL and getAuthHeaders (handled by api.js)

    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [editingId, setCategoryEditingId] = useState(null);
    const [newCategory, setNewCategory] = useState({ 
        name: '', 
        type: 'category',
        slug: '',
        shortDescription: '',
        isActive: true,
        featured: false,
        showInMenu: true,
        menuOrder: 0,
        badgeText: '',
        icon: ''
    });
    
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryProducts, setCategoryProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(false);
    const [productsError, setProductsError] = useState('');
    
    // Fetch all categories
    const fetchCategories = async () => {
        setLoading(true);
        try {
            // ✅ Use CategoryService
            const response = await CategoryService.getAdminAll();
            
            console.log('API Response:', response.data); 
            if (response.data.success) {
                setCategories(response.data.data);
                if (refreshParentCategories) {
                    refreshParentCategories();
                }
            }
        } catch (error) {
            console.error('Full Error Details:', error);
            
            if (error.message === "Network Error") {
                setError('Network Error: No response from server. Check if server is running.');
            } else {
                setError(`Error: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };
    
    // Fetch on mount
    useEffect(() => {
        fetchCategories();
    }, []);

    const viewCategoryProducts = async (category) => {
        setSelectedCategory(category);
        setProductsLoading(true);
        setProductsError('');
        setCategoryProducts([]);
        try {
            const response = await ProductService.getAdminAll({ category: category._id, limit: 500 });
            if (!response.data.success) {
                throw new Error(response.data.message || 'Could not load products');
            }
            setCategoryProducts(response.data.data || []);
        } catch (requestError) {
            setProductsError(requestError.response?.data?.message || requestError.message || 'Could not load products');
        } finally {
            setProductsLoading(false);
        }
    };

    const addProductToCategory = (category) => {
        if (category?.isActive === false) return;
        setCategoryEditingId(null);
        setInitialProductCategoryId(category?._id || '');
        setActiveForm('spare_part');
        setActiveSection('add');
    };
    
    // Handle form submission
    const handleSubmitCategory = async (e) => {
        e.preventDefault();
        
        if (!newCategory.name.trim()) {
            alert(t('Please enter category name'));
            return;
        }
        
        try {
            setLoading(true);
            setError('');
            setSuccessMessage('');
            
            // Generate slug if not provided
            const slug = newCategory.slug || 
                newCategory.name.toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^a-z0-9-]/g, '');
            
            const categoryData = {
                name: newCategory.name.trim(),
                slug: slug,
                description: newCategory.shortDescription || '',
                type: newCategory.type,
                icon: newCategory.icon || '',
                order: newCategory.menuOrder || 0,
                featured: Boolean(newCategory.featured),
                isActive: Boolean(newCategory.isActive),
                metaTitle: newCategory.badgeText || '',
                showInMenu: Boolean(newCategory.showInMenu),
                ...(newCategory.type === 'age-group' && {
                    filterAttributes: {
                        ageRange: { min: 0, max: 18 }
                    }
                })
            };
            
            let response;
            
            if (editingId) {
                // ✅ Use CategoryService.update
                response = await CategoryService.update(editingId, categoryData);
            } else {
                // ✅ Use CategoryService.create
                response = await CategoryService.create(categoryData);
            }
            
            if (response.data.success) {
                setSuccessMessage(response.data.message || 'Category saved successfully!');
                resetForm();
                fetchCategories();
                setTimeout(() => setSuccessMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error saving category:', error);
            setError(error.message || 'Error saving category');
            setTimeout(() => setError(''), 5000);
        } finally {
            setLoading(false);
        }
    };
    
    // Handle edit category
    const handleEditCategory = (category) => {
        setNewCategory({
            name: category.name,
            type: category.type,
            slug: category.slug || '',
            shortDescription: category.description || '',
            isActive: category.isActive,
            featured: category.featured || false,
            showInMenu: category.showInMenu !== false,
            menuOrder: category.order || 0,
            badgeText: category.metaTitle || '',
            icon: category.icon || ''
        });
        
        setCategoryEditingId(category._id);
        setShowCategoryForm(true);
    };
    
    // Handle delete category
    const handleDeleteCategory = async (category) => {
        if (!window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
            return;
        }
        
        try {
            setError('');
            setSuccessMessage('');
            
            // ✅ Use CategoryService.delete
            const response = await CategoryService.delete(category._id);
            
            if (response.data.success) {
                setSuccessMessage(response.data.message || 'Category deleted successfully!');
                fetchCategories();
                setTimeout(() => setSuccessMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            setError(error.message || 'Error deleting category');
            setTimeout(() => setError(''), 5000);
        }
    };
    
    // Reset form
    const resetForm = () => {
        setNewCategory({ 
            name: '', 
            type: 'category',
            slug: '',
            shortDescription: '',
            isActive: true,
            featured: false,
            showInMenu: true,
            menuOrder: 0,
            badgeText: '',
            icon: ''
        });
        setCategoryEditingId(null);
        setShowCategoryForm(false);
        setError('');
        setSuccessMessage('');
    };
    
    // Filter categories
    const filteredCategories = categories.filter(cat => {
        if (filterType !== 'all' && cat.type !== filterType) return false;
        if (searchTerm && !cat.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
    });
    
    // Group by type
    const categoriesByType = filteredCategories.reduce((acc, cat) => {
        if (!acc[cat.type]) acc[cat.type] = [];
        acc[cat.type].push(cat);
        return acc;
    }, {});
    
    const getTypeIcon = (type) => {
        switch(type) {
            case 'brand': return <FaBuilding className="text-blue-500" />;
            case 'category': return <FaTags className="text-green-500" />;
            case 'age-group': return <FaChild className="text-purple-500" />;
            default: return <FaTags className="text-gray-500" />;
        }
    };
    
    const getTypeLabel = (type) => {
        switch(type) {
            case 'brand': return 'Brands';
            case 'category': return 'Categories';
            case 'age-group': return 'Age Groups';
            default: return 'Categories';
        }
    };
    
    // Handle parent selection
    const handleSelectParent = (parentId) => {
        setNewCategory({...newCategory, parent: parentId});
    };
    
    return (
        <div className="p-6">
            {/* Messages */}
            {successMessage && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
                    ✅ {successMessage}
                </div>
            )}
            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                    ❌ {error}
                </div>
            )}
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{t('Category Manager')}</h1>
                    <p className="text-gray-600 mt-2">{t('Manage Brands, Categories, and Age Groups')}</p>
                </div>
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-48">
                        <input
                            type="text"
                            placeholder={t('Search categories...')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <FaFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">{t('All Types')}</option>
                        <option value="brand">{t('Brands')}</option>
                        <option value="category">{t('Categories')}</option>
                        <option value="age-group">{t('Age Groups')}</option>
                    </select>
                    <button
                        onClick={() => {
                            resetForm();
                            setShowCategoryForm(true);
                        }}
                        className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                    >
                        <FaPlus />
                        Add New
                    </button>
                </div>
            </div>
            
            {/* Category Form */}
            {showCategoryForm && (
                <div className="mb-8 bg-white rounded-xl shadow-lg p-6 border border-blue-200">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-800">
                            {editingId ? 'Edit Category' : 'Add New Category'}
                        </h3>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmitCategory}
                                disabled={loading || !newCategory.name.trim()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
                            >
                                {loading ? (
                                    <>
                                        <FaSpinner className="animate-spin mr-2" />
                                        {editingId ? 'Updating...' : 'Saving...'}
                                    </>
                                ) : (
                                    <>
                                        <FaSave className="mr-2" />
                                        {editingId ? 'Update' : 'Save'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Type *
                                </label>
                                <select
                                    value={newCategory.type}
                                    onChange={(e) => setNewCategory({...newCategory, type: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    <option value="category">{t('Category')}</option>
                                    <option value="brand">{t('Brand')}</option>
                                    <option value="age-group">{t('Age Group')}</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    value={newCategory.name}
                                    onChange={(e) => {
                                        const name = e.target.value;
                                        setNewCategory({
                                            ...newCategory, 
                                            name,
                                            slug: newCategory.slug || name.toLowerCase()
                                                .replace(/\s+/g, '-')
                                                .replace(/[^a-z0-9-]/g, '')
                                        });
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder={t('Enter name')}
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Slug
                                </label>
                                <input
                                    type="text"
                                    value={newCategory.slug}
                                    onChange={(e) => setNewCategory({...newCategory, slug: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder={t('auto-generated-slug')}
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={newCategory.shortDescription}
                                    onChange={(e) => setNewCategory({...newCategory, shortDescription: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder={t('Enter description')}
                                    rows="3"
                                />
                            </div>
                            
                            {/* Parent Category Dropdown */}
                            {newCategory.type === 'category' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Parent Category
                                    </label>
                                    <select
                                        value={newCategory.parent || ''}
                                        onChange={(e) => handleSelectParent(e.target.value || null)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">{t('None (Main Category)')}</option>
                                        {categories
                                            .filter(cat => cat.type === 'category' && cat._id !== editingId)
                                            .map(cat => (
                                                <option key={cat._id} value={cat._id}>
                                                    {cat.name}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>
                            )}
                        </div>
                        
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Menu Order
                                    </label>
                                    <input
                                        type="number"
                                        value={newCategory.menuOrder}
                                        onChange={(e) => setNewCategory({...newCategory, menuOrder: parseInt(e.target.value) || 0})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder={t('0')}
                                        min="0"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Badge Text
                                    </label>
                                    <input
                                        type="text"
                                        value={newCategory.badgeText}
                                        onChange={(e) => setNewCategory({...newCategory, badgeText: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder={t('New, Sale, etc.')}
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Icon (Font Awesome class)
                                </label>
                                <input
                                    type="text"
                                    value={newCategory.icon}
                                    onChange={(e) => setNewCategory({...newCategory, icon: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder={t('fas fa-tag')}
                                />
                            </div>
                            
                            <div className="grid grid-cols-3 gap-3 pt-4">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={newCategory.isActive}
                                        onChange={(e) => setNewCategory({...newCategory, isActive: e.target.checked})}
                                        className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 mr-2"
                                    />
                                    <span className="text-sm text-gray-700">{t('Active')}</span>
                                </label>
                                
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={newCategory.featured}
                                        onChange={(e) => setNewCategory({...newCategory, featured: e.target.checked})}
                                        className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 mr-2"
                                    />
                                    <span className="text-sm text-gray-700">{t('Featured')}</span>
                                </label>
                                
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={newCategory.showInMenu}
                                        onChange={(e) => setNewCategory({...newCategory, showInMenu: e.target.checked})}
                                        className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 mr-2"
                                    />
                                    <span className="text-sm text-gray-700">{t('Show in Menu')}</span>
                                </label>
                            </div>
                            
                            {/* Additional Actions */}
                            <div className="pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (window.confirm('Reset all form data?')) {
                                            resetForm();
                                        }
                                    }}
                                    className="text-sm text-gray-600 hover:text-gray-800"
                                >
                                    Reset Form
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {selectedCategory && (
                <section className="mb-6 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                    <div className="flex items-center justify-between gap-4 p-4 border-b border-gray-200">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">{selectedCategory.name} Products</h2>
                            <p className="text-sm text-gray-500">{t('All product statuses in this category')}</p>
                        </div>
                        <div className="flex gap-2">
                            {selectedCategory.isActive && (
                                <button onClick={() => addProductToCategory(selectedCategory)} className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                    <FaPlus className="inline mr-2" /> Add Product
                                </button>
                            )}
                            <button onClick={() => setSelectedCategory(null)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg" aria-label={t('Close products')}>
                                <FaTimes />
                            </button>
                        </div>
                    </div>
                    {productsError && <p className="p-4 text-sm text-red-700 bg-red-50">{productsError}</p>}
                    {productsLoading ? (
                        <div className="py-8 flex justify-center"><FaSpinner className="animate-spin text-blue-600 text-2xl" /></div>
                    ) : categoryProducts.length ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('Product')}</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('SKU')}</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('Stock')}</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('Status')}</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t('Action')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {categoryProducts.map(product => (
                                        <tr key={product._id}>
                                            <td className="px-4 py-3 text-sm text-gray-900">{product.name}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{product.sku || '-'}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{product.stockQuantity ?? 0}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{product.status}</td>
                                            <td className="px-4 py-3 text-right">
                                                <button
                                                    onClick={() => {
                                                        setEditingId(product._id);
                                                        setActiveForm(product.type || 'spare_part');
                                                        setActiveSection('add');
                                                    }}
                                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        !productsError && <p className="p-6 text-sm text-gray-500">{t('No products in this category yet.')}</p>
                    )}
                </section>
            )}
            
            {/* Categories List */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                    <FaSpinner className="animate-spin text-blue-600 text-3xl mb-4" />
                    <p className="text-gray-600">{t('Loading categories...')}</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {['category', 'brand', 'age-group'].map(type => (
                        <div key={type} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                            <div className={`px-4 py-3 border-b ${
                                type === 'brand' ? 'bg-blue-50' :
                                type === 'category' ? 'bg-green-50' :
                                'bg-purple-50'
                            }`}>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                        <div className={`p-2 rounded-lg mr-3 ${
                                            type === 'brand' ? 'bg-blue-100' :
                                            type === 'category' ? 'bg-green-100' :
                                            'bg-purple-100'
                                        }`}>
                                            {getTypeIcon(type)}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800">
                                                {getTypeLabel(type)}
                                            </h3>
                                            <p className="text-xs text-gray-600">
                                                {categoriesByType[type]?.length || 0} items
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setNewCategory({...newCategory, type});
                                            setShowCategoryForm(true);
                                        }}
                                        className="text-xs px-3 py-1 bg-white border rounded-full hover:bg-gray-50"
                                    >
                                        + Add
                                    </button>
                                </div>
                            </div>
                            
                            <div className="p-4">
                                {!categoriesByType[type] || categoriesByType[type].length === 0 ? (
                                    <div className="text-center py-8">
                                        <div className="inline-block p-3 rounded-full bg-gray-100 mb-3">
                                            {getTypeIcon(type)}
                                        </div>
                                        <p className="text-gray-600 mb-2">{t('No')} {t(getTypeLabel(type).toLowerCase())} {t('found')}</p>
                                        <button
                                            onClick={() => {
                                                setNewCategory({...newCategory, type});
                                                setShowCategoryForm(true);
                                            }}
                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            + Add {getTypeLabel(type).slice(0, -1)}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {categoriesByType[type].map((cat) => (
                                            <div key={cat._id} className="group relative p-4 border rounded-lg hover:bg-gray-50 transition-all duration-200">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="font-medium">{cat.name}</span>
                                                            {cat.featured && (
                                                                <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                                                                    Featured
                                                                </span>
                                                            )}
                                                            {!cat.isActive && (
                                                                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                                                                    Inactive
                                                                </span>
                                                            )}
                                                        </div>
                                                        
                                                        {cat.description && (
                                                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                                                {cat.description}
                                                            </p>
                                                        )}
                                                        
                                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                                            <span>{t('Order')}: {cat.order || 0}</span>
                                                            <span className="font-mono">/{cat.slug}</span>
                                                        </div>
                                                        
                                                        {type === 'category' && (
                                                            <dl className="grid grid-cols-2 gap-x-3 gap-y-1 mt-3 text-xs text-gray-600">
                                                                <div><dt className="inline">{t('Total')}: </dt><dd className="inline font-semibold">{cat.totalProducts || 0}</dd></div>
                                                                <div><dt className="inline">{t('Active')}: </dt><dd className="inline font-semibold">{cat.activeProducts || 0}</dd></div>
                                                                <div><dt className="inline">{t('Inactive')}: </dt><dd className="inline font-semibold">{cat.inactiveProducts || 0}</dd></div>
                                                                <div><dt className="inline">{t('Out of stock')}: </dt><dd className="inline font-semibold">{cat.outOfStockProducts || 0}</dd></div>
                                                            </dl>
                                                        )}
                                                        {type !== 'category' && cat.productCount !== undefined && (
                                                            <div className="mt-2 text-xs text-blue-600">{cat.productCount} products</div>
                                                        )}
                                                        
                                                        {/* Show parent category if exists */}
                                                        {cat.parent && cat.parent.name && (
                                                            <div className="mt-1 text-xs text-gray-500">
                                                                Parent: {cat.parent.name}
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="flex gap-1 ml-2">
                                                        {type === 'category' && (
                                                            <>
                                                                {cat.isActive && <button
                                                                    onClick={() => addProductToCategory(cat)}
                                                                    className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                                                                    title="Add product to category"
                                                                >
                                                                    <FaPlus size={16} />
                                                                </button>}
                                                                <button
                                                                    onClick={() => viewCategoryProducts(cat)}
                                                                    className="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded"
                                                                    title="View category products"
                                                                >
                                                                    <FaEye size={16} />
                                                                </button>
                                                            </>
                                                        )}
                                                        <button
                                                            onClick={() => handleEditCategory(cat)}
                                                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                                                            title="Edit"
                                                        >
                                                            <FaEdit size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteCategory(cat)}
                                                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                                                            title="Delete"
                                                        >
                                                            <FaTrash size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryManager;