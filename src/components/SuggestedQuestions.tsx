import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface SuggestedQuestionsProps {
  onQuestionClick: (question: string) => void;
}

const QUESTIONS = [
  "How does channel strategy impact pricing ?",
  "How to become better at storytelling?",
  "Why do products fail?"
];

export const SuggestedQuestions = ({ onQuestionClick }: SuggestedQuestionsProps) => {
  const [displayQuestions, setDisplayQuestions] = useState<string[]>([]);

  useEffect(() => {
    // Shuffle and select 4 questions (with potential duplicates)
    const shuffled = [...QUESTIONS];
    const selected = [];
    
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * shuffled.length);
      selected.push(shuffled[randomIndex]);
    }
    
    setDisplayQuestions(selected);
  }, []);

  return (
    <div className="mb-4">
      <div className="bg-glass-bg backdrop-blur-glass border border-glass-border rounded-2xl p-4 shadow-glass">
        <p className="text-xs text-glass-text/70 mb-3 text-center">Try asking about these topics:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {displayQuestions.map((question, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => onQuestionClick(question)}
              className="text-xs sm:text-sm h-auto py-2 px-3 bg-transparent border-glass-border text-glass-text hover:bg-glass-bg/50 hover:border-primary/50 transition-all duration-200 rounded-xl whitespace-normal text-left justify-start"
            >
              {question}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};