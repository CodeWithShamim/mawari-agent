'use client';

import { useState, useEffect, useRef } from 'react';
import { Bot } from 'lucide-react';

interface TypingAnimationProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
}

export default function TypingAnimation({
  text,
  speed = 30,
  onComplete,
  className = '',
}: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);

    let currentIndex = 0;
    const textArray = (text || '').split('');

    const typingInterval = setInterval(() => {
      if (currentIndex < textArray.length) {
        setDisplayedText((prev) => prev + textArray[currentIndex]);
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(typingInterval);
  }, [text, speed, onComplete]);

  return (
    <div className={`font-mono ${className}`}>
      <span>{displayedText}</span>
      {isTyping && (
        <span
          className="inline-block w-0.5 h-4 bg-[#fb73ea] ml-0.5 animate-pulse"
          style={{
            animation: 'blink 1s infinite',
          }}
        />
      )}
    </div>
  );
}

// Enhanced typing component with word-by-word animation
export function StreamingTypingAnimation({
  text,
  speed = 50,
  onComplete,
  className = '',
}: TypingAnimationProps) {
  const [displayedWords, setDisplayedWords] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const words = (text || '').split(' ');
    setDisplayedWords([]);
    setIsTyping(true);
    setCurrentWordIndex(0);

    const typingInterval = setInterval(() => {
      if (currentWordIndex < words.length) {
        setDisplayedWords((prev) => [...prev, words[currentWordIndex]]);
        setCurrentWordIndex((prev) => prev + 1);
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(typingInterval);
  }, [text, speed, currentWordIndex, onComplete]);

  return (
    <div className={`${className}`}>
      {displayedWords.map((word, index) => (
        <span
          key={index}
          className="inline-block animate-fade-in"
          style={{
            animation: 'fadeInUp 0.3s ease-out',
            animationDelay: `${index * 0.05}s`,
            animationFillMode: 'both',
          }}
        >
          {word}
          {index < displayedWords.length - 1 ? ' ' : ''}
        </span>
      ))}
      {isTyping && (
        <span
          className="inline-block w-0.5 h-4 bg-[#fb73ea] ml-0.5"
          style={{
            animation: 'blink 1s infinite',
          }}
        />
      )}
    </div>
  );
}

// ChatGPT-style message typing component
interface ChatGPTTypingProps {
  message: string;
  isComplete?: boolean;
  onComplete?: () => void;
  onAutoScroll?: () => void;
}

export function ChatGPTTyping({ message, isComplete = false, onComplete, onAutoScroll }: ChatGPTTypingProps) {
  const [displayedMessage, setDisplayedMessage] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);
  const [typingBurst, setTypingBurst] = useState(false);
  const charIndexRef = useRef(0);
  const burstCountRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (isComplete) {
      setDisplayedMessage(message || '');
      setIsTyping(false);
      setShowCursor(false);
      setTypingBurst(false);
      return;
    }

    // Reset state for new message
    setDisplayedMessage('');
    setIsTyping(true);
    setShowCursor(true);
    setTypingBurst(false);
    charIndexRef.current = 0;
    burstCountRef.current = 0;

    const chars = (message || '').split('');

    // Varying typing speed for realism
    const getTypeSpeed = () => {
      const random = Math.random();
      const charIndex = charIndexRef.current;

      // Simulate natural typing patterns
      if (charIndex === 0) return 30; // Start delay
      if (random < 0.05) return 20; // Occasional longer pause
      if (random < 0.15) return 8; // Short pause
      if (random < 0.3) return 4; // Slightly slower
      if (chars[charIndex] === ' ' || chars[charIndex] === '\n') return 6; // Pause for spaces/newlines

      // Typing burst effect
      if (burstCountRef.current < 3 && random < 0.7) {
        burstCountRef.current++;
        setTypingBurst(true);
        setTimeout(() => setTypingBurst(false), 10);
        return 15; // Fast typing during burst
      } else {
        burstCountRef.current = 0;
      }

      return 25; // Normal speed
    };

    const typeNextChar = () => {
      const charIndex = charIndexRef.current;

      if (charIndex < chars.length) {
        // Add next character
        const nextChar = chars[charIndex];
        setDisplayedMessage((prev) => prev + nextChar);
        charIndexRef.current++;

        // Auto-scroll after adding character
        if (charIndex % 20 === 0) { // Scroll every 20 characters
          setTimeout(() => onAutoScroll?.(), 10);
        }

        // Schedule next character
        const nextDelay = getTypeSpeed();
        setTimeout(typeNextChar, nextDelay);
      } else {
        // Typing complete
        setIsTyping(false);

        // Final scroll to bottom
        setTimeout(() => onAutoScroll?.(), 10);

        // Show cursor for a moment, then hide it
        setTimeout(() => {
          setShowCursor(false);
          onComplete?.();
        }, 500);
      }
    };

    // Start typing after initial delay
    const startDelay = 300;
    timeoutRef.current = setTimeout(typeNextChar, startDelay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [message, isComplete, onComplete, onAutoScroll]);

  return (
    <div className="relative">
      <div className="text-sm leading-relaxed whitespace-pre-wrap">
        {displayedMessage}
        {showCursor && (
          <span
            className={`inline-block w-0.5 h-4 ml-0.5 align-middle ${
              typingBurst ? 'bg-green-400' : 'bg-[#fb73ea]'
            }`}
            style={{
              animation: 'blink 1s infinite',
              transition: 'background-color 0.1s ease',
            }}
          />
        )}
      </div>

      {/* Enhanced typing indicator */}
      {isTyping && (
        <div className="flex items-center mt-2 text-xs text-gray-500 animate-fade-in">
          <div className="relative">
            <Bot className="w-3 h-3 mr-1 text-[#fb73ea] animate-pulse" />
            {typingBurst && (
              <div className="absolute inset-0 bg-green-400/30 rounded-full blur-sm animate-ping" />
            )}
          </div>
          <span className="animate-pulse">
            Sentient dobby model is processing
            <span className="inline-block animate-pulse">
              {Array.from({ length: 3 }, (_, i) => (
                <span key={i} style={{ animationDelay: `${i * 0.2}s` }}>
                  .
                </span>
              ))}
            </span>
          </span>
        </div>
      )}
    </div>
  );
}

// CSS for blinking cursor animation
const cursorStyles = `
  @keyframes blink {
    0%, 49% { opacity: 1; }
    50%, 100% { opacity: 0; }
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = cursorStyles;
  document.head.appendChild(styleSheet);
}
