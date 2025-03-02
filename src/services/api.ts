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
  console.log("Sending message to API:", payload);
  const response = await fetch(`${API_BASE_URL}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    mode: 'cors',
    body: JSON.stringify(payload),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`API error: ${response.status} ${response.statusText}`, errorText);
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

export async function getConversation(conversationId: string) {
  console.log("Getting conversation:", conversationId);
  const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
    mode: 'cors',
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`API error: ${response.status} ${response.statusText}`, errorText);
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

export async function createConversation(userId: string, title: string) {
  console.log("Creating conversation for user:", userId, "with title:", title);
  const payload = {
    user_id: userId,
    title: title
  };
  
  console.log("Request URL:", `${API_BASE_URL}/conversations`);
  console.log("Request payload:", JSON.stringify(payload));
  
  const response = await fetch(`${API_BASE_URL}/conversations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    mode: 'cors',
    body: JSON.stringify(payload),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`API error: ${response.status} ${response.statusText}`, errorText);
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  
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