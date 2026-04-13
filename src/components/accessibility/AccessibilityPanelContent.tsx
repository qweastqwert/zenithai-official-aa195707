import { Brain, Ear, Eye, Minus, Moon, MousePointer2, Palette, Plus, Sparkles, Sun, Type, Volume2, VolumeX, Zap, Focus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ACCESSIBILITY_PRESETS, type AccessibilityState, type Preset } from '@/components/accessibility/accessibilityPreferences';

interface AccessibilityPanelContentProps {
  state: AccessibilityState;
  onUpdate: (updates: Partial<AccessibilityState>) => void;
  onApplyPreset: (preset: Preset) => void;
  showVisibilityToggle?: boolean;
  isFloatingButtonVisible?: boolean;
  onVisibilityChange?: (visible: boolean) => void;
}

const AccessibilityPanelContent = ({
  state,
  onUpdate,
  onApplyPreset,
  showVisibilityToggle = false,
  isFloatingButtonVisible = true,
  onVisibilityChange,
}: AccessibilityPanelContentProps) => {
  return (
    <div className="space-y-4">
      {showVisibilityToggle && onVisibilityChange && (
        <div className="rounded-xl border border-border bg-muted/30 p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">Floating accessibility button</p>
              <p className="text-xs text-muted-foreground">
                {isFloatingButtonVisible ? 'Visible on the app for quick access.' : 'Hidden, but all controls stay available here.'}
              </p>
            </div>
            <Switch checked={isFloatingButtonVisible} onCheckedChange={onVisibilityChange} />
          </div>
        </div>
      )}

      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid h-10 w-full grid-cols-2 bg-muted/40">
          <TabsTrigger value="settings" className="text-xs">
            <Sparkles className="mr-1 h-3.5 w-3.5" /> Settings
          </TabsTrigger>
          <TabsTrigger value="presets" className="text-xs">
            <Brain className="mr-1 h-3.5 w-3.5" /> Presets
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="mt-4 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Type className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Text Size</span>
              </div>
              <span className="text-xs text-muted-foreground">{state.fontSize}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => onUpdate({ fontSize: Math.max(80, state.fontSize - 10) })}>
                <Minus className="h-3.5 w-3.5" />
              </Button>
              <Slider value={[state.fontSize]} min={80} max={200} step={10} onValueChange={([value]) => onUpdate({ fontSize: value })} className="flex-1" />
              <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => onUpdate({ fontSize: Math.min(200, state.fontSize + 10) })}>
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Type className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Line Height</span>
              </div>
              <span className="text-xs text-muted-foreground">{state.lineHeight}%</span>
            </div>
            <Slider value={[state.lineHeight]} min={100} max={200} step={10} onValueChange={([value]) => onUpdate({ lineHeight: value })} />
          </div>

          <Separator />

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Vision &amp; Color</p>

            <ToggleRow
              icon={<Eye className="h-4 w-4" />}
              label="High Contrast"
              description="Increase contrast for text and surfaces."
              checked={state.highContrast}
              onChange={(value) => onUpdate({ highContrast: value })}
            />

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Color Blind Correction</span>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {(['none', 'protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => onUpdate({ colorBlindMode: mode })}
                    className={`rounded-md border px-2 py-2 text-[11px] transition-colors ${
                      state.colorBlindMode === mode
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-muted/40 text-foreground hover:bg-muted'
                    }`}
                  >
                    {mode === 'none'
                      ? 'None'
                      : mode === 'protanopia'
                        ? 'Protanopia'
                        : mode === 'deuteranopia'
                          ? 'Deuteranopia'
                          : mode === 'tritanopia'
                            ? 'Tritanopia'
                            : 'Achromatopsia'}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Saturation</span>
                <span className="ml-auto text-xs text-muted-foreground">{state.saturation}%</span>
              </div>
              <Slider value={[state.saturation]} min={0} max={200} step={10} onValueChange={([value]) => onUpdate({ saturation: value })} />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>Grayscale</span>
                <span>Vivid</span>
              </div>
            </div>

            <ToggleRow
              icon={<MousePointer2 className="h-4 w-4" />}
              label="Highlight Links"
              description="Underline and emphasize all links."
              checked={state.highlightLinks}
              onChange={(value) => onUpdate({ highlightLinks: value })}
            />
          </div>

          <Separator />

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Reading</p>

            <ToggleRow
              icon={<Type className="h-4 w-4" />}
              label="Dyslexia-Friendly Font"
              description="Use OpenDyslexic styling for easier reading."
              checked={state.dyslexiaFont}
              onChange={(value) => onUpdate({ dyslexiaFont: value })}
            />

            <ToggleRow
              icon={<Type className="h-4 w-4" />}
              label="Text Spacing"
              description="Increase spacing between letters and words."
              checked={state.textSpacing}
              onChange={(value) => onUpdate({ textSpacing: value })}
            />

            <ToggleRow
              icon={<Minus className="h-4 w-4" />}
              label="Reading Guide"
              description="Show a guide line that follows the pointer."
              checked={state.readingGuide}
              onChange={(value) => onUpdate({ readingGuide: value })}
            />
          </div>

          <Separator />

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Motor &amp; Navigation</p>

            <ToggleRow
              icon={<MousePointer2 className="h-4 w-4" />}
              label="Large Cursor & Targets"
              description="Increase click targets and cursor visibility."
              checked={state.largePointer}
              onChange={(value) => onUpdate({ largePointer: value })}
            />

            <ToggleRow
              icon={<Moon className="h-4 w-4" />}
              label="Reduce Animations"
              description="Minimize motion and transitions."
              checked={state.reduceMotion}
              onChange={(value) => onUpdate({ reduceMotion: value })}
            />

            <ToggleRow
              icon={<Focus className="h-4 w-4" />}
              label="Focus Indicators"
              description="Show stronger visible focus outlines."
              checked={state.focusHighlight}
              onChange={(value) => onUpdate({ focusHighlight: value })}
            />

            <ToggleRow
              icon={<Zap className="h-4 w-4" />}
              label="Skip Navigation"
              description="Add a quick shortcut to jump to content."
              checked={state.skipNavigation}
              onChange={(value) => onUpdate({ skipNavigation: value })}
            />
          </div>

          <Separator />

          <div className="space-y-3 pb-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Screen Reader &amp; Audio</p>

            <ToggleRow
              icon={<Ear className="h-4 w-4" />}
              label="Screen Reader Optimized"
              description="Enhance semantics and structural hints."
              checked={state.screenReader}
              onChange={(value) => onUpdate({ screenReader: value })}
            />

            <ToggleRow
              icon={<Ear className="h-4 w-4" />}
              label="Announce Page Changes"
              description="Politely announce route and screen changes."
              checked={state.announcePageChanges}
              onChange={(value) => onUpdate({ announcePageChanges: value })}
            />

            <ToggleRow
              icon={state.muteSounds ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              label="Mute All Sounds"
              description="Silence non-essential sounds."
              checked={state.muteSounds}
              onChange={(value) => onUpdate({ muteSounds: value })}
            />
          </div>
        </TabsContent>

        <TabsContent value="presets" className="mt-4 space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Disability Support</p>
            <div className="space-y-2">
              {ACCESSIBILITY_PRESETS.filter((preset) => preset.category === 'disability').map((preset) => (
                <PresetCard
                  key={preset.id}
                  preset={preset}
                  isActive={state.activePreset === preset.id}
                  onToggle={() => onApplyPreset(preset)}
                />
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Mental Health Support</p>
            <div className="space-y-2">
              {ACCESSIBILITY_PRESETS.filter((preset) => preset.category === 'mental').map((preset) => (
                <PresetCard
                  key={preset.id}
                  preset={preset}
                  isActive={state.activePreset === preset.id}
                  onToggle={() => onApplyPreset(preset)}
                />
              ))}
            </div>
          </div>

          <p className="pb-1 pt-2 text-center text-[10px] text-muted-foreground">
            Tap a preset to activate it, then fine-tune anything in Settings.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const PresetCard = ({ preset, isActive, onToggle }: { preset: Preset; isActive: boolean; onToggle: () => void }) => (
  <button
    type="button"
    onClick={onToggle}
    className={`w-full rounded-xl border p-3 text-left transition-all ${
      isActive ? 'border-primary bg-primary/10 shadow-sm' : 'border-border bg-muted/30 hover:bg-muted/60'
    }`}
  >
    <div className="flex items-start gap-3">
      <div className={`mt-0.5 rounded-lg p-1.5 ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
        {preset.icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-foreground">{preset.name}</p>
          {isActive && <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">Active</span>}
        </div>
        <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground">{preset.description}</p>
      </div>
    </div>
  </button>
);

const ToggleRow = ({ icon, label, description, checked, onChange }: {
  icon: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) => (
  <div className="flex items-center justify-between gap-3">
    <div className="flex min-w-0 items-start gap-2">
      <div className="mt-0.5 shrink-0 text-muted-foreground">{icon}</div>
      <div className="min-w-0">
        <p className="text-sm font-medium leading-tight text-foreground">{label}</p>
        <p className="text-[11px] leading-tight text-muted-foreground">{description}</p>
      </div>
    </div>
    <Switch checked={checked} onCheckedChange={onChange} className="shrink-0" />
  </div>
);

export default AccessibilityPanelContent;