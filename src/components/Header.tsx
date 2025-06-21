'use client';

import { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, Search, Heart, Star, User } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import Button from './ui/Button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { getTotalItems, openCart } = useCartStore();

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalItems = mounted ? getTotalItems() : 0;

  const navigation = [
    { name: 'Ponytails', href: '#ponytails' },
    { name: 'Accessories', href: '#accessories' },
    { name: 'Hair Care', href: '#haircare' },
    { name: "Clip-In's", href: '#clipins' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 text-center text-sm overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full animate-slide-in-right"></div>
        <div className="flex items-center justify-center space-x-4 relative z-10">
          <Star className="h-4 w-4 animate-pulse-pink" />
          <span className="font-medium">FREE shipping on orders over $100 AUD ✨</span>
          <Star className="h-4 w-4 animate-pulse-pink" />
        </div>
      </div>
      
      <header className={`sticky top-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-pink-100' 
          : 'bg-white/98 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0 animate-fade-in group">
              <h1 className="text-2xl md:text-3xl font-bold cursor-pointer transition-all duration-300 group-hover:scale-105 interactive-scale">
                <span className="text-gray-800">Bad &</span>
                <span className="text-gradient-pink animate-gradient bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"> Boujee</span>
                <span className="text-gray-800"> Hair</span>
              </h1>
              <div className="h-0.5 w-0 group-hover:w-full bg-gradient-pink transition-all duration-500 ease-out"></div>
            </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:block">
            <div className="flex items-center space-x-1">
              {navigation.map((item, index) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="relative text-gray-700 hover:text-primary-pink px-4 py-2 text-sm font-medium 
                           transition-all duration-300 rounded-full hover:bg-light-pink group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {item.name}
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 
                                 group-hover:w-3/4 group-hover:left-1/8 transition-all duration-300"
                        style={{ background: 'var(--gradient-pink)' }}></span>
                </a>
              ))}
            </div>
          </nav>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center space-x-2">
            <button className="p-3 text-gray-600 hover:text-primary-pink hover:bg-pink-50 
                             rounded-full transition-all duration-300 hover:scale-110 group interactive-scale
                             hover:shadow-pink">
              <Search className="h-5 w-5 group-hover:rotate-12 transition-transform" />
            </button>
            <button className="p-3 text-gray-600 hover:text-red-500 hover:bg-red-50 
                             rounded-full transition-all duration-300 hover:scale-110 group interactive-scale
                             hover:shadow-lg">
              <Heart className="h-5 w-5 group-hover:scale-110 group-hover:animate-wobble transition-transform" />
            </button>
            <button className="p-3 text-gray-600 hover:text-primary-pink hover:bg-pink-50 
                             rounded-full transition-all duration-300 hover:scale-110 interactive-scale
                             hover:shadow-pink">
              <User className="h-5 w-5" />
            </button>
            <button 
              onClick={openCart}
              className="relative p-3 text-gray-600 hover:text-primary-pink hover:bg-pink-50 
                       rounded-full transition-all duration-300 hover:scale-110 group interactive-scale
                       hover:shadow-pink"
            >
              <ShoppingBag className="h-5 w-5 group-hover:rotate-12 transition-transform" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 text-white text-xs 
                               rounded-full h-6 w-6 flex items-center justify-center font-semibold
                               animate-scale-bounce bg-gradient-to-r from-pink-500 to-purple-600 shadow-pink-lg">
                  {totalItems}
                </span>
              )}
            </button>
            <Button size="sm" className="ml-2 animate-pulse-pink hover:animate-wobble">
              Book Now
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:text-primary-pink hover:bg-light-pink 
                             rounded-full transition-all duration-300 interactive-scale hover:shadow-pink">
              <Search className="h-5 w-5" />
            </button>
            <button 
              onClick={openCart}
              className="relative p-2 text-gray-600 hover:text-primary-pink hover:bg-light-pink 
                       rounded-full transition-all duration-300 interactive-scale hover:shadow-pink"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 text-white text-xs 
                               rounded-full h-5 w-5 flex items-center justify-center font-semibold
                               animate-scale-bounce shadow-pink-lg"
                      style={{ background: 'var(--gradient-pink)' }}>
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:text-primary-pink hover:bg-light-pink 
                       rounded-full transition-all duration-300 interactive-scale hover:shadow-pink
                       hover:rotate-180"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 animate-rotate-slow" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden animate-slide-up">
          <div className="px-4 pt-4 pb-6 space-y-2 bg-white/95 backdrop-blur-md border-t border-pink-100 shadow-pink-lg">
            {navigation.map((item, index) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center text-gray-700 hover:text-primary-pink hover:bg-light-pink 
                         px-4 py-3 text-base font-medium transition-all duration-300 rounded-xl
                         interactive-scale hover:shadow-soft animate-fade-in border-gradient-pink
                         hover:border-pink-200"
                onClick={() => setIsMenuOpen(false)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="animate-slide-in-left">{item.name}</span>
              </a>
            ))}
            <div className="pt-4 mt-4 border-t border-pink-100 space-y-3">
              <Button className="w-full animate-pulse-pink hover:animate-wobble">
                Shop Now 🛍️
              </Button>
              <Button variant="secondary" className="w-full interactive-scale hover:shadow-pink">
                Book Appointment 💅
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
    </>
  );
};

export default Header;