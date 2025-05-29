
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Trash2 } from 'lucide-react';

interface Message {
  id: string;
  sender: 'man' | 'woman';
  content: string;
  type?: 'text' | 'money' | 'emoji';
  amount?: number;
  currency?: string;
}

interface MessageEditorProps {
  message: Message;
  index: number;
  onUpdate: (id: string, field: keyof Message, value: string | number) => void;
  onRemove: (id: string) => void;
}

const MessageEditor = ({ message, index, onUpdate, onRemove }: MessageEditorProps) => {
  return (
    <div className="bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-600/50 hover:shadow-lg transition-all transform hover:scale-[1.02]">
      <div className="flex items-start space-x-4">
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              الرسالة {index + 1}
            </Label>
            <div className="flex items-center space-x-2">
              {message.type === 'money' && (
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                  💰 مالية
                </span>
              )}
              <select
                value={message.sender}
                onChange={(e) => onUpdate(message.id, 'sender', e.target.value)}
                className="px-3 py-1 bg-white/80 dark:bg-gray-600/80 border border-gray-300 dark:border-gray-500 rounded-lg text-sm font-medium"
              >
                <option value="man">الرجل</option>
                <option value="woman">المرأة</option>
              </select>
            </div>
          </div>
          <Textarea
            value={message.content}
            onChange={(e) => onUpdate(message.id, 'content', e.target.value)}
            placeholder="أدخل محتوى الرسالة"
            className="min-h-[80px] bg-white/80 dark:bg-gray-600/80 border-2 border-gray-200/50 dark:border-gray-500/50 focus:border-purple-400 transition-all resize-none"
            dir="rtl"
          />
          {message.type === 'money' && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                <span className="text-sm font-medium">
                  💰 {message.content.includes('طلب') ? 'طلب' : 'تحويل'} مالي: {message.amount} {message.currency}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={message.amount || ''}
                  onChange={(e) => onUpdate(message.id, 'amount', parseFloat(e.target.value) || 0)}
                  className="w-20 text-sm"
                  placeholder="المبلغ"
                />
                <select
                  value={message.currency || 'USD'}
                  onChange={(e) => onUpdate(message.id, 'currency', e.target.value)}
                  className="px-2 py-1 bg-white/80 dark:bg-gray-600/80 border border-gray-300 dark:border-gray-500 rounded text-sm"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="SAR">SAR</option>
                </select>
              </div>
            </div>
          )}
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onRemove(message.id)}
          className="rounded-full bg-red-500/20 hover:bg-red-500 text-red-600 hover:text-white border-2 border-red-200 hover:border-red-500 transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default MessageEditor;
