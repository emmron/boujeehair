const fs = require('fs');

console.log('🔄 Updating website with fresh Python-scraped data...');

// Load the Python scraped data
const pythonData = JSON.parse(fs.readFileSync('./python_scraped_data.json', 'utf8'));

console.log('📊 Python scraping results:');
console.log(`   - Products: ${pythonData.products.length}`);
console.log(`   - Categories: ${pythonData.categories.length}`);
console.log(`   - Images: ${pythonData.images.length}`);
console.log(`   - Price range: $${pythonData.metadata.analysis.price_range.min} - $${pythonData.metadata.analysis.price_range.max}`);

// Organize products by type
const organizedProducts = {
  ponytails: [],
  clipins: [],
  accessories: [],
  wigs: [],
  haircare: []
};

// Enhanced product categorization
pythonData.products.forEach(product => {
  const title = product.title.toLowerCase();
  const productType = (product.product_type || '').toLowerCase();
  
  // Get the best price from variants
  let bestPrice = 'Contact for price';
  if (product.variants && product.variants.length > 0) {
    const prices = product.variants
      .map(v => parseFloat(v.price))
      .filter(p => p > 0);
    if (prices.length > 0) {
      const minPrice = Math.min(...prices);
      bestPrice = `$${minPrice.toFixed(2)} AUD`;
    }
  }
  
  // Get the best image
  let bestImage = 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400&q=80';
  if (product.images && product.images.length > 0) {
    bestImage = product.images[0].src;
  }
  
  // Clean and enhance description
  let description = product.description || 'Premium quality hair extension from Bad Boujee Hair.';
  if (description.length > 150) {
    description = description.substring(0, 147) + '...';
  }
  
  const enhancedProduct = {
    id: product.id,
    name: product.title,
    price: bestPrice,
    image: bestImage,
    description: description,
    handle: product.handle,
    vendor: product.vendor,
    product_type: product.product_type,
    tags: product.tags,
    variants: product.variants,
    created_at: product.created_at,
    available: product.available
  };
  
  // Smart categorization
  if (title.includes('ponytail') || productType.includes('ponytail')) {
    organizedProducts.ponytails.push(enhancedProduct);
  } else if (title.includes('clip') || title.includes('halo') || productType.includes('clip')) {
    organizedProducts.clipins.push(enhancedProduct);
  } else if (title.includes('wig') || productType.includes('wig')) {
    organizedProducts.wigs.push(enhancedProduct);
  } else if (title.includes('brush') || title.includes('spray') || title.includes('mask') || 
             title.includes('stick') || title.includes('oil') || title.includes('treatment') ||
             title.includes('serum') || title.includes('shampoo') || title.includes('conditioner')) {
    organizedProducts.haircare.push(enhancedProduct);
  } else {
    organizedProducts.accessories.push(enhancedProduct);
  }
});

console.log('📦 Products organized:');
Object.keys(organizedProducts).forEach(category => {
  console.log(`   - ${category}: ${organizedProducts[category].length} products`);
});

// Generate enhanced page.tsx with real data
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

  // Fresh Bad Boujee Hair Products from Python Scraper (${pythonData.metadata.scraped_at})
  const ponytailProducts = ${JSON.stringify(organizedProducts.ponytails.slice(0, 4), null, 2)};

  const clipinProducts = ${JSON.stringify(organizedProducts.clipins.slice(0, 4), null, 2)};

  const haircareProducts = ${JSON.stringify(organizedProducts.haircare.slice(0, 4), null, 2)};

  const accessoryProducts = ${JSON.stringify(organizedProducts.accessories.slice(0, 4), null, 2)};

  const wigProducts = ${JSON.stringify(organizedProducts.wigs.slice(0, 2), null, 2)};

  return (
    <div className="min-h-screen">
      <Header />
      <ShoppingCart />
      <HeroSlider />
      <ProductSection title="Ponytails" products={ponytailProducts} id="ponytails" />
      <ProductSection title="Clip-In Extensions" products={clipinProducts} id="clipins" />
      <ProductSection title="Hair Care" products={haircareProducts} id="haircare" />
      <ProductSection title="Accessories" products={accessoryProducts} id="accessories" />
      {wigProducts.length > 0 && (
        <ProductSection title="Wigs" products={wigProducts} id="wigs" />
      )}
      <BookingSection />
      <TargetMarket />
      <SocialFeed />
      <Footer />
      
      {/* React Bits Floating Notification */}
      <FloatingNotification
        show={showNotification}
        onClose={() => setShowNotification(false)}
        type="purchase"
        customerName="Sarah K."
        productName="${organizedProducts.ponytails[0]?.name || 'Bad Boujee Hair Extension'}"
        location="Sydney"
        timeAgo="2 minutes ago"
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

// Save updated page.tsx
fs.writeFileSync('./src/app/page.tsx', pageContent);

// Create comprehensive product database
const productDatabase = {
  ...organizedProducts,
  all: pythonData.products.map(product => {
    const prices = product.variants?.map(v => parseFloat(v.price)).filter(p => p > 0) || [];
    const bestPrice = prices.length > 0 ? `$${Math.min(...prices).toFixed(2)} AUD` : 'Contact for price';
    const bestImage = product.images?.[0]?.src || 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400&q=80';
    
    return {
      id: product.id,
      name: product.title,
      price: bestPrice,
      image: bestImage,
      description: (product.description || 'Premium quality hair extension from Bad Boujee Hair.').substring(0, 200) + '...',
      handle: product.handle,
      vendor: product.vendor,
      product_type: product.product_type,
      tags: product.tags,
      variants: product.variants,
      available: product.available,
      created_at: product.created_at,
      updated_at: product.updated_at
    };
  }),
  metadata: {
    last_updated: pythonData.metadata.scraped_at,
    total_products: pythonData.products.length,
    total_categories: pythonData.categories.length,
    total_images: pythonData.images.length,
    price_analysis: pythonData.metadata.analysis.price_range,
    product_type_distribution: pythonData.metadata.analysis.product_type_distribution,
    scraping_method: 'python_comprehensive'
  }
};

// Save enhanced product database
fs.writeFileSync('./src/data/products.json', JSON.stringify(productDatabase, null, 2));

// Create product details for individual pages
const productDetails = {};
pythonData.products.forEach(product => {
  if (product.handle) {
    productDetails[product.handle] = {
      ...product,
      enhanced_description: product.description || 'Premium quality hair extension from Bad Boujee Hair. Our products are designed for busy women who want to look fabulous without spending hours on their hair.',
      features: [
        'Premium quality materials',
        'Easy to apply and style',
        'Heat resistant up to 180°C',
        'Natural looking finish',
        'Long-lasting durability'
      ],
      care_instructions: [
        'Brush gently with wide-tooth comb',
        'Wash with sulfate-free shampoo',
        'Air dry when possible',
        'Store properly when not in use',
        'Avoid excessive heat styling'
      ],
      shipping_info: {
        free_shipping_over: 100,
        estimated_delivery: '2-3 business days',
        express_available: true
      }
    };
  }
});

fs.writeFileSync('./src/data/product-details.json', JSON.stringify(productDetails, null, 2));

// Create categories data
const categoriesData = {
  categories: pythonData.categories.map(cat => ({
    id: cat.id,
    title: cat.title,
    handle: cat.handle,
    description: cat.description,
    products_count: cat.products_count,
    published_at: cat.published_at
  })),
  organized_products: organizedProducts,
  metadata: {
    last_updated: pythonData.metadata.scraped_at,
    total_categories: pythonData.categories.length
  }
};

fs.writeFileSync('./src/data/categories.json', JSON.stringify(categoriesData, null, 2));

// Create images database
const imagesData = {
  images: pythonData.images.map(img => ({
    src: img.src,
    alt: img.alt,
    context: img.context,
    product_id: img.product_id,
    product_title: img.product_title
  })),
  by_context: {
    product: pythonData.images.filter(img => img.context === 'product'),
    homepage: pythonData.images.filter(img => img.context === 'homepage')
  },
  metadata: {
    total_images: pythonData.images.length,
    last_updated: pythonData.metadata.scraped_at
  }
};

fs.writeFileSync('./src/data/images.json', JSON.stringify(imagesData, null, 2));

// Create site metadata
const siteData = {
  site_info: pythonData.site_info,
  metadata: pythonData.metadata,
  last_scrape: pythonData.metadata.scraped_at,
  data_sources: ['shopify_api', 'homepage_html', 'python_scraper']
};

fs.writeFileSync('./src/data/site-info.json', JSON.stringify(siteData, null, 2));

console.log('✅ Successfully updated website with Python-scraped data!');
console.log('📁 Created data files:');
console.log('   - src/data/products.json (comprehensive product database)');
console.log('   - src/data/product-details.json (detailed product info)');
console.log('   - src/data/categories.json (category organization)');
console.log('   - src/data/images.json (image database)');
console.log('   - src/data/site-info.json (site metadata)');
console.log('   - src/app/page.tsx (updated homepage)');

console.log(`🎉 Website now features ${pythonData.products.length} real products from Bad Boujee Hair!`);