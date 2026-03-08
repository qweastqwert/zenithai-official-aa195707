import { useState, useMemo } from 'react';
import { Brain, Plus, Edit2, Trash2, Save, X, Search, Filter, Clock, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMindArchive, Memory } from '@/hooks/useMindArchive';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const CATEGORY_COLORS: Record<string, string> = {
  trigger: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  preference: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  goal: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  insight: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  coping: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  relationship: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
};

const PRESET_CATEGORIES = ['trigger', 'preference', 'goal', 'insight', 'coping', 'relationship'];

export const MindArchiveSection = () => {
  const { memories, loading, addMemory, updateMemory, deleteMemory } = useMindArchive();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [newMemoryText, setNewMemoryText] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [editText, setEditText] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = useMemo(() => {
    const cats = new Set<string>();
    memories.forEach(m => { if (m.category) cats.add(m.category); });
    return Array.from(cats).sort();
  }, [memories]);

  const filteredMemories = useMemo(() => {
    return memories.filter(m => {
      const matchesSearch = !searchQuery || 
        m.memory_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.category?.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesFilter = filterCategory === 'all' || m.category === filterCategory;
      return matchesSearch && matchesFilter;
    });
  }, [memories, searchQuery, filterCategory]);

  const stats = useMemo(() => ({
    total: memories.length,
    categories: categories.length,
    recent: memories.filter(m => {
      const d = new Date(m.created_at);
      const now = new Date();
      return (now.getTime() - d.getTime()) < 7 * 24 * 60 * 60 * 1000;
    }).length,
  }), [memories, categories]);

  const getCategoryClass = (cat: string | null) => {
    if (!cat) return 'bg-muted text-muted-foreground';
    return CATEGORY_COLORS[cat.toLowerCase()] || 'bg-muted text-muted-foreground';
  };

  const handleAdd = async () => {
    if (!newMemoryText.trim()) return;
    await addMemory(newMemoryText, newCategory);
    setNewMemoryText('');
    setNewCategory('');
    setIsAdding(false);
  };

  const handleEdit = (memory: Memory) => {
    setEditingId(memory.id);
    setEditText(memory.memory_text);
    setEditCategory(memory.category || '');
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editText.trim()) return;
    await updateMemory(editingId, editText, editCategory);
    setEditingId(null);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteMemory(deleteId);
    setDeleteId(null);
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Brain className="w-4 h-4 text-primary" />
            </div>
            <CardTitle className="text-lg">MindArchive</CardTitle>
          </div>
          {!isAdding && (
            <Button variant="outline" size="sm" onClick={() => setIsAdding(true)}>
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          )}
        </div>
        <CardDescription>
          Key information MindMate remembers about you from conversations
        </CardDescription>

        {/* Stats row */}
        <div className="flex gap-4 pt-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Brain className="w-3 h-3" />
            <span>{stats.total} memories</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Tag className="w-3 h-3" />
            <span>{stats.categories} categories</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{stats.recent} this week</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search & Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search memories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[140px] h-9">
              <Filter className="w-3 h-3 mr-1" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Add form */}
        {isAdding && (
          <div className="space-y-3 p-4 border rounded-lg bg-primary/5 border-primary/20">
            <Select value={newCategory} onValueChange={setNewCategory}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Select category..." />
              </SelectTrigger>
              <SelectContent>
                {PRESET_CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea
              placeholder="What should MindMate remember?"
              value={newMemoryText}
              onChange={(e) => setNewMemoryText(e.target.value)}
              rows={3}
            />
            <div className="flex gap-2">
              <Button onClick={handleAdd} size="sm">
                <Save className="w-4 h-4 mr-1" /> Save
              </Button>
              <Button onClick={() => { setIsAdding(false); setNewMemoryText(''); setNewCategory(''); }} variant="outline" size="sm">
                <X className="w-4 h-4 mr-1" /> Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Memories list */}
        <ScrollArea className="h-[350px] pr-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
              <p className="text-sm text-muted-foreground">Loading memories...</p>
            </div>
          ) : filteredMemories.length === 0 ? (
            <div className="text-center py-12">
              <Brain className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                {searchQuery || filterCategory !== 'all' 
                  ? 'No memories match your search' 
                  : 'No memories yet. MindMate will automatically save important insights.'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredMemories.map((memory) => (
                <div
                  key={memory.id}
                  className="group p-3 border rounded-lg bg-card hover:bg-muted/50 transition-all duration-200 hover:shadow-sm"
                >
                  {editingId === memory.id ? (
                    <div className="space-y-2">
                      <Select value={editCategory} onValueChange={setEditCategory}>
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {PRESET_CATEGORIES.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Textarea value={editText} onChange={(e) => setEditText(e.target.value)} rows={2} />
                      <div className="flex gap-2">
                        <Button onClick={handleSaveEdit} size="sm" className="h-7 text-xs">
                          <Save className="w-3 h-3 mr-1" /> Save
                        </Button>
                        <Button onClick={() => setEditingId(null)} variant="outline" size="sm" className="h-7 text-xs">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          {memory.category && (
                            <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 mb-1.5 ${getCategoryClass(memory.category)}`}>
                              {memory.category}
                            </Badge>
                          )}
                          <p className="text-sm leading-relaxed">{memory.memory_text}</p>
                          <p className="text-[10px] text-muted-foreground mt-1.5">
                            {new Date(memory.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(memory)} className="h-7 w-7 p-0">
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setDeleteId(memory.id)} className="h-7 w-7 p-0 text-destructive hover:text-destructive">
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Memory?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove this memory from your MindArchive.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};
