import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, Type, Sparkles, RotateCcw, Eye, Zap } from 'lucide-react';
import { useUICustomization } from '@/hooks/useUICustomization';
import { useToast } from '@/hooks/use-toast';

const UICustomizationSection = () => {
  const { customization, updateCustomization, resetCustomization } = useUICustomization();
  const { toast } = useToast();

  const handleReset = () => {
    resetCustomization();
    toast({
      title: "Settings Reset ↻",
      description: "All customization settings have been reset to default.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5" style={{ color: 'var(--zenith-primary)' }} />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Appearance</h3>
        </div>
        <Button variant="outline" size="sm" onClick={handleReset} className="flex items-center gap-2">
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>

      {/* Text Settings */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Type className="h-4 w-4" />
            Text & Size
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm">Font Style</Label>
              <Select 
                value={customization.fontFamily} 
                onValueChange={(value: 'inter' | 'roboto' | 'open-sans' | 'poppins' | 'playfair' | 'serif' | 'mono' | 'dancing-script' | 'oswald' | 'merriweather') => updateCustomization({ fontFamily: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inter">Modern (Default)</SelectItem>
                  <SelectItem value="roboto">Clean</SelectItem>
                  <SelectItem value="open-sans">Friendly</SelectItem>
                  <SelectItem value="poppins">Rounded</SelectItem>
                  <SelectItem value="merriweather">Classic</SelectItem>
                  <SelectItem value="mono">Monospace</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Text Size</Label>
              <Select 
                value={customization.fontSize} 
                onValueChange={(value: 'xs' | 'sm' | 'base' | 'lg' | 'xl') => updateCustomization({ fontSize: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sm">Small</SelectItem>
                  <SelectItem value="base">Normal</SelectItem>
                  <SelectItem value="lg">Large</SelectItem>
                  <SelectItem value="xl">Extra Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Interface Size</Label>
            <p className="text-xs text-muted-foreground">Make everything bigger or smaller</p>
            <Select 
              value={customization.uiScale} 
              onValueChange={(value: 'compact' | 'default' | 'comfortable' | 'large') => updateCustomization({ uiScale: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compact">Compact (Small screens)</SelectItem>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="comfortable">Comfortable</SelectItem>
                <SelectItem value="large">Large (Easier to read)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Visual Effects */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Palette className="h-4 w-4" />
            Visual Effects
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm">Animations</Label>
              <p className="text-xs text-muted-foreground">Smooth transitions and effects</p>
            </div>
            <Switch 
              checked={customization.animations} 
              onCheckedChange={(checked) => updateCustomization({ animations: checked })} 
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm">Shadows</Label>
              <p className="text-xs text-muted-foreground">Depth effects on buttons and cards</p>
            </div>
            <Switch 
              checked={customization.shadows} 
              onCheckedChange={(checked) => updateCustomization({ shadows: checked })} 
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm">Glass Effect</Label>
              <p className="text-xs text-muted-foreground">Frosted glass look on panels</p>
            </div>
            <Switch 
              checked={customization.glassEffect} 
              onCheckedChange={(checked) => updateCustomization({ glassEffect: checked })} 
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Corner Style</Label>
            <Select 
              value={customization.borderRadius} 
              onValueChange={(value: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full') => updateCustomization({ borderRadius: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Square</SelectItem>
                <SelectItem value="sm">Slightly Rounded</SelectItem>
                <SelectItem value="md">Rounded (Default)</SelectItem>
                <SelectItem value="lg">More Rounded</SelectItem>
                <SelectItem value="xl">Very Rounded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Accessibility */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Eye className="h-4 w-4" />
            Accessibility
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm">High Contrast</Label>
              <p className="text-xs text-muted-foreground">Better visibility for text and buttons</p>
            </div>
            <Switch 
              checked={customization.highContrast} 
              onCheckedChange={(checked) => updateCustomization({ highContrast: checked })} 
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm">Reduce Motion</Label>
              <p className="text-xs text-muted-foreground">Fewer animations (helps with motion sensitivity)</p>
            </div>
            <Switch 
              checked={customization.reduceMotion} 
              onCheckedChange={(checked) => updateCustomization({ reduceMotion: checked })} 
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm">Dyslexia-Friendly Font</Label>
              <p className="text-xs text-muted-foreground">Easier to read font style</p>
            </div>
            <Switch 
              checked={customization.dyslexiaFont} 
              onCheckedChange={(checked) => updateCustomization({ dyslexiaFont: checked })} 
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UICustomizationSection;
