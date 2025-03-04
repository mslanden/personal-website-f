// API service for communicating with the backend
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
