"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import styles from "./page.module.css";
import SchedulingPanel from "../../components/SchedulingPanel";
import DocumentViewer from "../../components/DocumentViewer";

interface Message {
  sender: "user" | "assistant";
  text: string;
}

function sanitizeResponse(text: string) {
  return text.replace(/[`]/g, "");
}

export default function ChatPage() {
  const [userInput, setUserInput] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<Message[]>([
    { sender: "assistant", text: "How can I assist you today?" },
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusState, setStatusState] = useState<
    "idle" | "loading" | "speaking" | "typing"
  >("idle");
  const chatOutputRef = useRef<HTMLDivElement>(null);

  const [isUserTyping, setIsUserTyping] = useState<boolean>(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [panel, setPanel] = useState<{
    visible: boolean;
    type: string | null;
    content: string | null;
  }>({
    visible: false,
    type: null,
    content: null,
  });

  // Update the typing flag on every input change
  const handleUserTyping = () => {
    setIsUserTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsUserTyping(false);
    }, 1000); // 1 second delay after the last key press
  };

  // Use effect to update statusState based on isUserTyping,
  // but ignore it during 'loading' or 'speaking' states.
  useEffect(() => {
    if (["loading", "speaking"].includes(statusState)) return;
    setStatusState(isUserTyping ? "typing" : "idle");
  }, [isUserTyping, statusState]);

  // Scroll chat to bottom on updates.
  useEffect(() => {
    if (chatOutputRef.current) {
      const container = chatOutputRef.current;
      const shouldScroll =
        container.scrollTop + container.clientHeight >=
        container.scrollHeight - 100; // 100px threshold

      if (!shouldScroll) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  }, [chatHistory, statusState]);

  const handleSend = async () => {
    // Reset typing flag when sending
    setIsUserTyping(false);
    const input = userInput.trim();
    if (!input) return;
    setChatHistory((prev) => [...prev, { sender: "user", text: input }]);
    setUserInput("");
    setLoading(true);

    setStatusState("loading");
    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ input }),
      });
      const data = await res.json();
      setStatusState("speaking");
      setChatHistory((prev) => [
        ...prev,
        { sender: "assistant", text: data.response },
      ]);

      setTimeout(() => {
        setStatusState("idle");
      }, 2000);

      if (data.right_card_content_type) {
        console.log("API Response:", data);
        setPanel({
          visible: true,
          type: data.right_card_content_type.toLowerCase(),
          content: data.right_card_content,
        });
        console.log("Setting Panel:", {
          type: data.right_card_content_type.toLowerCase(),
          content: data.right_card_content,
        });
      } else {
        setPanel({ visible: false, type: null, content: null });
      }
    } catch (error: any) {
      console.error("Error:", error);
      setStatusState("idle");
      setChatHistory((prev) => [
        ...prev,
        {
          sender: "assistant",
          text: "Sorry, I'm having trouble connecting. Please try again later.",
        },
      ]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Every key press indicates active typing
    handleUserTyping();

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <a href="/" style={{ textDecoration: 'none', outline: 'none' }}>
            <img src="/logo.svg" alt="Logo" className={styles.logo} />
          </a>
        </div>
        <div className={styles.chatContainer}>
          <div
            className={`${styles.statusIndicator} ${statusState !== "idle" ? styles.active : ""}`}
          >
            <div className={`${styles.statusDot} ${styles[statusState]}`} />
          </div>
          <div className={styles.outputContent} ref={chatOutputRef}>
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`${styles.messageContainer} ${msg.sender === "user" ? styles.userMessage : ""}`}
              >
                {msg.sender !== "user" && (
                  <img
                    src="/images/chatbot-avatar-v16.webp"
                    alt="Maya"
                    className={styles.profilePicture}
                  />
                )}
                <div className={styles.messageContent}>
                  {sanitizeResponse(msg.text)}
                </div>
              </div>
            ))}
          </div>
          <div className={styles.inputContainer}>
            <textarea
              className={styles.aiInput}
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
              Send
            </button>
          </div>
        </div>
        {panel.visible && panel.type === "calendar" && (
          <>
            <div
              className={`${styles.backdrop} ${panel.visible ? styles.visible : ""}`}
              onClick={() =>
                setPanel({ visible: false, type: null, content: null })
              }
            />
            <SchedulingPanel
              onClose={() =>
                setPanel({ visible: false, type: null, content: null })
              }
              visible={panel.visible}
            />
          </>
        )}
        {panel.visible &&
          (panel.type === "html" ||
            panel.type === "image" ||
            panel.type === "markdown") && (
            <DocumentViewer
              contentType={panel.type}
              content={panel.content}
              onClose={() =>
                setPanel({ visible: false, type: null, content: null })
              }
            />
          )}
      </div>
    </div>
  );
}
