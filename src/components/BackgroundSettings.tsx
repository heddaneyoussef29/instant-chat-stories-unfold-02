
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Image, X, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BackgroundSettingsProps {
  onBackgroundChange: (backgroundUrl: string | null) => void;
  currentBackground: string | null;
}

const BackgroundSettings = ({ onBackgroundChange, currentBackground }: BackgroundSettingsProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const predefinedBackgrounds = [
    {
      id: 'default',
      name: 'الافتراضي',
      url: null
    },
    {
      id: 'starry',
      name: 'ليلة نجوم',
      url: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=800&h=600&fit=crop'
    },
    {
      id: 'forest',
      name: 'غابة مضيئة',
      url: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=800&h=600&fit=crop'
    },
    {
      id: 'water',
      name: 'طبيعة مائية',
      url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=600&fit=crop'
    },
    {
      id: 'mosque',
      name: 'عمارة إسلامية',
      url: 'https://images.unsplash.com/photo-1466442929976-97f336a657be?w=800&h=600&fit=crop'
    }
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        onBackgroundChange(imageUrl);
        setIsUploading(false);
        toast({
          title: "تم رفع الصورة",
          description: "تم تطبيق خلفية الدردشة الجديدة بنجاح",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-600/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center">
          <Image className="w-5 h-5 mr-2 text-purple-500" />
          خلفية الدردشة
        </h3>
        {currentBackground && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBackgroundChange(null)}
            className="text-red-600 hover:text-red-700"
          >
            <X className="w-4 h-4 mr-1" />
            إزالة الخلفية
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
            الخلفيات المتاحة:
          </Label>
          <div className="grid grid-cols-2 gap-3">
            {predefinedBackgrounds.map((bg) => (
              <button
                key={bg.id}
                onClick={() => onBackgroundChange(bg.url)}
                className={`relative w-full h-20 rounded-lg border-2 transition-all overflow-hidden ${
                  currentBackground === bg.url
                    ? 'border-purple-500 ring-2 ring-purple-200'
                    : 'border-gray-200 dark:border-gray-600 hover:border-purple-300'
                }`}
              >
                {bg.url ? (
                  <img
                    src={bg.url}
                    alt={bg.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#efeae2] flex items-center justify-center">
                    <span className="text-xs text-gray-600">افتراضي</span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 px-2">
                  {bg.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="border-t pt-4">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
            أو ارفع صورة مخصصة:
          </Label>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="background-upload"
              disabled={isUploading}
            />
            <Button
              asChild
              variant="outline"
              className="w-full cursor-pointer"
              disabled={isUploading}
            >
              <label htmlFor="background-upload">
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? 'جاري الرفع...' : 'رفع صورة خلفية'}
              </label>
            </Button>
          </div>
        </div>

        {currentBackground && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-sm text-green-700 dark:text-green-300 text-center">
              ✅ تم تطبيق خلفية مخصصة للدردشة
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BackgroundSettings;
