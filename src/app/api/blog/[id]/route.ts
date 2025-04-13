// src/app/api/blog/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { isAdmin } from '@/lib/user-db';
import { 
  getBlogPostById, 
  updateBlogPost, 
  deleteBlogPost 
} from '@/lib/blog-db';

type RouteSegmentProps = {
  params: {
    id: string;
  };
};

// Get a specific blog post
export async function GET(
  request: NextRequest,
  props: RouteSegmentProps
) {
  try {
    const postId = props.params.id;
    const blogPost = await getBlogPostById(postId);
    
    if (!blogPost) {
      return NextResponse.json(
        { success: false, message: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    // If the post is not published, only allow admins to view it
    if (!blogPost.isPublished) {
      const authHeader = request.headers.get('Authorization');
      let isUserAdmin = false;
      
      if (authHeader && authHeader.startsWith('Bearer ')) {
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
  props: RouteSegmentProps
) {
  try {
    // Authenticate and check if user is admin
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
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
    
    // Check if user is an admin
    const adminCheck = await isAdmin(decoded.id);
    
    if (!adminCheck) {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }
    
    const postId = props.params.id;
    
    // Parse request body
    const body = await request.json();
    
    // Update the blog post
    const updatedPost = await updateBlogPost(decoded.id, postId, {
      title: body.title,
      content: body.content,
      summary: body.summary,
      tags: body.tags,
      isPublished: body.isPublished
    });
    
    if (!updatedPost) {
      return NextResponse.json(
        { success: false, message: 'Blog post not found or update failed' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Blog post updated successfully',
      post: updatedPost
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

// Delete a blog post (admin only)
export async function DELETE(
  request: NextRequest,
  props: RouteSegmentProps
) {
  try {
    // Authenticate and check if user is admin
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
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
    
    // Check if user is an admin
    const adminCheck = await isAdmin(decoded.id);
    
    if (!adminCheck) {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }
    
    const postId = props.params.id;
    
    // Delete the blog post
    const success = await deleteBlogPost(decoded.id, postId);
    
    if (!success) {
      return NextResponse.json(
        { success: false, message: 'Blog post not found or delete failed' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}