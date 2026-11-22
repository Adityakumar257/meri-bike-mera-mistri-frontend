// pages/NotFoundAnimated.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Navigation, Ghost } from 'lucide-react';

const NotFoundAnimated = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const parallaxStyle = {
    transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          {/* Floating 404 */}
          <div 
            style={parallaxStyle}
            className="text-center mb-12 transition-transform duration-300"
          >
            <h1 className="text-9xl font-black text-gray-800 mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                4
              </span>
              <Ghost className="inline-block w-24 h-24 mx-4 text-purple-500 animate-float" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-orange-600">
                4
              </span>
            </h1>
          </div>

          {/* Content */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Page not found</h2>
            <p className="text-gray-600 mb-8 text-lg">
              The page you are looking for may have moved or is no longer available.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-2xl font-bold text-purple-600">98%</div>
                <div className="text-sm text-gray-600">Found their way</div>
              </div>
              <div className="text-center p-4 bg-pink-50 rounded-xl">
                <div className="text-2xl font-bold text-pink-600">2s</div>
                <div className="text-sm text-gray-600">To get back</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-xl">
                <div className="text-2xl font-bold text-orange-600">∞</div>
                <div className="text-sm text-gray-600">Spare parts to explore</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/"
                className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
              >
                <Home className="w-5 h-5" />
                Beam Me Home
              </Link>
              
              <Link 
                to="/category/all"
                className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-white text-gray-800 font-bold rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all transform hover:-translate-y-1"
              >
                <Navigation className="w-5 h-5" />
                Continue Exploring
              </Link>
            </div>
          </div>

          {/* Fun message */}
          <div className="text-center mt-8">
           
          </div>
        </div>
      </div>
    </div>
  );
};

// Add to your global CSS (index.css or tailwind.css):
// @keyframes float {
//   0%, 100% { transform: translateY(0px); }
//   50% { transform: translateY(-20px); }
// }
// .animate-float {
//   animation: float 3s ease-in-out infinite;
// }

export default NotFoundAnimated;