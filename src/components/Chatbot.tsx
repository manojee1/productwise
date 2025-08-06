import { useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { useToast } from "@/hooks/use-toast";
import { marked } from "marked";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const addMessage = (text: string, isUser: boolean) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const callWebhook = async (userMessage: string) => {
    const webhookUrl = `https://jonam.app.n8n.cloud/webhook/0e2a6b11-b82c-4e49-8209-1eb8c6c2d7bc?message=${encodeURIComponent(userMessage)}`;
    
    try {
      const response = await fetch(webhookUrl, {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const responseText = await response.text();
      return responseText;
    } catch (error) {
      console.error('Webhook call failed:', error);
      throw error;
    }
  };

  const handleSendMessage = async (message: string) => {
    // Add user message
    addMessage(message, true);
    setIsLoading(true);

    try {
      // Call webhook
      const response = await callWebhook(message);
      
      // Convert markdown to HTML
      const htmlResponse = await marked(response);
      
      // Add bot response
      addMessage(htmlResponse, false);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to get response from the bot. Please try again.",
        variant: "destructive",
      });
      
      // Add error message
      addMessage("Sorry, I encountered an error. Please try again.", false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-5xl mx-auto bg-gradient-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-20 pointer-events-none" />
      
      {/* Header */}
      <div className="relative z-10 p-8 border-b border-chat-border/50 backdrop-blur-sm">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
            <span className="text-xl font-bold text-primary-foreground">P</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              ProductWise
            </h1>
            <p className="text-muted-foreground font-medium">Your intelligent product assistant</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6 relative z-10">
        {messages.length === 0 && (
          <div className="text-center mt-20 animate-fade-in">
            <div className="w-20 h-20 bg-gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-glow">
              <span className="text-2xl font-bold text-primary-foreground">P</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">Welcome to ProductWise! 👋</h2>
            <p className="text-muted-foreground text-lg mb-6 max-w-md mx-auto">
              I'm here to help you with product insights, analysis, and recommendations. What would you like to know?
            </p>
            <div className="flex flex-wrap gap-3 justify-center max-w-2xl mx-auto">
              {[
                "Analyze market trends",
                "Product recommendations",
                "Feature comparisons",
                "User feedback insights"
              ].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(suggestion)}
                  className="px-4 py-2 bg-chat-bot-message border border-chat-border rounded-xl text-sm text-foreground hover:bg-chat-border transition-colors duration-200"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message.text}
            isUser={message.isUser}
          />
        ))}
        
        {isLoading && (
          <ChatMessage
            message=""
            isUser={false}
            isLoading={true}
          />
        )}
      </div>

      {/* Input */}
      <div className="relative z-10 border-t border-chat-border/50 backdrop-blur-sm">
        <ChatInput 
          onSendMessage={handleSendMessage}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};