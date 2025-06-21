const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function scrapeReactBits() {
  console.log('🔍 Scraping React Bits components...');
  
  try {
    const response = await axios.get('https://reactbits.dev', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const components = [];
    
    // Look for component cards or links
    $('a[href*="/components/"], .component-card, .grid a').each((i, el) => {
      const href = $(el).attr('href');
      const title = $(el).find('h3, h4, .title').text().trim() || $(el).text().trim();
      
      if (href && title) {
        components.push({
          name: title,
          url: href.startsWith('http') ? href : `https://reactbits.dev${href}`,
          category: categorizeComponent(title, href)
        });
      }
    });
    
    console.log(`✅ Found ${components.length} React Bits components`);
    
    // Save component list
    fs.writeFileSync('./react-bits-components.json', JSON.stringify({
      total: components.length,
      components: components,
      categories: categorizeComponents(components)
    }, null, 2));
    
    console.log('💾 React Bits components saved');
    
    return components;
    
  } catch (error) {
    console.error('❌ Error scraping React Bits:', error.message);
    return [];
  }
}

function categorizeComponent(title, href) {
  const text = (title + ' ' + href).toLowerCase();
  
  if (text.includes('button') || text.includes('cta')) return 'buttons';
  if (text.includes('card') || text.includes('product')) return 'cards';
  if (text.includes('form') || text.includes('input')) return 'forms';
  if (text.includes('nav') || text.includes('header')) return 'navigation';
  if (text.includes('modal') || text.includes('dialog')) return 'overlays';
  if (text.includes('slider') || text.includes('carousel')) return 'media';
  if (text.includes('loading') || text.includes('spinner')) return 'feedback';
  if (text.includes('toast') || text.includes('notification')) return 'notifications';
  
  return 'general';
}

function categorizeComponents(components) {
  const categories = {};
  
  components.forEach(comp => {
    const cat = comp.category;
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(comp);
  });
  
  return categories;
}

// Run the scraper
scrapeReactBits();