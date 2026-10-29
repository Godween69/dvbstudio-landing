// data/projects.ts
// Данные проектов для секции "Проекты".
// Здесь только то, что уже сделано или явно помечено как "в работе".

export type ProjectStatus = 'live' | 'in-progress'

export interface ProjectLink {
  label: string
  href: string
}

export interface Project {
  id: string
  title: string
  description: string
  tech: string[]
  status: ProjectStatus
  links: ProjectLink[]
  // Короткая заметка под описанием (видна всегда, даже когда описание свёрнуто)
  note?: string
}

export const statusLabels: Record<ProjectStatus, string> = {
  live: 'Работает',
  'in-progress': 'В разработке',
}

export const projects: Project[] = [
  {
    id: 'landing',
    title: 'Этот сайт',
    description: 'Лендинг-визитка с картой стека и проектами. Работает на собственном сервере, автодеплой (CI/CD): пуш в main — сборка и перезапуск.',
    tech: ['React', 'TypeScript', 'Tailwind', 'Docker', 'CI/CD'],
    status: 'live',
    links: [{ label: 'Исходный код', href: 'https://github.com/Godween69/dvbstudio-landing' }],
  },
  {
    id: 'shop',
    title: 'Интернет-магазин',
    description: 'Шаблон магазина, который можно быстро настроить под клиента. Есть живое демо: каталог с поиском, галерея и отзывы, корзина, заказ в три шага и фейковая оплата. Данные сессии временные и сбрасываются через 20 минут.',
    tech: ['React', 'NestJS', 'PostgreSQL', 'Redis'],
    status: 'live',
    links: [{ label: 'Открыть магазин', href: 'https://shop.dvbstudio.ru' }],
    note: 'Код закрыт (коммерческий шаблон), готов показать на созвоне.',
  },
  {
    id: 'dvchat',
    title: 'DVChat',
    description: 'Закрытый семейный мессенджер на протоколе Matrix. Клиент на Flutter для Android собран на основе открытого FluffyChat и доработан: вход по приглашению (ссылка или QR-код), сквозное шифрование, уведомления, чат поддержки, свой канал обновлений без магазинов приложений. Сервер Synapse тоже свой.',
    tech: ['Flutter', 'Matrix', 'Synapse', 'PostgreSQL'],
    status: 'live',
    links: [{ label: 'Исходный код', href: 'https://github.com/Godween69/DVChat' }],
  },
  {
    id: 'dvmail',
    title: 'DVMail',
    description: 'Свой веб-клиент для почты на собственном сервере Stalwart: только письма, без календаря, чатов и лент. Построен вокруг безопасности: письмо открывается в изолированной рамке, скрипты вырезаются, внешние картинки и трекеры не загружаются. Вложения, подсказки адресов, поиск, тёмная и светлая темы, телефон и компьютер.',
    tech: ['React', 'NestJS', 'TypeScript', 'JMAP', 'Docker'],
    status: 'live',
    links: [{ label: 'Исходный код', href: 'https://github.com/Godween69/DVMail' }],
  },
]
