
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DollarSign, CreditCard, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MoneyTransferProps {
  onMoneyTransfer: (amount: number, currency: string) => void;
}

const MoneyTransfer = ({ onMoneyTransfer }: MoneyTransferProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const { toast } = useToast();

  const handleTransfer = () => {
    const transferAmount = parseFloat(amount);
    if (transferAmount > 0) {
      onMoneyTransfer(transferAmount, currency);
      toast({
        title: "Money Transfer",
        description: `${transferAmount} ${currency} transfer request added to conversation`,
      });
      setAmount('');
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="text-green-500 hover:text-green-600 dark:text-green-400"
      >
        <DollarSign className="w-5 h-5" />
      </Button>
      
      {isOpen && (
        <div className="absolute bottom-12 left-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-lg z-50 min-w-[250px]">
          <h3 className="text-sm font-semibold mb-3 text-gray-800 dark:text-gray-200">Send Money</h3>
          
          <div className="space-y-3">
            <div>
              <Input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full"
              />
            </div>
            
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            >
              <option value="USD">USD 💵</option>
              <option value="EUR">EUR 💶</option>
              <option value="GBP">GBP 💷</option>
              <option value="SAR">SAR 🇸🇦</option>
            </select>
            
            <div className="flex space-x-2">
              <Button
                onClick={handleTransfer}
                size="sm"
                className="flex-1 bg-green-500 hover:bg-green-600 text-white"
              >
                <CreditCard className="w-4 h-4 mr-1" />
                Send
              </Button>
              <Button
                onClick={() => setIsOpen(false)}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoneyTransfer;
