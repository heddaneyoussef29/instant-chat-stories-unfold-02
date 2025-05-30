
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface APIKeySectionProps {
  apiKey: string;
  onApiKeyChange: (value: string) => void;
  onSaveApiKey: () => void;
}

const APIKeySection = ({ apiKey, onApiKeyChange, onSaveApiKey }: APIKeySectionProps) => {
  return (
    <div>
      <Label htmlFor="api-key" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        مفتاح Gemini API
      </Label>
      <div className="flex space-x-2 mt-1">
        <Input
          id="api-key"
          type="password"
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
          placeholder="أدخل مفتاح Gemini API الخاص بك"
          className="flex-1"
        />
        <Button onClick={onSaveApiKey} variant="outline" size="sm">
          حفظ
        </Button>
      </div>
      <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
        تنبيه: سيتم حفظ المفتاح محلياً في متصفحك فقط
      </p>
    </div>
  );
};

export default APIKeySection;
