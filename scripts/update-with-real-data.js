const fs = require('fs');

// Load the scraped data
const scrapedData = JSON.parse(fs.readFileSync('./scraped-shopify-data.json', 'utf8'));

console.log('🔄 Updating website with real Bad Boujee Hair data...');

// Organize products by category
const organizedProducts = {
  ponytails: [],
  clipins: [],
  accessories: [],
  wigs: [],
  haircare: []
};

scrapedData.products.forEach(product => {
  const category = product.product_type || '';
  const price = product.variants && product.variants[0] ? `$${product.variants[0].price} AUD` : 'Contact for price';
  const image = product.images && product.images[0] ? product.images[0].src : 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400&q=80';
  
  const productData = {
    id: product.id,
    name: product.title,
    price: price,
    image: image,
    description: (product.description || 'Premium quality hair extension from Bad Boujee Hair').replace(/<[^>]*>/g, '').substring(0, 150) + '...'
  };

  // Categorize products
  if (category.toLowerCase().includes('ponytail') || product.title.toLowerCase().includes('ponytail')) {
    organizedProducts.ponytails.push(productData);
  } else if (category.toLowerCase().includes('clip') || product.title.toLowerCase().includes('clip') || product.title.toLowerCase().includes('halo')) {
    organizedProducts.clipins.push(productData);
  } else if (category.toLowerCase().includes('wig')) {
    organizedProducts.wigs.push(productData);
  } else if (product.title.toLowerCase().includes('brush') || 
             product.title.toLowerCase().includes('spray') || 
             product.title.toLowerCase().includes('mask') || 
             product.title.toLowerCase().includes('stick') ||
             product.title.toLowerCase().includes('treatment')) {
    organizedProducts.haircare.push(productData);
  } else {
    organizedProducts.accessories.push(productData);
  }
});

console.log('📊 Products organized:');
console.log('  - Ponytails:', organizedProducts.ponytails.length);
console.log('  - Clip-ins:', organizedProducts.clipins.length);
console.log('  - Hair Care:', organizedProducts.haircare.length);
console.log('  - Accessories:', organizedProducts.accessories.length);
console.log('  - Wigs:', organizedProducts.wigs.length);

// Generate the updated page.tsx content
const pageContent = `'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import HeroSlider from '@/components/HeroSlider';
import ProductSection from '@/components/ProductSection';
import BookingSection from '@/components/BookingSection';
import TargetMarket from '@/components/TargetMarket';
import SocialFeed from '@/components/SocialFeed';
import ShoppingCart from '@/components/ShoppingCart';
import Footer from '@/components/Footer';
import FloatingNotification from '@/components/ui/FloatingNotification';
import { Toaster } from 'react-hot-toast';

export default function Home() {
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Show notification after 3 seconds
    const timer = setTimeout(() => {
      setShowNotification(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Real Bad Boujee Hair Products from Shopify API
  const ponytailProducts = ${JSON.stringify(organizedProducts.ponytails.slice(0, 4), null, 2)};

  const clipinProducts = ${JSON.stringify(organizedProducts.clipins.slice(0, 4), null, 2)};

  const haircareProducts = ${JSON.stringify(organizedProducts.haircare.slice(0, 4), null, 2)};

  const accessoryProducts = ${JSON.stringify(organizedProducts.accessories.slice(0, 4), null, 2)};

  return (
    <div className="min-h-screen">
      <Header />
      <ShoppingCart />
      <HeroSlider />
      <ProductSection title="Ponytails" products={ponytailProducts} id="ponytails" />
      <ProductSection title="Clip-In Extensions" products={clipinProducts} id="clipins" />
      <ProductSection title="Hair Care" products={haircareProducts} id="haircare" />
      <ProductSection title="Accessories" products={accessoryProducts} id="accessories" />
      <BookingSection />
      <TargetMarket />
      <SocialFeed />
      <Footer />
      
      {/* React Bits Floating Notification */}
      <FloatingNotification
        show={showNotification}
        onClose={() => setShowNotification(false)}
        type="purchase"
        customerName="Emma K."
        productName="${organizedProducts.ponytails[0]?.name || 'Bad Boujee Hair Extension'}"
        location="Melbourne"
        timeAgo="3 minutes ago"
      />
      
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid #f079a6'
          }
        }}
      />
    </div>
  );
}
`;

// Save the updated page.tsx
fs.writeFileSync('./src/app/page.tsx', pageContent);

console.log('✅ Updated src/app/page.tsx with real product data!');

// Create a product data file for easy access
const productDataFile = {
  ponytails: organizedProducts.ponytails,
  clipins: organizedProducts.clipins,
  haircare: organizedProducts.haircare,
  accessories: organizedProducts.accessories,
  wigs: organizedProducts.wigs,
  all: scrapedData.products.map(product => ({
    id: product.id,
    name: product.title,
    price: product.variants && product.variants[0] ? `$${product.variants[0].price} AUD` : 'Contact for price',
    image: product.images && product.images[0] ? product.images[0].src : 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400&q=80',
    description: (product.description || 'Premium quality hair extension from Bad Boujee Hair').replace(/<[^>]*>/g, '').substring(0, 200) + '...',
    category: product.product_type,
    variants: product.variants,
    handle: product.handle,
    vendor: product.vendor,
    tags: product.tags
  }))
};

fs.writeFileSync('./src/data/products.json', JSON.stringify(productDataFile, null, 2));

console.log('✅ Created src/data/products.json for easy product access');
console.log('🎉 Website updated with real Bad Boujee Hair content!');