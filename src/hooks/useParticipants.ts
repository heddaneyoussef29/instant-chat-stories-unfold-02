
import { useState } from 'react';

interface Participant {
  name: string;
  profilePicture: string;
}

export const useParticipants = () => {
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

  const handleUpdateProfile = (type: 'man' | 'woman', field: keyof Participant, value: string) => {
    setParticipants(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  };

  return {
    participants,
    handleUpdateProfile
  };
};
