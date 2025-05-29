
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Smile, Heart, ThumbsUp, Angry, Laugh, Sad } from 'lucide-react';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string, type: 'emoji' | 'reaction') => void;
}

const EmojiPicker = ({ onEmojiSelect }: EmojiPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const emojis = [
    { icon: '😀', name: 'happy', type: 'reaction' as const },
    { icon: '😍', name: 'love', type: 'reaction' as const },
    { icon: '😘', name: 'kiss', type: 'reaction' as const },
    { icon: '😡', name: 'angry', type: 'reaction' as const },
    { icon: '😭', name: 'crying', type: 'reaction' as const },
    { icon: '🌹', name: 'rose', type: 'reaction' as const },
    { icon: '🦁', name: 'lion', type: 'reaction' as const },
    { icon: '🔥', name: 'fire', type: 'reaction' as const },
    { icon: '💎', name: 'diamond', type: 'reaction' as const },
    { icon: '⭐', name: 'star', type: 'reaction' as const },
  ];

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="text-yellow-500 hover:text-yellow-600 dark:text-yellow-400"
      >
        <Smile className="w-5 h-5" />
      </Button>
      
      {isOpen && (
        <div className="absolute bottom-12 left-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg z-50 grid grid-cols-5 gap-2 min-w-[200px]">
          {emojis.map((emoji) => (
            <button
              key={emoji.name}
              onClick={() => {
                onEmojiSelect(emoji.icon, emoji.type);
                setIsOpen(false);
              }}
              className="text-2xl hover:bg-gray-100 dark:hover:bg-gray-700 rounded p-1 transition-colors"
            >
              {emoji.icon}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmojiPicker;
