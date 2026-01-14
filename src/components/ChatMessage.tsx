import { cn } from "@/lib/utils";
import { StreamingText } from "./StreamingText";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  isLoading?: boolean;
  isStreaming?: boolean;
  onStreamComplete?: () => void;
}

export const ChatMessage = ({ message, isUser, isLoading, isStreaming, onStreamComplete }: ChatMessageProps) => {
  if (isLoading) {
    return (
      <div className="flex items-start gap-4 py-6 animate-fade-in">
        <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-medium text-background">AI</span>
        </div>
        <div className="flex-1 pt-1">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-pulse [animation-delay:0.2s]" />
            <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-pulse [animation-delay:0.4s]" />
          </div>
        </div>
      </div>
    );
  }

  if (!isUser) {
    return (
      <div className="flex items-start gap-4 py-6 animate-fade-in">
        <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-medium text-background">AI</span>
        </div>
        <div className="flex-1 pt-1">
          {isStreaming ? (
            <StreamingText html={message} speed={3} onComplete={onStreamComplete} />
          ) : (
            <div 
              className="text-[15px] leading-relaxed text-foreground prose prose-sm max-w-none prose-p:mb-4 prose-ul:my-3 prose-ol:my-3 prose-li:my-1 prose-ul:list-disc prose-ol:list-decimal prose-strong:text-foreground prose-strong:font-semibold prose-code:text-foreground prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-normal [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:no-underline [&>h1]:font-semibold [&>h1]:text-foreground [&>h2]:font-semibold [&>h2]:text-foreground [&>h3]:font-semibold [&>h3]:text-foreground"
              dangerouslySetInnerHTML={{ __html: message.replace(/<p>(Sources?)<\/p>/g, '<p><strong>$1</strong></p>').replace(/<p><strong>Sources?<\/strong><\/p>\s*<ul>/g, '<p><strong>Sources</strong></p><ul class="sources-list">') }}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-4 py-6 flex-row-reverse animate-fade-in">
      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
        <span className="text-xs font-medium text-muted-foreground">You</span>
      </div>
      <div className="flex-1 pt-1 text-right">
        <p className="text-[15px] leading-relaxed text-foreground inline-block text-left">{message}</p>
      </div>
    </div>
  );
};
