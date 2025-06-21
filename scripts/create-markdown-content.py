#!/usr/bin/env python3
"""
Create comprehensive markdown content from scraped website data
"""

import json
import os
from datetime import datetime
import urllib.request
import urllib.parse

class MarkdownContentGenerator:
    def __init__(self):
        self.scraped_data = None
        self.product_data = None
        self.images_data = None
        self.markdown_content = {}
        
    def load_scraped_data(self):
        """Load all scraped data files"""
        print("📖 Loading scraped data...")
        
        try:
            with open('python_scraped_data.json', 'r', encoding='utf-8') as f:
                self.scraped_data = json.load(f)
            
            with open('src/data/products.json', 'r', encoding='utf-8') as f:
                self.product_data = json.load(f)
                
            with open('src/data/images.json', 'r', encoding='utf-8') as f:
                self.images_data = json.load(f)
                
            print("✅ All data loaded successfully")
            
        except Exception as e:
            print(f"❌ Error loading data: {e}")
            return False
        
        return True
    
    def download_images(self):
        """Download and organize images locally"""
        print("🖼️ Downloading and organizing images...")
        
        # Create images directory
        os.makedirs('public/images/products', exist_ok=True)
        os.makedirs('public/images/general', exist_ok=True)
        
        downloaded_images = []
        
        for i, image in enumerate(self.images_data['images'][:50]):  # Limit to 50 images
            try:
                img_url = image['src']
                if not img_url or 'loading.gif' in img_url:
                    continue
                
                # Generate filename
                filename = f"image_{i+1}.jpg"
                if image.get('product_title'):
                    safe_title = "".join(c for c in image['product_title'] if c.isalnum() or c in (' ', '-', '_')).rstrip()
                    filename = f"{safe_title.replace(' ', '_').lower()}_{i+1}.jpg"
                
                # Determine directory
                img_dir = 'products' if image.get('context') == 'product' else 'general'
                local_path = f"public/images/{img_dir}/{filename}"
                web_path = f"/images/{img_dir}/{filename}"
                
                # Download image
                headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
                req = urllib.request.Request(img_url, headers=headers)
                
                with urllib.request.urlopen(req, timeout=10) as response:
                    with open(local_path, 'wb') as f:
                        f.write(response.read())
                
                downloaded_images.append({
                    'original_url': img_url,
                    'local_path': local_path,
                    'web_path': web_path,
                    'alt': image.get('alt', ''),
                    'context': image.get('context', 'general'),
                    'product_id': image.get('product_id'),
                    'product_title': image.get('product_title')
                })
                
                if len(downloaded_images) % 10 == 0:
                    print(f"  ✅ Downloaded {len(downloaded_images)} images...")
                
            except Exception as e:
                print(f"  ⚠️ Error downloading {img_url}: {e}")
                continue
        
        print(f"✅ Downloaded {len(downloaded_images)} images")
        
        # Save image mapping
        with open('src/data/downloaded-images.json', 'w', encoding='utf-8') as f:
            json.dump(downloaded_images, f, indent=2, ensure_ascii=False)
        
        return downloaded_images
    
    def create_product_markdown(self):
        """Create markdown content for products"""
        print("📝 Creating product markdown content...")
        
        markdown_content = []
        
        # Header
        markdown_content.append("# Bad Boujee Hair - Product Catalog")
        markdown_content.append(f"\n*Generated on {datetime.now().strftime('%B %d, %Y')}*")
        markdown_content.append(f"\n**Total Products:** {self.product_data['metadata']['total_products']}")
        markdown_content.append(f"**Price Range:** ${self.product_data['metadata']['price_analysis']['min']:.2f} - ${self.product_data['metadata']['price_analysis']['max']:.2f} AUD")
        markdown_content.append("\n---\n")
        
        # Categories
        categories = ['ponytails', 'clipins', 'haircare', 'accessories', 'wigs']
        
        for category in categories:
            if category in self.product_data and self.product_data[category]:
                products = self.product_data[category]
                
                # Category header
                category_title = category.replace('clipins', 'Clip-In Extensions').replace('haircare', 'Hair Care').title()
                markdown_content.append(f"## {category_title}")
                markdown_content.append(f"\n*{len(products)} products available*\n")
                
                # Products in this category
                for product in products:
                    markdown_content.append(f"### {product['name']}")
                    markdown_content.append(f"\n**Price:** {product['price']}")
                    markdown_content.append(f"**Vendor:** {product.get('vendor', 'Bad&BoujeeHair')}")
                    
                    if product.get('product_type'):
                        markdown_content.append(f"**Type:** {product['product_type']}")
                    
                    if product.get('description'):
                        markdown_content.append(f"\n{product['description']}")
                    
                    # Variants
                    if product.get('variants') and len(product['variants']) > 1:
                        markdown_content.append(f"\n**Available Options:**")
                        for variant in product['variants'][:5]:  # Limit to 5 variants
                            variant_info = f"- {variant.get('title', 'Default')}"
                            if variant.get('price'):
                                variant_info += f" - ${variant['price']} AUD"
                            if variant.get('sku'):
                                variant_info += f" (SKU: {variant['sku']})"
                            markdown_content.append(variant_info)
                    
                    # Tags
                    if product.get('tags'):
                        markdown_content.append(f"\n**Tags:** {', '.join(product['tags'])}")
                    
                    markdown_content.append("\n---\n")
        
        return "\n".join(markdown_content)
    
    def create_site_info_markdown(self):
        """Create markdown with site information"""
        print("📄 Creating site information markdown...")
        
        markdown_content = []
        
        # Header
        markdown_content.append("# Bad Boujee Hair - Website Information")
        markdown_content.append(f"\n*Last updated: {datetime.now().strftime('%B %d, %Y at %I:%M %p')}*\n")
        
        # Site Overview
        site_info = self.scraped_data.get('site_info', {})
        markdown_content.append("## Site Overview")
        markdown_content.append(f"\n**Website Title:** {site_info.get('title', 'Bad&BoujeeHair')}")
        
        if site_info.get('description'):
            markdown_content.append(f"**Description:** {site_info['description']}")
        
        # Statistics
        metadata = self.scraped_data.get('metadata', {})
        if metadata.get('analysis'):
            analysis = metadata['analysis']
            markdown_content.append("\n## Website Statistics")
            markdown_content.append(f"\n- **Total Products:** {analysis['total_products']}")
            markdown_content.append(f"- **Product Categories:** {analysis['total_categories']}")
            markdown_content.append(f"- **Total Images:** {analysis['total_unique_images']}")
            markdown_content.append(f"- **Average Product Price:** ${analysis['price_range']['average']:.2f} AUD")
            
            # Product type distribution
            if analysis.get('product_type_distribution'):
                markdown_content.append("\n### Product Types")
                for ptype, count in analysis['product_type_distribution'].items():
                    type_name = ptype if ptype else "General Products"
                    markdown_content.append(f"- **{type_name}:** {count} products")
        
        # Categories
        categories = self.scraped_data.get('categories', [])
        if categories:
            markdown_content.append("\n## Product Categories")
            for category in categories:
                markdown_content.append(f"\n### {category.get('title', 'Untitled Category')}")
                if category.get('description'):
                    markdown_content.append(f"{category['description']}")
                if category.get('products_count'):
                    markdown_content.append(f"*{category['products_count']} products*")
                markdown_content.append("")
        
        return "\n".join(markdown_content)
    
    def create_images_markdown(self):
        """Create markdown content for images"""
        print("🖼️ Creating images markdown content...")
        
        markdown_content = []
        
        # Header
        markdown_content.append("# Bad Boujee Hair - Image Gallery")
        markdown_content.append(f"\n*Generated on {datetime.now().strftime('%B %d, %Y')}*")
        markdown_content.append(f"\n**Total Images:** {len(self.images_data['images'])}")
        markdown_content.append("\n---\n")
        
        # Group images by context
        images_by_context = {}
        for image in self.images_data['images']:
            context = image.get('context', 'general')
            if context not in images_by_context:
                images_by_context[context] = []
            images_by_context[context].append(image)
        
        # Create sections for each context
        for context, images in images_by_context.items():
            context_title = context.replace('_', ' ').title()
            markdown_content.append(f"## {context_title} Images")
            markdown_content.append(f"\n*{len(images)} images*\n")
            
            for i, image in enumerate(images[:20]):  # Limit to 20 per section
                markdown_content.append(f"### Image {i+1}")
                markdown_content.append(f"\n**URL:** {image['src']}")
                
                if image.get('alt'):
                    markdown_content.append(f"**Alt Text:** {image['alt']}")
                
                if image.get('product_title'):
                    markdown_content.append(f"**Product:** {image['product_title']}")
                
                markdown_content.append("\n---\n")
        
        return "\n".join(markdown_content)
    
    def create_comprehensive_markdown(self):
        """Create a comprehensive markdown document"""
        print("📚 Creating comprehensive markdown document...")
        
        markdown_content = []
        
        # Main header
        markdown_content.append("# Bad Boujee Hair - Complete Website Data")
        markdown_content.append(f"\n*Comprehensive data export generated on {datetime.now().strftime('%B %d, %Y at %I:%M %p')}*")
        markdown_content.append("\n**Source:** https://www.badboujeehair.com")
        markdown_content.append("**Scraping Method:** Python + Shopify API")
        markdown_content.append("\n---\n")
        
        # Table of Contents
        markdown_content.append("## Table of Contents")
        markdown_content.append("\n1. [Website Overview](#website-overview)")
        markdown_content.append("2. [Product Catalog](#product-catalog)")
        markdown_content.append("3. [Categories](#categories)")
        markdown_content.append("4. [Images](#images)")
        markdown_content.append("5. [Technical Details](#technical-details)")
        markdown_content.append("\n---\n")
        
        # Website Overview
        site_info = self.scraped_data.get('site_info', {})
        markdown_content.append("## Website Overview")
        markdown_content.append(f"\n**Business Name:** Bad & Boujee Hair")
        markdown_content.append(f"**Website:** https://www.badboujeehair.com")
        markdown_content.append(f"**Title:** {site_info.get('title', 'Bad&BoujeeHair')}")
        
        if site_info.get('description'):
            markdown_content.append(f"**Meta Description:** {site_info['description']}")
        
        # Quick Stats
        metadata = self.scraped_data.get('metadata', {})
        if metadata.get('analysis'):
            analysis = metadata['analysis']
            markdown_content.append("\n### Quick Statistics")
            markdown_content.append(f"\n| Metric | Value |")
            markdown_content.append(f"|--------|-------|")
            markdown_content.append(f"| Total Products | {analysis['total_products']} |")
            markdown_content.append(f"| Product Categories | {analysis['total_categories']} |")
            markdown_content.append(f"| Total Images | {analysis['total_unique_images']} |")
            markdown_content.append(f"| Price Range | ${analysis['price_range']['min']:.2f} - ${analysis['price_range']['max']:.2f} AUD |")
            markdown_content.append(f"| Average Price | ${analysis['price_range']['average']:.2f} AUD |")
        
        markdown_content.append("\n---\n")
        
        # Product Catalog
        markdown_content.append("## Product Catalog")
        
        categories = ['ponytails', 'clipins', 'haircare', 'accessories', 'wigs']
        
        for category in categories:
            if category in self.product_data and self.product_data[category]:
                products = self.product_data[category]
                
                category_title = category.replace('clipins', 'Clip-In Extensions').replace('haircare', 'Hair Care').title()
                markdown_content.append(f"\n### {category_title}")
                markdown_content.append(f"\n*{len(products)} products available*")
                
                # Create table
                markdown_content.append(f"\n| Product | Price | Type | Description |")
                markdown_content.append(f"|---------|-------|------|-------------|")
                
                for product in products:
                    name = product['name'].replace('|', '\\|')
                    price = product['price']
                    ptype = product.get('product_type', 'N/A')
                    description = (product.get('description', '')[:50] + '...').replace('|', '\\|') if product.get('description') else 'N/A'
                    
                    markdown_content.append(f"| {name} | {price} | {ptype} | {description} |")
                
                markdown_content.append("")
        
        markdown_content.append("\n---\n")
        
        # Categories
        categories_data = self.scraped_data.get('categories', [])
        if categories_data:
            markdown_content.append("## Categories")
            
            for category in categories_data:
                markdown_content.append(f"\n### {category.get('title', 'Untitled')}")
                
                if category.get('description'):
                    markdown_content.append(f"\n{category['description']}")
                
                if category.get('products_count'):
                    markdown_content.append(f"\n**Products Count:** {category['products_count']}")
                
                if category.get('handle'):
                    markdown_content.append(f"**URL Handle:** /{category['handle']}")
                
                markdown_content.append("")
        
        markdown_content.append("\n---\n")
        
        # Images
        markdown_content.append("## Images")
        markdown_content.append(f"\n**Total Images Found:** {len(self.images_data['images'])}")
        
        # Image breakdown by context
        images_by_context = {}
        for image in self.images_data['images']:
            context = image.get('context', 'general')
            images_by_context[context] = images_by_context.get(context, 0) + 1
        
        markdown_content.append(f"\n### Image Breakdown")
        markdown_content.append(f"\n| Context | Count |")
        markdown_content.append(f"|---------|-------|")
        
        for context, count in images_by_context.items():
            context_name = context.replace('_', ' ').title()
            markdown_content.append(f"| {context_name} | {count} |")
        
        markdown_content.append("\n---\n")
        
        # Technical Details
        markdown_content.append("## Technical Details")
        markdown_content.append(f"\n**Scraping Date:** {metadata.get('scraped_at', 'Unknown')}")
        markdown_content.append(f"**Scraping Method:** {metadata.get('scraping_method', 'Python + Shopify API')}")
        
        if metadata.get('scraping_duration'):
            markdown_content.append(f"**Scraping Duration:** {metadata['scraping_duration']:.2f} seconds")
        
        markdown_content.append(f"\n**Data Sources:**")
        markdown_content.append(f"- Shopify Products API (/products.json)")
        markdown_content.append(f"- Shopify Collections API (/collections.json)")
        markdown_content.append(f"- Website Homepage HTML")
        markdown_content.append(f"- Product Images and Metadata")
        
        return "\n".join(markdown_content)
    
    def save_markdown_files(self):
        """Save all markdown content to files"""
        print("💾 Saving markdown files...")
        
        # Create markdown directory
        os.makedirs('public/markdown', exist_ok=True)
        
        # Create individual markdown files
        files_created = []
        
        # 1. Product catalog
        product_md = self.create_product_markdown()
        with open('public/markdown/products.md', 'w', encoding='utf-8') as f:
            f.write(product_md)
        files_created.append('products.md')
        
        # 2. Site information
        site_md = self.create_site_info_markdown()
        with open('public/markdown/site-info.md', 'w', encoding='utf-8') as f:
            f.write(site_md)
        files_created.append('site-info.md')
        
        # 3. Images
        images_md = self.create_images_markdown()
        with open('public/markdown/images.md', 'w', encoding='utf-8') as f:
            f.write(images_md)
        files_created.append('images.md')
        
        # 4. Comprehensive document
        comprehensive_md = self.create_comprehensive_markdown()
        with open('public/markdown/complete-data.md', 'w', encoding='utf-8') as f:
            f.write(comprehensive_md)
        files_created.append('complete-data.md')
        
        # 5. Create index
        index_md = self.create_index_markdown(files_created)
        with open('public/markdown/index.md', 'w', encoding='utf-8') as f:
            f.write(index_md)
        files_created.append('index.md')
        
        print(f"✅ Created {len(files_created)} markdown files:")
        for file in files_created:
            print(f"   - public/markdown/{file}")
        
        return files_created
    
    def create_index_markdown(self, files):
        """Create an index markdown file"""
        markdown_content = []
        
        markdown_content.append("# Bad Boujee Hair - Documentation Index")
        markdown_content.append(f"\n*Generated on {datetime.now().strftime('%B %d, %Y at %I:%M %p')}*")
        markdown_content.append("\nThis directory contains comprehensive documentation and data for the Bad Boujee Hair website.")
        markdown_content.append("\n---\n")
        
        markdown_content.append("## Available Documents")
        markdown_content.append("\n### 📋 [Complete Data Export](./complete-data.md)")
        markdown_content.append("Comprehensive overview of all website data including products, categories, and statistics.")
        
        markdown_content.append("\n### 🛍️ [Product Catalog](./products.md)")
        markdown_content.append("Detailed product listings organized by category with prices and descriptions.")
        
        markdown_content.append("\n### ℹ️ [Site Information](./site-info.md)")
        markdown_content.append("Website metadata, statistics, and technical information.")
        
        markdown_content.append("\n### 🖼️ [Image Gallery](./images.md)")
        markdown_content.append("Complete listing of all images found on the website.")
        
        markdown_content.append("\n---\n")
        
        # Statistics
        markdown_content.append("## Quick Stats")
        if self.scraped_data and self.scraped_data.get('metadata', {}).get('analysis'):
            analysis = self.scraped_data['metadata']['analysis']
            markdown_content.append(f"\n- **Total Products:** {analysis['total_products']}")
            markdown_content.append(f"- **Product Categories:** {analysis['total_categories']}")
            markdown_content.append(f"- **Total Images:** {analysis['total_unique_images']}")
            markdown_content.append(f"- **Price Range:** ${analysis['price_range']['min']:.2f} - ${analysis['price_range']['max']:.2f} AUD")
        
        markdown_content.append(f"\n- **Documentation Files:** {len(files)}")
        markdown_content.append(f"- **Last Updated:** {datetime.now().strftime('%B %d, %Y at %I:%M %p')}")
        
        return "\n".join(markdown_content)
    
    def run(self):
        """Run the complete markdown generation process"""
        print("🚀 Starting markdown content generation...")
        print("=" * 60)
        
        try:
            # Load data
            if not self.load_scraped_data():
                return False
            
            # Download images
            downloaded_images = self.download_images()
            
            # Create markdown files
            markdown_files = self.save_markdown_files()
            
            print("=" * 60)
            print("🎉 Markdown generation completed!")
            print(f"📊 Summary:")
            print(f"   - Images downloaded: {len(downloaded_images)}")
            print(f"   - Markdown files created: {len(markdown_files)}")
            print(f"   - Total products documented: {self.scraped_data['metadata']['analysis']['total_products']}")
            
            return True
            
        except Exception as e:
            print(f"❌ Error during markdown generation: {e}")
            import traceback
            traceback.print_exc()
            return False

if __name__ == "__main__":
    generator = MarkdownContentGenerator()
    generator.run()