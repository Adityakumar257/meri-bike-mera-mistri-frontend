import React from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HeroSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: false,
  };

  const slides = [
    "https://res.cloudinary.com/dpqw51md9/image/upload/v1767783503/Engineering_for_Kids_yqerkx.jpg",
    "https://res.cloudinary.com/dpqw51md9/image/upload/v1767784104/Coding_Slider_20230222_104156_0003_izl6ri.jpg",
    "https://res.cloudinary.com/dpqw51md9/image/upload/v1767784105/Electronic_and_renewable_energy_workshop_20230222_104156_0001_wvd0vn.jpg",
  ];

  return (
    <section className="relative w-full">
      {/* Slider */}
      <div className="relative h-[55vh] sm:h-[65vh] lg:h-[80vh] max-h-[750px]">
        <Slider {...settings}>
          {slides.map((img, index) => (
            <div key={index} className="relative h-[55vh] sm:h-[65vh] lg:h-[80vh]">
              <img
                src={img}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/30 to-transparent" />
            </div>
          ))}
        </Slider>
      </div>

      {/* Overlay Content */}
      <div className="absolute inset-0 z-20 flex items-center justify-center px-4">
        <div className="w-full max-w-6xl">
          <div className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/30">

              {/* Card 1 */}
              <Link
                to="/category/all"
                className="group flex items-center justify-between p-4 md:p-6 hover:bg-white/20 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-blue-100 group-hover:bg-blue-200">
                    <span className="text-blue-600 text-xl">🎓</span>
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-white">
                      Educational Toys
                    </h3>
                    <p className="text-sm text-white/80">
                      Learn with Fun
                    </p>
                  </div>
                </div>
                <span className="text-white group-hover:translate-x-1 transition">➜</span>
              </Link>

              {/* Card 2 */}
              <Link
                to="/robotics"
                className="group flex items-center justify-between p-4 md:p-6 hover:bg-white/20 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-purple-100 group-hover:bg-purple-200">
                    <span className="text-purple-600 text-xl">🤖</span>
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-white">
                      Robotics
                    </h3>
                    <p className="text-sm text-white/80">
                      Build & Explore
                    </p>
                  </div>
                </div>
                <span className="text-white group-hover:translate-x-1 transition">➜</span>
              </Link>

              {/* Card 3 */}
              <Link
                to="/category/all"
                className="group flex items-center justify-between p-4 md:p-6 hover:bg-white/20 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-green-100 group-hover:bg-green-200">
                    <span className="text-green-600 text-xl">🛠️</span>
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-white">
                      Workshops
                    </h3>
                    <p className="text-sm text-white/80">
                      Creative Sessions
                    </p>
                  </div>
                </div>
                <span className="text-white group-hover:translate-x-1 transition">➜</span>
              </Link>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
