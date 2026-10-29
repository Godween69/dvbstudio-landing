// components/Projects/Projects.tsx
// Секция "Проекты": горизонтальная лента карточек (как рекомендации на YouTube).
// Телефон: листается пальцем. Компьютер: большие стрелки по краям, стрелки скрываются на краю ленты.

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useConfig } from '../../config/useConfig'
import { projects, statusLabels, type Project } from '../../data/projects'

const GAP = 24 // расстояние между карточками в пикселях (gap-6)

// Стрелка: направление и подпись для скринридера
function Arrow({ dir, onClick, visible }: { dir: 'left' | 'right'; onClick: () => void; visible: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === 'left' ? 'Предыдущие проекты' : 'Следующие проекты'}
      tabIndex={visible ? 0 : -1}
      className={`hidden md:flex absolute top-1/2 -translate-y-1/2 z-10 ${dir === 'left' ? '-left-4' : '-right-4'} w-14 h-14 items-center justify-center rounded-full bg-paper-50 dark:bg-gray-800/95 border border-paper-300 dark:border-gray-700 shadow-xl text-purple-600 dark:text-purple-400 hover:scale-110 hover:text-pink-600 dark:hover:text-pink-400 transition-all duration-300 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={dir === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
      </svg>
    </button>
  )
}

// Карточка проекта. Длинное описание обрезается до трёх строк, кнопка с шевроном раскрывает его.
// Теги и ссылки всегда прижаты к нижней границе, поэтому карточки в ленте выглядят ровно.
function ProjectCard({ project, expanded, onToggle }: { project: Project; expanded: boolean; onToggle: () => void }) {
  const config = useConfig()
  const textRef = useRef<HTMLParagraphElement>(null)
  // Обрезано ли описание и какая высота у трёх строк: считаем в браузере после отрисовки
  // (на сервере кнопки нет, текст в HTML полный)
  const [truncated, setTruncated] = useState(false)
  const [clampHeight, setClampHeight] = useState<number | null>(null)
  // Многоточие после трёх строк показываем, пока карточка свёрнута и анимация закончилась
  const [clampOn, setClampOn] = useState(true)
  // При раскрытии обрезку снимаем сразу, в том же рендере: иначе высота анимировалась бы к обрезанному тексту
  if (expanded && clampOn) setClampOn(false)

  useEffect(() => {
    const measure = () => {
      const el = textRef.current
      if (!el || !clampOn) return
      setTruncated(el.scrollHeight > el.clientHeight + 1)
      setClampHeight(el.clientHeight)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [clampOn, project.description])

  return (
    <motion.div
      whileHover={{ y: -8, transition: { duration: 0.3, ease: 'easeOut' } }}
      className="snap-start shrink-0 w-[85%] sm:w-[22rem] min-h-[22rem] flex flex-col bg-paper-50 dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-shadow border border-paper-300 dark:border-gray-700"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className={`text-2xl font-bold ${config.colors.text.main} transition-colors`}>{project.title}</h3>
        {/* Статус проекта */}
        <span
          className={`shrink-0 px-2 py-1 rounded-full text-xs ${
            project.status === 'live'
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
              : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
          }`}
        >
          {statusLabels[project.status]}
        </span>
      </div>

      {/* Описание: три строки; высота плавно меняется при раскрытии и сворачивании (0,3 секунды, как на всём сайте) */}
      <motion.div
        initial={false}
        animate={{ height: truncated && !expanded && clampHeight ? clampHeight : 'auto' }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        onAnimationComplete={() => {
          if (!expanded) setClampOn(true)
        }}
        className="overflow-hidden"
      >
        <p
          ref={textRef}
          className={`${config.colors.text.muted} text-sm leading-relaxed transition-colors ${clampOn ? 'line-clamp-3' : ''}`}
        >
          {project.description}
        </p>
      </motion.div>
      {truncated || expanded ? (
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          className="mt-2 inline-flex items-center gap-1 self-start text-sm font-semibold text-purple-600 hover:underline dark:text-purple-400"
        >
          {expanded ? 'Свернуть' : 'Подробнее'}
          <ChevronDown aria-hidden="true" className={`h-4 w-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
        </button>
      ) : null}

      {/* Низ карточки: технологии и ссылки, прижаты вниз */}
      <div className="mt-auto pt-5">
        <div className="flex flex-wrap gap-2">
          {project.tech.map((tech, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm"
            >
              {tech}
            </span>
          ))}
        </div>
        {project.links.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-4">
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-purple-600 dark:text-purple-400 hover:underline"
              >
                {link.label} →
              </a>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export function Projects() {
  const config = useConfig()
  const trackRef = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(false)
  // Какая карточка раскрыта (одна за раз): при раскрытии другой предыдущая сворачивается сама
  const [openId, setOpenId] = useState<string | null>(null)

  // Показываем стрелку, только если в эту сторону ещё есть что листать
  const update = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 8)
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8)
  }, [])

  useEffect(() => {
    update()
    const el = trackRef.current
    if (!el) return
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [update])

  // Плавная прокрутка своей анимацией (requestAnimationFrame): не зависит от настроек системы
  // и от привязки карточек. На время движения привязка отключается, в конце возвращается.
  const animRef = useRef<number | null>(null)

  const stopAnim = useCallback(() => {
    if (animRef.current !== null) {
      cancelAnimationFrame(animRef.current)
      animRef.current = null
    }
    const el = trackRef.current
    if (el) el.style.scrollSnapType = ''
  }, [])

  // Шаг прокрутки: ширина одной карточки плюс промежуток; лента едет к следующей карточке
  const scrollByCard = (dir: 1 | -1) => {
    const el = trackRef.current
    const first = el?.firstElementChild as HTMLElement | null
    if (!el || !first) return
    const step = first.offsetWidth + GAP
    const max = el.scrollWidth - el.clientWidth
    const from = el.scrollLeft
    const index = Math.round(from / step) + dir
    const to = Math.max(0, Math.min(max, index * step))
    if (Math.abs(to - from) < 1) return
    stopAnim()
    el.style.scrollSnapType = 'none'
    const duration = 650
    const start = performance.now()
    // Плавное ускорение и замедление (easeInOutCubic)
    const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
    const frame = (now: number) => {
      const k = Math.min(1, (now - start) / duration)
      el.scrollLeft = from + (to - from) * ease(k)
      if (k < 1) {
        animRef.current = requestAnimationFrame(frame)
      } else {
        animRef.current = null
        el.style.scrollSnapType = ''
        update()
      }
    }
    animRef.current = requestAnimationFrame(frame)
  }

  // Пользователь взял ленту пальцем, колесом или мышью: отменяем нашу анимацию
  useEffect(() => stopAnim, [stopAnim])

  return (
    <section id="projects" className={`${config.spacing.section} ${config.colors.sections.light} ${config.colors.sections.dark} transition-colors duration-500`}>
      <div className={config.spacing.container}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className={`${config.typography.section.title} ${config.colors.text.main} mb-6 transition-colors`}>
            Проекты
          </h2>
          <p className={`${config.typography.section.subtitle} ${config.colors.text.muted} transition-colors`}>
            Что я сделал и над чем работаю
          </p>
        </motion.div>

        {/* Лента: появляется целиком, карточки внутри не анимируются по одной (они могут быть за краем экрана) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative"
        >
          <Arrow dir="left" onClick={() => scrollByCard(-1)} visible={canLeft} />
          <Arrow dir="right" onClick={() => scrollByCard(1)} visible={canRight} />

          <div
            ref={trackRef}
            onTouchStart={stopAnim}
            onWheel={stopAnim}
            onPointerDown={stopAnim}
            tabIndex={0}
            aria-label="Список проектов, листается вправо и влево"
            className="flex items-start gap-6 overflow-x-auto snap-x snap-mandatory scroll-px-1 px-1 py-4 -my-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-xl"
          >
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                expanded={openId === project.id}
                onToggle={() => setOpenId(openId === project.id ? null : project.id)}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
