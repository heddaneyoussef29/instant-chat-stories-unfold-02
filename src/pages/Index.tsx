
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import AnimatedReaction from '@/components/AnimatedReaction';
import AppHeader from '@/components/AppHeader';
import ParticipantProfile from '@/components/ParticipantProfile';
import ActionBar from '@/components/ActionBar';
import MessagesList from '@/components/MessagesList';

interface Message {
  id: string;
  sender: 'man' | 'woman';
  content: string;
  type?: 'text' | 'money' | 'emoji';
  amount?: number;
  currency?: string;
}

interface Participant {
  name: string;
  profilePicture: string;
}

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [man, setMan] = useState<Participant>({ name: '', profilePicture: '' });
  const [woman, setWoman] = useState<Participant>({ name: '', profilePicture: '' });
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'man', content: 'السلام عليكم', type: 'text' },
    { id: '2', sender: 'woman', content: 'وعليكم السلام', type: 'text' },
    { id: '3', sender: 'man', content: 'كيف حالك؟', type: 'text' },
    { id: '4', sender: 'woman', content: 'الحمد لله بخير', type: 'text' }
  ]);
  const [animatedReaction, setAnimatedReaction] = useState<string | null>(null);

  const addMessage = () => {
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'man',
      content: '',
      type: 'text'
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    
    toast({
      title: "رسالة جديدة",
      description: "تم إضافة رسالة جديدة بنجاح",
    });
  };

  const addMoneyMessage = (sender: 'man' | 'woman', amount: number, currency: string, isRequest: boolean = false) => {
    const content = isRequest 
      ? `طلب تحويل مالي: ${amount} ${currency}` 
      : `تحويل مالي: ${amount} ${currency}`;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      sender,
      content,
      type: 'money',
      amount,
      currency
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
    
    toast({
      title: isRequest ? "طلب تحويل مالي" : "تحويل مالي",
      description: `تم إضافة ${isRequest ? 'طلب' : ''} تحويل ${amount} ${currency}`,
    });
  };

  const updateMessage = (id: string, field: keyof Message, value: string | number) => {
    setMessages(prevMessages => prevMessages.map(msg => 
      msg.id === id ? { ...msg, [field]: value } : msg
    ));
  };

  const removeMessage = (id: string) => {
    setMessages(prevMessages => prevMessages.filter(msg => msg.id !== id));
    
    toast({
      title: "حذف الرسالة",
      description: "تم حذف الرسالة بنجاح",
    });
  };

  const handleEmojiSelect = (emoji: string, type: 'emoji' | 'reaction') => {
    if (type === 'reaction') {
      setAnimatedReaction(emoji);
    }
    
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'man',
      content: emoji,
      type: 'emoji'
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);
  };

  const handleMoneyTransfer = (amount: number, currency: string) => {
    addMoneyMessage('man', amount, currency, false);
  };

  const clearLocalStorageIfNeeded = () => {
    try {
      // Clear any existing chat data to free up space
      localStorage.removeItem('chatData');
      
      // Try to clear other potential large items
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key !== 'chatData') {
          try {
            const item = localStorage.getItem(key);
            if (item && item.length > 10000) { // Remove items larger than 10KB
              localStorage.removeItem(key);
            }
          } catch (e) {
            // Ignore errors when checking individual items
          }
        }
      });
    } catch (e) {
      console.error('Error clearing localStorage:', e);
    }
  };

  const startConversation = () => {
    if (!man.name || !woman.name || messages.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const chatData = {
      man,
      woman,
      messages: messages.filter(msg => msg.content.trim() !== '')
    };

    try {
      // Store conversation data in localStorage
      localStorage.setItem('chatData', JSON.stringify(chatData));
      
      // Navigate to chat page
      navigate('/chat');
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        // Try to clear localStorage and retry
        clearLocalStorageIfNeeded();
        
        try {
          localStorage.setItem('chatData', JSON.stringify(chatData));
          navigate('/chat');
        } catch (retryError) {
          console.error('Retry failed:', retryError);
          toast({
            title: "Storage Error",
            description: "Unable to save conversation data. Please try refreshing the page.",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to start conversation. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 p-4 transition-all duration-500">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-20 animate-pulse"></div>
      </div>

      {/* Animated Reaction Overlay */}
      {animatedReaction && (
        <AnimatedReaction
          emoji={animatedReaction}
          onComplete={() => setAnimatedReaction(null)}
        />
      )}

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/20">
          
          <AppHeader />

          {/* Participants Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <ParticipantProfile
              type="man"
              participant={man}
              onUpdate={setMan}
            />
            <ParticipantProfile
              type="woman"
              participant={woman}
              onUpdate={setWoman}
            />
          </div>

          <ActionBar
            onEmojiSelect={handleEmojiSelect}
            onMoneyTransfer={handleMoneyTransfer}
            onMoneyRequest={addMoneyMessage}
          />

          <MessagesList
            messages={messages}
            onAddMessage={addMessage}
            onUpdateMessage={updateMessage}
            onRemoveMessage={removeMessage}
          />

          {/* Start Conversation Button */}
          <div className="mt-8 text-center">
            <Button
              onClick={startConversation}
              className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 hover:from-green-600 hover:via-blue-600 hover:to-purple-600 text-white px-12 py-4 text-xl font-bold rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 animate-pulse"
              size="lg"
            >
              <Sparkles className="w-6 h-6 mr-3" />
              بدء المحادثة الإبداعية
              <Sparkles className="w-6 h-6 ml-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
