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
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-chat-background">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-foreground">AI Assistant</h1>
        <p className="text-muted-foreground">Ask me anything and I'll help you!</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground mt-20">
            <p className="text-lg mb-2">👋 Hello! I'm your AI assistant.</p>
            <p>Send me a message to get started!</p>
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
      <div className="p-6 border-t border-border">
        <ChatInput 
          onSendMessage={handleSendMessage}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};