
import { Button } from '@/components/ui/button';
import { MessageSquare, Users, Sparkles, Loader2 } from 'lucide-react';

interface GenerationButtonsProps {
  isGenerating: boolean;
  hasApiKey: boolean;
  onGenerate: (type: 'romantic' | 'casual' | 'custom') => void;
  messageCount: number;
}

const GenerationButtons = ({ isGenerating, hasApiKey, onGenerate, messageCount }: GenerationButtonsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Button
          onClick={() => onGenerate('romantic')}
          disabled={isGenerating || !hasApiKey}
          className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white"
        >
          {isGenerating ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <MessageSquare className="w-4 h-4 mr-2" />
          )}
          محادثة رومانسية
        </Button>

        <Button
          onClick={() => onGenerate('casual')}
          disabled={isGenerating || !hasApiKey}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
        >
          {isGenerating ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Users className="w-4 h-4 mr-2" />
          )}
          محادثة عادية
        </Button>

        <Button
          onClick={() => onGenerate('custom')}
          disabled={isGenerating || !hasApiKey}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
        >
          {isGenerating ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4 mr-2" />
          )}
          طلب مخصص
        </Button>
      </div>

      {isGenerating && (
        <div className="text-center text-sm text-gray-600 dark:text-gray-400 space-y-2">
          <p>جاري توليد {messageCount} رسالة... يرجى الانتظار</p>
          <p className="text-xs">قد يستغرق الأمر بضع دقائق للمحادثات الطويلة</p>
        </div>
      )}
    </div>
  );
};

export default GenerationButtons;
