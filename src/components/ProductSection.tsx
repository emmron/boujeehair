'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { ShoppingBag, Heart, Star, Zap, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import ProductCard from './ui/ProductCard';
import Button from './ui/Button';

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
            <ProductCard
              key={product.id}
              {...product}
              rating={5}
              reviews={124}
              badge="Premium"
              onAddToCart={handleAddToCart}
              onQuickView={(product) => window.location.href = `/product/${product.id}`}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <Button size="lg" className="px-12 py-4">
            View All {title}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductSection;