'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: 'Because Quality & INCHES MATTER',
      subtitle: 'Premium ponytails and extensions for busy mamas who want to look fabulous',
      image: 'https://www.badboujeehair.com/cdn/shop/files/EFA8FA51-73E7-45DB-A056-DF8D41C18B7A.jpg',
      cta: 'Shop Ponytails'
    },
    {
      id: 2,
      title: 'Where Quality Meets Affordability',
      subtitle: 'Transform your look with our premium quality extensions starting from $60',
      image: 'https://www.badboujeehair.com/cdn/shop/files/AAB2ABDD-B629-4B96-8972-76F322C6EC1B.jpg',
      cta: 'Shop Clip-Ins'
    },
    {
      id: 3,
      title: 'For The Busy Mama',
      subtitle: 'Low maintenance, high impact hair solutions that fit your lifestyle',
      image: 'https://www.badboujeehair.com/cdn/shop/files/0F6953AA-E02C-45B5-B59B-6FB7540D3827.jpg',
      cta: 'Shop All Products'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
            index === currentSlide ? 'translate-x-0' : 
            index < currentSlide ? '-translate-x-full' : 'translate-x-full'
          }`}
        >
          <div 
            className="w-full h-full bg-gradient-to-r from-black/50 to-transparent bg-cover bg-center relative"
            style={{
              backgroundImage: `url(${slide.image})`,
            }}
          >
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 flex items-center h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-lg">
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
                  {slide.title}
                </h2>
                <p className="text-xl md:text-2xl text-gray-200 mb-8">
                  {slide.subtitle}
                </p>
                <button className="bg-accent-pink hover:bg-pink-600 text-white font-semibold py-3 px-8 rounded-full transition-colors duration-200 text-lg">
                  {slide.cta}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors z-20"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors z-20"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-accent-pink' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;