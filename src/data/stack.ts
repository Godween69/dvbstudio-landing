// data/stack.ts
// Данные карты стека: три направления (Frontend, Backend, DevOps).
// В каждом — кейсы (что реально сделано) и технологии с уровнем.
// Всё здесь основано на реальных проектах и репозиториях: чего нет в работе, того в списке нет.
// Чтобы обновить карту, достаточно поправить этот файл — вёрстка не меняется.
// Число кейсов: 2, 3 или 4; число технологий кратно пяти (ряды по пять). Уровень: 0..100, кратно 10.

export interface Technology {
  name: string
  category: string
  // Условный уровень владения в процентах, кратно 10: 0 — только знакомлюсь, 100 — эксперт.
  // Одна точка на карточке = 10%. Это самооценка, её можно менять без правки вёрстки.
  level: number
  // Что именно сделано на этой технологии (показывается по клику)
  note: string
}

export interface Case {
  title: string
  description: string
  // Ключевые слова для бейджей на карточке кейса
  tags: string[]
}

export interface Area {
  id: 'frontend' | 'backend' | 'devops'
  title: string
  tagline: string
  cases: Case[]
  technologies: Technology[]
}

export const areas: Area[] = [
  {
    id: 'frontend',
    title: 'Frontend',
    tagline: 'Быстрые адаптивные интерфейсы с продуманной анимацией',
    cases: [
      {
        title: 'Лендинг-визитка',
        description: 'Светлая и тёмная темы, ленивая загрузка секций, адаптив от телефона до десктопа, анимации появления.',
        tags: ['React', 'Tailwind', 'Framer Motion'],
      },
      {
        title: 'Клиент для почты',
        description: 'Письма открываются в изолированной рамке: HTML очищается, скрипты и внешние картинки блокируются. Вложения, подсказки адресов, светлая и тёмная темы.',
        tags: ['React', 'TypeScript', 'DOMPurify'],
      },
      {
        title: 'Интернет-магазин',
        description: 'Каталог с поиском, галерея и отзывы, корзина и заказ в три шага. Состояние в Zustand, запросы и кэш через React Query.',
        tags: ['React', 'Zustand', 'React Query'],
      },
      {
        title: 'Клиент мессенджера',
        description: 'Доработка клиента на Flutter для собственного сервера Matrix: вход по ссылке и QR-коду, уведомления, обновления из своего канала.',
        tags: ['Flutter', 'Matrix'],
      },
    ],
    technologies: [
      { name: 'React', category: 'Библиотека', level: 80, note: 'Интерфейсы на хуках, ленивая загрузка, мемоизация. Во всех веб-проектах.' },
      { name: 'TypeScript', category: 'Язык', level: 80, note: 'Строгая типизация во фронтенде и бэкенде.' },
      { name: 'Tailwind CSS', category: 'Стили', level: 80, note: 'Адаптивная вёрстка, темы, стеклянные карточки.' },
      { name: 'Framer Motion', category: 'Анимации', level: 60, note: 'Анимации появления, раскрытия и переходов (Framer Motion и Motion).' },
      { name: 'Vite', category: 'Сборка', level: 60, note: 'Сборка и сервер разработки с горячей перезагрузкой во всех проектах на React.' },
      { name: 'React Query', category: 'Данные', level: 60, note: 'Запросы к API и кэш данных в магазине и трекере портфеля.' },
      { name: 'Zustand', category: 'Состояние', level: 60, note: 'Лёгкое хранилище состояния: корзина, сессия, настройки.' },
      { name: 'React Router', category: 'Маршруты', level: 60, note: 'Маршрутизация в многостраничных приложениях.' },
      { name: 'ECharts', category: 'Графики', level: 30, note: 'Графики курсов в трекере портфеля.' },
      { name: 'Flutter', category: 'Мобильное', level: 30, note: 'Доработка клиента Matrix (форк FluffyChat).' },
    ],
  },
  {
    id: 'backend',
    title: 'Backend',
    tagline: 'API, базы данных и серверная логика',
    cases: [
      {
        title: 'Сервер клиента почты',
        description: 'Посредник между браузером и почтовым сервером по JMAP: сессии, защита от подделки запросов, лимиты, проверка вложений. Тесты на заглушке почтового сервера.',
        tags: ['NestJS', 'JMAP', 'Node.js'],
      },
      {
        title: 'Магазин с демо-режимом',
        description: 'Каталог и заказы в PostgreSQL через Prisma, корзина и сессии в Redis с автоматическим сбросом, вход по JWT, журналы запросов.',
        tags: ['NestJS', 'Prisma', 'Redis'],
      },
      {
        title: 'Серверные модули Synapse',
        description: 'Собственные Python-модули для сервера мессенджера на Matrix.',
        tags: ['Python', 'Synapse'],
      },
      {
        title: 'Трекер криптопортфеля',
        description: 'API с обновлением курсов по расписанию и передачей данных в браузер в реальном времени.',
        tags: ['NestJS', 'WebSocket', 'Prisma'],
      },
    ],
    technologies: [
      { name: 'NestJS', category: 'Фреймворк', level: 70, note: 'Модули, DTO-валидация, лимиты запросов, защита от подделки запросов.' },
      { name: 'Node.js', category: 'Среда', level: 60, note: 'Серверы на TypeScript, тесты встроенным запуском node:test, служебные скрипты.' },
      { name: 'PostgreSQL', category: 'База данных', level: 60, note: 'Проектирование схем, миграции, резервные копии.' },
      { name: 'Prisma', category: 'ORM', level: 60, note: 'Схема, миграции, типобезопасные запросы.' },
      { name: 'TypeORM', category: 'ORM', level: 30, note: 'Подключение к PostgreSQL в учебном проекте.' },
      { name: 'Redis', category: 'Кэш и сессии', level: 30, note: 'Сессионное хранилище с TTL для демо-режима.' },
      { name: 'JWT и Passport', category: 'Авторизация', level: 60, note: 'Вход по токенам, хеширование паролей, защита маршрутов.' },
      { name: 'WebSocket', category: 'Реальное время', level: 30, note: 'Передача данных в браузер в реальном времени (socket.io) в трекере портфеля.' },
      { name: 'JMAP', category: 'Протокол', level: 50, note: 'Чтение, отправка писем и вложений по JMAP: свой клиент для почтового сервера.' },
      { name: 'Python', category: 'Язык', level: 30, note: 'Модули для сервера Matrix Synapse, служебные скрипты.' },
    ],
  },
  {
    id: 'devops',
    title: 'DevOps',
    tagline: 'Свои серверы, автоматический деплой и воспроизводимость',
    cases: [
      {
        title: 'Автодеплой (CI/CD)',
        description: 'Слияние в main запускает сборку и перезапуск на собственном сервере через GitHub Actions. Предыдущий образ сохраняется для быстрого отката.',
        tags: ['CI/CD', 'GitHub Actions', 'Docker'],
      },
      {
        title: 'Своя инфраструктура',
        description: 'Несколько серверов, обратный прокси с TLS, Docker Compose-стеки, раздельные сети и лимиты ресурсов у контейнеров.',
        tags: ['Nginx', 'Docker Compose', 'Linux'],
      },
      {
        title: 'Серверы как код',
        description: 'Конфигурации всех серверов в git и роли Ansible: изменения сначала проверяются в режиме «что изменится», потом применяются. Секреты в зашифрованном хранилище, пошаговые инструкции для восстановления.',
        tags: ['Ansible', 'Git', 'Vault'],
      },
      {
        title: 'Копии, мониторинг и почта',
        description: 'Ночные зашифрованные резервные копии, проверки доступности сервисов с уведомлениями, собственный почтовый сервер на своём домене.',
        tags: ['restic', 'Uptime Kuma', 'systemd'],
      },
    ],
    technologies: [
      { name: 'Docker', category: 'Контейнеры', level: 70, note: 'Compose-стеки, многоэтапные сборки, отдельные сети, запуск без root.' },
      { name: 'GitHub Actions', category: 'CI/CD', level: 50, note: 'Деплой через собственный раннер.' },
      { name: 'Linux', category: 'Системы', level: 60, note: 'Сеть, межсетевой экран, обслуживание серверов, скрипты на Bash и Python.' },
      { name: 'Nginx', category: 'Прокси', level: 60, note: 'Обратный прокси, сертификаты Let’s Encrypt, заголовки безопасности.' },
      { name: 'Ansible', category: 'Автоматизация', level: 50, note: 'Роли и плейбуки для всех серверов, проверка перед применением, Ansible Vault.' },
      { name: 'systemd', category: 'Службы', level: 60, note: 'Службы и таймеры: уведомления, мониторинг, резервные копии.' },
      { name: 'restic', category: 'Резервные копии', level: 40, note: 'Ночные зашифрованные копии серверов и проверка восстановления.' },
      { name: 'Uptime Kuma', category: 'Мониторинг', level: 40, note: 'Проверки доступности сервисов и уведомления о сбоях.' },
      { name: 'UFW и fail2ban', category: 'Безопасность', level: 60, note: 'Межсетевой экран с подписью каждого порта, защита входа на серверы.' },
      { name: 'Почтовые серверы', category: 'Почта', level: 40, note: 'Собственный почтовый сервер (Stalwart) и защита приёма (Postfix).' },
    ],
  },
]
