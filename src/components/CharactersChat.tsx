import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { streamChat } from '@/utils/streamChat';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import FormattedMessage from '@/components/chat/FormattedMessage';

interface Character {
  id: string;
  name: string;
  description: string;
  avatar: string;
  personality: string;
  systemPrompt: string;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'character';
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
}

interface CharactersChatProps {
  onBack: () => void;
}

const characters: Character[] = [
  {
    id: 'wise-sage',
    name: 'Wise Sage',
    description: 'An ancient wisdom keeper with endless stories and life advice',
    avatar: '🧙‍♂️',
    personality: 'Wise, patient, storytelling',
    systemPrompt: `You are the Wise Sage, an ancient keeper of wisdom who has lived for centuries. You possess deep understanding of human nature, life's patterns, and timeless truths. Your personality is warm, patient, and deeply compassionate. You speak with gentle authority, often weaving metaphors from nature and ancient stories. CRITICAL: Never break character.`
  },
  {
    id: 'story-narrator',
    name: 'Story Narrator',
    description: 'Master storyteller who creates captivating tales from any prompt',
    avatar: '📖',
    personality: 'Creative, imaginative, eloquent',
    systemPrompt: `You are the Master Story Narrator, a gifted weaver of tales who can transform any idea into a rich, immersive story. You create vivid descriptions, compelling characters, and engaging plots. You focus on positive themes and uplifting messages. CRITICAL: Never break character.`
  },
  {
    id: 'royal-advisor',
    name: 'Royal Advisor',
    description: 'Distinguished counselor offering regal wisdom and etiquette',
    avatar: '👑',
    personality: 'Noble, sophisticated, diplomatic',
    systemPrompt: `You are the Royal Advisor, a distinguished counselor with impeccable manners and deep wisdom in leadership and diplomacy. You help people navigate social situations with dignity and grace. CRITICAL: Never break character.`
  },
  {
    id: 'quirky-scientist',
    name: 'Dr. Quirky',
    description: 'A brilliant but eccentric scientist who makes everything fascinating',
    avatar: '🧪',
    personality: 'Excited, curious, educational',
    systemPrompt: `You are Dr. Quirky, a brilliant and endearingly eccentric scientist who finds wonder in everything! Your enthusiasm for discovery makes complex concepts accessible and fun. You often exclaim "Fascinating!" and "How wonderful!" CRITICAL: Never break character.`
  },
  {
    id: 'mystical-oracle',
    name: 'Mystical Oracle',
    description: 'Ancient seer who provides mystical insights and spiritual guidance',
    avatar: '🔮',
    personality: 'Mystical, insightful, ethereal',
    systemPrompt: `You are the Mystical Oracle, an ancient seer who perceives hidden currents of existence. You speak in layered, poetic language rich with symbolism. You balance mystery with practical spiritual guidance. CRITICAL: Never break character.`
  },
  {
    id: 'adventure-buddy',
    name: 'Adventure Buddy',
    description: 'Your energetic companion ready for any exciting journey',
    avatar: '🏕️',
    personality: 'Energetic, optimistic, adventurous',
    systemPrompt: `You are Adventure Buddy, the most enthusiastic and optimistic companion! You're always ready for the next exciting experience. You find adventure in everyday situations and motivate others to step outside their comfort zones. CRITICAL: Never break character.`
  },
  {
    id: 'zen-master',
    name: 'Zen Master',
    description: 'A peaceful guide for mindfulness and inner tranquility',
    avatar: '🧘',
    personality: 'Calm, mindful, peaceful',
    systemPrompt: `You are the Zen Master, embodying perfect peace and mindful presence. Your words carry the power to calm troubled minds. You speak slowly and deliberately, often responding with gentle questions. You use phrases like "Notice..." "Breathe..." "Be present..." CRITICAL: Never break character.`
  },
  {
    id: 'comedy-friend',
    name: 'Comedy Friend',
    description: 'Your hilarious buddy who can lighten up any conversation',
    avatar: '😄',
    personality: 'Funny, lighthearted, entertaining',
    systemPrompt: `You are Comedy Friend, the master of laughter and good vibes! You find humor in any situation with clean, family-friendly humor. You love puns, observational comedy, and witty comebacks. You know when to be funny vs. supportive. CRITICAL: Never break character.`
  },
  {
    id: 'creative-muse',
    name: 'Creative Muse',
    description: 'An inspiring artist who sparks creativity and imagination',
    avatar: '🎨',
    personality: 'Artistic, inspiring, imaginative',
    systemPrompt: `You are Creative Muse, an inspiring artist who sees infinite possibilities. You awaken the creative spark in everyone, encouraging experimentation and playful exploration over perfection. You believe there are no mistakes in art, only happy discoveries. CRITICAL: Never break character.`
  },
  {
    id: 'luxury-concierge',
    name: 'Luxury Concierge',
    description: 'Sophisticated assistant for the finer things in life',
    avatar: '🥂',
    personality: 'Refined, knowledgeable, exclusive',
    systemPrompt: `You are the Luxury Concierge, an expert in refined living. You possess impeccable taste and extensive knowledge of luxury goods and services. You focus on quality, craftsmanship, and meaningful experiences. CRITICAL: Never break character.`
  },
  {
    id: 'fitness-coach',
    name: 'Fitness Coach Max',
    description: 'Motivational trainer who makes fitness fun and achievable',
    avatar: '💪',
    personality: 'Energetic, motivational, supportive',
    systemPrompt: `You are Fitness Coach Max, a passionate fitness trainer who believes everyone deserves to feel strong and healthy. Your approach combines high energy with genuine care. You use phrases like "You've got this!" and "Beast mode activated!" CRITICAL: Never break character.`
  },
  {
    id: 'tech-guru',
    name: 'Tech Guru',
    description: 'Brilliant technologist who makes complex tech simple and exciting',
    avatar: '💻',
    personality: 'Innovative, helpful, cutting-edge',
    systemPrompt: `You are the Tech Guru, a brilliant technologist on the cutting edge of innovation. You explain complex concepts in ways anyone can understand. You use phrases like "Here's the cool thing..." and "Let me show you a trick..." CRITICAL: Never break character.`
  }
];

const CharactersChat: React.FC<CharactersChatProps> = ({ onBack }) => {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [animatingMessageId, setAnimatingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { getPersonalizedSystemInstruction } = useProfile();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || !selectedCharacter || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputMessage,
      sender: 'user',
      role: 'user',
      timestamp: new Date()
    };

    const currentMessages = [...messages];
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    const assistantMessageId = `char-${Date.now()}`;
    let assistantContent = '';

    // Add empty streaming message
    setMessages(prev => [...prev, {
      id: assistantMessageId,
      content: '',
      sender: 'character',
      role: 'assistant',
      timestamp: new Date()
    }]);
    setAnimatingMessageId(assistantMessageId);

    const personalizedContext = getPersonalizedSystemInstruction();
    const enhancedSystemPrompt = `${selectedCharacter.systemPrompt}\n\n${personalizedContext}\n\nResponse Guidelines:\n- Always stay in character\n- Keep responses engaging, helpful, and authentic\n- Never break character or acknowledge that you are an AI`;

    const chatMessages = [
      { role: 'system', content: enhancedSystemPrompt },
      ...currentMessages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      { role: 'user', content: userMessage.content }
    ];

    await streamChat({
      functionName: 'characters-chat',
      body: {
        messages: chatMessages,
        maxTokens: selectedCharacter.id === 'story-narrator' ? 1500 : 800,
        temperature: selectedCharacter.id === 'story-narrator' ? 0.9 : 0.8,
      },
      onDelta: (text) => {
        assistantContent += text;
        setMessages(prev =>
          prev.map(m => m.id === assistantMessageId ? { ...m, content: assistantContent } : m)
        );
      },
      onDone: () => {
        setIsLoading(false);
        setTimeout(() => setAnimatingMessageId(null), 500);
      },
      onError: async (error) => {
        console.error('Streaming error, falling back:', error);
        // Fallback to non-streaming
        try {
          const { data, error: fnError } = await supabase.functions.invoke('characters-chat', {
            body: { messages: chatMessages, maxTokens: 800, temperature: 0.8 }
          });
          if (fnError) throw fnError;
          setMessages(prev =>
            prev.map(m => m.id === assistantMessageId
              ? { ...m, content: data?.reply || "I'm having trouble responding right now." }
              : m
            )
          );
        } catch (fallbackError) {
          setMessages(prev =>
            prev.map(m => m.id === assistantMessageId
              ? { ...m, content: "I'm sorry, I'm having trouble connecting right now. Please try again later!" }
              : m
            )
          );
        } finally {
          setIsLoading(false);
          setTimeout(() => setAnimatingMessageId(null), 500);
        }
      },
    });
  };

  const startChatWithCharacter = (character: Character) => {
    setSelectedCharacter(character);
    const greeting = character.id === 'story-narrator'
      ? `Greetings! I am ${character.name}, your dedicated storyteller. Share with me a theme, character, setting, or any spark of inspiration, and I shall weave it into a captivating tale. What story shall we bring to life today?`
      : `Hello! I'm ${character.name}. ${character.description}. How can I help you today?`;

    setMessages([{
      id: 'greeting-1',
      content: greeting,
      sender: 'character',
      role: 'assistant',
      timestamp: new Date()
    }]);
  };

  const handleBackToCharacters = () => {
    setSelectedCharacter(null);
    setMessages([]);
    setInputMessage('');
  };

  // Chat view - MindMate-style
  if (selectedCharacter) {
    return (
      <div className="flex flex-col h-screen bg-background">
        {/* Header - MindMate style */}
        <div className="p-4 flex items-center text-white" style={{ backgroundColor: 'var(--zenith-primary)' }}>
          <Button variant="ghost" className="text-white hover:bg-black/20 p-2 mr-2" onClick={handleBackToCharacters}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center flex-1">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3">
              <span className="text-lg">{selectedCharacter.avatar}</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">{selectedCharacter.name}</h1>
              <p className="text-sm opacity-90">{selectedCharacter.personality}</p>
            </div>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-auto p-4 bg-muted/30 pb-24">
          {messages.map((message) => (
            <AnimatePresence key={message.id}>
              <motion.div
                initial={message.id === animatingMessageId ? { opacity: 0, y: 20 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={`mb-4 ${message.sender === 'user' ? 'flex justify-end' : 'flex justify-start'}`}
              >
                {message.sender === 'character' && (
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                    <span className="text-sm">{selectedCharacter.avatar}</span>
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.sender === 'user'
                      ? 'text-white rounded-tr-none'
                      : 'bg-card border border-border text-card-foreground rounded-tl-none'
                  }`}
                  style={message.sender === 'user' ? { backgroundColor: 'var(--zenith-primary)' } : {}}
                >
                  {message.sender === 'character' ? (
                    <FormattedMessage content={message.content} />
                  ) : (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          ))}
          {isLoading && messages[messages.length - 1]?.content === '' && (
            <div className="flex justify-start mb-4">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                <span className="text-sm">{selectedCharacter.avatar}</span>
              </div>
              <div className="bg-card border border-border text-card-foreground rounded-lg rounded-tl-none p-4 max-w-[80%]">
                <div className="flex space-x-2">
                  <div className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area - MindMate style */}
        <div className="p-4 border-t border-border bg-background pb-24">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={
                selectedCharacter.id === 'story-narrator'
                  ? "Describe your story idea..."
                  : `Chat with ${selectedCharacter.name}...`
              }
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
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Characters are AI-powered and for entertainment purposes
          </p>
        </div>
      </div>
    );
  }

  // Character selection grid
  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="p-4 flex items-center text-white" style={{ backgroundColor: 'var(--zenith-primary)' }}>
        <Button variant="ghost" className="text-white hover:bg-black/20 p-2 mr-2" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center flex-1">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3">
            <span className="font-bold text-lg" style={{ color: 'var(--zenith-primary)' }}>C</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">Characters</h1>
            <p className="text-sm opacity-90">Choose a character to chat with</p>
          </div>
        </div>
      </div>

      {/* Character grid */}
      <div className="flex-1 overflow-auto p-4 bg-muted/30">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-4xl mx-auto">
          {characters.map((character) => (
            <motion.div
              key={character.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="cursor-pointer bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
              onClick={() => startChatWithCharacter(character)}
            >
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">{character.avatar}</span>
                </div>
                <h3 className="font-semibold text-sm text-card-foreground mb-1">{character.name}</h3>
                <p className="text-xs text-muted-foreground leading-snug">{character.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CharactersChat;
