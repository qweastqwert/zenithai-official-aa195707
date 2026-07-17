import React, { useEffect, useMemo, useRef, useState } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import { Mail, Inbox, Trash2, ArrowLeft, Send, Bold, Italic, Underline, Image as ImageIcon, Type, Palette, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import TurnstileWidget from '@/components/TurnstileWidget';
import { Textarea } from '@/components/ui/textarea';

type MailRow = {
  id: string;
  title: string;
  body_html: string;
  category: string;
  is_welcome: boolean;
  recipient_user_id: string | null;
  created_at: string;
};

const FONTS = [
  'Inter', 'Arial', 'Georgia', 'Times New Roman', 'Courier New', 'Verdana',
  'Trebuchet MS', 'Comic Sans MS', 'Tahoma', 'Garamond', 'Palatino',
  'Brush Script MT', 'Impact', 'Lucida Console', 'system-ui',
];
const SIZES = ['1', '2', '3', '4', '5', '6', '7'];

interface MailboxProps {
  variant?: 'icon' | 'outline';
}

const Mailbox: React.FC<MailboxProps> = ({ variant = 'outline' }) => {
  const { user } = useAuth();
  const { isAdmin } = useUserRole();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [mails, setMails] = useState<MailRow[]>([]);
  const [reads, setReads] = useState<Set<string>>(new Set());
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [active, setActive] = useState<MailRow | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const [{ data: m }, { data: r }, { data: d }] = await Promise.all([
      supabase.from('mail_messages').select('*').order('created_at', { ascending: false }),
      supabase.from('mail_reads').select('mail_id').eq('user_id', user.id),
      supabase.from('mail_deleted').select('mail_id').eq('user_id', user.id),
    ]);
    setMails((m as MailRow[]) || []);
    setReads(new Set((r || []).map((x: any) => x.mail_id)));
    setHidden(new Set((d || []).map((x: any) => x.mail_id)));
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [user?.id]);
  useEffect(() => {
    if (!user) return;
    const ch = supabase.channel('mail-' + user.id)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mail_messages' }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
    // eslint-disable-next-line
  }, [user?.id]);

  const visible = useMemo(() => mails.filter(m => !hidden.has(m.id)), [mails, hidden]);
  const unread = useMemo(() => visible.filter(m => !reads.has(m.id)).length, [visible, reads]);

  const openMail = async (mail: MailRow) => {
    setActive(mail);
    if (!user || reads.has(mail.id)) return;
    setReads(prev => new Set(prev).add(mail.id));
    await supabase.from('mail_reads').upsert({ user_id: user.id, mail_id: mail.id });
  };

  const hideMail = async (mail: MailRow) => {
    if (!user) return;
    setHidden(prev => new Set(prev).add(mail.id));
    setActive(null);
    await supabase.from('mail_deleted').insert({ user_id: user.id, mail_id: mail.id });
  };

  const sanitized = (html: string) => DOMPurify.sanitize(html, {
    ADD_TAGS: ['font'],
    ADD_ATTR: ['style', 'color', 'face', 'size', 'target'],
  });

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant={variant === 'icon' ? 'ghost' : 'outline'}
        size="icon"
        className="relative shrink-0 touch-manipulation border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
        aria-label="Open mailbox"
      >
        <Mail className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </Button>

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setActive(null); }}>
        <DialogContent className="max-w-3xl max-h-[85vh] p-0 overflow-hidden flex flex-col">
          <DialogHeader className="px-5 pt-5 pb-3 border-b">
            <DialogTitle className="flex items-center gap-2">
              <Inbox className="h-5 w-5 text-primary" />
              Zenith Mailbox
              {unread > 0 && <Badge variant="secondary">{unread} new</Badge>}
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="inbox" className="flex-1 flex flex-col overflow-hidden">
            <TabsList className={`mx-5 mt-3 ${isAdmin ? 'grid grid-cols-2 w-fit' : 'w-fit'}`}>
              <TabsTrigger value="inbox">Inbox</TabsTrigger>
              {isAdmin && <TabsTrigger value="compose">Compose</TabsTrigger>}
            </TabsList>

            <TabsContent value="inbox" className="flex-1 overflow-hidden mt-3 px-5 pb-5">
              {active ? (
                <MailReader mail={active} sanitized={sanitized} onBack={() => setActive(null)} onHide={() => hideMail(active)} isAdmin={isAdmin} />
              ) : (
                <ScrollArea className="h-[55vh] pr-2">
                  {loading && <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin" /></div>}
                  {!loading && visible.length === 0 && (
                    <div className="text-center text-muted-foreground py-12">
                      <Mail className="h-10 w-10 mx-auto mb-2 opacity-40" />
                      Your inbox is empty.
                    </div>
                  )}
                  <div className="space-y-2">
                    {visible.map(m => {
                      const isUnread = !reads.has(m.id);
                      return (
                        <button
                          key={m.id}
                          onClick={() => openMail(m)}
                          className={`w-full text-left p-3 rounded-xl border transition-all hover:border-primary/40 hover:bg-primary/5 ${isUnread ? 'border-primary/30 bg-primary/5' : 'border-border bg-card'}`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2 min-w-0">
                              {isUnread && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                              <span className={`truncate ${isUnread ? 'font-semibold' : 'font-medium'}`}>{m.title}</span>
                            </div>
                            <span className="text-xs text-muted-foreground shrink-0">
                              {formatDistanceToNow(new Date(m.created_at), { addSuffix: true })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[10px] capitalize">{m.category}</Badge>
                            {m.recipient_user_id === null && <Badge variant="secondary" className="text-[10px]">Broadcast</Badge>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </ScrollArea>
              )}
            </TabsContent>

            {isAdmin && (
              <TabsContent value="compose" className="flex-1 overflow-hidden mt-3 px-5 pb-5">
                <ComposeMail onSent={() => { toast({ title: 'Mail sent to all users' }); load(); }} />
              </TabsContent>
            )}
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

const MailReader: React.FC<{ mail: MailRow; sanitized: (h: string) => string; onBack: () => void; onHide: () => void; isAdmin: boolean }> = ({ mail, sanitized, onBack, onHide, isAdmin }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [replies, setReplies] = useState<any[]>([]);
  const [replyText, setReplyText] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const loadReplies = async () => {
    const { data } = await supabase.from('mail_replies').select('*').eq('mail_id', mail.id).order('created_at', { ascending: true });
    setReplies(data || []);
  };
  useEffect(() => { loadReplies(); /* eslint-disable-next-line */ }, [mail.id]);

  const sendReply = async () => {
    if (!user || !replyText.trim()) return;
    if (!turnstileToken) { toast({ title: 'Please complete the verification', variant: 'destructive' }); return; }
    setSending(true);
    const safe = DOMPurify.sanitize(replyText.replace(/\n/g, '<br/>'));
    const { error } = await supabase.from('mail_replies').insert({
      mail_id: mail.id, sender_user_id: user.id, body_html: safe,
    });
    setSending(false);
    if (error) { toast({ title: 'Reply failed', description: error.message, variant: 'destructive' }); return; }
    setReplyText('');
    setTurnstileToken(null);
    toast({ title: 'Reply sent 💌' });
    loadReplies();
  };

  return (
    <div className="flex flex-col h-[55vh]">
      <div className="flex items-center justify-between mb-3">
        <Button variant="ghost" size="sm" onClick={onBack}><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>
        <Button variant="ghost" size="sm" onClick={onHide} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4 mr-1" /> Delete</Button>
      </div>
      <div className="mb-2">
        <h2 className="text-xl font-bold">{mail.title}</h2>
        <p className="text-xs text-muted-foreground">{new Date(mail.created_at).toLocaleString()}</p>
      </div>
      <ScrollArea className="flex-1 border rounded-xl p-4 bg-background">
        <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: sanitized(mail.body_html) }} />

        {replies.length > 0 && (
          <div className="mt-6 border-t pt-4 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Replies</p>
            {replies.map(r => (
              <div key={r.id} className="p-3 rounded-lg bg-muted/50 border">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>{isAdmin ? `User ${r.sender_user_id.slice(0, 8)}` : 'You'}</span>
                  <span>{formatDistanceToNow(new Date(r.created_at), { addSuffix: true })}</span>
                </div>
                <div className="text-sm" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(r.body_html) }} />
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 border-t pt-4 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Reply to the developers</p>
          <Textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Type your reply..." rows={3} maxLength={2000} />
          <TurnstileWidget onVerify={setTurnstileToken} onExpire={() => setTurnstileToken(null)} theme="auto" size="compact" />
          <div className="flex justify-end">
            <Button size="sm" onClick={sendReply} disabled={sending || !replyText.trim() || !turnstileToken}>
              {sending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
              Send reply
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

const ComposeMail: React.FC<{ onSent: () => void }> = ({ onSent }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const editorRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('announcement');
  const [sending, setSending] = useState(false);

  const exec = (cmd: string, val?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, val);
  };

  const insertImage = () => {
    const url = window.prompt('Image URL:');
    if (url) exec('insertImage', url);
  };

  const send = async () => {
    if (!user) return;
    const html = editorRef.current?.innerHTML?.trim();
    if (!title.trim() || !html) {
      toast({ title: 'Add a title and body', variant: 'destructive' });
      return;
    }
    setSending(true);
    const { error } = await supabase.from('mail_messages').insert({
      sender_user_id: user.id,
      recipient_user_id: null,
      title: title.trim(),
      body_html: html,
      category,
    });
    setSending(false);
    if (error) { toast({ title: 'Send failed', description: error.message, variant: 'destructive' }); return; }
    setTitle('');
    if (editorRef.current) editorRef.current.innerHTML = '';
    onSent();
  };

  return (
    <div className="flex flex-col h-[55vh] gap-3">
      <div className="flex gap-2">
        <Input placeholder="Subject" value={title} onChange={(e) => setTitle(e.target.value)} className="flex-1" />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="announcement">Announcement</SelectItem>
            <SelectItem value="event">Event</SelectItem>
            <SelectItem value="update">Update</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-1 p-2 border rounded-lg bg-muted/30">
        <Button type="button" variant="ghost" size="sm" onClick={() => exec('bold')}><Bold className="h-4 w-4" /></Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => exec('italic')}><Italic className="h-4 w-4" /></Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => exec('underline')}><Underline className="h-4 w-4" /></Button>
        <Select onValueChange={(v) => exec('fontName', v)}>
          <SelectTrigger className="h-9 w-[140px]"><Type className="h-3.5 w-3.5 mr-1" /><SelectValue placeholder="Font" /></SelectTrigger>
          <SelectContent className="max-h-[240px]">
            {FONTS.map(f => <SelectItem key={f} value={f} style={{ fontFamily: f }}>{f}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select onValueChange={(v) => exec('fontSize', v)}>
          <SelectTrigger className="h-9 w-[90px]"><SelectValue placeholder="Size" /></SelectTrigger>
          <SelectContent>
            {SIZES.map(s => <SelectItem key={s} value={s}>Size {s}</SelectItem>)}
          </SelectContent>
        </Select>
        <label className="inline-flex items-center gap-1 h-9 px-2 rounded-md cursor-pointer hover:bg-accent text-sm">
          <Palette className="h-4 w-4" />
          <input type="color" onChange={(e) => exec('foreColor', e.target.value)} className="w-6 h-6 border-0 bg-transparent cursor-pointer" />
        </label>
        <Button type="button" variant="ghost" size="sm" onClick={insertImage}><ImageIcon className="h-4 w-4" /></Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => exec('formatBlock', 'H2')}>H2</Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => exec('insertUnorderedList')}>• List</Button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        className="flex-1 overflow-auto border rounded-xl p-4 bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
        style={{ minHeight: 160 }}
        data-placeholder="Write your message to all users..."
      />

      <div className="flex justify-between items-center">
        <p className="text-xs text-muted-foreground">This will be sent to <strong>all users</strong>.</p>
        <Button onClick={send} disabled={sending}>
          {sending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
          Send to everyone
        </Button>
      </div>
    </div>
  );
};

export default Mailbox;