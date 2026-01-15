import { cn } from "@/lib/utils";
import { StreamingText } from "./StreamingText";
import { User, Sparkles } from "lucide-react";

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
      <div className="py-6 animate-fade-in">
        <div className="max-w-3xl mx-auto flex gap-4">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1 pt-1">
            <div className="flex space-x-1.5">
              <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-pulse [animation-delay:0.2s]" />
              <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-pulse [animation-delay:0.4s]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isUser) {
    return (
      <div className="py-6 animate-fade-in">
        <div className="max-w-3xl mx-auto flex gap-4">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1 pt-0.5">
            {isStreaming ? (
              <StreamingText html={message} speed={3} onComplete={onStreamComplete} />
            ) : (
              <div 
                className="text-[15px] leading-relaxed text-foreground prose prose-sm max-w-none prose-p:mb-3 prose-ul:my-2 prose-ol:my-2 prose-li:my-1 prose-ul:list-disc prose-ol:list-decimal prose-strong:text-foreground prose-strong:font-semibold prose-code:text-foreground prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:opacity-70 [&>h1]:font-semibold [&>h1]:text-foreground [&>h2]:font-semibold [&>h2]:text-foreground [&>h3]:font-semibold [&>h3]:text-foreground"
                dangerouslySetInnerHTML={{ __html: message.replace(/<p>(Sources?)<\/p>/g, '<p><strong>$1</strong></p>').replace(/<p><strong>Sources?<\/strong><\/p>\s*<ul>/g, '<p><strong>Sources</strong></p><ul class="sources-list">') }}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 bg-secondary/50 animate-fade-in">
      <div className="max-w-3xl mx-auto flex gap-4">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <User className="h-4 w-4 text-primary-foreground" />
        </div>
        <div className="flex-1 pt-0.5">
          <p className="text-[15px] leading-relaxed text-foreground">{message}</p>
        </div>
      </div>
    </div>
  );
};
