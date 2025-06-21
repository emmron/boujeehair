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

// GET - Get single content item
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await verifyAdminToken(request);

    const content = await prisma.content.findUnique({
      where: { id: params.id }
    });

    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

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

// PATCH - Update content
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await verifyAdminToken(request);

    const data = await request.json();
    
    // Check if content exists
    const existingContent = await prisma.content.findUnique({
      where: { id: params.id }
    });

    if (!existingContent) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    // If updating slug, check it doesn't already exist
    if (data.slug && data.slug !== existingContent.slug) {
      const slugExists = await prisma.content.findUnique({
        where: { slug: data.slug }
      });

      if (slugExists) {
        return NextResponse.json(
          { error: 'Slug already exists' },
          { status: 400 }
        );
      }
    }

    // Build update data
    const updateData: any = {};
    
    if (data.type !== undefined) updateData.type = data.type;
    if (data.title !== undefined) updateData.title = data.title;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.published !== undefined) updateData.published = data.published;

    // Handle metadata updates
    if (data.metadata !== undefined || 
        data.excerpt !== undefined || 
        data.featuredImage !== undefined || 
        data.seoTitle !== undefined || 
        data.seoDescription !== undefined) {
      
      const currentMetadata = existingContent.metadata ? 
        JSON.parse(existingContent.metadata as string) : {};
      
      const newMetadata = {
        ...currentMetadata,
        ...data.metadata,
        excerpt: data.excerpt !== undefined ? data.excerpt : currentMetadata.excerpt,
        featuredImage: data.featuredImage !== undefined ? data.featuredImage : currentMetadata.featuredImage,
        seoTitle: data.seoTitle !== undefined ? data.seoTitle : currentMetadata.seoTitle,
        seoDescription: data.seoDescription !== undefined ? data.seoDescription : currentMetadata.seoDescription,
        lastModifiedBy: 'admin', // TODO: Get from authenticated user
        lastModified: new Date().toISOString()
      };
      
      updateData.metadata = JSON.stringify(newMetadata);
    }

    const content = await prisma.content.update({
      where: { id: params.id },
      data: updateData
    });

    return NextResponse.json(content);

  } catch (error) {
    console.error('Content update error:', error);
    
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

// DELETE - Delete content
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await verifyAdminToken(request);

    // Check if content exists
    const existingContent = await prisma.content.findUnique({
      where: { id: params.id }
    });

    if (!existingContent) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    await prisma.content.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Content deleted successfully' });

  } catch (error) {
    console.error('Content deletion error:', error);
    
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