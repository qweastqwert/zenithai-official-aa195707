import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Send, Loader2, Search, Plus, Lock, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { streamChat } from '@/utils/streamChat';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import FormattedMessage from '@/components/chat/FormattedMessage';
import { sanitizeAssistantMessage } from '@/utils/sanitizeAI';

interface Character {
  id: string;
  name: string;
  description: string;
  avatar: string;
  personality: string;
  systemPrompt: string;
  creatorUsername?: string;
  creatorUserId?: string;
  isPrivate?: boolean;
  isCommunity?: boolean;
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

const featuredCharacters: Character[] = [
  {
    id: 'wise-sage', name: 'Wise Sage', description: 'An ancient wisdom keeper with endless stories and life advice',
    avatar: '🧙‍♂️', personality: 'Wise, patient, storytelling',
    systemPrompt: `You are the Wise Sage, an ancient keeper of wisdom who has lived for centuries. You possess deep understanding of human nature, life's patterns, and timeless truths. Your personality is warm, patient, and deeply compassionate. You speak with gentle authority, often weaving metaphors from nature and ancient stories. CRITICAL: Never break character.`
  },
  {
    id: 'story-narrator', name: 'Story Narrator', description: 'Master storyteller who creates captivating tales from any prompt',
    avatar: '📖', personality: 'Creative, imaginative, eloquent',
    systemPrompt: `You are the Master Story Narrator, a gifted weaver of tales who can transform any idea into a rich, immersive story. You create vivid descriptions, compelling characters, and engaging plots. You focus on positive themes and uplifting messages. CRITICAL: Never break character.`
  },
  {
    id: 'royal-advisor', name: 'Royal Advisor', description: 'Distinguished counselor offering regal wisdom and etiquette',
    avatar: '👑', personality: 'Noble, sophisticated, diplomatic',
    systemPrompt: `You are the Royal Advisor, a distinguished counselor with impeccable manners and deep wisdom in leadership and diplomacy. You help people navigate social situations with dignity and grace. CRITICAL: Never break character.`
  },
  {
    id: 'quirky-scientist', name: 'Dr. Quirky', description: 'A brilliant but eccentric scientist who makes everything fascinating',
    avatar: '🧪', personality: 'Excited, curious, educational',
    systemPrompt: `You are Dr. Quirky, a brilliant and endearingly eccentric scientist who finds wonder in everything! Your enthusiasm for discovery makes complex concepts accessible and fun. You often exclaim "Fascinating!" and "How wonderful!" CRITICAL: Never break character.`
  },
  {
    id: 'mystical-oracle', name: 'Mystical Oracle', description: 'Ancient seer who provides mystical insights and spiritual guidance',
    avatar: '🔮', personality: 'Mystical, insightful, ethereal',
    systemPrompt: `You are the Mystical Oracle, an ancient seer who perceives hidden currents of existence. You speak in layered, poetic language rich with symbolism. You balance mystery with practical spiritual guidance. CRITICAL: Never break character.`
  },
  {
    id: 'adventure-buddy', name: 'Adventure Buddy', description: 'Your energetic companion ready for any exciting journey',
    avatar: '🏕️', personality: 'Energetic, optimistic, adventurous',
    systemPrompt: `You are Adventure Buddy, the most enthusiastic and optimistic companion! You're always ready for the next exciting experience. You find adventure in everyday situations and motivate others to step outside their comfort zones. CRITICAL: Never break character.`
  },
  {
    id: 'zen-master', name: 'Zen Master', description: 'A peaceful guide for mindfulness and inner tranquility',
    avatar: '🧘', personality: 'Calm, mindful, peaceful',
    systemPrompt: `You are the Zen Master, embodying perfect peace and mindful presence. Your words carry the power to calm troubled minds. You speak slowly and deliberately, often responding with gentle questions. CRITICAL: Never break character.`
  },
  {
    id: 'comedy-friend', name: 'Comedy Friend', description: 'Your hilarious buddy who can lighten up any conversation',
    avatar: '😄', personality: 'Funny, lighthearted, entertaining',
    systemPrompt: `You are Comedy Friend, the master of laughter and good vibes! You find humor in any situation with clean, family-friendly humor. You love puns, observational comedy, and witty comebacks. CRITICAL: Never break character.`
  },
  {
    id: 'creative-muse', name: 'Creative Muse', description: 'An inspiring artist who sparks creativity and imagination',
    avatar: '🎨', personality: 'Artistic, inspiring, imaginative',
    systemPrompt: `You are Creative Muse, an inspiring artist who sees infinite possibilities. You awaken the creative spark in everyone. CRITICAL: Never break character.`
  },
  {
    id: 'fitness-coach', name: 'Fitness Coach Max', description: 'Motivational trainer who makes fitness fun and achievable',
    avatar: '💪', personality: 'Energetic, motivational, supportive',
    systemPrompt: `You are Fitness Coach Max, a passionate fitness trainer who believes everyone deserves to feel strong and healthy. CRITICAL: Never break character.`
  },
  {
    id: 'tech-guru', name: 'Tech Guru', description: 'Brilliant technologist who makes complex tech simple and exciting',
    avatar: '💻', personality: 'Innovative, helpful, cutting-edge',
    systemPrompt: `You are the Tech Guru, a brilliant technologist on the cutting edge of innovation. You explain complex concepts in ways anyone can understand. CRITICAL: Never break character.`
  },
  {
    id: 'luxury-concierge', name: 'Luxury Concierge', description: 'Sophisticated assistant for the finer things in life',
    avatar: '🥂', personality: 'Refined, knowledgeable, exclusive',
    systemPrompt: `You are the Luxury Concierge, an expert in refined living. You possess impeccable taste and extensive knowledge of luxury goods and services. CRITICAL: Never break character.`
  }
];

const CharactersChat: React.FC<CharactersChatProps> = ({ onBack }) => {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [animatingMessageId, setAnimatingMessageId] = useState<string | null>(null);
  const [communityCharacters, setCommunityCharacters] = useState<Character[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [creatorFilter, setCreatorFilter] = useState<string | null>(null);
  const [newChar, setNewChar] = useState({ name: '', description: '', avatar_emoji: '🤖', system_prompt: '', greeting: '', is_private: false });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { getPersonalizedSystemInstruction, profile } = useProfile();
  const { user } = useAuth();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Fetch community characters
  useEffect(() => {
    const fetchCommunityChars = async () => {
      const { data, error } = await supabase
        .from('community_characters')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        // Fetch creator usernames
        const creatorIds = [...new Set(data.map(c => c.creator_user_id))];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, username, name')
          .in('user_id', creatorIds);

        const profileMap = new Map(profiles?.map(p => [p.user_id, p.username || p.name]) || []);

        setCommunityCharacters(data.map(c => ({
          id: c.id,
          name: c.name,
          description: c.description,
          avatar: c.avatar_emoji,
          personality: '',
          systemPrompt: c.system_prompt,
          creatorUsername: c.creator_user_id ? (profileMap.get(c.creator_user_id) || 'Anonymous') : 'Deleted Account',
          creatorUserId: c.creator_user_id,
          isPrivate: c.is_private,
          isCommunity: true,
        })));
      }
    };
    fetchCommunityChars();
  }, []);

  const createCharacter = async () => {
    if (!user || !newChar.name || !newChar.system_prompt) return;
    
    const { error } = await supabase.from('community_characters').insert({
      creator_user_id: user.id,
      name: newChar.name,
      description: newChar.description,
      avatar_emoji: newChar.avatar_emoji,
      system_prompt: newChar.system_prompt,
      greeting: newChar.greeting || null,
      is_private: newChar.is_private,
    });

    if (!error) {
      setShowCreateDialog(false);
      setNewChar({ name: '', description: '', avatar_emoji: '🤖', system_prompt: '', greeting: '', is_private: false });
      // Refetch
      const { data } = await supabase.from('community_characters').select('*').order('created_at', { ascending: false });
      if (data) {
        const creatorIds = [...new Set(data.map(c => c.creator_user_id))];
        const { data: profiles } = await supabase.from('profiles').select('user_id, username, name').in('user_id', creatorIds);
        const profileMap = new Map(profiles?.map(p => [p.user_id, p.username || p.name]) || []);
        setCommunityCharacters(data.map(c => ({
          id: c.id, name: c.name, description: c.description, avatar: c.avatar_emoji,
          personality: '', systemPrompt: c.system_prompt,
          creatorUsername: c.creator_user_id ? (profileMap.get(c.creator_user_id) || 'Anonymous') : 'Deleted Account',
          creatorUserId: c.creator_user_id, isPrivate: c.is_private, isCommunity: true,
        })));
      }
    }
  };

  const filteredCommunity = communityCharacters.filter(c => {
    if (creatorFilter && c.creatorUserId !== creatorFilter) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || (c.creatorUsername || '').toLowerCase().includes(q);
  });

  const sendMessage = async () => {
    if (!inputMessage.trim() || !selectedCharacter || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`, content: inputMessage, sender: 'user', role: 'user', timestamp: new Date()
    };

    const currentMessages = [...messages];
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    const assistantMessageId = `char-${Date.now()}`;
    let assistantContent = '';

    setMessages(prev => [...prev, {
      id: assistantMessageId, content: '', sender: 'character', role: 'assistant', timestamp: new Date()
    }]);
    setAnimatingMessageId(assistantMessageId);

    const personalizedContext = getPersonalizedSystemInstruction();
    const enhancedSystemPrompt = `${selectedCharacter.systemPrompt}\n\n${personalizedContext}\n\nResponse Guidelines:\n- Always stay in character\n- Keep responses engaging, helpful, and authentic\n- Never break character or acknowledge that you are an AI`;

    const chatMessages = [
      { role: 'system', content: enhancedSystemPrompt },
      ...currentMessages.map(msg => ({ role: msg.sender === 'user' ? 'user' : 'assistant', content: msg.content })),
      { role: 'user', content: userMessage.content }
    ];

    await streamChat({
      functionName: 'characters-chat',
      body: { messages: chatMessages, maxTokens: 800, temperature: 0.8 },
      onDelta: (text) => {
        assistantContent += text;
        setMessages(prev => prev.map(m => m.id === assistantMessageId ? { ...m, content: assistantContent } : m));
      },
      onDone: () => {
        const sanitized = sanitizeAssistantMessage(assistantContent);
        if (sanitized !== assistantContent) {
          setMessages(prev => prev.map(m => m.id === assistantMessageId ? { ...m, content: sanitized } : m));
        }
        setIsLoading(false); setTimeout(() => setAnimatingMessageId(null), 500);
      },
      onError: async (error) => {
        console.error('Streaming error, falling back:', error);
        try {
          const { data, error: fnError } = await supabase.functions.invoke('characters-chat', {
            body: { messages: chatMessages, maxTokens: 800, temperature: 0.8 }
          });
          if (fnError) throw fnError;
          setMessages(prev => prev.map(m => m.id === assistantMessageId ? { ...m, content: sanitizeAssistantMessage(data?.reply || "I'm having trouble responding right now.") } : m));
        } catch {
          setMessages(prev => prev.map(m => m.id === assistantMessageId ? { ...m, content: "I'm sorry, I'm having trouble connecting right now. Please try again later!" } : m));
        } finally { setIsLoading(false); setTimeout(() => setAnimatingMessageId(null), 500); }
      },
    });
  };

  const startChatWithCharacter = (character: Character) => {
    setSelectedCharacter(character);
    const greeting = character.isCommunity && (character as any).greeting
      ? (character as any).greeting
      : `Hello! I'm ${character.name}. ${character.description}. How can I help you today?`;
    setMessages([{ id: 'greeting-1', content: greeting, sender: 'character', role: 'assistant', timestamp: new Date() }]);
  };

  const handleBackToCharacters = () => { setSelectedCharacter(null); setMessages([]); setInputMessage(''); };

  // Chat view
  if (selectedCharacter) {
    return (
      <div className="flex flex-col h-screen bg-background">
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
              {selectedCharacter.creatorUsername ? (
                <p className="text-xs opacity-80">by @{selectedCharacter.creatorUsername}</p>
              ) : (
                <p className="text-sm opacity-90">{selectedCharacter.personality}</p>
              )}
            </div>
          </div>
        </div>

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
                  className={`max-w-[80%] rounded-lg p-4 ${message.sender === 'user' ? 'text-white rounded-tr-none' : 'bg-card border border-border text-card-foreground rounded-tl-none'}`}
                  style={message.sender === 'user' ? { backgroundColor: 'var(--zenith-primary)' } : {}}
                >
                  {message.sender === 'character' ? <FormattedMessage content={message.content} /> : <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>}
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

        <div className="p-4 border-t border-border bg-background pb-24">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Chat with ${selectedCharacter.name}...`}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              disabled={isLoading}
              className="flex-1"
            />
            <Button onClick={sendMessage} disabled={!inputMessage.trim() || isLoading} style={{ backgroundColor: 'var(--zenith-primary)' }}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">Characters are AI-powered and for entertainment purposes</p>
        </div>
      </div>
    );
  }

  // Character selection with tabs
  return (
    <div className="flex flex-col h-screen bg-background">
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

      <div className="flex-1 overflow-auto bg-muted/30">
        <Tabs defaultValue="featured" className="w-full">
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-4 pt-3">
            <TabsList className="w-full grid grid-cols-2 mb-3">
              <TabsTrigger value="featured">Zenith AI Featured</TabsTrigger>
              <TabsTrigger value="community">Community-made</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="featured" className="p-4 mt-0">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-4xl mx-auto">
              {featuredCharacters.map((character) => (
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
          </TabsContent>

          <TabsContent value="community" className="p-4 mt-0">
            {/* Search & Create */}
            <div className="flex gap-2 mb-4 max-w-4xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search characters, creators..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              {creatorFilter && (
                <Button variant="outline" size="sm" onClick={() => setCreatorFilter(null)}>
                  <X className="h-3 w-3 mr-1" /> Clear filter
                </Button>
              )}
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button size="icon" style={{ backgroundColor: 'var(--zenith-primary)' }}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[85vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create Character</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label>Name *</Label>
                      <Input value={newChar.name} onChange={(e) => setNewChar({ ...newChar, name: e.target.value })} placeholder="Character name" />
                    </div>
                    <div className="space-y-1">
                      <Label>Emoji Avatar</Label>
                      <Input value={newChar.avatar_emoji} onChange={(e) => setNewChar({ ...newChar, avatar_emoji: e.target.value })} placeholder="🤖" className="w-20" />
                    </div>
                    <div className="space-y-1">
                      <Label>Description</Label>
                      <Textarea value={newChar.description} onChange={(e) => setNewChar({ ...newChar, description: e.target.value })} placeholder="What is this character about?" className="min-h-[60px]" />
                    </div>
                    <div className="space-y-1">
                      <Label>System Prompt *</Label>
                      <Textarea value={newChar.system_prompt} onChange={(e) => setNewChar({ ...newChar, system_prompt: e.target.value })} placeholder="Describe the character's personality, tone, and behavior..." className="min-h-[100px]" />
                    </div>
                    <div className="space-y-1">
                      <Label>Greeting Message</Label>
                      <Input value={newChar.greeting} onChange={(e) => setNewChar({ ...newChar, greeting: e.target.value })} placeholder="Optional first message" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                        <Label>Private (only you can use)</Label>
                      </div>
                      <Switch checked={newChar.is_private} onCheckedChange={(v) => setNewChar({ ...newChar, is_private: v })} />
                    </div>
                    <Button onClick={createCharacter} disabled={!newChar.name || !newChar.system_prompt} className="w-full" style={{ backgroundColor: 'var(--zenith-primary)' }}>
                      Create Character
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Community characters grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-4xl mx-auto">
              {filteredCommunity.length === 0 ? (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  {searchQuery ? 'No characters found' : 'No community characters yet. Be the first to create one!'}
                </div>
              ) : (
                filteredCommunity.map((character) => (
                  <motion.div
                    key={character.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="cursor-pointer bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative"
                    onClick={() => startChatWithCharacter(character)}
                  >
                    {character.isPrivate && (
                      <div className="absolute top-2 right-2">
                        <Lock className="h-3 w-3 text-muted-foreground" />
                      </div>
                    )}
                    <div className="text-center">
                      <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl">{character.avatar}</span>
                      </div>
                      <h3 className="font-semibold text-sm text-card-foreground mb-1">{character.name}</h3>
                      <p className="text-xs text-muted-foreground leading-snug mb-2">{character.description}</p>
                      <button
                        className="text-[10px] hover:underline"
                        style={{ color: 'var(--zenith-primary)' }}
                        onClick={(e) => { e.stopPropagation(); setCreatorFilter(character.creatorUserId || null); }}
                      >
                        @{character.creatorUsername}
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CharactersChat;
