import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Smile, Image, Type } from 'lucide-react';

interface AvatarEditorProps {
  avatarType: 'emoji' | 'image' | 'letter';
  avatarEmoji: string;
  avatarImageData: string | null;
  characterName: string;
  onAvatarTypeChange: (type: 'emoji' | 'image' | 'letter') => void;
  onEmojiChange: (emoji: string) => void;
  onImageChange: (dataUrl: string) => void;
}

// Deterministic color from string
const getColorFromName = (name: string): string => {
  const colors = [
    '#EF4444', '#F97316', '#F59E0B', '#84CC16', '#10B981',
    '#06B6D4', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899',
    '#F43F5E', '#14B8A6', '#0EA5E9', '#A855F7', '#E11D48',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const AvatarEditor: React.FC<AvatarEditorProps> = ({
  avatarType,
  avatarEmoji,
  avatarImageData,
  characterName,
  onAvatarTypeChange,
  onEmojiChange,
  onImageChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rawImage, setRawImage] = useState<HTMLImageElement | null>(null);
  const [cropOffset, setCropOffset] = useState({ x: 0, y: 0 });
  const [cropScale, setCropScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new window.Image();
    img.onload = () => {
      setRawImage(img);
      // Center the image
      const scale = 128 / Math.min(img.width, img.height);
      setCropScale(scale);
      setCropOffset({
        x: -(img.width * scale - 128) / 2,
        y: -(img.height * scale - 128) / 2,
      });
    };
    img.src = URL.createObjectURL(file);
  };

  const applyCrop = useCallback(() => {
    if (!rawImage || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, 128, 128);
    ctx.beginPath();
    ctx.arc(64, 64, 64, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(
      rawImage,
      cropOffset.x,
      cropOffset.y,
      rawImage.width * cropScale,
      rawImage.height * cropScale
    );
    const dataUrl = canvas.toDataURL('image/png');
    onImageChange(dataUrl);
    onAvatarTypeChange('image');
  }, [rawImage, cropOffset, cropScale, onImageChange, onAvatarTypeChange]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - cropOffset.x, y: e.clientY - cropOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setCropOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  const letterColor = getColorFromName(characterName || 'A');
  const letter = (characterName || 'A').charAt(0).toUpperCase();

  return (
    <div className="space-y-3">
      <Label>Avatar</Label>
      <Tabs value={avatarType} onValueChange={(v) => onAvatarTypeChange(v as any)}>
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="emoji" className="gap-1 text-xs"><Smile className="h-3 w-3" /> Emoji</TabsTrigger>
          <TabsTrigger value="image" className="gap-1 text-xs"><Image className="h-3 w-3" /> Image</TabsTrigger>
          <TabsTrigger value="letter" className="gap-1 text-xs"><Type className="h-3 w-3" /> Letter</TabsTrigger>
        </TabsList>

        <TabsContent value="emoji" className="mt-2">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <span className="text-3xl">{avatarEmoji || '🤖'}</span>
            </div>
            <Input
              value={avatarEmoji}
              onChange={(e) => onEmojiChange(e.target.value)}
              placeholder="🤖"
              className="w-20"
            />
          </div>
        </TabsContent>

        <TabsContent value="image" className="mt-2">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              {avatarImageData ? (
                <img src={avatarImageData} className="w-16 h-16 rounded-full object-cover" alt="avatar" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-xs">
                  No image
                </div>
              )}
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                Choose Image
              </Button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
            </div>
            {rawImage && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Drag to position, then click Crop</p>
                <div
                  className="w-32 h-32 rounded-full overflow-hidden border-2 border-primary mx-auto cursor-move relative"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <img
                    src={rawImage.src}
                    alt="crop preview"
                    className="absolute pointer-events-none"
                    style={{
                      left: cropOffset.x,
                      top: cropOffset.y,
                      width: rawImage.width * cropScale,
                      height: rawImage.height * cropScale,
                    }}
                    draggable={false}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-xs">Zoom</Label>
                  <input
                    type="range"
                    min="0.1"
                    max="3"
                    step="0.05"
                    value={cropScale}
                    onChange={(e) => setCropScale(parseFloat(e.target.value))}
                    className="flex-1"
                  />
                </div>
                <Button size="sm" className="w-full" onClick={applyCrop}>
                  Crop & Apply
                </Button>
              </div>
            )}
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </TabsContent>

        <TabsContent value="letter" className="mt-2">
          <div className="flex items-center gap-3">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: letterColor }}
            >
              <span className="text-2xl font-bold text-white">{letter}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Auto-generated from character name
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export { getColorFromName };
export default AvatarEditor;
