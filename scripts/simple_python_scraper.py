#!/usr/bin/env python3
"""
Simple Python scraper for Bad Boujee Hair website using only standard libraries
"""

import urllib.request
import urllib.parse
import json
import re
import time
from datetime import datetime
import html

class SimpleBadBoujeeHairScraper:
    def __init__(self):
        self.base_url = "https://www.badboujeehair.com"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        self.data = {
            'site_info': {},
            'products': [],
            'categories': [],
            'images': [],
            'metadata': {
                'scraped_at': datetime.now().isoformat(),
                'scraping_method': 'simple_python'
            }
        }
    
    def make_request(self, url):
        """Make HTTP request with proper headers"""
        try:
            req = urllib.request.Request(url, headers=self.headers)
            with urllib.request.urlopen(req, timeout=10) as response:
                return response.read().decode('utf-8')
        except Exception as e:
            print(f"❌ Error fetching {url}: {e}")
            return None
    
    def scrape_shopify_api(self):
        """Scrape Shopify API endpoints"""
        print("🛒 Scraping Shopify API endpoints...")
        
        endpoints = [
            '/products.json',
            '/collections.json'
        ]
        
        for endpoint in endpoints:
            url = self.base_url + endpoint
            print(f"  └─ Trying {endpoint}...")
            
            try:
                response_text = self.make_request(url)
                if response_text:
                    data = json.loads(response_text)
                    
                    if 'products' in data:
                        print(f"    ✅ Found {len(data['products'])} products")
                        for product in data['products']:
                            self.process_product(product)
                    
                    if 'collections' in data:
                        print(f"    ✅ Found {len(data['collections'])} collections")
                        for collection in data['collections']:
                            self.process_collection(collection)
                            
            except json.JSONDecodeError as e:
                print(f"    ❌ JSON decode error for {endpoint}: {e}")
            except Exception as e:
                print(f"    ❌ Error with {endpoint}: {e}")
    
    def process_product(self, product):
        """Process product data"""
        # Clean HTML from description
        description = product.get('description', '')
        description = re.sub(r'<[^>]+>', '', description)  # Remove HTML tags
        description = html.unescape(description)  # Decode HTML entities
        
        processed_product = {
            'id': product.get('id'),
            'title': product.get('title'),
            'handle': product.get('handle'),
            'description': description.strip(),
            'vendor': product.get('vendor'),
            'product_type': product.get('product_type'),
            'created_at': product.get('created_at'),
            'updated_at': product.get('updated_at'),
            'published_at': product.get('published_at'),
            'tags': product.get('tags', []),
            'available': product.get('available'),
            'variants': [],
            'images': [],
            'options': product.get('options', [])
        }
        
        # Process variants
        if 'variants' in product:
            for variant in product['variants']:
                variant_data = {
                    'id': variant.get('id'),
                    'title': variant.get('title'),
                    'price': variant.get('price'),
                    'compare_at_price': variant.get('compare_at_price'),
                    'sku': variant.get('sku'),
                    'inventory_quantity': variant.get('inventory_quantity'),
                    'available': variant.get('available')
                }
                processed_product['variants'].append(variant_data)
        
        # Process images
        if 'images' in product:
            for image in product['images']:
                image_data = {
                    'src': image.get('src'),
                    'alt': image.get('alt', ''),
                    'position': image.get('position')
                }
                processed_product['images'].append(image_data)
                
                # Add to global images
                self.data['images'].append({
                    'src': image_data['src'],
                    'alt': image_data['alt'],
                    'context': 'product',
                    'product_id': product.get('id'),
                    'product_title': product.get('title')
                })
        
        self.data['products'].append(processed_product)
    
    def process_collection(self, collection):
        """Process collection data"""
        description = collection.get('description', '')
        description = re.sub(r'<[^>]+>', '', description)
        description = html.unescape(description)
        
        processed_collection = {
            'id': collection.get('id'),
            'title': collection.get('title'),
            'handle': collection.get('handle'),
            'description': description.strip(),
            'published_at': collection.get('published_at'),
            'updated_at': collection.get('updated_at'),
            'products_count': collection.get('products_count', 0)
        }
        
        self.data['categories'].append(processed_collection)
    
    def scrape_homepage(self):
        """Scrape homepage HTML content"""
        print("🏠 Scraping homepage content...")
        
        response_text = self.make_request(self.base_url)
        if not response_text:
            return
        
        # Extract title
        title_match = re.search(r'<title[^>]*>(.*?)</title>', response_text, re.IGNORECASE | re.DOTALL)
        if title_match:
            self.data['site_info']['title'] = html.unescape(title_match.group(1).strip())
        
        # Extract meta description
        desc_match = re.search(r'<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"\']*)["\']', response_text, re.IGNORECASE)
        if desc_match:
            self.data['site_info']['description'] = html.unescape(desc_match.group(1))
        
        # Extract images from HTML
        img_pattern = r'<img[^>]*src=["\']([^"\']*)["\'][^>]*alt=["\']([^"\']*)["\']'
        img_matches = re.findall(img_pattern, response_text, re.IGNORECASE)
        
        for src, alt in img_matches:
            if not src.startswith('data:') and 'loading.gif' not in src:
                # Make URL absolute
                if src.startswith('//'):
                    src = 'https:' + src
                elif src.startswith('/'):
                    src = self.base_url + src
                elif not src.startswith('http'):
                    src = self.base_url + '/' + src
                
                self.data['images'].append({
                    'src': src,
                    'alt': html.unescape(alt),
                    'context': 'homepage'
                })
        
        # Extract structured data
        json_ld_pattern = r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>'
        json_ld_matches = re.findall(json_ld_pattern, response_text, re.IGNORECASE | re.DOTALL)
        
        for json_content in json_ld_matches:
            try:
                structured_data = json.loads(json_content.strip())
                if isinstance(structured_data, dict) and structured_data.get('@type') == 'Organization':
                    self.data['site_info']['organization'] = structured_data
            except json.JSONDecodeError:
                continue
        
        print(f"✅ Extracted homepage data and {len([img for img in self.data['images'] if img['context'] == 'homepage'])} images")
    
    def analyze_data(self):
        """Analyze scraped data"""
        print("🔍 Analyzing scraped data...")
        
        # Remove duplicate images
        unique_images = {}
        for image in self.data['images']:
            url = image['src']
            if url not in unique_images:
                unique_images[url] = image
        
        self.data['images'] = list(unique_images.values())
        
        # Calculate statistics
        prices = []
        product_types = {}
        
        for product in self.data['products']:
            # Collect prices
            for variant in product.get('variants', []):
                try:
                    price = float(variant.get('price', 0))
                    if price > 0:
                        prices.append(price)
                except (ValueError, TypeError):
                    pass
            
            # Count product types
            ptype = product.get('product_type', 'Uncategorized')
            product_types[ptype] = product_types.get(ptype, 0) + 1
        
        # Store analysis
        self.data['metadata']['analysis'] = {
            'total_products': len(self.data['products']),
            'total_categories': len(self.data['categories']),
            'total_unique_images': len(self.data['images']),
            'price_range': {
                'min': min(prices) if prices else 0,
                'max': max(prices) if prices else 0,
                'average': sum(prices) / len(prices) if prices else 0
            },
            'product_type_distribution': product_types
        }
    
    def save_data(self):
        """Save scraped data to files"""
        print("💾 Saving scraped data...")
        
        # Save main data file
        with open('python_scraped_data.json', 'w', encoding='utf-8') as f:
            json.dump(self.data, f, indent=2, ensure_ascii=False)
        
        # Save products only
        with open('python_products_only.json', 'w', encoding='utf-8') as f:
            json.dump(self.data['products'], f, indent=2, ensure_ascii=False)
        
        # Save summary
        summary = {
            'scraping_timestamp': self.data['metadata']['scraped_at'],
            'total_products': len(self.data['products']),
            'total_categories': len(self.data['categories']),
            'total_images': len(self.data['images']),
            'site_title': self.data['site_info'].get('title', ''),
            'analysis': self.data['metadata'].get('analysis', {})
        }
        
        with open('python_scraping_summary.json', 'w', encoding='utf-8') as f:
            json.dump(summary, f, indent=2, ensure_ascii=False)
        
        print("✅ Data saved successfully!")
    
    def run_scrape(self):
        """Run the complete scraping process"""
        start_time = time.time()
        
        print("🚀 Starting Simple Python scraper for Bad Boujee Hair...")
        print("=" * 60)
        
        try:
            # 1. Scrape Shopify API
            self.scrape_shopify_api()
            
            # 2. Scrape homepage
            self.scrape_homepage()
            
            # 3. Analyze data
            self.analyze_data()
            
            # 4. Save data
            self.save_data()
            
            duration = time.time() - start_time
            
            print("=" * 60)
            print("🎉 Scraping completed!")
            print(f"📊 Results:")
            print(f"   - Products: {len(self.data['products'])}")
            print(f"   - Categories: {len(self.data['categories'])}")
            print(f"   - Unique Images: {len(self.data['images'])}")
            print(f"   - Duration: {duration:.2f} seconds")
            
            if self.data['metadata'].get('analysis'):
                analysis = self.data['metadata']['analysis']
                print(f"   - Price Range: ${analysis['price_range']['min']:.2f} - ${analysis['price_range']['max']:.2f}")
                print(f"   - Average Price: ${analysis['price_range']['average']:.2f}")
                print(f"   - Product Types: {len(analysis['product_type_distribution'])}")
            
        except Exception as e:
            print(f"❌ Critical error: {e}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    scraper = SimpleBadBoujeeHairScraper()
    scraper.run_scrape()