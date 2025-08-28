import { useState, useEffect } from "react";

interface SuggestedQuestionsProps {
  onQuestionClick: (question: string) => void;
  refreshTrigger?: number;
  isVisible?: boolean;
}

const QUESTIONS = ["How does channel strategy impact pricing ?", "How to become better at storytelling?", "Why do products fail?"];

export const SuggestedQuestions = ({
  onQuestionClick,
  refreshTrigger,
  isVisible = true
}: SuggestedQuestionsProps) => {
  const [displayQuestions, setDisplayQuestions] = useState<string[]>([]);

  useEffect(() => {
    // Shuffle questions and select 2 unique ones
    const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 2);
    setDisplayQuestions(selected);
  }, [refreshTrigger]);

  return (
    <div className={`mb-4 transition-all duration-300 ${isVisible ? 'opacity-100 animate-fade-in' : 'opacity-0 animate-fade-out'}`}>
      <div className="flex gap-2 justify-center">
        {displayQuestions.map((question, index) => (
          <div 
            key={index} 
            className="bg-glass-bg backdrop-blur-glass border border-glass-border rounded-2xl p-4 shadow-glass hover:shadow-glass-hover transition-all duration-300 cursor-pointer flex-1 max-w-sm"
            onClick={() => onQuestionClick(question)}
          >
            <p className="text-sm text-glass-text">{question}</p>
          </div>
        ))}
      </div>
    </div>
  );
};