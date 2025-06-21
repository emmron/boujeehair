#!/usr/bin/env python3
"""
Comprehensive Python scraper for Bad Boujee Hair website
Extracts all products, images, content, and metadata
"""

import requests
import json
import time
import re
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import os
from datetime import datetime

class BadBoujeeHairScraper:
    def __init__(self):
        self.base_url = "https://www.badboujeehair.com"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        
        # Data containers
        self.data = {
            'site_info': {},
            'products': [],
            'categories': [],
            'images': [],
            'content': {
                'hero_sections': [],
                'testimonials': [],
                'features': [],
                'about_us': '',
                'policies': {}
            },
            'metadata': {
                'scraped_at': datetime.now().isoformat(),
                'total_pages_scraped': 0,
                'scraping_duration': 0
            }
        }
        
        # Setup Selenium for JavaScript content
        self.setup_selenium()
    
    def setup_selenium(self):
        """Setup Selenium WebDriver for JavaScript-heavy content"""
        try:
            chrome_options = Options()
            chrome_options.add_argument('--headless')
            chrome_options.add_argument('--no-sandbox')
            chrome_options.add_argument('--disable-dev-shm-usage')
            chrome_options.add_argument('--disable-gpu')
            chrome_options.add_argument('--window-size=1920,1080')
            self.driver = webdriver.Chrome(options=chrome_options)
            print("✅ Selenium WebDriver initialized")
        except Exception as e:
            print(f"⚠️ Selenium setup failed: {e}")
            self.driver = None
    
    def scrape_shopify_api(self):
        """Scrape Shopify API endpoints for product data"""
        print("🛒 Scraping Shopify API endpoints...")
        
        endpoints = [
            '/products.json',
            '/collections.json',
            '/collections/all/products.json',
            '/collections/ponytails/products.json',
            '/collections/accessories/products.json',
            '/collections/hair-care/products.json'
        ]
        
        for endpoint in endpoints:
            try:
                url = self.base_url + endpoint
                print(f"  └─ Trying {endpoint}...")
                
                response = self.session.get(url, timeout=10)
                if response.status_code == 200:
                    data = response.json()
                    
                    if 'products' in data:
                        print(f"    ✅ Found {len(data['products'])} products")
                        for product in data['products']:
                            self.process_product(product)
                    
                    if 'collections' in data:
                        print(f"    ✅ Found {len(data['collections'])} collections")
                        for collection in data['collections']:
                            self.process_collection(collection)
                            
            except Exception as e:
                print(f"    ❌ Error with {endpoint}: {e}")
    
    def process_product(self, product):
        """Process and clean product data"""
        processed_product = {
            'id': product.get('id'),
            'title': product.get('title'),
            'handle': product.get('handle'),
            'description': self.clean_html(product.get('description', '')),
            'vendor': product.get('vendor'),
            'product_type': product.get('product_type'),
            'created_at': product.get('created_at'),
            'updated_at': product.get('updated_at'),
            'published_at': product.get('published_at'),
            'tags': product.get('tags', []),
            'available': product.get('available'),
            'price_range': {
                'min': None,
                'max': None
            },
            'variants': [],
            'images': [],
            'options': product.get('options', []),
            'seo': {
                'title': product.get('title'),
                'description': self.clean_html(product.get('description', ''))[:160]
            }
        }
        
        # Process variants
        if 'variants' in product:
            prices = []
            for variant in product['variants']:
                variant_data = {
                    'id': variant.get('id'),
                    'title': variant.get('title'),
                    'price': float(variant.get('price', 0)),
                    'compare_at_price': variant.get('compare_at_price'),
                    'sku': variant.get('sku'),
                    'inventory_quantity': variant.get('inventory_quantity'),
                    'available': variant.get('available'),
                    'weight': variant.get('weight'),
                    'option1': variant.get('option1'),
                    'option2': variant.get('option2'),
                    'option3': variant.get('option3')
                }
                processed_product['variants'].append(variant_data)
                if variant_data['price'] > 0:
                    prices.append(variant_data['price'])
            
            if prices:
                processed_product['price_range']['min'] = min(prices)
                processed_product['price_range']['max'] = max(prices)
        
        # Process images
        if 'images' in product:
            for image in product['images']:
                image_data = {
                    'id': image.get('id'),
                    'src': image.get('src'),
                    'alt': image.get('alt', ''),
                    'position': image.get('position'),
                    'width': image.get('width'),
                    'height': image.get('height'),
                    'variant_ids': image.get('variant_ids', [])
                }
                processed_product['images'].append(image_data)
                
                # Add to global images collection
                self.data['images'].append({
                    'src': image_data['src'],
                    'alt': image_data['alt'],
                    'context': 'product',
                    'product_id': product.get('id'),
                    'product_title': product.get('title')
                })
        
        # Check for duplicates
        existing_ids = [p['id'] for p in self.data['products']]
        if processed_product['id'] not in existing_ids:
            self.data['products'].append(processed_product)
    
    def process_collection(self, collection):
        """Process collection/category data"""
        processed_collection = {
            'id': collection.get('id'),
            'title': collection.get('title'),
            'handle': collection.get('handle'),
            'description': self.clean_html(collection.get('description', '')),
            'published_at': collection.get('published_at'),
            'updated_at': collection.get('updated_at'),
            'sort_order': collection.get('sort_order'),
            'template_suffix': collection.get('template_suffix'),
            'products_count': collection.get('products_count', 0),
            'image': collection.get('image'),
            'seo': {
                'title': collection.get('title'),
                'description': self.clean_html(collection.get('description', ''))[:160]
            }
        }
        
        # Check for duplicates
        existing_ids = [c['id'] for c in self.data['categories']]
        if processed_collection['id'] not in existing_ids:
            self.data['categories'].append(processed_collection)
    
    def scrape_homepage_content(self):
        """Scrape homepage content with Selenium"""
        print("🏠 Scraping homepage content...")
        
        if not self.driver:
            print("❌ No Selenium driver available")
            return
        
        try:
            self.driver.get(self.base_url)
            time.sleep(3)  # Wait for page load
            
            # Extract site metadata
            self.data['site_info'] = {
                'title': self.driver.title,
                'description': self.get_meta_content('description'),
                'keywords': self.get_meta_content('keywords'),
                'og_title': self.get_meta_content('og:title'),
                'og_description': self.get_meta_content('og:description'),
                'og_image': self.get_meta_content('og:image'),
                'canonical_url': self.get_canonical_url()
            }
            
            # Extract hero sections
            hero_elements = self.driver.find_elements(By.CSS_SELECTOR, '.hero, .banner, .slider, [class*="hero"], [class*="banner"]')
            for hero in hero_elements:
                try:
                    hero_data = {
                        'title': self.safe_get_text(hero, 'h1, h2, .title, [class*="title"]'),
                        'subtitle': self.safe_get_text(hero, 'p, .subtitle, [class*="subtitle"]'),
                        'cta_text': self.safe_get_text(hero, 'button, .btn, .cta, a[class*="btn"]'),
                        'background_image': self.safe_get_attribute(hero, 'img', 'src'),
                        'html': hero.get_attribute('outerHTML')[:500]  # First 500 chars
                    }
                    if hero_data['title'] or hero_data['subtitle']:
                        self.data['content']['hero_sections'].append(hero_data)
                except Exception as e:
                    print(f"Error processing hero element: {e}")
            
            # Extract testimonials
            testimonial_elements = self.driver.find_elements(By.CSS_SELECTOR, '.testimonial, .review, [class*="testimonial"], [class*="review"]')
            for testimonial in testimonial_elements:
                try:
                    testimonial_data = {
                        'name': self.safe_get_text(testimonial, '.name, .author, [class*="name"], [class*="author"]'),
                        'text': self.safe_get_text(testimonial, '.text, .content, p'),
                        'rating': len(testimonial.find_elements(By.CSS_SELECTOR, '.star, [class*="star"]')),
                        'image': self.safe_get_attribute(testimonial, 'img', 'src')
                    }
                    if testimonial_data['name'] or testimonial_data['text']:
                        self.data['content']['testimonials'].append(testimonial_data)
                except Exception as e:
                    print(f"Error processing testimonial: {e}")
            
            # Extract all images
            images = self.driver.find_elements(By.TAG_NAME, 'img')
            for img in images:
                try:
                    src = img.get_attribute('src') or img.get_attribute('data-src')
                    if src and not src.startswith('data:'):
                        image_data = {
                            'src': urljoin(self.base_url, src),
                            'alt': img.get_attribute('alt') or '',
                            'width': img.get_attribute('width'),
                            'height': img.get_attribute('height'),
                            'context': 'homepage',
                            'lazy_loaded': bool(img.get_attribute('data-src'))
                        }
                        self.data['images'].append(image_data)
                except Exception as e:
                    continue
            
            print(f"✅ Extracted {len(self.data['content']['hero_sections'])} hero sections")
            print(f"✅ Extracted {len(self.data['content']['testimonials'])} testimonials")
            print(f"✅ Extracted {len([img for img in self.data['images'] if img['context'] == 'homepage'])} homepage images")
            
        except Exception as e:
            print(f"❌ Error scraping homepage: {e}")
    
    def scrape_individual_products(self):
        """Scrape individual product pages for detailed info"""
        print("🎯 Scraping individual product pages...")
        
        if not self.driver:
            print("❌ No Selenium driver available")
            return
        
        # Get product handles from already scraped products
        product_handles = [p['handle'] for p in self.data['products'] if p.get('handle')][:10]  # Limit to first 10
        
        for handle in product_handles:
            try:
                url = f"{self.base_url}/products/{handle}"
                print(f"  └─ Scraping {handle}...")
                
                self.driver.get(url)
                time.sleep(2)
                
                # Find the product in our data
                product = next((p for p in self.data['products'] if p['handle'] == handle), None)
                if not product:
                    continue
                
                # Extract additional details
                product['detailed_description'] = self.safe_get_text(self.driver, '.product-description, .product-content, [class*="description"]')
                product['features'] = self.extract_list_items('.product-features, .features, [class*="features"]')
                product['specifications'] = self.extract_list_items('.specifications, .specs, [class*="specs"]')
                product['care_instructions'] = self.safe_get_text(self.driver, '.care-instructions, [class*="care"]')
                
                # Extract gallery images
                gallery_images = self.driver.find_elements(By.CSS_SELECTOR, '.product-gallery img, .product-images img, [class*="gallery"] img')
                product['gallery_images'] = []
                for img in gallery_images:
                    src = img.get_attribute('src') or img.get_attribute('data-src')
                    if src:
                        product['gallery_images'].append({
                            'src': urljoin(self.base_url, src),
                            'alt': img.get_attribute('alt') or ''
                        })
                
                # Extract reviews/ratings
                reviews = self.driver.find_elements(By.CSS_SELECTOR, '.review, [class*="review"]')
                product['reviews'] = []
                for review in reviews[:5]:  # Limit to first 5 reviews
                    review_data = {
                        'author': self.safe_get_text(review, '.author, .name, [class*="author"], [class*="name"]'),
                        'rating': len(review.find_elements(By.CSS_SELECTOR, '.star, [class*="star"]')),
                        'text': self.safe_get_text(review, '.text, .content, p'),
                        'date': self.safe_get_text(review, '.date, [class*="date"]')
                    }
                    if review_data['author'] or review_data['text']:
                        product['reviews'].append(review_data)
                
                time.sleep(1)  # Be respectful
                
            except Exception as e:
                print(f"    ❌ Error scraping {handle}: {e}")
    
    def scrape_additional_pages(self):
        """Scrape additional important pages"""
        print("📖 Scraping additional pages...")
        
        pages = [
            '/pages/about',
            '/pages/about-us',
            '/pages/contact',
            '/pages/shipping',
            '/pages/returns',
            '/pages/privacy-policy',
            '/pages/terms-of-service'
        ]
        
        for page in pages:
            try:
                url = self.base_url + page
                if self.driver:
                    self.driver.get(url)
                    time.sleep(2)
                    
                    content = self.safe_get_text(self.driver, 'main, .content, .page-content, article')
                    title = self.safe_get_text(self.driver, 'h1, .page-title')
                    
                    if content:
                        page_name = page.split('/')[-1].replace('-', '_')
                        self.data['content']['policies'][page_name] = {
                            'title': title,
                            'content': content[:1000],  # First 1000 chars
                            'url': page
                        }
                        print(f"  ✅ Scraped {page}")
                
            except Exception as e:
                print(f"  ❌ Error scraping {page}: {e}")
    
    def extract_structured_data(self):
        """Extract JSON-LD structured data"""
        print("📊 Extracting structured data...")
        
        if not self.driver:
            return
        
        try:
            self.driver.get(self.base_url)
            time.sleep(2)
            
            # Find JSON-LD scripts
            scripts = self.driver.find_elements(By.CSS_SELECTOR, 'script[type="application/ld+json"]')
            
            for script in scripts:
                try:
                    content = script.get_attribute('innerHTML')
                    if content:
                        structured_data = json.loads(content)
                        
                        # Process different types of structured data
                        if isinstance(structured_data, dict):
                            if structured_data.get('@type') == 'Organization':
                                self.data['site_info']['organization'] = structured_data
                            elif structured_data.get('@type') == 'Product':
                                # Find matching product and enhance it
                                product_name = structured_data.get('name')
                                if product_name:
                                    matching_product = next((p for p in self.data['products'] if p['title'] == product_name), None)
                                    if matching_product:
                                        matching_product['structured_data'] = structured_data
                        
                        elif isinstance(structured_data, list):
                            for item in structured_data:
                                if item.get('@type') == 'Product':
                                    product_name = item.get('name')
                                    if product_name:
                                        matching_product = next((p for p in self.data['products'] if p['title'] == product_name), None)
                                        if matching_product:
                                            matching_product['structured_data'] = item
                
                except json.JSONDecodeError:
                    continue
                except Exception as e:
                    print(f"Error processing structured data: {e}")
        
        except Exception as e:
            print(f"❌ Error extracting structured data: {e}")
    
    def analyze_and_enhance_data(self):
        """Analyze scraped data and add insights"""
        print("🔍 Analyzing and enhancing data...")
        
        # Product analysis
        if self.data['products']:
            prices = []
            for product in self.data['products']:
                if product['price_range']['min']:
                    prices.append(product['price_range']['min'])
                if product['price_range']['max']:
                    prices.append(product['price_range']['max'])
            
            if prices:
                self.data['metadata']['price_analysis'] = {
                    'min_price': min(prices),
                    'max_price': max(prices),
                    'avg_price': sum(prices) / len(prices),
                    'price_count': len(prices)
                }
            
            # Product type analysis
            product_types = {}
            for product in self.data['products']:
                ptype = product.get('product_type', 'Uncategorized')
                product_types[ptype] = product_types.get(ptype, 0) + 1
            
            self.data['metadata']['product_type_distribution'] = product_types
            
            # Vendor analysis
            vendors = {}
            for product in self.data['products']:
                vendor = product.get('vendor', 'Unknown')
                vendors[vendor] = vendors.get(vendor, 0) + 1
            
            self.data['metadata']['vendor_distribution'] = vendors
        
        # Image analysis
        unique_images = {}
        for image in self.data['images']:
            url = image['src']
            if url not in unique_images:
                unique_images[url] = image
        
        self.data['images'] = list(unique_images.values())
        self.data['metadata']['total_unique_images'] = len(unique_images)
        
        # Content analysis
        self.data['metadata']['content_stats'] = {
            'total_products': len(self.data['products']),
            'total_categories': len(self.data['categories']),
            'total_images': len(self.data['images']),
            'hero_sections': len(self.data['content']['hero_sections']),
            'testimonials': len(self.data['content']['testimonials']),
            'policy_pages': len(self.data['content']['policies'])
        }
    
    def save_data(self):
        """Save all scraped data to files"""
        print("💾 Saving scraped data...")
        
        # Calculate scraping duration
        self.data['metadata']['scraping_duration'] = time.time() - self.start_time
        
        # Save comprehensive data
        with open('python_scraped_data.json', 'w', encoding='utf-8') as f:
            json.dump(self.data, f, indent=2, ensure_ascii=False, default=str)
        
        # Save products separately
        with open('python_products.json', 'w', encoding='utf-8') as f:
            json.dump(self.data['products'], f, indent=2, ensure_ascii=False, default=str)
        
        # Save images separately
        with open('python_images.json', 'w', encoding='utf-8') as f:
            json.dump(self.data['images'], f, indent=2, ensure_ascii=False, default=str)
        
        # Save summary report
        summary = {
            'scraping_summary': self.data['metadata'],
            'site_info': self.data['site_info'],
            'content_overview': {
                'products': len(self.data['products']),
                'categories': len(self.data['categories']),
                'images': len(self.data['images']),
                'hero_sections': len(self.data['content']['hero_sections']),
                'testimonials': len(self.data['content']['testimonials'])
            }
        }
        
        with open('scraping_summary.json', 'w', encoding='utf-8') as f:
            json.dump(summary, f, indent=2, ensure_ascii=False, default=str)
        
        print(f"✅ Data saved to python_scraped_data.json")
        print(f"✅ Products saved to python_products.json")
        print(f"✅ Images saved to python_images.json")
        print(f"✅ Summary saved to scraping_summary.json")
    
    def cleanup(self):
        """Cleanup resources"""
        if self.driver:
            self.driver.quit()
    
    # Helper methods
    def clean_html(self, text):
        """Remove HTML tags and clean text"""
        if not text:
            return ""
        soup = BeautifulSoup(text, 'html.parser')
        return soup.get_text().strip()
    
    def get_meta_content(self, name):
        """Get meta tag content"""
        try:
            element = self.driver.find_element(By.CSS_SELECTOR, f'meta[name="{name}"], meta[property="{name}"]')
            return element.get_attribute('content')
        except:
            return ""
    
    def get_canonical_url(self):
        """Get canonical URL"""
        try:
            element = self.driver.find_element(By.CSS_SELECTOR, 'link[rel="canonical"]')
            return element.get_attribute('href')
        except:
            return ""
    
    def safe_get_text(self, parent, selector):
        """Safely get text from element"""
        try:
            if hasattr(parent, 'find_element'):
                element = parent.find_element(By.CSS_SELECTOR, selector)
            else:
                element = self.driver.find_element(By.CSS_SELECTOR, selector)
            return element.text.strip()
        except:
            return ""
    
    def safe_get_attribute(self, parent, selector, attribute):
        """Safely get attribute from element"""
        try:
            if hasattr(parent, 'find_element'):
                element = parent.find_element(By.CSS_SELECTOR, selector)
            else:
                element = self.driver.find_element(By.CSS_SELECTOR, selector)
            return element.get_attribute(attribute)
        except:
            return ""
    
    def extract_list_items(self, selector):
        """Extract list items as array"""
        try:
            elements = self.driver.find_elements(By.CSS_SELECTOR, f'{selector} li, {selector} p')
            return [elem.text.strip() for elem in elements if elem.text.strip()]
        except:
            return []
    
    def run_full_scrape(self):
        """Run the complete scraping process"""
        self.start_time = time.time()
        
        print("🚀 Starting comprehensive Bad Boujee Hair scraping...")
        print("=" * 60)
        
        try:
            # 1. Scrape Shopify API for product data
            self.scrape_shopify_api()
            
            # 2. Scrape homepage content
            self.scrape_homepage_content()
            
            # 3. Scrape individual product pages
            self.scrape_individual_products()
            
            # 4. Scrape additional pages
            self.scrape_additional_pages()
            
            # 5. Extract structured data
            self.extract_structured_data()
            
            # 6. Analyze and enhance data
            self.analyze_and_enhance_data()
            
            # 7. Save all data
            self.save_data()
            
            print("=" * 60)
            print("🎉 Scraping completed successfully!")
            print(f"📊 Final Summary:")
            print(f"   - Products: {len(self.data['products'])}")
            print(f"   - Categories: {len(self.data['categories'])}")
            print(f"   - Images: {len(self.data['images'])}")
            print(f"   - Hero Sections: {len(self.data['content']['hero_sections'])}")
            print(f"   - Testimonials: {len(self.data['content']['testimonials'])}")
            print(f"   - Duration: {self.data['metadata']['scraping_duration']:.2f} seconds")
            
        except Exception as e:
            print(f"❌ Critical error during scraping: {e}")
        finally:
            self.cleanup()

if __name__ == "__main__":
    scraper = BadBoujeeHairScraper()
    scraper.run_full_scrape()