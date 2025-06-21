import Header from '@/components/Header';
import HeroSlider from '@/components/HeroSlider';
import ProductSection from '@/components/ProductSection';
import TargetMarket from '@/components/TargetMarket';
import SocialFeed from '@/components/SocialFeed';
import ShoppingCart from '@/components/ShoppingCart';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';

export default function Home() {
  const ponytailProducts = [
    {
      id: 1,
      name: "Luxe Ponytail Extension - Chocolate Brown",
      price: "$85.00 AUD",
      image: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400&q=80",
      description: "Premium 22-inch chocolate brown ponytail made from 100% human hair. Heat resistant and tangle-free for effortless styling."
    },
    {
      id: 2,
      name: "Boujee Curl Ponytail - Honey Blonde",
      price: "$90.00 AUD",
      image: "https://images.unsplash.com/photo-1594736797933-d0201ba4fe65?w=400&q=80",
      description: "Stunning curly ponytail in honey blonde. Perfect for adding instant volume and glamorous curls to any look."
    },
    {
      id: 3,
      name: "Beach Wave Ponytail - Caramel",
      price: "$85.00 AUD",
      image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&q=80",
      description: "Effortless beach waves in beautiful caramel shade. 20-inch length for natural-looking volume and texture."
    },
    {
      id: 4,
      name: "Straight Sleek Ponytail - Jet Black",
      price: "$80.00 AUD",
      image: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400&q=80",
      description: "Ultra-sleek straight ponytail in jet black. Professional quality for a polished, sophisticated appearance."
    }
  ];

  const accessoryProducts = [
    {
      id: 5,
      name: "Luxe Satin Hair Bonnet",
      price: "$28.00 AUD",
      image: "https://images.unsplash.com/photo-1509740318003-d4ad0d9eb045?w=400&q=80",
      description: "Premium double-layered satin bonnet that protects extensions and natural hair while you sleep. Reduces frizz and maintains styling."
    },
    {
      id: 6,
      name: "Designer Silk Durags",
      price: "$35.00 AUD",
      image: "https://images.unsplash.com/photo-1541996154-7b6cef0de84e?w=400&q=80", 
      description: "High-quality silk durags available in multiple colors. Perfect for laying edges and maintaining waves while protecting hair."
    },
    {
      id: 7,
      name: "Professional Detangling Brush",
      price: "$32.00 AUD",
      image: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=400&q=80",
      description: "Specially designed brush with flexible bristles that gently detangle extensions without damage or shedding."
    },
    {
      id: 8,
      name: "Hair Extension Storage Case",
      price: "$45.00 AUD",
      image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&q=80",
      description: "Elegant storage case with compartments to keep your extensions organized, clean, and tangle-free when not in use."
    }
  ];

  const haircareProducts = [
    {
      id: 9,
      name: "Edge Control Wax Stick",
      price: "$22.00 AUD",
      image: "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400&q=80",
      description: "Premium edge control wax for laying edges and taming flyaways. Long-lasting hold without flaking or buildup."
    },
    {
      id: 10,
      name: "Scalp Refreshing Spray",
      price: "$28.00 AUD",
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80",
      description: "Invigorating spray with tea tree oil and peppermint that cleanses and refreshes your scalp between washes."
    },
    {
      id: 11,
      name: "Hair Growth Serum",
      price: "$35.00 AUD",
      image: "https://images.unsplash.com/photo-1520975954732-35dd22299614?w=400&q=80",
      description: "Advanced formula with biotin and keratin that promotes healthy hair growth and strengthens existing strands."
    },
    {
      id: 12,
      name: "Deep Hydration Hair Mask",
      price: "$42.00 AUD",
      image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&q=80",
      description: "Intensive weekly treatment with argan oil and shea butter that restores moisture and shine to damaged hair."
    }
  ];

  const clipinProducts = [
    {
      id: 2,
      name: "Clip-In Hair Extensions Set - Honey Blonde",
      price: "$165.00 AUD",
      image: "https://images.unsplash.com/photo-1560869713-7d0954650da1?w=400&q=80",
      description: "Complete 7-piece honey blonde clip-in extension set. 120g total weight with premium European hair for natural-looking volume and length."
    },
    {
      id: 13,
      name: "Halo Hair Extension - Invisible Wire",
      price: "$135.00 AUD",
      image: "https://images.unsplash.com/photo-1541823709867-1b206113eafd?w=400&q=80",
      description: "Revolutionary invisible wire halo extension that requires no clips or damage. 24-inch length for instant transformation."
    },
    {
      id: 14,
      name: "Luxury Clip-In Set - Chocolate Brown",
      price: "$155.00 AUD",
      image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400&q=80",
      description: "Premium 6-piece clip-in set in rich chocolate brown. Heat-resistant human hair with professional-grade clips for secure application."
    },
    {
      id: 15,
      name: "Volume Boost Clip-Ins - Jet Black",
      price: "$125.00 AUD",
      image: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=400&q=80",
      description: "Specially designed volume-boosting clip-ins in jet black. Perfect for adding thickness and fullness to fine hair."
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <ShoppingCart />
      <HeroSlider />
      <ProductSection title="Ponytails" products={ponytailProducts} id="ponytails" />
      <ProductSection title="Accessories" products={accessoryProducts} id="accessories" />
      <ProductSection title="Hair Care" products={haircareProducts} id="haircare" />
      <ProductSection title="Clip-In Extensions" products={clipinProducts} id="clipins" />
      <TargetMarket />
      <SocialFeed />
      <Footer />
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid #f079a6'
          }
        }}
      />
    </div>
  );
}
