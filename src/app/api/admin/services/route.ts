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

// GET - List all services
export async function GET(request: NextRequest) {
  try {
    await verifyAdminToken(request);

    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active');
    const category = searchParams.get('category');

    const where: any = {};

    if (active === 'true') {
      where.active = true;
    } else if (active === 'false') {
      where.active = false;
    }

    if (category) {
      where.category = category;
    }

    const services = await prisma.service.findMany({
      where,
      include: {
        _count: {
          select: {
            bookings: {
              where: {
                status: { not: 'CANCELLED' }
              }
            }
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(services);

  } catch (error) {
    console.error('Services fetch error:', error);
    
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

// POST - Create new service
export async function POST(request: NextRequest) {
  try {
    await verifyAdminToken(request);

    const data = await request.json();
    
    const {
      name,
      description,
      duration,
      price,
      category,
      active = true
    } = data;

    // Validate required fields
    if (!name || !duration || !price) {
      return NextResponse.json(
        { error: 'Name, duration, and price are required' },
        { status: 400 }
      );
    }

    const service = await prisma.service.create({
      data: {
        name,
        description,
        duration: parseInt(duration),
        price: parseFloat(price),
        category,
        active
      }
    });

    return NextResponse.json(service, { status: 201 });

  } catch (error) {
    console.error('Service creation error:', error);
    
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