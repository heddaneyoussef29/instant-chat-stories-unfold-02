
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { UserCheck } from 'lucide-react';
import { detectLanguage } from '@/utils/aiGeneratorHelpers';

interface CustomPromptSectionProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  extractedNames: {man: string, woman: string} | null;
  onApplyExtractedNames: () => void;
  onUpdateParticipants?: (manName: string, womanName: string) => void;
}

const CustomPromptSection = ({ 
  prompt, 
  onPromptChange, 
  extractedNames, 
  onApplyExtractedNames,
  onUpdateParticipants 
}: CustomPromptSectionProps) => {
  return (
    <div>
      <Label htmlFor="custom-prompt" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        طلب مخصص (اختياري)
      </Label>
      <Textarea
        id="custom-prompt"
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        placeholder="مثال: محادثة بين &quot;أحمد&quot; و &quot;سارة&quot; تتضمن دردشة غيرة وحب ومشاكل تنتهي بمفاجأة..."
        className="mt-1"
        rows={3}
        dir="rtl"
      />
      
      {prompt.trim() && (
        <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
          {detectLanguage(prompt) === 'arabic' 
            ? '🇸🇦 تم اكتشاف اللغة العربية - ستتم كتابة المحادثة بالعربية'
            : '🇺🇸 English language detected - conversation will be generated in English'
          }
        </div>
      )}
      
      {extractedNames && onUpdateParticipants && (
        <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <UserCheck className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-700 dark:text-green-300">
                تم العثور على الأسماء: <strong>{extractedNames.man}</strong> و <strong>{extractedNames.woman}</strong>
              </span>
            </div>
            <Button onClick={onApplyExtractedNames} size="sm" variant="outline" className="text-green-600 border-green-300 hover:bg-green-50">
              تطبيق الأسماء
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomPromptSection;
