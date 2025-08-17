
import { useState } from 'react';

export interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp?: Date;
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, { ...message, timestamp: new Date() }]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    addMessage,
    clearMessages
  };
};
