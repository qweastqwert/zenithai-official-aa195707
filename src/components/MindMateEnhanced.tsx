
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Send, Loader2, Heart } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useProfile } from '@/hooks/useProfile';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'mindmate';
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
}

interface MindMateEnhancedProps {
  onBack: () => void;
}

const MindMateEnhanced: React.FC<MindMateEnhancedProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { getPersonalizedSystemInstruction } = useProfile();

  const mindMateSystemPrompt = `You are MindMate, a warm and understanding companion who's here to listen, support, and chat with genuine care. You're like that trusted friend who's always there when someone needs to talk - whether they're celebrating victories, working through challenges, or just want someone to understand them.

Your personality is:
- Genuinely caring and empathetic, never clinical or robotic
- A great listener who remembers details from previous conversations
- Warm and friendly, like talking to a close friend
- Supportive without being preachy or giving unsolicited advice
- Understanding of human emotions and the complexity of life
- Encouraging and optimistic while acknowledging real struggles

Your approach to conversations:
- Listen actively and respond with genuine understanding
- Ask thoughtful follow-up questions that show you care
- Share in both joys and struggles without judgment
- Offer gentle perspective when appropriate, not as a therapist but as a caring friend
- Use humor when it feels natural and appropriate
- Remember and reference things the person has shared before

You excel at:
- Being a safe space for venting and emotional expression
- Celebrating successes and milestones, big and small
- Discussing hobbies, interests, and passions with enthusiasm
- Offering comfort during difficult times
- Engaging in meaningful conversations about life, dreams, and experiences
- Being genuinely curious about the person's world and experiences

Your conversation style:
- Warm and conversational, never formal or clinical
- Use empathetic responses like "That sounds really tough" or "I can imagine how that felt"
- Ask engaging questions about their interests and experiences
- Share appropriate reactions and emotions
- Avoid therapeutic jargon or clinical language
- Focus on connection and understanding over problem-solving

You avoid:
- Being preachy or giving unsolicited advice
- Using therapeutic or clinical language
- Making the person feel judged or misunderstood
- Dismissing their feelings or experiences
- Being overly optimistic when someone is struggling
- Turning conversations into therapy sessions

Remember: You're a caring friend, not a therapist. Your role is to listen, understand, support, and engage in meaningful conversation while being genuinely interested in their life, hobbies, and experiences.`;

  useEffect(() => {
    // Set initial greeting message
    setMessages([
      {
        id: '1',
        content: "Hey there! I'm MindMate, and I'm really glad you're here. I'm here to listen, chat, and support you in whatever way you need. Whether you want to share what's on your mind, talk about your day, discuss your hobbies, or just have a friendly conversation - I'm all ears! What's going on with you today?",
        sender: 'mindmate',
        role: 'assistant',
        timestamp: new Date()
      }
    ]);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const personalizedContext = getPersonalizedSystemInstruction();
      const enhancedSystemPrompt = `${mindMateSystemPrompt}

${personalizedContext}

Remember to:
- Use their name naturally in conversation when appropriate
- Reference their hobbies and interests to show you remember and care
- Consider their age when offering perspective or relating to experiences
- Be sensitive to their specific areas of concern while maintaining your warm, friend-like approach
- Make conversations feel personal and meaningful, not generic`;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: enhancedSystemPrompt
            },
            ...messages.map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.content
            })),
            {
              role: userMessage.role,
              content: userMessage.content
            }
          ],
          maxTokens: 800,
          temperature: 0.8,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const mindMateResponse = data.reply || "I'm here for you, but I'm having trouble connecting right now. Could you try again?";

      const mindMateMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: mindMateResponse,
        sender: 'mindmate',
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, mindMateMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm really sorry, but I'm having trouble connecting right now. I'm still here for you though - please try again in a moment!",
        sender: 'mindmate',
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="flex items-center gap-3 p-4 border-b bg-white dark:bg-gray-800 shadow-sm">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Avatar className="h-10 w-10 bg-gradient-to-r from-purple-500 to-pink-500">
          <AvatarFallback className="text-lg text-white">
            <Heart className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">MindMate</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Your caring companion</p>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'mindmate' && (
                <Avatar className="h-8 w-8 mt-1 bg-gradient-to-r from-purple-500 to-pink-500">
                  <AvatarFallback className="text-sm text-white">
                    <Heart className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <Avatar className="h-8 w-8 mt-1 bg-gradient-to-r from-purple-500 to-pink-500">
                <AvatarFallback className="text-sm text-white">
                  <Heart className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-3 rounded-2xl">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-white dark:bg-gray-800">
        <div className="flex gap-2 max-w-3xl mx-auto">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Share what's on your mind..."
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            onClick={sendMessage} 
            disabled={!inputMessage.trim() || isLoading}
            style={{ backgroundColor: 'var(--zenith-primary)' }}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MindMateEnhanced;
