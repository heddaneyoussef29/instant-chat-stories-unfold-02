
export const detectLanguage = (text: string): 'arabic' | 'english' => {
  const arabicPattern = /[\u0600-\u06FF]/;
  const arabicMatches = text.match(/[\u0600-\u06FF]/g) || [];
  const totalChars = text.replace(/\s/g, '').length;
  const arabicRatio = arabicMatches.length / totalChars;
  
  return arabicRatio > 0.3 ? 'arabic' : 'english';
};

export const extractNamesFromText = (text: string) => {
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

export const examples = [
  '"محادثة بين "أحمد" و "سارة" تبدأ بحب وغيرة، ثم مشاكل وسوء فهم، وتنتهي بمفاجأة جميلة مثل خطوبة أو هدية. 30 رسالة لكل شخص"',
  '"Conversation between "HAMZA" and "SAMIRA" starting with love and jealousy, then problems and misunderstanding, ending with a beautiful surprise like engagement or gift. 30 messages each"',
  '"محادثة رومانسية طويلة بين "حمزة" و "ليلى"، تتضمن غيرة بسبب صديقة، مشاكل عائلية، ثم مصالحة وخطوبة مفاجئة في النهاية. اجعل المحادثة واقعية ومؤثرة"'
];
