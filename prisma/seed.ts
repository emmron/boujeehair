import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@badboujee.com' },
    update: {},
    create: {
      email: 'admin@badboujee.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
      phone: '+61400000000'
    }
  });

  console.log('✅ Admin user created:', adminUser.email);

  // Create demo customer
  const customerPassword = await bcrypt.hash('customer123', 10);
  
  const demoCustomer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      name: 'Sarah Johnson',
      password: customerPassword,
      role: 'CUSTOMER',
      phone: '+61411111111'
    }
  });

  console.log('✅ Demo customer created:', demoCustomer.email);

  // Create categories
  const categories = [
    {
      name: 'Ponytail Extensions',
      description: 'Premium ponytail hair extensions',
      slug: 'ponytail-extensions'
    },
    {
      name: 'Clip-In Extensions',
      description: 'Easy to use clip-in hair extensions',
      slug: 'clip-in-extensions'
    },
    {
      name: 'Hair Care',
      description: 'Professional hair care products',
      slug: 'hair-care'
    },
    {
      name: 'Accessories',
      description: 'Hair accessories and styling tools',
      slug: 'accessories'
    },
    {
      name: 'Wigs',
      description: 'Premium quality wigs',
      slug: 'wigs'
    }
  ];

  for (const category of categories) {
    const created = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category
    });
    console.log('✅ Category created:', created.name);
  }

  // Create services for booking system
  const services = [
    {
      name: 'Hair Extension Consultation',
      description: 'Professional consultation for hair extension selection and styling',
      duration: 30,
      price: 50.0,
      category: 'Consultation'
    },
    {
      name: 'Clip-In Extension Styling Session',
      description: 'Learn how to style and maintain your clip-in extensions',
      duration: 60,
      price: 80.0,
      category: 'Styling'
    },
    {
      name: 'Wig Consultation & Fitting',
      description: 'Personal wig consultation and professional fitting',
      duration: 45,
      price: 70.0,
      category: 'Consultation'
    },
    {
      name: 'Hair Care Workshop',
      description: 'Learn proper hair care techniques for extensions and natural hair',
      duration: 90,
      price: 120.0,
      category: 'Education'
    },
    {
      name: 'Color Matching Service',
      description: 'Professional color matching for perfect extension blending',
      duration: 20,
      price: 30.0,
      category: 'Consultation'
    }
  ];

  for (const service of services) {
    const existing = await prisma.service.findFirst({
      where: { name: service.name }
    });
    
    if (!existing) {
      const created = await prisma.service.create({
        data: service
      });
      console.log('✅ Service created:', created.name);
    } else {
      console.log('⏭️ Service already exists:', existing.name);
    }
  }

  // Create sample products from existing data
  const ponytailCategory = await prisma.category.findUnique({
    where: { slug: 'ponytail-extensions' }
  });

  const clipinCategory = await prisma.category.findUnique({
    where: { slug: 'clip-in-extensions' }
  });

  const haircareCategory = await prisma.category.findUnique({
    where: { slug: 'hair-care' }
  });

  const sampleProducts = [
    {
      name: '36" The Baddest Pony - Straight',
      description: 'Premium 36-inch straight ponytail extension in various colors',
      price: 80.0,
      stock: 25,
      sku: '36S-BADDEST',
      categoryId: ponytailCategory?.id,
      featured: true,
      images: JSON.stringify(['https://cdn.shopify.com/s/files/1/0718/7949/1868/files/D4F726D3-83A3-47AB-9DD6-6AEDAD525021.jpg']),
      metadata: JSON.stringify({
        tags: ['36inch', 'Baddest', 'Ponytail'],
        colors: ['Black', 'Dark Brown', 'Baby Blonde', 'Brown to Blonde', 'Blonde to White']
      })
    },
    {
      name: '24" Hello Halo',
      description: 'Premium 24-inch halo hair extension for instant volume',
      price: 100.0,
      stock: 15,
      sku: 'HALO24-HELLO',
      categoryId: clipinCategory?.id,
      featured: true,
      images: JSON.stringify(['https://cdn.shopify.com/s/files/1/0718/7949/1868/files/IMG-5936.jpg']),
      metadata: JSON.stringify({
        tags: ['24inch', 'Halo', 'ClipIn'],
        colors: ['Black', 'Dark Brown', 'Bleach Blonde', 'Mixed Brown']
      })
    },
    {
      name: 'Sleek Stick',
      description: 'Professional hair styling stick for sleek, smooth finishes',
      price: 21.0,
      stock: 50,
      sku: 'SLEEK-STICK',
      categoryId: haircareCategory?.id,
      images: JSON.stringify(['https://cdn.shopify.com/s/files/1/0718/7949/1868/files/A1744259-2A01-4CDC-A41D-BAD04B3054CC.jpg']),
      metadata: JSON.stringify({
        tags: ['Styling', 'Hair Care'],
        type: 'Styling Product'
      })
    },
    {
      name: 'Marinate Hydration Mask',
      description: 'Deep conditioning hydration mask for extensions and natural hair',
      price: 35.0,
      stock: 30,
      sku: 'HYDRO-MASK',
      categoryId: haircareCategory?.id,
      images: JSON.stringify(['https://cdn.shopify.com/s/files/1/0718/7949/1868/files/IMG-5577.jpg']),
      metadata: JSON.stringify({
        tags: ['Hair Care', 'Hydration'],
        type: 'Treatment'
      })
    }
  ];

  for (const product of sampleProducts) {
    const created = await prisma.product.upsert({
      where: { sku: product.sku },
      update: {},
      create: product
    });
    console.log('✅ Product created:', created.name);
  }

  // Create sample orders
  const hairConsultationService = await prisma.service.findFirst({
    where: { name: 'Hair Extension Consultation' }
  });

  if (hairConsultationService) {
    const sampleBooking = await prisma.booking.create({
      data: {
        userId: demoCustomer.id,
        serviceId: hairConsultationService.id,
        customerName: demoCustomer.name,
        customerEmail: demoCustomer.email,
        customerPhone: demoCustomer.phone || '+61411111111',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        timeSlot: '10:00 AM',
        status: 'CONFIRMED',
        notes: 'First time customer, interested in ponytail extensions'
      }
    });
    console.log('✅ Sample booking created');
  }

  // Create sample order
  const sampleProduct = await prisma.product.findFirst({
    where: { sku: '36S-BADDEST' }
  });

  if (sampleProduct) {
    const orderNumber = `BB${Date.now()}`;
    const sampleOrder = await prisma.order.create({
      data: {
        orderNumber,
        userId: demoCustomer.id,
        customerEmail: demoCustomer.email,
        customerName: demoCustomer.name,
        customerPhone: demoCustomer.phone,
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        subtotal: 80.0,
        tax: 8.0,
        shipping: 10.0,
        total: 98.0,
        shippingAddress: JSON.stringify({
          address: '123 Hair Street',
          city: 'Sydney',
          state: 'NSW',
          postcode: '2000',
          country: 'Australia'
        }),
        items: {
          create: {
            productId: sampleProduct.id,
            quantity: 1,
            price: 80.0
          }
        }
      }
    });
    console.log('✅ Sample order created:', orderNumber);
  }

  // Create settings
  const settings = [
    { key: 'business_name', value: 'Bad & Boujee Hair', type: 'string' },
    { key: 'business_email', value: 'contact@badboujee.com', type: 'string' },
    { key: 'business_phone', value: '+61400000000', type: 'string' },
    { key: 'business_address', value: '123 Beauty Lane, Sydney NSW 2000', type: 'string' },
    { key: 'tax_rate', value: '0.10', type: 'number' },
    { key: 'currency', value: 'AUD', type: 'string' },
    { key: 'booking_time_slots', value: JSON.stringify([
      '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
      '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
    ]), type: 'json' }
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting
    });
    console.log('✅ Setting created:', setting.key);
  }

  console.log('🎉 Seed completed successfully!');
  console.log('');
  console.log('📝 Admin Login Credentials:');
  console.log('Email: admin@badboujee.com');
  console.log('Password: admin123');
  console.log('');
  console.log('👤 Demo Customer Credentials:');
  console.log('Email: customer@example.com');
  console.log('Password: customer123');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });