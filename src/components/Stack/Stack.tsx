// components/Stack/Stack.tsx
// Секция "Стек": вкладки Frontend / Backend / DevOps, в каждой кейсы и технологии

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useConfig } from '../../config/useConfig'
import { areas } from '../../data/stack'

export function Stack() {
  const config = useConfig()
  // Активная вкладка и раскрытая технология (одна за раз)
  const [activeId, setActiveId] = useState(areas[0].id)
  const [selected, setSelected] = useState<string | null>(null)

  const area = areas.find((item) => item.id === activeId) ?? areas[0]

  // При смене вкладки закрываем раскрытую карточку
  const changeTab = (id: typeof activeId) => {
    setActiveId(id)
    setSelected(null)
  }

  return (
    <section id="stack" className={`${config.spacing.section} ${config.colors.sections.white} transition-colors duration-500`}>
      <div className={config.spacing.container}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-12"
        >
          <h2 className={`${config.typography.section.title} ${config.colors.text.main} mb-6 transition-colors`}>
            Стек технологий
          </h2>
          <p className={`${config.typography.section.subtitle} ${config.colors.text.muted} transition-colors`}>
            От интерфейса до сервера: что умею и где это применено
          </p>
        </motion.div>

        {/* Вкладки направлений */}
        <div role="tablist" className="mx-auto mb-12 flex w-fit gap-1 rounded-full border border-paper-300 bg-paper-300 p-1 dark:border-gray-800 dark:bg-gray-900">
          {areas.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={item.id === activeId}
              onClick={() => changeTab(item.id)}
              className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-colors sm:px-6 ${
                item.id === activeId ? 'text-white' : config.colors.text.muted
              }`}
            >
              {/* Подвижная плашка активной вкладки */}
              {item.id === activeId && (
                <motion.span
                  layoutId="stack-tab"
                  className={`absolute inset-0 rounded-full ${config.colors.primaryButton}`}
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative z-10">{item.title}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={area.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
          >
            <p className={`mb-8 text-center text-lg ${config.colors.text.main}`}>{area.tagline}</p>

            {/* Кейсы: что сделано */}
            <div className={`mb-12 grid gap-6 ${area.cases.length === 2 ? 'mx-auto max-w-3xl md:grid-cols-2' : area.cases.length === 4 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
              {area.cases.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-paper-300 bg-paper-50 p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800"
                >
                  <h3 className={`mb-2 text-lg font-bold ${config.colors.text.main}`}>{item.title}</h3>
                  <p className={`mb-4 text-sm leading-relaxed ${config.colors.text.muted}`}>{item.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-purple-100 px-3 py-1 text-xs text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Пояснение к шкале уровня */}
            <p className={`mb-4 text-center text-xs ${config.colors.text.muted}`}>
              Условная шкала: каждая точка это 10%. 0% значит только знакомлюсь, 100% значит эксперт. Нажмите на технологию, чтобы увидеть, что на ней сделано.
            </p>

            {/* Технологии: уровень и описание по клику */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
              {area.technologies.map((tech) => {
                const isOpen = selected === tech.name
                // Уровень в процентах (кратно 10): одна точка = 10%
                const dotsOn = Math.round(tech.level / 10)

                return (
                  <button
                    key={tech.name}
                    type="button"
                    onClick={() => setSelected(isOpen ? null : tech.name)}
                    aria-expanded={isOpen}
                    className={`self-start rounded-xl border bg-paper-50 p-4 text-left shadow transition-shadow hover:shadow-xl dark:bg-gray-800 ${
                      isOpen ? 'border-purple-500' : 'border-paper-300 dark:border-gray-700'
                    }`}
                  >
                    {/* Название и шеврон: шеврон подсказывает, что карточка раскрывается */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className={`font-bold ${config.colors.text.main}`}>{tech.name}</h4>
                        <p className={`mb-3 text-xs ${config.colors.text.muted}`}>{tech.category}</p>
                      </div>
                      <ChevronDown
                        aria-hidden="true"
                        className={`mt-0.5 h-5 w-5 shrink-0 text-purple-600 transition-transform duration-300 dark:text-purple-400 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </div>

                    {/* Уровень: десять точек, каждая 10%, рядом число в процентах */}
                    <div
                      className="flex flex-wrap items-center gap-x-2 gap-y-1"
                      role="img"
                      aria-label={`Условный уровень: ${tech.level}%`}
                    >
                      <div className="flex items-center gap-[3px]" aria-hidden="true">
                        {Array.from({ length: 10 }, (_, i) => (
                          <span
                            key={i}
                            className={`h-2 w-2 rounded-full ${
                              i < dotsOn ? 'bg-purple-500' : 'bg-paper-400 dark:bg-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className={`text-xs font-semibold tabular-nums ${config.colors.text.muted}`}>{tech.level}%</span>
                    </div>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <p className={`mt-3 text-xs leading-relaxed ${config.colors.text.main}`}>{tech.note}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
