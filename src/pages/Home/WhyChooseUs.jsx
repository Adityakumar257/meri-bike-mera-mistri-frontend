import React from 'react';

const WhyChooseUs = () => {
  return (
    <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-10 md:mb-12">Why Choose Us</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Free Shipping */}
          <div className="group relative bg-white rounded-3xl p-6 md:p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-3 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-blue-100 rounded-full blur-lg group-hover:bg-blue-200 transition-colors"></div>
                <div className="relative w-28 h-28 md:w-32 md:h-32 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center shadow-xl">
                  <svg className="w-14 h-14 md:w-16 md:h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">Free Shipping</h3>
              <p className="text-lg text-gray-600 mb-4">On all orders above ₹499</p>
              <div className="text-blue-600 text-sm font-semibold px-4 py-2 bg-blue-50 rounded-full">📦 Nationwide Delivery</div>
            </div>
          </div>
          {/* WhatsApp Support */}
          <a href="https://wa.me/919818327437?text=Hello%20Toycra%20Team,%20I%20would%20like%20to%20know%20more%20about%20your%20products." target="_blank" rel="noopener noreferrer" className="group relative bg-white rounded-3xl p-6 md:p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-3 overflow-hidden cursor-pointer block">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-amber-400"></div>
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-orange-100 rounded-full blur-lg group-hover:bg-orange-200 transition-colors"></div>
                <div className="relative w-28 h-28 md:w-32 md:h-32 bg-gradient-to-br from-orange-500 to-amber-400 rounded-full flex items-center justify-center shadow-xl">
                  <svg className="w-14 h-14 md:w-16 md:h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">24/7 WhatsApp Support</h3>
              <p className="text-lg text-gray-600 mb-4">Click to chat on WhatsApp</p>
              <div className="flex flex-col items-center gap-2"><div className="text-orange-600 text-sm font-semibold px-4 py-2 bg-orange-50 rounded-full">⚡ Instant Response</div><div className="text-sm text-orange-500 font-medium mt-2">Click to chat → 9818327437</div></div>
            </div>
          </a>
          {/* Bulk Orders */}
          <a href="mailto:brainytoys9@gmail.com?subject=Toycra%20Bulk%20Order%20Inquiry&body=Hello%20Toycra%20Team..." onClick={(e) => { window.location.href = "mailto:brainytoys9@gmail.com?subject=Toycra Bulk Order Inquiry"; e.preventDefault(); }} className="group relative bg-white rounded-3xl p-6 md:p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-3 overflow-hidden cursor-pointer block">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-600 to-red-500"></div>
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-orange-100 rounded-full blur-lg group-hover:bg-orange-200 transition-colors"></div>
                <div className="relative w-28 h-28 md:w-32 md:h-32 bg-gradient-to-br from-orange-600 to-red-500 rounded-full flex items-center justify-center shadow-xl">
                  <svg className="w-14 h-14 md:w-16 md:h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">Bulk Orders</h3>
              <p className="text-lg text-gray-600 mb-4">Email Us: brainytoys9@gmail.com</p>
              <div className="flex flex-col items-center gap-2"><div className="text-orange-600 text-sm font-semibold px-4 py-2 bg-orange-50 rounded-full">🏢 Best Prices</div></div>
            </div>
          </a>
          {/* Premium Quality */}
          <div className="group relative bg-white rounded-3xl p-6 md:p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-3 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 to-emerald-400"></div>
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-green-100 rounded-full blur-lg group-hover:bg-green-200 transition-colors"></div>
                <div className="relative w-28 h-28 md:w-32 md:h-32 bg-gradient-to-br from-green-500 to-emerald-400 rounded-full flex items-center justify-center shadow-xl">
                  <svg className="w-14 h-14 md:w-16 md:h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">Premium Quality</h3>
              <p className="text-lg text-gray-600 mb-4">Original & Certified Toys</p>
              <div className="text-green-600 text-sm font-semibold px-4 py-2 bg-green-50 rounded-full">✅ 100% Safe</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default WhyChooseUs;