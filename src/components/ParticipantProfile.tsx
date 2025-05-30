
import { User, Camera } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Participant {
  name: string;
  profilePicture: string;
}

interface ParticipantProfileProps {
  type: 'man' | 'woman';
  participant: Participant;
  onUpdate: (type: 'man' | 'woman', field: keyof Participant, value: string) => void;
}

const ParticipantProfile = ({ type, participant, onUpdate }: ParticipantProfileProps) => {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        onUpdate(type, 'profilePicture', imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const isMan = type === 'man';
  const colorScheme = isMan ? 'blue' : 'pink';
  const title = isMan ? 'الرجل' : 'المرأة';

  return (
    <div className={`bg-gradient-to-br from-${colorScheme}-500/10 to-${isMan ? 'purple' : 'rose'}-500/10 dark:from-${colorScheme}-500/20 dark:to-${isMan ? 'purple' : 'rose'}-500/20 rounded-2xl p-6 border border-${colorScheme}-200/30 dark:border-${colorScheme}-700/30`}>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
        <User className={`w-6 h-6 mr-3 text-${colorScheme}-500`} />
        {title}
      </h2>
      <div className="flex flex-col items-center space-y-6">
        <div className="relative group">
          <Avatar className="w-32 h-32 border-4 border-gradient-to-r from-blue-400 to-purple-400">
            <AvatarImage src={participant.profilePicture} />
            <AvatarFallback className={`bg-gradient-to-r from-${colorScheme}-400 to-${isMan ? 'purple' : 'rose'}-400 text-white text-2xl`}>
              <User className="w-16 h-16" />
            </AvatarFallback>
          </Avatar>
          <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-${colorScheme}-400 to-${isMan ? 'purple' : 'rose'}-400 opacity-0 group-hover:opacity-20 transition-opacity`}></div>
        </div>
        <div className="w-full space-y-4">
          <div>
            <Label htmlFor={`${type}-name`} className="text-gray-700 dark:text-gray-300 font-semibold">الاسم</Label>
            <Input
              id={`${type}-name`}
              value={participant.name}
              onChange={(e) => onUpdate(type, 'name', e.target.value)}
              placeholder={`أدخل اسم ${title}`}
              className={`mt-2 bg-white/50 dark:bg-gray-700/50 border-2 border-${colorScheme}-200/50 dark:border-${colorScheme}-700/50 focus:border-${colorScheme}-400 transition-all`}
            />
          </div>
          <div>
            <Label htmlFor={`${type}-picture`} className="text-gray-700 dark:text-gray-300 font-semibold">الصورة الشخصية</Label>
            <div className="relative mt-2">
              <Input
                id={`${type}-picture`}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className={`bg-white/50 dark:bg-gray-700/50 border-2 border-${colorScheme}-200/50 dark:border-${colorScheme}-700/50`}
              />
              <Camera className={`absolute right-3 top-3 w-5 h-5 text-${colorScheme}-500 pointer-events-none`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantProfile;
