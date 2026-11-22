import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { ProductService } from '../services/api';
import { productPath } from '../utils/storeRoutes';
import {
  FaShoppingCart,
  FaHeart,
  FaStar,
  FaTruck,
  FaShieldAlt,
  FaExchangeAlt,
  FaCheck,
  FaShareAlt,
  FaTag,
  FaBox
} from 'react-icons/fa';

const readStoredItems = (key) => {
  try {
    const storedItems = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(storedItems) ? storedItems : [];
  } catch (error) {
    console.error(`Could not read ${key} from local storage:`, error);
    return [];
  }
};

const ProductDetail = () => {
  const { slug } = useParams();
  const id = slug?.match(/(?:^|-)([a-f0-9]{24})$/i)?.[1] || slug;
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart: addToContextCart, cart } = useCart();
  const { addToWishlist: addToContextWishlist, wishlist } = useWishlist();
  
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    let active = true;

    ProductService.getById(id)
      .then((response) => {
        if (!active) return;
        if (!response.data.success || !response.data.data) {
          throw new Error(response.data.message || 'Product not found.');
        }
        const productData = response.data.data;
        const normalizedProduct = { ...productData, _id: productData._id || productData.id };
        setProduct(normalizedProduct);
        setSelectedVariant(normalizedProduct.variants?.[0] || null);
        setQuantity(Math.max(1, Number(normalizedProduct.minimumOrderQuantity) || 1));
        setRelatedProducts(Array.isArray(normalizedProduct.relatedProducts) ? normalizedProduct.relatedProducts : []);
      })
      .catch((error) => {
        if (active) {
          console.error('Error fetching product:', error);
          setProduct(null);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  const guestCart = isAuthenticated ? [] : readStoredItems('guestCart');
  const guestWishlist = isAuthenticated ? [] : readStoredItems('guestWishlist');
  const inCart = Boolean(product && (
    cart.some((item) => item.productId === product._id && item.type === product.type)
    || guestCart.some((item) => item.productId === product._id && item.type === product.type)
  ));
  const inWishlist = Boolean(product && (
    wishlist.some((item) => item.productId === product._id && item.type === product.type)
    || guestWishlist.some((item) => item.productId === product._id && item.type === product.type)
  ));

  const handleAddToCart = async () => {
    if (!product) return;
    
    setAddingToCart(true);
    
    try {
      const productToAdd = {
        productId: product._id,
        name: product.name,
        currentPrice: selectedVariant?.price ?? product.wholesalePrice ?? product.originalPrice ?? product.price,
        originalPrice: selectedVariant?.originalPrice || product.originalPrice,
        image: product.images?.[0]?.url || product.images?.[0] || product.image,
        type: product.type || 'toy',
        quantity,
        category: product.category,
        brand: product.brand,
        ageGroup: product.ageGroup,
        minimumOrderQuantity: product.minimumOrderQuantity || 1,
        discount: product.discount || 0
      };

      if (isAuthenticated) {
        const added = await addToContextCart(productToAdd);
        if (!added) throw new Error('Failed to add product to cart');
      } else {
        // Guest user - add to localStorage
        const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
        
        const existingIndex = guestCart.findIndex(item => 
          item.productId === product._id && item.type === product.type
        );
        
        if (existingIndex !== -1) {
          guestCart[existingIndex].quantity += quantity;
        } else {
          guestCart.push(productToAdd);
        }
        
        localStorage.setItem('guestCart', JSON.stringify(guestCart));
        
        // Update context for guest
        addToContextCart(productToAdd);
      }
      
      alert('Product added to cart!');
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!product) return;
    
    setAddingToWishlist(true);
    
    try {
      const productToWishlist = {
        productId: product._id,
        name: product.name,
        currentPrice: selectedVariant?.price || product.price,
        originalPrice: selectedVariant?.originalPrice || product.originalPrice,
        image: product.images?.[0]?.url || product.images?.[0] || product.image,
        type: product.type || 'toy',
        category: product.category,
        brand: product.brand,
        ageGroup: product.ageGroup,
        discount: product.discount || 0
      };

      if (isAuthenticated) {
        // Logged in user - add to database
        const authAxios = getAuthAxios();
        await authAxios.post('/wishlist/add', productToWishlist);
        
        // Update context
        addToContextWishlist(productToWishlist);
      } else {
        // Guest user - add to localStorage
        const guestWishlist = JSON.parse(localStorage.getItem('guestWishlist') || '[]');
        
        const exists = guestWishlist.some(item => 
          item.productId === product._id && item.type === product.type
        );
        
        if (!exists) {
          guestWishlist.push(productToWishlist);
          localStorage.setItem('guestWishlist', JSON.stringify(guestWishlist));
          
          // Update context for guest
          addToContextWishlist(productToWishlist);
        }
      }
      
      alert('Added to wishlist!');
      
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      alert('Failed to add to wishlist. Please try again.');
    } finally {
      setAddingToWishlist(false);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => {
      navigate('/cart');
    }, 500);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    const minimumOrderQuantity = Math.max(1, Number(product?.minimumOrderQuantity) || 1);
    if (newQuantity >= minimumOrderQuantity && newQuantity <= (product?.stock || 10)) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Product not found</h2>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  const currentPrice = selectedVariant?.price || product.originalPrice || product.price;
  const displayPrice = Number(product.wholesalePrice ?? product.originalPrice ?? currentPrice);
  const isWholesalePrice = product.wholesalePrice !== undefined && product.wholesalePrice !== null;
  const minimumOrderQuantity = Math.max(1, Number(product.minimumOrderQuantity) || 1);
  const originalPrice = selectedVariant?.originalPrice || product.originalPrice;
  const discountPercentage = originalPrice > currentPrice 
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-600">
          <span className="hover:text-orange-600 cursor-pointer" onClick={() => navigate('/')}>Home</span>
          <span className="mx-2">›</span>
          <span className="hover:text-orange-600 cursor-pointer" onClick={() => navigate(`/search?q=${encodeURIComponent(product.category || '')}`)}>
            {product.category}
          </span>
          <span className="mx-2">›</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="mb-4">
              <img
                src={typeof product.images?.[selectedImage] === 'string' ? product.images[selectedImage] : product.images?.[selectedImage]?.url || product.image}
                alt={product.name}
                className="w-full h-96 object-contain rounded-lg"
              />
            </div>
            
            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto py-2">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 border-2 rounded-lg overflow-hidden ${
                      selectedImage === index 
                        ? 'border-orange-500' 
                        : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={typeof img === 'string' ? img : img?.url}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            
            {/* Brand and Category */}
            <div className="flex items-center space-x-4 mb-4">
              {product.brand && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {product.brand}
                </span>
              )}
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {product.category}
              </span>
              {product.ageGroup && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  {product.ageGroup}
                </span>
              )}
            </div>

            {/* Ratings */}
            <div className="flex items-center mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating || 4)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-gray-600">
                {product.rating || 4.0} ({product.reviewCount || 120} reviews)
              </span>
            </div>

            {/* Price Section */}
            <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl">
              <div className="flex items-center">
                <span className="text-3xl font-bold text-orange-600">
                  ₹{displayPrice.toLocaleString('en-IN')}
                </span>
                {isWholesalePrice ? (
                  <span className="ml-3 text-sm font-semibold text-blue-700">Wholesale price</span>
                ) : originalPrice > currentPrice && (
                  <>
                    <span className="ml-3 text-xl text-gray-500 line-through">
                      ₹{originalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="ml-3 px-2 py-1 bg-red-100 text-red-700 rounded-full text-sm font-bold">
                      {discountPercentage}% OFF
                    </span>
                  </>
                )}
              </div>
              {product.stock > 0 ? (
                <div className="flex items-center mt-2 text-green-600">
                  <FaCheck className="mr-2" />
                  <span>In Stock ({product.stock} available)</span>
                </div>
              ) : (
                <div className="text-red-600 mt-2">Out of Stock</div>
              )}
            </div>

            {/* Variants Selection */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Select Variant:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 py-2 border-2 rounded-lg transition-all ${
                        selectedVariant?.name === variant.name
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {variant.name} - ₹{variant.price.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Quantity:</h3>
              {minimumOrderQuantity > 1 && (
              <p className="mb-2 text-sm text-gray-600">Minimum order: {minimumOrderQuantity}</p>
              )}
              <div className="flex items-center">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= minimumOrderQuantity}
                  className="px-4 py-2 border border-r-0 border-gray-300 rounded-l-lg disabled:opacity-50"
                >
                  -
                </button>
                <div className="px-6 py-2 border-t border-b border-gray-300">
                  {quantity}
                </div>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= (product.stock || 10)}
                  className="px-4 py-2 border border-l-0 border-gray-300 rounded-r-lg disabled:opacity-50"
                >
                  +
                </button>
                <span className="ml-4 text-gray-600">
                  Max: {product.stock || 10} items
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={product.stock < minimumOrderQuantity || addingToCart || inCart}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold flex items-center justify-center transition-all ${
                  inCart
                    ? 'bg-green-600 text-white'
                    : 'bg-orange-600 hover:bg-orange-700 text-white'
                } ${product.stock < minimumOrderQuantity ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {addingToCart ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Adding...
                  </>
                ) : inCart ? (
                  <>
                    <FaCheck className="mr-2" />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <FaShoppingCart className="mr-2" />
                    Add to Cart
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="flex-1 py-3 px-6 bg-gray-900 hover:bg-black text-white rounded-lg font-semibold flex items-center justify-center transition-all"
              >
                Buy Now
              </button>

              <button
                onClick={handleAddToWishlist}
                disabled={addingToWishlist || inWishlist}
                className={`p-3 rounded-lg border-2 flex items-center justify-center ${
                  inWishlist
                    ? 'border-red-500 text-red-600'
                    : 'border-gray-300 hover:border-gray-400 text-gray-700'
                }`}
              >
                {addingToWishlist ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700"></div>
                ) : (
                  <FaHeart className={`w-6 h-6 ${inWishlist ? 'fill-current' : ''}`} />
                )}
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <FaTruck className="text-orange-500 mr-3" />
                <div>
                  <div className="font-semibold">Free Shipping</div>
                  <div className="text-sm text-gray-600">Above ₹999</div>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <FaShieldAlt className="text-green-500 mr-3" />
                <div>
                  <div className="font-semibold">Safe & Secure</div>
                  <div className="text-sm text-gray-600">Payment</div>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <FaExchangeAlt className="text-blue-500 mr-3" />
                <div>
                  <div className="font-semibold">Easy Returns</div>
                  <div className="text-sm text-gray-600">7 Days</div>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <FaBox className="text-purple-500 mr-3" />
                <div>
                  <div className="font-semibold">Gift Ready</div>
                  <div className="text-sm text-gray-600">Packaging</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Product Description</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 mb-4">{product.description}</p>
            
            {product.features && product.features.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Key Features:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {product.features.map((feature, index) => (
                    <li key={index} className="text-gray-700">{feature}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {product.specifications && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Specifications:</h3>
                <table className="w-full border-collapse">
                  <tbody>
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <tr key={key} className="border-b">
                        <td className="py-2 font-medium text-gray-700">{key}</td>
                        <td className="py-2 text-gray-600">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct.id || relatedProduct._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => navigate(productPath(relatedProduct))}
                >
                  <img
                    src={typeof relatedProduct.images?.[0] === 'string' ? relatedProduct.images[0] : relatedProduct.images?.[0]?.url || relatedProduct.image}
                    alt={relatedProduct.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 line-clamp-1">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-lg font-bold text-orange-600">
                        ₹{Number(relatedProduct.price || 0).toLocaleString('en-IN')}
                      </span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          // Quick add to cart logic here
                        }}
                        className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm hover:bg-orange-200"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;