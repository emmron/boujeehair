'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Heart, Star } from 'lucide-react';
import Button from './ui/Button';

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: 'Because Quality & INCHES MATTER',
      subtitle: 'Premium ponytails and extensions for busy mamas who want to look fabulous',
      image: 'https://www.badboujeehair.com/cdn/shop/files/badboujee-slide1.jpg?v=1730189544',
      cta: 'Shop Ponytails',
      accent: '✨'
    },
    {
      id: 2,
      title: 'Where Quality Meets Affordability',
      subtitle: 'Transform your look with our premium quality extensions starting from $60',
      image: 'https://www.badboujeehair.com/cdn/shop/files/badboujee-slide2.jpg?v=1730189675',
      cta: 'Shop Clip-Ins',
      accent: '💕'
    },
    {
      id: 3,
      title: 'For The Busy Mama',
      subtitle: 'Low maintenance, high impact hair solutions that fit your lifestyle',
      image: 'https://www.badboujeehair.com/cdn/shop/files/badboujee-slide3.jpg?v=1730190497',
      cta: 'Shop All Products',
      accent: '👑'
    }
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <div className="relative h-[80vh] md:h-[90vh] overflow-hidden bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-pink-200 rounded-full opacity-10 animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-200 rounded-full opacity-15 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-pink-300 rounded-full opacity-20 animate-float" style={{ animationDelay: '4s' }} />
        
        <Sparkles className="absolute top-24 left-20 text-pink-400 opacity-30 animate-bounce-gentle h-6 w-6" />
        <Heart className="absolute top-36 right-32 text-pink-500 opacity-40 animate-float h-8 w-8" style={{ animationDelay: '1s' }} />
        <Star className="absolute bottom-40 left-32 text-purple-400 opacity-35 animate-bounce-gentle h-5 w-5" style={{ animationDelay: '3s' }} />
        <Star className="absolute top-1/2 right-16 text-pink-400 opacity-25 animate-float h-4 w-4" style={{ animationDelay: '5s' }} />
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20" />

      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            index === currentSlide 
              ? 'translate-x-0 opacity-100' 
              : index < currentSlide 
                ? '-translate-x-full opacity-0' 
                : 'translate-x-full opacity-0'
          }`}
        >
          <div className="w-full h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div className="space-y-8 animate-fade-in">
                <div className="text-7xl mb-6 animate-bounce-gentle">{slide.accent}</div>
                <h2 className="text-5xl md:text-7xl font-bold text-gray-800 leading-tight">
                  <span className="text-gradient-pink animate-gradient">{slide.title.split(' ')[0]}</span>{' '}
                  <span className="text-gradient-purple">{slide.title.split(' ').slice(1).join(' ')}</span>
                </h2>
                <p className="text-xl md:text-3xl text-gray-700 leading-relaxed max-w-2xl font-light">
                  {slide.subtitle}
                </p>
                <div className="flex flex-col sm:flex-row gap-6 pt-8">
                  <Button size="lg" className="transform hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-pink text-lg px-12 py-4">
                    {slide.cta}
                  </Button>
                  <Button variant="secondary" size="lg" className="transform hover:scale-105 transition-all duration-300 text-lg px-12 py-4">
                    Learn More
                  </Button>
                </div>
                
                {/* Enhanced Stats */}
                <div className="flex items-center space-x-12 pt-8">
                  <div className="text-center group cursor-pointer">
                    <div className="text-3xl font-bold text-gradient-pink group-hover:scale-110 transition-transform duration-300">1000+</div>
                    <div className="text-sm text-gray-600 font-medium">Happy Customers</div>
                  </div>
                  <div className="text-center group cursor-pointer">
                    <div className="text-3xl font-bold text-gradient-pink group-hover:scale-110 transition-transform duration-300">5⭐</div>
                    <div className="text-sm text-gray-600 font-medium">Average Rating</div>
                  </div>
                  <div className="text-center group cursor-pointer">
                    <div className="text-3xl font-bold text-gradient-pink group-hover:scale-110 transition-transform duration-300">$60+</div>
                    <div className="text-sm text-gray-600 font-medium">Free Shipping</div>
                  </div>
                </div>
              </div>

              {/* Enhanced Image */}
              <div className="relative animate-slide-up">
                <div className="relative group">
                  {/* Glowing Background */}
                  <div className="absolute -inset-8 rounded-3xl opacity-30 blur-2xl animate-glow"
                       style={{ background: 'var(--gradient-pink)' }}></div>
                  
                  {/* Main Image */}
                  <div className="relative">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="relative w-full h-96 md:h-[550px] object-cover rounded-3xl shadow-2xl transition-all duration-700 group-hover:scale-105 group-hover:rotate-1"
                    />
                    
                    {/* Floating Price Badge */}
                    <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl p-6 shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-300 animate-float" style={{ animationDelay: '1s' }}>
                      <div className="text-sm font-semibold opacity-90">Starting from</div>
                      <div className="text-3xl font-bold">$60 AUD</div>
                    </div>
                    
                    {/* Decorative Elements */}
                    <div className="absolute top-4 left-4 w-4 h-4 bg-yellow-400 rounded-full animate-pulse opacity-70" />
                    <div className="absolute top-8 right-8 w-3 h-3 bg-pink-400 rounded-full animate-bounce-gentle opacity-60" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Enhanced Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-8 top-1/2 transform -translate-y-1/2 
                 bg-white/95 backdrop-blur-sm hover:bg-white text-pink-600 p-5 rounded-full 
                 shadow-2xl hover:shadow-pink transition-all duration-500 
                 hover:scale-125 active:scale-95 z-20 group border border-pink-100"
      >
        <ChevronLeft className="h-7 w-7 group-hover:-translate-x-1 transition-transform duration-300" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-8 top-1/2 transform -translate-y-1/2 
                 bg-white/95 backdrop-blur-sm hover:bg-white text-pink-600 p-5 rounded-full 
                 shadow-2xl hover:shadow-pink transition-all duration-500 
                 hover:scale-125 active:scale-95 z-20 group border border-pink-100"
      >
        <ChevronRight className="h-7 w-7 group-hover:translate-x-1 transition-transform duration-300" />
      </button>

      {/* Enhanced Slide indicators */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-4 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-500 rounded-full border-2 ${
              index === currentSlide 
                ? 'w-12 h-4 shadow-2xl border-pink-300' 
                : 'w-4 h-4 bg-white/70 hover:bg-white border-white/50 hover:border-pink-200 hover:scale-125'
            }`}
            style={index === currentSlide ? { 
              background: 'linear-gradient(135deg, #ff6b9d 0%, #8b5cf6 100%)'
            } : {}}
          />
        ))}
      </div>

      {/* Enhanced Progress bar */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-pink-100 via-purple-100 to-pink-100 z-20">
        <div 
          className="h-full transition-all duration-1000 ease-out animate-gradient"
          style={{ 
            width: `${((currentSlide + 1) / slides.length) * 100}%`,
            background: 'linear-gradient(135deg, #ff6b9d 0%, #8b5cf6 50%, #ec4899 100%)',
            backgroundSize: '200% 100%'
          }}
        />
        
        {/* Animated sparkles on progress bar */}
        <div className="absolute top-0 h-full overflow-hidden">
          <div className="h-full w-4 bg-white/40 animate-shimmer" style={{
            width: `${((currentSlide + 1) / slides.length) * 100}%`
          }} />
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;