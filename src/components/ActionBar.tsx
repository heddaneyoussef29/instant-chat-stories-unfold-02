
import { Button } from '@/components/ui/button';
import { DollarSign } from 'lucide-react';
import EmojiPicker from '@/components/EmojiPicker';
import MoneyTransfer from '@/components/MoneyTransfer';

interface ActionBarProps {
  onEmojiSelect: (emoji: string, type: 'emoji' | 'reaction') => void;
  onMoneyTransfer: (amount: number, currency: string) => void;
  onMoneyRequest: (sender: 'man' | 'woman', amount: number, currency: string, isRequest: boolean) => void;
}

const ActionBar = ({ onEmojiSelect, onMoneyTransfer, onMoneyRequest }: ActionBarProps) => {
  return (
    <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 rounded-2xl p-4 mb-8 border border-purple-200/30 dark:border-purple-700/30">
      <div className="flex justify-center items-center space-x-4">
        <EmojiPicker onEmojiSelect={onEmojiSelect} />
        <MoneyTransfer onMoneyTransfer={onMoneyTransfer} />
        
        {/* Money Request Buttons */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onMoneyRequest('woman', 100, 'USD', true)}
            className="text-orange-500 hover:text-orange-600 dark:text-orange-400"
            title="طلب مال من المرأة"
          >
            <DollarSign className="w-5 h-5" />
            <span className="text-xs ml-1">طلب</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onMoneyRequest('man', 100, 'USD', false)}
            className="text-green-500 hover:text-green-600 dark:text-green-400"
            title="إرسال مال من الرجل"
          >
            <DollarSign className="w-5 h-5" />
            <span className="text-xs ml-1">إرسال</span>
          </Button>
        </div>
        
        <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">إضافة تفاعلات وأموال للمحادثة</span>
      </div>
    </div>
  );
};

export default ActionBar;
