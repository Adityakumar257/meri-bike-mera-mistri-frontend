import React from 'react';
import Counter from '../../components/layout/Counter'; 

const Achievements = () => {
  return (
    <div className="mt-12 md:mt-16 bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden max-w-7xl mx-auto">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-32 -translate-x-32"></div>
      </div>
      <div className="relative z-10">
        <h3 className="text-2xl md:text-3xl font-bold text-center text-white mb-8 md:mb-12">Our Achievements</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <div className="text-center">
            <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 flex items-center justify-center">
              <Counter start={0} end={5000} duration={3} />
              <span className="text-3xl md:text-4xl">+</span>
            </div>
            <div className="text-orange-100 text-base md:text-lg font-medium">Happy Customers</div>
            <div className="text-orange-200 text-sm mt-2">Across India</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 flex items-center justify-center">
              <Counter start={0} end={2000} duration={3} />
              <span className="text-3xl md:text-4xl">+</span>
            </div>
            <div className="text-orange-100 text-base md:text-lg font-medium">Products Sold</div>
            <div className="text-orange-200 text-sm mt-2">Quality Guaranteed</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 flex items-center justify-center">
              <Counter start={0} end={50} duration={2} />
              <span className="text-3xl md:text-4xl">+</span>
            </div>
            <div className="text-orange-100 text-base md:text-lg font-medium">Cities Served</div>
            <div className="text-orange-200 text-sm mt-2">Nationwide Reach</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 flex items-center justify-center">
              <Counter start={0} end={24} duration={2} />
              <span className="text-3xl md:text-4xl">/</span>
              <Counter start={0} end={7} duration={2} />
            </div>
            <div className="text-orange-100 text-base md:text-lg font-medium">Support Available</div>
            <div className="text-orange-200 text-sm mt-2">Always Ready to Help</div>
          </div>
        </div>
        <div className="mt-8 md:mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-white font-medium">Trusted by Parents & Schools</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Achievements;