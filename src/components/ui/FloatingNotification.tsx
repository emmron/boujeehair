'use client';

import { useState, useEffect } from 'react';
import { X, ShoppingBag, Heart, Star } from 'lucide-react';
import { Card } from './Card';
import { cn } from '@/lib/utils';

interface FloatingNotificationProps {
  show: boolean;
  onClose: () => void;
  type?: 'purchase' | 'review' | 'wishlist';
  customerName?: string;
  productName?: string;
  location?: string;
  timeAgo?: string;
}

const FloatingNotification = ({
  show,
  onClose,
  type = 'purchase',
  customerName = 'Sarah M.',
  productName = 'Luxe Ponytail Extension',
  location = 'Sydney',
  timeAgo = '2 minutes ago'
}: FloatingNotificationProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'purchase':
        return <ShoppingBag className="h-5 w-5 text-green-600" />;
      case 'review':
        return <Star className="h-5 w-5 text-yellow-500" />;
      case 'wishlist':
        return <Heart className="h-5 w-5 text-red-500" />;
      default:
        return <ShoppingBag className="h-5 w-5 text-green-600" />;
    }
  };

  const getMessage = () => {
    switch (type) {
      case 'purchase':
        return `${customerName} from ${location} just purchased`;
      case 'review':
        return `${customerName} left a 5-star review for`;
      case 'wishlist':
        return `${customerName} added to wishlist`;
      default:
        return `${customerName} from ${location} just purchased`;
    }
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 max-w-sm">
      <Card
        className={cn(
          "transition-all duration-300 transform",
          isVisible
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-full opacity-0 scale-95"
        )}
        variant="glass"
      >
        <div className="p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              {getIcon()}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">
                  {getMessage()}
                </p>
                <button
                  onClick={() => {
                    setIsVisible(false);
                    setTimeout(onClose, 300);
                  }}
                  className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <p className="text-sm font-semibold text-pink-600 truncate">
                {productName}
              </p>
              
              <p className="text-xs text-gray-500 mt-1">
                {timeAgo}
              </p>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-3 w-full bg-gray-200 rounded-full h-1">
            <div 
              className="bg-gradient-to-r from-pink-500 to-purple-600 h-1 rounded-full transition-all duration-5000 ease-linear"
              style={{
                width: isVisible ? '0%' : '100%',
                transition: 'width 5s linear'
              }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FloatingNotification;