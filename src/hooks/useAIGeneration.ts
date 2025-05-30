
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { detectLanguage, extractNamesFromText } from '@/utils/aiGeneratorHelpers';

interface UseAIGenerationProps {
  onGenerateMessages: (messages: any[]) => void;
  onUpdateParticipants?: (manName: string, womanName: string) => void;
}

export const useAIGeneration = ({ onGenerateMessages, onUpdateParticipants }: UseAIGenerationProps) => {
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('gemini_api_key') || '';
  });
  const [prompt, setPrompt] = useState('');
  const [messageCount, setMessageCount] = useState(60);
  const [isGenerating, setIsGenerating] = useState(false);
  const [extractedNames, setExtractedNames] = useState<{man: string, woman: string} | null>(null);

  useEffect(() => {
    if (prompt.trim()) {
      const names = extractNamesFromText(prompt);
      setExtractedNames(names);
    } else {
      setExtractedNames(null);
    }
  }, [prompt]);

  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey.trim());
      toast.success('تم حفظ مفتاح API بنجاح');
    }
  };

  const applyExtractedNames = () => {
    if (extractedNames && onUpdateParticipants) {
      onUpdateParticipants(extractedNames.man, extractedNames.woman);
      toast.success(`تم تطبيق الأسماء: ${extractedNames.man} و ${extractedNames.woman}`);
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

  return {
    apiKey,
    setApiKey,
    prompt,
    setPrompt,
    messageCount,
    setMessageCount,
    isGenerating,
    extractedNames,
    saveApiKey,
    applyExtractedNames,
    generateMessages
  };
};
