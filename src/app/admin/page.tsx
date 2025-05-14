'use client';

import { useState, useEffect } from 'react';
import { supabase, auth } from '../../utils/supabase';
import { useRouter } from 'next/navigation';
import styles from './admin.module.css';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const { user, error } = await auth.getCurrentUser();
      if (user) {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const { data, error } = await auth.signIn(email, password);
    
    if (error) {
      setError(error.message);
      return;
    }
    
    setIsAuthenticated(true);
  };

  if (isLoading) {
    return <div className={styles.container}>Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className={styles.container}>
        <h1>Admin Login</h1>
        {error && <div className={styles.error}>{error}</div>}
        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.button}>Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>Admin Dashboard</h1>
      <div className={styles.nav}>
        <button onClick={() => router.push('/admin/blog')}>Manage Blog Posts</button>
        <button onClick={() => router.push('/admin/projects')}>Manage Projects</button>
        <button onClick={() => router.push('/admin/contact')}>View Contact Submissions</button>
        <button onClick={async () => {
          await auth.signOut();
          setIsAuthenticated(false);
        }}>Logout</button>
      </div>
    </div>
  );
}