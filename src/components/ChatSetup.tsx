
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ParticipantProfile from '@/components/ParticipantProfile';
import MessagesList from '@/components/MessagesList';
import ActionBar from '@/components/ActionBar';
import BackgroundSettings from '@/components/BackgroundSettings';
import AIGenerator from '@/components/AIGenerator';
import { Button } from '@/components/ui/button';
import { Play, Sparkles } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { useParticipants } from '@/hooks/useParticipants';

const ChatSetup = () => {
  const navigate = useNavigate();
  const [chatBackground, setChatBackground] = useState<string | null>(null);
  
  const { participants, handleUpdateProfile } = useParticipants();
  const {
    messages,
    handleAddMessage,
    handleUpdateMessage,
    handleRemoveMessage,
    handleReplaceMessages,
    handleEmojiSelect,
    handleMoneyTransfer,
    handleMoneyRequest,
    handleAddImage
  } = useChat();

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

  const handleUpdateParticipants = (manName: string, womanName: string) => {
    handleUpdateProfile('man', 'name', manName);
    handleUpdateProfile('woman', 'name', womanName);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ParticipantProfile
          type="man"
          participant={participants.man}
          onUpdate={(type, field, value) => handleUpdateProfile(type, field, value)}
        />
        <ParticipantProfile
          type="woman"
          participant={participants.woman}
          onUpdate={(type, field, value) => handleUpdateProfile(type, field, value)}
        />
      </div>

      <BackgroundSettings
        onBackgroundChange={setChatBackground}
        currentBackground={chatBackground}
      />

      <AIGenerator 
        onGenerateMessages={handleReplaceMessages} 
        onUpdateParticipants={handleUpdateParticipants}
      />

      <ActionBar
        onEmojiSelect={handleEmojiSelect}
        onMoneyTransfer={handleMoneyTransfer}
        onMoneyRequest={handleMoneyRequest}
        onImageAdd={handleAddImage}
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
  );
};

export default ChatSetup;
