
import { useEffect, useState } from 'react';

interface AnimatedReactionProps {
  emoji: string;
  onComplete: () => void;
}

const AnimatedReaction = ({ emoji, onComplete }: AnimatedReactionProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 300);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const getAnimationClass = () => {
    switch (emoji) {
      case '😘': return 'animate-bounce';
      case '🌹': return 'animate-pulse';
      case '🦁': return 'animate-bounce';
      case '🔥': return 'animate-pulse';
      case '💎': return 'animate-bounce';
      default: return 'animate-pulse';
    }
  };

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-50 flex items-center justify-center transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className={`text-8xl ${getAnimationClass()}`}>
        {emoji}
      </div>
      
      {/* Particle effects for special emojis */}
      {(emoji === '🌹' || emoji === '💎') && (
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 bg-gradient-to-r ${
                emoji === '🌹' 
                  ? 'from-red-400 to-pink-400' 
                  : 'from-blue-400 to-purple-400'
              } rounded-full animate-ping`}
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 20}%`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AnimatedReaction;
