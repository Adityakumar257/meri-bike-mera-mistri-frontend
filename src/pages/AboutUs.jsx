import React from "react";
import { motion } from "framer-motion";

const AboutUs = () => {
  return (
    <div className="w-full bg-gray-50 min-h-screen py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header Section */}
        <div className="text-center mb-8 md:mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-3"
          >
            About Us
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-600"
          >
            Welcome to <span className="font-semibold text-orange-600">brainytoys</span>
          </motion.p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Introduction Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border-l-4 border-orange-500"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Our Mission & Vision
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Welcome to <span className="font-semibold text-orange-600">brainytoys</span>, the only place where you can learn and experiment on Science and technology with an open mind, sharpen your brain and develop your abilities in Robotics, science, electronics, mechanical engineering, renewable energy, aero-modelling and many more.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <span className="font-semibold text-orange-600">brainytoys</span> is the product of over 40 years business experience of its promoters, who are engineers and have felt the need to educate the young kids and children about latest developments in technology which will play a vital role in our daily life. We believe that early exposure to science and technology will give kids more opportunities later in life.
            </p>
          </motion.div>

          {/* Why BrainyToys Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl shadow-lg p-6 md:p-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Why BrainyToys?
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                We don't expect every child to become robot or electronics engineer or science wizard, but we know that it will change their lives by learning the concepts of each subject practically. Children at young age have fresh mind which absorbs knowledge like a sponge absorbs water.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Now-a-days, all of us are having TV, I-Pad, laptops and smart phones in our homes and our children are having easy access to these gadgets and they enjoy watching TV or stuck to I-pads to watch movies/cartoon films etc. Parents are facing serious problems to avoid their wards not to watch TV and I-pads whole day and for that we need something more interesting for the children to play and learn to pass spare time.
              </p>
            </div>
          </motion.div>

          {/* Educational Philosophy */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border-l-4 border-amber-500"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Our Educational Philosophy
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Further, our education system is paying more attention on bookish knowledge and children study to pass the exams or crack a competition like IIT or medical, even though the concepts are not clear to them. I feel, there is a strong need for practical education so that concepts in each subject is clear to the children and they develop an ability to invent new products.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We should educate our children not only to become engineers and doctors but scientists and inventors who create new products/process for the benefit of humanity and to make life easier. Our idea is to provide such products to children at affordable prices, which will develop their brain power and ability to make new inventions.
              </p>
            </div>
          </motion.div>

          {/* Products Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl shadow-lg p-6 md:p-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Our Products & Curriculum
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                We have developed our own many educational products like Robotic kits for different age groups like 5-8 years, 6-9 years, 9-12 years and 12-16 years. We also feel the necessity to teach basic electronics as we are using many electronic gadgets in our houses, therefore children should have basic knowledge to recognize the electronic components, their applications.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Accordingly, we have developed our own electronic kit to learn the same. All our curriculums have been prepared by experienced and qualified teachers in their respective fields.
              </p>
            </div>
          </motion.div>

          {/* Closing Statement */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border-l-4 border-orange-600"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Our Commitment
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Although, I have used my knowledge and experience to help parents to provide practical education to their children, yet there is always scope for more improvement. I invite your valuable suggestions and feedback to make more improvements and offer better services to the community.
            </p>
            <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-gray-700 font-medium">
                <span className="text-orange-600 font-semibold">Contact us:</span> We're always here to help and support your child's learning journey.
              </p>
            </div>
          </motion.div>

          {/* Key Features Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {/* Feature 1 */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-orange-100 hover:border-orange-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-800">40+ Years Experience</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Decades of engineering expertise brought to educational toys
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-orange-100 hover:border-orange-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-amber-100 p-2 rounded-lg">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-800">STEM Learning</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Science, Technology, Engineering & Mathematics education through play
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-orange-100 hover:border-orange-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-800">Age-Appropriate Kits</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Specially designed kits for different age groups (5-16 years)
              </p>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="text-center mt-8"
          >
            <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl p-8 md:p-10 text-white">
              <h3 className="text-2xl font-bold mb-4">Join Our Learning Community</h3>
              <p className="mb-6 max-w-2xl mx-auto text-orange-100">
                Be a part of the revolution in practical education. Help your child discover the joy of learning through hands-on experience.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="/contact"
                  className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition duration-300"
                >
                  Contact Us
                </a>
                <a
                  href="/category/all"
                  className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition duration-300"
                >
                  Explore Toys
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;