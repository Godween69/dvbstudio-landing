// components/Sidebar/Sidebar.tsx
// Боковая панель с навигацией

import { useEffect, useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { useConfig } from '../../config/useConfig'

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme: currentTheme, toggleTheme } = useTheme()
  // До монтирования показываем тему по умолчанию: так разметка совпадает с заранее собранной (prerender)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const theme = mounted ? currentTheme : 'dark'
  const config = useConfig()

  // Пока меню открыто: Escape закрывает его, прокрутка страницы заблокирована
  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      {/* Кнопка-бургер */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 left-6 z-[60] p-3 rounded-full bg-paper-50 dark:bg-gray-900/80 shadow-lg border border-black/10 dark:border-white/20 hover:bg-paper-50 dark:hover:bg-gray-800 transition-colors duration-300"
        aria-label={isOpen ? 'Закрыть меню' : 'Открыть меню'}
        aria-expanded={isOpen}
      >
        <div className="w-6 h-5 relative flex flex-col justify-between">
          <span className={`w-full h-0.5 bg-gray-900 dark:bg-white rounded transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`w-full h-0.5 bg-gray-900 dark:bg-white rounded transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
          <span className={`w-full h-0.5 bg-gray-900 dark:bg-white rounded transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </div>
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-[85vw] max-w-80 bg-paper-50 dark:bg-gray-900 border-r border-black/10 dark:border-white/10 z-50 will-change-transform transition-[transform,visibility] duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'invisible -translate-x-full'
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex flex-col h-full p-8 pt-24">
          {/* Логотип */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              {config.site.name.toLowerCase().replace(' ', '-')}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm transition-colors">
              Full-Stack Developer
            </p>
          </div>

          {/* Меню */}
          <nav className="flex-1">
            <ul className="space-y-2">
              {config.navigation.items.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-200"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Переключатель темы */}
          <button
            onClick={toggleTheme}
            className="mt-auto px-4 py-3 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-300 flex items-center gap-3"
          >
            <span className="text-2xl">{theme === 'dark' ? '☀️' : '🌙'}</span>
            <span className="text-gray-700 dark:text-gray-300 transition-colors">
              {theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
            </span>
          </button>
        </div>
      </aside>
    </>
  )
}
