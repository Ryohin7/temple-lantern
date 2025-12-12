'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface LanternProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'red' | 'gold' | 'orange'
  animate?: boolean
  className?: string
}

export function Lantern({ 
  size = 'md', 
  color = 'red', 
  animate = true,
  className 
}: LanternProps) {
  const sizeClasses = {
    sm: 'w-12 h-16',
    md: 'w-16 h-24',
    lg: 'w-24 h-36'
  }

  const colorClasses = {
    red: 'from-temple-red-600 to-temple-red-800',
    gold: 'from-temple-gold-400 to-temple-gold-600',
    orange: 'from-temple-orange-400 to-temple-orange-600'
  }

  return (
    <motion.div
      className={cn('relative', sizeClasses[size], className)}
      animate={animate ? {
        y: [0, -10, 0],
        rotate: [-2, 2, -2]
      } : {}}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {/* 燈籠頂部 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-2 bg-gradient-to-b from-yellow-600 to-yellow-800 rounded-t" />
      
      {/* 燈籠主體 */}
      <div className={cn(
        'absolute top-2 left-0 right-0 bottom-6 rounded-lg bg-gradient-to-b',
        colorClasses[color],
        'border-2 border-yellow-600'
      )}>
        {/* 發光效果 */}
        <div className="absolute inset-0 bg-lantern-glow opacity-60 rounded-lg" />
        
        {/* 燈籠紋路 */}
        <div className="absolute inset-0 flex flex-col justify-around p-1">
          <div className="h-px bg-yellow-600/50" />
          <div className="h-px bg-yellow-600/50" />
          <div className="h-px bg-yellow-600/50" />
        </div>
        
        {/* 中間字 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-yellow-200 font-temple font-bold text-xs">
            福
          </span>
        </div>
      </div>
      
      {/* 燈籠底部流蘇 */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-6 bg-gradient-to-b from-yellow-600 to-yellow-400">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-yellow-400 rounded-full" />
      </div>
      
      {/* 光暈效果 */}
      {animate && (
        <motion.div
          className={cn(
            'absolute inset-0 rounded-lg blur-xl opacity-50',
            colorClasses[color]
          )}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </motion.div>
  )
}





