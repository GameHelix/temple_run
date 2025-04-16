'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { BlogPost } from '@/types/user';

export default function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isDoctor } = useAuth();
  const isUserAdmin = user?.role === 'admin';

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/blog');
        setPosts(response.data.posts || []);
      } catch (err) {
        setError('Failed to load blog posts. Please try again later.');
        console.error('Error fetching blog posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

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

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No blog posts found.</p>
        {isUserAdmin && (
          <Link 
            href="/admin/blog/new" 
            className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Create Your First Post
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-10 py-8">
      {isUserAdmin && (
        <div className="flex justify-end">
          <Link 
            href="/admin/blog/new" 
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            New Post
          </Link>
        </div>
      )}
      
      {posts.map((post) => (
        <div key={post.id} className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-lg overflow-hidden shadow-lg">
          <div className="md:flex">
            {/* Featured image (if present) */}
            {post.imageUrl && (
              <div className="md:flex-shrink-0 md:w-1/3 h-64 md:h-auto">
                <Link href={`/blog/${post.slug}`}>
                  <div className="h-full w-full relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = '/placeholder-image.jpg'; // Fallback image
                      }}
                    />
                  </div>
                </Link>
              </div>
            )}

            {/* Content section */}
            <div className={`p-6 ${post.imageUrl ? 'md:w-2/3' : 'w-full'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-indigo-100 mb-2">
                    <Link href={`/blog/${post.slug}`} className="hover:text-indigo-300">
                      {post.title}
                    </Link>
                  </h2>
                  <div className="flex items-center text-sm text-indigo-300 mb-4">
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
                </div>
                {isUserAdmin && (
                  <div className="flex space-x-2">
                    <Link 
                      href={`/admin/blog/edit/${post.id}`}
                      className="text-indigo-300 hover:text-indigo-100 text-sm border border-indigo-700 px-3 py-1 rounded"
                    >
                      Edit
                    </Link>
                  </div>
                )}
              </div>
              
              <p className="text-indigo-200 mb-6">{post.summary}</p>
              
              <Link 
                href={`/blog/${post.slug}`}
                className="text-indigo-400 hover:text-indigo-300 inline-flex items-center"
              >
                Read more
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}