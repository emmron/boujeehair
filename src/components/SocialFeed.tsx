'use client';

import { useState, useEffect } from 'react';
import { Instagram, Facebook, Heart, MessageCircle, Share, RefreshCw } from 'lucide-react';
import axios from 'axios';

interface SocialPost {
  id: string;
  platform: 'instagram' | 'facebook';
  image: string;
  caption: string;
  likes: number;
  comments: number;
  date: string;
  url: string;
}

const SocialFeed = () => {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Fetch social media data from our APIs
  const fetchSocialData = async () => {
    try {
      setRefreshing(true);
      
      // Fetch Instagram and Facebook data in parallel
      const [instagramResponse, facebookResponse] = await Promise.all([
        axios.get('/api/instagram'),
        axios.get('/api/facebook')
      ]);

      const instagramPosts = instagramResponse.data.posts || [];
      const facebookPosts = facebookResponse.data.posts || [];

      // Combine and sort posts by date (newest first)
      const allPosts = [...instagramPosts, ...facebookPosts].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setPosts(allPosts.slice(0, 12)); // Limit to 12 posts
      setLastUpdate(new Date());
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error('Failed to fetch social data:', error);
      setLoading(false);
      setRefreshing(false);
      
      // Fallback to enhanced mock data if API fails
      const fallbackPosts: SocialPost[] = [
        {
          id: 'fallback-1',
          platform: 'instagram',
          image: 'https://www.badboujeehair.com/cdn/shop/files/EFA8FA51-73E7-45DB-A056-DF8D41C18B7A.jpg',
          caption: '✨ Because Quality & INCHES MATTER! ✨ Our 20" Boujee Curl Ponytail is perfect for busy mamas who want to look fabulous! 💕 #BadAndBoujeeHair #PonytailPerfection #BusyMama',
          likes: 127,
          comments: 23,
          date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          url: 'https://www.instagram.com/bad.andboujeehair/'
        },
        {
          id: 'fallback-2',
          platform: 'facebook',
          image: 'https://www.badboujeehair.com/cdn/shop/files/48BBBFA5-BB94-4A4E-A833-EC1A09D3B1F8.jpg',
          caption: '🎉 FLASH SALE! 20% off all ponytails this weekend! Use code BOUJEE20 at checkout. Because every mama deserves to feel fabulous! 💕',
          likes: 89,
          comments: 12,
          date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          url: 'https://m.facebook.com/100070077697400'
        },
        {
          id: 'fallback-3',
          platform: 'instagram',
          image: 'https://www.badboujeehair.com/cdn/shop/files/0F6953AA-E02C-45B5-B59B-6FB7540D3827.jpg',
          caption: '🌊 I\'m So Wavy Ponytail giving you those effortless beach vibes! Perfect for those low-maintenance but high-impact days 🌺 #WavyHair #BeachVibes #QualityHair',
          likes: 89,
          comments: 15,
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          url: 'https://www.instagram.com/bad.andboujeehair/'
        }
      ];
      setPosts(fallbackPosts);
    }
  };

  useEffect(() => {
    fetchSocialData();
    
    // Auto-refresh every 10 minutes
    const interval = setInterval(() => {
      fetchSocialData();
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Follow Our Journey
            </h2>
            <div className="w-24 h-1 bg-accent-pink mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-[#121212] rounded-lg p-4 animate-pulse">
                <div className="h-64 bg-gray-700 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Follow Our Journey
          </h2>
          <div className="w-24 h-1 bg-accent-pink mx-auto mb-6"></div>
          <p className="text-gray-300 mb-8">
            Stay updated with our latest styles, customer transformations, and hair tips!
          </p>
          <div className="flex justify-center space-x-4 mb-4">
            <a
              href="https://www.instagram.com/bad.andboujeehair/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
            >
              <Instagram className="h-5 w-5" />
              <span>@bad.andboujeehair</span>
            </a>
            <a
              href="https://m.facebook.com/100070077697400"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-all duration-200"
            >
              <Facebook className="h-5 w-5" />
              <span>Follow on Facebook</span>
            </a>
          </div>
          
          <div className="flex justify-center items-center space-x-4 text-sm text-gray-400">
            <button
              onClick={fetchSocialData}
              disabled={refreshing}
              className="flex items-center space-x-2 hover:text-white transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh Feed'}</span>
            </button>
            {lastUpdate && (
              <span>
                Last updated: {lastUpdate.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-[#121212] rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-300 shadow-lg">
              <div className="relative">
                <img
                  src={post.image}
                  alt="Social media post"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-3 right-3">
                  {post.platform === 'instagram' ? (
                    <Instagram className="h-6 w-6 text-white bg-gradient-to-br from-purple-500 to-pink-500 rounded p-1" />
                  ) : (
                    <Facebook className="h-6 w-6 text-white bg-blue-600 rounded p-1" />
                  )}
                </div>
              </div>
              
              <div className="p-4">
                <p className="text-gray-300 text-sm mb-3 line-clamp-3">
                  {post.caption}
                </p>
                
                <div className="flex items-center justify-between text-gray-400 text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Heart className="h-4 w-4" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{post.comments}</span>
                    </div>
                  </div>
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-accent-pink hover:text-pink-400 transition-colors"
                  >
                    <Share className="h-4 w-4" />
                    <span>View</span>
                  </a>
                </div>
                
                <div className="mt-3 text-xs text-gray-500">
                  {new Date(post.date).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialFeed;