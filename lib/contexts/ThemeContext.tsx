'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'classic' | 'zen'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('classic')
  const [mounted, setMounted] = useState(false)

  // 初始化主題（從 localStorage 讀取）
  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('temple-theme') as Theme
    if (savedTheme && (savedTheme === 'classic' || savedTheme === 'zen')) {
      setThemeState(savedTheme)
      applyTheme(savedTheme)
    }
  }, [])

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement
    // 移除舊主題類
    root.classList.remove('classic-theme', 'zen-theme')
    // 添加新主題類
    if (newTheme === 'zen') {
      root.classList.add('zen-theme')
    } else {
      root.classList.add('classic-theme')
    }
  }

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    applyTheme(newTheme)
    // 儲存到 localStorage
    localStorage.setItem('temple-theme', newTheme)
  }

  const toggleTheme = () => {
    const newTheme = theme === 'classic' ? 'zen' : 'classic'
    setTheme(newTheme)
  }

  // 避免 hydration 不匹配
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
