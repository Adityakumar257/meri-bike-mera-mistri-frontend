import React from 'react';
import { FaStore, FaRocket, FaBrain, FaUniversity, FaChartLine, FaHandshake } from 'react-icons/fa';

const SellOnBrainyToys = () => {
  return (
    <div className="min-h-screen container bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        
        {/* Header Section */}
        <div className="bg-orange-600 px-8 py-10 text-white text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <FaStore className="text-3xl"/>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide mb-2">Sell on BrainyToys</h1>
          <p className="text-red-100 font-medium text-lg">Partner with Vardhman International</p>
        </div>

        {/* Content Section */}
        <div className="p-8 md:p-12 space-y-10 text-gray-700 leading-relaxed text-sm md:text-base">
          
          {/* Intro */}
          <section className="text-center max-w-3xl mx-auto">
            <p className="text-lg text-gray-600 mb-4">
              Partner with <strong>BrainyToys (Vardhman International)</strong> and showcase your innovative, educational, and STEM-focused products to a growing community of parents, schools, educators, and young innovators across India.
            </p>
            <p className="font-medium text-gray-800">
              Whether you manufacture, distribute, or curate learning toys, robotics kits, DIY science kits, coding tools, or educational aids—<strong>BrainyToys is the right marketplace to grow your brand</strong>.
            </p>
          </section>

          <hr className="border-gray-200" />

          {/* Why Sell on BrainyToys? */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Why Sell on BrainyToys?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-5 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="text-[#e74c3c] mb-3 text-xl"><FaRocket /></div>
                    <h3 className="font-bold text-gray-800 mb-2">Targeted Educational Audience</h3>
                    <p className="text-sm">Reach customers who are actively looking for quality learning solutions for children—parents, schools, educators, hobby clubs, and training institutes.</p>
                </div>
                <div className="p-5 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="text-[#e74c3c] mb-3 text-xl"><FaBrain /></div>
                    <h3 className="font-bold text-gray-800 mb-2">STEM-Focused Marketplace</h3>
                    <p className="text-sm">BrainyToys is not a generic marketplace. We specialize in STEM, robotics, science, coding, and skill-based learning products, ensuring your offerings reach the right buyers.</p>
                </div>
                <div className="p-5 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="text-[#e74c3c] mb-3 text-xl"><FaUniversity /></div>
                    <h3 className="font-bold text-gray-800 mb-2">Strong School & Workshop Network</h3>
                    <p className="text-sm">Our strong presence in schools, workshops, and training programs gives your products higher visibility and real-world adoption.</p>
                </div>
                <div className="p-5 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="text-[#e74c3c] mb-3 text-xl"><FaChartLine /></div>
                    <h3 className="font-bold text-gray-800 mb-2">Brand Growth & Credibility</h3>
                    <p className="text-sm">Associate your brand with a trusted name in educational innovation. Selling on BrainyToys enhances brand credibility and recognition.</p>
                </div>
                <div className="p-5 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow md:col-span-2 lg:col-span-2">
                    <div className="text-[#e74c3c] mb-3 text-xl"><FaHandshake /></div>
                    <h3 className="font-bold text-gray-800 mb-2">Seller-Friendly Support</h3>
                    <p className="text-sm">From onboarding to product listing and promotions, our team supports you at every step to ensure smooth selling and growth.</p>
                </div>
            </div>
          </section>

          {/* Who & What Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Who Can Sell */}
              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-200">
                  Who Can Sell on BrainyToys?
                </h2>
                <p className="mb-3">We welcome:</p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>Manufacturers of educational toys & kits</li>
                    <li>Robotics & IoT kit developers</li>
                    <li>STEM & DIY science product brands</li>
                    <li>Coding & electronics kit suppliers</li>
                    <li>Educational publishers & learning tool creators</li>
                    <li>Innovative startups in the ed-tech space</li>
                </ul>
                <p className="mt-4 italic text-sm text-[#e74c3c]">
                    If your product adds learning value and inspires curiosity, we want you on BrainyToys.
                </p>
              </section>

              {/* What You Can Sell */}
              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-200">
                  What You Can Sell
                </h2>
                <ul className="list-disc pl-5 space-y-2">
                    <li>STEM learning kits</li>
                    <li>Robotics & automation kits</li>
                    <li>DIY science experiments</li>
                    <li>Coding & electronics kits</li>
                    <li>Mathematical & logical toys</li>
                    <li>Educational games & puzzles</li>
                    <li>School lab & workshop materials</li>
                </ul>
              </section>
          </div>

          {/* How It Works */}
          <section className="bg-orange-50 p-8 rounded-2xl border border-orange-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              How It Works
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-center">
                {[
                    { title: "1. Register", desc: "Fill out the seller registration form" },
                    { title: "2. List Products", desc: "Upload details, images, and pricing" },
                    { title: "3. Go Live", desc: "Our team reviews and publishes listings" },
                    { title: "4. Receive Orders", desc: "Start selling to customers across India" },
                    { title: "5. Grow With Us", desc: "Participate in promotions & workshops" }
                ].map((step, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="font-bold text-[#e74c3c] mb-1">{step.title}</h4>
                        <p className="text-xs text-gray-600">{step.desc}</p>
                    </div>
                ))}
            </div>
          </section>

          {/* Additional Opportunities */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-200">
              Additional Opportunities for Sellers
            </h2>
            <ul className="list-disc pl-5 space-y-2">
                <li>Feature your products in <strong>school workshops & training programs</strong></li>
                <li>Participate in <strong>BrainyToys events, exhibitions, and demo sessions</strong></li>
                <li>Co-create <strong>custom kits</strong> for schools and institutions</li>
                <li>Access bulk and institutional buyers</li>
            </ul>
          </section>

          {/* CTA / Contact */}
          <section className="bg-gray-800 text-white p-8 rounded-2xl text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Start Selling?</h2>
            <p className="mb-6 opacity-90">
              Join a platform that believes in <strong>learning by doing</strong> and <strong>building future-ready skills</strong> in children.
            </p>
            <div className="space-y-2">
                <p className="text-lg font-semibold">👉 Become a Seller on BrainyToys Today</p>
                <div className="mt-4 p-4 bg-gray-700 rounded-lg inline-block text-left">
                    <p className="mb-1">For seller registration and queries, contact us at:</p>
                    <p><strong>Email:</strong> <a href="mailto:info@brainytoys.in" className="text-orange-400 hover:underline">info@brainytoys.in</a></p>
                    <p><strong>Phone:</strong> <a href="tel:+918750052475" className="text-orange-400 hover:underline">+91-8750052475</a></p>
                </div>
            </div>
            <p className="mt-6 text-sm opacity-75">Let’s build the future of learning—together! 🌱</p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default SellOnBrainyToys;