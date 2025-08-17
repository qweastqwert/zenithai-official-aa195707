import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import type { Message } from '@/hooks/useChat';
import { useSpeech } from '@/hooks/useSpeech';
import { useSettings } from '@/hooks/useSettings';
import { useActivityTracker } from '@/hooks/useActivityTracker';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

import BreathingFAB from './BreathingFAB';

const ChatInterface: React.FC = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const { messages, addMessage } = useChat();
  const { speak, cancelSpeech } = useSpeech();
  const { settings, updateSettings } = useSettings();
  const { trackActivity } = useActivityTracker();

  useEffect(() => {
    // Scroll to bottom on new messages
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    const userMessage: Message = { text: input, sender: 'user' };
    addMessage(userMessage);
    setInput('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input, settings }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botMessage: Message = { text: data.response, sender: 'bot' };
      addMessage(botMessage);

      if (settings.enableSpeech) {
        speak(data.response);
      }

      // Track activity
      trackActivity('mindmate');

    } catch (error: any) {
      console.error('Error during chat:', error);
      toast({
        title: "Uh oh! Something went wrong.",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent newline in input
      handleSend();
    }
  };

  const handleStopSpeech = () => {
    cancelSpeech();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/20">
      <div className="container mx-auto max-w-4xl py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Zenith AI - Your Personal MindMate
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Engage in meaningful conversations and explore your inner world
          </p>
        </motion.div>

        <Card className="mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-700/50">
          <CardContent className="p-6">
            <div
              ref={chatContainerRef}
              className="space-y-4 mb-4 max-h-[500px] overflow-y-auto scrollbar-hide"
            >
              {messages.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 py-6">
                  Start a conversation!
                </div>
              )}
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className="flex flex-col items-start max-w-2/3">
                    {message.sender === 'bot' && (
                      <div className="flex items-center space-x-2 mb-1">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src="/zenith-logo.png" alt="Zenith AI" />
                          <AvatarFallback>ZA</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Zenith AI</span>
                      </div>
                    )}
                    <div
                      className={`px-4 py-2 rounded-lg ${message.sender === 'user'
                        ? 'bg-blue-200 dark:bg-blue-700 text-gray-900 dark:text-gray-100'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                        }`}
                    >
                      {message.text}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex flex-col items-start max-w-2/3">
                    <div className="flex items-center space-x-2 mb-1">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="/zenith-logo.png" alt="Zenith AI" />
                        <AvatarFallback>ZA</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Zenith AI</span>
                    </div>
                    <div className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                      <Skeleton className="h-[1.2rem] w-[12rem]" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-grow"
                disabled={isLoading}
              />
              <Button onClick={handleSend} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                {isLoading ? 'Sending...' : 'Send'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Accordion type="single" collapsible>
          <AccordionItem value="settings">
            <AccordionTrigger>Zenith AI Settings</AccordionTrigger>
            <AccordionContent>
              <Card className="mt-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-700/50">
                <CardContent className="p-6">
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enableSpeech">Enable Speech</Label>
                      <Switch
                        id="enableSpeech"
                        checked={settings.enableSpeech}
                        onCheckedChange={(checked) => updateSettings({ ...settings, enableSpeech: checked })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="creativityLevel" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100">
                        Creativity Level
                      </Label>
                      <p className="mt-1 text-sm leading-5 text-gray-500 dark:text-gray-400">
                        Adjust the level of creativity in Zenith AI's responses.
                      </p>
                      <Slider
                        id="creativityLevel"
                        defaultValue={[settings.creativityLevel * 100]}
                        max={100}
                        step={10}
                        aria-label="Creativity Level"
                        onChange={(values) => updateSettings({ ...settings, creativityLevel: values[0] / 100 })}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="responseLength" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100">
                        Response Length
                      </Label>
                      <p className="mt-1 text-sm leading-5 text-gray-500 dark:text-gray-400">
                        Control the length of Zenith AI's responses.
                      </p>
                      <Select onValueChange={(value) => updateSettings({ ...settings, responseLength: value as 'short' | 'medium' | 'long' })}>
                        <SelectTrigger className="w-full mt-2">
                          <SelectValue placeholder="Select a length" defaultValue={settings.responseLength} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="short">Short</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="long">Long</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="toneStyle" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100">
                        Tone Style
                      </Label>
                      <p className="mt-1 text-sm leading-5 text-gray-500 dark:text-gray-400">
                        Choose the tone and style of Zenith AI's responses.
                      </p>
                      <Select onValueChange={(value) => updateSettings({ ...settings, toneStyle: value as 'friendly' | 'professional' | 'humorous' | 'motivational' })}>
                        <SelectTrigger className="w-full mt-2">
                          <SelectValue placeholder="Select a tone" defaultValue={settings.toneStyle} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="friendly">Friendly</SelectItem>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="humorous">Humorous</SelectItem>
                          <SelectItem value="motivational">Motivational</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      
      {/* Add the breathing exercises FAB at the end before closing div */}
      <BreathingFAB />
    </div>
  );
};

export default ChatInterface;
