import { useState, KeyboardEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mic, MicOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  suggestedMessage?: string;
}

export const ChatInput = ({ onSendMessage, disabled, suggestedMessage }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();

  // Update message when suggestedMessage changes
  useEffect(() => {
    if (suggestedMessage) {
      setMessage(suggestedMessage);
    }
  }, [suggestedMessage]);

  const defaultText = "Hello, I'm your AI assistant, what can I help you with today?";
  
  const handleSend = () => {
    if (message.trim() && !disabled && message.trim() !== defaultText) {
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

  const toggleSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in your browser. Please use Chrome or Edge.",
        variant: "destructive",
      });
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setMessage(transcript);
      setIsRecording(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
      toast({
        title: "Error",
        description: "Failed to recognize speech. Please try again.",
        variant: "destructive",
      });
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  return (
    <div className="relative group">
      <div className="bg-glass-bg backdrop-blur-glass border border-glass-border rounded-2xl p-1 shadow-glass hover:shadow-glass-hover transition-all duration-300">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Hello, I'm your AI assistant, what can I help you with today?"
          disabled={disabled}
          className="w-full px-4 py-3 pr-12 bg-transparent text-glass-text placeholder:text-glass-text/60 focus:outline-none rounded-xl"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-2">
          <Button
            onClick={toggleSpeechRecognition}
            disabled={disabled}
            className={`${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-secondary hover:bg-secondary/90'
            } text-primary-foreground p-2 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50`}
            type="button"
          >
            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Button
            onClick={handleSend}
            disabled={!message.trim() || disabled || message.trim() === defaultText}
            className="bg-primary hover:bg-primary/90 text-primary-foreground p-2 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};