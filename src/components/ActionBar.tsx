
import { Button } from '@/components/ui/button';
import { Smile, DollarSign, Gift, Image } from 'lucide-react';
import EmojiPicker from '@/components/EmojiPicker';
import MoneyTransfer from '@/components/MoneyTransfer';
import { useState, useRef } from 'react';

interface ActionBarProps {
  onEmojiSelect: (emoji: string, type: 'emoji' | 'reaction') => void;
  onMoneyTransfer: (amount: number, currency: string) => void;
  onMoneyRequest: (sender: 'man' | 'woman', amount: number, currency: string, isRequest: boolean) => void;
  onImageAdd?: (imageUrl: string) => void;
}

const ActionBar = ({ onEmojiSelect, onMoneyTransfer, onMoneyRequest, onImageAdd }: ActionBarProps) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMoneyTransfer, setShowMoneyTransfer] = useState(false);
  const [showMoneyRequest, setShowMoneyRequest] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onImageAdd) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        onImageAdd(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mb-8">
      <div className="bg-gradient-to-r from-purple-100 via-pink-50 to-blue-100 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-blue-900/30 rounded-3xl p-6 border border-purple-200/50 dark:border-purple-700/50 shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 text-center">
          إضافة تفاعلات وأموال للمحادثة
        </h2>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white rounded-full px-6 py-3 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            <Smile className="w-5 h-5 mr-2" />
            😊
          </Button>

          <Button
            onClick={() => setShowMoneyTransfer(!showMoneyTransfer)}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-full px-6 py-3 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            <DollarSign className="w-5 h-5 mr-2" />
            إرسال
          </Button>

          <Button
            onClick={() => setShowMoneyRequest(!showMoneyRequest)}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-full px-6 py-3 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            <Gift className="w-5 h-5 mr-2" />
            طلب
          </Button>

          <Button
            onClick={() => fileInputRef.current?.click()}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-full px-6 py-3 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            <Image className="w-5 h-5 mr-2" />
            صورة
          </Button>
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageUpload}
          className="hidden"
        />

        {showEmojiPicker && (
          <div className="mt-6">
            <EmojiPicker onEmojiSelect={onEmojiSelect} />
          </div>
        )}

        {showMoneyTransfer && (
          <div className="mt-6">
            <MoneyTransfer
              onTransfer={onMoneyTransfer}
              title="إرسال مال"
              buttonText="إرسال المال"
              buttonColor="from-green-500 to-emerald-500"
            />
          </div>
        )}

        {showMoneyRequest && (
          <div className="mt-6">
            <MoneyTransfer
              onTransfer={(amount, currency) => onMoneyRequest('woman', amount, currency, true)}
              title="طلب مال"
              buttonText="طلب المال"
              buttonColor="from-orange-500 to-red-500"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ActionBar;
