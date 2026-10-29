// components/About/About.tsx
// Секция "О себе": кто я, чем занимаюсь, как работаю и что уже работает в production

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Monitor, Server, Container, ArrowRight, ChevronDown, ShieldCheck, Workflow, Sparkles, Boxes, Bot } from 'lucide-react'
import { useConfig } from '../../config/useConfig'

// Чем занимаюсь: три направления; по нажатию раскрывается, что именно делаю
const skills = [
  {
    id: 'frontend',
    icon: Monitor,
    title: 'Интерфейсы',
    text: 'Быстрые адаптивные интерфейсы, продуманные до мелочей.',
    points: [
      'Светлая и тёмная темы, адаптив от телефона до десктопа',
      'Плавные анимации без лишней нагрузки',
      'Строгая типизация, чистый код с комментариями и понятная структура',
    ],
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    id: 'backend',
    icon: Server,
    title: 'Серверная часть',
    text: 'API, базы данных и серверная логика.',
    points: [
      'Модульные API на NestJS с проверкой входных данных',
      'Базы данных, миграции и кэш',
      'Вход по токенам, лимиты запросов, защита от подделки запросов',
    ],
    tags: ['NestJS', 'PostgreSQL', 'Prisma', 'Redis'],
  },
  {
    id: 'devops',
    icon: Container,
    title: 'Развёртывание',
    text: 'Собственная инфраструктура и автоматический деплой.',
    points: [
      'Слияние в main само обновляет сайт, прошлая версия хранится для отката',
      'Серверы описаны как код, изменения сначала проверяются',
      'Резервные копии и мониторинг доступности',
    ],
    tags: ['Docker', 'Nginx', 'GitHub Actions', 'Ansible'],
  },
]

// Как я работаю: четыре шага
const steps = [
  { title: 'Разбираюсь', text: 'Уточняю задачу и ограничения, предлагаю самый простой путь.' },
  { title: 'Проектирую', text: 'Схема данных, API и интерфейс обдумываются до первой строки кода.' },
  { title: 'Делаю', text: 'Небольшими шагами и с проверкой на каждом: типы, тесты, живой просмотр.' },
  { title: 'Выпускаю', text: 'Автодеплой, возможность отката, мониторинг и копии.' },
]

// Принципы работы
const principles = [
  { icon: Boxes, title: 'Чистый код и архитектура', text: 'Модули с понятными границами и подробные комментарии на русском. Через полгода код читается так же легко, как в день написания.' },
  { icon: Workflow, title: 'Автоматизация вместо рутины', text: 'Деплой, копии и проверки работают сами, а не по напоминанию.' },
  { icon: Sparkles, title: 'Внимание к деталям', text: 'Адаптив, обе темы, доступность и плавность: то, что замечают не сразу, но чувствуют сразу.' },
  { icon: ShieldCheck, title: 'Безопасность по умолчанию', text: 'Секреты вне кода, минимум открытого наружу, вводимые данные считаются недоверенными.' },
]

// Работа с нейросетями: как использую ИИ в разработке (лучшие практики)
const aiPoints = [
  'Ставлю задачу чётко: контекст, ограничения, ожидаемый результат, примеры',
  'Подбираю модель и инструмент под задачу: быстрые ответы, глубокий разбор, работа с кодом',
  'Разбиваю большое на небольшие проверяемые шаги, как с живым исполнителем',
  'Результат всегда проверяю: чтение кода, тесты, запуск. Архитектура и ответственность остаются за мной',
  'Секреты и закрытые данные в нейросети не отдаю',
]
const aiTags = ['Промпт-инжиниринг', 'ИИ-ассистенты', 'Агенты для кода', 'Ревью результата']

// Что уже работает (подробности в разделе «Проекты»)
const live = ['Сайт-визитка', 'DVMail', 'DVChat', 'Интернет-магазин']

export function About() {
  const config = useConfig()
  // Раскрытое направление (одно за раз)
  const [open, setOpen] = useState<string | null>(null)

  return (
    <section id="about" className={`${config.spacing.section} ${config.colors.sections.light} ${config.colors.sections.dark} transition-colors duration-500`}>
      <div className={config.spacing.container}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <h2 className={`${config.typography.section.title} ${config.colors.text.main} mb-6 transition-colors`}>
            О себе
          </h2>
          <p className={`text-xl leading-relaxed ${config.colors.text.main} transition-colors`}>
            Независимый full-stack разработчик. Довожу веб-приложения до production: от интерфейса и API до серверов и автоматического деплоя.
          </p>
          {/* Что уже работает */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <span className={`text-sm ${config.colors.text.muted}`}>Уже работает:</span>
            {live.map((item) => (
              <a
                key={item}
                href="#projects"
                className="inline-flex items-center gap-2 text-sm font-medium text-purple-700 hover:underline dark:text-purple-300"
              >
                <span className="h-2 w-2 rounded-full bg-green-500" />
                {item}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Чем занимаюсь: нажмите на карточку, чтобы раскрыть */}
        <div className="mb-16 grid items-start gap-6 md:grid-cols-3">
          {skills.map((skill, index) => {
            const Icon = skill.icon
            const isOpen = open === skill.id
            return (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`rounded-xl border bg-paper-50 shadow-lg transition-colors dark:bg-gray-800 ${
                  isOpen ? 'border-purple-400 dark:border-purple-500' : 'border-paper-300 dark:border-gray-700'
                }`}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : skill.id)}
                  className="flex w-full flex-col p-6 text-left"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg text-white ${config.colors.primaryButton}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <ChevronDown className={`h-5 w-5 text-purple-600 transition-transform duration-300 dark:text-purple-400 ${isOpen ? 'rotate-180' : ''}`} />
                  </div>
                  <h3 className={`mb-2 text-xl font-bold ${config.colors.text.main}`}>{skill.title}</h3>
                  <p className={`leading-relaxed ${config.colors.text.muted}`}>{skill.text}</p>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6">
                        <ul className={`mb-4 space-y-2 text-sm ${config.colors.text.muted}`}>
                          {skill.points.map((point) => (
                            <li key={point} className="flex gap-2">
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-500" />
                              {point}
                            </li>
                          ))}
                        </ul>
                        <div className="flex flex-wrap gap-2">
                          {skill.tags.map((tag) => (
                            <span key={tag} className="rounded-full bg-purple-100 px-3 py-1 text-xs text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

        {/* Как я работаю: информационный блок, шкала шагов без карточек (не кликается) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h3 className={`mb-10 text-center text-2xl font-bold ${config.colors.text.main}`}>Как я работаю</h3>
          <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <li key={step.title} className="relative">
                {/* Номер шага и линия к следующему шагу */}
                <span className="mb-4 flex h-9 w-9 items-center justify-center rounded-full border-2 border-paper-500 text-sm font-bold text-gray-600 dark:border-gray-500 dark:text-gray-300">
                  {index + 1}
                </span>
                {index < steps.length - 1 && (
                  // Линия к следующему шагу; по ней бежит искорка (у каждого отрезка своя задержка: 3 секунды на отрезок)
                  <span aria-hidden="true" className="absolute left-11 right-[-2rem] top-4 hidden h-[3px] overflow-hidden lg:block">
                    <span className="absolute inset-x-0 top-px h-px bg-paper-400 dark:bg-gray-700" />
                    <span
                      className="step-spark absolute left-0 top-0 h-[3px] w-1/3 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0"
                      style={{ animationDelay: `${index * 3}s` }}
                    />
                  </span>
                )}
                <h4 className={`mb-1 text-lg font-bold ${config.colors.text.main}`}>{step.title}</h4>
                <p className={`text-sm leading-relaxed ${config.colors.text.muted}`}>{step.text}</p>
              </li>
            ))}
          </ol>
        </motion.div>

        {/* Работа с нейросетями: информационная плоская панель (не кликается) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 rounded-lg border-l-4 border-purple-500 bg-paper-300 p-6 dark:bg-white/5 sm:p-8"
        >
          <div className="mb-4 flex items-center gap-3">
            <Bot className="h-7 w-7 shrink-0 text-purple-600 dark:text-purple-400" />
            <h3 className={`text-2xl font-bold ${config.colors.text.main}`}>Работаю с нейросетями</h3>
          </div>
          <p className={`mb-5 leading-relaxed ${config.colors.text.muted}`}>
            Умею работать с разными нейросетями и ИИ-ассистентами и встраивать их в разработку: это ускоряет работу, а качество остаётся на мне.
          </p>
          <ul className={`mb-5 grid gap-3 text-sm sm:grid-cols-2 ${config.colors.text.muted}`}>
            {aiPoints.map((point) => (
              <li key={point} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-paper-500 dark:bg-gray-500" />
                {point}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2">
            {aiTags.map((tag) => (
              <span key={tag} className="rounded-full bg-paper-400 px-3 py-1 text-xs text-gray-800 dark:bg-white/10 dark:text-gray-300">
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Принципы работы: информационный блок, плоские серые плашки (не кликаются) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h3 className={`mb-8 text-center text-2xl font-bold ${config.colors.text.main}`}>Принципы</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {principles.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="flex gap-4 rounded-lg bg-paper-300 p-5 dark:bg-white/5">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-gray-500 dark:text-gray-400" />
                  <div>
                    <h4 className={`mb-1 font-bold ${config.colors.text.main}`}>{item.title}</h4>
                    <p className={`text-sm leading-relaxed ${config.colors.text.muted}`}>{item.text}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Призыв к действию */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col items-center gap-4"
        >
          <span className={`flex items-center gap-2 text-sm ${config.colors.text.muted}`}>
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Открыт к сотрудничеству
          </span>
          <a
            href="#contact"
            className={`inline-flex items-center gap-2 rounded-lg px-8 py-3 font-semibold text-white transition-shadow hover:shadow-lg hover:shadow-purple-500/50 ${config.colors.primaryButton}`}
          >
            Обсудить проект
            <ArrowRight className="h-5 w-5" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
