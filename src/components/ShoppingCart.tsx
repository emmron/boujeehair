'use client';

import { useCartStore } from '@/store/cartStore';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import Checkout from './Checkout';

const ShoppingCart = () => {
  const { 
    items, 
    isOpen, 
    closeCart, 
    updateQuantity, 
    removeItem, 
    getTotalPrice 
  } = useCartStore();
  
  const [mounted, setMounted] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!isOpen) return null;

  const total = getTotalPrice();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={closeCart} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-[#121212] shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <h2 className="text-lg font-semibold text-white">Shopping Cart</h2>
            <button
              onClick={closeCart}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <ShoppingBag className="h-12 w-12 mb-4" />
                <p>Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 bg-[#1a1a1a] p-3 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="text-white font-medium text-sm">{item.name}</h3>
                      <p className="text-gray-400 text-sm">{item.price}</p>
                      
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors"
                        >
                          <Minus className="h-3 w-3 text-white" />
                        </button>
                        <span className="text-white text-sm w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors"
                        >
                          <Plus className="h-3 w-3 text-white" />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="ml-2 text-red-400 hover:text-red-300 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-800 p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-white">Total:</span>
                <span className="text-lg font-bold accent-pink">${total.toFixed(2)} AUD</span>
              </div>
              <button 
                onClick={() => setShowCheckout(true)}
                className="w-full bg-accent-pink hover:bg-pink-600 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
      
      <Checkout 
        isOpen={showCheckout} 
        onClose={() => setShowCheckout(false)} 
      />
    </div>
  );
};

export default ShoppingCart;