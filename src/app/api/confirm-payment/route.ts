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
    const { paymentIntentId, orderId } = await request.json();

    if (!paymentIntentId || !orderId) {
      return NextResponse.json(
        { error: 'Payment intent ID and order ID are required' },
        { status: 400 }
      );
    }

    // Verify payment intent (demo mode or real Stripe)
    if (!isDemoMode) {
      // REAL STRIPE MODE: Verify with Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status !== 'succeeded') {
        return NextResponse.json(
          { error: 'Payment not successful' },
          { status: 400 }
        );
      }
    } else {
      // DEMO MODE: Auto-approve payment (like WordPress demo)
      console.log(`🎯 DEMO MODE: Auto-approving payment ${paymentIntentId}`);
    }

    // Update order status
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'CONFIRMED',
        paymentStatus: 'PAID'
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    // Update product inventory
    for (const item of order.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      });
    }

    // Send confirmation emails
    try {
      const { sendOrderConfirmationEmail, sendAdminNotificationEmail } = await import('@/lib/email');
      
      const orderEmailData = {
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        total: order.total,
        items: order.items.map(item => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: order.shippingAddress ? JSON.parse(order.shippingAddress) : null
      };
      
      // Send customer confirmation email
      await sendOrderConfirmationEmail(orderEmailData);
      
      // Send admin notification email
      await sendAdminNotificationEmail('order', {
        ...orderEmailData,
        id: order.id
      });
      
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the order confirmation if email fails
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        total: order.total
      }
    });

  } catch (error) {
    console.error('Payment confirmation error:', error);
    return NextResponse.json(
      { error: 'Failed to confirm payment' },
      { status: 500 }
    );
  }
}