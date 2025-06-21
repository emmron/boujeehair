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
import MarkdownViewer from '@/components/MarkdownViewer';
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

  // Fresh Bad Boujee Hair Products from Python Scraper (2025-06-21T10:31:33.703917)
  const ponytailProducts = [
  {
    "id": 10123160322332,
    "name": "36” The Baddest Pony - Straight",
    "price": "$80.00 AUD",
    "image": "https://cdn.shopify.com/s/files/1/0718/7949/1868/files/D4F726D3-83A3-47AB-9DD6-6AEDAD525021.jpg?v=1744030280",
    "description": "Premium quality hair extension from Bad Boujee Hair.",
    "handle": "untitled-apr7_20-48",
    "vendor": "Bad&BoujeeHair",
    "product_type": "Ponytail Extension",
    "tags": [
      "36inch",
      "Baddest",
      "Ponytail"
    ],
    "variants": [
      {
        "id": 51627235410204,
        "title": "Black",
        "price": "80.00",
        "compare_at_price": null,
        "sku": "36S.1B",
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 51627235442972,
        "title": "Dark Brown",
        "price": "80.00",
        "compare_at_price": null,
        "sku": "36.S.4",
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 51627235475740,
        "title": "Baby Blonde",
        "price": "80.00",
        "compare_at_price": null,
        "sku": "36.S.BABYB",
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 51627235508508,
        "title": "Brown to Blonde",
        "price": "80.00",
        "compare_at_price": null,
        "sku": "36.S.T227613",
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 51627235541276,
        "title": "Blonde to White",
        "price": "80.00",
        "compare_at_price": null,
        "sku": "36.S.10360",
        "inventory_quantity": null,
        "available": true
      }
    ],
    "created_at": "2025-04-07T20:48:09+08:00",
    "available": null
  },
  {
    "id": 10016394674460,
    "name": "Drawstring Bun",
    "price": "$80.00 AUD",
    "image": "https://cdn.shopify.com/s/files/1/0718/7949/1868/files/A1A920D5-031B-40A0-BA39-26D06AE1CC64.png?v=1744077790",
    "description": "Premium quality hair extension from Bad Boujee Hair.",
    "handle": "ponytail-bun",
    "vendor": "Bad&BoujeeHair",
    "product_type": "Ponytail Extension",
    "tags": [
      "Buns",
      "Ponytail"
    ],
    "variants": [
      {
        "id": 51019496882460,
        "title": "Black",
        "price": "80.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 51019496915228,
        "title": "Dark Brown",
        "price": "80.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 51019496947996,
        "title": "Brown to Light Brown",
        "price": "80.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": false
      },
      {
        "id": 51019496980764,
        "title": "Sand Blonde",
        "price": "80.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 51019497013532,
        "title": "Brown to Blonde",
        "price": "80.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 51019560550684,
        "title": "Silver",
        "price": "80.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 51025241080092,
        "title": "Dark Red",
        "price": "80.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": true
      }
    ],
    "created_at": "2025-01-09T11:35:31+08:00",
    "available": null
  },
  {
    "id": 10009148490012,
    "name": "20” Straight Up Ponytail",
    "price": "$80.00 AUD",
    "image": "https://cdn.shopify.com/s/files/1/0718/7949/1868/files/Straight_Up_Ponytail_20.jpg?v=1735890078",
    "description": "Premium quality hair extension from Bad Boujee Hair.",
    "handle": "straight-up-ponytail-20",
    "vendor": "Bad&BoujeeHair",
    "product_type": "Ponytail Extension",
    "tags": [
      "20straight",
      "Ponytail"
    ],
    "variants": [
      {
        "id": 50978443297052,
        "title": "Black",
        "price": "80.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 50978443329820,
        "title": "Dark Brown",
        "price": "80.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 50978443362588,
        "title": "Chocolate Brown",
        "price": "80.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 50978443395356,
        "title": "Light Brown",
        "price": "80.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": false
      },
      {
        "id": 50978443428124,
        "title": "Brown Light Brown",
        "price": "80.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": false
      },
      {
        "id": 50978443460892,
        "title": "Brown Caramel",
        "price": "80.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 50978443493660,
        "title": "Brown Blonde",
        "price": "80.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": false
      },
      {
        "id": 50978443526428,
        "title": "Sand Blonde",
        "price": "80.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 50978443559196,
        "title": "Mixed Blonde",
        "price": "80.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": false
      },
      {
        "id": 50978443591964,
        "title": "Bleach Blonde",
        "price": "80.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 50978443624732,
        "title": "Blonde White",
        "price": "80.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 50978443690268,
        "title": "Red",
        "price": "80.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 50978443723036,
        "title": "Auburn",
        "price": "80.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": false
      }
    ],
    "created_at": "2025-01-03T13:39:46+08:00",
    "available": null
  },
  {
    "id": 10009152717084,
    "name": "20” I’m So Wavy Ponytail",
    "price": "$80.00 AUD",
    "image": "https://cdn.shopify.com/s/files/1/0718/7949/1868/files/I_m_So_Wavy_Ponytail_20.jpg?v=1735889860",
    "description": "Premium quality hair extension from Bad Boujee Hair.",
    "handle": "i-m-so-wavy-ponytail-20",
    "vendor": "Bad&BoujeeHair",
    "product_type": "Ponytail Extension",
    "tags": [
      "20wavy",
      "Ponytail"
    ],
    "variants": [
      {
        "id": 50978496282908,
        "title": "Black",
        "price": "80.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 50978496315676,
        "title": "Dark Brown",
        "price": "80.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 50978496348444,
        "title": "Chocolate Brown",
        "price": "80.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 50978496381212,
        "title": "Light Brown",
        "price": "80.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 50978496413980,
        "title": "Brown Light Brown",
        "price": "80.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 50978496446748,
        "title": "Brown Caramel",
        "price": "80.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 50978496479516,
        "title": "Brown Blonde",
        "price": "80.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 50978496512284,
        "title": "Sand Blonde",
        "price": "80.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 50978496545052,
        "title": "Bleach Blonde",
        "price": "80.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 50978496577820,
        "title": "Mixed Blonde",
        "price": "80.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 50978496610588,
        "title": "Red",
        "price": "80.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 50978496643356,
        "title": "Black Silver",
        "price": "80.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": false
      }
    ],
    "created_at": "2025-01-03T13:57:18+08:00",
    "available": null
  }
];

  const clipinProducts = [
  {
    "id": 10123373576476,
    "name": "24” Hello Halo",
    "price": "$100.00 AUD",
    "image": "https://cdn.shopify.com/s/files/1/0718/7949/1868/files/IMG-5936.jpg?v=1744052381",
    "description": "Premium quality hair extension from Bad Boujee Hair.",
    "handle": "heavenly-halo-24",
    "vendor": "Bad&BoujeeHair",
    "product_type": "Clip In Extensions",
    "tags": [],
    "variants": [
      {
        "id": 51628656263452,
        "title": "Black",
        "price": "100.00",
        "compare_at_price": "100.00",
        "sku": "HALO1B",
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 51628668911900,
        "title": "Almost Black",
        "price": "100.00",
        "compare_at_price": "100.00",
        "sku": "HALO2",
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 51628668944668,
        "title": "Dark Brown",
        "price": "100.00",
        "compare_at_price": "100.00",
        "sku": "HALO4",
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 51628668977436,
        "title": "Choc Brown",
        "price": "100.00",
        "compare_at_price": "100.00",
        "sku": "HALO6",
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 51628669010204,
        "title": "Bleach Blonde",
        "price": "100.00",
        "compare_at_price": "100.00",
        "sku": "HALO613",
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 51628669042972,
        "title": "Champ Blonde",
        "price": "100.00",
        "compare_at_price": "100.00",
        "sku": "HALOCHAMP",
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 51628669075740,
        "title": "AshBrown Honey",
        "price": "100.00",
        "compare_at_price": "100.00",
        "sku": "HALOASHBH",
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 51628669108508,
        "title": "Brown Light Brown",
        "price": "100.00",
        "compare_at_price": "100.00",
        "sku": "HALOBROWNLIGHT",
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 51628669141276,
        "title": "Mixed Brown",
        "price": "100.00",
        "compare_at_price": "100.00",
        "sku": "HALOMIXED",
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 51628669174044,
        "title": "Toffee",
        "price": "100.00",
        "compare_at_price": "100.00",
        "sku": "HALOTOFFEE",
        "inventory_quantity": null,
        "available": true
      }
    ],
    "created_at": "2025-04-08T02:40:36+08:00",
    "available": null
  },
  {
    "id": 10123361681692,
    "name": "24” Loose Curl Clip In",
    "price": "$100.00 AUD",
    "image": "https://cdn.shopify.com/s/files/1/0718/7949/1868/files/48BBBFA5-BB94-4A4E-A833-EC1A09D3B1F8.jpg?v=1744049669",
    "description": "Premium quality hair extension from Bad Boujee Hair.",
    "handle": "lux-clip-in-set-24-loose-curl",
    "vendor": "Bad&BoujeeHair",
    "product_type": "",
    "tags": [
      "Clip In"
    ],
    "variants": [
      {
        "id": 51628607078684,
        "title": "Black",
        "price": "100.00",
        "compare_at_price": null,
        "sku": "24CCL.1B",
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 51628607111452,
        "title": "Dark Brown",
        "price": "100.00",
        "compare_at_price": null,
        "sku": "24CCL.4",
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 51628609536284,
        "title": "Mixed Blonde",
        "price": "100.00",
        "compare_at_price": null,
        "sku": "24CCL.22H60",
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 51628611633436,
        "title": "Champagne Blonde",
        "price": "100.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 51628613402908,
        "title": "Sand Blonde",
        "price": "100.00",
        "compare_at_price": null,
        "sku": "24CCL.K16",
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 51628624347420,
        "title": "Bleach Blonde",
        "price": "100.00",
        "compare_at_price": null,
        "sku": "24CCL.613",
        "inventory_quantity": null,
        "available": true
      }
    ],
    "created_at": "2025-04-08T02:13:03+08:00",
    "available": null
  },
  {
    "id": 10009030721820,
    "name": "Clip In Fringe",
    "price": "$20.00 AUD",
    "image": "https://cdn.shopify.com/s/files/1/0718/7949/1868/files/clipinfringes.jpg?v=1744077058",
    "description": "Premium quality hair extension from Bad Boujee Hair.",
    "handle": "clip-in-fringe",
    "vendor": "Bad&BoujeeHair",
    "product_type": "Clip In Extensions",
    "tags": [
      "Clip In",
      "Fringe"
    ],
    "variants": [
      {
        "id": 50977114685724,
        "title": "Black",
        "price": "20.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 50977114718492,
        "title": "Dark Brown",
        "price": "20.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 50977114751260,
        "title": "Brown to Light Brown",
        "price": "20.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 50977114784028,
        "title": "Sand Blonde",
        "price": "20.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 50977114816796,
        "title": "Brown to Blonde",
        "price": "20.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": true
      }
    ],
    "created_at": "2025-01-03T07:19:38+08:00",
    "available": null
  },
  {
    "id": 8135032275228,
    "name": "24” Lux Clip In Set Straight",
    "price": "$100.00 AUD",
    "image": "https://cdn.shopify.com/s/files/1/0718/7949/1868/files/black_1B_490d0f93-5b86-4498-8add-fa43e0484307.jpg?v=1730511618",
    "description": "Premium quality hair extension from Bad Boujee Hair.",
    "handle": "human-hair-clip-ins-20",
    "vendor": "Bad&BoujeeHair",
    "product_type": "Clip In Extensions",
    "tags": [
      "Clip In",
      "Hair Extensions"
    ],
    "variants": [
      {
        "id": 44756676378908,
        "title": "Black",
        "price": "100.00",
        "compare_at_price": null,
        "sku": "24CY.1B",
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 49583738421532,
        "title": "Dark Brown",
        "price": "100.00",
        "compare_at_price": null,
        "sku": "24CY.4",
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 49583738454300,
        "title": "Choc Brown",
        "price": "100.00",
        "compare_at_price": null,
        "sku": "24CY.6",
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 49583738487068,
        "title": "Light Brown",
        "price": "100.00",
        "compare_at_price": null,
        "sku": "24CY.10",
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 49583738519836,
        "title": "Sand Blonde",
        "price": "100.00",
        "compare_at_price": null,
        "sku": "24CY.K16",
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 49709889847580,
        "title": "Bleach Blonde",
        "price": "100.00",
        "compare_at_price": null,
        "sku": "24CL.613",
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 50477689274652,
        "title": "Mixed Blonde",
        "price": "100.00",
        "compare_at_price": null,
        "sku": "24CY.22H60",
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 50477689307420,
        "title": "DarkBrown / Caramel",
        "price": "100.00",
        "compare_at_price": null,
        "sku": "24CY.T227",
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 50477689340188,
        "title": "Dark Brown / Bleach Blonde",
        "price": "100.00",
        "compare_at_price": null,
        "sku": "24CY.4.613",
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 50477689372956,
        "title": "Copper / Blonde",
        "price": "100.00",
        "compare_at_price": null,
        "sku": "24CY.350.613",
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 50477689405724,
        "title": "Ash Blonde",
        "price": "100.00",
        "compare_at_price": null,
        "sku": "24.ASHB",
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 50477689438492,
        "title": "Brown / Copper",
        "price": "100.00",
        "compare_at_price": null,
        "sku": "24.BRWN COP",
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 50477689471260,
        "title": "Brown Ombre",
        "price": "100.00",
        "compare_at_price": null,
        "sku": "24CY-T1B30",
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 50477689504028,
        "title": "Blonde / white",
        "price": "100.00",
        "compare_at_price": null,
        "sku": "27- 10360",
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 50477689536796,
        "title": "Toffee",
        "price": "100.00",
        "compare_at_price": null,
        "sku": "28TOFFEE",
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 50477700940060,
        "title": "Browns / Blonde",
        "price": "100.00",
        "compare_at_price": null,
        "sku": "24CY.T227613",
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 50477700972828,
        "title": "Baby Blondee",
        "price": "100.00",
        "compare_at_price": null,
        "sku": "24CY.BABYB",
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 50477701005596,
        "title": "Champ Blonde",
        "price": "100.00",
        "compare_at_price": null,
        "sku": "24CY.CHAMP",
        "inventory_quantity": null,
        "available": true
      }
    ],
    "created_at": "2023-03-02T18:08:15+08:00",
    "available": null
  }
];

  const haircareProducts = [
  {
    "id": 10118133023004,
    "name": "Sleek Stick",
    "price": "$21.00 AUD",
    "image": "https://cdn.shopify.com/s/files/1/0718/7949/1868/files/A1744259-2A01-4CDC-A41D-BAD04B3054CC.jpg?v=1743589612",
    "description": "Premium quality hair extension from Bad Boujee Hair.",
    "handle": "sleek-stick",
    "vendor": "Bad&BoujeeHair",
    "product_type": "",
    "tags": [
      "Wig Care"
    ],
    "variants": [
      {
        "id": 51596156797212,
        "title": "Default Title",
        "price": "21.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": true
      }
    ],
    "created_at": "2025-04-02T18:25:19+08:00",
    "available": null
  },
  {
    "id": 10118111592732,
    "name": "Marinate Hydration Mask",
    "price": "$35.00 AUD",
    "image": "https://cdn.shopify.com/s/files/1/0718/7949/1868/files/IMG-5577.jpg?v=1743589503",
    "description": "Premium quality hair extension from Bad Boujee Hair.",
    "handle": "marinate-hydration-mask",
    "vendor": "Bad&BoujeeHair",
    "product_type": "",
    "tags": [
      "Wig Care"
    ],
    "variants": [
      {
        "id": 51596098175260,
        "title": "Default Title",
        "price": "35.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": true
      }
    ],
    "created_at": "2025-04-02T18:20:34+08:00",
    "available": null
  },
  {
    "id": 10054091604252,
    "name": "Manifest Growth Spray",
    "price": "$31.00 AUD",
    "image": "https://cdn.shopify.com/s/files/1/0718/7949/1868/files/6F249ED9-E6C3-4809-A752-44B42CC2D3CF.jpg?v=1743589209",
    "description": "Premium quality hair extension from Bad Boujee Hair.",
    "handle": "manifest-growth-spray",
    "vendor": "Bad&BoujeeHair",
    "product_type": "",
    "tags": [
      "Wig Care"
    ],
    "variants": [
      {
        "id": 51213652623644,
        "title": "Default Title",
        "price": "31.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": true
      }
    ],
    "created_at": "2025-02-07T12:06:06+08:00",
    "available": null
  },
  {
    "id": 9981407363356,
    "name": "Smooth me Brush",
    "price": "$28.00 AUD",
    "image": "https://cdn.shopify.com/s/files/1/0718/7949/1868/files/5DD054B7-5B72-411B-BC61-75C2DD730E06.jpg?v=1733449944",
    "description": "Premium quality hair extension from Bad Boujee Hair.",
    "handle": "smooth-me-brush",
    "vendor": "Bad&BoujeeHair",
    "product_type": "",
    "tags": [],
    "variants": [
      {
        "id": 50798587052316,
        "title": "Default Title",
        "price": "28.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": true
      }
    ],
    "created_at": "2024-12-06T09:50:45+08:00",
    "available": null
  }
];

  const accessoryProducts = [
  {
    "id": 10147265773852,
    "name": "Gift Cards",
    "price": "$10.00 AUD",
    "image": "https://cdn.shopify.com/s/files/1/0718/7949/1868/files/LogoPNG_02062f80-03de-40a9-8ad7-ae3e55a338db.png?v=1730187238",
    "description": "Premium quality hair extension from Bad Boujee Hair.",
    "handle": "untitled-may1_23-03",
    "vendor": "Bad&BoujeeHair",
    "product_type": "",
    "tags": [],
    "variants": [
      {
        "id": 51775964479772,
        "title": "$10.00",
        "price": "10.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 51775964512540,
        "title": "$25.00",
        "price": "25.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 51775964545308,
        "title": "$50.00",
        "price": "50.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 51775964578076,
        "title": "$100.00",
        "price": "100.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": true
      }
    ],
    "created_at": "2025-05-01T23:03:59+08:00",
    "available": null
  },
  {
    "id": 10054096355612,
    "name": "BB Detangle",
    "price": "$32.00 AUD",
    "image": "https://cdn.shopify.com/s/files/1/0718/7949/1868/files/3BD50673-E495-427B-8FF2-5A81054821B5.jpg?v=1743589185",
    "description": "Premium quality hair extension from Bad Boujee Hair.",
    "handle": "bb-detangle",
    "vendor": "Bad&BoujeeHair",
    "product_type": "",
    "tags": [
      "Hair Extensions",
      "Ponytail",
      "Wig Care"
    ],
    "variants": [
      {
        "id": 51213682475292,
        "title": "Default Title",
        "price": "32.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": true
      }
    ],
    "created_at": "2025-02-07T12:09:49+08:00",
    "available": null
  },
  {
    "id": 9973998092572,
    "name": "Bad & Boujee Silk Protective Bag",
    "price": "$10.00 AUD",
    "image": "https://cdn.shopify.com/s/files/1/0718/7949/1868/files/995DDB09-A492-4964-888B-7CD963C8A666.png?v=1744078182",
    "description": "Premium quality hair extension from Bad Boujee Hair.",
    "handle": "bad-boujee-silk-protective-bag",
    "vendor": "Bad&BoujeeHair",
    "product_type": "Silk Bag",
    "tags": [
      "Silk",
      "Wig Care"
    ],
    "variants": [
      {
        "id": 50743024255260,
        "title": "Default Title",
        "price": "10.00",
        "compare_at_price": null,
        "sku": "SILKBAG",
        "inventory_quantity": null,
        "available": true
      }
    ],
    "created_at": "2024-11-27T14:56:06+08:00",
    "available": null
  },
  {
    "id": 9892940742940,
    "name": "Bad & Boujee Gift Cards",
    "price": "$70.00 AUD",
    "image": "https://cdn.shopify.com/s/files/1/0718/7949/1868/files/LogoPNG.png?v=1728899830",
    "description": "Premium quality hair extension from Bad Boujee Hair.",
    "handle": "bad-boujee-gift-cards",
    "vendor": "Bad&BoujeeHair",
    "product_type": "Gift Cards",
    "tags": [
      "Gift Cards"
    ],
    "variants": [
      {
        "id": 50382560002332,
        "title": "$70.00",
        "price": "70.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 50382560035100,
        "title": "$90.00",
        "price": "90.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 50382560067868,
        "title": "$110.00",
        "price": "110.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 50382560100636,
        "title": "$200.00",
        "price": "200.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": true
      }
    ],
    "created_at": "2024-10-14T18:03:41+08:00",
    "available": null
  }
];

  const wigProducts = [
  {
    "id": 10009093603612,
    "name": "Annie Full Lace Wig 30”",
    "price": "$100.00 AUD",
    "image": "https://cdn.shopify.com/s/files/1/0718/7949/1868/files/Annie_full_lace_wig.jpg?v=1735885210",
    "description": "Premium quality hair extension from Bad Boujee Hair.",
    "handle": "annie-full-lace-wig-30",
    "vendor": "Bad&BoujeeHair",
    "product_type": "",
    "tags": [
      "Wig Care",
      "Wigs"
    ],
    "variants": [
      {
        "id": 50977768866076,
        "title": "1. Black",
        "price": "100.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 50977768898844,
        "title": "2. Dark Brown / Auburn",
        "price": "100.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 50977768931612,
        "title": "3. Light Brown / Blonde",
        "price": "100.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 50977768964380,
        "title": "Brown to Blonde",
        "price": "100.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 50977768997148,
        "title": "5.Brown / Champagne Blonde",
        "price": "100.00",
        "compare_at_price": null,
        "sku": null,
        "inventory_quantity": null,
        "available": true
      }
    ],
    "created_at": "2025-01-03T10:21:12+08:00",
    "available": null
  },
  {
    "id": 10009008406812,
    "name": "Bonny Full Lace Wig 26”",
    "price": "$100.00 AUD",
    "image": "https://cdn.shopify.com/s/files/1/0718/7949/1868/files/Bonnie_full_lace_wig.jpg?v=1735888333",
    "description": "Premium quality hair extension from Bad Boujee Hair.",
    "handle": "bonny-full-lace-wig-26",
    "vendor": "Bad&BoujeeHair",
    "product_type": "Wigs",
    "tags": [
      "Wig Care",
      "Wigs"
    ],
    "variants": [
      {
        "id": 50977062322460,
        "title": "1. Black",
        "price": "100.00",
        "compare_at_price": "0.00",
        "sku": null,
        "inventory_quantity": null,
        "available": false
      },
      {
        "id": 50977062355228,
        "title": "3. Light Brown / Blonde",
        "price": "100.00",
        "compare_at_price": "0.00",
        "sku": null,
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 50977062387996,
        "title": "2. Dark Brown / Auburn",
        "price": "100.00",
        "compare_at_price": "0.00",
        "sku": null,
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 50977062420764,
        "title": "4. Brown / Blonde",
        "price": "100.00",
        "compare_at_price": "0.00",
        "sku": null,
        "inventory_quantity": null,
        "available": true
      },
      {
        "id": 50977062453532,
        "title": "5.Brown / Champagne Blonde",
        "price": "100.00",
        "compare_at_price": "0.00",
        "sku": null,
        "inventory_quantity": null,
        "available": true
      }
    ],
    "created_at": "2025-01-03T07:06:12+08:00",
    "available": null
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
      {wigProducts.length > 0 && (
        <ProductSection title="Wigs" products={wigProducts} id="wigs" />
      )}
      <BookingSection />
      <TargetMarket />
      
      {/* Documentation Section */}
      <section className="py-16 bg-gradient-to-br from-pink-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Website Documentation
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore comprehensive documentation and data from our website, including product catalogs, site information, and image galleries.
            </p>
          </div>
          <div className="max-w-6xl mx-auto">
            <MarkdownViewer title="Bad Boujee Hair Documentation" />
          </div>
        </div>
      </section>
      
      <SocialFeed />
      <Footer />
      
      {/* React Bits Floating Notification */}
      <FloatingNotification
        show={showNotification}
        onClose={() => setShowNotification(false)}
        type="purchase"
        customerName="Sarah K."
        productName="36” The Baddest Pony - Straight"
        location="Sydney"
        timeAgo="2 minutes ago"
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
