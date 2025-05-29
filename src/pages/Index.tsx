import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Plus, Trash2, User, MessageSquare, Sparkles, Camera, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import DarkModeToggle from '@/components/DarkModeToggle';
import EmojiPicker from '@/components/EmojiPicker';
import MoneyTransfer from '@/components/MoneyTransfer';
import AnimatedReaction from '@/components/AnimatedReaction';

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

  const handleImageUpload = (type: 'man' | 'woman', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        if (type === 'man') {
          setMan({ ...man, profilePicture: imageUrl });
        } else {
          setWoman({ ...woman, profilePicture: imageUrl });
        }
      };
      reader.readAsDataURL(file);
    }
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
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  WhatsApp Creative
                </h1>
                <p className="text-gray-600 dark:text-gray-300">تصميم إبداعي للمحادثات</p>
              </div>
            </div>
            <DarkModeToggle />
          </div>

          {/* Participants Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Man Profile */}
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 rounded-2xl p-6 border border-blue-200/30 dark:border-blue-700/30">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
                <User className="w-6 h-6 mr-3 text-blue-500" />
                الرجل
              </h2>
              <div className="flex flex-col items-center space-y-6">
                <div className="relative group">
                  <Avatar className="w-32 h-32 border-4 border-gradient-to-r from-blue-400 to-purple-400">
                    <AvatarImage src={man.profilePicture} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-400 to-purple-400 text-white text-2xl">
                      <User className="w-16 h-16" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                </div>
                <div className="w-full space-y-4">
                  <div>
                    <Label htmlFor="man-name" className="text-gray-700 dark:text-gray-300 font-semibold">الاسم</Label>
                    <Input
                      id="man-name"
                      value={man.name}
                      onChange={(e) => setMan({ ...man, name: e.target.value })}
                      placeholder="أدخل اسم الرجل"
                      className="mt-2 bg-white/50 dark:bg-gray-700/50 border-2 border-blue-200/50 dark:border-blue-700/50 focus:border-blue-400 transition-all"
                    />
                  </div>
                  <div>
                    <Label htmlFor="man-picture" className="text-gray-700 dark:text-gray-300 font-semibold">الصورة الشخصية</Label>
                    <div className="relative mt-2">
                      <Input
                        id="man-picture"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload('man', e)}
                        className="bg-white/50 dark:bg-gray-700/50 border-2 border-blue-200/50 dark:border-blue-700/50"
                      />
                      <Camera className="absolute right-3 top-3 w-5 h-5 text-blue-500 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Woman Profile */}
            <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 dark:from-pink-500/20 dark:to-rose-500/20 rounded-2xl p-6 border border-pink-200/30 dark:border-pink-700/30">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
                <User className="w-6 h-6 mr-3 text-pink-500" />
                المرأة
              </h2>
              <div className="flex flex-col items-center space-y-6">
                <div className="relative group">
                  <Avatar className="w-32 h-32 border-4 border-gradient-to-r from-pink-400 to-rose-400">
                    <AvatarImage src={woman.profilePicture} />
                    <AvatarFallback className="bg-gradient-to-r from-pink-400 to-rose-400 text-white text-2xl">
                      <User className="w-16 h-16" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                </div>
                <div className="w-full space-y-4">
                  <div>
                    <Label htmlFor="woman-name" className="text-gray-700 dark:text-gray-300 font-semibold">الاسم</Label>
                    <Input
                      id="woman-name"
                      value={woman.name}
                      onChange={(e) => setWoman({ ...woman, name: e.target.value })}
                      placeholder="أدخل اسم المرأة"
                      className="mt-2 bg-white/50 dark:bg-gray-700/50 border-2 border-pink-200/50 dark:border-pink-700/50 focus:border-pink-400 transition-all"
                    />
                  </div>
                  <div>
                    <Label htmlFor="woman-picture" className="text-gray-700 dark:text-gray-300 font-semibold">الصورة الشخصية</Label>
                    <div className="relative mt-2">
                      <Input
                        id="woman-picture"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload('woman', e)}
                        className="bg-white/50 dark:bg-gray-700/50 border-2 border-pink-200/50 dark:border-pink-700/50"
                      />
                      <Camera className="absolute right-3 top-3 w-5 h-5 text-pink-500 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Action Bar */}
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 rounded-2xl p-4 mb-8 border border-purple-200/30 dark:border-purple-700/30">
            <div className="flex justify-center items-center space-x-4">
              <EmojiPicker onEmojiSelect={handleEmojiSelect} />
              <MoneyTransfer onMoneyTransfer={handleMoneyTransfer} />
              
              {/* New Money Request Buttons */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addMoneyMessage('woman', 100, 'USD', true)}
                  className="text-orange-500 hover:text-orange-600 dark:text-orange-400"
                  title="طلب مال من المرأة"
                >
                  <DollarSign className="w-5 h-5" />
                  <span className="text-xs ml-1">طلب</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addMoneyMessage('man', 100, 'USD', false)}
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

          {/* Messages Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center">
                <Sparkles className="w-6 h-6 mr-3 text-purple-500" />
                رسائل المحادثة
              </h2>
              <Button 
                onClick={addMessage} 
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-full px-6 py-2 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                <Plus className="w-5 h-5 mr-2" />
                إضافة رسالة
              </Button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300 dark:scrollbar-thumb-purple-700">
              {messages.map((message, index) => (
                <div key={message.id} className="bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-600/50 hover:shadow-lg transition-all transform hover:scale-[1.02]">
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
                            onChange={(e) => updateMessage(message.id, 'sender', e.target.value)}
                            className="px-3 py-1 bg-white/80 dark:bg-gray-600/80 border border-gray-300 dark:border-gray-500 rounded-lg text-sm font-medium"
                          >
                            <option value="man">الرجل</option>
                            <option value="woman">المرأة</option>
                          </select>
                        </div>
                      </div>
                      <Textarea
                        value={message.content}
                        onChange={(e) => updateMessage(message.id, 'content', e.target.value)}
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
                              onChange={(e) => updateMessage(message.id, 'amount', parseFloat(e.target.value) || 0)}
                              className="w-20 text-sm"
                              placeholder="المبلغ"
                            />
                            <select
                              value={message.currency || 'USD'}
                              onChange={(e) => updateMessage(message.id, 'currency', e.target.value)}
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
                      onClick={() => removeMessage(message.id)}
                      className="rounded-full bg-red-500/20 hover:bg-red-500 text-red-600 hover:text-white border-2 border-red-200 hover:border-red-500 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

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
