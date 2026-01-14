import { useState, KeyboardEvent, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
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
  const recognitionRef = useRef<any>(null);

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

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setIsRecording(false);
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setMessage(transcript);
      setIsRecording(false);
      recognitionRef.current = null;
    };

    recognition.onerror = (event: any) => {
      setIsRecording(false);
      recognitionRef.current = null;
      
      if (event.error !== 'aborted' && event.error !== 'no-speech') {
        toast({
          title: "Error",
          description: "Failed to recognize speech. Please try again.",
          variant: "destructive",
        });
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
      recognitionRef.current = null;
    };

    try {
      recognition.start();
    } catch (error) {
      setIsRecording(false);
      recognitionRef.current = null;
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2 bg-background border border-border rounded-xl p-2 shadow-sm focus-within:ring-1 focus-within:ring-ring focus-within:border-foreground transition-all">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Message ProductWise..."
          disabled={disabled}
          className="flex-1 px-3 py-2 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-[15px]"
        />
        <div className="flex items-center gap-1">
          <Button
            onClick={toggleSpeechRecognition}
            disabled={disabled}
            variant="ghost"
            size="icon"
            className={`h-9 w-9 rounded-lg ${
              isRecording 
                ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Button
            onClick={handleSend}
            disabled={disabled || !message.trim() || message.trim() === defaultText}
            size="icon"
            className="h-9 w-9 rounded-lg bg-foreground text-background hover:bg-foreground/90 disabled:opacity-30"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
