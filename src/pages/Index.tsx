import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Plus, Trash2, User, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  sender: 'man' | 'woman';
  content: string;
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
    { id: '1', sender: 'man', content: 'Peace be upon you' },
    { id: '2', sender: 'woman', content: 'And upon you peace' },
    { id: '3', sender: 'man', content: 'How are you?' },
    { id: '4', sender: 'woman', content: 'Thank God, I am fine' }
  ]);

  const addMessage = () => {
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'man',
      content: ''
    };
    setMessages([...messages, newMessage]);
  };

  const updateMessage = (id: string, field: keyof Message, value: string) => {
    setMessages(messages.map(msg => 
      msg.id === id ? { ...msg, [field]: value } : msg
    ));
  };

  const removeMessage = (id: string) => {
    setMessages(messages.filter(msg => msg.id !== id));
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-green-600">
            <MessageSquare className="inline-block mr-3" />
            WhatsApp Chat Simulator Setup
          </h1>

          {/* Participants Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Man Configuration */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Man Profile</h2>
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={man.profilePicture} />
                  <AvatarFallback>
                    <User className="w-12 h-12" />
                  </AvatarFallback>
                </Avatar>
                <div className="w-full space-y-2">
                  <Label htmlFor="man-name">Name</Label>
                  <Input
                    id="man-name"
                    value={man.name}
                    onChange={(e) => setMan({ ...man, name: e.target.value })}
                    placeholder="Enter man's name"
                  />
                </div>
                <div className="w-full">
                  <Label htmlFor="man-picture">Profile Picture</Label>
                  <Input
                    id="man-picture"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload('man', e)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Woman Configuration */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Woman Profile</h2>
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={woman.profilePicture} />
                  <AvatarFallback>
                    <User className="w-12 h-12" />
                  </AvatarFallback>
                </Avatar>
                <div className="w-full space-y-2">
                  <Label htmlFor="woman-name">Name</Label>
                  <Input
                    id="woman-name"
                    value={woman.name}
                    onChange={(e) => setWoman({ ...woman, name: e.target.value })}
                    placeholder="Enter woman's name"
                  />
                </div>
                <div className="w-full">
                  <Label htmlFor="woman-picture">Profile Picture</Label>
                  <Input
                    id="woman-picture"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload('woman', e)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Messages Configuration */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Conversation Messages</h2>
              <Button onClick={addMessage} className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Message
              </Button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {messages.map((message, index) => (
                <div key={message.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Label>Message {index + 1}</Label>
                      <select
                        value={message.sender}
                        onChange={(e) => updateMessage(message.id, 'sender', e.target.value)}
                        className="px-2 py-1 border rounded text-sm"
                      >
                        <option value="man">Man</option>
                        <option value="woman">Woman</option>
                      </select>
                    </div>
                    <Textarea
                      value={message.content}
                      onChange={(e) => updateMessage(message.id, 'content', e.target.value)}
                      placeholder="Enter message content"
                      className="min-h-[60px]"
                    />
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeMessage(message.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Start Conversation Button */}
          <div className="mt-8 text-center">
            <Button
              onClick={startConversation}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
              size="lg"
            >
              Start Conversation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
