import React from 'react';
import { Link } from 'react-router-dom';
import { blogPosts } from './Homedata';

const BlogSection = () => {
  return (
    <div className="w-full bg-white py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-center text-gray-800 mb-6 md:mb-8">Blog Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {blogPosts.map((post, index) => (
            <article key={index} className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <img src={post.image} alt={post.title} className="w-full h-48 md:h-56 object-cover" />
              <div className="p-4 md:p-6">
                <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-3"><span>{post.date}</span><span>•</span><span>{post.author}</span></div>
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3">{post.title}</h3>
                <p className="text-sm md:text-base text-gray-600 mb-4">{post.excerpt}</p>
                <Link to={post.link} className="inline-flex items-center gap-2 text-orange-600 font-medium hover:text-orange-700">Read now <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></Link>
              </div>
            </article>
          ))}
        </div>
        <div className="text-center mt-6 md:mt-8">
          <Link to="/blog" className="inline-flex items-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors duration-300">See More Articles <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></Link>
        </div>
      </div>
    </div>
  );
};
export default BlogSection;