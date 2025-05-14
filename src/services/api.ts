// API service for communicating with the backend
import { supabase } from '../utils/supabase';

// Get Maya webhook URL from environment variable
const MAYA_WEBHOOK_URL = process.env.NEXT_PUBLIC_MAYA_WEBHOOK_URL || "";

// Types
interface MessagePayload {
  user_id: string;
  conversation_id: string;
  content: string;
  role: "user";
}

// Chat/Message functions
export async function sendMessage(payload: MessagePayload) {
  console.log("Sending message to Maya webhook:", payload);
  
  if (!MAYA_WEBHOOK_URL) {
    console.error("Maya webhook URL is not configured. Please set the NEXT_PUBLIC_MAYA_WEBHOOK_URL environment variable.");
    throw new Error("Maya webhook URL not configured");
  }

  try {
    const response = await fetch(MAYA_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        message: payload.content,
        user_id: payload.user_id,
        conversation_id: payload.conversation_id,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Webhook error: ${response.status} ${response.statusText}`,
        errorText,
      );
      throw new Error(
        `Webhook error: ${response.status} ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending message to Maya webhook:", error);
    throw error;
  }
}

export async function getConversation(conversationId: string) {
  console.log("Getting conversation:", conversationId);
  // Since we're only using the webhook now, just return a mock response
  return {
    status: "success",
    data: {
      id: conversationId,
      messages: [],
    },
  };
}

export async function createConversation(userId: string, title: string) {
  console.log("Creating conversation for user:", userId, "with title:", title);

  // Since we're only using the webhook now, just return a mock conversation ID
  const conversationId = `conv-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  return {
    status: "success",
    data: {
      id: conversationId,
      user_id: userId,
      title: title,
      created_at: new Date().toISOString(),
    },
  };
}

// Note functions
export async function getUserNotes(userId: string) {
  console.log("getUserNotes is not implemented with the webhook");
  return { status: "error", message: "This functionality is not available" };
}

export async function createNote(
  userId: string,
  title: string,
  content: string,
) {
  console.log("createNote is not implemented with the webhook");
  return { status: "error", message: "This functionality is not available" };
}

// Schedule functions
export async function getUserSchedules(userId: string) {
  console.log("getUserSchedules is not implemented with the webhook");
  return { status: "error", message: "This functionality is not available" };
}

export async function createSchedule(scheduleData: any) {
  console.log("createSchedule is not implemented with the webhook");
  return { status: "error", message: "This functionality is not available" };
}

// Contact form functions
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function submitContactForm(formData: ContactFormData) {
  try {
    // For public forms, we'll use a serverless function approach
    // Store the submission data in local storage temporarily
    const submissionData = {
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      status: 'new',
      created_at: new Date().toISOString()
    };
    
    // Use a more reliable approach - fetch with the anon key explicitly
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables');
    }
    
    const response = await fetch(`${supabaseUrl}/rest/v1/contact_submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(submissionData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error submitting contact form:', errorText);
      return { status: 'error', message: 'Failed to submit your message', error: errorText };
    }
    
    return { status: 'success', message: 'Your message has been sent!', data: submissionData };
  } catch (error) {
    console.error('Exception submitting contact form:', error);
    return { status: 'error', message: 'An unexpected error occurred', error };
  }
}
