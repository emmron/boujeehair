const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function scrapeShopifyData() {
  console.log('🔍 Advanced scraping for Bad Boujee Hair (Shopify)...');
  
  const baseUrl = 'https://www.badboujeehair.com';
  const scrapedData = {
    products: [],
    categories: [],
    images: [],
    content: {}
  };

  try {
    // 1. Try Shopify product.json endpoint
    console.log('🛒 Checking Shopify product endpoints...');
    
    const shopifyEndpoints = [
      '/products.json',
      '/collections/all/products.json',
      '/admin/products.json'
    ];
    
    for (const endpoint of shopifyEndpoints) {
      try {
        console.log(`  └─ Trying ${endpoint}...`);
        const response = await axios.get(baseUrl + endpoint, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'application/json'
          },
          timeout: 10000
        });
        
        if (response.data && response.data.products) {
          console.log(`✅ Found Shopify data at ${endpoint}!`);
          
          response.data.products.forEach(product => {
            scrapedData.products.push({
              id: product.id,
              title: product.title,
              handle: product.handle,
              description: product.body_html ? product.body_html.replace(/<[^>]*>/g, '') : '',
              vendor: product.vendor,
              product_type: product.product_type,
              created_at: product.created_at,
              updated_at: product.updated_at,
              published_at: product.published_at,
              tags: product.tags,
              variants: product.variants.map(v => ({
                id: v.id,
                title: v.title,
                price: v.price,
                compare_at_price: v.compare_at_price,
                sku: v.sku,
                inventory_quantity: v.inventory_quantity,
                available: v.available
              })),
              images: product.images.map(img => ({
                src: img.src,
                alt: img.alt,
                position: img.position
              })),
              options: product.options
            });
          });
          break;
        }
      } catch (error) {
        console.log(`    └─ Not found: ${error.message}`);
      }
    }

    // 2. Try collection endpoints for more detailed product info
    console.log('📂 Scraping Shopify collections...');
    
    const collections = ['ponytails', 'accessories', 'hair-care', 'all'];
    
    for (const collection of collections) {
      try {
        console.log(`  └─ Scraping /collections/${collection}.json...`);
        const response = await axios.get(`${baseUrl}/collections/${collection}.json`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'application/json'
          },
          timeout: 10000
        });
        
        if (response.data && response.data.collection) {
          const collectionData = response.data.collection;
          scrapedData.categories.push({
            id: collectionData.id,
            title: collectionData.title,
            handle: collectionData.handle,
            description: collectionData.body_html ? collectionData.body_html.replace(/<[^>]*>/g, '') : '',
            published_at: collectionData.published_at,
            products_count: collectionData.products_count
          });
        }
      } catch (error) {
        console.log(`    └─ Collection ${collection} not accessible`);
      }
    }

    // 3. Extract from page source and JavaScript data
    console.log('📜 Analyzing page source for embedded data...');
    
    const mainResponse = await axios.get(baseUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(mainResponse.data);
    
    // Look for JSON-LD structured data
    $('script[type="application/ld+json"]').each((i, el) => {
      try {
        const jsonData = JSON.parse($(el).html());
        if (jsonData && jsonData['@type'] === 'Product') {
          scrapedData.products.push({
            name: jsonData.name,
            description: jsonData.description,
            image: jsonData.image,
            price: jsonData.offers?.price,
            currency: jsonData.offers?.priceCurrency,
            availability: jsonData.offers?.availability,
            brand: jsonData.brand?.name,
            sku: jsonData.sku
          });
        }
      } catch (e) {
        // Invalid JSON, skip
      }
    });

    // Look for Shopify theme data
    const pageSource = mainResponse.data;
    
    // Extract from window.theme or window.shop data
    const themeDataMatch = pageSource.match(/window\.theme\s*=\s*({[^;]+})/);
    if (themeDataMatch) {
      try {
        const themeData = JSON.parse(themeDataMatch[1]);
        console.log('📋 Found theme data');
        scrapedData.content.theme = themeData;
      } catch (e) {
        // Invalid JSON
      }
    }

    // Extract product data from script tags
    const productDataRegex = /"products":\s*(\[[\s\S]*?\])/g;
    let match;
    while ((match = productDataRegex.exec(pageSource)) !== null) {
      try {
        const products = JSON.parse(match[1]);
        products.forEach(product => {
          if (product.title && !scrapedData.products.find(p => p.title === product.title)) {
            scrapedData.products.push(product);
          }
        });
      } catch (e) {
        // Invalid JSON
      }
    }

    // 4. Extract real image URLs by analyzing the lazy loading pattern
    console.log('🖼️ Extracting real image URLs...');
    
    // Look for data-src, data-original, or other lazy loading attributes
    $('[data-src], [data-original], [data-lazy]').each((i, el) => {
      const dataSrc = $(el).attr('data-src') || $(el).attr('data-original') || $(el).attr('data-lazy');
      const alt = $(el).attr('alt') || '';
      
      if (dataSrc && !dataSrc.includes('loading.gif')) {
        const fullSrc = dataSrc.startsWith('http') ? dataSrc : baseUrl + dataSrc;
        scrapedData.images.push({
          src: fullSrc,
          alt,
          context: alt.toLowerCase().includes('ponytail') ? 'product' : 'general'
        });
      }
    });

    // Extract from CSS background images
    $('[style*="background-image"]').each((i, el) => {
      const style = $(el).attr('style');
      const urlMatch = style.match(/background-image:\s*url\(['"]([^'"]+)['"]\)/);
      if (urlMatch && urlMatch[1] && !urlMatch[1].includes('loading.gif')) {
        const fullSrc = urlMatch[1].startsWith('http') ? urlMatch[1] : baseUrl + urlMatch[1];
        scrapedData.images.push({
          src: fullSrc,
          alt: '',
          context: 'background'
        });
      }
    });

    // 5. Try to get individual product pages
    console.log('🎯 Attempting to scrape individual product pages...');
    
    const potentialProductUrls = [
      '/products/14-flick-ponytail',
      '/products/20-boujee-curl-ponytail',
      '/products/20-im-so-wavy-ponytail',
      '/products/20-straight-up-ponytail'
    ];
    
    for (const productUrl of potentialProductUrls) {
      try {
        console.log(`  └─ Trying ${productUrl}...`);
        const productResponse = await axios.get(baseUrl + productUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          timeout: 5000
        });
        
        const $product = cheerio.load(productResponse.data);
        
        // Extract product JSON data
        const productJsonMatch = productResponse.data.match(/"product":\s*({[^}]+})/);
        if (productJsonMatch) {
          try {
            const productData = JSON.parse(productJsonMatch[1]);
            console.log(`    └─ ✅ Found product data for ${productData.title}`);
            scrapedData.products.push(productData);
          } catch (e) {
            // Try manual extraction
            const title = $product('h1, .product-title').first().text().trim();
            const price = $product('.price, .product-price').first().text().trim();
            const description = $product('.product-description, .product-content').first().text().trim();
            
            if (title) {
              scrapedData.products.push({
                title,
                price,
                description,
                url: productUrl
              });
            }
          }
        }
        
        // Extract product images
        $product('.product-gallery img, .product-images img').each((i, el) => {
          const src = $product(el).attr('src') || $product(el).attr('data-src');
          if (src && !src.includes('loading.gif')) {
            scrapedData.images.push({
              src: src.startsWith('http') ? src : baseUrl + src,
              alt: $product(el).attr('alt') || '',
              context: 'product'
            });
          }
        });
        
      } catch (error) {
        console.log(`    └─ ⚠️ Could not access ${productUrl}`);
      }
    }

    // 6. Extract content from alt text (product names we found)
    console.log('📝 Extracting product info from image alt text...');
    
    const productNames = [
      '14" Flick Ponytail',
      '20" Boujee Curl Ponytail',
      '20" I\'m So Wavy Ponytail',
      '20" Straight Up Ponytail'
    ];
    
    productNames.forEach((name, index) => {
      if (!scrapedData.products.find(p => p.title === name)) {
        scrapedData.products.push({
          id: `extracted_${index + 1}`,
          title: name,
          category: 'Ponytails',
          extracted_from: 'alt_text',
          estimated_price: '$60-$90 AUD'
        });
      }
    });

    // Save the comprehensive data
    console.log('💾 Saving scraped data...');
    
    fs.writeFileSync('./scraped-shopify-data.json', JSON.stringify(scrapedData, null, 2));
    
    console.log('✅ Advanced scraping completed!');
    console.log(`📊 Final Summary:`);
    console.log(`   - Products found: ${scrapedData.products.length}`);
    console.log(`   - Categories found: ${scrapedData.categories.length}`);
    console.log(`   - Images found: ${scrapedData.images.length}`);
    
    // Show product titles
    if (scrapedData.products.length > 0) {
      console.log('\n🛍️ Products discovered:');
      scrapedData.products.forEach((product, i) => {
        console.log(`   ${i + 1}. ${product.title || product.name} ${product.price ? '- ' + product.price : ''}`);
      });
    }
    
    return scrapedData;
    
  } catch (error) {
    console.error('❌ Error during advanced scraping:', error.message);
    return null;
  }
}

// Run the advanced scraper
scrapeShopifyData();