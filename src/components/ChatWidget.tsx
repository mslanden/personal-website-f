"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import styles from "./ChatWidget.module.css";
import { sendMessage, createConversation } from "../services/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  sender: "user" | "assistant";
  text: string;
}

function sanitizeResponse(text: string) {
  return text;
}

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatWidget({ isOpen, onClose }: ChatWidgetProps) {
  const [userInput, setUserInput] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<Message[]>([
    { sender: "assistant", text: "How can I assist you today?" },
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusState, setStatusState] = useState<
    "idle" | "loading" | "speaking" | "typing"
  >("idle");
  const chatOutputRef = useRef<HTMLDivElement>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const userId = "temp-user-" + Math.random().toString(36).substring(2, 9);

  const [isUserTyping, setIsUserTyping] = useState<boolean>(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize conversation with the Lambda backend
  useEffect(() => {
    if (isOpen && !conversationId) {
      initConversation();
    }
  }, [isOpen, conversationId]);

  const initConversation = async () => {
    try {
      const response = await createConversation(userId, "Website Chat");
      if (response.status === "success" && response.data && response.data.id) {
        setConversationId(response.data.id);
        console.log("Conversation created with ID:", response.data.id);
      } else {
        console.error("Failed to create conversation:", response);
      }
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  // Update the typing flag on every input change
  const handleUserTyping = () => {
    setIsUserTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsUserTyping(false);
    }, 1000);
  };

  // Update statusState based on isUserTyping
  useEffect(() => {
    if (["loading", "speaking"].includes(statusState)) return;
    setStatusState(isUserTyping ? "typing" : "idle");
  }, [isUserTyping, statusState]);

  // Scroll chat to bottom on updates
  useEffect(() => {
    if (chatOutputRef.current) {
      const container = chatOutputRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatHistory, statusState]);

  const handleSend = async () => {
    setIsUserTyping(false);
    const input = userInput.trim();
    if (!input || !conversationId) return;
    
    setChatHistory((prev) => [...prev, { sender: "user", text: input }]);
    setUserInput("");
    setLoading(true);
    setStatusState("loading");
    
    try {
      const response = await sendMessage({
        user_id: userId,
        conversation_id: conversationId,
        content: input,
        role: "user"
      });
      
      setStatusState("speaking");
      
      console.log("Response from Maya webhook:", response);
      
      // Handle different response formats
      if (response) {
        let assistantMessage = "I'm not sure how to respond to that.";
        
        // Check for the new format with 'output' field
        if (response.output) {
          assistantMessage = response.output;
        }
        // Check for the old format with status and data
        else if (response.status === "success" && response.data && response.data.content) {
          assistantMessage = response.data.content;
        }
        
        setChatHistory((prev) => [
          ...prev,
          { sender: "assistant", text: assistantMessage },
        ]);
      } else {
        console.error("Empty response received");
        setChatHistory((prev) => [
          ...prev,
          { sender: "assistant", text: "Sorry, I encountered an error processing your request." },
        ]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setChatHistory((prev) => [
        ...prev,
        { sender: "assistant", text: "Sorry, there was an error communicating with the server." },
      ]);
    } finally {
      setLoading(false);
      setStatusState("idle");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    handleUserTyping();
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.chatWidgetContainer}>
      <div className={styles.chatHeader}>
        <div className={styles.chatHeaderLeft}>
          <img
            src="/images/chatbot-avatar.png"
            alt="AI Assistant"
            className={styles.chatAvatar}
          />
          <div className={styles.chatHeaderInfo}>
            <h3>AI Assistant</h3>
            <div className={styles.statusIndicator}>
              <div className={`${styles.statusDot} ${styles[statusState]}`} />
              <span>{statusState === "idle" ? "Online" : statusState}</span>
            </div>
          </div>
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          <svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" fill="currentColor"/>
          </svg>
        </button>
      </div>
      
      <div className={styles.chatMessages} ref={chatOutputRef}>
        {chatHistory.map((msg, idx) => (
          <div
            key={idx}
            className={`${styles.messageContainer} ${msg.sender === "user" ? styles.userMessage : ""}`}
          >
            {msg.sender !== "user" && (
              <img
                src="/images/chatbot-avatar.png"
                alt="AI Assistant"
                className={styles.messagePicture}
              />
            )}
            <div className={styles.messageContent}>
              {msg.sender === "user" ? (
                sanitizeResponse(msg.text)
              ) : (
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code: ({node, inline, className, children, ...props}) => {
                      return !inline ? (
                        <pre className={styles.markdownPre}>
                          <code className={className} {...props}>
                            {children}
                          </code>
                        </pre>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    }
                  }}
                >
                  {sanitizeResponse(msg.text)}
                </ReactMarkdown>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.chatInputContainer}>
        <textarea
          className={styles.chatInput}
          placeholder="Type your message..."
          value={userInput}
          onChange={(e) => {
            setUserInput(e.target.value);
            handleUserTyping();
          }}
          onKeyDown={handleKeyDown}
        />
        <button
          className={styles.sendButton}
          onClick={handleSend}
          disabled={loading}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
