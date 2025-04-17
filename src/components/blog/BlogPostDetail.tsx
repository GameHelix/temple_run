// src/components/blog/BlogPostDetail.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { BlogPost } from '@/types/user';

interface BlogPostProps {
  slug: string;
}

export default function BlogPostDetail({ slug }: BlogPostProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const isUserAdmin = user?.role === 'admin';

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        // In a real application, you would have an API endpoint to fetch by slug
        // For now, we'll fetch all posts and find the one with the matching slug
        const response = await axios.get('/api/blog');
        const allPosts = response.data.posts || [];
        const foundPost = allPosts.find((p: BlogPost) => p.slug === slug);
        
        if (foundPost) {
          setPost(foundPost);
          // Reset image error state when loading a new post
          setImageError(false);
        } else {
          setError('Blog post not found');
        }
      } catch (err) {
        setError('Failed to load blog post. Please try again later.');
        console.error('Error fetching blog post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const handleDelete = async () => {
    if (!post || !window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await axios.delete(`/api/blog/${post.id}`);
      router.push('/blog');
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('Failed to delete post. Please try again.');
    }
  };

  // Function to format the HTML content - add custom classes to images
  const formatContent = (content: string) => {
    // Add 'blog-image' class to all images in the content
    // This ensures each <img> in the blog post content gets the proper class
    const withImageClasses = content.replace(/<img /g, '<img class="blog-image" ');
    
    // You could add more HTML transformations here if needed
    
    return withImageClasses;
  };

  // Function to handle image load errors
  const handleImageError = () => {
    setImageError(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-pulse flex space-x-2">
          <div className="h-3 w-3 bg-indigo-400 rounded-full"></div>
          <div className="h-3 w-3 bg-indigo-400 rounded-full"></div>
          <div className="h-3 w-3 bg-indigo-400 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
          <p>{error || 'Blog post not found'}</p>
        </div>
        <Link 
          href="/blog" 
          className="mt-6 inline-block text-indigo-400 hover:text-indigo-300"
        >
          ← Back to blog
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto py-12 px-4">
      <Link 
        href="/blog" 
        className="text-indigo-400 hover:text-indigo-300 inline-flex items-center mb-6"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Back to blog
      </Link>
      
      <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-lg overflow-hidden shadow-lg">
        {/* Featured image - ENHANCED: better error handling and fallback */}
        {post.imageUrl && !imageError && (
          <div className="w-full h-72 md:h-96 relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          </div>
        )}
        
        <div className="p-8">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-indigo-100 mb-4">{post.title}</h1>
            
            <div className="flex flex-wrap items-center text-sm text-indigo-300 mb-4">
              <span>By {post.authorName}</span>
              <span className="mx-2">•</span>
              <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
              
              {post.tags && post.tags.length > 0 && (
                <>
                  <span className="mx-2">•</span>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <span key={index} className="bg-indigo-900/60 px-2 py-1 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
            
            {isUserAdmin && (
              <div className="flex space-x-3 mt-4">
                <Link 
                  href={`/admin/blog/edit/${post.id}`}
                  className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700"
                >
                  Edit Post
                </Link>
                <button 
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                >
                  Delete
                </button>
                {post.imageUrl && (
                  <div className="ml-4 text-xs text-indigo-300">
                    {imageError ? 
                      <span className="text-yellow-400">Image failed to load</span> : 
                      <span>Image URL: {post.imageUrl.substring(0, 30)}...</span>
                    }
                  </div>
                )}
              </div>
            )}
          </header>
          
          {/* Added stronger styling classes to ensure content is visible */}
          <div className="prose prose-invert max-w-none prose-indigo prose-lg blog-content text-indigo-100">
            <div dangerouslySetInnerHTML={{ __html: formatContent(post.content) }} />
          </div>
        </div>
      </div>
    </article>
  );
}