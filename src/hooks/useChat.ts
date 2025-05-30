
import { useState } from 'react';

interface Message {
  id: string;
  sender: 'man' | 'woman';
  content: string;
  type?: 'text' | 'money' | 'emoji' | 'image';
  amount?: number;
  currency?: string;
  imageUrl?: string;
  isRead?: boolean;
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'man',
      content: 'السلام عليكم ورحمة الله وبركاته',
      type: 'text',
      isRead: false
    },
    {
      id: '2',
      sender: 'woman',
      content: 'وعليكم السلام ورحمة الله وبركاته، أهلاً وسهلاً',
      type: 'text',
      isRead: false
    }
  ]);

  const handleAddMessage = () => {
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'man',
      content: 'رسالة جديدة',
      type: 'text',
      isRead: false
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

  const handleReplaceMessages = (newMessages: Message[]) => {
    setMessages(newMessages);
  };

  const handleEmojiSelect = (emoji: string, type: 'emoji' | 'reaction') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'man',
      content: emoji,
      type: 'emoji',
      isRead: false
    };
    setMessages([...messages, newMessage]);
  };

  const handleMoneyTransfer = (amount: number, currency: string, sender: 'man' | 'woman') => {
    console.log('handleMoneyTransfer called:', { amount, currency, sender });
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: sender,
      content: `تم إرسال ${amount} ${currency} بنجاح! 💰`,
      type: 'money',
      amount,
      currency,
      isRead: false
    };
    console.log('Adding money message:', newMessage);
    setMessages(prev => {
      const updated = [...prev, newMessage];
      console.log('Updated messages:', updated);
      return updated;
    });
  };

  const handleMoneyRequest = (sender: 'man' | 'woman', amount: number, currency: string, isRequest: boolean) => {
    console.log('handleMoneyRequest called:', { sender, amount, currency, isRequest });
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: sender,
      content: isRequest ? `طلب تحويل ${amount} ${currency} 💸` : `تم إرسال ${amount} ${currency} بنجاح! 💰`,
      type: 'money',
      amount,
      currency,
      isRead: false
    };
    console.log('Adding money request/transfer message:', newMessage);
    setMessages(prev => {
      const updated = [...prev, newMessage];
      console.log('Updated messages after money request:', updated);
      return updated;
    });
  };

  const handleAddImage = (imageUrl: string, sender: 'man' | 'woman') => {
    console.log('handleAddImage called:', { imageUrl, sender });
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: sender,
      content: 'صورة',
      type: 'image',
      imageUrl,
      isRead: false
    };
    console.log('Adding image message:', newMessage);
    setMessages(prev => {
      const updated = [...prev, newMessage];
      console.log('Updated messages after adding image:', updated);
      return updated;
    });
  };

  return {
    messages,
    handleAddMessage,
    handleUpdateMessage,
    handleRemoveMessage,
    handleReplaceMessages,
    handleEmojiSelect,
    handleMoneyTransfer,
    handleMoneyRequest,
    handleAddImage
  };
};
