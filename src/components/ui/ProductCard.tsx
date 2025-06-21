'use client';

import { useState } from 'react';
import { Heart, ShoppingCart, Eye, Star } from 'lucide-react';
import { Card, CardContent } from './Card';
import Button from './Button';
import { cn } from '@/lib/utils';

interface ProductCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'id'> {
  id: number;
  name: string;
  price: string;
  image: string;
  description: string;
  rating?: number;
  reviews?: number;
  badge?: string;
  onAddToCart?: (product: any) => void;
  onQuickView?: (product: any) => void;
}

const ProductCard = ({ 
  id, 
  name, 
  price, 
  image, 
  description, 
  rating = 5, 
  reviews = 0,
  badge,
  onAddToCart,
  onQuickView,
  className,
  ...props
}: ProductCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const product = { id, name, price, image, description };

  return (
    <Card 
      variant="elevated" 
      className={cn("group overflow-hidden transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl interactive-scale hover:shadow-pink-xl relative", className)}
      {...props}
    >
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white">
        {/* Product Badge */}
        {badge && (
          <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-pink-lg animate-scale-bounce">
            {badge} ✨
          </div>
        )}
        
        {/* Like Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-3 right-3 z-10 bg-white/95 backdrop-blur-sm hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-125 group/heart interactive-scale hover:shadow-pink animate-pulse-pink"
        >
          <Heart 
            className={cn(
              "h-5 w-5 transition-all duration-300 group-hover/heart:scale-110 group-hover/heart:animate-wobble",
              isLiked ? "text-red-500 fill-current animate-scale-bounce" : "text-gray-600 hover:text-red-400"
            )} 
          />
        </button>

        {/* Product Image */}
        <div className="relative aspect-square bg-gradient-to-br from-pink-50 to-purple-50 overflow-hidden rounded-t-xl">
          <img
            src={image}
            alt={name}
            className={cn(
              "w-full h-full object-cover transition-all duration-700 group-hover:scale-125 group-hover:rotate-2",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Loading Shimmer */}
          {!imageLoaded && (
            <div className="absolute inset-0">
              <div className="w-full h-full bg-gradient-to-r from-pink-100 via-purple-100 to-pink-100 animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
          
          {/* Overlay Actions */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onQuickView?.(product)}
                className="bg-white/95 backdrop-blur-sm hover:bg-white text-gray-800 shadow-xl border-0 transform hover:scale-105"
              >
                <Eye className="h-4 w-4 mr-1" />
                Quick View
              </Button>
            </div>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute top-1/2 left-4 opacity-0 group-hover:opacity-30 transition-all duration-700 transform -translate-x-4 group-hover:translate-x-0">
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          </div>
          <div className="absolute top-1/3 right-6 opacity-0 group-hover:opacity-20 transition-all duration-700 transform translate-x-4 group-hover:translate-x-0">
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
          </div>
        </div>
      </div>

      <CardContent className="p-6 bg-gradient-to-br from-white to-pink-25">
        {/* Rating */}
        {reviews > 0 && (
          <div className="flex items-center mb-3 transform transition-all duration-300 group-hover:scale-105">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4 transition-all duration-200",
                    i < rating ? "text-yellow-400 fill-current hover:scale-125" : "text-gray-300"
                  )}
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500 ml-2 font-medium">({reviews})</span>
          </div>
        )}

        {/* Product Name */}
        <h3 className="font-bold text-gray-800 mb-3 leading-tight line-clamp-2 group-hover:text-pink-600 transition-all duration-300 text-lg">
          {name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
          {description}
        </p>

        {/* Price */}
        <div className="mb-4">
          <div className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            {price}
          </div>
          <div className="text-xs text-gray-500 mt-1">Free shipping over $100</div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={() => onAddToCart?.(product)}
            className="w-full transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-pink-xl interactive-scale animate-pulse-pink hover:animate-wobble"
          >
            <ShoppingCart className="h-4 w-4 mr-2 animate-bounce" />
            Add to Cart 🛍️
          </Button>
          
          {/* Quick Features */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-scale-bounce" />
              In Stock ✅
            </span>
            <span className="hover:text-pink-500 transition-colors">✓ 30-day returns</span>
            <span className="hover:text-purple-500 transition-colors">⚡ Fast delivery</span>
          </div>
        </div>
      </CardContent>
      
      {/* Hover Border Effect */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 p-[2px] animate-gradient">
          <div className="w-full h-full bg-white rounded-xl" />
        </div>
      </div>
      
      {/* Floating Magic Sparkles */}
      <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-1000 pointer-events-none">
        <div className="text-yellow-400 animate-float">✨</div>
      </div>
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-1000 pointer-events-none" style={{ animationDelay: '0.5s' }}>
        <div className="text-pink-400 animate-float">💖</div>
      </div>
    </Card>
  );
};

export default ProductCard;