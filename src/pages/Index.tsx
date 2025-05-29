import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '@/components/AppHeader';
import ParticipantProfile from '@/components/ParticipantProfile';
import MessagesList from '@/components/MessagesList';
import ActionBar from '@/components/ActionBar';
import BackgroundSettings from '@/components/BackgroundSettings';
import { Button } from '@/components/ui/button';
import { Play, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  sender: 'man' | 'woman';
  content: string;
  type?: 'text' | 'money' | 'emoji' | 'image';
  amount?: number;
  currency?: string;
  imageUrl?: string;
}

interface Participant {
  name: string;
  profilePicture: string;
}

const Index = () => {
  const navigate = useNavigate();
  
  const [participants, setParticipants] = useState<{
    man: Participant;
    woman: Participant;
  }>({
    man: {
      name: 'أحمد محمد',
      profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    woman: {
      name: 'فاطمة علي',
      profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=150&h=150&fit=crop&crop=face'
    }
  });

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'man',
      content: 'السلام عليكم ورحمة الله وبركاته',
      type: 'text'
    },
    {
      id: '2',
      sender: 'woman',
      content: 'وعليكم السلام ورحمة الله وبركاته، أهلاً وسهلاً',
      type: 'text'
    }
  ]);

  const [chatBackground, setChatBackground] = useState<string | null>(null);

  const handleAddMessage = () => {
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'man',
      content: 'رسالة جديدة',
      type: 'text'
    };
    setMessages([...messages, newMessage]);
  };

  const handleUpdateMessage = (id: string, field: keyof Message, value: string | number) => {
    setMessages(messages.map(msg => 
      msg.id === id ? { ...msg, [field]: value } : msg
    ));
  };

  const handleRemoveMessage = (id: string) => {
    setMessages(messages.filter(msg => msg.id !== id));
  };

  const handleUpdateProfile = (type: 'man' | 'woman', field: keyof Participant, value: string) => {
    setParticipants(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  };

  const handleAddEmoji = (emoji: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'man',
      content: emoji,
      type: 'emoji'
    };
    setMessages([...messages, newMessage]);
  };

  const handleSendMoney = (amount: number, currency: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'man',
      content: `تم إرسال ${amount} ${currency} بنجاح! 💰`,
      type: 'money',
      amount,
      currency
    };
    setMessages([...messages, newMessage]);
  };

  const handleRequestMoney = (amount: number, currency: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'man',
      content: `طلب تحويل ${amount} ${currency} 💸`,
      type: 'money',
      amount,
      currency
    };
    setMessages([...messages, newMessage]);
  };

  const handleAddImage = (imageUrl: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'man',
      content: 'صورة',
      type: 'image',
      imageUrl
    };
    setMessages([...messages, newMessage]);
  };

  const handleStartChat = () => {
    const chatData = {
      man: participants.man,
      woman: participants.woman,
      messages: messages,
      background: chatBackground
    };
    
    localStorage.setItem('chatData', JSON.stringify(chatData));
    navigate('/chat');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      <AppHeader />
      
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ParticipantProfile
            type="man"
            participant={participants.man}
            onUpdate={handleUpdateProfile}
          />
          <ParticipantProfile
            type="woman"
            participant={participants.woman}
            onUpdate={handleUpdateProfile}
          />
        </div>

        <BackgroundSettings
          onBackgroundChange={setChatBackground}
          currentBackground={chatBackground}
        />

        <ActionBar
          onAddEmoji={handleAddEmoji}
          onSendMoney={handleSendMoney}
          onRequestMoney={handleRequestMoney}
          onAddImage={handleAddImage}
        />

        <MessagesList
          messages={messages}
          onAddMessage={handleAddMessage}
          onUpdateMessage={handleUpdateMessage}
          onRemoveMessage={handleRemoveMessage}
        />

        <div className="flex justify-center pt-8">
          <Button
            onClick={handleStartChat}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-12 py-4 text-lg rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 font-bold"
          >
            <Play className="w-6 h-6 mr-3" />
            بدء المحادثة المباشرة
            <Sparkles className="w-6 h-6 ml-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
