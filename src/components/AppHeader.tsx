
import { MessageSquare } from 'lucide-react';
import DarkModeToggle from '@/components/DarkModeToggle';

const AppHeader = () => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl">
          <MessageSquare className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            WhatsApp Creative
          </h1>
          <p className="text-gray-600 dark:text-gray-300">تصميم إبداعي للمحادثات</p>
        </div>
      </div>
      <DarkModeToggle />
    </div>
  );
};

export default AppHeader;
