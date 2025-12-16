'use client'

import { useState, useEffect } from 'react'
import { Palette, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getThemeFromStorage, setThemeToStorage, type Theme } from '@/lib/theme'

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>('temple')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const currentTheme = getThemeFromStorage()
    setTheme(currentTheme)
  }, [])

  const toggleTheme = () => {
    const newTheme: Theme = theme === 'temple' ? 'zen' : 'temple'
    setTheme(newTheme)
    setThemeToStorage(newTheme)
  }

  if (!mounted) {
    return null
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative"
      title={theme === 'temple' ? '切換至文青佛系主題' : '切換至傳統廟宇主題'}
    >
      {theme === 'temple' ? (
        <Sparkles className="w-5 h-5 text-temple-red-600" />
      ) : (
        <Palette className="w-5 h-5 text-sage-600" />
      )}
    </Button>
  )
}

