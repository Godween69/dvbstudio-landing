// components/Hero/Hero.tsx
// Главный экран с анимированным фоном

import { useMemo, type CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { fadeInDown, fadeInUp, scaleIn } from '../../animations/variants'
import { useConfig } from '../../config/useConfig'

// Количество фоновых частиц
const PARTICLES_COUNT = 12

// Псевдослучайные числа с фиксированным зерном: одинаковый результат на сервере и в браузере
function seededRandom(seed: number) {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function Hero() {
  const config = useConfig()

  // Параметры частиц считаем один раз, иначе они прыгают при каждом рендере
  const particles = useMemo(() => {
    const random = seededRandom(20261029)
    return Array.from({ length: PARTICLES_COUNT }, () => ({
      left: `${(random() * 100).toFixed(2)}%`,
      top: `${(random() * 100).toFixed(2)}%`,
      duration: 3 + random() * 2,
      delay: random() * 2,
    }))
  }, [])

  return (
    <section
      className={`relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden ${config.colors.hero.light} ${config.colors.hero.dark} transition-colors duration-500`}
    >
      {/* Анимированный фон (CSS-анимация, без перерисовки) */}
      <div
        aria-hidden="true"
        className="hero-glow pointer-events-none absolute -inset-[10%] opacity-30"
      />

      <div
        className={`${config.spacing.container} relative z-10 w-full max-w-full overflow-hidden px-4 py-16 text-center sm:px-6 sm:py-20 md:py-28 lg:py-32`}
      >
        {/* Приветствие */}
        <motion.p
          variants={fadeInDown}
          initial="hidden"
          animate="visible"
          className={`${config.colors.text.main} mx-auto mb-3 max-w-full break-words text-2xl font-semibold leading-tight transition-colors sm:mb-4 sm:text-3xl md:text-4xl lg:text-5xl`}
        >
          {config.site.hello}
        </motion.p>

        {/* Имя */}
        <motion.h1
          initial={config.animations.hero.name.initial}
          animate={config.animations.hero.name.animate}
          transition={{ delay: 0.3 }}
          className={`${config.colors.text.accent} mx-auto mb-5 max-w-full break-words text-[clamp(2rem,11vw,3.75rem)] font-bold leading-[1.05] tracking-tight transition-colors sm:mb-6 sm:text-5xl md:text-6xl lg:text-7xl`}
        >
          {config.site.author}
          {/* Для поисковиков и скринридеров: профессия в главном заголовке, на экране не видна */}
          <span className="sr-only"> — Full-Stack разработчик, dvb studio</span>
        </motion.h1>

        {/* Описание */}
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          className={`${config.colors.text.muted} mx-auto mb-8 max-w-xl px-1 text-sm leading-relaxed transition-colors sm:mb-10 sm:px-0 sm:text-base md:text-lg lg:text-xl`}
        >
          {config.site.description}
        </motion.p>

        {/* Кнопки */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.6 }}
          className="mx-auto flex w-full max-w-sm flex-col items-stretch justify-center gap-3 sm:max-w-none sm:flex-row sm:items-center sm:gap-4"
        >
          <motion.a
            href="#projects"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`w-full rounded-lg px-6 py-3 text-sm font-semibold text-white transition-shadow hover:shadow-lg hover:shadow-purple-500/50 sm:w-auto sm:px-8 sm:py-4 sm:text-base ${config.colors.primaryButton}`}
          >
            Смотреть работы
          </motion.a>

          <motion.a
            href="#contact"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full rounded-lg border border-black/20 bg-black/10 px-6 py-3 text-sm font-semibold text-gray-900 backdrop-blur-sm transition-colors hover:bg-black/20 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 sm:w-auto sm:px-8 sm:py-4 sm:text-base"
          >
            Связаться
          </motion.a>
        </motion.div>
      </div>

      {/* Анимированные частицы: на телефоне показываем только половину */}
      {particles.map((particle, index) => (
        <div
          key={index}
          aria-hidden="true"
          className={`hero-particle pointer-events-none absolute h-2 w-2 rounded-full bg-black/10 dark:bg-white/20 ${
            index >= PARTICLES_COUNT / 2 ? 'hidden sm:block' : ''
          }`}
          style={
            {
              left: particle.left,
              top: particle.top,
              '--dur': `${particle.duration}s`,
              '--delay': `${particle.delay}s`,
            } as CSSProperties
          }
        />
      ))}
    </section>
  )
}
