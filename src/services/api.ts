// API service for communicating with the backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://0r8o786206.execute-api.us-east-1.amazonaws.com/dev';
console.log("Using API base URL:", API_BASE_URL);

// Types
interface MessagePayload {
  user_id: string;
  conversation_id: string;
  content: string;
  role: 'user';
}

// Chat/Message functions
export async function sendMessage(payload: MessagePayload) {
  const response = await fetch(`${API_BASE_URL}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  return response.json();
}

export async function getConversation(conversationId: string) {
  const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}`);
  return response.json();
}

export async function createConversation(userId: string, title: string) {
  const response = await fetch(`${API_BASE_URL}/conversations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: userId,
      title: title
    }),
  });
  return response.json();
}

// Note functions
export async function getUserNotes(userId: string) {
  const response = await fetch(`${API_BASE_URL}/notes/${userId}`);
  return response.json();
}

export async function createNote(userId: string, title: string, content: string) {
  const response = await fetch(`${API_BASE_URL}/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: userId,
      title: title,
      content: content
    }),
  });
  return response.json();
}

// Schedule functions
export async function getUserSchedules(userId: string) {
  const response = await fetch(`${API_BASE_URL}/schedules/${userId}`);
  return response.json();
}

export async function createSchedule(scheduleData: any) {
  const response = await fetch(`${API_BASE_URL}/schedules`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(scheduleData),
  });
  return response.json();
}