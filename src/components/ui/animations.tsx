'use client'

import { motion } from 'framer-motion'
import { Brain } from 'lucide-react'

// Animation variants for common transitions
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
}

export const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

// Loading animation component (used in page.tsx and MawariTweetFeed.tsx)
export function LoadingAnimation({ message = 'Initializing...' }: { message?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="relative"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-16 h-16 mx-auto">
            <Brain className="w-full h-full text-[#fb73ea]" />
          </div>
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-[#fb73ea] opacity-30"
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
        <motion.p
          className="mt-4 text-gray-400"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {message}
        </motion.p>
      </motion.div>
    </div>
  )
}

// ROMA Loading animation component (used in AIChatbox.tsx)
export function ROMALoadingAnimation() {
  return (
    <div className="flex items-center justify-center py-4">
      <motion.div
        className="flex space-x-2"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-[#fb73ea] rounded-full"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>
    </div>
  )
}

// Morph animation component (used in AIChatbox.tsx)
export function MorphAnimation({ size = 'md', color = '#fb73ea' }: {
  size?: 'sm' | 'md';
  color?: string;
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6'
  }

  return (
    <div className={`relative ${sizeClasses[size]}`}>
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: color }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  )
}

// Particle animation component (used in AIChatbox.tsx)
export function ParticleAnimation({ count = 20 }: { count?: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-[#fb73ea] rounded-full"
          initial={{
            x: Math.random() * 100 + '%',
            y: Math.random() * 100 + '%',
            opacity: 0
          }}
          animate={{
            y: ["0%", "100%"],
            x: [
              Math.random() * 100 + '%',
              Math.random() * 100 + '%',
              Math.random() * 100 + '%'
            ],
            opacity: [0, 1, 1, 0]
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear"
          }}
        />
      ))}
    </div>
  )
}

// Data flow animation (used in AIChatbox.tsx)
export function DataFlowAnimation() {
  return (
    <div className="flex items-center justify-center space-x-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-[#fb73ea] rounded-full"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}

// Glitch animation component (used in AIChatbox.tsx)
export function GlitchAnimation({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      animate={{
        textShadow: [
          "2px 2px 0px rgba(251, 115, 234, 0.5)",
          "-2px -2px 0px rgba(0, 255, 255, 0.3)",
          "2px -2px 0px rgba(255, 0, 255, 0.3)",
          "0px 0px 0px transparent"
        ]
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  )
}