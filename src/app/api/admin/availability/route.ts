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

// GET - Get availability for a specific date
export async function GET(request: NextRequest) {
  try {
    await verifyAdminToken(request);

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const serviceId = searchParams.get('serviceId');

    if (!date) {
      return NextResponse.json(
        { error: 'Date is required' },
        { status: 400 }
      );
    }

    // Get business hours from settings
    const businessHours = {
      start: '09:00',
      end: '17:00',
      timeSlots: [
        '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
        '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
      ]
    };

    // Get existing bookings for the date
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    const existingBookings = await prisma.booking.findMany({
      where: {
        date: {
          gte: startDate,
          lt: endDate
        },
        status: {
          not: 'CANCELLED'
        }
      },
      include: {
        service: {
          select: {
            duration: true
          }
        }
      }
    });

    // Calculate available time slots
    const availability = businessHours.timeSlots.map(timeSlot => {
      const isBooked = existingBookings.some(booking => booking.timeSlot === timeSlot);
      
      return {
        timeSlot,
        available: !isBooked,
        bookings: existingBookings.filter(booking => booking.timeSlot === timeSlot)
      };
    });

    // If serviceId is provided, also check service-specific constraints
    let service = null;
    if (serviceId) {
      service = await prisma.service.findUnique({
        where: { id: serviceId }
      });
    }

    return NextResponse.json({
      date,
      availability,
      service,
      businessHours
    });

  } catch (error) {
    console.error('Availability fetch error:', error);
    
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

// POST - Update business hours and availability settings
export async function POST(request: NextRequest) {
  try {
    await verifyAdminToken(request);

    const data = await request.json();
    
    const {
      businessHours,
      timeSlots,
      blackoutDates,
      specialHours
    } = data;

    // Update business settings
    const settingsToUpdate = [
      { key: 'business_hours_start', value: businessHours?.start || '09:00' },
      { key: 'business_hours_end', value: businessHours?.end || '17:00' },
      { key: 'booking_time_slots', value: JSON.stringify(timeSlots || [
        '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
        '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
      ]) },
      { key: 'blackout_dates', value: JSON.stringify(blackoutDates || []) },
      { key: 'special_hours', value: JSON.stringify(specialHours || {}) }
    ];

    for (const setting of settingsToUpdate) {
      await prisma.setting.upsert({
        where: { key: setting.key },
        update: { value: setting.value },
        create: {
          key: setting.key,
          value: setting.value,
          type: setting.key === 'booking_time_slots' || setting.key === 'blackout_dates' || setting.key === 'special_hours' ? 'json' : 'string'
        }
      });
    }

    return NextResponse.json({ message: 'Availability settings updated successfully' });

  } catch (error) {
    console.error('Availability update error:', error);
    
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