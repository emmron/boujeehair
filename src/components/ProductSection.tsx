'use client';

import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  description: string;
}

interface ProductSectionProps {
  title: string;
  products: Product[];
  id: string;
}

const ProductSection = ({ title, products, id }: ProductSectionProps) => {
  const { addItem } = useCartStore();

  const handleAddToCart = (product: Product) => {
    addItem({
      ...product,
      category: title
    });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <section id={id} className="py-16 bg-[#121212]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {title}
          </h2>
          <div className="w-24 h-1 bg-accent-pink mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-[#1a1a1a] rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-300 shadow-lg">
              <div className="relative aspect-square">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-400 mb-4">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold accent-pink">
                    {product.price}
                  </span>
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="bg-accent-pink hover:bg-pink-600 text-white font-semibold py-2 px-6 rounded-full transition-colors duration-200"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;