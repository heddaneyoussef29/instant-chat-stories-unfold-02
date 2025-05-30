
import { Sparkles } from 'lucide-react';
import { useAIGeneration } from '@/hooks/useAIGeneration';
import APIKeySection from './ai-generator/APIKeySection';
import MessageCountSection from './ai-generator/MessageCountSection';
import CustomPromptSection from './ai-generator/CustomPromptSection';
import GenerationButtons from './ai-generator/GenerationButtons';
import ExamplesSection from './ai-generator/ExamplesSection';

interface AIGeneratorProps {
  onGenerateMessages: (messages: any[]) => void;
  onUpdateParticipants?: (manName: string, womanName: string) => void;
}

const AIGenerator = ({ onGenerateMessages, onUpdateParticipants }: AIGeneratorProps) => {
  const {
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
  } = useAIGeneration({ onGenerateMessages, onUpdateParticipants });

  const handleCopyExample = (example: string) => {
    setPrompt(example);
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
        <APIKeySection
          apiKey={apiKey}
          onApiKeyChange={setApiKey}
          onSaveApiKey={saveApiKey}
        />

        <MessageCountSection
          messageCount={messageCount}
          onMessageCountChange={setMessageCount}
        />

        <CustomPromptSection
          prompt={prompt}
          onPromptChange={setPrompt}
          extractedNames={extractedNames}
          onApplyExtractedNames={applyExtractedNames}
          onUpdateParticipants={onUpdateParticipants}
        />

        <GenerationButtons
          isGenerating={isGenerating}
          hasApiKey={!!apiKey.trim()}
          onGenerate={generateMessages}
          messageCount={messageCount}
        />

        <ExamplesSection onCopyExample={handleCopyExample} />
      </div>
    </div>
  );
};

export default AIGenerator;
