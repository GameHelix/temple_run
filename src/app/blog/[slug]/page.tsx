// src/app/blog/[slug]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { BlogPost } from '@/types/user';
import BlogPostDetail from '@/components/blog/BlogPostDetail';

export default function BlogPostPage() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/api/blog');
        setPosts(response.data.posts || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Check if the post exists
  const postExists = posts.some(post => post.slug === slug);

  useEffect(() => {
    if (!loading && !postExists && posts.length > 0) {
      router.push('/blog');
    }
  }, [loading, postExists, posts, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 flex justify-center items-center">
        <div className="animate-pulse flex space-x-2">
          <div className="h-3 w-3 bg-indigo-400 rounded-full"></div>
          <div className="h-3 w-3 bg-indigo-400 rounded-full"></div>
          <div className="h-3 w-3 bg-indigo-400 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900">
      <BlogPostDetail slug={slug} />
    </div>
  );
}