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
      className={cn("group overflow-hidden", className)}
      {...props}
    >
      <div className="relative overflow-hidden">
        {/* Product Badge */}
        {badge && (
          <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {badge}
          </div>
        )}
        
        {/* Like Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-3 right-3 z-10 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all duration-300 hover:scale-110"
        >
          <Heart 
            className={cn(
              "h-5 w-5 transition-colors duration-300",
              isLiked ? "text-red-500 fill-current" : "text-gray-600"
            )} 
          />
        </button>

        {/* Product Image */}
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          <img
            src={image}
            alt={name}
            className={cn(
              "w-full h-full object-cover transition-all duration-700 group-hover:scale-110",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Loading Shimmer */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
          )}
          
          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onQuickView?.(product)}
                className="bg-white/95 hover:bg-white text-gray-800 shadow-lg"
              >
                <Eye className="h-4 w-4 mr-1" />
                Quick View
              </Button>
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Rating */}
        {reviews > 0 && (
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
                  )}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500 ml-2">({reviews})</span>
          </div>
        )}

        {/* Product Name */}
        <h3 className="font-bold text-gray-800 mb-2 leading-tight line-clamp-2 group-hover:text-pink-600 transition-colors">
          {name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-pink-600">
            {price}
          </div>
          
          <Button
            size="sm"
            onClick={() => onAddToCart?.(product)}
            className="ml-2"
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Add to Cart
          </Button>
        </div>

        {/* Free Shipping Badge */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-green-600 font-medium">✓ Free Shipping</span>
            <span className="text-gray-500">Est. 2-3 days</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;