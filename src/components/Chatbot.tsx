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
}
export const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedMessage, setSuggestedMessage] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const {
    toast
  } = useToast();
  const addMessage = (text: string, isUser: boolean) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
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
    // Clean up the text by removing extra whitespace and formatting
    let formatted = text.replace(/\\n/g, '\n').replace(/\n\s*\n/g, '\n\n').trim();

    // Convert to markdown format for better rendering
    return marked(formatted, {
      breaks: true,
      gfm: true
    });
  };
  const handleQuestionClick = (question: string) => {
    setSuggestedMessage(question);
  };
  const handleSendMessage = async (message: string) => {
    setSuggestedMessage(""); // Clear suggested message after sending
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
      setRefreshTrigger(prev => prev + 1); // Refresh suggested questions
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
  return <div className="flex flex-col min-h-screen w-full bg-gradient-background relative overflow-hidden">
      {/* Glassmorphism background overlay */}
      <div className="absolute inset-0 bg-gradient-background opacity-90"></div>
      
      {/* Header */}
      <div className="relative z-10 text-center py-4 sm:py-8 px-4">
        <div className="bg-glass-bg backdrop-blur-glass border border-glass-border rounded-2xl p-4 sm:p-6 mx-auto max-w-2xl shadow-glass">
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">
            ProductWise
          </h1>
          <p className="text-glass-text/80 text-xs sm:text-sm">An AI powered Product Management chatbot</p>
        </div>
      </div>

      {/* Messages */}
      <div className="relative z-10 flex-1 overflow-y-auto px-2 sm:px-4 pb-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map(message => <ChatMessage key={message.id} message={message.text} isUser={message.isUser} />)}
          
          {isLoading && <ChatMessage message="" isUser={false} isLoading={true} />}
        </div>
      </div>

      {/* Input */}
      <div className="relative z-10 px-2 sm:px-4 pb-4 sm:pb-6">
        <div className="max-w-2xl mx-auto">
          <SuggestedQuestions onQuestionClick={handleQuestionClick} refreshTrigger={refreshTrigger} isVisible={!isLoading} />
          <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} suggestedMessage={suggestedMessage} />
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10">
        <div className="bg-gradient-background py-6 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center">
              <p className="text-xs text-white/90">© 2024 ProductWise - An AI Product Management chatbot</p>
              <p className="text-xs text-white/80">
                Built by{" "}
                <a href="https://www.linkedin.com/in/aggarwalmanoj/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/80 transition-colors underline font-medium">
                  Manoj Aggarwal
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>;
};