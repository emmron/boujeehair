'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import HeroSlider from '@/components/HeroSlider';
import ProductSection from '@/components/ProductSection';
import BookingSection from '@/components/BookingSection';
import TargetMarket from '@/components/TargetMarket';
import SocialFeed from '@/components/SocialFeed';
import ShoppingCart from '@/components/ShoppingCart';
import Footer from '@/components/Footer';
import FloatingNotification from '@/components/ui/FloatingNotification';
import { Toaster } from 'react-hot-toast';

export default function Home() {
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Show notification after 3 seconds
    const timer = setTimeout(() => {
      setShowNotification(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Real Bad Boujee Hair Products from Shopify API
  const ponytailProducts = [
  {
    "id": 10123160322332,
    "name": "36” The Baddest Pony - Straight",
    "price": "$80.00 AUD",
    "image": "https://cdn.shopify.com/s/files/1/0718/7949/1868/files/D4F726D3-83A3-47AB-9DD6-6AEDAD525021.jpg?v=1744030280",
    "description": "The Baddest Ponytail – 36” of Straight-Up Main Character Energy\n Meet The Baddest Pony – the ultimate showstopper for the girl who walks in and owns t..."
  },
  {
    "id": 10016394674460,
    "name": "Drawstring Bun",
    "price": "$80.00 AUD",
    "image": "https://cdn.shopify.com/s/files/1/0718/7949/1868/files/A1A920D5-031B-40A0-BA39-26D06AE1CC64.png?v=1744077790",
    "description": "The perfect style! Look instantly fabulous with a baddie updo without the effort...."
  },
  {
    "id": 10009148490012,
    "name": "20” Straight Up Ponytail",
    "price": "$80.00 AUD",
    "image": "https://cdn.shopify.com/s/files/1/0718/7949/1868/files/Straight_Up_Ponytail_20.jpg?v=1735890078",
    "description": "\nStraight Up – 20” Drawstring Ponytail\nShorter length, same baddie energy.\nMeet your new fave: the 20” Straight Up Ponytail. She’s sleek, sassy, and a..."
  },
  {
    "id": 10009152717084,
    "name": "20” I’m So Wavy Ponytail",
    "price": "$80.00 AUD",
    "image": "https://cdn.shopify.com/s/files/1/0718/7949/1868/files/I_m_So_Wavy_Ponytail_20.jpg?v=1735889860",
    "description": "\n\nLength: 20”Weight:  120 gStyle: I’m So Wavy\nHeat Resistant 180 Degrees\n \nHair that looks &amp; feels like yours: Dedicated to making soft &amp; high..."
  }
];

  const clipinProducts = [
  {
    "id": 10123373576476,
    "name": "24” Hello Halo",
    "price": "$100.00 AUD",
    "image": "https://cdn.shopify.com/s/files/1/0718/7949/1868/files/IMG-5936.jpg?v=1744052381",
    "description": "Halo hair extensions are a popular choice for adding volume and length to your natural hair with minimal effort. These extensions consist of a single ..."
  },
  {
    "id": 10123361681692,
    "name": "24” Loose Curl Clip In",
    "price": "$100.00 AUD",
    "image": "https://cdn.shopify.com/s/files/1/0718/7949/1868/files/48BBBFA5-BB94-4A4E-A833-EC1A09D3B1F8.jpg?v=1744049669",
    "description": "Loose Curl Clip-Ins – 24” of Effortless Bounce\nSay hello to soft, romantic curls that blend like a dream. Our 24-inch Loose Curl Clip-Ins give you len..."
  },
  {
    "id": 10009030721820,
    "name": "Clip In Fringe",
    "price": "$20.00 AUD",
    "image": "https://cdn.shopify.com/s/files/1/0718/7949/1868/files/clipinfringes.jpg?v=1744077058",
    "description": "Effortless Bangs! Clip on an instant baddie fringe without the commitment of cutting your hair. ..."
  },
  {
    "id": 8135032275228,
    "name": "24” Lux Clip In Set Straight",
    "price": "$100.00 AUD",
    "image": "https://cdn.shopify.com/s/files/1/0718/7949/1868/files/black_1B_490d0f93-5b86-4498-8add-fa43e0484307.jpg?v=1730511618",
    "description": "\n \n\nLux  Hair Clip Ins 24” 180g\n7 pieces \n \n \n\n\n..."
  }
];

  const haircareProducts = [
  {
    "id": 10118133023004,
    "name": "Sleek Stick",
    "price": "$21.00 AUD",
    "image": "https://cdn.shopify.com/s/files/1/0718/7949/1868/files/A1744259-2A01-4CDC-A41D-BAD04B3054CC.jpg?v=1743589612",
    "description": "THE ULTIMATE SLEEK STICK\nSLEEK &amp; TREAT - literally! The very first keratin oil infused hair stick! Enriched with jojoba oil &amp; Camellia oil to ..."
  },
  {
    "id": 10118111592732,
    "name": "Marinate Hydration Mask",
    "price": "$35.00 AUD",
    "image": "https://cdn.shopify.com/s/files/1/0718/7949/1868/files/IMG-5577.jpg?v=1743589503",
    "description": "SOFT AF HAIR MASK🤌\n RESTORE NOURISHMENT AND JAWDROPPING SHINE WITH OUR INTENSE HYDRATION MASK!\nOUR WATERMELON SCENT. PLANT BASED TREAMENT MASK THAT W..."
  },
  {
    "id": 10054091604252,
    "name": "Manifest Growth Spray",
    "price": "$31.00 AUD",
    "image": "https://cdn.shopify.com/s/files/1/0718/7949/1868/files/6F249ED9-E6C3-4809-A752-44B42CC2D3CF.jpg?v=1743589209",
    "description": "LETS GROW BBY! Perfect for bringing life back into your Ponytail or Hair Extensions!\nBB Sleeks manifest growth spray has been carefully &amp; intuitiv..."
  },
  {
    "id": 9981407363356,
    "name": "Smooth me Brush",
    "price": "$28.00 AUD",
    "image": "https://cdn.shopify.com/s/files/1/0718/7949/1868/files/5DD054B7-5B72-411B-BC61-75C2DD730E06.jpg?v=1733449944",
    "description": " \nPsssst! This is your match made in HEAVEN!\nTHE SMOOTH ME BRUSH // FR SLEEK SLAY EVERYDAY\n \nYour actual staple brush, sis she means business!The soft..."
  }
];

  const accessoryProducts = [
  {
    "id": 10147265773852,
    "name": "Gift Cards",
    "price": "$10.00 AUD",
    "image": "https://cdn.shopify.com/s/files/1/0718/7949/1868/files/LogoPNG_02062f80-03de-40a9-8ad7-ae3e55a338db.png?v=1730187238",
    "description": "🎁 Bad &amp; Boujee Hair Digital Gift Card\n\nThe perfect gift for every slay.\nNot sure which pony to pick? Let them choose their perfect style, shade, ..."
  },
  {
    "id": 10054096355612,
    "name": "BB Detangle",
    "price": "$32.00 AUD",
    "image": "https://cdn.shopify.com/s/files/1/0718/7949/1868/files/3BD50673-E495-427B-8FF2-5A81054821B5.jpg?v=1743589185",
    "description": "TANGLE-FREE HAIR DAILY!\n\nIf repunzel had one brush request - BB DETANGLE would be it! Be ready for this to become your staple with her effortlessly de..."
  },
  {
    "id": 10009093603612,
    "name": "Annie Full Lace Wig 30”",
    "price": "$100.00 AUD",
    "image": "https://cdn.shopify.com/s/files/1/0718/7949/1868/files/Annie_full_lace_wig.jpg?v=1735885210",
    "description": "Please allow 1 week for this week if ordered in January ..."
  },
  {
    "id": 9973998092572,
    "name": "Bad & Boujee Silk Protective Bag",
    "price": "$10.00 AUD",
    "image": "https://cdn.shopify.com/s/files/1/0718/7949/1868/files/995DDB09-A492-4964-888B-7CD963C8A666.png?v=1744078182",
    "description": "The perfect addition to your new Bad &amp; Boujee Ponytail, Extension or Wig. These silk protective bags will become your new storage or travel bestie..."
  }
];

  return (
    <div className="min-h-screen">
      <Header />
      <ShoppingCart />
      <HeroSlider />
      <ProductSection title="Ponytails" products={ponytailProducts} id="ponytails" />
      <ProductSection title="Clip-In Extensions" products={clipinProducts} id="clipins" />
      <ProductSection title="Hair Care" products={haircareProducts} id="haircare" />
      <ProductSection title="Accessories" products={accessoryProducts} id="accessories" />
      <BookingSection />
      <TargetMarket />
      <SocialFeed />
      <Footer />
      
      {/* React Bits Floating Notification */}
      <FloatingNotification
        show={showNotification}
        onClose={() => setShowNotification(false)}
        type="purchase"
        customerName="Emma K."
        productName="36” The Baddest Pony - Straight"
        location="Melbourne"
        timeAgo="3 minutes ago"
      />
      
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
