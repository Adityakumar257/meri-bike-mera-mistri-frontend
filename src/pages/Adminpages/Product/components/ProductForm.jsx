import React, { useState, useEffect } from 'react';
import { 
  FaSave, FaSpinner, FaTimes, FaCamera, FaTag, FaPercent, 
  FaDollarSign, FaArrowLeft, 
  FaUserTie, FaBuilding, FaBarcode, FaLanguage, 
  FaLayerGroup, FaRuler, FaWeight,
  FaRobot, FaBookOpen, FaShapes, FaCog,
} from 'react-icons/fa';
// ✅ Import Services from centralized API
import { ProductService, CategoryService } from '../../../../services/api';
import { useLanguage } from '../../../../contexts/LanguageContext';

const AddProduct = ({
  currentUser,
  activeForm, setActiveForm, editingId, setEditingId,
  setError, setSuccessMessage, setActiveSection,
  initialCategoryId, setInitialCategoryId
}) => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [ageGroups, setAgeGroups] = useState([]);
  
  const [typeCounts, setTypeCounts] = useState({
    educational_toy: 0, book: 0, robotic_kit: 0, spare_part: 0
  });

  const [formData, setFormData] = useState({
    name: '', title: '', description: '', type: activeForm || 'spare_part',
    category: '', categoryName: '',
    brand: '', brandName: '', 
    ageGroup: '', ageGroupName: '', 
    price: '', discount: '0',
    originalPrice: '', currentPrice: '', 
    sku: '', wholesalePrice: '', minimumOrderQuantity: '1',
    bulkDiscountPercent: '0', compatibleBikeBrands: '', compatibleBikeModels: '',
    stockQuantity: '0', stockStatus: 'In Stock',
    tags: '', isFeatured: false, isNewArrival: false, 
    rating: '0', ratingCount: '0', views: '0', status: 'active',
    
    // Type Specific Fields (Books/Physical Items)
    author: '', publisher: '', pages: '', language: 'English', isbn: '', 
    material: '', dimensions: '', weight: '',
    
    // Classification Flags
    isOpenEndedPlay: false, isActionFigure: false, isEducationalToy: false,
    isRoboticKit: false, 
    
    userId: currentUser?.id || 'public_user', userName: currentUser?.name || 'Public User'
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const fetchTypeStats = async () => {
    try {
      // ✅ Use ProductService
      const response = await ProductService.getStats();
      if (response.data.success) {
        const stats = response.data.data.byType || [];
        const counts = { educational_toy: 0, book: 0, robotic_kit: 0, spare_part: 0 };
        stats.forEach(stat => {
          if (Object.prototype.hasOwnProperty.call(counts, stat._id)) counts[stat._id] = stat.count;
          else if (stat._id === 'toy') counts.educational_toy += stat.count;
        });
        setTypeCounts(counts);
      } else {
        setError(response.data.message || 'Failed to load product type counts');
      }
    } catch (error) {
      console.error('Error fetching type stats:', error);
    }
  };

  const fetchCategoriesAndBrands = async () => {
    try {
      // ✅ Use CategoryService
      const response = await CategoryService.getAll();
      if (response.data.success) {
        const data = response.data.data || [];
        const productCategories = data.filter(item => item.type === 'category');
        setCategories(productCategories);
        setBrands(data.filter(item => item.type === 'brand'));
        setAgeGroups(data.filter(item => item.type === 'age-group'));
        if (initialCategoryId && !editingId) {
          const category = productCategories.find(item => item._id === initialCategoryId);
          if (category) {
            setFormData(prev => ({ ...prev, category: category._id, categoryName: category.name }));
            setInitialCategoryId('');
          }
        }
      }
    } catch {
      setError('Failed to load categories');
    }
  };

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      // ✅ Use ProductService
      const response = await ProductService.getAdminById(editingId);
      if (response.data.success) {
        const product = response.data.data;
        setActiveForm(product.type || 'spare_part');

        const categoryId = product.categoryId || (product.category && typeof product.category === 'object' ? product.category._id : product.category);
        const brandId = product.brandId || (product.brand && typeof product.brand === 'object' ? product.brand._id : product.brand);
        const ageGroupId = product.ageGroupId || (product.ageGroup && typeof product.ageGroup === 'object' ? product.ageGroup._id : product.ageGroup);

        setFormData({
            ...formData, 
            ...product, 
            type: product.type || 'spare_part',
            category: categoryId || '',
            brand: brandId || '',
            ageGroup: ageGroupId || '',
            price: product.originalPrice ?? product.price ?? '',
            originalPrice: product.originalPrice ?? product.price ?? '',
            wholesalePrice: product.wholesalePrice ?? '',
            minimumOrderQuantity: String(product.minimumOrderQuantity || 1),
            bulkDiscountPercent: String(product.bulkDiscountPercent || 0),
            compatibleBikeBrands: Array.isArray(product.compatibleBikeBrands) ? product.compatibleBikeBrands.join(', ') : '',
            compatibleBikeModels: Array.isArray(product.compatibleBikeModels) ? product.compatibleBikeModels.join(', ') : '',
            tags: Array.isArray(product.tags) ? product.tags.join(', ') : product.tags || '',
            isFeatured: !!product.isFeatured,
            isNewArrival: !!product.isNewArrival,
            // Flags
            isOpenEndedPlay: !!product.isOpenEndedPlay,
            isActionFigure: !!product.isActionFigure,
            isEducationalToy: !!product.isEducationalToy,
            isRoboticKit: !!product.isRoboticKit,
            
            userId: product.createdBy || currentUser?.id || 'public_user',
            userName: product.createdByName || currentUser?.name || 'Public User'
        });

        if (product.images && product.images.length > 0) {
          setImagePreviews(product.images.map(img => typeof img === 'object' ? img.url : img));
        }
      }
    } catch {
      setError('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoriesAndBrands();
    fetchTypeStats();
    if (editingId) {
      fetchProductDetails();
    }
  }, [editingId]);

  const handleTypeSelect = (type) => {
    setActiveForm(type);
    setFormData(prev => ({ ...prev, type: type }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
        setFormData(prev => ({ ...prev, [name]: checked }));
        return;
    }
    if (name === 'discount' || name === 'price') {
      const price = name === 'price' ? parseFloat(value) || 0 : parseFloat(formData.price) || 0;
      const discount = name === 'discount' ? parseFloat(value) || 0 : parseFloat(formData.discount) || 0;
      const currentPrice = discount > 0 ? price * (1 - discount / 100) : price;
      setFormData(prev => ({ ...prev, [name]: value, originalPrice: price, currentPrice: currentPrice.toFixed(2) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (name === 'category') { const sel = categories.find(c => c._id === value); if(sel) setFormData(prev => ({ ...prev, categoryName: sel.name })); }
    if (name === 'brand') { const sel = brands.find(b => b._id === value); if(sel) setFormData(prev => ({ ...prev, brandName: sel.name })); }
    if (name === 'ageGroup') { const sel = ageGroups.find(a => a._id === value); if(sel) setFormData(prev => ({ ...prev, ageGroupName: sel.name })); }
  };

  const handleRatingClick = (rating) => setFormData(prev => ({ ...prev, rating: rating.toString() }));
  const handleRatingHover = (rating) => setHoverRating(rating);
  const handleRatingLeave = () => setHoverRating(0);
  
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 10) { setError('Maximum 10 images allowed'); return; }
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category) {
      setError('Product name, category, and MRP are required');
      window.scrollTo(0,0);
      return;
    }
    if (formData.type === 'spare_part' && (!formData.sku.trim() || formData.wholesalePrice === '')) {
      setError('SKU / part number and wholesale price are required for spare parts');
      window.scrollTo(0,0);
      return;
    }

    setLoading(true); setUploading(true);
    
    try {
      const formDataToSend = new FormData();
      const derivedFields = new Set([
        'images', '_id', 'id', 'categoryId', 'brandId', 'ageGroupId',
        'currentPrice', 'discountedPrice', 'image', 'stock', 'inStock', 'isInStock'
      ]);
      Object.keys(formData).forEach(key => {
        if (!derivedFields.has(key) && formData[key] !== null && formData[key] !== undefined) {
          if (typeof formData[key] === 'boolean') formDataToSend.append(key, formData[key].toString());
          else if (Array.isArray(formData[key])) formDataToSend.append(key, formData[key].join(','));
          else formDataToSend.append(key, formData[key]);
        }
      });
      images.forEach(image => formDataToSend.append('images', image));
      
      // ✅ Use ProductService for create/update
      let response;
      if (editingId) {
        response = await ProductService.update(editingId, formDataToSend);
      } else {
        response = await ProductService.create(formDataToSend);
      }

      if (response.data.success) {
        setSuccessMessage(editingId ? 'Updated successfully!' : 'Created successfully!');
        setEditingId(null);
        if(!editingId) { setFormData({ ...formData, name: '', description: '' }); setImages([]); setImagePreviews([]); }
        setTimeout(() => { setSuccessMessage(''); setActiveSection('products'); }, 1500);
      } else { setError(response.data.message || 'Failed to save'); }
    } catch (error) { setError(error.message || 'Failed to save'); } 
    finally { setLoading(false); setUploading(false); window.scrollTo(0,0); }
  };

  const getReadableType = (type) => {
    switch(type) {
      case 'educational_toy': return 'Educational Toy';
      case 'robotic_kit': return 'Robotic Kit';
      case 'book': return 'Book';
      case 'spare_part': return 'Spare Part';
      default: return type;
    }
  };

  const renderFlags = () => {
    return (
      <div className="col-span-1 md:col-span-2 mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-3">{t('Classifications & Flags')}</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* New Arrival - Available for ALL */}
            <label className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-gray-100 bg-white border border-gray-100">
                <input type="checkbox" name="isNewArrival" checked={formData.isNewArrival} onChange={handleInputChange} className="h-4 w-4 text-green-600 rounded" />
                <span className="text-sm font-medium text-gray-700">{t('New Arrival')}</span>
            </label>

            {/* Educational Toy Specific Flags */}
            {formData.type === 'educational_toy' && (
              <>
                 <label className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-gray-100">
                    <input type="checkbox" name="isOpenEndedPlay" checked={formData.isOpenEndedPlay} onChange={handleInputChange} className="h-4 w-4 text-purple-600 rounded" />
                    <span className="text-sm">{t('Open Ended Play')}</span>
                 </label>
                 <label className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-gray-100">
                    <input type="checkbox" name="isActionFigure" checked={formData.isActionFigure} onChange={handleInputChange} className="h-4 w-4 text-blue-600 rounded" />
                    <span className="text-sm">{t('Action Figure')}</span>
                 </label>
                 <label className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-gray-100">
                    <input type="checkbox" name="isEducationalToy" checked={formData.isEducationalToy} onChange={handleInputChange} className="h-4 w-4 text-green-600 rounded" />
                    <span className="text-sm">{t('Educational Toy')}</span>
                 </label>
                 <label className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-gray-100 bg-yellow-50 border border-yellow-100">
                    <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleInputChange} className="h-4 w-4 text-yellow-600 rounded" />
                    <span className="text-sm font-medium text-gray-700">{t('Featured')}</span>
                 </label>
              </>
            )}

            {/* Robotics Specific Flags */}
            {formData.type === 'robotic_kit' && (
               <label className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-gray-100">
                  <input type="checkbox" name="isRoboticKit" checked={formData.isRoboticKit} onChange={handleInputChange} className="h-4 w-4 text-orange-600 rounded" />
                  <span className="text-sm">{t('Robotic Kit')}</span>
               </label>
            )}
        </div>
      </div>
    );
  };

  const renderTypeSpecificFields = () => {
    const commonPhysicalFields = (
        <>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">{t('Material')}</label><div className="relative"><FaLayerGroup className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /><input type="text" name="material" value={formData.material} onChange={handleInputChange} className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg" placeholder={t('Material')} /></div></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">{t('Dimensions')}</label><div className="relative"><FaRuler className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /><input type="text" name="dimensions" value={formData.dimensions} onChange={handleInputChange} className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg" placeholder={t('Dimensions')} /></div></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">{t('Weight')}</label><div className="relative"><FaWeight className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /><input type="text" name="weight" value={formData.weight} onChange={handleInputChange} className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg" placeholder={t('Weight')} /></div></div>
        </>
    );

    switch(formData.type) {
      case 'book':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className="block text-sm font-medium text-gray-700 mb-2">{t('Author')}</label><div className="relative"><FaUserTie className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /><input type="text" name="author" value={formData.author} onChange={handleInputChange} className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg" /></div></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">{t('Publisher')}</label><div className="relative"><FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /><input type="text" name="publisher" value={formData.publisher} onChange={handleInputChange} className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg" /></div></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">{t('ISBN')}</label><div className="relative"><FaBarcode className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /><input type="text" name="isbn" value={formData.isbn} onChange={handleInputChange} className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg" /></div></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">{t('Pages')}</label><input type="number" name="pages" value={formData.pages} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">{t('Language')}</label><div className="relative"><FaLanguage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /><input type="text" name="language" value={formData.language} onChange={handleInputChange} className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg" /></div></div>
              {renderFlags()}
          </div>
        );
      case 'robotic_kit':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {commonPhysicalFields}
            {renderFlags()}
          </div>
        );
      case 'spare_part':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {commonPhysicalFields}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('Compatible Bike Brands')}</label>
              <input type="text" name="compatibleBikeBrands" value={formData.compatibleBikeBrands} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="Honda, Hero, Bajaj" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('Compatible Bike Models')}</label>
              <input type="text" name="compatibleBikeModels" value={formData.compatibleBikeModels} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="Splendor Plus, Shine 125" />
            </div>
            {renderFlags()}
          </div>
        );
      default: // 'educational_toy'
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {commonPhysicalFields}
            {renderFlags()}
          </div>
        );
    }
  };

  const typeCards = [
    { id: 'spare_part', label: 'Motorcycle Spare Parts', icon: <FaCog className="text-2xl mb-2 text-blue-700" />, count: typeCounts.spare_part, color: 'bg-blue-50 border-blue-200' },
    { id: 'educational_toy', label: 'Educational Toys', icon: <FaShapes className="text-2xl mb-2 text-blue-600" />, count: typeCounts.educational_toy, color: 'bg-blue-50 border-blue-200' },
    { id: 'robotic_kit', label: 'Robotic Kits', icon: <FaRobot className="text-2xl mb-2 text-orange-600" />, count: typeCounts.robotic_kit, color: 'bg-orange-50 border-orange-200' },
    { id: 'book', label: 'Books', icon: <FaBookOpen className="text-2xl mb-2 text-purple-600" />, count: typeCounts.book, color: 'bg-purple-50 border-purple-200' },
  ];

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{editingId ? `${t('Edit')} ${t(getReadableType(formData.type))}` : t('Add New Product')}</h1>
                <p className="text-gray-600 mt-1">{t('Select the type of product you want to add')}</p>
            </div>
              <button onClick={() => { setActiveSection('products'); setEditingId(null); }} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"><FaArrowLeft className="mr-2" /> {t('Back to Products')}</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            {typeCards.map(card => (
                <div key={card.id} onClick={() => handleTypeSelect(card.id)} className={`cursor-pointer border rounded-xl p-4 transition-all duration-200 hover:shadow-md ${activeForm === card.id ? `${card.color} ring-2 ring-offset-1 ring-blue-400` : 'bg-white border-gray-200 hover:border-blue-300'}`}>
                    <div className="flex flex-col items-center text-center">
                        {card.icon}
                        <h3 className="font-semibold text-gray-800">{t(card.label)}</h3>
                        <p className="text-xs text-gray-500 mt-1">{card.count} {t('Items')}</p>
                    </div>
                </div>
            ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-200">{t('Basic Information')} ({t(getReadableType(formData.type))})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">{t('Product Name')} *</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">{t('Product Title')}</label><input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">{t('SKU / Part Number')} {formData.type === 'spare_part' ? '*' : ''}</label><input type="text" name="sku" value={formData.sku} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required={formData.type === 'spare_part'} /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">{t('Category / Subcategory')} *</label><select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required><option value="">{t('Select Category')}</option>{categories.map(cat => <option key={cat._id} value={cat._id}>{cat.parent?.name ? `${t(cat.parent.name)} / ${t(cat.name)}` : t(cat.name)}</option>)}</select></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">{t('Brand')}</label><select name="brand" value={formData.brand} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg"><option value="">{t('Select Brand')}</option>{brands.map(brand => <option key={brand._id} value={brand._id}>{brand.name}</option>)}</select></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">{t('Age Group')}</label><select name="ageGroup" value={formData.ageGroup} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg"><option value="">{t('Select Age Group')}</option>{ageGroups.map(group => <option key={group._id} value={group._id}>{group.name}</option>)}</select></div>
                </div>
                <div className="mt-6"><label className="block text-sm font-medium text-gray-700 mb-2">{t('Description')}</label><textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" className="w-full px-4 py-3 border border-gray-300 rounded-lg" /></div>
                <div className="mt-8"><h3 className="text-md font-semibold text-gray-800 mb-4">{t('Type Specific Details')}</h3>{renderTypeSpecificFields()}</div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-200">{t('Pricing')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">{t('MRP (₹)')} *</label><div className="relative"><FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /><input type="number" name="price" value={formData.price} onChange={handleInputChange} step="0.01" min="0" className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg" required /></div></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">{t('Discount (%)')}</label><div className="relative"><FaPercent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /><input type="number" name="discount" value={formData.discount} onChange={handleInputChange} min="0" max="100" className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg" /></div></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">{t('Current Price (₹)')}</label><input type="number" name="currentPrice" value={formData.currentPrice} readOnly className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-green-50 font-semibold" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">{t('Wholesale Price (₹)')} {formData.type === 'spare_part' ? '*' : ''}</label><input type="number" name="wholesalePrice" value={formData.wholesalePrice} onChange={handleInputChange} step="0.01" min="0" max={formData.price || undefined} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required={formData.type === 'spare_part'} /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">{t('Bulk Discount (%)')}</label><input type="number" name="bulkDiscountPercent" value={formData.bulkDiscountPercent} onChange={handleInputChange} min="0" max="100" step="0.1" className="w-full px-4 py-3 border border-gray-300 rounded-lg" /></div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-200">{t('Images')}</h2>
                <div className="mb-6"><label className="cursor-pointer px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center w-fit"><FaCamera className="mr-2" /> {t('Choose Images')} <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" /></label></div>
                {imagePreviews.length > 0 && <div className="grid grid-cols-5 gap-4">{imagePreviews.map((preview, index) => (<div key={index} className="relative aspect-square"><img src={preview} alt="prev" className="w-full h-full object-cover rounded-lg" /><button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"><FaTimes size={10} /></button></div>))}</div>}
            </div>

            {/* ✅ NEW RATING & VIEWS SECTION */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-200">{t('Rating & Views')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('Rating (0-5)')}</label>
                        <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    type="button"
                                    key={star}
                                    onClick={() => handleRatingClick(star)}
                                    onMouseEnter={() => handleRatingHover(star)}
                                    onMouseLeave={handleRatingLeave}
                                    className="text-2xl focus:outline-none"
                                >
                                    <FaStar
                                        className={`${
                                            star <= (hoverRating || parseFloat(formData.rating) || 0)
                                                ? 'text-yellow-400'
                                                : 'text-gray-300'
                                        }`}
                                    />
                                </button>
                            ))}
                            <span className="ml-2 text-gray-700 font-medium">
                                {formData.rating} / 5
                            </span>
                        </div>
                        <input
                            type="number"
                            name="rating"
                            value={formData.rating}
                            onChange={handleInputChange}
                            min="0"
                            max="5"
                            step="0.1"
                            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('Rating Count')}</label>
                        <div className="relative">
                            <FaStar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="number"
                                name="ratingCount"
                                value={formData.ratingCount}
                                onChange={handleInputChange}
                                min="0"
                                className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('Views')}</label>
                        <div className="relative">
                            <FaEye className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="number"
                                name="views"
                                value={formData.views}
                                onChange={handleInputChange}
                                min="0"
                                className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-200">{t('Status & Stock')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">{t('Stock Quantity')}</label><input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleInputChange} min="0" className="w-full px-4 py-3 border border-gray-300 rounded-lg" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">{t('Minimum Order Quantity')}</label><input type="number" name="minimumOrderQuantity" value={formData.minimumOrderQuantity} onChange={handleInputChange} min="1" className="w-full px-4 py-3 border border-gray-300 rounded-lg" /></div>
                    
                    {/* ✅ STOCK STATUS FIELD ADDED HERE */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('Stock Status')}</label>
                        <select 
                            name="stockStatus" 
                            value={formData.stockStatus} 
                            onChange={handleInputChange} 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                        >
                            <option value="In Stock">{t('In Stock')}</option>
                            <option value="Out of Stock">{t('Out of Stock')}</option>
                            <option value="Limited Stock">{t('Limited Stock')}</option>
                            <option value="In stock">{t('In stock')}</option>
                            <option value="Out of stock">{t('Out of stock')}</option>
                            <option value="Low stock">{t('Low stock')}</option>
                        </select>
                    </div>
                    
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">{t('Status')}</label><select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg"><option value="active">{t('Active')}</option><option value="inactive">{t('Inactive')}</option><option value="draft">{t('Draft')}</option></select></div>
                    <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-2">{t('Tags')}</label><div className="relative"><FaTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /><input type="text" name="tags" value={formData.tags} onChange={handleInputChange} className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg" placeholder={t('comma separated')} /></div></div>
                </div>
            </div>

            <div className="flex justify-end space-x-4">
                <button type="button" onClick={() => { setEditingId(null); setActiveSection('products'); }} className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700">{t('Cancel')}</button>
                <button type="submit" disabled={loading || uploading} className="px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center">{loading ? <FaSpinner className="animate-spin mr-2" /> : <FaSave className="mr-2" />} {editingId ? t('Update') : t('Create')}</button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;