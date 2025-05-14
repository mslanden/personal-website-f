'use client';

import { useState } from 'react';
import ChatWidget from './ChatWidget';
import Image from 'next/image';
import styles from './GlobalChatWidget.module.css';

export default function GlobalChatWidget() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Button */}
      <button 
        className={styles.floatingChatButton} 
        onClick={() => setIsChatOpen(true)}
        aria-label="Chat with Assistant"
      >
        <Image
          src="/images/chatbot-avatar.png"
          alt="AI Assistant"
          width={50}
          height={50}
          style={{ borderRadius: '50%', objectFit: 'cover' }}
        />
      </button>
      
      {/* Chat Widget */}
      <ChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}
