'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { ShoppingBag, Heart, Star, Zap, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  description: string;
}

interface ProductSectionProps {
  title: string;
  products: Product[];
  id: string;
}

const ProductSection = ({ title, products, id }: ProductSectionProps) => {
  const { addItem } = useCartStore();
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

  const handleAddToCart = (product: Product) => {
    addItem({
      ...product,
      category: title
    });
    toast.success(`${product.name} added to cart! 🛍️`, {
      style: {
        background: 'linear-gradient(135deg, #ff6b9d 0%, #ff8fb3 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '600'
      },
      iconTheme: {
        primary: 'white',
        secondary: '#ff6b9d',
      },
    });
  };

  const getSectionIcon = () => {
    switch (title.toLowerCase()) {
      case 'ponytails': return '💇‍♀️';
      case 'accessories': return '✨';
      case 'hair care': return '🌿';
      case 'clip-in extensions': return '👑';
      default: return '💕';
    }
  };

  return (
    <section id={id} className="py-20 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full" style={{ background: 'var(--gradient-pink)' }}></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full" style={{ background: 'var(--gradient-pink)' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full" style={{ background: 'var(--gradient-pink)' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="text-6xl mb-4">{getSectionIcon()}</div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            <span className="text-gradient-pink">{title.split(' ')[0]}</span>{' '}
            {title.split(' ').slice(1).join(' ')}
          </h2>
          <div className="w-24 h-1 mx-auto mb-6 rounded-full" style={{ background: 'var(--gradient-pink)' }}></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our premium {title.toLowerCase()} collection designed for busy women who want to look fabulous
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <div 
              key={product.id} 
              className="card-pink group cursor-pointer overflow-hidden relative"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden rounded-t-2xl">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent 
                               transition-opacity duration-300 ${
                                 hoveredProduct === product.id ? 'opacity-100' : 'opacity-0'
                               }`} />
                
                {/* Quick Actions */}
                <div className={`absolute top-4 right-4 flex flex-col space-y-2 
                               transition-all duration-300 ${
                                 hoveredProduct === product.id ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'
                               }`}>
                  <Link 
                    href={`/product/${product.id}`}
                    className="p-2 bg-white/90 rounded-full text-gray-600 hover:text-primary-pink 
                             hover:bg-white transition-colors shadow-soft"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  <button className="p-2 bg-white/90 rounded-full text-gray-600 hover:text-primary-pink 
                                   hover:bg-white transition-colors shadow-soft">
                    <Heart className="h-4 w-4" />
                  </button>
                </div>

                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <span className="text-white text-xs font-semibold px-3 py-1 
                                 rounded-full shadow-pink"
                        style={{ background: 'var(--gradient-pink)' }}>
                    Premium
                  </span>
                </div>

                {/* Quick Add Button */}
                <div className={`absolute bottom-4 left-4 right-4 
                               transition-all duration-300 ${
                                 hoveredProduct === product.id ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                               }`}>
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="w-full btn-primary flex items-center justify-center space-x-2"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>Quick Add</span>
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6 space-y-4">
                {/* Rating */}
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-sm text-gray-500 ml-2">(124 reviews)</span>
                </div>

                {/* Product Name */}
                <Link 
                  href={`/product/${product.id}`}
                  className="block"
                >
                  <h3 className="text-lg font-bold text-gray-800 group-hover:text-primary-pink transition-colors hover:text-primary-pink">
                    {product.name}
                  </h3>
                </Link>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed">
                  {product.description}
                </p>

                {/* Features */}
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Zap className="h-3 w-3" />
                    <span>Heat Resistant</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="h-3 w-3" />
                    <span>Cruelty Free</span>
                  </div>
                </div>

                {/* Price and Actions */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-primary-pink">
                        {product.price}
                      </span>
                      <div className="text-xs text-gray-500">Free shipping over $100</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Link 
                      href={`/product/${product.id}`}
                      className="btn-ghost text-sm px-4 py-2 text-center"
                    >
                      View Details
                    </Link>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="btn-secondary text-sm px-4 py-2"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <button className="btn-primary text-lg px-12 py-4">
            View All {title}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductSection;