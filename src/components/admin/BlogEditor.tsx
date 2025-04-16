'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { BlogPostInput } from '@/types/user';

interface BlogEditorProps {
  postId?: string; // If provided, we're editing an existing post
}

export default function BlogEditor({ postId }: BlogEditorProps) {
  const { user } = useAuth();
  const router = useRouter();
  const isEditing = !!postId;
  
  const [formData, setFormData] = useState<BlogPostInput>({
    title: '',
    content: '',
    summary: '',
    imageUrl: '',
    tags: [],
    isPublished: false
  });
  
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Check if user is admin
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/');
    }
  }, [user, router]);

  // Fetch existing post data if editing
  useEffect(() => {
    const fetchPost = async () => {
      if (!isEditing) return;
      
      try {
        setInitialLoading(true);
        const response = await axios.get(`/api/blog/${postId}`);
        
        if (response.data.success && response.data.post) {
          const post = response.data.post;
          setFormData({
            title: post.title,
            content: post.content,
            summary: post.summary,
            imageUrl: post.imageUrl || '',
            tags: post.tags || [],
            isPublished: post.isPublished
          });
          
          if (post.imageUrl) {
            setImagePreview(post.imageUrl);
          }
        } else {
          setError('Failed to load post data');
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load post data. Please try again.');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchPost();
  }, [isEditing, postId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Update image preview when image URL changes
    if (name === 'imageUrl' && value) {
      setImagePreview(value);
    } else if (name === 'imageUrl' && !value) {
      setImagePreview(null);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      setError('Title and content are required');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // If summary is empty, use the first few sentences of the content
      if (!formData.summary.trim()) {
        const contentText = formData.content.replace(/<[^>]+>/g, ' ').trim();
        let summary = contentText.split(/[.!?]/).slice(0, 2).join('. ');
        
        if (summary.length > 160) {
          summary = summary.substring(0, 157) + '...';
        }
        
        formData.summary = summary;
      }
      
      let response;
      
      if (isEditing) {
        response = await axios.put(`/api/blog/${postId}`, formData);
      } else {
        response = await axios.post('/api/blog', formData);
      }
      
      if (response.data.success) {
        router.push('/blog');
      } else {
        setError(response.data.message || 'Failed to save post');
      }
    } catch (err) {
      console.error('Error saving post:', err);
      setError('Failed to save post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
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

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-indigo-100">
          {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
        </h1>
        <Link 
          href="/blog" 
          className="text-indigo-400 hover:text-indigo-300"
        >
          Cancel
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-900/50 border-l-4 border-red-500 text-red-100 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-indigo-200 mb-2">
            Post Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-700/70 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white"
            placeholder="Enter post title"
            required
          />
        </div>
        
        {/* Image URL field */}
        <div className="mb-6">
          <label htmlFor="imageUrl" className="block text-sm font-medium text-indigo-200 mb-2">
            Featured Image URL
          </label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-700/70 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white"
            placeholder="https://example.com/image.jpg"
          />
          <p className="mt-1 text-xs text-indigo-300">
            Enter a URL to an image that will be displayed as the post's featured image
          </p>
          
          {/* Image Preview */}
          {imagePreview && (
            <div className="mt-3">
              <p className="text-sm font-medium text-indigo-200 mb-2">Image Preview:</p>
              <div className="relative h-60 w-full rounded-lg overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={imagePreview} 
                  alt="Featured image preview" 
                  className="object-cover w-full h-full"
                  onError={() => setImagePreview(null)}
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <label htmlFor="summary" className="block text-sm font-medium text-indigo-200 mb-2">
            Summary (optional)
          </label>
          <textarea
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 bg-gray-700/70 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white"
            placeholder="Brief summary of your post (if left empty, it will be generated from your content)"
          ></textarea>
        </div>
        
        <div className="mb-6">
          <label htmlFor="content" className="block text-sm font-medium text-indigo-200 mb-2">
            Content *
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={15}
            className="w-full px-4 py-2 bg-gray-700/70 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white"
            placeholder="Write your post content here (supports HTML formatting)"
            required
          ></textarea>
          <p className="mt-2 text-xs text-indigo-300">
            HTML formatting is supported. Use &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, etc. for formatting.
          </p>
          <p className="mt-1 text-xs text-indigo-300">
            To embed images in the content, use HTML: &lt;img src="https://example.com/image.jpg" alt="Description" class="blog-image" /&gt;
          </p>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-indigo-200 mb-2">
            Tags
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={handleTagInputChange}
              onKeyDown={handleTagKeyDown}
              className="flex-1 px-4 py-2 bg-gray-700/70 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white"
              placeholder="Add a tag and press Enter"
            />
            <button
              type="button"
              onClick={addTag}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Add
            </button>
          </div>
          
          {formData.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <div key={index} className="bg-indigo-900/60 px-3 py-1 rounded-full text-sm flex items-center">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-indigo-300 hover:text-indigo-100"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublished"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 rounded bg-gray-700"
            />
            <label htmlFor="isPublished" className="ml-2 block text-sm text-indigo-200">
              Publish immediately
            </label>
          </div>
          <p className="mt-1 text-xs text-indigo-300">
            If unchecked, the post will be saved as a draft and won&apos;t be visible to regular users.
          </p>
        </div>
        
        <div className="flex items-center justify-end gap-4">
          <Link 
            href="/blog" 
            className="px-6 py-2 border border-gray-600 rounded-lg text-indigo-200 hover:bg-gray-700"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : isEditing ? 'Update Post' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );
}