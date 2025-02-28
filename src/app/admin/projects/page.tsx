'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, auth, Project, getProjects, deleteProject } from '../../../lib/supabase-client';
import styles from '../admin.module.css';

export default function ProjectsAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
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
        fetchProjects();
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const fetchProjects = async () => {
    setIsLoading(true);
    const projectList = await getProjects();
    setProjects(projectList);
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      const success = await deleteProject(id);
      if (success) {
        setSuccess('Project deleted successfully');
        fetchProjects();
      } else {
        setError('Failed to delete project');
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
      <h1>Manage Projects</h1>
      
      <div className={styles.nav}>
        <button onClick={() => router.push('/admin')}>Dashboard</button>
        <button onClick={() => router.push('/admin/projects/new')}>Add New Project</button>
      </div>
      
      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}
      
      {projects.length === 0 ? (
        <p>No projects found. Create your first project!</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td>{project.title}</td>
                <td>{project.category}</td>
                <td>{project.featured ? 'Yes' : 'No'}</td>
                <td className={styles.actions}>
                  <button 
                    className={styles.edit}
                    onClick={() => router.push(`/admin/projects/edit/${project.id}`)}
                  >
                    Edit
                  </button>
                  <button 
                    className={styles.delete}
                    onClick={() => handleDelete(project.id)}
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