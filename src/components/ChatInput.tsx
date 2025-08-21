import { useState, KeyboardEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  suggestedMessage?: string;
}

export const ChatInput = ({ onSendMessage, disabled, suggestedMessage }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  // Update message when suggestedMessage changes
  useEffect(() => {
    if (suggestedMessage) {
      setMessage(suggestedMessage);
    }
  }, [suggestedMessage]);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative group">
      <div className="bg-glass-bg backdrop-blur-glass border border-glass-border rounded-2xl p-1 shadow-glass hover:shadow-glass-hover transition-all duration-300">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="What is cohort analysis?"
          disabled={disabled}
          className="w-full px-4 py-3 pr-12 bg-transparent text-glass-text placeholder:text-glass-text/60 focus:outline-none rounded-xl"
        />
        <Button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-primary hover:bg-primary/90 text-primary-foreground p-2 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};