
import { Button } from '@/components/ui/button';
import { Plus, Sparkles } from 'lucide-react';
import MessageEditor from '@/components/MessageEditor';

interface Message {
  id: string;
  sender: 'man' | 'woman';
  content: string;
  type?: 'text' | 'money' | 'emoji';
  amount?: number;
  currency?: string;
}

interface MessagesListProps {
  messages: Message[];
  onAddMessage: () => void;
  onUpdateMessage: (id: string, field: keyof Message, value: string | number) => void;
  onRemoveMessage: (id: string) => void;
}

const MessagesList = ({ messages, onAddMessage, onUpdateMessage, onRemoveMessage }: MessagesListProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center">
          <Sparkles className="w-6 h-6 mr-3 text-purple-500" />
          رسائل المحادثة
        </h2>
        <Button 
          onClick={onAddMessage} 
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-full px-6 py-2 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
        >
          <Plus className="w-5 h-5 mr-2" />
          إضافة رسالة
        </Button>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300 dark:scrollbar-thumb-purple-700">
        {messages.map((message, index) => (
          <MessageEditor
            key={message.id}
            message={message}
            index={index}
            onUpdate={onUpdateMessage}
            onRemove={onRemoveMessage}
          />
        ))}
      </div>
    </div>
  );
};

export default MessagesList;
