import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for common Supabase operations
export const auth = {
  signUp: async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    
    return { data, error };
  },
  
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { data, error };
  },
  
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },
  
  getCurrentUser: async () => {
    const { data, error } = await supabase.auth.getUser();
    return { user: data?.user, error };
  },
  
  resetPassword: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    return { data, error };
  },
};

export const database = {
  // Conversations
  getConversations: async () => {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .order('updated_at', { ascending: false });
    
    return { data, error };
  },
  
  getConversation: async (id: string) => {
    const { data, error } = await supabase
      .from('conversations')
      .select('*, messages(*)')
      .eq('id', id)
      .single();
    
    return { data, error };
  },
  
  createConversation: async (title: string, userId: string) => {
    const { data, error } = await supabase
      .from('conversations')
      .insert([{ title, user_id: userId }])
      .select()
      .single();
    
    return { data, error };
  },
  
  // Messages
  getMessages: async (conversationId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at');
    
    return { data, error };
  },
  
  createMessage: async (content: string, conversationId: string, userId: string, role = 'user') => {
    const { data, error } = await supabase
      .from('messages')
      .insert([{ content, conversation_id: conversationId, user_id: userId, role }])
      .select()
      .single();
    
    return { data, error };
  },
  
  // Notes
  getNotes: async () => {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('updated_at', { ascending: false });
    
    return { data, error };
  },
  
  createNote: async (title: string, content: string, userId: string, tags: string[] = []) => {
    const { data, error } = await supabase
      .from('notes')
      .insert([{ title, content, user_id: userId, tags }])
      .select()
      .single();
    
    return { data, error };
  },
  
  // Schedules
  getSchedules: async () => {
    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .order('start_time');
    
    return { data, error };
  },
  
  createSchedule: async (scheduleData: any) => {
    const { data, error } = await supabase
      .from('schedules')
      .insert([scheduleData])
      .select()
      .single();
    
    return { data, error };
  },
};