// src/lib/blog-db.ts
import { query } from './db';
import { BlogPost, BlogPostInput } from '@/types/user';
import { v4 as uuidv4 } from 'uuid';
import { isAdmin } from './user-db';

/**
 * Create a slug from a title
 */
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .concat(`-${Date.now().toString().slice(-6)}`); // Add timestamp suffix for uniqueness
}

/**
 * Create a new blog post (admin only)
 */
export async function createBlogPost(userId: string, postData: BlogPostInput): Promise<BlogPost | null> {
  try {
    // Check if user is an admin
    const adminCheck = await isAdmin(userId);
    
    if (!adminCheck) {
      console.error('Non-admin user attempted to create blog post');
      return null;
    }
    
    // Generate UUID for the new post
    const postId = uuidv4();
    const now = new Date();
    
    // Generate slug from title
    const slug = createSlug(postData.title);
    
    // Get author name
    const authorResult = await query(
      'SELECT name FROM users WHERE id = $1',
      [userId]
    );
    
    if (authorResult.rows.length === 0) {
      return null; // Author not found
    }
    
    const authorName = authorResult.rows[0].name;
    
    // Insert the new blog post
    const result = await query(
      `INSERT INTO blog_posts (
        id, title, content, summary, image_url, author_id, published_at, updated_at, 
        slug, tags, is_published
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
      RETURNING *`,
      [
        postId,
        postData.title,
        postData.content,
        postData.summary,
        postData.imageUrl || null,
        userId,
        now,
        now,
        slug,
        postData.tags || [],
        postData.isPublished
      ]
    );
    
    if (result.rows.length > 0) {
      // Convert the returned row to a BlogPost object
      return {
        id: result.rows[0].id,
        title: result.rows[0].title,
        content: result.rows[0].content,
        summary: result.rows[0].summary,
        imageUrl: result.rows[0].image_url,
        authorId: result.rows[0].author_id,
        authorName: authorName,
        publishedAt: new Date(result.rows[0].published_at),
        updatedAt: new Date(result.rows[0].updated_at),
        slug: result.rows[0].slug,
        tags: result.rows[0].tags,
        isPublished: result.rows[0].is_published
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error creating blog post:', error);
    throw error;
  }
}

/**
 * Update an existing blog post (admin only)
 */
export async function updateBlogPost(
  userId: string, 
  postId: string, 
  postData: Partial<BlogPostInput>
): Promise<BlogPost | null> {
  try {
    // Check if user is an admin
    const adminCheck = await isAdmin(userId);
    
    if (!adminCheck) {
      console.error('Non-admin user attempted to update blog post');
      return null;
    }
    
    // Start building the query
    let updateQuery = `UPDATE blog_posts SET updated_at = CURRENT_TIMESTAMP`;
    const queryParams: unknown[] = [];
    let paramCounter = 1;
    
    // Add fields to update only if they're provided
    if (postData.title !== undefined) {
      updateQuery += `, title = $${paramCounter}`;
      queryParams.push(postData.title);
      paramCounter++;
      
      // If title is updated, also update the slug
      const newSlug = createSlug(postData.title);
      updateQuery += `, slug = $${paramCounter}`;
      queryParams.push(newSlug);
      paramCounter++;
    }
    
    if (postData.content !== undefined) {
      updateQuery += `, content = $${paramCounter}`;
      queryParams.push(postData.content);
      paramCounter++;
    }
    
    if (postData.summary !== undefined) {
      updateQuery += `, summary = $${paramCounter}`;
      queryParams.push(postData.summary);
      paramCounter++;
    }
    
    if (postData.imageUrl !== undefined) {
      updateQuery += `, image_url = $${paramCounter}`;
      queryParams.push(postData.imageUrl || null);
      paramCounter++;
    }
    
    if (postData.tags !== undefined) {
      updateQuery += `, tags = $${paramCounter}`;
      queryParams.push(postData.tags);
      paramCounter++;
    }
    
    if (postData.isPublished !== undefined) {
      updateQuery += `, is_published = $${paramCounter}`;
      queryParams.push(postData.isPublished);
      paramCounter++;
    }
    
    // Add the WHERE clause
    updateQuery += ` WHERE id = $${paramCounter} RETURNING *`;
    queryParams.push(postId);
    
    // Execute the update query
    const result = await query(updateQuery, queryParams);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    // Get author name
    const authorResult = await query(
      'SELECT name FROM users WHERE id = $1',
      [result.rows[0].author_id]
    );
    
    const authorName = authorResult.rows.length > 0 
      ? authorResult.rows[0].name 
      : 'Unknown Author';
    
    // Convert the returned row to a BlogPost object
    return {
      id: result.rows[0].id,
      title: result.rows[0].title,
      content: result.rows[0].content,
      summary: result.rows[0].summary,
      imageUrl: result.rows[0].image_url,
      authorId: result.rows[0].author_id,
      authorName: authorName,
      publishedAt: new Date(result.rows[0].published_at),
      updatedAt: new Date(result.rows[0].updated_at),
      slug: result.rows[0].slug,
      tags: result.rows[0].tags,
      isPublished: result.rows[0].is_published
    };
  } catch (error) {
    console.error('Error updating blog post:', error);
    throw error;
  }
}

/**
 * Delete a blog post (admin only)
 */
export async function deleteBlogPost(userId: string, postId: string): Promise<boolean> {
  try {
    // Check if user is an admin
    const adminCheck = await isAdmin(userId);
    
    if (!adminCheck) {
      console.error('Non-admin user attempted to delete blog post');
      return false;
    }
    
    const result = await query(
      'DELETE FROM blog_posts WHERE id = $1 RETURNING id',
      [postId]
    );
    
    return result.rows.length > 0;
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return false;
  }
}

/**
 * Get all blog posts (only published posts for public view)
 */
export async function getAllBlogPosts(adminView: boolean = false): Promise<BlogPost[]> {
  try {
    // If admin view, get all posts including drafts
    // If public view, get only published posts
    const queryText = adminView
      ? `SELECT bp.*, u.name as author_name
         FROM blog_posts bp
         JOIN users u ON bp.author_id = u.id
         ORDER BY bp.published_at DESC`
      : `SELECT bp.*, u.name as author_name
         FROM blog_posts bp
         JOIN users u ON bp.author_id = u.id
         WHERE bp.is_published = true
         ORDER BY bp.published_at DESC`;
    
    const result = await query(queryText);
    
    return result.rows.map(row => ({
      id: row.id,
      title: row.title,
      content: row.content,
      summary: row.summary,
      imageUrl: row.image_url,
      authorId: row.author_id,
      authorName: row.author_name,
      publishedAt: new Date(row.published_at),
      updatedAt: new Date(row.updated_at),
      slug: row.slug,
      tags: row.tags,
      isPublished: row.is_published
    }));
  } catch (error) {
    console.error('Error getting blog posts:', error);
    return [];
  }
}

/**
 * Get a blog post by ID
 */
export async function getBlogPostById(postId: string): Promise<BlogPost | null> {
  try {
    const result = await query(
      `SELECT bp.*, u.name as author_name
       FROM blog_posts bp
       JOIN users u ON bp.author_id = u.id
       WHERE bp.id = $1`,
      [postId]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return {
      id: result.rows[0].id,
      title: result.rows[0].title,
      content: result.rows[0].content,
      summary: result.rows[0].summary,
      imageUrl: result.rows[0].image_url,
      authorId: result.rows[0].author_id,
      authorName: result.rows[0].author_name,
      publishedAt: new Date(result.rows[0].published_at),
      updatedAt: new Date(result.rows[0].updated_at),
      slug: result.rows[0].slug,
      tags: result.rows[0].tags,
      isPublished: result.rows[0].is_published
    };
  } catch (error) {
    console.error('Error getting blog post by ID:', error);
    return null;
  }
}

/**
 * Get a blog post by slug
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const result = await query(
      `SELECT bp.*, u.name as author_name
       FROM blog_posts bp
       JOIN users u ON bp.author_id = u.id
       WHERE bp.slug = $1`,
      [slug]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return {
      id: result.rows[0].id,
      title: result.rows[0].title,
      content: result.rows[0].content,
      summary: result.rows[0].summary,
      imageUrl: result.rows[0].image_url,
      authorId: result.rows[0].author_id,
      authorName: result.rows[0].author_name,
      publishedAt: new Date(result.rows[0].published_at),
      updatedAt: new Date(result.rows[0].updated_at),
      slug: result.rows[0].slug,
      tags: result.rows[0].tags,
      isPublished: result.rows[0].is_published
    };
  } catch (error) {
    console.error('Error getting blog post by slug:', error);
    return null;
  }
}