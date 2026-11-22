import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../services/api';
import { 
  ChevronLeft, ChevronRight, Star, CheckCircle, 
  User, Share2, Box, ShieldCheck, Heart, X 
} from 'lucide-react';

// --- Custom Animations Style ---
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
`;

// ==========================================
// 1. SUB-COMPONENT: Image Gallery
// ==========================================
const WorkshopGallery = ({ images, mainImage }) => {
  const [selectedImage, setSelectedImage] = useState('');
  const [startIndex, setStartIndex] = useState(0);
  const itemsToShow = 4;

  const getImageSrc = (img) => {
      if (typeof img === 'string') return img;
      return img?.url || '';
  };

  useEffect(() => {
    if (images && images.length > 0) {
        setSelectedImage(getImageSrc(images[0]));
    } else if (mainImage) {
        setSelectedImage(mainImage);
    } else {
        setSelectedImage("https://via.placeholder.com/600x400?text=No+Image");
    }
  }, [images, mainImage]);

  const nextThumb = () => { if (startIndex + itemsToShow < (images?.length || 0)) setStartIndex(prev => prev + 1); };
  const prevThumb = () => { if (startIndex > 0) setStartIndex(prev => prev - 1); };
  
  const visibleThumbnails = images ? images.slice(startIndex, startIndex + itemsToShow) : [];

  return (
    <div className="flex flex-col gap-6 animate-fade-up">
      <div className="w-full h-[400px] md:h-[500px] bg-gray-50 rounded-2xl overflow-hidden relative group border border-gray-100 shadow-inner">
        <img 
            src={selectedImage} 
            alt="Workshop Main" 
            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500 ease-in-out" 
        />
      </div>
      
      {images && images.length > 1 && (
          <div className="relative w-full flex items-center justify-center px-8">
            <button onClick={prevThumb} disabled={startIndex === 0} className="absolute left-0 z-10 p-2 rounded-full bg-white shadow-md text-gray-500 hover:text-orange-600 disabled:opacity-30 hover:scale-110 transition-all"><ChevronLeft size={20} /></button>
            <div className="flex gap-4 overflow-hidden py-2">
              {visibleThumbnails.map((img, idx) => (
                <div key={startIndex + idx} onClick={() => setSelectedImage(getImageSrc(img))} className={`w-20 h-20 rounded-lg cursor-pointer flex-shrink-0 p-1 bg-white shadow-sm transition-all duration-300 ${selectedImage === getImageSrc(img) ? 'ring-2 ring-orange-500 scale-105' : 'hover:ring-2 hover:ring-gray-200 opacity-80 hover:opacity-100'}`}>
                  <img src={getImageSrc(img)} alt="thumb" className="w-full h-full object-cover rounded-md" />
                </div>
              ))}
            </div>
            <button onClick={nextThumb} disabled={startIndex + itemsToShow >= images.length} className="absolute right-0 z-10 p-2 rounded-full bg-white shadow-md text-gray-500 hover:text-orange-600 disabled:opacity-30 hover:scale-110 transition-all"><ChevronRight size={20} /></button>
          </div>
      )}
    </div>
  );
};

// ==========================================
// 2. SUB-COMPONENT: Workshop Info & Enroll
// ==========================================
const WorkshopInfo = ({ workshop, onEnroll }) => {
  return (
    <div className="flex flex-col gap-6 animate-fade-up delay-100">
      
      {/* Header Info */}
      <div>
        <div className="flex items-center gap-3 mb-3">
            <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${workshop.workshopType === 'Online' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                {workshop.workshopType}
            </span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${workshop.stockStatus === 'In Stock' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                {workshop.stockStatus === 'In Stock' ? 'Available' : 'Full'}
            </span>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-2">{workshop.title}</h1>
        
        <p className="text-base font-medium text-gray-600 mb-3 flex items-center gap-2">
          Details : <span className="text-orange-600 font-bold">{workshop.instructorName || 'Expert Team'}</span>
        </p>

        <div className="flex items-center gap-2 text-yellow-500 text-sm font-medium">
            <div className="flex"><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/></div>
            <span className="text-gray-400 ml-1">(4.9/5 Rating)</span>
        </div>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4 bg-gray-50 p-5 rounded-xl border border-gray-100">
          <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-pink-500 shadow-sm"><User size={20}/></div>
              <div><p className="text-xs text-gray-500 font-semibold uppercase">Age Group</p><p className="text-sm font-bold text-gray-800">{workshop.ageGroup || '8-16 Years'}</p></div>
          </div>
          <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-purple-500 shadow-sm"><Box size={20}/></div>
              <div><p className="text-xs text-gray-500 font-semibold uppercase">In The Box</p><p className="text-sm font-bold text-gray-800">Complete DIY Kit</p></div>
          </div>
          <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-red-500 shadow-sm"><ShieldCheck size={20}/></div>
              <div><p className="text-xs text-gray-500 font-semibold uppercase">Safety</p><p className="text-sm font-bold text-gray-800">Child Safe Certified</p></div>
          </div>
          <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-indigo-500 shadow-sm"><Heart size={20}/></div>
              <div><p className="text-xs text-gray-500 font-semibold uppercase">Origin</p><p className="text-sm font-bold text-gray-800">Made in India</p></div>
          </div>
      </div>

      {/* Pricing */}
      <div className="p-6 bg-gradient-to-r from-orange-50 to-white border border-orange-100 rounded-xl flex items-center justify-between shadow-sm">
        <div>
            <p className="text-sm text-gray-500 mb-1">Total Course Fee</p>
            <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black text-gray-900">₹{workshop.price}</span>
                {workshop.originalPrice > workshop.price && (
                    <span className="text-lg text-gray-400 line-through">₹{workshop.originalPrice}</span>
                )}
            </div>
        </div>
        {workshop.discount > 0 && <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">{workshop.discount}% OFF Today</span>}
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button 
            onClick={onEnroll} 
            className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
        >
            ENROLL NOW
        </button>
        <button className="w-14 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
            <Share2 size={22}/>
        </button>
      </div>

      {/* Trust Badges */}
      <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-100 text-xs font-medium text-gray-500">
         <span className="flex items-center gap-1"><CheckCircle size={14} className="text-green-500"/> Certified STEM</span>
         <span className="flex items-center gap-1"><CheckCircle size={14} className="text-green-500"/> 100% Fun Learning</span>
         <span className="flex items-center gap-1"><CheckCircle size={14} className="text-green-500"/> Expert Support</span>
      </div>

    </div>
  );
};

// ==========================================
// 3. SUB-COMPONENT: Tabs (Description Only)
// ==========================================
const WorkshopTabs = ({ description, tags }) => {
  return (
    <div className="mt-16 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fade-up delay-200">
      <div className="flex border-b border-gray-100 bg-gray-50/50">
         <button className="px-8 py-5 text-base font-bold tracking-wide uppercase text-orange-600 bg-white border-b-2 border-orange-500">
           Product Details
         </button>
      </div>

      <div className="p-8 md:p-10">
         <div className="grid md:grid-cols-3 gap-10">
            <div className="md:col-span-2 space-y-6">
               <h3 className="text-2xl font-bold text-gray-800">What's Inside?</h3>
               <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">
                  {description || "Join this workshop to master new skills. The curriculum is designed for beginners to advanced learners."}
               </p>
            </div>
            
            <div className="md:col-span-1">
               <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><CheckCircle size={18} className="text-orange-500"/> Features</h3>
                  <ul className="space-y-3">
                      {tags && tags.length > 0 ? (
                        tags.map((tag, i) => (
                           <li key={i} className="flex items-start gap-3 text-gray-700 text-sm">
                              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 flex-shrink-0"></span>
                              {tag}
                           </li>
                        ))
                      ) : (
                        <li className="text-gray-500 text-sm">Interactive Learning</li>
                      )}
                  </ul>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. MAIN PAGE COMPONENT
// ==========================================
const LandingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workshop, setWorkshop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false); // To show loading during submit

  // Form State matching the screenshot
  const [formData, setFormData] = useState({
    studentName: '',
    age: '',
    classGrade: '',
    workshopSubject: '', // Will be prefilled
    parentName: '',
    mobileNumber: '',
    email: '',
    address: ''
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/workshops/${id}`);
        const data = res.data.data;
        setWorkshop(data);
        // Prefill the workshop name
        setFormData(prev => ({ ...prev, workshopSubject: data.title }));
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEnrollSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
        const enrollmentData = {
            ...formData,
            workshopId: workshop._id,
            workshopName: workshop.title,
            amount: workshop.price
        };

        // Send data to backend
        const res = await axios.post(`${API_BASE_URL}/enrollments`, enrollmentData);

        if (res.data.success) {
            alert('Enrollment details saved! Redirecting to Payment...');
            // Redirect to Payment Gateway (Mocking here)
            // You can pass the enrollmentId to the payment page if needed
            // navigate(`/payment/${res.data.enrollmentId}`); 
            navigate('/checkout'); // Or wherever your payment page is
        }
    } catch (error) {
        console.error("Enrollment Error:", error);
        alert("Failed to enroll. Please try again.");
    } finally {
        setSubmitLoading(false);
        setShowModal(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!workshop) return <div className="h-screen flex items-center justify-center text-xl font-bold text-gray-400">Workshop not found</div>;

  return (
    <div className="bg-white min-h-screen pb-20 font-sans">
      <style>{styles}</style>
      
      {/* Breadcrumb */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 text-sm font-medium flex items-center gap-2 opacity-90">
          <span onClick={() => navigate('/')} className="cursor-pointer hover:underline">Home</span> 
          <ChevronRight size={14}/> 
          <span onClick={() => navigate('/workshop')} className="cursor-pointer hover:underline">Workshops</span> 
          <ChevronRight size={14}/> 
          <span className="font-bold truncate max-w-[200px]">{workshop.title}</span>
        </div>
      </div>

      <main className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-10 border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <WorkshopGallery images={workshop.images} mainImage={workshop.image} />
            <WorkshopInfo workshop={workshop} onEnroll={() => setShowModal(true)} />
          </div>
        </div>
        <WorkshopTabs description={workshop.description} tags={workshop.tags} />
      </main>

      {/* Enrollment Modal - UPDATED LAYOUT */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#eefcfc] rounded-2xl w-full max-w-xl relative shadow-2xl transform scale-100 transition-all overflow-hidden border-4 border-white">
            
            {/* Modal Header */}
            <div className="px-8 pt-6 pb-2">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">Enrollment Form</h2>
                    <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-800 transition">
                        <X size={24} />
                    </button>
                </div>
                <p className="text-sm text-gray-600 mt-1">Register for: <b>{workshop.title}</b></p>
                <div className="h-[1px] bg-gray-300 w-full mt-3"></div>
            </div>
            
            {/* Modal Body */}
            <form onSubmit={handleEnrollSubmit} className="px-8 pb-8 pt-4 space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Student Name *</label>
                      <input name="studentName" required value={formData.studentName} onChange={handleInputChange} className="w-full px-3 py-2 bg-transparent border border-gray-400 rounded focus:ring-1 focus:ring-orange-500 outline-none text-sm placeholder-gray-400" />
                  </div>
                  <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Age *</label>
                      <input name="age" type="number" required value={formData.age} onChange={handleInputChange} className="w-full px-3 py-2 bg-transparent border border-gray-400 rounded focus:ring-1 focus:ring-orange-500 outline-none text-sm placeholder-gray-400" />
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Class/Grade *</label>
                      <input name="classGrade" required value={formData.classGrade} onChange={handleInputChange} className="w-full px-3 py-2 bg-transparent border border-gray-400 rounded focus:ring-1 focus:ring-orange-500 outline-none text-sm placeholder-gray-400" />
                  </div>
                  <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Workshop/Subject *</label>
                      <input name="workshopSubject" readOnly value={formData.workshopSubject} className="w-full px-3 py-2 bg-gray-100 border border-gray-400 rounded outline-none text-sm text-gray-600 cursor-not-allowed" />
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Parent/Guardian Name *</label>
                      <input name="parentName" required value={formData.parentName} onChange={handleInputChange} className="w-full px-3 py-2 bg-transparent border border-gray-400 rounded focus:ring-1 focus:ring-orange-500 outline-none text-sm placeholder-gray-400" />
                  </div>
                  <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Mobile Number *</label>
                      <input name="mobileNumber" type="tel" required value={formData.mobileNumber} onChange={handleInputChange} className="w-full px-3 py-2 bg-transparent border border-gray-400 rounded focus:ring-1 focus:ring-orange-500 outline-none text-sm placeholder-gray-400" />
                  </div>
              </div>

              <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address *</label>
                  <input name="email" type="email" required value={formData.email} onChange={handleInputChange} className="w-full px-3 py-2 bg-transparent border border-gray-400 rounded focus:ring-1 focus:ring-orange-500 outline-none text-sm placeholder-gray-400" />
              </div>

              <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Complete Address *</label>
                  <textarea name="address" rows="2" required value={formData.address} onChange={handleInputChange} className="w-full px-3 py-2 bg-transparent border border-gray-400 rounded focus:ring-1 focus:ring-orange-500 outline-none text-sm placeholder-gray-400 resize-none" />
              </div>

              <div className="flex justify-between items-center pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="text-sm font-medium text-gray-600 hover:text-gray-900">
                      Cancel
                  </button>
                  <button type="submit" disabled={submitLoading} className="px-6 py-2 bg-orange-500 text-white rounded-lg font-bold text-sm hover:bg-orange-600 shadow-md transition-all flex items-center gap-2">
                    {submitLoading ? 'Processing...' : 'Pay Now'}
                  </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default LandingPage;