import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

import { 
  ChevronLeft, ChevronRight, Star, ShoppingCart, Heart, Minus, Plus, 
  CheckCircle, Truck, ShieldCheck, PlayCircle, X, Bell 
} from 'lucide-react';
import { useCart } from '../../contexts/CartContext'; 
import axios from 'axios'; 
import { toast } from 'react-hot-toast'; 
import { API_BASE_URL, ProductService } from '../../services/api';
  
const styles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-up {
    animation: fadeInUp 0.6s ease-out forwards;
  }
  .delay-100 { animation-delay: 0.1s; }
  .delay-200 { animation-delay: 0.2s; }
  .delay-300 { animation-delay: 0.3s; }
`;

const StarRatingInput = ({ rating, setRating }) => {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="focus:outline-none transition-transform hover:scale-110"
          onClick={() => setRating(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
        >
          <Star
            size={24}
            className={`${star <= (hover || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        </button>
      ))}
    </div>
  );
};

const ProductGallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState('');
  const [startIndex, setStartIndex] = useState(0);
  const itemsToShow = 3;

  const getImageSrc = (img) => img?.url || img || '';

  useEffect(() => {
    if(images && images.length > 0) {
        setSelectedImage(getImageSrc(images[0]));
    }
  }, [images]);

  const nextThumb = () => { if (startIndex + itemsToShow < images.length) setStartIndex(prev => prev + 1); };
  const prevThumb = () => { if (startIndex > 0) setStartIndex(prev => prev - 1); };
  const visibleThumbnails = images.slice(startIndex, startIndex + itemsToShow);

  return (
    <div className="flex flex-col gap-6 animate-fade-up">
      <div className="w-full h-[400px] md:h-[550px] bg-white rounded-2xl shadow-xl overflow-hidden relative group border border-gray-100">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 z-10 pointer-events-none" />
        <img src={selectedImage || 'https://via.placeholder.com/500'} alt="Product Main" className="h-full w-full object-contain p-8 group-hover:scale-110 transition-transform duration-700 ease-in-out cursor-zoom-in" />
      </div>
      <div className="relative w-full flex items-center justify-center px-8">
        <button onClick={prevThumb} disabled={startIndex === 0} className="absolute left-0 z-10 p-2 rounded-full bg-white shadow-lg text-gray-600 hover:text-orange-500 disabled:opacity-30 hover:scale-110 transition-all"><ChevronLeft size={20} /></button>
        <div className="flex gap-4 overflow-hidden py-2">
          {visibleThumbnails.map((img, idx) => (
            <div key={startIndex + idx} onClick={() => setSelectedImage(getImageSrc(img))} className={`w-24 h-24 md:w-28 md:h-28 rounded-xl cursor-pointer flex-shrink-0 p-1 bg-white shadow-sm transition-all duration-300 ${selectedImage === getImageSrc(img) ? 'ring-2 ring-orange-500 scale-105' : 'hover:ring-2 hover:ring-gray-200 opacity-80 hover:opacity-100'}`}>
              <img src={getImageSrc(img)} alt="thumb" className="w-full h-full object-contain rounded-lg" />
            </div>
          ))}
        </div>
        <button onClick={nextThumb} disabled={startIndex + itemsToShow >= images.length} className="absolute right-0 z-10 p-2 rounded-full bg-white shadow-lg text-gray-600 hover:text-orange-500 disabled:opacity-30 hover:scale-110 transition-all"><ChevronRight size={20} /></button>
      </div>
    </div>
  );
};

const ProductDetails = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart(); // ✅ Hook moved to top level

  // API base URL
  // Get auth token
  const getToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  // Check if product is in stock
  const isOutOfStock = product.stockStatus === 'Out of Stock' || product.inStock === false;

  // Add to Cart with Backend Integration
  const handleAddToCart = async () => {
    try {
      const productId = product.id || product._id;
      
      // Prepare product data for cart
      const productData = {
        id: productId,
        name: product.name || product.title || 'Product',
        currentPrice: product.currentPrice || product.price || 0,
        originalPrice: product.originalPrice || product.price || 0,
        discount: product.discount || 0,
        category: product.categoryName || product.category || '',
        brand: product.brandName || product.brand || '',
        image: product.images?.[0]?.url || product.images?.[0] || '',
        type: 'robotic_kit',
        ageGroup: product.ageGroupName || product.ageGroup || '',
        stockStatus: product.stockStatus,
        inStock: product.inStock !== false,
        quantity: 1
      };

      // Try to add to backend first if user is logged in
      const token = getToken();
      if (token) {
        try {
          await axios.post(`${API_BASE_URL}/cart/add`, {
            productId: productId,
            quantity: 1
          }, {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
        } catch (backendError) {
          console.error('Backend cart error:', backendError);
          // Continue with local cart even if backend fails
        }
      }

      // Add to local cart context
      await addToCart(productData);
      
      // Show single success toast and redirect to cart
      const productName = product.name || 'Product';
      toast.success(`${productName} added to cart!`, {
        duration: 2000,
        position: 'bottom-right'
      });
      
      // Redirect to cart page after 500ms
      setTimeout(() => {
        navigate('/cart');
      }, 500);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart. Please try again.');
    }
  };

  // Handle Notify Me button click
  const handleNotifyMe = () => {
    const productName = product.name || 'Product';
    toast.success(`We will notify you when "${productName}" is back in stock!`, {
      duration: 3000,
      position: 'bottom-right'
    });
  };

  return (
    <div className="flex flex-col gap-5 animate-fade-up delay-100">
      <div className="flex items-center justify-between">
        <span className="text-orange-600 font-bold uppercase tracking-wider text-sm bg-orange-50 px-3 py-1 rounded-full capitalize">{product.brandName || product.brand || 'Generic'}</span>
        <div className="flex items-center gap-2 text-yellow-400">
          {[...Array(5)].map((_, i) => <Star key={i} size={16} fill={i < Math.floor(product.rating || 0) ? "currentColor" : "none"} stroke="currentColor" />)}
          <span className="text-sm text-gray-500 underline cursor-pointer">{product.ratingCount || 0} Reviews</span>
        </div>
      </div>
      <div>
        <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight capitalize">{product.name}</h1>
        <p className="text-gray-500 mt-2 text-sm md:text-base font-medium capitalize">{product.title}</p>
      </div>
      <div className="p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl flex flex-col md:flex-row md:items-center gap-4 shadow-sm">
        <div className="flex items-baseline gap-3">
            <span className="text-4xl font-black text-gray-900">₹{(product.currentPrice || product.price)?.toLocaleString()}</span>
            {product.originalPrice > (product.currentPrice || product.price) && (
                <span className="text-lg text-gray-400 line-through">₹{product.originalPrice?.toLocaleString()}</span>
            )}
        </div>
        <div className="h-8 w-px bg-gray-300 hidden md:block"></div>
        <div className="flex flex-col">
          <span className={`text-sm font-bold flex items-center gap-1 ${
            isOutOfStock ? 'text-red-600' : 'text-green-600'
          }`}>
            <CheckCircle size={14}/> 
            {product.stockStatus || (isOutOfStock ? 'Out of Stock' : 'In Stock')}
          </span>
          <span className="text-gray-400 text-xs">Inclusive of all taxes</span>
        </div>
      </div>
      
      {product.description && (
          <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100">
            <h3 className="font-bold text-gray-800 mb-2 text-sm uppercase">Description Snapshot:</h3>
            <p className="text-sm text-gray-700 line-clamp-3">{product.description}</p>
          </div>
      )}

      {/* REMOVED: Quantity Selection Section */}

      {/* Action Buttons */}
      <div className="mt-4 flex flex-col md:flex-row gap-4 h-12 md:h-14">
        {isOutOfStock ? (
          // Notify Me Button (Out of Stock)
          <button 
            onClick={handleNotifyMe}
            className="flex-1 bg-gray-600 text-white rounded-full font-bold text-lg shadow-lg hover:bg-gray-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Bell size={22} className="fill-white/20" /> 
            NOTIFY ME
          </button>
        ) : (
          // Add to Cart Button (In Stock)
          <button 
            onClick={handleAddToCart}
            className="flex-1 bg-gradient-to-r from-[#ff7f50] to-[#ff4500] text-white rounded-full font-bold text-lg shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <ShoppingCart size={22} className="fill-white/20" /> 
            ADD TO CART
          </button>
        )}
        
        {/* Wishlist Button */}
        <button className="w-14 h-full border-2 border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all">
          <Heart size={24} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 py-4 border-t border-gray-100 mt-2">
        {[{icon: Truck, text: "Free Shipping"}, {icon: ShieldCheck, text: "1 Year Warranty"}, {icon: CheckCircle, text: "100% Authentic"}].map((item, i) => (
          <div key={i} className="flex flex-col items-center justify-center text-center p-2">
            <item.icon size={20} className="text-gray-400 mb-1"/>
            <span className="text-[10px] md:text-xs font-semibold text-gray-500 uppercase">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProductTabs = ({ description, features, reviews: initialReviews, videoUrl }) => {
  const [activeTab, setActiveTab] = useState('description');
  const [reviews, setReviews] = useState(initialReviews || []);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newReviewer, setNewReviewer] = useState('');
  const [newComment, setNewComment] = useState('');

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (newRating === 0 || !newReviewer.trim() || !newComment.trim()) {
      alert("Please fill in all fields and select a rating.");
      return;
    }
    const newReview = { id: Date.now(), user: newReviewer, rating: newRating, comment: newComment, date: "Just now" };
    setReviews([newReview, ...reviews]);
    setNewRating(0); setNewReviewer(''); setNewComment(''); setShowReviewForm(false);
  };

  const tabs = [
    { id: 'description', label: 'Description' },
    ...(videoUrl ? [{ id: 'video', label: 'Demo Video' }] : []),
    { id: 'reviews', label: `Reviews (${reviews.length})` }
  ];

  const featureList = Array.isArray(features) ? features : (typeof features === 'string' ? features.split(',') : []);

  return (
    <div className="mt-16 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fade-up delay-200">
      <div className="flex border-b border-gray-100 bg-gray-50/50">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-5 text-sm md:text-base font-bold tracking-wide uppercase transition-all relative ${activeTab === tab.id ? 'text-orange-600 bg-white' : 'text-gray-500 hover:text-gray-700'}`}>
            <div className="flex items-center justify-center gap-2">{tab.id === 'video' && <PlayCircle size={18} />} {tab.label}</div>
            {activeTab === tab.id && <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-red-500"></span>}
          </button>
        ))}
      </div>

      <div className="p-8 md:p-10 min-h-[300px]">
        {activeTab === 'description' && (
          <div className="grid md:grid-cols-2 gap-12 animate-fade-up">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-800">Product Overview</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">{description || "No description available."}</p>
            </div>
            {featureList.length > 0 && (
                <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Technical Specifications</h3>
                <ul className="space-y-4">
                    {featureList.map((feat, i) => <li key={i} className="flex items-center gap-3 text-gray-700"><CheckCircle size={18} className="text-green-500 flex-shrink-0" />{feat}</li>)}
                </ul>
                </div>
            )}
          </div>
        )}

        {activeTab === 'video' && videoUrl && (
          <div className="animate-fade-up">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2"><PlayCircle className="text-orange-500"/> See it in Action</h3>
            <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-lg border border-gray-200">
              <iframe width="100%" height="100%" src={videoUrl} title="Product Video" frameBorder="0" allowFullScreen className="w-full h-full"></iframe>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="animate-fade-up">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-800">Customer Feedback</h3>
              {!showReviewForm && <button onClick={() => setShowReviewForm(true)} className="bg-orange-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-orange-700 transition-colors shadow-md">Write a Review</button>}
            </div>
            {showReviewForm && (
              <div className="mb-10 bg-gray-50 p-6 rounded-2xl border border-orange-100 shadow-inner animate-fade-up">
                <div className="flex justify-between items-center mb-4"><h4 className="text-lg font-bold text-gray-800">Write Your Review</h4><button onClick={() => setShowReviewForm(false)} className="text-gray-400 hover:text-red-500"><X size={20}/></button></div>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div><label className="block text-sm font-semibold text-gray-700 mb-1">Your Rating</label><StarRatingInput rating={newRating} setRating={setNewRating} /></div>
                  <div><label className="block text-sm font-semibold text-gray-700 mb-1">Your Name</label><input type="text" value={newReviewer} onChange={(e) => setNewReviewer(e.target.value)} placeholder="John Doe" className="w-full p-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none" /></div>
                  <div><label className="block text-sm font-semibold text-gray-700 mb-1">Your Review</label><textarea rows="4" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Share your experience..." className="w-full p-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"></textarea></div>
                  <div className="flex gap-3"><button type="submit" className="bg-orange-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-orange-700 transition-colors">Submit Review</button><button type="button" onClick={() => setShowReviewForm(false)} className="text-gray-600 px-6 py-2.5 font-bold hover:bg-gray-200 rounded-lg transition-colors">Cancel</button></div>
                </form>
              </div>
            )}
            <div className="grid gap-6">
              {reviews.length === 0 ? <p className="text-gray-500 italic">No reviews yet. Be the first to write one!</p> : reviews.map((rev) => (
                <div key={rev.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex gap-4 transition-all hover:shadow-md">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">{rev.user.charAt(0).toUpperCase()}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div><h4 className="font-bold text-gray-900 text-lg">{rev.user}</h4><span className="text-xs text-gray-400 font-medium">{rev.date}</span></div>
                      <div className="flex text-yellow-400 bg-yellow-50 px-2 py-1 rounded-lg">{[...Array(5)].map((_, r) => <Star key={r} size={16} fill={r < rev.rating ? "currentColor" : "none"} />)}</div>
                    </div>
                    <p className="mt-3 text-gray-600 leading-relaxed">{rev.comment}</p>
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

export default function RoboticsLandingPage() {
  const { slug } = useParams(); 
  const location = useLocation(); 
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchProduct = async () => {
        try {
            if (location.state && location.state.id) {
                const response = await ProductService.getById(location.state.id);
                if (response.data.success) {
                    setProduct(response.data.data);
                    setLoading(false);
                    return;
                }
            }

            if (slug) {
                const slugParts = slug.split('-');
                if (slugParts.length > 1) {
                    const searchName = slugParts.slice(0, -1).join(' ');
                    const response = await ProductService.getAll({ search: searchName });
                    
                    if (response.data.success && response.data.data.length > 0) {
                        setProduct(response.data.data[0]);
                    } else {
                        console.error("Product not found via slug search");
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching product:", error);
        } finally {
            setLoading(false);
        }
    };

    fetchProduct();
  }, [slug, location.state, API_BASE_URL]);

  if (loading) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
  }

  if (!product) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <h2 className="text-2xl font-bold text-gray-800">Product not found</h2>
            <button onClick={() => navigate('/robotics')} className="text-orange-600 hover:underline">Back to Robotics</button>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 pb-20 selection:bg-orange-100 selection:text-orange-800">
      <style>{styles}</style>
      
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-sm font-medium flex items-center gap-2 opacity-90 hover:opacity-100 transition-opacity">
          <span onClick={() => navigate('/')} className="cursor-pointer hover:underline">Home</span> 
          <ChevronRight size={14}/> 
          <span onClick={() => navigate('/robotics')} className="cursor-pointer hover:underline">Robotic Kits</span> 
          <ChevronRight size={14}/> 
          <span className="text-white font-bold capitalize">{product.name}</span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-10 border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <ProductGallery images={product.images || []} />
            <ProductDetails product={product} />
          </div>
        </div>
        <ProductTabs 
            description={product.description} 
            features={product.tags || []} 
            reviews={[]} 
            videoUrl={product.videoUrl} 
        />
      </main>
    </div>
  );
}