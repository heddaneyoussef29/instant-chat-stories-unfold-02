
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
  const [messageCount, setMessageCount] = useState(60);
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
    const messagesPerPerson = Math.floor(messageCount / 2);
    
    switch (type) {
      case 'romantic':
        systemPrompt = `أنشئ محادثة رومانسية طويلة ومفصلة بين رجل وامرأة باللغة العربية. يجب أن تحتوي على ${messageCount} رسالة (${messagesPerPerson} رسالة لكل شخص). المحادثة يجب أن تتضمن مشاعر الحب والغيرة والمشاكل وتنتهي بمفاجأة جميلة. اجعل المحادثة طبيعية ومتدرجة مع تطور العلاقة.`;
        break;
      case 'casual':
        systemPrompt = `أنشئ محادثة عادية ومرحة طويلة بين رجل وامرأة باللغة العربية. يجب أن تحتوي على ${messageCount} رسالة (${messagesPerPerson} رسالة لكل شخص). اجعل المحادثة طبيعية ومتنوعة.`;
        break;
      case 'custom':
        systemPrompt = prompt || `أنشئ محادثة طويلة بين رجل وامرأة باللغة العربية تحتوي على ${messageCount} رسالة.`;
        break;
    }

    const fullPrompt = `${systemPrompt}

تعليمات مهمة جداً:
- يجب أن تحتوي المحادثة على ${messageCount} رسالة بالضبط
- ${messagesPerPerson} رسالة للرجل و ${messagesPerPerson} رسالة للمرأة
- تنويع المرسل بين "man" و "woman" بشكل متتالي أو شبه متتالي
- اجعل الرسائل متنوعة الطول (قصيرة ومتوسطة وطويلة)
- استخدم اللغة العربية الطبيعية والمعاصرة
- المحتوى مناسب ومحترم

أرجع النتيجة بصيغة JSON فقط بدون أي نص إضافي قبل أو بعد JSON:
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
    // ... استمر حتى تصل إلى ${messageCount} رسالة
  ]
}

تأكد من:
- إرجاع ${messageCount} رسالة بالضبط
- تنويع المرسل بين "man" و "woman"
- استخدام اللغة العربية
- المحتوى مناسب ومحترم
- إرجاع JSON فقط بدون أي نص إضافي`;

    console.log('API Key being used:', apiKey.substring(0, 10) + '...');
    console.log('Requested message count:', messageCount);
    console.log('Full prompt:', fullPrompt);

    try {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`;
      console.log('API URL:', apiUrl);

      const requestBody = {
        contents: [{
          parts: [{
            text: fullPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192, // Increased token limit for longer conversations
        }
      };

      console.log('Request body:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      console.log('Generated text:', generatedText);
      
      if (!generatedText) {
        throw new Error('لم يتم استلام رد من الذكاء الاصطناعي');
      }

      // Clean the response and extract JSON
      let cleanedText = generatedText.trim();
      
      // Remove markdown code blocks if present
      cleanedText = cleanedText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      
      // Find the JSON object
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('No JSON found in response:', cleanedText);
        throw new Error('لم يتم العثور على JSON صالح في الرد');
      }

      console.log('Extracted JSON:', jsonMatch[0]);

      const parsedData = JSON.parse(jsonMatch[0]);
      console.log('Parsed data:', parsedData);
      
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

      console.log('Formatted messages count:', formattedMessages.length);
      console.log('Requested count:', messageCount);

      // Check if we got the requested number of messages
      if (formattedMessages.length < messageCount * 0.8) {
        toast.warning(`تم توليد ${formattedMessages.length} رسالة من أصل ${messageCount} مطلوبة. جرب تقليل العدد أو تجربة مرة أخرى.`);
      } else {
        toast.success(`تم توليد ${formattedMessages.length} رسالة بنجاح!`);
      }

      onGenerateMessages(formattedMessages);

    } catch (error) {
      console.error('خطأ في توليد المحادثة:', error);
      toast.error(`فشل في توليد المحادثة: ${error.message}`);
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
          <Label htmlFor="message-count" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            عدد الرسائل المطلوبة
          </Label>
          <Input
            id="message-count"
            type="number"
            value={messageCount}
            onChange={(e) => setMessageCount(Math.max(10, Math.min(100, parseInt(e.target.value) || 60)))}
            placeholder="60"
            className="mt-1"
            min="10"
            max="100"
          />
          <p className="text-xs text-gray-500 mt-1">
            سيتم توزيع الرسائل بالتساوي بين الشخصين ({Math.floor(messageCount / 2)} لكل شخص)
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
            placeholder="مثال: محادثة بين AHMED و SARA تتضمن دردشة غيرة وحب ومشاكل تنتهي بمفاجأة..."
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
            disabled={isGenerating || !apiKey.trim()}
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

        {isGenerating && (
          <div className="text-center text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <p>جاري توليد {messageCount} رسالة... يرجى الانتظار</p>
            <p className="text-xs">قد يستغرق الأمر بضع دقائق للمحادثات الطويلة</p>
          </div>
        )}

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">نصائح للحصول على نتائج أفضل:</h4>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• للمحادثات الطويلة (+50 رسالة)، كن صبوراً - قد يستغرق وقتاً أطول</li>
            <li>• إذا حصلت على رسائل أقل من المطلوب، جرب تقليل العدد إلى 30-40</li>
            <li>• استخدم الطلب المخصص لتحديد موضوع المحادثة بدقة</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AIGenerator;
