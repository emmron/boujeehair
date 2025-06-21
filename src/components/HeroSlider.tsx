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
    <div className="relative h-[70vh] md:h-[80vh] overflow-hidden bg-gradient-light">
      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <Sparkles className="absolute top-20 left-10 text-primary-pink opacity-20 animate-bounce-gentle h-6 w-6" />
        <Heart className="absolute top-32 right-20 text-secondary-pink opacity-30 animate-bounce-gentle h-8 w-8" style={{ animationDelay: '1s' }} />
        <Star className="absolute bottom-32 left-16 text-primary-pink opacity-25 animate-bounce-gentle h-5 w-5" style={{ animationDelay: '2s' }} />
      </div>

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
              <div className="space-y-6 animate-fade-in">
                <div className="text-6xl mb-4">{slide.accent}</div>
                <h2 className="text-4xl md:text-6xl font-bold text-gray-800 leading-tight">
                  <span className="text-gradient-pink">{slide.title.split(' ')[0]}</span>{' '}
                  {slide.title.split(' ').slice(1).join(' ')}
                </h2>
                <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-lg">
                  {slide.subtitle}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button size="lg">
                    {slide.cta}
                  </Button>
                  <Button variant="secondary" size="lg">
                    Learn More
                  </Button>
                </div>
                
                {/* Stats */}
                <div className="flex items-center space-x-8 pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-pink">1000+</div>
                    <div className="text-sm text-gray-600">Happy Customers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-pink">5⭐</div>
                    <div className="text-sm text-gray-600">Average Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-pink">$60+</div>
                    <div className="text-sm text-gray-600">Free Shipping</div>
                  </div>
                </div>
              </div>

              {/* Image */}
              <div className="relative animate-slide-up">
                <div className="relative">
                  <div className="absolute -inset-4 rounded-3xl opacity-20 blur-lg"
                       style={{ background: 'var(--gradient-pink)' }}></div>
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="relative w-full h-96 md:h-[500px] object-cover rounded-3xl shadow-pink hover-lift"
                  />
                  <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl p-4 shadow-soft">
                    <div className="text-sm font-semibold text-gray-800">Starting from</div>
                    <div className="text-2xl font-bold text-primary-pink">$60 AUD</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 
                 bg-white/90 hover:bg-white text-primary-pink p-4 rounded-full 
                 shadow-soft hover:shadow-pink transition-all duration-300 
                 hover:scale-110 z-20"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 
                 bg-white/90 hover:bg-white text-primary-pink p-4 rounded-full 
                 shadow-soft hover:shadow-pink transition-all duration-300 
                 hover:scale-110 z-20"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide 
                ? 'w-8 h-3 shadow-pink' 
                : 'w-3 h-3 bg-white/60 hover:bg-white'
            }`}
            style={index === currentSlide ? { background: 'var(--gradient-pink)' } : {}}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/30 z-20">
        <div 
          className="h-full transition-all duration-100 ease-linear"
          style={{ 
            width: `${((currentSlide + 1) / slides.length) * 100}%`,
            background: 'var(--gradient-pink)'
          }}
        />
      </div>
    </div>
  );
};

export default HeroSlider;