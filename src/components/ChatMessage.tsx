import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  isLoading?: boolean;
}

export const ChatMessage = ({ message, isUser, isLoading }: ChatMessageProps) => {
  if (isLoading) {
    return (
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-primary-foreground">P</span>
        </div>
        <div className="flex-1 bg-muted rounded-lg p-4">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-pulse [animation-delay:0.2s]" />
            <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-pulse [animation-delay:0.4s]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex items-start space-x-3",
      isUser && "flex-row-reverse space-x-reverse"
    )}>
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
        isUser 
          ? "bg-primary text-primary-foreground" 
          : "bg-gradient-to-r from-primary to-secondary text-primary-foreground"
      )}>
        {isUser ? "U" : "P"}
      </div>
      <div className={cn(
        "flex-1 max-w-[80%] rounded-lg p-4",
        isUser 
          ? "bg-primary text-primary-foreground" 
          : "bg-muted text-foreground"
      )}>
        {isUser ? (
          <p className="text-sm">{message}</p>
        ) : (
          <div 
            className="text-sm prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: message }} 
          />
        )}
      </div>
    </div>
  );
};