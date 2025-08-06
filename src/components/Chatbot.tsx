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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your AI assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
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

  const formatResponse = (text: string) => {
    // Clean up the text by removing extra whitespace and formatting
    let formatted = text
      .replace(/\\n/g, '\n')
      .replace(/\n\s*\n/g, '\n\n')
      .trim();
    
    // Convert to markdown format for better rendering
    return marked(formatted, {
      breaks: true,
      gfm: true
    });
  };

  const handleSendMessage = async (message: string) => {
    addMessage(message, true);
    setIsLoading(true);

    try {
      const response = await callWebhook(message);
      
      // Try to parse as JSON first
      let content;
      try {
        const jsonResponse = JSON.parse(response);
        content = jsonResponse.output || response;
      } catch {
        // If not JSON, use the response as is
        content = response;
      }
      
      const formattedResponse = await formatResponse(content);
      addMessage(formattedResponse, false);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
      addMessage("Sorry, I encountered an error. Please try again.", false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="text-center py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">ProductWise</h1>
        <p className="text-gray-600 text-sm">Powered by advanced AI technology</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="max-w-2xl mx-auto space-y-4">
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
      </div>

      {/* Input */}
      <div className="px-4 pb-6">
        <div className="max-w-2xl mx-auto">
          <ChatInput 
            onSendMessage={handleSendMessage}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
};