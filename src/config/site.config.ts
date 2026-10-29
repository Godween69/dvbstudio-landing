// src/config/site.config.ts
// Централизованная конфигурация сайта

export const siteConfig = {
  // Тема по умолчанию
  defaultTheme: 'dark' as 'light' | 'dark',

  // Основная информация
  site: {
    hello: 'Приветствую!',
    name: 'dvb studio',
    title: 'dvb studio — Full-Stack Developer',
    description: 'Создаю современные веб-приложения с любовью к деталям',
    author: 'Я Дмитрий...',
    email: 'dvbstudio@mail.ru',
  },

  // Цветовая схема (полные Tailwind классы)
  colors: {
    // Градиенты для Hero секции
    hero: {
      light: 'bg-gradient-to-br from-purple-200 via-pink-100 to-blue-200',
      dark: 'dark:bg-gradient-to-br dark:from-purple-900 dark:via-blue-900 dark:to-black',
    },
    
    // Секции
    sections: {
      light: 'bg-paper-200',
      dark: 'dark:bg-gray-900',
      white: 'bg-paper-100 dark:bg-gray-950',
    },
    
    // Кнопки
    primaryButton: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700',
    
    // Фоны
    background: {
      light: 'bg-paper-100',
      dark: 'dark:bg-gray-950',
    },
    
    // Текст
    text: {
      main: 'text-gray-900 dark:text-white',
      muted: 'text-gray-600 dark:text-gray-400',
      light: 'text-gray-300',
      // Акцентный цвет для имени
      accent: 'bg-gradient-to-r from-purple-700 via-pink-600 to-purple-700 dark:from-purple-400 dark:via-pink-400 dark:to-purple-400 bg-clip-text text-transparent',
    },
  },

  // Размеры и отступы
  spacing: {
    section: 'py-32 px-6',
    container: 'max-w-6xl mx-auto',
    containerSmall: 'max-w-2xl mx-auto',
  },

  // Типографика
  typography: {
    hero: {
      hello: 'text-6xl md:text-5xl font-bold',
      title: 'text-6xl md:text-3xl font-bold',
      subtitle: 'text-xl md:text-2xl',
    },
    section: {
      title: 'text-5xl font-bold',
      subtitle: 'text-lg',
    },
  },

  // Анимации (Framer Motion)
  animations: {
    duration: {
      fast: 0.3,
      normal: 0.6,
      slow: 1.0,
    },
    easing: 'easeOut',
    // Анимация для имени
    hero: {
      name: {
        initial: { opacity: 0, filter: 'blur(10px)', y: 20 },
        animate: { opacity: 1, filter: 'blur(0px)', y: 0 },
        transition: { duration: 1.2, delay: 0.4, ease: [0.25, 0.4, 0.25, 1] }
      }
    }
  },

  // Навигация
  navigation: {
    items: [
      { label: 'О себе', href: '#about' },
      { label: 'Стек', href: '#stack' },
      { label: 'Проекты', href: '#projects' },
      { label: 'Контакты', href: '#contact' },
    ],
  },

  // Социальные ссылки
  social: {
    telegram: 'https://t.me/Godween69',
    github: 'https://github.com/Godween69',
    email: 'mailto:dvbstudio@mail.ru',
  },
}

export default siteConfig
