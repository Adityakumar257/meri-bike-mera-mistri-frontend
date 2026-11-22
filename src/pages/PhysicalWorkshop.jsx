import React from 'react';

const PhysicalWorkshops = () => {
  const workshops = [
    { 
      id: 1, 
      title: 'Build Animal Robot', 
      description: 'Create robotic animals that move and respond to their environment',
      image: 'https://images.unsplash.com/photo-1563225141-f1a9a69e4c3c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    { 
      id: 2, 
      title: 'Workshops for Kids', 
      description: 'Fun and educational robotics workshops for young learners',
      image: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    { 
      id: 3, 
      title: 'Robotics For Children', 
      description: 'Age-appropriate robotics learning for children',
      image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab284?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    { 
      id: 4, 
      title: 'Learn Coding', 
      description: 'Programming fundamentals through hands-on projects',
      image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    { 
      id: 5, 
      title: 'Industrial Robotics', 
      description: 'Learn about industrial automation and robotics',
      image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    { 
      id: 6, 
      title: 'Electronics', 
      description: 'Fundamental electronics and circuit building',
      image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    { 
      id: 7, 
      title: 'Renewable Energy', 
      description: 'Build projects using solar and other renewable energy sources',
      image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    { 
      id: 8, 
      title: 'Science Workshops', 
      description: 'Hands-on science experiments and projects',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    { 
      id: 9, 
      title: 'Engineering for Kids', 
      description: 'Introduction to engineering concepts through fun projects',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    { 
      id: 10, 
      title: 'Aero-Modelling Workshop', 
      description: 'Design and build your own aircraft models',
      image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    { 
      id: 11, 
      title: 'Electro-dough workshop', 
      description: 'Create circuits using conductive dough',
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    { 
      id: 12, 
      title: 'Build 5 Working Robots', 
      description: 'Comprehensive workshop to build multiple robots',
      image: 'https://images.unsplash.com/photo-1593941707882-a5bba53388fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    { 
      id: 13, 
      title: 'LEARN TO CODE AR/VR', 
      description: 'Create Augmented and Virtual Reality experiences',
      image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ];

  const features = [
    { icon: '👨‍🏫', title: 'Expert Instructors', description: 'Learn directly from industry professionals' },
    { icon: '🔧', title: 'Hands-on Projects', description: 'Build real projects with provided kits' },
    { icon: '🏆', title: 'Certification', description: 'Receive completion certificates' }
  ];

  const handleWhatsAppClick = () => {
    const phoneNumber = '919818327437';
    const message = 'Hello! I want to book a workshop. Please provide me details.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleReadMore = (workshopTitle) => {
    const phoneNumber = '919818327437';
    const message = `Hello! I'm interested in "${workshopTitle}" workshop. Please send me more details.`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-orange-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section - Image without orange overlay */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-12">
          <img 
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Physical Workshop"
            className="w-full h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Physical Workshops</h1>
            <p className="text-xl text-white/90">
              Hands-on, in-person learning with expert guidance
            </p>
          </div>
        </div>

        {/* Introduction Section */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Join Our <span className="text-orange-500">Physical Workshops</span>
            </h2>
            <p className="text-gray-700 text-lg mb-6">
              Join our hands-on, in-person workshops where you'll learn, build, and create amazing projects with expert guidance. Our physical workshops provide the perfect environment for interactive learning and collaboration.
            </p>
            
            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-orange-50 p-6 rounded-xl border border-orange-200">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-700">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Workshops Grid with Images */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Available <span className="text-orange-500">Workshops</span>
          </h2>
          <p className="text-center text-gray-700 mb-10 max-w-3xl mx-auto">
            Choose from our range of hands-on workshops designed for different age groups and skill levels
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {workshops.map((workshop) => (
              <div key={workshop.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                {/* Workshop Image */}
                <div className="h-48 overflow-hidden">
                  <img 
                    src={workshop.image} 
                    alt={workshop.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{workshop.title}</h3>
                  <p className="text-gray-600 mb-6">{workshop.description}</p>
                  <button 
                    onClick={() => handleReadMore(workshop.title)}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-3 px-4 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all"
                  >
                    Read more
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl shadow-2xl p-8 text-white">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Join Our Physical Workshops</h2>
            <p className="text-xl mb-6">For enrollment and scheduling, contact us:</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Details */}
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-2xl font-bold mb-6">Our Address</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-2xl mr-4">📍</span>
                  <p className="text-lg">
                    VARDHMAN INTERNATIONAL House No.D252,<br />
                    Sushant Lok II, Golf Course Road,<br />
                    GURGAON-122011 (HARYANA) India
                  </p>
                </div>
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
              </div>
            </div>
            
            {/* CTA Button - WhatsApp Integration */}
            <div className="flex flex-col items-center justify-center">
              <button 
                onClick={handleWhatsAppClick}
                className="bg-white text-orange-600 font-bold text-xl py-4 px-8 rounded-xl hover:bg-gray-100 transition-colors shadow-lg mb-4 w-full flex items-center justify-center"
              >
                <span className="mr-3">💬</span>
                Book a Workshop on WhatsApp
              </button>
              <p className="text-white/90 text-center">Limited seats available for each batch</p>
              <p className="text-white/80 text-sm text-center mt-4">
                Click to open WhatsApp and book your workshop instantly
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhysicalWorkshops;