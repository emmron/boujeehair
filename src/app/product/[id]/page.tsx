'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Star, Heart, ShoppingBag, Truck, Shield, RotateCcw, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';
import Link from 'next/link';
import BookingCalendar from '@/components/BookingCalendar';

// Enhanced product data with images and details
const productData = {
  1: {
    id: 1,
    name: "Luxe Ponytail Extension - Chocolate Brown",
    price: "$85 AUD",
    originalPrice: "$120 AUD",
    category: "Ponytails",
    rating: 4.8,
    reviews: 247,
    images: [
      "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&q=80",
      "https://images.unsplash.com/photo-1594736797933-d0201ba4fe65?w=600&q=80",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80",
      "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=600&q=80"
    ],
    description: "Transform your look instantly with our premium chocolate brown ponytail extension. Made from 100% human hair, this luxurious piece offers natural movement and shine that blends seamlessly with your own hair.",
    features: [
      "100% Premium Human Hair",
      "Heat Resistant up to 180°C",
      "Easy Clip-in Application",
      "22-inch Length",
      "Natural Chocolate Brown (#4)",
      "Tangle-Free & Shed-Free"
    ],
    specifications: {
      "Length": "22 inches",
      "Weight": "120g",
      "Color": "Chocolate Brown (#4)",
      "Hair Type": "100% Human Hair",
      "Texture": "Silky Straight",
      "Cap Construction": "Clip-in"
    },
    careInstructions: [
      "Gently brush before and after use",
      "Wash with sulfate-free shampoo",
      "Air dry or use low heat",
      "Store on a wig stand when not in use",
      "Avoid sleeping in extensions"
    ],
    inStock: true,
    stockCount: 15,
    shippingInfo: {
      "Express Delivery": "1-2 business days - $15",
      "Standard Delivery": "3-5 business days - Free over $100",
      "Same Day (Sydney/Melbourne)": "Order before 2PM - $25"
    }
  },
  2: {
    id: 2,
    name: "Clip-In Hair Extensions Set - Honey Blonde",
    price: "$165 AUD",
    originalPrice: "$220 AUD",
    category: "Clip-Ins",
    rating: 4.9,
    reviews: 189,
    images: [
      "https://images.unsplash.com/photo-1560869713-7d0954650da1?w=600&q=80",
      "https://images.unsplash.com/photo-1541823709867-1b206113eafd?w=600&q=80",
      "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600&q=80",
      "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=600&q=80"
    ],
    description: "Complete your transformation with our 7-piece honey blonde clip-in extension set. Perfect for adding length and volume, these premium extensions blend naturally for that salon-fresh look every time.",
    features: [
      "7-Piece Complete Set",
      "120g Total Weight",
      "Premium European Hair",
      "Double Wefted for Durability",
      "Honey Blonde (#27)",
      "Professional Grade Clips"
    ],
    specifications: {
      "Length": "20 inches",
      "Weight": "120g (7 pieces)",
      "Color": "Honey Blonde (#27)",
      "Hair Type": "European Human Hair",
      "Texture": "Beach Wave",
      "Cap Construction": "Clip-in Wefts"
    },
    careInstructions: [
      "Detangle gently with wide-tooth comb",
      "Use color-safe products only",
      "Deep condition weekly",
      "Protect from heat damage",
      "Store flat in original packaging"
    ],
    inStock: true,
    stockCount: 8,
    shippingInfo: {
      "Express Delivery": "1-2 business days - $15",
      "Standard Delivery": "3-5 business days - Free over $100",
      "Same Day (Sydney/Melbourne)": "Order before 2PM - $25"
    }
  }
};

export default function ProductPage() {
  const params = useParams();
  const productId = params.id as string;
  const product = productData[productId as '1' | '2'] || null;
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [showBooking, setShowBooking] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  const { addItem } = useCartStore();

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Product Not Found</h1>
          <Link href="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        description: product.description,
        category: product.category
      });
    }
    
    toast.success(`${quantity} x ${product.name} added to cart! 🛍️`, {
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

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="min-h-screen bg-gradient-light pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li><Link href="/" className="text-gray-500 hover:text-primary-pink">Home</Link></li>
            <li className="text-gray-400">/</li>
            <li><span className="text-gray-500">{product.category}</span></li>
            <li className="text-gray-400">/</li>
            <li><span className="text-primary-pink font-medium">{product.name}</span></li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-soft">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {/* Image Navigation */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-soft transition-all duration-300"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-soft transition-all duration-300"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
              
              {/* Image Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === selectedImage ? 'bg-primary-pink' : 'bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-xl overflow-hidden transition-all duration-300 ${
                    index === selectedImage 
                      ? 'ring-2 ring-primary-pink shadow-pink' 
                      : 'hover:shadow-soft'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-primary-pink font-medium text-sm uppercase tracking-wide">
                  {product.category}
                </span>
                <button className="p-2 hover:bg-light-pink rounded-full transition-colors">
                  <Heart className="h-5 w-5 text-gray-400 hover:text-primary-pink" />
                </button>
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`} 
                    />
                  ))}
                </div>
                <span className="text-gray-600 font-medium">{product.rating}</span>
                <span className="text-gray-400">({product.reviews} reviews)</span>
              </div>
              
              {/* Price */}
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-3xl font-bold text-primary-pink">{product.price}</span>
                <span className="text-xl text-gray-400 line-through">{product.originalPrice}</span>
                <span className="bg-gradient-pink text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Save {Math.round(((parseInt(product.originalPrice.replace(/[^0-9]/g, '')) - parseInt(product.price.replace(/[^0-9]/g, ''))) / parseInt(product.originalPrice.replace(/[^0-9]/g, ''))) * 100)}%
                </span>
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={product.inStock ? 'text-green-600' : 'text-red-600'}>
                {product.inStock ? `In Stock (${product.stockCount} left)` : 'Out of Stock'}
              </span>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl p-6 shadow-soft">
              <h3 className="font-semibold text-gray-800 mb-3">Key Features</h3>
              <ul className="grid grid-cols-2 gap-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-primary-pink rounded-full mr-2"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border-2 border-gray-200 rounded-xl">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-gray-600 hover:text-primary-pink"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 text-gray-600 hover:text-primary-pink"
                  >
                    +
                  </button>
                </div>
                
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span>Add to Cart</span>
                </button>
              </div>
              
              <button
                onClick={() => setShowBooking(!showBooking)}
                className="w-full btn-secondary flex items-center justify-center space-x-2"
              >
                <Calendar className="h-5 w-5" />
                <span>Book Professional Application</span>
              </button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="text-center">
                <Truck className="h-6 w-6 text-primary-pink mx-auto mb-2" />
                <p className="text-xs text-gray-600">Free Shipping Over $100</p>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 text-primary-pink mx-auto mb-2" />
                <p className="text-xs text-gray-600">Quality Guarantee</p>
              </div>
              <div className="text-center">
                <RotateCcw className="h-6 w-6 text-primary-pink mx-auto mb-2" />
                <p className="text-xs text-gray-600">30-Day Returns</p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Calendar */}
        {showBooking && (
          <div className="mb-16">
            <BookingCalendar productName={product.name} />
          </div>
        )}

        {/* Product Details Tabs */}
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {['description', 'specifications', 'care', 'shipping', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm capitalize transition-colors ${
                    activeTab === tab
                      ? 'border-primary-pink text-primary-pink'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab === 'care' ? 'Care Instructions' : tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed mb-4">{product.description}</p>
                <p className="text-gray-600 leading-relaxed">
                  Our extensions are crafted with care by experienced professionals who understand the importance of quality and natural beauty. Each piece undergoes rigorous quality control to ensure you receive only the finest hair extensions that will enhance your natural beauty and boost your confidence.
                </p>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-800">{key}:</span>
                    <span className="text-gray-600">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'care' && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-4">How to Care for Your Extensions</h3>
                <ul className="space-y-3">
                  {product.careInstructions.map((instruction, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary-pink mr-3 mt-1">•</span>
                      <span className="text-gray-600">{instruction}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-4">Shipping Options</h3>
                <div className="space-y-3">
                  {Object.entries(product.shippingInfo).map(([method, details]) => (
                    <div key={method} className="flex justify-between py-3 border-b border-gray-100">
                      <span className="font-medium text-gray-800">{method}:</span>
                      <span className="text-gray-600">{details}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <div className="text-center py-8">
                  <p className="text-gray-500">Customer reviews coming soon!</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Based on {product.reviews} verified purchases with an average rating of {product.rating}/5 stars
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}