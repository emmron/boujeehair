import Header from '@/components/Header';
import HeroSlider from '@/components/HeroSlider';
import ProductSection from '@/components/ProductSection';
import TargetMarket from '@/components/TargetMarket';
import Footer from '@/components/Footer';

export default function Home() {
  const ponytailProducts = [
    {
      id: 1,
      name: "Luxury Ponytail - 22 inch",
      price: "$45.00 AUD",
      image: "/api/placeholder/400/400",
      description: "Premium quality synthetic ponytail extension"
    },
    {
      id: 2,
      name: "Curly Ponytail - 20 inch",
      price: "$42.00 AUD",
      image: "/api/placeholder/400/400",
      description: "Beautiful curly ponytail for instant volume"
    },
    {
      id: 3,
      name: "Straight Ponytail - 24 inch",
      price: "$48.00 AUD",
      image: "/api/placeholder/400/400",
      description: "Sleek straight ponytail extension"
    }
  ];

  const accessoryProducts = [
    {
      id: 4,
      name: "Hair Elastic Set",
      price: "$15.00 AUD",
      image: "/api/placeholder/400/400",
      description: "Premium hair elastics for secure styling"
    },
    {
      id: 5,
      name: "Styling Clips",
      price: "$12.00 AUD",
      image: "/api/placeholder/400/400",
      description: "Professional styling clips for easy application"
    },
    {
      id: 6,
      name: "Hair Brush",
      price: "$25.00 AUD",
      image: "/api/placeholder/400/400",
      description: "Gentle brush for extension maintenance"
    }
  ];

  const haircareProducts = [
    {
      id: 7,
      name: "Extension Shampoo",
      price: "$28.00 AUD",
      image: "/api/placeholder/400/400",
      description: "Specially formulated for hair extensions"
    },
    {
      id: 8,
      name: "Conditioning Treatment",
      price: "$32.00 AUD",
      image: "/api/placeholder/400/400",
      description: "Deep conditioning for healthy extensions"
    },
    {
      id: 9,
      name: "Heat Protection Spray",
      price: "$22.00 AUD",
      image: "/api/placeholder/400/400",
      description: "Protect your extensions from heat damage"
    }
  ];

  const clipinProducts = [
    {
      id: 10,
      name: "Clip-In Set - 18 inch",
      price: "$89.00 AUD",
      image: "/api/placeholder/400/400",
      description: "Full set of clip-in extensions"
    },
    {
      id: 11,
      name: "Clip-In Set - 22 inch",
      price: "$99.00 AUD",
      image: "/api/placeholder/400/400",
      description: "Premium long clip-in extension set"
    },
    {
      id: 12,
      name: "Highlight Clip-Ins",
      price: "$65.00 AUD",
      image: "/api/placeholder/400/400",
      description: "Add highlights with clip-in extensions"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <HeroSlider />
      <ProductSection title="Ponytails" products={ponytailProducts} id="ponytails" />
      <ProductSection title="Accessories" products={accessoryProducts} id="accessories" />
      <ProductSection title="Hair Care" products={haircareProducts} id="haircare" />
      <ProductSection title="Clip-In Extensions" products={clipinProducts} id="clipins" />
      <TargetMarket />
      <Footer />
    </div>
  );
}
