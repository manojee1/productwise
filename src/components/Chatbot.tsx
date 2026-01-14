import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { SuggestedQuestions } from "./SuggestedQuestions";
import { marked } from "marked";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isStreaming?: boolean;
}

export const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedMessage, setSuggestedMessage] = useState<string>("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const addMessage = (text: string, isUser: boolean, isStreaming: boolean = false): string => {
    const id = Date.now().toString();
    setMessages(prev => [...prev, {
      id,
      text,
      isUser,
      timestamp: new Date(),
      isStreaming
    }]);
    return id;
  };

  const markStreamComplete = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isStreaming: false } : msg
    ));
  };

  const callWebhook = async (userMessage: string): Promise<string> => {
    try {
      const encodedMessage = encodeURIComponent(userMessage);
      const response = await fetch(
        `https://jonam.app.n8n.cloud/webhook/0e2a6b11-b82c-4e49-8209-1eb8c6c2d7bc?message=${encodedMessage}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.output || data.response || data.message || JSON.stringify(data);
    } catch (error) {
      console.error("Webhook error:", error);
      return "I'm sorry, there was an error processing your request. Please try again.";
    }
  };

  const formatResponse = (text: string): string => {
    // Configure marked for better formatting
    marked.setOptions({
      breaks: true,
      gfm: true,
    });
    
    // Convert markdown to HTML
    const htmlContent = marked.parse(text);
    return htmlContent as string;
  };

  const handleSendMessage = async (message: string) => {
    // Add user message
    addMessage(message, true);
    setSuggestedMessage("");
    setIsLoading(true);
    setRefreshTrigger(prev => prev + 1);

    try {
      // Call the webhook
      const response = await callWebhook(message);
      
      // Format and add bot response with streaming enabled
      const formattedResponse = formatResponse(response);
      addMessage(formattedResponse, false, true);
    } catch (error) {
      addMessage("I'm sorry, there was an error processing your request. Please try again.", false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionClick = (question: string) => {
    setSuggestedMessage(question);
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-semibold text-foreground">
            ProductWise
          </h1>
          <p className="text-muted-foreground text-sm mt-1">AI-powered Product Management assistant</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4">
          {messages.length === 0 && (
            <div className="py-20 text-center">
              <h2 className="text-xl font-medium text-foreground mb-2">How can I help you today?</h2>
              <p className="text-muted-foreground text-sm">Ask me anything about product management</p>
            </div>
          )}
          {messages.map(message => (
            <ChatMessage 
              key={message.id} 
              message={message.text} 
              isUser={message.isUser} 
              isStreaming={message.isStreaming}
              onStreamComplete={() => markStreamComplete(message.id)}
            />
          ))}
          
          {isLoading && <ChatMessage message="" isUser={false} isLoading={true} />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border bg-background">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <SuggestedQuestions onQuestionClick={handleQuestionClick} refreshTrigger={refreshTrigger} isVisible={!isLoading} />
          <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} suggestedMessage={suggestedMessage} />
          <p className="text-xs text-muted-foreground text-center mt-3">
            Built by{" "}
            <a href="https://www.linkedin.com/in/aggarwalmanoj/" target="_blank" rel="noopener noreferrer" className="text-foreground hover:underline">
              Manoj Aggarwal
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
