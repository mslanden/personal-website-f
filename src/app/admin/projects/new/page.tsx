'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, createProject, Project } from '../../../../lib/supabase-client';
import styles from '../../admin.module.css';
import ImageUploader from '../../../../components/ImageUploader';

export default function NewProjectPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    image_url: '',
    category: '',
    featured: false,
    technologies: [] as string[],
    features: [] as string[],
  });
  const [techInput, setTechInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');
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

  const addTechnology = () => {
    if (techInput.trim() !== '' && !formData.technologies.includes(techInput.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput.trim()],
      });
      setTechInput('');
    }
  };

  const removeTechnology = (tech: string) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter(t => t !== tech),
    });
  };
  
  const addFeature = () => {
    if (featureInput.trim() !== '' && !formData.features.includes(featureInput.trim())) {
      setFormData({
        ...formData,
        features: [...formData.features, featureInput.trim()],
      });
      setFeatureInput('');
    }
  };

  const removeFeature = (feature: string) => {
    setFormData({
      ...formData,
      features: formData.features.filter(f => f !== feature),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // No need to validate image URLs anymore as they come directly from storage
      
      const newProject = await createProject(formData as Omit<Project, 'id'>);
      
      if (newProject) {
        router.push('/admin/projects');
      } else {
        setError('Failed to create project');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating the project');
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
      <h1>Create New Project</h1>
      
      <div className={styles.nav}>
        <button onClick={() => router.push('/admin/projects')}>Back to Projects</button>
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
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
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
          <label>Technologies</label>
          <div style={{ display: 'flex', marginBottom: '0.5rem' }}>
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              placeholder="Add a technology..."
              style={{ flexGrow: 1, marginRight: '0.5rem' }}
            />
            <button 
              type="button" 
              onClick={addTechnology}
              style={{ padding: '0.5rem 1rem' }}
            >
              Add
            </button>
          </div>
          
          {formData.technologies.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
              {formData.technologies.map((tech) => (
                <div 
                  key={tech}
                  style={{ 
                    backgroundColor: '#f0f0f0', 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTechnology(tech)}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer',
                      color: '#666',
                      fontSize: '1rem',
                      padding: '0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '20px',
                      height: '20px'
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className={styles.formGroup}>
          <label>Key Features</label>
          <div style={{ display: 'flex', marginBottom: '0.5rem' }}>
            <input
              type="text"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              placeholder="Add a key feature..."
              style={{ flexGrow: 1, marginRight: '0.5rem' }}
            />
            <button 
              type="button" 
              onClick={addFeature}
              style={{ padding: '0.5rem 1rem' }}
            >
              Add
            </button>
          </div>
          
          {formData.features.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
              {formData.features.map((feature) => (
                <div 
                  key={feature}
                  style={{ 
                    backgroundColor: '#f0f0f0', 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {feature}
                  <button
                    type="button"
                    onClick={() => removeFeature(feature)}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer',
                      color: '#666',
                      fontSize: '1rem',
                      padding: '0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '20px',
                      height: '20px'
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className={styles.formGroup}>
          <label>
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
            />
            Featured Project
          </label>
        </div>
        
        <button 
          type="submit" 
          className={styles.button}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Project'}
        </button>
      </form>
    </div>
  );
}