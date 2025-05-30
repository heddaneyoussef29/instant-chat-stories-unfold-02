import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Loader2, MessageSquare, Users, UserCheck } from 'lucide-react';
import { toast } from 'sonner';

interface AIGeneratorProps {
  onGenerateMessages: (messages: any[]) => void;
  onUpdateParticipants?: (manName: string, womanName: string) => void;
}

const AIGenerator = ({ onGenerateMessages, onUpdateParticipants }: AIGeneratorProps) => {
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('gemini_api_key') || '';
  });
  const [prompt, setPrompt] = useState('');
  const [messageCount, setMessageCount] = useState(60);
  const [isGenerating, setIsGenerating] = useState(false);
  const [extractedNames, setExtractedNames] = useState<{man: string, woman: string} | null>(null);

  const detectLanguage = (text: string): 'arabic' | 'english' => {
    const arabicPattern = /[\u0600-\u06FF]/;
    const arabicMatches = text.match(/[\u0600-\u06FF]/g) || [];
    const totalChars = text.replace(/\s/g, '').length;
    const arabicRatio = arabicMatches.length / totalChars;
    
    return arabicRatio > 0.3 ? 'arabic' : 'english';
  };

  const extractNamesFromText = (text: string) => {
    const arabicPattern = /"([^"]+)"\s*و\s*"([^"]+)"/;
    const englishPattern = /"([^"]+)"\s*and\s*"([^"]+)"/i;
    
    let match = text.match(arabicPattern);
    if (!match) {
      match = text.match(englishPattern);
    }
    
    if (match && match.length >= 3) {
      const name1 = match[1].trim();
      const name2 = match[2].trim();
      
      return { man: name1, woman: name2 };
    }
    
    return null;
  };

  useEffect(() => {
    if (prompt.trim()) {
      const names = extractNamesFromText(prompt);
      setExtractedNames(names);
    } else {
      setExtractedNames(null);
    }
  }, [prompt]);

  const applyExtractedNames = () => {
    if (extractedNames && onUpdateParticipants) {
      onUpdateParticipants(extractedNames.man, extractedNames.woman);
      toast.success(`تم تطبيق الأسماء: ${extractedNames.man} و ${extractedNames.woman}`);
    }
  };

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

    const detectedLanguage = type === 'custom' && prompt.trim() ? detectLanguage(prompt) : 'arabic';
    const isArabic = detectedLanguage === 'arabic';

    let systemPrompt = '';
    const messagesPerPerson = Math.floor(messageCount / 2);
    
    if (isArabic) {
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
    } else {
      switch (type) {
        case 'romantic':
          systemPrompt = `Create a long and detailed romantic conversation between a man and a woman in English. It should contain ${messageCount} messages (${messagesPerPerson} messages per person). The conversation should include feelings of love, jealousy, problems, and end with a beautiful surprise. Make the conversation natural and progressive with relationship development.`;
          break;
        case 'casual':
          systemPrompt = `Create a long and fun casual conversation between a man and a woman in English. It should contain ${messageCount} messages (${messagesPerPerson} messages per person). Make the conversation natural and varied.`;
          break;
        case 'custom':
          systemPrompt = prompt || `Create a long conversation between a man and a woman in English containing ${messageCount} messages.`;
          break;
      }
    }

    const languageInstructions = isArabic 
      ? `- استخدم اللغة العربية الطبيعية والمعاصرة`
      : `- Use natural and contemporary English language`;

    const fullPrompt = `${systemPrompt}

${isArabic ? 'تعليمات مهمة جداً:' : 'Very important instructions:'}
${isArabic ? `- يجب أن تحتوي المحادثة على ${messageCount} رسالة بالضبط` : `- The conversation must contain exactly ${messageCount} messages`}
${isArabic ? `- ${messagesPerPerson} رسالة للرجل و ${messagesPerPerson} رسالة للمرأة` : `- ${messagesPerPerson} messages for the man and ${messagesPerPerson} messages for the woman`}
${isArabic ? '- تنويع المرسل بين "man" و "woman" بشكل متتالي أو شبه متتالي' : '- Alternate the sender between "man" and "woman" consecutively or semi-consecutively'}
${isArabic ? '- اجعل الرسائل متنوعة الطول (قصيرة ومتوسطة وطويلة)' : '- Make messages varied in length (short, medium, and long)'}
${languageInstructions}
${isArabic ? '- المحتوى مناسب ومحترم' : '- Content should be appropriate and respectful'}

${isArabic ? 'أرجع النتيجة بصيغة JSON فقط بدون أي نص إضافي قبل أو بعد JSON:' : 'Return the result in JSON format only without any additional text before or after JSON:'}
{
  "messages": [
    {
      "sender": "man",
      "content": "${isArabic ? 'نص الرسالة هنا' : 'Message text here'}",
      "type": "text"
    },
    {
      "sender": "woman", 
      "content": "${isArabic ? 'نص الرسالة هنا' : 'Message text here'}",
      "type": "text"
    }
  ]
}

${isArabic ? 'تأكد من:' : 'Make sure to:'}
${isArabic ? `- إرجاع ${messageCount} رسالة بالضبط` : `- Return exactly ${messageCount} messages`}
${isArabic ? '- تنويع المرسل بين "man" و "woman"' : '- Alternate sender between "man" and "woman"'}
${languageInstructions}
${isArabic ? '- المحتوى مناسب ومحترم' : '- Content appropriate and respectful'}
${isArabic ? '- إرجاع JSON فقط بدون أي نص إضافي' : '- Return JSON only without any additional text'}`;

    console.log('API Key being used:', apiKey.substring(0, 10) + '...');
    console.log('Detected language:', detectedLanguage);
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
          maxOutputTokens: 8192,
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

      let cleanedText = generatedText.trim();
      cleanedText = cleanedText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      
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

      const formattedMessages = parsedData.messages.map((msg: any, index: number) => ({
        id: `ai_${Date.now()}_${index}`,
        sender: msg.sender,
        content: msg.content,
        type: msg.type || 'text',
        isRead: false
      }));

      console.log('Formatted messages count:', formattedMessages.length);
      console.log('Requested count:', messageCount);

      if (formattedMessages.length < messageCount * 0.8) {
        toast.warning(`تم توليد ${formattedMessages.length} رسالة من أصل ${messageCount} مطلوبة. جرب تقليل العدد أو تجربة مرة أخرى.`);
      } else {
        const successMessage = isArabic 
          ? `تم توليد ${formattedMessages.length} رسالة باللغة العربية بنجاح!`
          : `Successfully generated ${formattedMessages.length} messages in English!`;
        toast.success(successMessage);
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
            placeholder="مثال: محادثة بين &quot;أحمد&quot; و &quot;سارة&quot; تتضمن دردشة غيرة وحب ومشاكل تنتهي بمفاجأة..."
            className="mt-1"
            rows={3}
            dir="rtl"
          />
          
          {prompt.trim() && (
            <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
              {detectLanguage(prompt) === 'arabic' 
                ? '🇸🇦 تم اكتشاف اللغة العربية - ستتم كتابة المحادثة بالعربية'
                : '🇺🇸 English language detected - conversation will be generated in English'
              }
            </div>
          )}
          
          {extractedNames && onUpdateParticipants && (
            <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <UserCheck className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700 dark:text-green-300">
                    تم العثور على الأسماء: <strong>{extractedNames.man}</strong> و <strong>{extractedNames.woman}</strong>
                  </span>
                </div>
                <Button onClick={applyExtractedNames} size="sm" variant="outline" className="text-green-600 border-green-300 hover:bg-green-50">
                  تطبيق الأسماء
                </Button>
              </div>
            </div>
          )}
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
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                  <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">مثال بالعربية (مع استخراج الأسماء):</p>
                  <p className="text-xs text-gray-700 dark:text-gray-300 font-mono bg-gray-50 dark:bg-gray-700 p-2 rounded">
                    &quot;محادثة بين &quot;أحمد&quot; و &quot;سارة&quot; تبدأ بحب وغيرة، ثم مشاكل وسوء فهم، وتنتهي بمفاجأة جميلة مثل خطوبة أو هدية. 30 رسالة لكل شخص&quot;
                  </p>
                </div>
                
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                  <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">مثال بالإنجليزية (مع استخراج الأسماء):</p>
                  <p className="text-xs text-gray-700 dark:text-gray-300 font-mono bg-gray-50 dark:bg-gray-700 p-2 rounded">
                    &quot;Conversation between &quot;HAMZA&quot; and &quot;SAMIRA&quot; starting with love and jealousy, then problems and misunderstanding, ending with a beautiful surprise like engagement or gift. 30 messages each&quot;
                  </p>
                </div>
                
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                  <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">مثال محدد أكثر:</p>
                  <p className="text-xs text-gray-700 dark:text-gray-300 font-mono bg-gray-50 dark:bg-gray-700 p-2 rounded">
                    &quot;محادثة رومانسية طويلة بين &quot;حمزة&quot; و &quot;ليلى&quot;، تتضمن غيرة بسبب صديقة، مشاكل عائلية، ثم مصالحة وخطوبة مفاجئة في النهاية. اجعل المحادثة واقعية ومؤثرة&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIGenerator;
