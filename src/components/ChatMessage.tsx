import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  isLoading?: boolean;
}

export const ChatMessage = ({ message, isUser, isLoading }: ChatMessageProps) => {
  if (isLoading) {
    return (
      <div className="flex items-start space-x-3 mb-6 animate-fade-in">
        <div className="w-12 h-12 bg-gradient-glass backdrop-blur-glass border border-glass-border rounded-full flex items-center justify-center shadow-glass">
          <span className="text-sm font-bold text-primary">AI</span>
        </div>
        <div className="flex-1">
          <div className="bg-glass-bg backdrop-blur-glass border border-glass-border rounded-2xl p-4 shadow-glass">
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-primary/60 rounded-full animate-pulse" />
              <div className="w-3 h-3 bg-primary/60 rounded-full animate-pulse [animation-delay:0.2s]" />
              <div className="w-3 h-3 bg-primary/60 rounded-full animate-pulse [animation-delay:0.4s]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isUser) {
    return (
      <div className="flex items-start space-x-3 mb-6 animate-fade-in">
        <div className="w-12 h-12 bg-gradient-glass backdrop-blur-glass border border-glass-border rounded-full flex items-center justify-center flex-shrink-0 shadow-glass">
          <span className="text-sm font-bold text-primary">AI</span>
        </div>
        <div className="flex-1">
          <div className="mb-2">
            <span className="text-sm font-semibold text-glass-text">AI Assistant</span>
            <p className="text-xs text-glass-text/70">ProductWise AI</p>
          </div>
          <div className="bg-glass-bg backdrop-blur-glass border border-glass-border rounded-2xl p-4 shadow-glass hover:shadow-glass-hover transition-all duration-300">
            <div 
              className="text-sm text-glass-text prose prose-sm max-w-none prose-headings:text-glass-text prose-p:mb-3 prose-ul:my-2 prose-ol:my-2 prose-li:my-1 prose-strong:text-primary prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1 prose-code:rounded"
              dangerouslySetInnerHTML={{ __html: message }} 
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start space-x-3 mb-6 flex-row-reverse space-x-reverse animate-fade-in">
      <div className="w-12 h-12 bg-primary backdrop-blur-glass border border-primary/30 rounded-full flex items-center justify-center flex-shrink-0 shadow-glass">
        <span className="text-sm font-bold text-primary-foreground">U</span>
      </div>
      <div className="flex-1">
        <div className="bg-primary/20 backdrop-blur-glass border border-primary/30 text-glass-text rounded-2xl p-4 ml-auto max-w-sm shadow-glass hover:shadow-glass-hover transition-all duration-300">
          <p className="text-sm font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
};