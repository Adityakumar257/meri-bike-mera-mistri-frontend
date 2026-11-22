import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiCalendar, 
  FiUser, 
  FiTag, 
  FiArrowRight,
  FiShare2,
  FiBookmark,
  FiMessageSquare,
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
  FiClock
} from 'react-icons/fi';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "The Importance of Educational Toys in Early Childhood Development",
      excerpt: "Discover how educational toys can significantly impact your child's cognitive, motor, and social development during their formative years.",
      content: "Educational toys play a crucial role in early childhood development by stimulating curiosity, enhancing problem-solving skills, and promoting creativity. These specially designed toys help children develop fine motor skills, hand-eye coordination, and cognitive abilities while making learning fun and engaging.",
      author: "Dr. Anjali Sharma",
      date: "Dec 15, 2024",
      readTime: "5 min read",
      category: "Child Development",
      tags: ["Educational Toys", "Early Learning", "Child Development"],
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&auto=format&fit=crop",
      featured: true
    },
    {
      id: 2,
      title: "STEM Toys: Preparing Your Child for the Future",
      excerpt: "Explore how STEM toys can help develop critical thinking and problem-solving skills essential for future success.",
      content: "STEM (Science, Technology, Engineering, Mathematics) toys are revolutionizing how children learn. These toys introduce complex concepts through play, helping children develop logical thinking, creativity, and innovation skills that will be invaluable in their future careers.",
      author: "Rajesh Kumar",
      date: "Dec 10, 2024",
      readTime: "4 min read",
      category: "STEM Education",
      tags: ["STEM Toys", "Science", "Technology"],
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w-800&auto=format&fit=crop"
    },
    {
      id: 3,
      title: "Montessori vs. Traditional Toys: Which is Better?",
      excerpt: "A comparative analysis of Montessori-inspired toys versus traditional toys and their impact on child development.",
      content: "Montessori toys focus on self-directed learning and natural materials, while traditional toys often emphasize entertainment. Both have their merits, and the best choice depends on your child's learning style and developmental needs.",
      author: "Priya Mehta",
      date: "Dec 5, 2024",
      readTime: "6 min read",
      category: "Toy Selection",
      tags: ["Montessori", "Traditional Toys", "Learning Styles"],
      image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w-800&auto=format&fit=crop"
    },
    {
      id: 4,
      title: "The Role of Building Blocks in Spatial Intelligence",
      excerpt: "Learn how simple building blocks can significantly enhance your child's spatial awareness and mathematical thinking.",
      content: "Building blocks are more than just toys - they're tools for developing spatial intelligence. Regular play with blocks helps children understand concepts like symmetry, balance, and geometry, laying the foundation for advanced mathematical thinking.",
      author: "Dr. Vikram Singh",
      date: "Nov 28, 2024",
      readTime: "3 min read",
      category: "Cognitive Development",
      tags: ["Building Blocks", "Spatial Intelligence", "Math Skills"],
      image: "https://images.unsplash.com/photo-1587654780298-8c6d6b2c48e7?w-800&auto=format&fit=crop"
    },
    {
      id: 5,
      title: "Eco-Friendly Toys: Why Sustainable Play Matters",
      excerpt: "Discover the benefits of choosing eco-friendly toys and how they contribute to a healthier planet.",
      content: "Sustainable toys made from natural materials like wood, bamboo, and organic cotton are not only safer for children but also better for the environment. Learn how to identify truly eco-friendly toys and make responsible choices for your child's playtime.",
      author: "Neha Gupta",
      date: "Nov 20, 2024",
      readTime: "5 min read",
      category: "Sustainability",
      tags: ["Eco-Friendly", "Sustainable Toys", "Green Living"],
      image: "https://images.unsplash.com/photo-1587654780298-8c6d6b2c48e7?w-800&auto=format&fit=crop"
    },
    {
      id: 6,
      title: "Screen Time vs. Play Time: Finding the Right Balance",
      excerpt: "Practical tips for balancing digital devices with traditional play for optimal child development.",
      content: "In today's digital age, finding the right balance between screen time and traditional play is crucial. Learn strategies to ensure your child gets the benefits of both digital learning and hands-on play experiences.",
      author: "Arun Patel",
      date: "Nov 15, 2024",
      readTime: "7 min read",
      category: "Parenting",
      tags: ["Screen Time", "Digital Balance", "Healthy Habits"],
      image: "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w-800&auto=format&fit=crop"
    },
    {
      id: 7,
      title: "Choosing Age-Appropriate Toys: A Complete Guide",
      excerpt: "A comprehensive guide to selecting toys that match your child's developmental stage and abilities.",
      content: "Selecting the right toys for your child's age is crucial for their safety and development. This guide covers everything from sensory toys for infants to complex construction sets for older children, helping you make informed choices.",
      author: "Dr. Sneha Reddy",
      date: "Nov 10, 2024",
      readTime: "8 min read",
      category: "Toy Selection",
      tags: ["Age Appropriate", "Safety", "Development"],
      image: "https://images.unsplash.com/photo-1599623560574-39d485900c95?w-800&auto=format&fit=crop"
    },
    {
      id: 8,
      title: "The Psychology Behind Pretend Play",
      excerpt: "How imaginative play helps children understand the world and develop emotional intelligence.",
      content: "Pretend play allows children to explore different roles, understand social dynamics, and process complex emotions. This article explores the psychological benefits of role-playing and how it contributes to emotional and social development.",
      author: "Dr. Ankit Verma",
      date: "Nov 5, 2024",
      readTime: "6 min read",
      category: "Psychology",
      tags: ["Pretend Play", "Imagination", "Emotional Development"],
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w-800&auto=format&fit=crop"
    },
    {
      id: 9,
      title: "Musical Toys and Brain Development",
      excerpt: "Discover how musical toys can enhance memory, language skills, and mathematical abilities.",
      content: "Exposure to music through toys can significantly impact brain development. Musical play enhances auditory processing, improves memory, and even boosts mathematical thinking. Learn how to incorporate musical toys into your child's play routine.",
      author: "Ritu Sharma",
      date: "Oct 30, 2024",
      readTime: "4 min read",
      category: "Brain Development",
      tags: ["Musical Toys", "Music Education", "Brain Training"],
      image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w-800&auto=format&fit=crop"
    },
    {
      id: 10,
      title: "Outdoor Play: Essential for Physical and Mental Health",
      excerpt: "Why outdoor play is crucial for developing motor skills, reducing stress, and promoting overall well-being.",
      content: "Outdoor play provides unique benefits that indoor play cannot match. From developing gross motor skills to reducing anxiety and improving focus, discover why every child needs regular outdoor playtime with appropriate toys and equipment.",
      author: "Suresh Nair",
      date: "Oct 25, 2024",
      readTime: "5 min read",
      category: "Physical Health",
      tags: ["Outdoor Play", "Physical Activity", "Mental Health"],
      image: "https://images.unsplash.com/photo-1541692641319-981cc79ee10a?w-800&auto=format&fit=crop"
    }
  ];

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);
  const categories = [...new Set(blogPosts.map(post => post.category))];
  const popularPosts = blogPosts.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Toycra Blog</h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
              Expert insights, parenting tips, and the latest research on child development through play
            </p>
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full px-6 py-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <FiSearch className="absolute right-4 top-4 text-white/70 w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            {/* Featured Post */}
            {featuredPost && (
              <div className="mb-12">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="relative h-64 md:h-80">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white text-4xl font-bold">Featured</span>
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center space-x-4 mb-4">
                      <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-medium">
                        Featured
                      </span>
                      <span className="text-gray-500 text-sm flex items-center">
                        <FiCalendar className="mr-1" /> {featuredPost.date}
                      </span>
                      <span className="text-gray-500 text-sm flex items-center">
                        <FiClock className="mr-1" /> {featuredPost.readTime}
                      </span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">{featuredPost.title}</h2>
                    <p className="text-gray-600 text-lg mb-6">{featuredPost.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                          {featuredPost.author.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{featuredPost.author}</p>
                          <p className="text-sm text-gray-500">{featuredPost.category}</p>
                        </div>
                      </div>
                      <Link
                        to={`/blog/${featuredPost.id}`}
                        className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium"
                      >
                        Read Full Article <FiArrowRight className="ml-2" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Blog Grid */}
            <div className="mb-12">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Latest Articles</h2>
                <div className="flex items-center space-x-2">
                  <button className="p-2 rounded-lg hover:bg-gray-100">
                    <FiChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-gray-100">
                    <FiChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {regularPosts.map((post) => (
                  <div key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="relative h-48">
                      <div className={`absolute inset-0 ${post.id % 3 === 0 ? 'bg-gradient-to-br from-green-400 to-blue-500' : post.id % 3 === 1 ? 'bg-gradient-to-br from-purple-400 to-pink-500' : 'bg-gradient-to-br from-orange-400 to-red-500'}`}></div>
                      <div className="absolute top-4 left-4">
                        <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-gray-500 text-sm flex items-center">
                          <FiCalendar className="mr-1" /> {post.date}
                        </span>
                        <span className="text-gray-500 text-sm flex items-center">
                          <FiClock className="mr-1" /> {post.readTime}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{post.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                            {post.author.charAt(0)}
                          </div>
                          <span className="text-sm text-gray-700">{post.author}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <button className="text-gray-400 hover:text-orange-600">
                            <FiBookmark className="w-4 h-4" />
                          </button>
                          <button className="text-gray-400 hover:text-orange-600">
                            <FiShare2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center space-x-4">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700">
                Previous
              </button>
              <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                1
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700">
                2
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700">
                3
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700">
                Next
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            {/* Categories */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Categories</h3>
              <div className="space-y-3">
                {categories.map((category, index) => (
                  <button
                    key={category}
                    className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-50 group"
                  >
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${index % 4 === 0 ? 'bg-orange-500' : index % 4 === 1 ? 'bg-blue-500' : index % 4 === 2 ? 'bg-green-500' : 'bg-purple-500'}`}></div>
                      <span className="text-gray-700 group-hover:text-orange-600">{category}</span>
                    </div>
                    <span className="text-gray-400 text-sm">12</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Posts */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Popular Posts</h3>
              <div className="space-y-6">
                {popularPosts.map((post) => (
                  <div key={post.id} className="flex items-start space-x-4 group cursor-pointer">
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-gray-900 group-hover:text-orange-600 line-clamp-2">
                        {post.title}
                      </h4>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-gray-500 text-sm">{post.date}</span>
                        <span className="text-gray-500 text-sm">•</span>
                        <span className="text-gray-500 text-sm">{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(blogPosts.flatMap(post => post.tags))).slice(0, 12).map((tag) => (
                  <button
                    key={tag}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-orange-100 text-gray-700 hover:text-orange-600 rounded-full text-sm transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-md p-6">
              <div className="text-white text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiMessageSquare className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Stay Updated</h3>
                <p className="opacity-90 mb-6">
                  Get the latest parenting tips and toy recommendations directly in your inbox
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
                  />
                  <button className="w-full bg-white text-orange-600 hover:bg-gray-100 py-3 rounded-lg font-medium transition-colors">
                    Subscribe Now
                  </button>
                </div>
                <p className="text-xs opacity-75 mt-4">
                  No spam. Unsubscribe at any time.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Expert Authors */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Our Expert Authors</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from(new Set(blogPosts.map(post => post.author))).slice(0, 3).map((author, index) => (
              <div key={author} className="bg-white rounded-xl shadow-md p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  {author.charAt(0)}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{author}</h3>
                <p className="text-gray-600 mb-4">
                  {index === 0 ? 'Child Development Expert' : index === 1 ? 'STEM Education Specialist' : 'Parenting Coach'}
                </p>
                <div className="flex justify-center space-x-3">
                  <span className="text-sm text-gray-500">12 Articles</span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500">5+ Years Experience</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Have Questions About Child Development?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Our team of experts is here to help you choose the perfect toys for your child's growth and development.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/category/all"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium text-lg transition-colors"
            >
              Shop Educational Toys
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-lg font-medium text-lg transition-colors"
            >
              Contact Our Experts
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;