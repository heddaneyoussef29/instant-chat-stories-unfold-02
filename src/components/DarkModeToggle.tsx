
import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Moon, Sun } from 'lucide-react';

const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, []);

  const toggleDarkMode = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.classList.toggle('dark', newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  return (
    <div className="flex items-center space-x-2">
      <Sun className={`w-4 h-4 transition-colors ${isDark ? 'text-gray-400' : 'text-yellow-500'}`} />
      <Switch checked={isDark} onCheckedChange={toggleDarkMode} />
      <Moon className={`w-4 h-4 transition-colors ${isDark ? 'text-blue-400' : 'text-gray-400'}`} />
    </div>
  );
};

export default DarkModeToggle;
