import React, { useState, useEffect } from 'react';
import { FaStar, FaUser, FaQuoteLeft, FaPlus, FaTimes, FaCheckCircle } from 'react-icons/fa';
// ✅ Import ReviewService
import { ReviewService } from '../../services/api';

const CustomerReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10); // Show 10 initially
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [form, setForm] = useState({ name: '', rating: 5, message: '' });
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

  // --- Fetch Approved Reviews ---
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // ✅ Use ReviewService.getPublic
        const res = await ReviewService.getPublic();
        if (res.data.success) {
          setReviews(res.data.data);
        }
      } catch (err) {
        console.error("Failed to load reviews", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // --- Submit Review ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ Use ReviewService.create
      const res = await ReviewService.create(form);
      if (res.data.success) {
        setSubmitStatus('success');
        setForm({ name: '', rating: 5, message: '' });
        setTimeout(() => {
          setShowModal(false);
          setSubmitStatus(null);
        }, 3000);
      }
    } catch (err) {
      console.error(err);
      setSubmitStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Customer Reviews</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            See what our happy customers are saying about BrainyToys! We value your feedback and strive to provide the best STEM learning experience.
          </p>
          <button 
            onClick={() => setShowModal(true)}
            className="mt-8 bg-[#e74c3c] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-[#c0392b] transition-transform transform hover:-translate-y-1 flex items-center gap-2 mx-auto"
          >
            <FaPlus /> Write a Review
          </button>
        </div>

        {/* Reviews Grid */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <FaQuoteLeft className="text-4xl text-gray-300 mx-auto mb-4"/>
            <p className="text-xl text-gray-500">No reviews yet. Be the first to write one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {reviews.slice(0, visibleCount).map((review) => (
              <div 
                key={review._id} 
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden relative flex flex-col md:flex-row"
              >
                {/* orange Accent Triangle/Strip on Top Left */}
                <div className="absolute top-0 left-0 w-2 h-full bg-orange-600"></div>
                <div className="absolute top-0 left-0 w-0 h-0 border-t-[40px] border-t-orange-600 border-r-[40px] border-r-transparent z-10"></div>

                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 w-full ml-2">
                   {/* Avatar Section (Left) */}
                   <div className="flex-shrink-0">
                      <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-300 shadow-sm mx-auto md:mx-0">
                         <img 
                           src={`https://ui-avatars.com/api/?name=${review.name}&background=random&color=fff&size=128`} 
                           alt={review.name}
                           className="w-full h-full object-cover"
                         />
                      </div>
                   </div>

                   {/* Content Section (Right) */}
                   <div className="flex-1 text-center md:text-left">
                      <h3 className="text-xl font-bold text-gray-900">
                        {review.name}
                        {review.location && <span className="text-gray-500 font-normal text-lg">, {review.location}</span>}
                      </h3>
                      
                      <div className="flex justify-center md:justify-start items-center gap-1 text-orange-400 text-sm my-2">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className={i < review.rating ? "fill-current" : "text-gray-300"} />
                        ))}
                      </div>

                      <p className="text-gray-600 text-base leading-relaxed mt-3">
                        "{review.message}"
                      </p>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Write Review Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative animate-fadeIn">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <FaTimes size={20} />
            </button>

            <div className="bg-[#e74c3c] p-6 text-white text-center">
              <h3 className="text-2xl font-bold">Write a Review</h3>
              <p className="text-white/80 text-sm mt-1">Share your experience with us</p>
            </div>

            <div className="p-8">
              {submitStatus === 'success' ? (
                <div className="text-center py-10">
                  <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-gray-800">Thank You!</h4>
                  <p className="text-gray-600 mt-2">Your review has been submitted successfully and is pending approval.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e74c3c] focus:border-transparent outline-none transition-all"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={e => setForm({...form, name: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setForm({...form, rating: star})}
                          className={`text-3xl transition-transform hover:scale-110 ${
                            star <= form.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                    <textarea 
                      required
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e74c3c] focus:border-transparent outline-none transition-all resize-none"
                      placeholder="Tell us what you liked..."
                      value={form.message}
                      onChange={e => setForm({...form, message: e.target.value})}
                    ></textarea>
                  </div>

                  {submitStatus === 'error' && (
                    <p className="text-red-500 text-sm text-center">Something went wrong. Please try again.</p>
                  )}

                  <button 
                    type="submit"
                    className="w-full bg-[#e74c3c] text-white font-bold py-3 rounded-lg hover:bg-[#c0392b] transition-colors shadow-lg"
                  >
                    Submit Review
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerReviews;