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

// GET - Get single booking
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await verifyAdminToken(request);

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        service: {
          select: {
            id: true,
            name: true,
            duration: true,
            price: true,
            category: true,
            description: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(booking);

  } catch (error) {
    console.error('Booking fetch error:', error);
    
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

// PATCH - Update booking
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await verifyAdminToken(request);

    const data = await request.json();
    
    // Check if booking exists
    const existingBooking = await prisma.booking.findUnique({
      where: { id: params.id }
    });

    if (!existingBooking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Build update data
    const updateData: any = {};

    if (data.serviceId !== undefined) {
      // Verify service exists and is active
      const service = await prisma.service.findUnique({
        where: { id: data.serviceId, active: true }
      });
      
      if (!service) {
        return NextResponse.json(
          { error: 'Service not found or inactive' },
          { status: 400 }
        );
      }
      
      updateData.serviceId = data.serviceId;
    }

    if (data.customerName !== undefined) updateData.customerName = data.customerName;
    if (data.customerEmail !== undefined) updateData.customerEmail = data.customerEmail;
    if (data.customerPhone !== undefined) updateData.customerPhone = data.customerPhone;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.status !== undefined) updateData.status = data.status;

    // Handle date and time changes
    if (data.date !== undefined || data.timeSlot !== undefined) {
      const newDate = data.date ? new Date(data.date) : existingBooking.date;
      const newTimeSlot = data.timeSlot || existingBooking.timeSlot;

      // Check for conflicts if date or time is changing
      if (data.date !== undefined || data.timeSlot !== undefined) {
        const conflictingBooking = await prisma.booking.findFirst({
          where: {
            id: { not: params.id },
            date: newDate,
            timeSlot: newTimeSlot,
            status: { not: 'CANCELLED' }
          }
        });

        if (conflictingBooking) {
          return NextResponse.json(
            { error: 'Time slot is already booked' },
            { status: 400 }
          );
        }
      }

      if (data.date !== undefined) updateData.date = newDate;
      if (data.timeSlot !== undefined) updateData.timeSlot = newTimeSlot;
    }

    const booking = await prisma.booking.update({
      where: { id: params.id },
      data: updateData,
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

    return NextResponse.json(booking);

  } catch (error) {
    console.error('Booking update error:', error);
    
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

// DELETE - Delete booking
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await verifyAdminToken(request);

    // Check if booking exists
    const existingBooking = await prisma.booking.findUnique({
      where: { id: params.id }
    });

    if (!existingBooking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    await prisma.booking.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Booking deleted successfully' });

  } catch (error) {
    console.error('Booking deletion error:', error);
    
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