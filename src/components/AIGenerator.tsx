
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Loader2, MessageSquare, Users } from 'lucide-react';
import { toast } from 'sonner';

interface AIGeneratorProps {
  onGenerateMessages: (messages: any[]) => void;
}

const AIGenerator = ({ onGenerateMessages }: AIGeneratorProps) => {
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('gemini_api_key') || '';
  });
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey.trim());
      toast.success('تم حفظ مفتاح API بنجاح');
    }
  };

  const generateMessages = async (type: 'romantic' | 'casual' | 'custom') => {
    if (!apiKey.trim()) {
      toast.error('يرجى إدخال مفتاح Gemini API أولاً');
      return;
    }

    setIsGenerating(true);

    let systemPrompt = '';
    switch (type) {
      case 'romantic':
        systemPrompt = 'أنشئ محادثة رومانسية بين رجل وامرأة باللغة العربية. يجب أن تحتوي على 8-12 رسالة متنوعة ومناسبة ومحترمة.';
        break;
      case 'casual':
        systemPrompt = 'أنشئ محادثة عادية ومرحة بين رجل وامرأة باللغة العربية. يجب أن تحتوي على 8-12 رسالة متنوعة وطبيعية.';
        break;
      case 'custom':
        systemPrompt = prompt || 'أنشئ محادثة بين رجل وامرأة باللغة العربية.';
        break;
    }

    const fullPrompt = `${systemPrompt}

أرجع النتيجة بصيغة JSON فقط بهذا الشكل:
{
  "messages": [
    {
      "sender": "man",
      "content": "نص الرسالة هنا",
      "type": "text"
    },
    {
      "sender": "woman", 
      "content": "نص الرسالة هنا",
      "type": "text"
    }
  ]
}

تأكد من:
- تنويع المرسل بين "man" و "woman"
- استخدام اللغة العربية
- المحتوى مناسب ومحترم
- عدد الرسائل بين 8-12 رسالة`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: fullPrompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!generatedText) {
        throw new Error('لم يتم استلام رد من الذكاء الاصطناعي');
      }

      // Extract JSON from the response
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('لم يتم العثور على JSON صالح في الرد');
      }

      const parsedData = JSON.parse(jsonMatch[0]);
      
      if (!parsedData.messages || !Array.isArray(parsedData.messages)) {
        throw new Error('تنسيق الرسائل غير صحيح');
      }

      // Convert to the expected format with IDs
      const formattedMessages = parsedData.messages.map((msg: any, index: number) => ({
        id: `ai_${Date.now()}_${index}`,
        sender: msg.sender,
        content: msg.content,
        type: msg.type || 'text',
        isRead: false
      }));

      onGenerateMessages(formattedMessages);
      toast.success(`تم توليد ${formattedMessages.length} رسالة بنجاح!`);

    } catch (error) {
      console.error('خطأ في توليد المحادثة:', error);
      toast.error('فشل في توليد المحادثة. تأكد من صحة مفتاح API.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-600/50">
      <div className="flex items-center space-x-3">
        <Sparkles className="w-6 h-6 text-purple-500" />
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          توليد المحادثات بالذكاء الاصطناعي
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="api-key" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            مفتاح Gemini API
          </Label>
          <div className="flex space-x-2 mt-1">
            <Input
              id="api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="أدخل مفتاح Gemini API الخاص بك"
              className="flex-1"
            />
            <Button onClick={saveApiKey} variant="outline" size="sm">
              حفظ
            </Button>
          </div>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
            تنبيه: سيتم حفظ المفتاح محلياً في متصفحك فقط
          </p>
        </div>

        <div>
          <Label htmlFor="custom-prompt" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            طلب مخصص (اختياري)
          </Label>
          <Textarea
            id="custom-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="اكتب وصفاً للمحادثة التي تريد توليدها..."
            className="mt-1"
            rows={3}
            dir="rtl"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button
            onClick={() => generateMessages('romantic')}
            disabled={isGenerating || !apiKey.trim()}
            className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <MessageSquare className="w-4 h-4 mr-2" />
            )}
            محادثة رومانسية
          </Button>

          <Button
            onClick={() => generateMessages('casual')}
            disabled={isGenerating || !apiKey.trim()}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Users className="w-4 h-4 mr-2" />
            )}
            محادثة عادية
          </Button>

          <Button
            onClick={() => generateMessages('custom')}
            disabled={isGenerating || !apiKey.trim() || !prompt.trim()}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            طلب مخصص
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIGenerator;
