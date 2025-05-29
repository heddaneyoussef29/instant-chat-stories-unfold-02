
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Phone, Video, MoreVertical, Smile, Mic, Send, Image } from 'lucide-react';

interface Message {
  id: string;
  sender: 'man' | 'woman';
  content: string;
  timestamp: Date;
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

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-green-600 text-white p-4 flex items-center space-x-3">
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

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {displayedMessages.map((message) => {
          const participant = getParticipantInfo(message.sender);
          const isFromMan = message.sender === 'man';
          
          return (
            <div
              key={message.id}
              className={`flex ${isFromMan ? 'justify-end' : 'justify-start'}`}
            >
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
        })}

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

      {/* Input Area */}
      <div className="bg-white border-t p-4">
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
