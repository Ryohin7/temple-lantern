'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '@/lib/contexts/ThemeContext'
import { Sparkles, Leaf } from 'lucide-react'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 避免 hydration 不匹配
  if (!mounted) {
    return (
      <div className="w-32 h-10 rounded-full border-2 border-gray-200 bg-gray-50 animate-pulse" />
    )
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all duration-300 hover:scale-105"
      style={{
        borderColor: theme === 'zen' ? '#749674' : '#dc2626',
        background: theme === 'zen'
          ? 'linear-gradient(135deg, #f8f6f3 0%, #e8ede8 100%)'
          : 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: theme === 'zen' ? 360 : 0,
        }}
        transition={{ duration: 0.5 }}
      >
        {theme === 'zen' ? (
          <Leaf className="w-5 h-5 text-zen-sage-600" />
        ) : (
          <Sparkles className="w-5 h-5 text-temple-red-600" />
        )}
      </motion.div>

      <span className={`text-sm font-medium ${
        theme === 'zen' ? 'text-zen-sage-700' : 'text-temple-red-700'
      }`}>
        {theme === 'zen' ? '文青佛系' : '傳統廟宇'}
      </span>

      {/* 背景指示器 */}
      <motion.div
        className="absolute inset-0 rounded-full opacity-20"
        style={{
          background: theme === 'zen'
            ? 'radial-gradient(circle, #749674 0%, transparent 70%)'
            : 'radial-gradient(circle, #dc2626 0%, transparent 70%)',
        }}
        initial={false}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.button>
  )
}
