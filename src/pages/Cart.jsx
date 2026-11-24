// // Cart.jsx - ULTRA SIMPLE WORKING VERSION
// import React, { useState, useEffect, useCallback, memo } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { 
//   FiTrash2, FiPlus, FiMinus, FiArrowLeft, 
//   FiShoppingBag, FiHeart, FiLoader,
//   FiAlertCircle
// } from 'react-icons/fi';
// import { useCart } from '../contexts/CartContext';
// import { useWishlist } from '../contexts/WishlistContext';
// import { useAuth } from '../contexts/AuthContext';
// import toast from 'react-hot-toast';

// // Loading skeleton
// const CartItemSkeleton = () => (
//   <div className="p-6 border-b animate-pulse">
//     <div className="flex gap-6">
//       <div className="w-32 h-32 bg-gray-200 rounded-xl"></div>
//       <div className="flex-1">
//         <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
//         <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
//         <div className="flex justify-between">
//           <div className="h-4 bg-gray-200 rounded w-20"></div>
//           <div className="h-4 bg-gray-200 rounded w-24"></div>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// // Empty Cart Component
// const EmptyCart = memo(() => {
//   const navigate = useNavigate();
  
//   return (
//     <div className="text-center bg-white rounded-2xl shadow p-12 max-w-2xl mx-auto">
//       <div className="w-32 h-32 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
//         <FiShoppingBag className="w-16 h-16 text-orange-600" />
//       </div>
//       <h1 className="text-4xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
//       <p className="text-xl text-gray-600 mb-8">Start adding amazing products!</p>
//       <div className="flex flex-col sm:flex-row gap-4 justify-center">
//         <button
//           onClick={() => navigate('/category/all')}
//           className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors duration-200"
//         >
//           Shop Toys
//         </button>
//         <button
//           onClick={() => navigate('/')}
//           className="bg-white border-2 border-orange-600 text-orange-600 hover:bg-orange-50 px-8 py-4 rounded-xl font-semibold text-lg transition-colors duration-200"
//         >
//           Continue Shopping
//         </button>
//       </div>
//     </div>
//   );
// });

// // Cart Item Component - SIMPLIFIED
// const CartItem = memo(({ item, onQuantityChange, onRemoveItem, onAddToWishlist, updatingId }) => {
//   const safeItem = {
//     id: item?.id || '',
//     type: item?.type || 'toy',
//     name: item?.name || 'Unnamed Product',
//     price: Number(item?.currentPrice || item?.price || 0),
//     quantity: Number(item?.quantity || 1),
//     image: item?.image || 'https://via.placeholder.com/300x300/FF6B6B/FFFFFF?text=Toy'
//   };

//   const itemTotal = safeItem.price * safeItem.quantity;
//   const isUpdating = updatingId === safeItem.id;

//   const handleDecrease = async () => {
//     const newQuantity = safeItem.quantity - 1;
//     if (newQuantity >= 1) {
//       try {
//         await onQuantityChange(safeItem.id, safeItem.type, safeItem.quantity, -1);
//       } catch (error) {
//         toast.error('Failed to update quantity');
//       }
//     }
//   };

//   const handleIncrease = async () => {
//     if (safeItem.quantity < 99) {
//       try {
//         await onQuantityChange(safeItem.id, safeItem.type, safeItem.quantity, 1);
//       } catch (error) {
//         toast.error('Failed to update quantity');
//       }
//     }
//   };

//   const handleRemove = async () => {
//     if (window.confirm('Are you sure you want to remove this item from your cart?')) {
//       try {
//         await onRemoveItem(safeItem.id, safeItem.type);
//       } catch (error) {
//         toast.error('Failed to remove item');
//       }
//     }
//   };

//   const handleMoveToWishlist = async () => {
//     try {
//       await onAddToWishlist(safeItem);
//     } catch (error) {
//       toast.error('Failed to move to wishlist');
//     }
//   };

//   return (
//     <div className="p-6 border-b hover:bg-gray-50 transition-colors duration-200">
//       <div className="flex flex-col md:flex-row gap-6">
//         {/* Image */}
//         <div className="md:w-32 md:h-32 w-full h-48 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl flex items-center justify-center p-4">
//           <img
//             src={safeItem.image}
//             alt={safeItem.name}
//             className="w-full h-full object-contain"
//             loading="lazy"
//             onError={(e) => {
//               e.target.src = 'https://via.placeholder.com/300x300/FF6B6B/FFFFFF?text=Toy';
//             }}
//           />
//         </div>

//         {/* Details */}
//         <div className="flex-1">
//           <div className="flex flex-col md:flex-row md:justify-between">
//             <div className="flex-1">
//               <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
//                 {safeItem.name}
//               </h3>
//               <div className="mb-3">
//                 <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
//                   {safeItem.type === 'book' ? 'Book' : 'Toy'}
//                 </span>
//               </div>
//             </div>

//             <div className="mt-4 md:mt-0">
//               <div className="text-right">
//                 <div className="text-2xl font-bold text-orange-600">
//                   ₹{itemTotal.toLocaleString('en-IN')}
//                 </div>
//                 <div className="text-gray-600 mt-1">
//                   ₹{safeItem.price.toLocaleString('en-IN')} each
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between">
//             <div className="flex items-center gap-4 mb-4 md:mb-0">
//               <div className="flex items-center border-2 border-gray-200 rounded-xl">
//                 <button
//                   onClick={handleDecrease}
//                   disabled={isUpdating || safeItem.quantity <= 1}
//                   className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-l-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                   aria-label="Decrease quantity"
//                 >
//                   {isUpdating ? (
//                     <FiLoader className="w-5 h-5 animate-spin" />
//                   ) : (
//                     <FiMinus className="w-5 h-5" />
//                   )}
//                 </button>
//                 <div className="w-16 px-2 py-2 text-center border-x-2 border-gray-200 text-lg font-medium">
//                   {isUpdating ? '...' : safeItem.quantity}
//                 </div>
//                 <button
//                   onClick={handleIncrease}
//                   disabled={isUpdating || safeItem.quantity >= 99}
//                   className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-r-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                   aria-label="Increase quantity"
//                 >
//                   {isUpdating ? (
//                     <FiLoader className="w-5 h-5 animate-spin" />
//                   ) : (
//                     <FiPlus className="w-5 h-5" />
//                   )}
//                 </button>
//               </div>
//             </div>

//             <div className="flex items-center gap-3">
//               <button
//                 onClick={handleMoveToWishlist}
//                 disabled={isUpdating}
//                 className="flex items-center text-orange-600 hover:text-orange-700 font-medium transition-colors duration-200 px-3 py-2 hover:bg-orange-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <FiHeart className="mr-2" />
//                 Save for Later
//               </button>
              
//               <button
//                 onClick={handleRemove}
//                 disabled={isUpdating}
//                 className="flex items-center text-red-600 hover:text-red-700 font-medium transition-colors duration-200 px-3 py-2 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isUpdating ? (
//                   <FiLoader className="w-4 h-4 animate-spin mr-2" />
//                 ) : (
//                   <FiTrash2 className="mr-2" />
//                 )}
//                 Remove
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// });

// // Main Cart Component - ULTRA SIMPLE
// const Cart = () => {
//   const { 
//     cart = [], 
//     removeFromCart, 
//     updateQuantity, 
//     clearCart, 
//     getCartTotal,
//     getCartCount,
//     loading: cartLoading,
//     syncing
//   } = useCart();
  
//   const { addToWishlist } = useWishlist();
//   const { isAuthenticated } = useAuth();
  
//   const navigate = useNavigate();

//   const [updatingId, setUpdatingId] = useState(null);
//   const [itemCount, setItemCount] = useState(0);
//   const [total, setTotal] = useState(0);

//   // Calculate cart totals
//   useEffect(() => {
//     try {
//       const subtotal = getCartTotal?.() || 0;
//       const gst = subtotal * 0.1;
//       const shipping = subtotal >= 999 ? 0 : 99;
//       const finalTotal = subtotal + gst + shipping;
      
//       setTotal(finalTotal);
//       setItemCount(getCartCount?.() || 0);
//     } catch (error) {
//       console.error('Error calculating totals:', error);
//       setTotal(0);
//       setItemCount(0);
//     }
//   }, [cart, getCartTotal, getCartCount]);

//   // Quantity change handler
//   const handleQuantityChange = useCallback(async (id, type, currentQuantity, change) => {
//     const newQuantity = currentQuantity + change;
    
//     if (newQuantity >= 1 && newQuantity <= 99) {
//       setUpdatingId(id);
//       try {
//         await updateQuantity(id, newQuantity, type);
//         toast.success('Quantity updated');
//       } catch (error) {
//         console.error('Error updating quantity:', error);
//         toast.error('Failed to update quantity');
//       } finally {
//         setUpdatingId(null);
//       }
//     }
//   }, [updateQuantity]);

//   // Remove item handler
//   const handleRemoveItem = useCallback(async (id, type) => {
//     if (window.confirm('Are you sure you want to remove this item from your cart?')) {
//       try {
//         await removeFromCart(id, type);
//         toast.success('Item removed from cart');
//       } catch (error) {
//         console.error('Error removing item:', error);
//         toast.error('Failed to remove item');
//       }
//     }
//   }, [removeFromCart]);

//   // Clear cart handler
//   const handleClearCart = useCallback(async () => {
//     if (window.confirm('Are you sure you want to clear your entire cart?')) {
//       try {
//         await clearCart();
//         toast.success('Cart cleared');
//       } catch (error) {
//         console.error('Error clearing cart:', error);
//         toast.error('Failed to clear cart');
//       }
//     }
//   }, [clearCart]);

//   // Add to wishlist handler
//   const handleAddToWishlist = useCallback(async (item) => {
//     try {
//       addToWishlist({
//         id: item.id,
//         name: item.name,
//         currentPrice: item.price,
//         image: item.image,
//         type: item.type
//       });
      
//       await handleRemoveItem(item.id, item.type);
//       toast.success('Item moved to wishlist!');
//     } catch (error) {
//       console.error('Error moving to wishlist:', error);
//       toast.error('Failed to move to wishlist');
//     }
//   }, [addToWishlist, handleRemoveItem]);

//   // Checkout handler
//   const handleCheckout = useCallback(() => {
//     if (!isAuthenticated) {
//       toast.error('Please login to proceed to checkout');
//       navigate('/login', { state: { from: '/cart' } });
//       return;
//     }
    
//     if (!Array.isArray(cart) || cart.length === 0) {
//       toast.error('Your cart is empty. Add some items first!');
//       return;
//     }
    
//     navigate('/checkout');
//   }, [cart, navigate, isAuthenticated]);

//   // Loading state
//   if (cartLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="bg-white rounded-2xl shadow p-6">
//             <CartItemSkeleton />
//             <CartItemSkeleton />
//             <CartItemSkeleton />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Empty cart
//   if (!Array.isArray(cart) || cart.length === 0) {
//     return <EmptyCart />;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
//             <p className="text-gray-600 mt-1">
//               {itemCount} item{itemCount !== 1 ? 's' : ''} in cart
//               {syncing && (
//                 <span className="ml-2 text-sm text-orange-600 flex items-center">
//                   <FiLoader className="w-3 h-3 animate-spin mr-1" />
//                   Syncing...
//                 </span>
//               )}
//             </p>
//           </div>
//           <div className="flex items-center gap-3">
//             <Link
//               to="/category/all"
//               className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium transition-colors duration-200 px-4 py-2 hover:bg-orange-50 rounded-lg"
//             >
//               <FiArrowLeft className="mr-2" />
//               Continue Shopping
//             </Link>
//           </div>
//         </div>

//         <div className="flex flex-col lg:flex-row gap-6">
//           {/* Cart Items */}
//           <div className="lg:w-2/3">
//             <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
//               {cart.map((item, index) => (
//                 <CartItem
//                   key={`${item?.id || index}-${item?.type || 'toy'}`}
//                   item={item}
//                   onQuantityChange={handleQuantityChange}
//                   onRemoveItem={handleRemoveItem}
//                   onAddToWishlist={handleAddToWishlist}
//                   updatingId={updatingId}
//                 />
//               ))}
//             </div>
//           </div>

//           {/* Order Summary */}
//           <div className="lg:w-1/3">
//             <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
//               <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
//               <div className="space-y-4">
//                 <div className="flex justify-between py-3 border-b">
//                   <span className="text-gray-600">Items ({itemCount})</span>
//                   <span className="font-semibold">₹{(total * 0.9).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
//                 </div>
                
//                 <div className="flex justify-between py-3 border-b">
//                   <span className="text-gray-600">GST (10%)</span>
//                   <span className="font-semibold">₹{(total * 0.1).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
//                 </div>
                
//                 <div className="flex justify-between py-3 border-b">
//                   <span className="text-gray-600">Shipping</span>
//                   <span className="font-semibold">
//                     {total >= 999 ? 'FREE' : '₹99'}
//                   </span>
//                 </div>
                
//                 <div className="pt-4">
//                   <div className="flex justify-between items-center text-xl font-bold">
//                     <span>Total Amount</span>
//                     <span className="text-2xl text-orange-600">
//                       ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
//                     </span>
//                   </div>
//                 </div>
                
//                 <div className="pt-6 space-y-3">
//                   <button
//                     onClick={handleCheckout}
//                     disabled={syncing || updatingId}
//                     className="block w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-xl font-bold text-lg text-center shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {syncing || updatingId ? (
//                       <div className="flex items-center justify-center">
//                         <FiLoader className="w-5 h-5 animate-spin mr-2" />
//                         Processing...
//                       </div>
//                     ) : (
//                       'Proceed to Checkout'
//                     )}
//                   </button>
                  
//                   <button
//                     onClick={handleClearCart}
//                     disabled={syncing}
//                     className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 font-medium transition-colors duration-200 px-4 py-3 rounded-lg border border-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     Clear Entire Cart
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Cart;

// Cart.jsx - CLEAN WORKING VERSION
import React, { useState, useEffect, useCallback, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiTrash2, FiPlus, FiMinus, FiArrowLeft, 
  FiShoppingBag, FiHeart, FiLoader,
  FiCreditCard, FiTruck, FiCheckCircle
} from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';
import { getLocalizedProduct, useLanguage } from '../contexts/LanguageContext';
import toast from 'react-hot-toast';

// Loading skeleton
const CartItemSkeleton = () => (
  <div className="p-6 border-b animate-pulse">
    <div className="flex gap-6">
      <div className="w-32 h-32 bg-gray-200 rounded-xl"></div>
      <div className="flex-1">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    </div>
  </div>
);

// Empty Cart Component
const EmptyCart = memo(() => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  return (
    <div className="text-center bg-white rounded-2xl shadow p-12 max-w-2xl mx-auto">
      <div className="w-32 h-32 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <FiShoppingBag className="w-16 h-16 text-orange-600" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('Your cart is empty')}</h1>
      <p className="text-xl text-gray-600 mb-8">{t('Start adding amazing products!')}</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => navigate('/category/all')}
          className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors duration-200"
        >
          {t('Shop Parts')}
        </button>
        <button
          onClick={() => navigate('/')}
          className="bg-white border-2 border-orange-600 text-orange-600 hover:bg-orange-50 px-8 py-4 rounded-xl font-semibold text-lg transition-colors duration-200"
        >
          {t('Continue shopping')}
        </button>
      </div>
    </div>
  );
});

// Cart Item Component
const CartItem = memo(({ item, onQuantityChange, onRemoveItem, onAddToWishlist, updatingId }) => {
  const { language, t } = useLanguage();
  const safeItem = {
    id: item?.id || '',
    type: item?.type || 'toy',
    name: getLocalizedProduct(item, language).name || item?.name || 'Unnamed Product',
    price: Number(item?.currentPrice || item?.price || 0),
    quantity: Number(item?.quantity || 1),
    minimumOrderQuantity: Math.max(1, Number(item?.minimumOrderQuantity) || 1),
    image: item?.image || 'https://via.placeholder.com/300x300/FF6B6B/FFFFFF?text=Toy'
  };

  const itemTotal = safeItem.price * safeItem.quantity;
  const isUpdating = updatingId === safeItem.id;

  const handleDecrease = () => {
    if (safeItem.quantity > safeItem.minimumOrderQuantity) {
      onQuantityChange(safeItem.id, safeItem.type, safeItem.quantity, -1);
    }
  };

  const handleIncrease = () => {
    onQuantityChange(safeItem.id, safeItem.type, safeItem.quantity, 1);
  };

  const handleRemove = () => {
    if (window.confirm(t('Remove this item from cart?'))) {
      onRemoveItem(safeItem.id, safeItem.type);
    }
  };

  const handleMoveToWishlist = () => {
    onAddToWishlist(safeItem);
  };

  return (
    <div className="p-6 border-b hover:bg-gray-50 transition-colors duration-200">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Image */}
        <div className="md:w-32 md:h-32 w-full h-48 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl flex items-center justify-center p-4">
          <img
            src={safeItem.image}
            alt={safeItem.name}
            className="w-full h-full object-contain"
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x300/FF6B6B/FFFFFF?text=Toy';
            }}
          />
        </div>

        {/* Details */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                {safeItem.name}
              </h3>
              <div className="mb-3">
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                  {t(safeItem.type === 'book' ? 'Book' : safeItem.type === 'spare_part' ? 'Spare Part' : 'Product')}
                </span>
              </div>
            </div>

            <div className="mt-4 md:mt-0">
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-600">
                  ₹{itemTotal.toLocaleString('en-IN')}
                </div>
                <div className="text-gray-600 mt-1">
                  ₹{safeItem.price.toLocaleString('en-IN')} {t('each')}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className="flex items-center border-2 border-gray-200 rounded-xl">
                <button
                  onClick={handleDecrease}
                  disabled={isUpdating || safeItem.quantity <= safeItem.minimumOrderQuantity}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-l-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? (
                    <FiLoader className="w-5 h-5 animate-spin" />
                  ) : (
                    <FiMinus className="w-5 h-5" />
                  )}
                </button>
                <div className="w-16 px-2 py-2 text-center border-x-2 border-gray-200 text-lg font-medium">
                  {isUpdating ? '...' : safeItem.quantity}
                </div>
                <button
                  onClick={handleIncrease}
                  disabled={isUpdating || safeItem.quantity >= 99}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-r-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? (
                    <FiLoader className="w-5 h-5 animate-spin" />
                  ) : (
                    <FiPlus className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleMoveToWishlist}
                disabled={isUpdating}
                className="flex items-center text-orange-600 hover:text-orange-700 font-medium transition-colors duration-200 px-3 py-2 hover:bg-orange-50 rounded-lg disabled:opacity-50"
              >
                <FiHeart className="mr-2" />
                Save for Later
              </button>
              
              <button
                onClick={handleRemove}
                disabled={isUpdating}
                className="flex items-center text-red-600 hover:text-red-700 font-medium transition-colors duration-200 px-3 py-2 hover:bg-red-50 rounded-lg disabled:opacity-50"
              >
                {isUpdating ? (
                  <FiLoader className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <FiTrash2 className="mr-2" />
                )}
                {t('Remove')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// Order Summary Component
const OrderSummary = memo(({ total, itemCount, onCheckout, loading, onClearCart }) => {
  const { t } = useLanguage();
  const subtotal = total * 0.9; // Remove GST for calculation
  const gst = total * 0.1;
  const shipping = total >= 999 ? 0 : 99;

  return (
    <div className="lg:w-1/3">
      <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('Order Summary')}</h2>
        
        <div className="space-y-4">
          <div className="flex justify-between py-3 border-b">
            <span className="text-gray-600">{t('Items')} ({itemCount})</span>
            <span className="font-semibold">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
          
          <div className="flex justify-between py-3 border-b">
            <div>
              <span className="text-gray-600">{t('GST (10%)')}</span>
              <div className="text-sm text-green-600 flex items-center">
                <FiCheckCircle className="mr-1" />
                {t('Benefit applied')}
              </div>
            </div>
            <span className="font-semibold">₹{gst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
          
          <div className="flex justify-between py-3 border-b">
            <div>
              <span className="text-gray-600">{t('Shipping')}</span>
              {shipping === 0 ? (
                <div className="text-sm text-green-600 flex items-center">
                  <FiCheckCircle className="mr-1" />
                  {t('Free Shipping')}
                </div>
              ) : (
                <div className="text-sm text-gray-500">{t('Standard: ₹99')}</div>
              )}
            </div>
            <span className="font-semibold">
              {shipping === 0 ? t('FREE') : `₹${shipping}`}
            </span>
          </div>
          
          <div className="pt-4">
            <div className="flex justify-between items-center text-xl font-bold">
              <span>{t('Total Amount')}</span>
              <span className="text-2xl text-orange-600">
                ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {t('Including all taxes and shipping charges')}
            </p>
          </div>
          
          <div className="pt-6 space-y-3">
            <button
              onClick={onCheckout}
              disabled={loading || itemCount === 0}
              className="block w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-xl font-bold text-lg text-center shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <FiLoader className="w-5 h-5 animate-spin mr-2" />
                  {t('Processing...')}
                </div>
              ) : (
                t('Proceed to Checkout')
              )}
            </button>
            
            {itemCount > 0 && (
              <button
                onClick={onClearCart}
                disabled={loading}
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 font-medium transition-colors duration-200 px-4 py-3 rounded-lg border border-red-200 disabled:opacity-50"
              >
                {t('Clear Entire Cart')}
              </button>
            )}
          </div>

          {/* Payment Methods */}
          <div className="pt-4 border-t mt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">{t('We Accept')}</h3>
            <div className="flex items-center gap-3">
              <FiCreditCard className="text-gray-400" />
              <FiTruck className="text-gray-400" />
              <span className="text-xs text-gray-500">{t('Secure Payment')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// Main Cart Component
const Cart = () => {
  const { t } = useLanguage();
  const { 
    cart = [], 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotal,
    getCartCount,
    loading: cartLoading,
    syncing
  } = useCart();
  
  const { addToWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  
  const navigate = useNavigate();

  const [updatingId, setUpdatingId] = useState(null);
  const [itemCount, setItemCount] = useState(0);
  const [total, setTotal] = useState(0);

  // Calculate cart totals
  useEffect(() => {
    try {
      const cartTotal = getCartTotal?.() || 0;
      const gst = cartTotal * 0.1;
      const shipping = cartTotal >= 999 ? 0 : 99;
      const finalTotal = cartTotal + gst + shipping;
      
      setTotal(finalTotal);
      setItemCount(getCartCount?.() || 0);
    } catch (error) {
      console.error('Error calculating totals:', error);
      setTotal(0);
      setItemCount(0);
    }
  }, [cart, getCartTotal, getCartCount]);

  // Quantity change handler
  const handleQuantityChange = useCallback(async (id, type, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    const minimumOrderQuantity = Math.max(1, Number(cart.find(item =>
      (item.id === id || item.productId === id) && item.type === type
    )?.minimumOrderQuantity) || 1);
    if (newQuantity >= minimumOrderQuantity && newQuantity <= 99) {
      setUpdatingId(id);
      try {
        const updated = await updateQuantity(id, newQuantity, type);
        if (updated) toast.success(t('Quantity updated'));
      } catch (error) {
        toast.error(t('Failed to update quantity'));
      } finally {
        setUpdatingId(null);
      }
    }
  }, [cart, updateQuantity, t]);

  // Remove item handler
  const handleRemoveItem = useCallback(async (id, type) => {
    try {
      await removeFromCart(id, type);
      toast.success(t('Item removed from cart'));
    } catch (error) {
      toast.error(t('Failed to remove item'));
    }
  }, [removeFromCart, t]);

  // Clear cart handler
  const handleClearCart = useCallback(async () => {
    if (window.confirm(t('Are you sure you want to clear your entire cart?'))) {
      try {
        await clearCart();
        toast.success(t('Cart cleared'));
      } catch (error) {
        toast.error(t('Failed to clear cart'));
      }
    }
  }, [clearCart, t]);

  // Add to wishlist handler
  const handleAddToWishlist = useCallback(async (item) => {
    try {
      addToWishlist({
        id: item.id,
        name: item.name,
        currentPrice: item.price,
        image: item.image,
        type: item.type
      });
      
      await handleRemoveItem(item.id, item.type);
      toast.success(t('Item moved to wishlist!'));
    } catch (error) {
      toast.error(t('Failed to move to wishlist'));
    }
  }, [addToWishlist, handleRemoveItem, t]);

  // Checkout handler
  const handleCheckout = useCallback(() => {
    if (!isAuthenticated) {
      toast.error(t('Please login to proceed to checkout'));
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    
    if (!Array.isArray(cart) || cart.length === 0) {
      toast.error(t('Your cart is empty. Add some items first!'));
      return;
    }
    
    navigate('/checkout');
  }, [cart, navigate, isAuthenticated, t]);

  // Loading state
  if (cartLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow p-6">
            <CartItemSkeleton />
            <CartItemSkeleton />
            <CartItemSkeleton />
          </div>
        </div>
      </div>
    );
  }

  // Empty cart
  if (!Array.isArray(cart) || cart.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('Shopping Cart')}</h1>
            <p className="text-gray-600 mt-1">
              {itemCount} {t('items')} {t('in cart')}
              {syncing && (
                <span className="ml-2 text-sm text-orange-600 flex items-center">
                  <FiLoader className="w-3 h-3 animate-spin mr-1" />
                  {t('Syncing...')}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/category/all"
              className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium transition-colors duration-200 px-4 py-2 hover:bg-orange-50 rounded-lg"
            >
              <FiArrowLeft className="mr-2" />
              {t('Continue shopping')}
            </Link>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {cart.map((item, index) => (
                <CartItem
                  key={`${item?.id || index}-${item?.type || 'toy'}`}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onRemoveItem={handleRemoveItem}
                  onAddToWishlist={handleAddToWishlist}
                  updatingId={updatingId}
                />
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <OrderSummary 
            total={total}
            itemCount={itemCount}
            onCheckout={handleCheckout}
            loading={syncing || updatingId}
            onClearCart={handleClearCart}
          />
        </div>

        {/* Support Section */}
        <div className="mt-8 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl shadow-xl p-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0 md:mr-6">
              <h2 className="text-xl font-bold mb-2">{t('Need Help?')}</h2>
              <p className="text-orange-100 text-sm">{t("We're here to help you with your order")}</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">+91 85069 11777</div>
              <p className="text-orange-100 text-sm">{t('Call or WhatsApp')}</p>
              <a
                href="https://wa.me/918506911777"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 bg-white text-orange-600 px-4 py-2 rounded-lg font-medium hover:bg-orange-50 transition-colors duration-200 text-sm"
              >
                {t('WhatsApp Support')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;