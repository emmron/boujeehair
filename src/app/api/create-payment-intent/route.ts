import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// DEMO MODE: Works immediately without Stripe setup (like WordPress!)
const isDemoMode = !process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('demo');

let stripe: any = null;
if (!isDemoMode) {
  const Stripe = require('stripe');
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-06-20',
  });
}

export async function POST(request: NextRequest) {
  try {
    const { items, customerInfo, shippingAddress, billingAddress } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Items are required' },
        { status: 400 }
      );
    }

    if (!customerInfo || !customerInfo.email || !customerInfo.name) {
      return NextResponse.json(
        { error: 'Customer information is required' },
        { status: 400 }
      );
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });

      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.productId}` },
          { status: 400 }
        );
      }

      if (!product.active) {
        return NextResponse.json(
          { error: `Product is not available: ${product.name}` },
          { status: 400 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for: ${product.name}` },
          { status: 400 }
        );
      }

      const price = product.salePrice || product.price;
      const itemTotal = price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: product.id,
        name: product.name,
        price: price,
        quantity: item.quantity,
        total: itemTotal
      });
    }

    // Calculate tax and shipping
    const taxRate = 0.10; // 10% tax
    const tax = subtotal * taxRate;
    const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const total = subtotal + tax + shipping;

    // Create payment intent (demo mode or real Stripe)
    let paymentIntent: any;
    
    if (isDemoMode) {
      // DEMO MODE: Create mock payment intent
      paymentIntent = {
        id: `pi_demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        client_secret: `pi_demo_${Date.now()}_secret_demo_${Math.random().toString(36).substr(2, 9)}`,
        amount: Math.round(total * 100),
        currency: 'aud',
        status: 'requires_payment_method'
      };
    } else {
      // REAL STRIPE MODE
      paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(total * 100), // Stripe uses cents
        currency: 'aud',
        metadata: {
          customerEmail: customerInfo.email,
          customerName: customerInfo.name,
          itemsCount: items.length.toString(),
          subtotal: subtotal.toString(),
          tax: tax.toString(),
          shipping: shipping.toString(),
          total: total.toString()
        }
      });
    }

    // Store order in database with PENDING status
    const orderNumber = `BB${Date.now()}`;
    
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerEmail: customerInfo.email,
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone || null,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        paymentId: paymentIntent.id,
        subtotal,
        tax,
        shipping,
        total,
        shippingAddress: shippingAddress ? JSON.stringify(shippingAddress) : null,
        billingAddress: billingAddress ? JSON.stringify(billingAddress) : null,
        items: {
          create: orderItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      }
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      orderId: order.id,
      orderNumber: order.orderNumber,
      total: total,
      demoMode: isDemoMode,
      breakdown: {
        subtotal,
        tax,
        shipping,
        total
      }
    });

  } catch (error) {
    console.error('Payment intent creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}