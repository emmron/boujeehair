import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

async function verifyAdminToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }

  const token = authHeader.substring(7);
  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
  
  const user = await prisma.user.findUnique({
    where: {
      id: decoded.userId,
      role: 'ADMIN'
    }
  });

  if (!user) {
    throw new Error('Invalid token');
  }

  return user;
}

// GET - List all bookings
export async function GET(request: NextRequest) {
  try {
    await verifyAdminToken(request);

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const date = searchParams.get('date');
    const serviceId = searchParams.get('serviceId');

    const where: any = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      
      where.date = {
        gte: startDate,
        lt: endDate
      };
    }

    if (serviceId) {
      where.serviceId = serviceId;
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        service: {
          select: {
            id: true,
            name: true,
            duration: true,
            price: true,
            category: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: [
        { date: 'asc' },
        { timeSlot: 'asc' }
      ]
    });

    return NextResponse.json(bookings);

  } catch (error) {
    console.error('Bookings fetch error:', error);
    
    if (error instanceof Error && error.message.includes('token')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new booking
export async function POST(request: NextRequest) {
  try {
    await verifyAdminToken(request);

    const data = await request.json();
    
    const {
      serviceId,
      customerName,
      customerEmail,
      customerPhone,
      date,
      timeSlot,
      notes,
      userId
    } = data;

    // Validate required fields
    if (!serviceId || !customerName || !customerEmail || !customerPhone || !date || !timeSlot) {
      return NextResponse.json(
        { error: 'Service, customer details, date, and time slot are required' },
        { status: 400 }
      );
    }

    // Check if the service exists
    const service = await prisma.service.findUnique({
      where: { id: serviceId, active: true }
    });

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found or inactive' },
        { status: 400 }
      );
    }

    // Check for conflicting bookings (same date and time)
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        date: new Date(date),
        timeSlot,
        status: {
          not: 'CANCELLED'
        }
      }
    });

    if (conflictingBooking) {
      return NextResponse.json(
        { error: 'Time slot is already booked' },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        serviceId,
        customerName,
        customerEmail,
        customerPhone,
        date: new Date(date),
        timeSlot,
        notes,
        userId: userId || null,
        status: 'CONFIRMED'
      },
      include: {
        service: {
          select: {
            id: true,
            name: true,
            duration: true,
            price: true
          }
        }
      }
    });

    // Send confirmation emails
    try {
      const { sendBookingConfirmationEmail, sendAdminNotificationEmail } = await import('@/lib/email');
      
      const bookingEmailData = {
        customerName: booking.customerName,
        customerEmail: booking.customerEmail,
        serviceName: booking.service.name,
        date: booking.date.toISOString(),
        timeSlot: booking.timeSlot,
        duration: booking.service.duration,
        price: booking.service.price,
        notes: booking.notes || undefined
      };
      
      // Send customer confirmation email
      await sendBookingConfirmationEmail(bookingEmailData);
      
      // Send admin notification email
      await sendAdminNotificationEmail('booking', bookingEmailData);
      
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the booking creation if email fails
    }

    return NextResponse.json(booking, { status: 201 });

  } catch (error) {
    console.error('Booking creation error:', error);
    
    if (error instanceof Error && error.message.includes('token')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}