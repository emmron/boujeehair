import { NextResponse } from 'next/server';
import { FacebookScraper } from '@/lib/socialScraper';

export async function GET() {
  try {
    const scraper = new FacebookScraper('100070077697400');
    const posts = await scraper.scrapePosts();

    return NextResponse.json({ 
      posts, 
      success: true,
      scraped: posts.length > 0,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Facebook API error:', error);
    
    return NextResponse.json({ 
      posts: [], 
      success: false, 
      error: 'Failed to fetch Facebook posts',
      timestamp: new Date().toISOString()
    });
  }
}