import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
  return <div className={`mb-4 transition-all duration-300 ${isVisible ? 'opacity-100 animate-fade-in' : 'opacity-0 animate-fade-out'}`}>
      <div className="bg-glass-bg backdrop-blur-glass border border-glass-border rounded-2xl p-4 shadow-glass hover:shadow-glass-hover transition-all duration-300">
        <p className="text-xs text-glass-text/70 mb-3 text-left font-semibold">Suggested  Questions:</p>
        <div className="grid grid-cols-1 gap-2">
          {displayQuestions.map((question, index) => <Button key={index} variant="outline" size="sm" onClick={() => onQuestionClick(question)} className="text-xs sm:text-sm h-auto py-2 px-3 bg-transparent border-purple-400 text-glass-text hover:bg-purple-600/20 hover:border-purple-600 transition-all duration-200 rounded-xl whitespace-normal text-left justify-start">
              {question}
            </Button>)}
        </div>
      </div>
    </div>;
};