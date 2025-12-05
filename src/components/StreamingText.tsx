import { useState, useEffect } from "react";

interface StreamingTextProps {
  html: string;
  speed?: number;
  onComplete?: () => void;
}

export const StreamingText = ({ html, speed = 5, onComplete }: StreamingTextProps) => {
  const [displayedLength, setDisplayedLength] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (displayedLength < html.length) {
      const timer = setTimeout(() => {
        // Skip through HTML tags quickly
        let nextLength = displayedLength + 1;
        if (html[displayedLength] === '<') {
          const closeIndex = html.indexOf('>', displayedLength);
          if (closeIndex !== -1) {
            nextLength = closeIndex + 1;
          }
        }
        setDisplayedLength(nextLength);
      }, speed);
      return () => clearTimeout(timer);
    } else if (!isComplete) {
      setIsComplete(true);
      onComplete?.();
    }
  }, [displayedLength, html, speed, isComplete, onComplete]);

  // Find a safe cut point that doesn't break HTML tags
  const getSafeHtml = (fullHtml: string, length: number) => {
    let safeHtml = fullHtml.substring(0, length);
    
    // If we're in the middle of a tag, extend to close it
    const lastOpenBracket = safeHtml.lastIndexOf('<');
    const lastCloseBracket = safeHtml.lastIndexOf('>');
    
    if (lastOpenBracket > lastCloseBracket) {
      const closeIndex = fullHtml.indexOf('>', lastOpenBracket);
      if (closeIndex !== -1) {
        safeHtml = fullHtml.substring(0, closeIndex + 1);
      }
    }
    
    return safeHtml;
  };

  const safeHtml = getSafeHtml(html, displayedLength);

  return (
    <div 
      className="text-sm text-glass-text prose prose-sm max-w-none prose-p:mb-3 prose-ul:my-2 prose-ol:my-2 prose-li:my-1 prose-ul:list-disc prose-ol:list-decimal prose-strong:text-primary prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1 prose-code:rounded [&_a]:!font-normal [&_a]:!text-primary [&_a]:!no-underline hover:[&_a]:!underline [&_p_strong]:!text-black [&_p_strong]:!font-bold [&_.sources-list_li::marker]:!text-primary [&>h1]:!font-bold [&>h1]:!text-black [&>h2]:!font-bold [&>h2]:!text-black [&>h3]:!font-bold [&>h3]:!text-black [&>h4]:!font-bold [&>h4]:!text-black [&>h5]:!font-bold [&>h5]:!text-black [&>h6]:!font-bold [&>h6]:!text-black [&_ul>li::marker]:!text-black [&_ol>li::marker]:!text-black"
      dangerouslySetInnerHTML={{ __html: safeHtml.replace(/<p>(Sources?)<\/p>/g, '<p><strong>$1</strong></p>').replace(/<p><strong>Sources?<\/strong><\/p>\s*<ul>/g, '<p><strong>Sources</strong></p><ul class="sources-list">') }}
    />
  );
};
