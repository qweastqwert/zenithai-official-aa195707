import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Palette, Type, Layout, Sparkles, Accessibility, RotateCcw } from 'lucide-react';
import { useUICustomization } from '@/hooks/useUICustomization';
import { useToast } from '@/hooks/use-toast';

const UICustomizationSection = () => {
  const { customization, updateCustomization, resetCustomization } = useUICustomization();
  const { toast } = useToast();

  const handleReset = () => {
    resetCustomization();
    toast({
      title: "UI Reset ↻",
      description: "All customization settings have been reset to default.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5" style={{ color: 'var(--zenith-primary)' }} />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">UI Customization</h3>
        </div>
        <Button variant="outline" size="sm" onClick={handleReset} className="flex items-center gap-2">
          <RotateCcw className="h-4 w-4" />
          Reset All
        </Button>
      </div>

      <Tabs defaultValue="layout" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="visual">Visual</TabsTrigger>
          <TabsTrigger value="accessibility">A11y</TabsTrigger>
        </TabsList>

        <TabsContent value="layout" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="h-4 w-4" />
                Layout & Structure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Sidebar Position</Label>
                  <Select 
                    value={customization.sidebarPosition} 
                    onValueChange={(value: 'left' | 'right') => updateCustomization({ sidebarPosition: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Header Style</Label>
                  <Select 
                    value={customization.headerStyle} 
                    onValueChange={(value: 'floating' | 'fixed' | 'hidden') => updateCustomization({ headerStyle: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed</SelectItem>
                      <SelectItem value="floating">Floating</SelectItem>
                      <SelectItem value="hidden">Hidden</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Content Padding</Label>
                  <Select 
                    value={customization.contentPadding} 
                    onValueChange={(value: 'tight' | 'normal' | 'spacious') => updateCustomization({ contentPadding: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tight">Tight</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="spacious">Spacious</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Border Radius</Label>
                  <Select 
                    value={customization.borderRadius} 
                    onValueChange={(value: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full') => updateCustomization({ borderRadius: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="sm">Small</SelectItem>
                      <SelectItem value="md">Medium</SelectItem>
                      <SelectItem value="lg">Large</SelectItem>
                      <SelectItem value="xl">Extra Large</SelectItem>
                      <SelectItem value="full">Full</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label>Compact Mode</Label>
                <Switch 
                  checked={customization.compactMode} 
                  onCheckedChange={(checked) => updateCustomization({ compactMode: checked })} 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="typography" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                Typography Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Font Family</Label>
                  <Select 
                    value={customization.fontFamily} 
                    onValueChange={(value: 'inter' | 'roboto' | 'open-sans' | 'poppins' | 'playfair' | 'serif' | 'mono' | 'dancing-script' | 'oswald' | 'merriweather') => updateCustomization({ fontFamily: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inter">Inter (Modern Sans)</SelectItem>
                      <SelectItem value="roboto">Roboto (Clean Sans)</SelectItem>
                      <SelectItem value="open-sans">Open Sans (Friendly)</SelectItem>
                      <SelectItem value="poppins">Poppins (Rounded)</SelectItem>
                      <SelectItem value="oswald">Oswald (Bold Sans)</SelectItem>
                      <SelectItem value="merriweather">Merriweather (Serif)</SelectItem>
                      <SelectItem value="playfair">Playfair Display (Elegant)</SelectItem>
                      <SelectItem value="dancing-script">Dancing Script (Handwritten)</SelectItem>
                      <SelectItem value="serif">System Serif</SelectItem>
                      <SelectItem value="mono">Monospace (Code)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Font Size</Label>
                  <Select 
                    value={customization.fontSize} 
                    onValueChange={(value: 'xs' | 'sm' | 'base' | 'lg' | 'xl') => updateCustomization({ fontSize: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="xs">Extra Small</SelectItem>
                      <SelectItem value="sm">Small</SelectItem>
                      <SelectItem value="base">Normal</SelectItem>
                      <SelectItem value="lg">Large</SelectItem>
                      <SelectItem value="xl">Extra Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Font Weight</Label>
                  <Select 
                    value={customization.fontWeight} 
                    onValueChange={(value: 'light' | 'normal' | 'medium' | 'semibold' | 'bold') => updateCustomization({ fontWeight: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="semibold">Semi Bold</SelectItem>
                      <SelectItem value="bold">Bold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Line Height</Label>
                  <Select 
                    value={customization.lineHeight} 
                    onValueChange={(value: 'tight' | 'normal' | 'relaxed' | 'loose') => updateCustomization({ lineHeight: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tight">Tight</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="relaxed">Relaxed</SelectItem>
                      <SelectItem value="loose">Loose</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Letter Spacing</Label>
                  <Select 
                    value={customization.letterSpacing} 
                    onValueChange={(value: 'tighter' | 'tight' | 'normal' | 'wide' | 'wider') => updateCustomization({ letterSpacing: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tighter">Tighter</SelectItem>
                      <SelectItem value="tight">Tight</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="wide">Wide</SelectItem>
                      <SelectItem value="wider">Wider</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-medium mb-2">Typography Preview</h4>
                <div className="space-y-2">
                  <p className="text-2xl">The quick brown fox jumps over the lazy dog</p>
                  <p className="text-base">This is how your text will look with the current settings.</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Smaller text for details and descriptions.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Visual Effects & Colors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Drop Shadows</Label>
                  <Switch 
                    checked={customization.shadows} 
                    onCheckedChange={(checked) => updateCustomization({ shadows: checked })} 
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Animations</Label>
                  <Switch 
                    checked={customization.animations} 
                    onCheckedChange={(checked) => updateCustomization({ animations: checked })} 
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Glass Effect</Label>
                  <Switch 
                    checked={customization.glassEffect} 
                    onCheckedChange={(checked) => updateCustomization({ glassEffect: checked })} 
                  />
                </div>

                <div className="space-y-2">
                  <Label>Background Pattern</Label>
                  <Select 
                    value={customization.backgroundPattern} 
                    onValueChange={(value: 'none' | 'dots' | 'grid' | 'waves' | 'gradient') => updateCustomization({ backgroundPattern: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="dots">Dots</SelectItem>
                      <SelectItem value="grid">Grid</SelectItem>
                      <SelectItem value="waves">Waves</SelectItem>
                      <SelectItem value="gradient">Gradient</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium">Custom Colors</h4>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="space-y-2">
                      <Label>Card Background</Label>
                      <Input 
                        type="color"
                        value={customization.cardBackground || '#ffffff'}
                        onChange={(e) => updateCustomization({ cardBackground: e.target.value })}
                        className="h-10 w-20"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accessibility" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Accessibility className="h-4 w-4" />
                Accessibility & Comfort Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>High Contrast Mode</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Increases contrast for better visibility</p>
                </div>
                <Switch 
                  checked={customization.highContrast} 
                  onCheckedChange={(checked) => updateCustomization({ highContrast: checked })} 
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Reduce Motion</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Minimizes animations and transitions</p>
                </div>
                <Switch 
                  checked={customization.reduceMotion} 
                  onCheckedChange={(checked) => updateCustomization({ reduceMotion: checked })} 
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Focus Indicators</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Enhanced keyboard navigation indicators</p>
                </div>
                <Switch 
                  checked={customization.focusIndicators} 
                  onCheckedChange={(checked) => updateCustomization({ focusIndicators: checked })} 
                />
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">Reading Comfort</h4>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Dyslexia-Friendly Font</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Uses OpenDyslexic font for better readability</p>
                  </div>
                  <Switch 
                    checked={customization.dyslexiaFont} 
                    onCheckedChange={(checked) => updateCustomization({ dyslexiaFont: checked })} 
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Screen Reader Optimized</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Enhances compatibility with screen readers</p>
                  </div>
                  <Switch 
                    checked={customization.screenReaderOptimized} 
                    onCheckedChange={(checked) => updateCustomization({ screenReaderOptimized: checked })} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UICustomizationSection;
