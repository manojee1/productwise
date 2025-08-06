import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSendMessage, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 p-6">
      <div className="flex-1 relative">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask ProductWise anything..."
          disabled={disabled}
          className="w-full bg-chat-input/50 border-chat-border rounded-2xl px-6 py-4 pr-14 text-foreground placeholder:text-muted-foreground backdrop-blur-sm shadow-card focus:shadow-glow transition-all duration-300"
        />
        <Button 
          type="submit" 
          disabled={!message.trim() || disabled}
          size="icon"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-primary hover:shadow-glow transition-all duration-300 rounded-xl"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};