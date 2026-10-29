// context/ThemeContext.tsx
// Контекст темы с темной темой по умолчанию

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Стартовая тема: её уже выставил скрипт в index.html (класс на <html>) по сохранённому выбору.
// На сервере (prerender) документа нет, там всегда тёмная тема по умолчанию.
function readInitialTheme(): Theme {
  if (typeof document === 'undefined') return 'dark'
  return document.documentElement.classList.contains('light') ? 'light' : 'dark'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readInitialTheme)

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    try {
      localStorage.setItem('theme', theme)
    } catch {
      // Не удалось сохранить тему (приватный режим) — не страшно
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
  }

  // Значение меняется только при смене темы: иначе React при подхвате готовой разметки
  // заново рисует ленивые секции на клиенте
  const value = useMemo(() => ({ theme, toggleTheme }), [theme])

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
