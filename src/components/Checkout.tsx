'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { X, CreditCard, Truck, Shield, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

interface CheckoutProps {
  isOpen: boolean;
  onClose: () => void;
}

const Checkout = ({ isOpen, onClose }: CheckoutProps) => {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postcode: '',
    state: '',
    country: 'Australia',
    phone: ''
  });
  const [processing, setProcessing] = useState(false);

  const total = getTotalPrice();
  const shipping = total > 100 ? 0 : 15; // Free shipping over $100
  const finalTotal = total + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      toast.success('Order placed successfully! You will receive a confirmation email shortly.');
      clearCart();
      onClose();
      setProcessing(false);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-[#121212] shadow-xl overflow-y-auto">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <h2 className="text-2xl font-bold text-white">Checkout</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Mail className="h-5 w-5 mr-2 accent-pink" />
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent-pink"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First name"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent-pink"
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last name"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent-pink"
                    />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent-pink"
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Truck className="h-5 w-5 mr-2 accent-pink" />
                  Shipping Address
                </h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="address"
                    placeholder="Street address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent-pink"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent-pink"
                    />
                    <input
                      type="text"
                      name="postcode"
                      placeholder="Postcode"
                      required
                      value={formData.postcode}
                      onChange={handleInputChange}
                      className="px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent-pink"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <select
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleInputChange}
                      className="px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent-pink"
                    >
                      <option value="">Select State</option>
                      <option value="NSW">New South Wales</option>
                      <option value="VIC">Victoria</option>
                      <option value="QLD">Queensland</option>
                      <option value="WA">Western Australia</option>
                      <option value="SA">South Australia</option>
                      <option value="TAS">Tasmania</option>
                      <option value="ACT">Australian Capital Territory</option>
                      <option value="NT">Northern Territory</option>
                    </select>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent-pink"
                    >
                      <option value="Australia">Australia</option>
                      <option value="New Zealand">New Zealand</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Order Summary</h3>
                <div className="bg-[#1a1a1a] rounded-lg p-4 space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-300">{item.name} x {item.quantity}</span>
                      <span className="text-white">${(parseFloat(item.price.replace('$', '').replace(' AUD', '')) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-700 pt-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Subtotal</span>
                      <span className="text-white">${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Shipping</span>
                      <span className="text-white">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t border-gray-700 pt-2 mt-2">
                      <span className="text-white">Total</span>
                      <span className="accent-pink">${finalTotal.toFixed(2)} AUD</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 accent-pink" />
                  Payment Method
                </h3>
                <div className="bg-[#1a1a1a] rounded-lg p-4 text-center">
                  <Shield className="h-12 w-12 accent-pink mx-auto mb-3" />
                  <p className="text-gray-300 mb-2">Secure Payment Processing</p>
                  <p className="text-sm text-gray-400">
                    Your payment information is encrypted and secure. We accept all major credit cards and PayPal.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={processing || items.length === 0}
                className="w-full bg-accent-pink hover:bg-pink-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                {processing ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  `Complete Order - $${finalTotal.toFixed(2)} AUD`
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;