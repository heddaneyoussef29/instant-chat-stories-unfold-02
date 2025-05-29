
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Phone, Video, MoreVertical, Smile, Mic, Send, Image, DollarSign } from 'lucide-react';

interface Message {
  id: string;
  sender: 'man' | 'woman';
  content: string;
  timestamp: Date;
  type?: 'text' | 'money' | 'emoji';
  amount?: number;
  currency?: string;
}

interface Participant {
  name: string;
  profilePicture: string;
}

interface ChatData {
  man: Participant;
  woman: Participant;
  messages: Omit<Message, 'timestamp'>[];
}

const ChatPage = () => {
  const navigate = useNavigate();
  const [chatData, setChatData] = useState<ChatData | null>(null);
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [typingSender, setTypingSender] = useState<'man' | 'woman' | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load chat data from localStorage
    const storedData = localStorage.getItem('chatData');
    if (!storedData) {
      navigate('/');
      return;
    }

    try {
      const data: ChatData = JSON.parse(storedData);
      setChatData(data);
    } catch (error) {
      console.error('Error parsing chat data:', error);
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    if (!chatData || currentMessageIndex >= chatData.messages.length) return;

    const timer = setTimeout(() => {
      // Show typing indicator
      setIsTyping(true);
      setTypingSender(chatData.messages[currentMessageIndex].sender);

      // After 2 seconds, add the message and hide typing
      setTimeout(() => {
        const newMessage: Message = {
          ...chatData.messages[currentMessageIndex],
          timestamp: new Date()
        };
        
        setDisplayedMessages(prev => [...prev, newMessage]);
        setCurrentMessageIndex(prev => prev + 1);
        setIsTyping(false);
        setTypingSender(null);
      }, 2000);
    }, currentMessageIndex === 0 ? 1000 : 3000); // First message after 1s, others after 3s

    return () => clearTimeout(timer);
  }, [chatData, currentMessageIndex]);

  useEffect(() => {
    // Auto-scroll to bottom when new message is added
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayedMessages, isTyping]);

  if (!chatData) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const getParticipantInfo = (sender: 'man' | 'woman') => {
    return sender === 'man' ? chatData.man : chatData.woman;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false 
    });
  };

  const renderMoneyMessage = (message: Message) => {
    const participant = getParticipantInfo(message.sender);
    const isFromMan = message.sender === 'man';
    
    return (
      <div className="flex justify-center my-8">
        <div className="relative">
          {/* Money Transfer Card */}
          <div className="bg-gradient-to-br from-green-400 via-emerald-500 to-green-600 rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-300 min-w-[320px] max-w-md mx-4">
            {/* Sparkle Effects */}
            <div className="absolute -top-2 -left-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
            <div className="absolute -top-1 -right-3 w-3 h-3 bg-yellow-300 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute -bottom-2 -left-3 w-3 h-3 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
            <div className="absolute -bottom-1 -right-2 w-4 h-4 bg-yellow-300 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
            
            {/* Money Icon */}
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 rounded-full p-4 backdrop-blur-sm">
                <DollarSign className="w-12 h-12 text-white animate-bounce" />
              </div>
            </div>
            
            {/* Transfer Info */}
            <div className="text-center text-white">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <Avatar className="w-8 h-8 border-2 border-white/50">
                  <AvatarImage src={participant.profilePicture} />
                  <AvatarFallback className="text-green-600 font-bold">{participant.name[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium opacity-90">{participant.name}</span>
              </div>
              
              <div className="space-y-2">
                <div className="text-2xl font-bold tracking-wide">
                  {message.amount} {message.currency}
                </div>
                <div className="text-sm opacity-80 font-medium">
                  {message.content.includes('طلب') ? '💸 طلب تحويل مالي' : '💰 تم إرسال المال بنجاح'}
                </div>
                <div className="text-xs opacity-70">
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
            
            {/* Success Checkmark */}
            {!message.content.includes('طلب') && (
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-white rounded-full p-2 shadow-lg">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Floating Money Emojis */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-4 left-8 text-2xl animate-bounce" style={{ animationDelay: '0.2s' }}>💰</div>
            <div className="absolute top-8 right-6 text-xl animate-bounce" style={{ animationDelay: '0.7s' }}>💸</div>
            <div className="absolute bottom-6 left-4 text-lg animate-bounce" style={{ animationDelay: '1.2s' }}>💵</div>
            <div className="absolute bottom-4 right-8 text-xl animate-bounce" style={{ animationDelay: '1.7s' }}>✨</div>
          </div>
        </div>
      </div>
    );
  };

  const renderRegularMessage = (message: Message) => {
    const participant = getParticipantInfo(message.sender);
    const isFromMan = message.sender === 'man';
    
    return (
      <div className={`flex ${isFromMan ? 'justify-end' : 'justify-start'}`}>
        <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${isFromMan ? 'flex-row-reverse space-x-reverse' : ''}`}>
          <Avatar className="w-8 h-8">
            <AvatarImage src={participant.profilePicture} />
            <AvatarFallback>{participant.name[0]}</AvatarFallback>
          </Avatar>
          
          <div
            className={`px-4 py-2 rounded-lg ${
              isFromMan
                ? 'bg-green-500 text-white rounded-br-none'
                : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
            }`}
          >
            <p className="text-sm">{message.content}</p>
            <p className={`text-xs mt-1 ${isFromMan ? 'text-green-100' : 'text-gray-500'}`}>
              {formatTime(message.timestamp)}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Fixed Header */}
      <div className="bg-green-600 text-white p-4 flex items-center space-x-3 fixed top-0 left-0 right-0 z-50 shadow-lg">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="text-white hover:bg-green-700"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <Avatar className="w-10 h-10">
          <AvatarImage src={chatData.woman.profilePicture} />
          <AvatarFallback>{chatData.woman.name[0]}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <h3 className="font-semibold">{chatData.woman.name}</h3>
          <p className="text-sm text-green-100">
            {isTyping && typingSender ? 'typing...' : 'online'}
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" className="text-white hover:bg-green-700">
            <Video className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-green-700">
            <Phone className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-green-700">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Messages Container with top padding for fixed header */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pt-24 pb-24">
        {displayedMessages.map((message) => (
          <div key={message.id}>
            {message.type === 'money' ? renderMoneyMessage(message) : renderRegularMessage(message)}
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && typingSender && (
          <div className={`flex ${typingSender === 'man' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-end space-x-2 max-w-xs ${typingSender === 'man' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <Avatar className="w-8 h-8">
                <AvatarImage src={getParticipantInfo(typingSender).profilePicture} />
                <AvatarFallback>{getParticipantInfo(typingSender).name[0]}</AvatarFallback>
              </Avatar>
              
              <div className="bg-gray-200 px-4 py-3 rounded-lg rounded-bl-none">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Fixed Input Area */}
      <div className="bg-white border-t p-4 fixed bottom-0 left-0 right-0 z-50 shadow-lg">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" className="text-gray-500">
            <Smile className="w-5 h-5" />
          </Button>
          
          <div className="flex-1 flex items-center space-x-2">
            <Input
              placeholder="Type a message"
              className="flex-1"
              disabled
            />
            <Button variant="ghost" size="sm" className="text-gray-500">
              <Image className="w-5 h-5" />
            </Button>
          </div>
          
          <Button variant="ghost" size="sm" className="text-gray-500">
            <Mic className="w-5 h-5" />
          </Button>
          
          <Button className="bg-green-600 hover:bg-green-700 rounded-full p-2">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
