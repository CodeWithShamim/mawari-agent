'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Zap, Brain, Activity } from 'lucide-react'

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

export const slideInFromLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
}

export const slideInFromRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
}

export const scale = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 }
}

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
}

// Loading animation component
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

// Pulse animation component
export function PulseAnimation({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      animate={{
        scale: [1, 1.05, 1],
        boxShadow: [
          "0 0 20px rgba(251, 115, 234, 0.3)",
          "0 0 40px rgba(251, 115, 234, 0.6)",
          "0 0 20px rgba(251, 115, 234, 0.3)"
        ]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  )
}

// Floating animation component
export function FloatingAnimation({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [-10, 10, -10]
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  )
}

// Typing animation component
export function TypingAnimation({ text, className = '' }: { text: string; className?: string }) {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, 30 + Math.random() * 50)

      return () => clearTimeout(timeout)
    }
  }, [currentIndex, text])

  return (
    <span className={className}>
      {displayedText}
      {currentIndex < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="text-[#fb73ea]"
        >
          |
        </motion.span>
      )}
    </span>
  )
}

// Glitch animation component
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

// Morph animation component
export function MorphAnimation() {
  return (
    <div className="relative w-24 h-24 mx-auto">
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[#fb73ea] to-purple-600 rounded-full"
        animate={{
          borderRadius: ["50%", "20%", "50%", "20%", "50%"],
          rotate: [0, 90, 180, 270, 360],
          scale: [1, 1.1, 1, 1.1, 1]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute inset-2 bg-black rounded-full flex items-center justify-center"
        animate={{
          borderRadius: ["50%", "30%", "50%", "30%", "50%"]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Zap className="w-8 h-8 text-[#fb73ea]" />
      </motion.div>
    </div>
  )
}

// Particle animation component
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

// Animated card component
export function AnimatedCard({ children, className = '', delay = 0 }: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 0 30px rgba(251, 115, 234, 0.3)"
      }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  )
}

// Status indicator animation
export function StatusIndicator({ status, className = '' }: {
  status: 'online' | 'offline' | 'connecting'
  className?: string
}) {
  const statusConfig = {
    online: { color: 'bg-green-500', text: 'Online' },
    offline: { color: 'bg-red-500', text: 'Offline' },
    connecting: { color: 'bg-yellow-500', text: 'Connecting' }
  }

  const config = statusConfig[status]

  return (
    <motion.div
      className={`flex items-center space-x-2 ${className}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className={`w-2 h-2 rounded-full ${config.color}`}
        animate={
          status === 'connecting'
            ? { scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }
            : { scale: [1, 1.2, 1] }
        }
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.span
        className="text-sm text-gray-400"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={
          status === 'connecting'
            ? { duration: 1, repeat: Infinity }
            : { duration: 0 }
        }
      >
        {config.text}
      </motion.span>
    </motion.div>
  )
}

// Data flow animation
export function DataFlowAnimation() {
  return (
    <div className="flex items-center justify-center space-x-4">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="w-3 h-3 bg-[#fb73ea] rounded-full"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}

// Shimmer loading effect
export function ShimmerEffect({ className = '' }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#fb73ea]/20 to-transparent animate-pulse" />
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-[#fb73ea]/30 to-transparent"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
    </div>
  )
}