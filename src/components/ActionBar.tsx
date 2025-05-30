
import { Button } from '@/components/ui/button';
import { Smile, DollarSign, Gift, Image } from 'lucide-react';
import EmojiPicker from '@/components/EmojiPicker';
import MoneyTransfer from '@/components/MoneyTransfer';
import { useState, useRef } from 'react';

interface ActionBarProps {
  onEmojiSelect: (emoji: string, type: 'emoji' | 'reaction') => void;
  onMoneyTransfer: (amount: number, currency: string) => void;
  onMoneyRequest: (sender: 'man' | 'woman', amount: number, currency: string, isRequest: boolean) => void;
  onImageAdd?: (imageUrl: string, sender: 'man' | 'woman') => void;
}

const ActionBar = ({ onEmojiSelect, onMoneyTransfer, onMoneyRequest, onImageAdd }: ActionBarProps) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMoneyTransfer, setShowMoneyTransfer] = useState(false);
  const [showMoneyRequest, setShowMoneyRequest] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [selectedSender, setSelectedSender] = useState<'man' | 'woman'>('man');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onImageAdd) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        onImageAdd(imageUrl, selectedSender);
      };
      reader.readAsDataURL(file);
    }
    setShowImageUpload(false);
  };

  const handleMoneyTransfer = (amount: number, currency: string) => {
    // استخدام onMoneyRequest مع isRequest = false للإرسال
    onMoneyRequest(selectedSender, amount, currency, false);
    setShowMoneyTransfer(false);
  };

  const handleMoneyRequest = (amount: number, currency: string) => {
    // استخدام onMoneyRequest مع isRequest = true للطلب
    onMoneyRequest(selectedSender, amount, currency, true);
    setShowMoneyRequest(false);
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
            onClick={() => setShowImageUpload(!showImageUpload)}
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

        {/* Sender Selection for Money and Images */}
        {(showMoneyTransfer || showMoneyRequest || showImageUpload) && (
          <div className="mt-6 bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 dark:border-gray-600/50">
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200 text-center">
              اختر المرسل
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => setSelectedSender('man')}
                variant={selectedSender === 'man' ? 'default' : 'outline'}
                className={`px-6 py-3 rounded-full transition-all ${
                  selectedSender === 'man' 
                    ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                    : 'hover:bg-blue-100 text-blue-500'
                }`}
              >
                👨 الرجل
              </Button>
              <Button
                onClick={() => setSelectedSender('woman')}
                variant={selectedSender === 'woman' ? 'default' : 'outline'}
                className={`px-6 py-3 rounded-full transition-all ${
                  selectedSender === 'woman' 
                    ? 'bg-pink-500 hover:bg-pink-600 text-white' 
                    : 'hover:bg-pink-100 text-pink-500'
                }`}
              >
                👩 المرأة
              </Button>
            </div>
          </div>
        )}

        {showEmojiPicker && (
          <div className="mt-6">
            <EmojiPicker onEmojiSelect={onEmojiSelect} />
          </div>
        )}

        {showMoneyTransfer && (
          <div className="mt-6">
            <MoneyTransfer
              onTransfer={handleMoneyTransfer}
              title="إرسال مال"
              buttonText="إرسال المال"
              buttonColor="from-green-500 to-emerald-500"
            />
          </div>
        )}

        {showMoneyRequest && (
          <div className="mt-6">
            <MoneyTransfer
              onTransfer={handleMoneyRequest}
              title="طلب مال"
              buttonText="طلب المال"
              buttonColor="from-orange-500 to-red-500"
            />
          </div>
        )}

        {showImageUpload && (
          <div className="mt-6">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-600/50">
              <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200 text-center">
                رفع صورة
              </h3>
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 text-white text-lg py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                <Image className="w-5 h-5 mr-2" />
                اختر صورة
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActionBar;
