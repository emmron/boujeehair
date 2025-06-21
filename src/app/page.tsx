import Header from '@/components/Header';
import HeroSlider from '@/components/HeroSlider';
import ProductSection from '@/components/ProductSection';
import TargetMarket from '@/components/TargetMarket';
import Footer from '@/components/Footer';

export default function Home() {
  const ponytailProducts = [
    {
      id: 1,
      name: "14\" Flick Ponytail",
      price: "$60.00 AUD",
      image: "https://www.badboujeehair.com/cdn/shop/files/49D5B6B8-5D7A-480E-A3F4-ABFDEDDB6180.png",
      description: "Short and sweet flick ponytail for everyday styling"
    },
    {
      id: 2,
      name: "20\" Boujee Curl Ponytail",
      price: "$80.00 AUD",
      image: "https://www.badboujeehair.com/cdn/shop/files/EFA8FA51-73E7-45DB-A056-DF8D41C18B7A.jpg",
      description: "Beautiful curly ponytail for instant volume and glamour"
    },
    {
      id: 3,
      name: "20\" I'm So Wavy Ponytail",
      price: "$80.00 AUD",
      image: "https://www.badboujeehair.com/cdn/shop/files/0F6953AA-E02C-45B5-B59B-6FB7540D3827.jpg",
      description: "Gorgeous wavy texture for effortless beach waves"
    },
    {
      id: 4,
      name: "20\" Straight Up Ponytail",
      price: "$80.00 AUD",
      image: "https://www.badboujeehair.com/cdn/shop/files/A2EDE1A0-EC98-4BE8-9355-78FD57C3D541.jpg",
      description: "Sleek straight ponytail for a polished look"
    }
  ];

  const accessoryProducts = [
    {
      id: 5,
      name: "Boujee Bonnet",
      price: "$25.00 AUD",
      image: "https://www.badboujeehair.com/cdn/shop/files/bonnet-placeholder.jpg",
      description: "Protective satin bonnet to keep your extensions safe while sleeping"
    },
    {
      id: 6,
      name: "Durags",
      price: "$20.00 AUD",
      image: "https://www.badboujeehair.com/cdn/shop/files/durag-placeholder.jpg", 
      description: "Premium durags for styling and protection"
    },
    {
      id: 7,
      name: "Snatched Brush",
      price: "$30.00 AUD",
      image: "https://www.badboujeehair.com/cdn/shop/files/brush-placeholder.jpg",
      description: "Professional brush designed for extensions and natural hair"
    }
  ];

  const haircareProducts = [
    {
      id: 8,
      name: "Wax Stick",
      price: "$18.00 AUD",
      image: "https://www.badboujeehair.com/cdn/shop/files/wax-stick-placeholder.jpg",
      description: "Perfect for laying edges and taming flyaways"
    },
    {
      id: 9,
      name: "Root Spray",
      price: "$25.00 AUD",
      image: "https://www.badboujeehair.com/cdn/shop/files/root-spray-placeholder.jpg",
      description: "Refreshing root spray for clean, healthy scalp"
    },
    {
      id: 10,
      name: "Growth Spray",
      price: "$28.00 AUD",
      image: "https://www.badboujeehair.com/cdn/shop/files/growth-spray-placeholder.jpg",
      description: "Promote healthy hair growth with our nourishing spray"
    },
    {
      id: 11,
      name: "Hydration Mask",
      price: "$35.00 AUD",
      image: "https://www.badboujeehair.com/cdn/shop/files/hydration-mask-placeholder.jpg",
      description: "Deep conditioning mask for ultimate hair hydration"
    }
  ];

  const clipinProducts = [
    {
      id: 12,
      name: "24\" Hello Halo",
      price: "$100.00 AUD",
      image: "https://www.badboujeehair.com/cdn/shop/files/AAB2ABDD-B629-4B96-8972-76F322C6EC1B.jpg",
      description: "Invisible wire halo extension for instant length and volume"
    },
    {
      id: 13,
      name: "24\" Loose Curl Clip In",
      price: "$100.00 AUD",
      image: "https://www.badboujeehair.com/cdn/shop/files/48BBBFA5-BB94-4A4E-A833-EC1A09D3B1F8.jpg",
      description: "Beautiful loose curls clip-in set for voluminous styling"
    },
    {
      id: 14,
      name: "24\" Lux Clip In Set Straight",
      price: "$100.00 AUD",
      image: "https://www.badboujeehair.com/cdn/shop/files/lux-clip-in-placeholder.jpg",
      description: "Premium straight clip-in extension set for sleek looks"
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
