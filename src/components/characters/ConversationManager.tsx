import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Download, Trash2, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface Conversation {
  id: string;
  character_id: string;
  character_name: string;
  title: string;
  messages: any[];
  created_at: string;
  updated_at: string;
}

interface ConversationManagerProps {
  characterId: string;
  characterName: string;
  currentMessages: any[];
  activeConversationId: string | null;
  onLoadConversation: (convo: Conversation) => void;
  onNewConversation: () => void;
}

const ConversationManager: React.FC<ConversationManagerProps> = ({
  characterId,
  characterName,
  currentMessages,
  activeConversationId,
  onLoadConversation,
  onNewConversation,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    fetchConversations();
  }, [user, characterId]);

  const fetchConversations = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('character_conversations')
      .select('*')
      .eq('user_id', user.id)
      .eq('character_id', characterId)
      .order('updated_at', { ascending: false });

    if (!error && data) {
      setConversations(data as unknown as Conversation[]);
    }
    setLoading(false);
  };

  const exportConversation = (convo: Conversation) => {
    const exportData = {
      character: convo.character_name,
      title: convo.title,
      exportedAt: new Date().toISOString(),
      messages: convo.messages,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${convo.character_name}-${convo.title}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Exported', description: 'Conversation saved as JSON' });
  };

  const deleteConversation = async (id: string) => {
    const { error } = await supabase.from('character_conversations').delete().eq('id', id);
    if (!error) {
      setConversations(prev => prev.filter(c => c.id !== id));
      toast({ title: 'Deleted', description: 'Conversation removed' });
    }
  };

  const exportCurrentConversation = () => {
    if (currentMessages.length <= 1) return;
    const exportData = {
      character: characterName,
      title: 'Current Conversation',
      exportedAt: new Date().toISOString(),
      messages: currentMessages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.content,
        timestamp: m.timestamp,
      })),
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${characterName}-conversation.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Exported', description: 'Current conversation saved as JSON' });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-3 border-b border-border">
        <h3 className="text-sm font-semibold">Conversations</h3>
        <div className="flex gap-1">
          {currentMessages.length > 1 && (
            <Button variant="ghost" size="sm" onClick={exportCurrentConversation} className="h-7 px-2">
              <Download className="h-3 w-3 mr-1" /> Export
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onNewConversation} className="h-7 px-2">
            <Plus className="h-3 w-3 mr-1" /> New
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {loading ? (
            <p className="text-xs text-muted-foreground text-center py-4">Loading...</p>
          ) : conversations.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">No saved conversations yet</p>
          ) : (
            conversations.map((convo) => (
              <div
                key={convo.id}
                className={`group flex items-center gap-2 rounded-lg p-2 cursor-pointer hover:bg-muted/50 transition-colors ${
                  activeConversationId === convo.id ? 'bg-muted' : ''
                }`}
                onClick={() => onLoadConversation(convo)}
              >
                <MessageSquare className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{convo.title}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {new Date(convo.updated_at).toLocaleDateString()} · {(convo.messages as any[]).length} msgs
                  </p>
                </div>
                <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={(e) => { e.stopPropagation(); exportConversation(convo); }}>
                    <Download className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-destructive" onClick={(e) => { e.stopPropagation(); deleteConversation(convo.id); }}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ConversationManager;
