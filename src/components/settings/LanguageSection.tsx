import React from 'react';
import { Globe } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/use-toast';

const LanguageSection: React.FC = () => {
  const { language, setLanguage, languages } = useLanguage();
  const { toast } = useToast();

  const indian = languages.filter((l) => l.group === 'indian');
  const international = languages.filter((l) => l.group === 'international');

  const handleChange = (code: string) => {
    setLanguage(code);
    const selected = languages.find((l) => l.code === code);
    toast({
      title: 'Language Updated 🌐',
      description: `Zenith will now prefer ${selected?.label} (${selected?.native}).`,
    });
  };

  const current = languages.find((l) => l.code === language);

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Globe className="h-5 w-5" style={{ color: 'var(--zenith-primary)' }} />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Language</h3>
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-gray-900 dark:text-gray-100">App language</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Currently: {current?.label} ({current?.native})
          </span>
        </div>
        <Select value={language} onValueChange={handleChange}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-80">
            <SelectGroup>
              <SelectLabel>Indian Languages</SelectLabel>
              {indian.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.label} — {lang.native}
                </SelectItem>
              ))}
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>International</SelectLabel>
              {international.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.label} — {lang.native}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default LanguageSection;
