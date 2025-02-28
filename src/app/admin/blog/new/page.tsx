'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, createBlogPost, BlogPost } from '../../../../lib/supabase-client';
import styles from '../../admin.module.css';
import ImageUploader from '../../../../components/ImageUploader';

export default function NewBlogPostPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image_url: '',
    category: '',
    author: '',
    featured: false,
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const { user, error } = await auth.getCurrentUser();
      if (!user) {
        router.push('/admin');
      } else {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
    
    setFormData({
      ...formData,
      slug,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // No need to validate image URLs anymore as they come directly from storage

      // Add current date as published_at
      const blogPostData = {
        ...formData,
        published_at: new Date().toISOString(),
      };

      const newPost = await createBlogPost(blogPostData as Omit<BlogPost, 'id'>);
      
      if (newPost) {
        router.push('/admin/blog');
      } else {
        setError('Failed to create blog post');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating the blog post');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className={styles.container}>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div className={styles.container}>Redirecting to login...</div>;
  }

  return (
    <div className={styles.container}>
      <h1>Create New Blog Post</h1>
      
      <div className={styles.nav}>
        <button onClick={() => router.push('/admin/blog')}>Back to Posts</button>
      </div>
      
      {error && <div className={styles.error}>{error}</div>}
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            onBlur={generateSlug}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="slug">Slug</label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="excerpt">Excerpt</label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="image_url">Image</label>
          <ImageUploader 
            onImageUploaded={(url) => setFormData({...formData, image_url: url})}
            defaultImageUrl={formData.image_url}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="category">Category</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="author">Author</label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label>
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
            />
            Featured Post
          </label>
        </div>
        
        <button 
          type="submit" 
          className={styles.button}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Blog Post'}
        </button>
      </form>
    </div>
  );
}