import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { isAdmin } from '@/lib/user-db';
import { 
  getBlogPostById, 
  updateBlogPost, 
  deleteBlogPost 
} from '@/lib/blog-db';

// Get a specific blog post
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { params } = context;
  try {
    const postId = params.id;
    const blogPost = await getBlogPostById(postId);
    
    if (!blogPost) {
      return NextResponse.json(
        { success: false, message: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    if (!blogPost.isPublished) {
      const authHeader = request.headers.get('Authorization');
      let isUserAdmin = false;
      
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const decoded = verifyToken(token);
        
        if (decoded?.id) {
          isUserAdmin = await isAdmin(decoded.id);
        }
      }
      
      if (!isUserAdmin) {
        return NextResponse.json(
          { success: false, message: 'Blog post not found' },
          { status: 404 }
        );
      }
    }
    
    return NextResponse.json({
      success: true,
      post: blogPost
    });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}

// Update a blog post (admin only)
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { params } = context;
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (!decoded?.id) {
      return NextResponse.json(
        { success: false, message: 'Invalid authentication token' },
        { status: 401 }
      );
    }
    
    const adminCheck = await isAdmin(decoded.id);
    
    if (!adminCheck) {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }
    
    const postId = params.id;
    const body = await request.json();
    
    const updatedPost = await updateBlogPost(decoded.id, postId, {
      title: body.title,
      content: body.content,
      summary: body.summary,
      tags: body.tags,
      isPublished: body.isPublished
    });
    
    if (!updatedPost) {
      return NextResponse.json(
        { success: false, message: 'Update failed' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Blog post updated',
      post: updatedPost
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { success: false, message: 'Update failed' },
      { status: 500 }
    );
  }
}

// Delete a blog post (admin only)
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { params } = context;
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (!decoded?.id) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }
    
    const adminCheck = await isAdmin(decoded.id);
    
    if (!adminCheck) {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }
    
    const postId = params.id;
    const success = await deleteBlogPost(decoded.id, postId);
    
    if (!success) {
      return NextResponse.json(
        { success: false, message: 'Delete failed' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Blog post deleted'
    });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { success: false, message: 'Delete failed' },
      { status: 500 }
    );
  }
}