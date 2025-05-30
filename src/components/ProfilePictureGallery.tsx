
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Camera, Search, Users, User, Baby } from 'lucide-react';
import { toast } from 'sonner';

interface ProfilePictureGalleryProps {
  onSelectImage: (imageUrl: string) => void;
  triggerText?: string;
}

// Collection of high-quality, royalty-free profile pictures from Unsplash
const profilePictures = {
  men: [
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1557862921-37829c790f19?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1542178243-bc20204b769f?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1618641986557-1ecd230959aa?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1628157588553-5eeea00af15c?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1639747280804-dd2d6b3d88ac?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1654110455429-cf322b40a906?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1670272504471-b64dd1a3c6a9?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1578774204375-d024baadc63d?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1583864697784-a0efc8379f70?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1592334873219-42ca023e48ce?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1605993439219-9d09d2020fa5?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1627161683077-e34782c24d81?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1648737967328-690548aec14f?w=150&h=150&fit=crop&crop=face'
  ],
  women: [
    'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1574015974293-817f0ebebb74?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1554384645-13eab165c24b?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1619895862022-09114b41f16f?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1560087637-bf797bc7796a?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1616091216791-4f5b93211b1d?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1588516903720-8ceb67f9ef84?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1595211877493-41a4e5cd4b19?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1610271340738-726e199f0258?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1619734086067-24bf8889ea7d?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1621784563675-ca9cb0511df4?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1629425733761-caae3b5f2e50?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1606814893907-c2e42943c91f?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1611432579402-7037e819e5f9?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1616380043123-e8b79e8b7bb8?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1620880723085-6bd39b0d0f73?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1625019030820-e4ed970a6c95?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1627080392425-e9f05e2f10b5?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1665686306574-1ace09918530?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1669570094762-828f3dfaf675?w=150&h=150&fit=crop&crop=face'
  ],
  children: [
    'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1596814461691-782bc2189669?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1573126617899-41f1dffb196c?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1569913486515-b74bf7751574?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1590698933947-a202b069a861?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1602100027626-c7da6c4a949a?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1514315384763-ba401779410f?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1504197785658-c87a4ac8b6d4?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1490308175176-3a07bd99b3b6?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1526549358669-1f2ec8b78ad6?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1587691592099-24045742c181?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1522557463410-4f861e007c8c?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1551069613-1904dbdcda11?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1630149409938-40d18b78d90b?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1567696911980-2eed69a46042?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1575659743644-33b1c2c6b8a8?w=150&h=150&fit=crop&crop=face'
  ]
};

const ProfilePictureGallery = ({ onSelectImage, triggerText = "اختيار صورة من المعرض" }: ProfilePictureGalleryProps) => {
  const [activeCategory, setActiveCategory] = useState<'men' | 'women' | 'children'>('men');
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);

  const handleImageSelect = (imageUrl: string) => {
    onSelectImage(imageUrl);
    setOpen(false);
    toast.success('تم تطبيق الصورة بنجاح!');
  };

  const totalImages = profilePictures.men.length + profilePictures.women.length + profilePictures.children.length;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full mt-2">
          <Camera className="w-4 h-4 mr-2" />
          {triggerText}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-right">معرض الصور الشخصية</SheetTitle>
          <SheetDescription className="text-right">
            اختر من بين أكثر من {totalImages} صورة شخصية عالية الجودة
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 mt-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="البحث في الصور..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-right"
              dir="rtl"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex space-x-2 rtl:space-x-reverse">
            <Button
              variant={activeCategory === 'men' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory('men')}
              className="flex-1"
            >
              <User className="w-4 h-4 mr-2" />
              رجال ({profilePictures.men.length})
            </Button>
            <Button
              variant={activeCategory === 'women' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory('women')}
              className="flex-1"
            >
              <Users className="w-4 h-4 mr-2" />
              نساء ({profilePictures.women.length})
            </Button>
            <Button
              variant={activeCategory === 'children' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory('children')}
              className="flex-1"
            >
              <Baby className="w-4 h-4 mr-2" />
              أطفال ({profilePictures.children.length})
            </Button>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 max-h-96 overflow-y-auto">
            {profilePictures[activeCategory].map((imageUrl, index) => (
              <div
                key={`${activeCategory}-${index}`}
                className="relative group cursor-pointer"
                onClick={() => handleImageSelect(imageUrl)}
              >
                <Avatar className="w-full h-20 sm:h-24 border-2 border-gray-200 hover:border-blue-400 transition-all group-hover:scale-105">
                  <AvatarImage src={imageUrl} className="object-cover" />
                  <AvatarFallback className="text-xs">
                    {activeCategory === 'men' ? '👨' : activeCategory === 'women' ? '👩' : '👶'}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-full transition-all flex items-center justify-center">
                  <div className="bg-blue-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-3 h-3" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="text-center text-sm text-gray-500 border-t pt-4">
            إجمالي الصور المتاحة: <strong>{totalImages}</strong> صورة
            <br />
            <span className="text-xs">جميع الصور عالية الجودة وخالية من حقوق الطبع والنشر</span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProfilePictureGallery;
