import axios from 'axios';
import * as cheerio from 'cheerio';

interface ScrapedImage {
  src: string;
  alt: string;
  productName?: string;
  category?: string;
}

export class BadBoujeeImageScraper {
  private baseUrl = 'https://www.badboujeehair.com';
  
  async scrapeAllImages(): Promise<ScrapedImage[]> {
    try {
      console.log('🔍 Starting Bad Boujee Hair image scraping...');
      
      // First, get the main page to find all product links
      const mainPageResponse = await axios.get(this.baseUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      const $ = cheerio.load(mainPageResponse.data);
      const images: ScrapedImage[] = [];
      
      // Scrape images from main page
      $('img').each((index, element) => {
        const src = $(element).attr('src') || $(element).attr('data-src');
        const alt = $(element).attr('alt') || '';
        
        if (src && this.isValidImageUrl(src)) {
          const fullSrc = src.startsWith('http') ? src : `${this.baseUrl}${src}`;
          images.push({
            src: fullSrc,
            alt: alt,
            category: this.categorizeImage(alt, fullSrc)
          });
        }
      });
      
      // Try to scrape specific product pages
      const productPages = [
        '/collections/ponytails',
        '/collections/clip-ins',
        '/collections/accessories',
        '/collections/hair-care'
      ];
      
      for (const page of productPages) {
        try {
          await this.delay(1000); // Be respectful with requests
          const pageImages = await this.scrapePageImages(`${this.baseUrl}${page}`);
          images.push(...pageImages);
        } catch (error) {
          console.log(`⚠️ Could not scrape ${page}:`, error);
        }
      }
      
      // Remove duplicates
      const uniqueImages = this.removeDuplicates(images);
      
      console.log(`✅ Scraped ${uniqueImages.length} unique images from Bad Boujee Hair`);
      return uniqueImages;
      
    } catch (error) {
      console.error('❌ Error scraping Bad Boujee Hair images:', error);
      return [];
    }
  }
  
  private async scrapePageImages(url: string): Promise<ScrapedImage[]> {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      const $ = cheerio.load(response.data);
      const images: ScrapedImage[] = [];
      
      // Look for product images specifically
      $('.product-item img, .product-card img, .product-image img, .grid-product__image img').each((index, element) => {
        const src = $(element).attr('src') || $(element).attr('data-src');
        const alt = $(element).attr('alt') || '';
        
        if (src && this.isValidImageUrl(src)) {
          const fullSrc = src.startsWith('http') ? src : `${this.baseUrl}${src}`;
          
          // Try to get product name from nearby elements
          const productName = $(element).closest('.product-item, .product-card')
            .find('.product-title, .product-name, h3, h4')
            .first()
            .text()
            .trim();
          
          images.push({
            src: fullSrc,
            alt: alt,
            productName: productName || alt,
            category: this.categorizeImage(alt, fullSrc, url)
          });
        }
      });
      
      // Also look for any other images on the page
      $('img').each((index, element) => {
        const src = $(element).attr('src') || $(element).attr('data-src');
        const alt = $(element).attr('alt') || '';
        
        if (src && this.isValidImageUrl(src) && !images.some(img => img.src === src)) {
          const fullSrc = src.startsWith('http') ? src : `${this.baseUrl}${src}`;
          images.push({
            src: fullSrc,
            alt: alt,
            category: this.categorizeImage(alt, fullSrc, url)
          });
        }
      });
      
      return images;
      
    } catch (error) {
      console.error(`Error scraping page ${url}:`, error);
      return [];
    }
  }
  
  private isValidImageUrl(src: string): boolean {
    if (!src) return false;
    
    // Skip common non-product images
    const skipPatterns = [
      'logo',
      'icon',
      'avatar',
      'facebook',
      'instagram',
      'twitter',
      'payment',
      'shipping',
      'badge',
      'banner'
    ];
    
    const lowerSrc = src.toLowerCase();
    const isSkipped = skipPatterns.some(pattern => lowerSrc.includes(pattern));
    
    // Must be an image file
    const isImage = /\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i.test(src);
    
    return isImage && !isSkipped && src.length > 10;
  }
  
  private categorizeImage(alt: string, src: string, pageUrl?: string): string {
    const lowerAlt = alt.toLowerCase();
    const lowerSrc = src.toLowerCase();
    const lowerPage = pageUrl?.toLowerCase() || '';
    
    if (lowerPage.includes('ponytail') || lowerAlt.includes('ponytail') || lowerSrc.includes('ponytail')) {
      return 'ponytails';
    }
    
    if (lowerPage.includes('clip') || lowerAlt.includes('clip') || lowerSrc.includes('clip') || 
        lowerAlt.includes('extension') || lowerSrc.includes('extension')) {
      return 'clip-ins';
    }
    
    if (lowerPage.includes('accessory') || lowerAlt.includes('bonnet') || lowerAlt.includes('durag') || 
        lowerAlt.includes('brush') || lowerSrc.includes('accessory')) {
      return 'accessories';
    }
    
    if (lowerPage.includes('hair-care') || lowerAlt.includes('spray') || lowerAlt.includes('wax') || 
        lowerAlt.includes('mask') || lowerSrc.includes('care')) {
      return 'hair-care';
    }
    
    return 'general';
  }
  
  private removeDuplicates(images: ScrapedImage[]): ScrapedImage[] {
    const seen = new Set();
    return images.filter(image => {
      const key = image.src;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }
  
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  // Get images by category
  getImagesByCategory(images: ScrapedImage[], category: string): ScrapedImage[] {
    return images.filter(img => img.category === category);
  }
  
  // Format images for our product data structure
  formatForProducts(images: ScrapedImage[]): any {
    const categorized = {
      ponytails: this.getImagesByCategory(images, 'ponytails'),
      clipins: this.getImagesByCategory(images, 'clip-ins'),
      accessories: this.getImagesByCategory(images, 'accessories'),
      haircare: this.getImagesByCategory(images, 'hair-care')
    };
    
    return categorized;
  }
}