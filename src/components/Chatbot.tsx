import { useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { SuggestedQuestions } from "./SuggestedQuestions";
import { useToast } from "@/hooks/use-toast";
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
  const [suggestedMessage, setSuggestedMessage] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { toast } = useToast();

  const addMessage = (text: string, isUser: boolean, isStreaming: boolean = false) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date(),
      isStreaming
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage.id;
  };

  const markStreamComplete = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isStreaming: false } : msg
    ));
  };

  const callWebhook = async (userMessage: string) => {
    const webhookUrl = `https://jonam.app.n8n.cloud/webhook/0e2a6b11-b82c-4e49-8209-1eb8c6c2d7bc?message=${encodeURIComponent(userMessage)}`;
    try {
      const response = await fetch(webhookUrl, {
        method: 'GET'
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
    let formatted = text.replace(/\\n/g, '\n').replace(/\n\s*\n/g, '\n\n').trim();
    return marked(formatted, {
      breaks: true,
      gfm: true
    });
  };

  const handleQuestionClick = (question: string) => {
    setSuggestedMessage(question);
  };

  const handleSendMessage = async (message: string) => {
    setSuggestedMessage("");
    addMessage(message, true);
    setIsLoading(true);
    try {
      const response = await callWebhook(message);
      let content;
      try {
        const jsonResponse = JSON.parse(response);
        content = jsonResponse.output || response;
      } catch {
        content = response;
      }
      const formattedResponse = await formatResponse(content);
      addMessage(formattedResponse, false, true);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive"
      });
      addMessage("Sorry, I encountered an error. Please try again.", false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 text-center">
          <h1 className="text-2xl font-semibold text-foreground">ProductWise</h1>
          <p className="text-sm text-muted-foreground">AI-powered Product Management Assistant</p>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="max-w-3xl mx-auto px-4 py-20 text-center">
            <h2 className="text-xl font-semibold text-foreground mb-2">How can I help you today?</h2>
            <p className="text-muted-foreground">Ask me anything about product management</p>
          </div>
        ) : (
          <div>
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
          </div>
        )}
      </main>

      {/* Suggested Questions & Input */}
      <div className="sticky bottom-0">
        <div className="max-w-3xl mx-auto px-4 pb-2">
          <SuggestedQuestions 
            onQuestionClick={handleQuestionClick} 
            refreshTrigger={refreshTrigger} 
            isVisible={!isLoading && messages.length === 0} 
          />
        </div>
        <ChatInput 
          onSendMessage={handleSendMessage} 
          disabled={isLoading} 
          suggestedMessage={suggestedMessage} 
        />
        <div className="bg-background py-3 text-center border-t border-border">
          <p className="text-xs text-muted-foreground">
            Built by{" "}
            <a 
              href="https://www.linkedin.com/in/aggarwalmanoj/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              Manoj Aggarwal
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
