import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  isLoading?: boolean;
}

export const ChatMessage = ({ message, isUser, isLoading }: ChatMessageProps) => {
  return (
    <div className={cn(
      "flex w-full mb-6 animate-fade-in",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[85%] relative",
        isUser ? "order-2" : "order-1"
      )}>
        {/* Avatar */}
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-2",
          isUser 
            ? "bg-gradient-primary text-primary-foreground ml-auto shadow-glow" 
            : "bg-gradient-secondary text-foreground"
        )}>
          {isUser ? "U" : "P"}
        </div>
        
        {/* Message Bubble */}
        <div className={cn(
          "px-6 py-4 rounded-2xl shadow-card backdrop-blur-sm border",
          isUser 
            ? "bg-gradient-primary text-primary-foreground border-chat-border ml-auto rounded-br-md" 
            : "bg-chat-bot-message/80 text-foreground border-chat-border rounded-bl-md"
        )}>
          {isLoading ? (
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              </div>
              <span className="text-muted-foreground font-medium">ProductWise is thinking...</span>
            </div>
          ) : (
            <div 
              className={cn(
                "prose prose-sm max-w-none",
                isUser ? "prose-invert" : "prose-neutral dark:prose-invert"
              )}
              dangerouslySetInnerHTML={{ __html: message }}
            />
          )}
        </div>
      </div>
    </div>
  );
};