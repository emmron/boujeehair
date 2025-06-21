'use client';

import { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, Search, Heart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

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
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'glass-pink shadow-soft' 
        : 'bg-white/95 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 animate-fade-in">
            <h1 className="text-3xl font-bold cursor-pointer">
              <span className="text-gray-800">Bad &</span>
              <span className="text-gradient-pink"> Boujee</span>
              <span className="text-gray-800"> Hair</span>
            </h1>
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
          <div className="hidden md:flex items-center space-x-3">
            <button className="p-3 text-gray-600 hover:text-primary-pink hover:bg-light-pink 
                             rounded-full transition-all duration-300 hover:scale-110">
              <Search className="h-5 w-5" />
            </button>
            <button className="p-3 text-gray-600 hover:text-primary-pink hover:bg-light-pink 
                             rounded-full transition-all duration-300 hover:scale-110">
              <Heart className="h-5 w-5" />
            </button>
            <button 
              onClick={openCart}
              className="relative p-3 text-gray-600 hover:text-primary-pink hover:bg-light-pink 
                       rounded-full transition-all duration-300 hover:scale-110"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 text-white text-xs 
                               rounded-full h-6 w-6 flex items-center justify-center font-semibold
                               animate-bounce-gentle"
                      style={{ background: 'var(--gradient-pink)' }}>
                  {totalItems}
                </span>
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:text-primary-pink hover:bg-light-pink 
                             rounded-full transition-all duration-300">
              <Search className="h-5 w-5" />
            </button>
            <button 
              onClick={openCart}
              className="relative p-2 text-gray-600 hover:text-primary-pink hover:bg-light-pink 
                       rounded-full transition-all duration-300"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 text-white text-xs 
                               rounded-full h-5 w-5 flex items-center justify-center font-semibold"
                      style={{ background: 'var(--gradient-pink)' }}>
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:text-primary-pink hover:bg-light-pink 
                       rounded-full transition-all duration-300"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
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
          <div className="px-4 pt-4 pb-6 space-y-2 bg-white/95 backdrop-blur-sm border-t border-pink-100">
            {navigation.map((item, index) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center text-gray-700 hover:text-primary-pink hover:bg-light-pink 
                         px-4 py-3 text-base font-medium transition-all duration-300 rounded-xl"
                onClick={() => setIsMenuOpen(false)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {item.name}
              </a>
            ))}
            <div className="pt-4 mt-4 border-t border-pink-100">
              <button className="w-full btn-primary">
                Shop Now
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;