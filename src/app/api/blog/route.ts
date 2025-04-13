// src/app/api/blog/route.ts
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { isAdmin } from '@/lib/user-db';
import { 
  createBlogPost, 
  getAllBlogPosts
} from '@/lib/blog-db';

// Get all blog posts
export async function GET(request: Request) {
  try {
    // Check if request is from admin (to include draft posts)
    let adminView = false;
    const authHeader = request.headers.get('Authorization');
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = verifyToken(token);
      
      if (decoded?.id) {
        adminView = await isAdmin(decoded.id);
      }
    }
    
    const blogPosts = await getAllBlogPosts(adminView);
    
    return NextResponse.json({
      success: true,
      posts: blogPosts
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

// Create a new blog post (admin only)
export async function POST(request: Request) {
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
    
    // Parse request body
    const body = await request.json();
    
    // Validate input
    if (!body.title || !body.content) {
      return NextResponse.json(
        { success: false, message: 'Title and content are required' },
        { status: 400 }
      );
    }
    
    // Create the blog post
    const blogPost = await createBlogPost(decoded.id, {
      title: body.title,
      content: body.content,
      summary: body.summary || body.title,
      tags: body.tags || [],
      isPublished: body.isPublished || false
    });
    
    if (!blogPost) {
      return NextResponse.json(
        { success: false, message: 'Failed to create blog post' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Blog post created successfully',
      post: blogPost
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}