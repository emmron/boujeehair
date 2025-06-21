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

// GET - List all content
export async function GET(request: NextRequest) {
  try {
    await verifyAdminToken(request);

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const published = searchParams.get('published');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const skip = (page - 1) * limit;
    const where: any = {};

    if (type && type !== 'all') {
      where.type = type;
    }

    if (published === 'true') {
      where.published = true;
    } else if (published === 'false') {
      where.published = false;
    }

    const content = await prisma.content.findMany({
      where,
      orderBy: {
        updatedAt: 'desc'
      },
      skip,
      take: limit
    });

    return NextResponse.json(content);

  } catch (error) {
    console.error('Content fetch error:', error);
    
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

// POST - Create new content
export async function POST(request: NextRequest) {
  try {
    await verifyAdminToken(request);

    const data = await request.json();
    
    const {
      type,
      title,
      slug,
      content,
      excerpt,
      featuredImage,
      seoTitle,
      seoDescription,
      published = false,
      metadata = {}
    } = data;

    // Validate required fields
    if (!type || !title || !slug) {
      return NextResponse.json(
        { error: 'Type, title, and slug are required' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingContent = await prisma.content.findUnique({
      where: { slug }
    });

    if (existingContent) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 400 }
      );
    }

    // Build metadata object
    const contentMetadata = {
      ...metadata,
      excerpt,
      featuredImage,
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || excerpt || '',
      author: 'Admin', // TODO: Get from authenticated user
      createdBy: 'admin', // TODO: Get from authenticated user
      lastModifiedBy: 'admin'
    };

    const contentItem = await prisma.content.create({
      data: {
        type,
        title,
        slug,
        content: content || '',
        published,
        metadata: JSON.stringify(contentMetadata)
      }
    });

    return NextResponse.json(contentItem, { status: 201 });

  } catch (error) {
    console.error('Content creation error:', error);
    
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