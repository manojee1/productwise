import { useState, useEffect } from "react";

interface SuggestedQuestionsProps {
  onQuestionClick: (question: string) => void;
  refreshTrigger?: number;
  isVisible?: boolean;
}

const QUESTIONS = ["How does channel strategy impact pricing?", "How to become better at storytelling?", "Why do products fail?"];

export const SuggestedQuestions = ({
  onQuestionClick,
  refreshTrigger,
  isVisible = true
}: SuggestedQuestionsProps) => {
  const [displayQuestions, setDisplayQuestions] = useState<string[]>([]);

  useEffect(() => {
    const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 2);
    setDisplayQuestions(selected);
  }, [refreshTrigger]);

  return (
    <div className={`mb-4 transition-opacity duration-200 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="flex gap-3 justify-center flex-wrap">
        {displayQuestions.map((question, index) => (
          <button 
            key={index} 
            className="bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground hover:bg-secondary transition-colors text-left"
            onClick={() => onQuestionClick(question)}
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
};
