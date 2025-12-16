// 主題類型定義
export type Theme = 'temple' | 'zen'

// 主題狀態管理
interface ThemeStore {
  theme: Theme
  setTheme: (theme: Theme) => void
}

// 使用 localStorage 存儲主題偏好
export function getThemeFromStorage(): Theme {
  if (typeof window === 'undefined') return 'temple'
  const stored = localStorage.getItem('temple-theme')
  return (stored === 'zen' ? 'zen' : 'temple') as Theme
}

export function setThemeToStorage(theme: Theme): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('temple-theme', theme)
  // 更新 HTML data-theme 屬性（CSS 選擇器使用這個）
  document.documentElement.setAttribute('data-theme', theme)
}

// 初始化主題
export function initTheme(): void {
  if (typeof window === 'undefined') return
  const theme = getThemeFromStorage()
  setThemeToStorage(theme)
}

