
import AppHeader from '@/components/AppHeader';
import ChatSetup from '@/components/ChatSetup';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      <AppHeader />
      <ChatSetup />
    </div>
  );
};

export default Index;
