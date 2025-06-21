import { NextResponse } from 'next/server';
import { BadBoujeeImageScraper } from '@/lib/imageScraper';

export async function GET() {
  try {
    console.log('🚀 Starting image scraping process...');
    
    const scraper = new BadBoujeeImageScraper();
    const images = await scraper.scrapeAllImages();
    
    if (images.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'No images found',
        images: []
      });
    }
    
    // Categorize images for easy use
    const categorizedImages = scraper.formatForProducts(images);
    
    console.log('✅ Image scraping completed successfully');
    console.log('📊 Results:', {
      total: images.length,
      ponytails: categorizedImages.ponytails.length,
      clipins: categorizedImages.clipins.length,
      accessories: categorizedImages.accessories.length,
      haircare: categorizedImages.haircare.length
    });
    
    return NextResponse.json({
      success: true,
      message: `Successfully scraped ${images.length} images`,
      totalImages: images.length,
      categorizedImages,
      allImages: images
    });
    
  } catch (error) {
    console.error('❌ Error in image scraping API:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to scrape images',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST() {
  // Alternative endpoint that can accept parameters
  return GET();
}