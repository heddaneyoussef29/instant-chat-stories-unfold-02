
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { examples } from '@/utils/aiGeneratorHelpers';

interface ExamplesSectionProps {
  onCopyExample: (example: string) => void;
}

const ExamplesSection = ({ onCopyExample }: ExamplesSectionProps) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      toast.success('تم نسخ المثال بنجاح!');
      onCopyExample(text);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      toast.error('فشل في نسخ النص');
    }
  };

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
      <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">نصائح للحصول على نتائج أفضل:</h4>
      <div className="space-y-4">
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>• للمحادثات الطويلة (+50 رسالة)، كن صبوراً - قد يستغرق وقتاً أطول</li>
          <li>• إذا حصلت على رسائل أقل من المطلوب، جرب تقليل العدد إلى 30-40</li>
          <li>• استخدم الطلب المخصص لتحديد موضوع المحادثة بدقة</li>
          <li>• ضع الأسماء بين علامتي تنصيص لاستخراجها تلقائياً</li>
        </ul>
        
        <div className="border-t border-blue-200 dark:border-blue-700 pt-3">
          <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">أمثلة على كتابة الطلب المخصص:</h5>
          
          <div className="space-y-3">
            {examples.map((example, index) => (
              <div key={index} className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">
                      {index === 0 ? 'مثال بالعربية (مع استخراج الأسماء):' : 
                       index === 1 ? 'مثال بالإنجليزية (مع استخراج الأسماء):' : 
                       'مثال محدد أكثر:'}
                    </p>
                    <p className="text-xs text-gray-700 dark:text-gray-300 font-mono bg-gray-50 dark:bg-gray-700 p-2 rounded leading-relaxed">
                      {example}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(example, index)}
                    className="flex-shrink-0 h-8 w-8 p-0"
                    disabled={copiedIndex === index}
                  >
                    {copiedIndex === index ? (
                      <Check className="w-3 h-3 text-green-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamplesSection;
