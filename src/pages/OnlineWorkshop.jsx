import React from 'react';

const OnlineTraining = () => {
  const trainingTopics = [
    { 
      id: 1, 
      title: 'Robotics Project', 
      description: 'Online Training',
      image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    { 
      id: 2, 
      title: 'Animal Project', 
      description: 'Online Training',
      image: 'https://images.unsplash.com/photo-1563225141-f1a9a69e4c3c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    { 
      id: 3, 
      title: 'IOT Project', 
      description: 'Online Training',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    { 
      id: 4, 
      title: 'Wireless Project', 
      description: 'Online Training',
      image: 'https://images.unsplash.com/photo-1619409437366-4d5a0c4c0e5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    { 
      id: 5, 
      title: 'Electronics Project', 
      description: 'Online Training',
      image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    { 
      id: 6, 
      title: 'Embedded Project', 
      description: 'Online Training',
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    { 
      id: 7, 
      title: 'Python Project', 
      description: 'Online Training',
      image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    { 
      id: 8, 
      title: 'Arduino Project', 
      description: 'Online Training',
      image: 'https://images.unsplash.com/photo-1593941707882-a5bba53388fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    { 
      id: 9, 
      title: 'Science Project', 
      description: 'Online Training',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    { 
      id: 10, 
      title: 'Programming Project', 
      description: 'Online Training',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    { 
      id: 11, 
      title: 'Scratch Project', 
      description: 'Online Training',
      image: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    { 
      id: 12, 
      title: 'Electro Dough Project', 
      description: 'Online Training',
      image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab284?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ];

  const handleEnrollClick = (title) => {
    const phoneNumber = '919818327437';
    const message = `Hello! I want to enroll in "${title}" online training. Please provide details.`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-yellow-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section - Image without yellow overlay */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-12">
          <img 
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Online Training"
            className="w-full h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Online Training</h1>
            <p className="text-xl text-white/90">
              Learn robotics from anywhere with expert guidance
            </p>
          </div>
        </div>

        {/* Introduction Section */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Welcome to <span className="text-orange-500">Online Training</span>
            </h2>
            <div className="space-y-6 text-gray-700">
              <p className="text-lg">
                Robotics is an exciting and fastest growing field of technology as we are now in the robotic age. Therefore, it is very much essential that the new generation should have the knowledge of robotics, so that they are familiar with its applications.
              </p>
              
              <p className="text-lg">
                We have been teaching robotics and electronics to kids and children since last 9 years and have trained many thousands children. We manufacture our own robotic kits for all age group of children (5 to 16 years) and also for engineering college students. Now, we are launching online training of robotics and basic electronics for kids and children besides engineering college students.
              </p>
              
              <p className="text-lg">
                We have developed many curriculums and a child can learn gradually one by one. Since it is difficult for children to travel long distances to go to robotic training centres, we offer to provide complete training online through skype and video conferencing.
              </p>
              
              <p className="text-lg">
                Once a child chooses a particular course and places the order, he will get the complete DIY kit at home, along with complete study material and building instructions through courier. After that, the child can choose the time slot for online training.
              </p>
              
              <p className="text-lg">
                We have a team of qualified robotic engineers, who will provide complete training step by step, so that the child can easily assemble his robot. The child can ask as many questions from our trainer to build his robot and increase his knowledge.
              </p>
              
              <p className="text-lg font-semibold text-orange-600">
                Each child will be provided a course completion certificate for his/her record.
              </p>
            </div>
          </div>
        </div>

        {/* Training Topics Section */}
        <div className="mb-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Select Your <span className="text-orange-500">Favourite Topic</span>
            </h2>
            <p className="text-gray-700 max-w-3xl mx-auto text-lg">
              Select your favourite topic and start Online Training
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {trainingTopics.map((topic) => (
              <div key={topic.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                {/* Topic Image */}
                <div className="h-48 overflow-hidden">
                  <img 
                    src={topic.image} 
                    alt={topic.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                {/* Card Content */}
                <div className="p-5">
                  {/* Heading */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{topic.title}</h3>
                  
                  {/* Description Badge */}
                  <div className="mb-4">
                    <span className="bg-orange-100 text-orange-800 text-sm font-semibold px-3 py-1 rounded-full">
                      {topic.description}
                    </span>
                  </div>
                  
                  {/* Orange Button */}
                  <button
                    onClick={() => handleEnrollClick(topic.title)}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-3 px-4 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
                  >
                    Click Here to Enroll
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left - Image */}
            <div className="relative overflow-hidden rounded-2xl shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Online Learning Process"
                className="w-full h-full object-cover min-h-[400px]"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
                <h3 className="text-2xl font-bold">Virtual Classroom</h3>
                <p>Interactive online sessions with expert trainers</p>
              </div>
            </div>

            {/* Right - Process Steps */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                How <span className="text-orange-500">Online Training</span> Works
              </h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-orange-600 font-bold text-xl">1</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">Choose Your Course</h4>
                    <p className="text-gray-700">Select from our comprehensive range of robotics topics</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-orange-600 font-bold text-xl">2</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">Get Kit Delivered</h4>
                    <p className="text-gray-700">Complete DIY kit delivered to your doorstep via courier</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-orange-600 font-bold text-xl">3</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">Join Online Sessions</h4>
                    <p className="text-gray-700">Attend interactive training sessions via video conferencing</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-orange-600 font-bold text-xl">4</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">Get Certified</h4>
                    <p className="text-gray-700">Receive course completion certificate for your record</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl shadow-2xl p-8 text-white">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Start Your Online Training Today</h2>
            <p className="text-xl mb-6">Contact us for enrollment and queries</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Details */}
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="text-2xl mr-4">📱</span>
                  <div>
                    <p className="text-lg font-semibold">+919818327437</p>
                    <p className="text-lg font-semibold">+918750052475</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-4">📧</span>
                  <div>
                    <p className="text-lg font-semibold">brainytoys9@gmail.com</p>
                    <p className="text-lg font-semibold">vardhman099@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-2xl mr-4">📍</span>
                  <p className="text-lg">
                    VARDHMAN INTERNATIONAL House No.D252,<br />
                    Sushant Lok II, Golf Course Road,<br />
                    GURGAON-122011 (HARYANA) India
                  </p>
                </div>
              </div>
            </div>
            
            {/* CTA Button */}
            <div className="flex flex-col items-center justify-center">
              <button 
                onClick={() => {
                  const phoneNumber = '919818327437';
                  const message = 'Hello! I want to book a free demo session for online training.';
                  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                  window.open(whatsappUrl, '_blank');
                }}
                className="bg-white text-orange-600 font-bold text-xl py-4 px-8 rounded-xl hover:bg-gray-100 transition-colors shadow-lg mb-4 w-full flex items-center justify-center"
              >
                <span className="mr-3">📱</span>
                Book Free Demo on WhatsApp
              </button>
              <p className="text-white/90 text-center">Interactive demo session available</p>
              <p className="text-white/80 text-sm text-center mt-4">
                Click to open WhatsApp and book your demo instantly
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnlineTraining;