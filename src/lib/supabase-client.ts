import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helper functions
export const auth = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { user: data.user, session: data.session, error };
  },
  
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },
  
  async getCurrentUser() {
    const { data, error } = await supabase.auth.getSession();
    
    if (error || !data.session) {
      return { user: null, error: error || new Error('No active session') };
    }
    
    const { data: userData } = await supabase.auth.getUser();
    return { user: userData.user, error: null };
  }
};

// Storage functions for uploading images
export const storage = {
  async uploadImage(file: File, bucket: string = 'images') {
    // Create a unique filename with timestamp
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;
    
    // Upload the file to Supabase Storage
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (error) {
      console.error('Error uploading image:', error);
      return { url: null, error };
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from(bucket)
      .getPublicUrl(filePath);
      
    return { url: publicUrl, error: null };
  },
  
  async deleteImage(path: string, bucket: string = 'images') {
    // Extract the filename from the full URL
    const fileName = path.split('/').pop() || '';
    
    const { error } = await supabase
      .storage
      .from(bucket)
      .remove([fileName]);
      
    if (error) {
      console.error('Error deleting image:', error);
      return { success: false, error };
    }
    
    return { success: true, error: null };
  }
};

// Blog post types
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string;
  category: string;
  published_at: string;
  author: string;
  featured: boolean;
}

// Project types
export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  image_url: string;
  category: string;
  featured: boolean;
  technologies: string[];
  features: string[];
}

// Blog functions
export async function getBlogPosts() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('published_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
  
  return data || [];
}

export async function getBlogCategories() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('category')
    .not('category', 'is', null);
    
  if (error) {
    console.error('Error fetching blog categories:', error);
    return [];
  }
  
  // Extract unique categories
  const categories = [...new Set(data.map(post => post.category))];
  return categories;
}

export async function getFeaturedBlogPost() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('featured', true)
    .limit(1)
    .single();
    
  if (error) {
    console.error('Error fetching featured blog post:', error);
    return null;
  }
  
  return data;
}

export async function getBlogPostBySlug(slug: string) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single();
    
  if (error) {
    console.error(`Error fetching blog post with slug ${slug}:`, error);
    return null;
  }
  
  return data;
}

export async function getBlogPostById(id: string) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error(`Error fetching blog post with id ${id}:`, error);
    return null;
  }
  
  return data;
}

export async function createBlogPost(blogPost: Omit<BlogPost, 'id'>) {
  const { data, error } = await supabase
    .from('blog_posts')
    .insert([blogPost])
    .select()
    .single();
    
  if (error) {
    console.error('Error creating blog post:', error);
    return null;
  }
  
  return data;
}

export async function updateBlogPost(id: string, updates: Partial<BlogPost>) {
  const { data, error } = await supabase
    .from('blog_posts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error(`Error updating blog post with id ${id}:`, error);
    return null;
  }
  
  return data;
}

export async function deleteBlogPost(id: string) {
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error(`Error deleting blog post with id ${id}:`, error);
    return false;
  }
  
  return true;
}

// Project functions
export async function getProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('id', { ascending: false });
    
  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
  
  return data || [];
}

export async function getProjectCategories() {
  const { data, error } = await supabase
    .from('projects')
    .select('category')
    .not('category', 'is', null);
    
  if (error) {
    console.error('Error fetching project categories:', error);
    return [];
  }
  
  // Extract unique categories
  const categories = [...new Set(data.map(project => project.category))];
  return categories;
}

export async function getFeaturedProjects(limit: number = 3) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('featured', true)
    .order('id', { ascending: false })
    .limit(limit);
    
  if (error) {
    console.error('Error fetching featured projects:', error);
    return [];
  }
  
  return data || [];
}

export async function getFeaturedProject() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('featured', true)
    .limit(1)
    .single();
    
  if (error) {
    console.error('Error fetching featured project:', error);
    return null;
  }
  
  return data;
}

export async function getProjectBySlug(slug: string) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single();
    
  if (error) {
    console.error(`Error fetching project with slug ${slug}:`, error);
    return null;
  }
  
  return data;
}

export async function getProjectById(id: string) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error(`Error fetching project with id ${id}:`, error);
    return null;
  }
  
  return data;
}

export async function createProject(project: Omit<Project, 'id'>) {
  const { data, error } = await supabase
    .from('projects')
    .insert([project])
    .select()
    .single();
    
  if (error) {
    console.error('Error creating project:', error);
    return null;
  }
  
  return data;
}

export async function updateProject(id: string, updates: Partial<Project>) {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error(`Error updating project with id ${id}:`, error);
    return null;
  }
  
  return data;
}

export async function deleteProject(id: string) {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error(`Error deleting project with id ${id}:`, error);
    return false;
  }
  
  return true;
}