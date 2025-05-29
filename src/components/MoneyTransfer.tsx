
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DollarSign, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MoneyTransferProps {
  onTransfer?: (amount: number, currency: string) => void;
  onMoneyTransfer?: (amount: number, currency: string) => void;
  title?: string;
  buttonText?: string;
  buttonColor?: string;
}

const MoneyTransfer = ({ 
  onTransfer, 
  onMoneyTransfer, 
  title = "Send Money",
  buttonText = "Send",
  buttonColor = "from-green-500 to-emerald-500"
}: MoneyTransferProps) => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const { toast } = useToast();

  const handleTransfer = () => {
    const transferAmount = parseFloat(amount);
    if (transferAmount > 0) {
      // Use either prop that's provided
      if (onTransfer) {
        onTransfer(transferAmount, currency);
      } else if (onMoneyTransfer) {
        onMoneyTransfer(transferAmount, currency);
      }
      
      toast({
        title: title,
        description: `${transferAmount} ${currency} transfer request added to conversation`,
      });
      setAmount('');
    }
  };

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-600/50">
      <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200 text-center">
        {title}
      </h3>
      
      <div className="space-y-4">
        <div>
          <Input
            type="number"
            placeholder="المبلغ"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full text-lg"
            dir="rtl"
          />
        </div>
        
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-lg"
        >
          <option value="USD">USD 💵</option>
          <option value="EUR">EUR 💶</option>
          <option value="GBP">GBP 💷</option>
          <option value="SAR">SAR 🇸🇦</option>
        </select>
        
        <Button
          onClick={handleTransfer}
          className={`w-full bg-gradient-to-r ${buttonColor} hover:opacity-90 text-white text-lg py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105`}
        >
          <CreditCard className="w-5 h-5 mr-2" />
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

export default MoneyTransfer;
