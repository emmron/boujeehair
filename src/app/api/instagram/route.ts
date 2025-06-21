import { NextResponse } from 'next/server';
import { InstagramScraper } from '@/lib/socialScraper';

export async function GET() {
  try {
    const scraper = new InstagramScraper('bad.andboujeehair');
    const posts = await scraper.scrapePosts();

    return NextResponse.json({ 
      posts, 
      success: true,
      scraped: posts.length > 0,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Instagram API error:', error);
    
    // Return empty posts if scraper fails
    return NextResponse.json({ 
      posts: [], 
      success: false,
      error: 'Failed to scrape Instagram data',
      timestamp: new Date().toISOString()
    });
  }
}