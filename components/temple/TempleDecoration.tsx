'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function CloudDecoration({ className }: { className?: string }) {
  return (
    <div className={cn('absolute pointer-events-none', className)}>
      <motion.div
        className="text-6xl opacity-20"
        animate={{
          x: [0, 20, 0],
          y: [0, -10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        ☁️
      </motion.div>
    </div>
  )
}

export function DragonDecoration({ className }: { className?: string }) {
  return (
    <div className={cn('absolute pointer-events-none', className)}>
      <motion.div
        className="text-8xl opacity-30"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, 0]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        🐉
      </motion.div>
    </div>
  )
}

export function LotusDecoration({ className }: { className?: string }) {
  return (
    <div className={cn('absolute pointer-events-none', className)}>
      <motion.div
        className="text-5xl opacity-40"
        animate={{
          rotate: [0, 360]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        🪷
      </motion.div>
    </div>
  )
}

export function IncenseSmoke({ className }: { className?: string }) {
  return (
    <div className={cn('absolute bottom-0 left-1/2 -translate-x-1/2', className)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute bottom-0 w-8 h-8 bg-gray-300 rounded-full blur-xl"
          initial={{ opacity: 0.5, scale: 0.5 }}
          animate={{
            y: [-100, -200],
            x: [0, 20, -20, 0],
            opacity: [0.5, 0],
            scale: [0.5, 1.5]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 1.3,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  )
}

export function FireworkEffect({ trigger }: { trigger: boolean }) {
  if (!trigger) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-1/2 left-1/2 w-2 h-2 bg-gradient-to-r from-yellow-400 to-red-600 rounded-full"
          initial={{ 
            opacity: 1, 
            scale: 1,
            x: 0,
            y: 0
          }}
          animate={{
            opacity: [1, 0],
            scale: [1, 0],
            x: Math.cos((i * 360 / 20) * Math.PI / 180) * 300,
            y: Math.sin((i * 360 / 20) * Math.PI / 180) * 300,
          }}
          transition={{
            duration: 1.5,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  )
}







