const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function scrapeAllContent() {
  console.log('🔍 Starting comprehensive content scraping from Bad Boujee Hair...');
  
  const baseUrl = 'https://www.badboujeehair.com';
  const scrapedData = {
    site: {
      name: '',
      description: '',
      tagline: ''
    },
    products: [],
    categories: [],
    pages: [],
    images: [],
    content: {
      hero: [],
      testimonials: [],
      features: [],
      aboutUs: ''
    }
  };

  try {
    // 1. Scrape main homepage
    console.log('📄 Scraping homepage...');
    const homeResponse = await axios.get(baseUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(homeResponse.data);
    
    // Extract site info
    scrapedData.site.name = $('title').text().trim() || 'Bad Boujee Hair';
    scrapedData.site.description = $('meta[name="description"]').attr('content') || '';
    scrapedData.site.tagline = $('.hero-subtitle, .site-tagline').first().text().trim();
    
    // Extract hero content
    $('.hero, .banner, .slider').each((i, el) => {
      const title = $(el).find('h1, h2, .title').first().text().trim();
      const subtitle = $(el).find('p, .subtitle').first().text().trim();
      const image = $(el).find('img').first().attr('src');
      
      if (title) {
        scrapedData.content.hero.push({
          title,
          subtitle,
          image: image ? (image.startsWith('http') ? image : baseUrl + image) : null
        });
      }
    });
    
    // Extract all images
    $('img').each((i, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src');
      const alt = $(el).attr('alt') || '';
      
      if (src && !src.includes('data:image')) {
        const fullSrc = src.startsWith('http') ? src : baseUrl + src;
        scrapedData.images.push({
          src: fullSrc,
          alt,
          context: $(el).closest('.product, .hero, .banner').length > 0 ? 'product' : 'general'
        });
      }
    });

    // 2. Try WooCommerce API endpoints
    console.log('🛒 Checking WooCommerce API...');
    const wooEndpoints = [
      '/wp-json/wc/v3/products',
      '/wp-json/wp/v2/product', 
      '/api/products',
      '/wp-content/wc-api/v3/products'
    ];
    
    for (const endpoint of wooEndpoints) {
      try {
        const apiResponse = await axios.get(baseUrl + endpoint, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
          timeout: 5000
        });
        
        if (apiResponse.data && Array.isArray(apiResponse.data)) {
          console.log(`✅ Found WooCommerce API at ${endpoint}`);
          scrapedData.products = apiResponse.data.map(product => ({
            id: product.id,
            name: product.name,
            price: product.price || product.regular_price,
            description: product.description || product.short_description,
            image: product.images?.[0]?.src || product.featured_media,
            category: product.categories?.[0]?.name || 'Uncategorized',
            sku: product.sku,
            stock: product.stock_quantity
          }));
          break;
        }
      } catch (error) {
        // API endpoint not available, continue
      }
    }

    // 3. Scrape collection/category pages
    console.log('📋 Scraping collection pages...');
    const collectionUrls = [
      '/collections/all',
      '/collections/ponytails',
      '/collections/clip-ins',
      '/collections/clip-in-extensions',
      '/collections/accessories',
      '/collections/hair-care',
      '/products',
      '/shop'
    ];
    
    for (const collectionUrl of collectionUrls) {
      try {
        console.log(`  └─ Scraping ${collectionUrl}...`);
        const collectionResponse = await axios.get(baseUrl + collectionUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
          timeout: 10000
        });
        
        const $collection = cheerio.load(collectionResponse.data);
        
        // Extract products from collection page
        $collection('.product, .product-item, .grid-product, .product-card').each((i, el) => {
          const name = $collection(el).find('.product-title, .product-name, h3, h4').first().text().trim();
          const price = $collection(el).find('.price, .product-price, .money').first().text().trim();
          const description = $collection(el).find('.product-description, .product-summary, p').first().text().trim();
          const image = $collection(el).find('img').first().attr('src') || $collection(el).find('img').first().attr('data-src');
          const productUrl = $collection(el).find('a').first().attr('href');
          
          if (name && !scrapedData.products.find(p => p.name === name)) {
            scrapedData.products.push({
              name,
              price,
              description,
              image: image ? (image.startsWith('http') ? image : baseUrl + image) : null,
              url: productUrl ? (productUrl.startsWith('http') ? productUrl : baseUrl + productUrl) : null,
              category: collectionUrl.split('/').pop().replace('-', ' ')
            });
          }
        });
        
        // Extract category info
        const categoryTitle = $collection('h1, .collection-title, .page-title').first().text().trim();
        const categoryDescription = $collection('.collection-description, .category-description').first().text().trim();
        
        if (categoryTitle) {
          scrapedData.categories.push({
            name: categoryTitle,
            description: categoryDescription,
            url: collectionUrl
          });
        }
        
      } catch (error) {
        console.log(`    └─ ⚠️ Could not scrape ${collectionUrl}: ${error.message}`);
      }
    }

    // 4. Scrape individual product pages
    console.log('🎯 Scraping individual product pages...');
    const productUrls = scrapedData.products.map(p => p.url).filter(Boolean).slice(0, 10); // Limit to first 10
    
    for (const productUrl of productUrls) {
      try {
        const productResponse = await axios.get(productUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
          timeout: 10000
        });
        
        const $product = cheerio.load(productResponse.data);
        
        // Extract detailed product info
        const detailedDescription = $product('.product-description, .product-content, .product-details').text().trim();
        const features = [];
        $product('.product-features li, .features li, .specifications li').each((i, el) => {
          features.push($product(el).text().trim());
        });
        
        const productImages = [];
        $product('.product-gallery img, .product-images img').each((i, el) => {
          const src = $product(el).attr('src') || $product(el).attr('data-src');
          if (src) {
            productImages.push(src.startsWith('http') ? src : baseUrl + src);
          }
        });
        
        // Update product with detailed info
        const existingProduct = scrapedData.products.find(p => p.url === productUrl);
        if (existingProduct) {
          existingProduct.detailedDescription = detailedDescription;
          existingProduct.features = features;
          existingProduct.gallery = productImages;
        }
        
      } catch (error) {
        console.log(`    └─ ⚠️ Could not scrape product ${productUrl}: ${error.message}`);
      }
    }

    // 5. Scrape other important pages
    console.log('📖 Scraping other pages...');
    const otherPages = ['/about', '/about-us', '/contact', '/shipping', '/returns'];
    
    for (const pageUrl of otherPages) {
      try {
        const pageResponse = await axios.get(baseUrl + pageUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
          timeout: 5000
        });
        
        const $page = cheerio.load(pageResponse.data);
        const title = $page('h1, .page-title').first().text().trim();
        const content = $page('.page-content, .content, main').first().text().trim();
        
        if (title) {
          scrapedData.pages.push({
            title,
            content,
            url: pageUrl
          });
        }
        
      } catch (error) {
        // Page doesn't exist, continue
      }
    }

    // 6. Extract testimonials and reviews
    console.log('⭐ Extracting testimonials...');
    $('.testimonial, .review, .customer-review').each((i, el) => {
      const name = $(el).find('.name, .customer-name, .author').first().text().trim();
      const text = $(el).find('.text, .review-text, .testimonial-text, p').first().text().trim();
      const rating = $(el).find('.rating, .stars').length;
      
      if (name && text) {
        scrapedData.content.testimonials.push({
          name,
          text,
          rating: rating || 5
        });
      }
    });

    console.log('💾 Saving all scraped content...');
    
    // Save comprehensive data
    fs.writeFileSync('./scraped-content.json', JSON.stringify(scrapedData, null, 2));
    
    // Save images separately for backward compatibility
    const imageData = {
      total: scrapedData.images.length,
      categories: {
        products: scrapedData.images.filter(img => img.context === 'product').length,
        general: scrapedData.images.filter(img => img.context === 'general').length
      },
      images: scrapedData.images
    };
    fs.writeFileSync('./scraped-images.json', JSON.stringify(imageData, null, 2));
    
    console.log('✅ Content scraping completed!');
    console.log(`📊 Summary:`);
    console.log(`   - Products: ${scrapedData.products.length}`);
    console.log(`   - Categories: ${scrapedData.categories.length}`);
    console.log(`   - Images: ${scrapedData.images.length}`);
    console.log(`   - Pages: ${scrapedData.pages.length}`);
    console.log(`   - Testimonials: ${scrapedData.content.testimonials.length}`);
    
    return scrapedData;
    
  } catch (error) {
    console.error('❌ Error during content scraping:', error.message);
    return null;
  }
}

// Run the scraper
scrapeAllContent();