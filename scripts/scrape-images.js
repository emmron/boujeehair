const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function scrapeAllImages() {
  console.log('🔍 Starting comprehensive image scraping...');
  
  const allImages = [];
  
  try {
    // 1. Scrape main website
    console.log('📄 Scraping main website...');
    const websiteImages = await scrapeWebsiteImages();
    allImages.push(...websiteImages);
    
    // 2. Scrape product pages
    console.log('🛍️ Scraping product pages...');
    const productImages = await scrapeProductPages();
    allImages.push(...productImages);
    
    // 3. Attempt Instagram scraping
    console.log('📸 Attempting Instagram scraping...');
    const instagramImages = await scrapeInstagramImages();
    allImages.push(...instagramImages);
    
    // Remove duplicates
    const uniqueImages = removeDuplicates(allImages);
    
    console.log(`✅ Total found: ${uniqueImages.length} unique images`);
    
    // Categorize and save
    const categorized = categorizeAllImages(uniqueImages);
    
    // Save to file
    fs.writeFileSync('./scraped-images.json', JSON.stringify({
      total: uniqueImages.length,
      categories: {
        ponytails: categorized.ponytails.length,
        clipins: categorized.clipins.length,
        accessories: categorized.accessories.length,
        haircare: categorized.haircare.length,
        general: categorized.general.length,
        instagram: categorized.instagram.length
      },
      images: categorized
    }, null, 2));
    
    console.log('💾 All images saved to scraped-images.json');
    
    return categorized;
    
  } catch (error) {
    console.error('❌ Error in main scraping:', error.message);
    return [];
  }
}

async function scrapeWebsiteImages() {
  try {
    const response = await axios.get('https://www.badboujeehair.com', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const images = [];
    
    // Find all images
    $('img').each((i, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-original');
      const alt = $(el).attr('alt') || '';
      
      if (src && isValidImage(src)) {
        const fullSrc = normalizeUrl(src);
        images.push({
          src: fullSrc,
          alt: alt,
          source: 'website',
          category: categorizeImage(alt, src)
        });
      }
    });
    
    console.log(`  └─ Website: ${images.length} images`);
    return images;
    
  } catch (error) {
    console.error('❌ Error scraping website:', error.message);
    return [];
  }
}

async function scrapeProductPages() {
  const productPages = [
    '/collections/ponytails',
    '/collections/clip-ins',
    '/collections/accessories',
    '/collections/hair-care',
    '/collections/all'
  ];
  
  const allProductImages = [];
  
  for (const page of productPages) {
    try {
      await delay(1000); // Be respectful
      console.log(`  └─ Scraping ${page}...`);
      
      const response = await axios.get(`https://www.badboujeehair.com${page}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      const $ = cheerio.load(response.data);
      const pageImages = [];
      
      // Look for product images
      $('.product-item img, .product-card img, .grid-item img, .product-image img').each((i, el) => {
        const src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-original');
        const alt = $(el).attr('alt') || '';
        
        if (src && isValidImage(src)) {
          const fullSrc = normalizeUrl(src);
          
          // Try to get product name
          const productName = $(el).closest('.product-item, .product-card, .grid-item')
            .find('.product-title, .product-name, h3, h4, a[href*="/products/"]')
            .first()
            .text()
            .trim();
          
          pageImages.push({
            src: fullSrc,
            alt: alt,
            productName: productName || alt,
            source: 'product-page',
            category: categorizeImage(alt, src, page)
          });
        }
      });
      
      allProductImages.push(...pageImages);
      console.log(`    └─ ${pageImages.length} images from ${page}`);
      
    } catch (error) {
      console.log(`    └─ ⚠️ Could not scrape ${page}: ${error.message}`);
    }
  }
  
  return allProductImages;
}

async function scrapeInstagramImages() {
  try {
    // Try to find Instagram links on the website first
    const response = await axios.get('https://www.badboujeehair.com', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const instagramImages = [];
    
    // Look for Instagram embeds or feeds
    $('.instagram-feed img, .social-feed img, [class*="instagram"] img').each((i, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src');
      const alt = $(el).attr('alt') || '';
      
      if (src && isValidImage(src)) {
        const fullSrc = normalizeUrl(src);
        instagramImages.push({
          src: fullSrc,
          alt: alt,
          source: 'instagram',
          category: 'instagram'
        });
      }
    });
    
    // Also look for any CDN images that might be from Instagram
    $('img[src*="cdninstagram"], img[src*="fbcdn"], img[src*="instagram"]').each((i, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src');
      const alt = $(el).attr('alt') || '';
      
      if (src && isValidImage(src)) {
        const fullSrc = normalizeUrl(src);
        instagramImages.push({
          src: fullSrc,
          alt: alt,
          source: 'instagram',
          category: 'instagram'
        });
      }
    });
    
    console.log(`  └─ Instagram: ${instagramImages.length} images`);
    return instagramImages;
    
  } catch (error) {
    console.error('❌ Error scraping Instagram:', error.message);
    return [];
  }
}

function categorizeImage(alt, src, page = '') {
  const text = (alt + ' ' + src + ' ' + page).toLowerCase();
  
  if (text.includes('ponytail')) return 'ponytails';
  if (text.includes('clip') || text.includes('extension') || text.includes('halo')) return 'clipins';
  if (text.includes('bonnet') || text.includes('durag') || text.includes('brush') || text.includes('accessory')) return 'accessories';
  if (text.includes('wax') || text.includes('spray') || text.includes('mask') || text.includes('hair-care') || text.includes('serum')) return 'haircare';
  if (text.includes('instagram') || text.includes('social')) return 'instagram';
  
  return 'general';
}

function isValidImage(src) {
  if (!src) return false;
  
  // Must be an image file
  const isImage = /\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i.test(src);
  if (!isImage) return false;
  
  // Skip common non-product images
  const skipPatterns = [
    'logo', 'icon', 'avatar', 'facebook', 'twitter', 'payment', 
    'shipping', 'badge', 'banner', 'favicon', 'cart', 'search'
  ];
  
  const lowerSrc = src.toLowerCase();
  const isSkipped = skipPatterns.some(pattern => lowerSrc.includes(pattern));
  
  return !isSkipped && src.length > 10;
}

function normalizeUrl(src) {
  if (src.startsWith('http')) return src;
  if (src.startsWith('//')) return `https:${src}`;
  return `https://www.badboujeehair.com${src}`;
}

function removeDuplicates(images) {
  const seen = new Set();
  return images.filter(image => {
    const key = image.src;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function categorizeAllImages(images) {
  const categorized = {
    ponytails: [],
    clipins: [],
    accessories: [],
    haircare: [],
    instagram: [],
    general: []
  };
  
  images.forEach(image => {
    const category = image.category;
    if (categorized[category]) {
      categorized[category].push(image);
    } else {
      categorized.general.push(image);
    }
  });
  
  return categorized;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Run the comprehensive scraper
scrapeAllImages().then(() => {
  console.log('🎉 Scraping completed!');
}).catch(error => {
  console.error('💥 Scraping failed:', error);
});