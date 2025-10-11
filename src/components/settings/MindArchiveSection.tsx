import { useState } from 'react';
import { Brain, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMindArchive, Memory } from '@/hooks/useMindArchive';
import { ScrollArea } from '@/components/ui/scroll-area';
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

export const MindArchiveSection = () => {
  const { memories, loading, addMemory, updateMemory, deleteMemory } = useMindArchive();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [newMemoryText, setNewMemoryText] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [editText, setEditText] = useState('');
  const [editCategory, setEditCategory] = useState('');

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
    setEditText('');
    setEditCategory('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
    setEditCategory('');
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteMemory(deleteId);
    setDeleteId(null);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <CardTitle>MindArchive</CardTitle>
          </div>
          {!isAdding && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAdding(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Memory
            </Button>
          )}
        </div>
        <CardDescription>
          Key information MindMate remembers about you from conversations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAdding && (
          <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
            <Input
              placeholder="Category (e.g., trigger, preference, goal)"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <Textarea
              placeholder="What should MindMate remember?"
              value={newMemoryText}
              onChange={(e) => setNewMemoryText(e.target.value)}
              rows={3}
            />
            <div className="flex gap-2">
              <Button onClick={handleAdd} size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button
                onClick={() => {
                  setIsAdding(false);
                  setNewMemoryText('');
                  setNewCategory('');
                }}
                variant="outline"
                size="sm"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        )}

        <ScrollArea className="h-[400px] pr-4">
          {loading ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Loading memories...
            </p>
          ) : memories.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No memories yet. MindMate will automatically save important insights from your conversations.
            </p>
          ) : (
            <div className="space-y-3">
              {memories.map((memory) => (
                <div
                  key={memory.id}
                  className="p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors"
                >
                  {editingId === memory.id ? (
                    <div className="space-y-3">
                      <Input
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        placeholder="Category"
                      />
                      <Textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button onClick={handleSaveEdit} size="sm">
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button
                          onClick={handleCancelEdit}
                          variant="outline"
                          size="sm"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        {memory.category && (
                          <Badge variant="secondary" className="text-xs">
                            {memory.category}
                          </Badge>
                        )}
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(memory)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteId(memory.id)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm">{memory.memory_text}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(memory.created_at).toLocaleDateString()}
                      </p>
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
                This will permanently remove this memory from your MindArchive. This action cannot be undone.
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
