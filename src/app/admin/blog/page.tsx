'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, auth, BlogPost, getBlogPosts, deleteBlogPost } from '../../../lib/supabase-client';
import styles from '../admin.module.css';

export default function BlogAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const { user, error } = await auth.getCurrentUser();
      if (!user) {
        router.push('/admin');
      } else {
        setIsAuthenticated(true);
        fetchBlogPosts();
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const fetchBlogPosts = async () => {
    setIsLoading(true);
    const posts = await getBlogPosts();
    setBlogPosts(posts);
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      const success = await deleteBlogPost(id);
      if (success) {
        setSuccess('Blog post deleted successfully');
        fetchBlogPosts();
      } else {
        setError('Failed to delete blog post');
      }
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
      <h1>Manage Blog Posts</h1>
      
      <div className={styles.nav}>
        <button onClick={() => router.push('/admin')}>Dashboard</button>
        <button onClick={() => router.push('/admin/blog/new')}>Add New Post</button>
      </div>
      
      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}
      
      {blogPosts.length === 0 ? (
        <p>No blog posts found. Create your first post!</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Published</th>
              <th>Category</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogPosts.map((post) => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>{new Date(post.published_at).toLocaleDateString()}</td>
                <td>{post.category}</td>
                <td>{post.featured ? 'Yes' : 'No'}</td>
                <td className={styles.actions}>
                  <button 
                    className={styles.edit}
                    onClick={() => router.push(`/admin/blog/edit/${post.id}`)}
                  >
                    Edit
                  </button>
                  <button 
                    className={styles.delete}
                    onClick={() => handleDelete(post.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}