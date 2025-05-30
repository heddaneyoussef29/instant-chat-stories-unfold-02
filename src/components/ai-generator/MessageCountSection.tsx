
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface MessageCountSectionProps {
  messageCount: number;
  onMessageCountChange: (count: number) => void;
}

const MessageCountSection = ({ messageCount, onMessageCountChange }: MessageCountSectionProps) => {
  return (
    <div>
      <Label htmlFor="message-count" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        عدد الرسائل المطلوبة
      </Label>
      <div className="mt-1 space-y-3">
        <Input
          id="message-count"
          type="number"
          value={messageCount}
          onChange={(e) => onMessageCountChange(Math.max(10, Math.min(100, parseInt(e.target.value) || 60)))}
          placeholder="60"
          className="text-lg p-4 text-center font-bold"
          min="10"
          max="100"
          step="10"
          inputMode="numeric"
        />
        
        <div className="grid grid-cols-3 gap-2">
          {[20, 40, 60, 80, 100].map((count) => (
            <Button
              key={count}
              variant={messageCount === count ? "default" : "outline"}
              size="sm"
              onClick={() => onMessageCountChange(count)}
              className="text-sm"
            >
              {count} رسالة
            </Button>
          ))}
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-1">
        سيتم توزيع الرسائل بالتساوي بين الشخصين ({Math.floor(messageCount / 2)} لكل شخص)
      </p>
    </div>
  );
};

export default MessageCountSection;
