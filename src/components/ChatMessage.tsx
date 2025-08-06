import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  isLoading?: boolean;
}

export const ChatMessage = ({ message, isUser, isLoading }: ChatMessageProps) => {
  if (isLoading) {
    return (
      <div className="flex items-start space-x-3 mb-4">
        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-gray-600">AI</span>
        </div>
        <div className="flex-1">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.2s]" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.4s]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isUser) {
    return (
      <div className="flex items-start space-x-3 mb-4">
        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-medium text-gray-600">AI</span>
        </div>
        <div className="flex-1">
          <div className="mb-1">
            <span className="text-sm font-medium text-gray-900">AI Assistant</span>
            <p className="text-xs text-gray-500">Ask me anything!</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div 
              className="text-sm text-gray-700 prose prose-sm max-w-none prose-headings:text-gray-800 prose-p:mb-3 prose-ul:my-2 prose-ol:my-2 prose-li:my-1"
              dangerouslySetInnerHTML={{ __html: message }} 
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start space-x-3 mb-4 flex-row-reverse space-x-reverse">
      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-sm font-medium text-white">U</span>
      </div>
      <div className="flex-1">
        <div className="bg-blue-500 text-white rounded-lg p-4 ml-auto max-w-xs">
          <p className="text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
};