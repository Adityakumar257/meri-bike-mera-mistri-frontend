import React, { useState } from 'react';
import { FaBell, FaUser, FaBuilding, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCommentDots } from 'react-icons/fa';
// ✅ Import FeedbackService
import { FeedbackService } from '../../services/api';

const Feedback = () => {
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    mobile: '',
    email: '',
    place: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', msg: '' });

    try {
      // ✅ Use FeedbackService.create
      const res = await FeedbackService.create(formData);
      if (res.data.success) {
        setStatus({ type: 'success', msg: 'Thank you! Your feedback has been submitted.' });
        setFormData({ name: '', companyName: '', mobile: '', email: '', place: '', message: '' });
      }
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', msg: error.response?.data?.message || 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Content from Docx */}
        <div className="md:w-1/2 bg-gradient-to-br from-[#e74c3c] to-[#c0392b] p-10 text-white flex flex-col justify-center relative">
          <div className="absolute top-10 left-10 opacity-20">
              <FaBell className="text-9xl" />
          </div>
          
          <div className="relative z-10">
            {/* Heading from Docx */}
            <h2 className="text-4xl font-extrabold mb-6">Feed Back</h2>
            
            {/* Content from Docx */}
            <p className="text-xl font-semibold mb-4 opacity-95">
              Welcome to our website!
            </p>
            
            <p className="text-lg leading-relaxed mb-6 opacity-90">
              We always look forward to receive feed back from our customers and their experiences about our services, including their suggestions, so that we can keep on improving our performance and serve the entrepreneurs community at the best.
            </p>
            
            <p className="text-lg leading-relaxed opacity-90 mb-8">
              Please submit your feed Back along with your contact details.
            </p>
            
            {/* Contact Info (Kept for better UI) */}
            <div className="mt-4 space-y-4 border-t border-white/20 pt-6">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <FaEnvelope className="text-xl" />
                  </div>
                  <div>
                    <p className="text-sm opacity-75">Email Us</p>
                    <p className="font-semibold">info@brainytoys.in</p>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <FaPhone className="text-xl" />
                  </div>
                  <div>
                    <p className="text-sm opacity-75">Call Us</p>
                    <p className="font-semibold">+91 8750052475</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-1/2 p-10 md:p-14 bg-white">
          <h3 className="text-3xl font-bold text-gray-800 mb-2">Feedback Form</h3>
          <p className="text-gray-500 mb-8">Please submit your feedback along with your contact details.</p>

          {status.msg && (
            <div className={`p-4 mb-6 rounded-lg text-sm ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {status.msg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Name */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <FaUser />
                    </div>
                    <input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange}
                        placeholder="Name *" 
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e74c3c] focus:border-transparent outline-none transition-all"
                    />
                </div>

                {/* Company Name */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <FaBuilding />
                    </div>
                    <input 
                        type="text" 
                        name="companyName" 
                        value={formData.companyName} 
                        onChange={handleChange}
                        placeholder="Company Name *" 
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e74c3c] focus:border-transparent outline-none transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Mobile */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <FaPhone />
                    </div>
                    <input 
                        type="tel" 
                        name="mobile" 
                        value={formData.mobile} 
                        onChange={handleChange}
                        placeholder="Mobile No. *" 
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e74c3c] focus:border-transparent outline-none transition-all"
                    />
                </div>

                {/* Email */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <FaEnvelope />
                    </div>
                    <input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange}
                        placeholder="Email Id *" 
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e74c3c] focus:border-transparent outline-none transition-all"
                    />
                </div>
            </div>

            {/* Place */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FaMapMarkerAlt />
                </div>
                <input 
                    type="text" 
                    name="place" 
                    value={formData.place} 
                    onChange={handleChange}
                    placeholder="Place (City/State)" 
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e74c3c] focus:border-transparent outline-none transition-all"
                />
            </div>

            {/* Message */}
            <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none text-gray-400">
                    <FaCommentDots />
                </div>
                <textarea 
                    name="message" 
                    value={formData.message} 
                    onChange={handleChange}
                    placeholder="Your Message / Suggestion" 
                    rows="4"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e74c3c] focus:border-transparent outline-none transition-all resize-none"
                ></textarea>
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#e74c3c] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#c0392b] transition-colors duration-300 shadow-lg transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
                {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Feedback;