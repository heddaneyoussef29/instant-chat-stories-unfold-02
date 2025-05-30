
import { Button } from '@/components/ui/button';
import { Plus, Sparkles, GripVertical } from 'lucide-react';
import MessageEditor from '@/components/MessageEditor';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface Message {
  id: string;
  sender: 'man' | 'woman';
  content: string;
  type?: 'text' | 'money' | 'emoji' | 'image';
  amount?: number;
  currency?: string;
  imageUrl?: string;
  isRead?: boolean;
}

interface MessagesListProps {
  messages: Message[];
  onAddMessage: () => void;
  onUpdateMessage: (id: string, field: keyof Message, value: string | number) => void;
  onRemoveMessage: (id: string) => void;
  onReorderMessages?: (newMessages: Message[]) => void;
}

const MessagesList = ({ messages, onAddMessage, onUpdateMessage, onRemoveMessage, onReorderMessages }: MessagesListProps) => {
  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination || !onReorderMessages) {
      return;
    }

    const items = Array.from(messages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onReorderMessages(items);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center">
          <Sparkles className="w-6 h-6 mr-3 text-purple-500" />
          رسائل المحادثة
        </h2>
        <Button 
          onClick={onAddMessage} 
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-full px-6 py-2 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
        >
          <Plus className="w-5 h-5 mr-2" />
          إضافة رسالة
        </Button>
      </div>

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="messages">
          {(provided) => (
            <div 
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300 dark:scrollbar-thumb-purple-700"
            >
              {messages.map((message, index) => (
                <Draggable key={message.id} draggableId={message.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`relative ${snapshot.isDragging ? 'z-50' : ''}`}
                      style={{
                        ...provided.draggableProps.style,
                        transform: snapshot.isDragging 
                          ? `${provided.draggableProps.style?.transform} rotate(2deg)` 
                          : provided.draggableProps.style?.transform,
                      }}
                    >
                      <div className="flex items-start space-x-2">
                        <div
                          {...provided.dragHandleProps}
                          className="flex items-center justify-center w-8 h-8 mt-6 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 cursor-grab active:cursor-grabbing transition-colors"
                        >
                          <GripVertical className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <MessageEditor
                            message={message}
                            index={index}
                            onUpdate={onUpdateMessage}
                            onRemove={onRemoveMessage}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default MessagesList;
