
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Send, Loader2, Heart, MoreVertical, Brain } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import BreathingExerciseWidget from '@/components/widgets/BreathingExerciseWidget';
import EmergencyHelpWidget from '@/components/widgets/EmergencyHelpWidget';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'mindmate';
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
  widget?: {
    type: 'breathing_exercise' | 'emergency_help';
    data: any;
  };
}

interface MindMateEnhancedProps {
  onBack: () => void;
}

const MindMateEnhanced: React.FC<MindMateEnhancedProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { getPersonalizedSystemInstruction } = useProfile();
  const { toast } = useToast();
  const conversationSavedRef = useRef(false);

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

  const analyzeAndSaveConversation = async () => {
    // Only analyze if there are meaningful messages (more than just the greeting)
    if (messages.length <= 2 || conversationSavedRef.current) {
      return;
    }

    try {
      setIsAnalyzing(true);
      console.log('Analyzing conversation...');

      const conversationMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log('No session, skipping analysis');
        return;
      }

      const { data, error } = await supabase.functions.invoke('analyze-conversation', {
        body: { messages: conversationMessages }
      });

      if (error) {
        console.error('Error analyzing conversation:', error);
        return;
      }

      conversationSavedRef.current = true;

      if (data?.memoriesExtracted > 0) {
        toast({
          title: 'Memories Saved',
          description: `${data.memoriesExtracted} key insight${data.memoriesExtracted > 1 ? 's' : ''} added to your MindArchive`,
        });
      }

      console.log('Conversation analyzed:', data);
    } catch (error) {
      console.error('Error in analyzeAndSaveConversation:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleManualAnalysis = async () => {
    if (messages.length <= 1) {
      toast({
        title: 'No Conversation',
        description: 'Start a conversation first before analyzing',
        variant: 'destructive',
      });
      return;
    }

    await analyzeAndSaveConversation();
  };

  const handleBack = async () => {
    await analyzeAndSaveConversation();
    onBack();
  };

  useEffect(() => {
    // Cleanup: analyze conversation when component unmounts
    return () => {
      if (messages.length > 2 && !conversationSavedRef.current) {
        analyzeAndSaveConversation();
      }
    };
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

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Please sign in to use MindMate');
      }

      const { data, error } = await supabase.functions.invoke('mindmate-chat', {
        body: {
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
        }
      });

      if (error) {
        throw error;
      }
      const mindMateResponse = data.reply || "I'm here for you, but I'm having trouble connecting right now. Could you try again?";

      const newMessages: Message[] = [];

      // Add AI response message
      newMessages.push({
        id: (Date.now() + 1).toString(),
        content: mindMateResponse,
        sender: 'mindmate',
        role: 'assistant',
        timestamp: new Date()
      });

      // Add widget messages if tool calls were made
      if (data.toolCalls && Array.isArray(data.toolCalls)) {
        data.toolCalls.forEach((toolCall: any, index: number) => {
          newMessages.push({
            id: (Date.now() + 2 + index).toString(),
            content: '',
            sender: 'mindmate',
            role: 'assistant',
            timestamp: new Date(),
            widget: {
              type: toolCall.type,
              data: toolCall
            }
          });
        });
      }

      setMessages(prev => [...prev, ...newMessages]);
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

  const formatMessageContent = (content: string) => {
    // Split into lines for processing
    const lines = content.split('\n');
    const formatted: JSX.Element[] = [];
    let key = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Heading 1: *(text)*
      if (line.match(/^\*([^*]+)\*$/)) {
        const text = line.replace(/^\*([^*]+)\*$/, '$1');
        formatted.push(<h1 key={key++} className="text-xl font-bold mt-4 mb-2">{text}</h1>);
      }
      // Heading 2: **(text)**
      else if (line.match(/^\*\*([^*]+)\*\*$/)) {
        const text = line.replace(/^\*\*([^*]+)\*\*$/, '$1');
        formatted.push(<h2 key={key++} className="text-lg font-semibold mt-3 mb-2">{text}</h2>);
      }
      // Heading 3: ***(text)***
      else if (line.match(/^\*\*\*([^*]+)\*\*\*$/)) {
        const text = line.replace(/^\*\*\*([^*]+)\*\*\*$/, '$1');
        formatted.push(<h3 key={key++} className="text-base font-semibold mt-2 mb-1">{text}</h3>);
      }
      // Bullet list: * item
      else if (line.match(/^\* /)) {
        const text = line.replace(/^\* /, '');
        formatted.push(<li key={key++} className="ml-4 mb-1">{text}</li>);
      }
      // Numbered list: 1. item
      else if (line.match(/^\d+\. /)) {
        const text = line.replace(/^\d+\. /, '');
        const number = line.match(/^(\d+)\./)?.[1];
        formatted.push(<li key={key++} className="ml-4 mb-1" value={number}>{text}</li>);
      }
      // Regular text
      else if (line.trim()) {
        formatted.push(<p key={key++} className="mb-2">{line}</p>);
      }
      // Empty line
      else {
        formatted.push(<br key={key++} />);
      }
    }

    return <div>{formatted}</div>;
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="flex items-center gap-3 p-4 border-b bg-white dark:bg-gray-800 shadow-sm">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Avatar className="h-10 w-10 bg-gradient-to-r from-purple-500 to-pink-500">
          <AvatarFallback className="text-lg text-white">
            <Heart className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">MindMate</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Your caring companion</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleManualAnalysis} disabled={isAnalyzing}>
              <Brain className="h-4 w-4 mr-2" />
              {isAnalyzing ? 'Analyzing...' : 'Save Memories Now'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>


      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'mindmate' && !message.widget && (
                <Avatar className="h-8 w-8 mt-1 bg-gradient-to-r from-purple-500 to-pink-500">
                  <AvatarFallback className="text-sm text-white">
                    <Heart className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
              {message.widget ? (
                <div className="max-w-[80%]">
                  {message.widget.type === 'breathing_exercise' && (
                    <BreathingExerciseWidget
                      cycles={message.widget.data.cycles}
                      onSkip={() => {}}
                      onComplete={() => {}}
                    />
                  )}
                  {message.widget.type === 'emergency_help' && (
                    <EmergencyHelpWidget
                      country={message.widget.data.country}
                      onDismiss={() => {}}
                    />
                  )}
                </div>
              ) : (
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  {message.content && (
                    <div className="text-sm leading-relaxed">
                      {formatMessageContent(message.content)}
                    </div>
                  )}
                </div>
              )}
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
