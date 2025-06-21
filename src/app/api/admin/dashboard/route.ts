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

export async function GET(request: NextRequest) {
  try {
    await verifyAdminToken(request);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Get current month stats
    const [
      currentMonthOrders,
      lastMonthOrders,
      totalCustomers,
      totalBookings,
      pendingOrders,
      lowStockProducts,
      recentOrders,
      recentBookings
    ] = await Promise.all([
      // Current month orders
      prisma.order.findMany({
        where: {
          createdAt: {
            gte: startOfMonth
          }
        }
      }),
      
      // Last month orders
      prisma.order.findMany({
        where: {
          createdAt: {
            gte: startOfLastMonth,
            lte: endOfLastMonth
          }
        }
      }),

      // Total customers
      prisma.user.count({
        where: {
          role: 'CUSTOMER'
        }
      }),

      // Total bookings
      prisma.booking.count(),

      // Pending orders
      prisma.order.count({
        where: {
          status: 'PENDING'
        }
      }),

      // Low stock products (stock < 10)
      prisma.product.count({
        where: {
          stock: {
            lt: 10
          },
          active: true
        }
      }),

      // Recent orders (last 5)
      prisma.order.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          user: true
        }
      }),

      // Recent bookings (last 5)
      prisma.booking.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          service: true
        }
      })
    ]);

    // Calculate revenue
    const currentMonthRevenue = currentMonthOrders.reduce((sum, order) => sum + order.total, 0);
    const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => sum + order.total, 0);

    // Calculate growth percentages
    const revenueGrowth = lastMonthRevenue > 0 
      ? Math.round(((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
      : 0;

    const ordersGrowth = lastMonthOrders.length > 0
      ? Math.round(((currentMonthOrders.length - lastMonthOrders.length) / lastMonthOrders.length) * 100)
      : 0;

    // Get total revenue (all time)
    const allOrders = await prisma.order.findMany();
    const totalRevenue = allOrders.reduce((sum, order) => sum + order.total, 0);

    const stats = {
      totalRevenue,
      totalOrders: allOrders.length,
      totalCustomers,
      totalBookings,
      revenueGrowth,
      ordersGrowth,
      lowStockItems: lowStockProducts,
      pendingOrders
    };

    const formattedRecentOrders = recentOrders.map(order => ({
      id: order.id,
      customerName: order.user?.name || order.customerName,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt.toISOString()
    }));

    const formattedRecentBookings = recentBookings.map(booking => ({
      id: booking.id,
      customerName: booking.customerName,
      service: booking.service.name,
      date: booking.date.toISOString(),
      time: booking.timeSlot,
      status: booking.status
    }));

    return NextResponse.json({
      stats,
      recentOrders: formattedRecentOrders,
      recentBookings: formattedRecentBookings
    });

  } catch (error) {
    console.error('Dashboard data error:', error);
    
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