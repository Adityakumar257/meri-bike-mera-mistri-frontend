import React, { useState } from 'react';
import { 
  FaExclamationTriangle, 
  FaUser, 
  FaBuilding, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaCommentDots,
  FaShieldAlt
} from 'react-icons/fa';
// ✅ Import ComplaintService
import { ComplaintService } from '../../services/api';

const Complaint = () => {
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
      // ✅ Use ComplaintService.create
      const res = await ComplaintService.create(formData);
      if (res.data.success) {
        setStatus({ type: 'success', msg: 'Your complaint has been registered. We will look into it shortly.' });
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
        
        {/* Left Side: Content & Info */}
        <div className="md:w-1/2 bg-gradient-to-br from-gray-800 to-gray-900 p-10 text-white flex flex-col justify-center relative">
          <div className="absolute top-10 left-10 opacity-10">
              <FaExclamationTriangle className="text-9xl" />
          </div>
          
          <div className="relative z-10">
            {/* Heading */}
            <h2 className="text-4xl font-extrabold mb-6 text-red-400">Complaints</h2>
            
            {/* Content from Docx */}
            <p className="text-lg leading-relaxed mb-6 opacity-90">
              If you have any complaint regarding our products or services, our distributor or any employee, please write to us, so that we will try our best to resolve it.
            </p>
            
            <div className="flex items-start gap-3 bg-white/10 p-4 rounded-lg mb-8 backdrop-blur-sm border border-white/10">
                <FaShieldAlt className="text-2xl text-green-400 shrink-0 mt-1" />
                <p className="text-lg leading-relaxed opacity-95 font-medium">
                  If desired by you then we can keep your name confidential.
                </p>
            </div>
            
            {/* Contact Info */}
            <div className="mt-4 space-y-4">
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
          <h3 className="text-3xl font-bold text-gray-800 mb-2">Complaint Form</h3>
          <p className="text-gray-500 mb-8">Please fill in the details below to register your complaint.</p>

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
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
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
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
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
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
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
                        placeholder="Email Id" 
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
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
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
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
                    placeholder="Your Complaint Message" 
                    rows="4"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all resize-none"
                ></textarea>
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition-colors duration-300 shadow-lg transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
                {loading ? 'Submitting...' : 'Register Complaint'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Complaint;