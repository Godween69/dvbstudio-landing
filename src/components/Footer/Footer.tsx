// components/Footer/Footer.tsx
// Подвал сайта с иконками Lucide

import { motion } from 'framer-motion'
import { useConfig } from '../../config/useConfig'
import { Send, Mail, Code2 } from 'lucide-react'

export function Footer() {
  const config = useConfig()

  // GitHub иконка (используем Code2, если Github недоступен)
  const GitHubIcon = Code2

  const socialLinks = [
    {
      icon: Send,
      href: config.social.telegram,
      label: 'Telegram',
      hoverColor: 'hover:text-blue-500'
    },
    {
      icon: GitHubIcon,
      href: config.social.github,
      label: 'GitHub',
      hoverColor: 'hover:text-gray-900 dark:hover:text-white'
    },
    {
      icon: Mail,
      href: config.social.email,
      label: 'Email',
      hoverColor: 'hover:text-red-500'
    },
  ]

  return (
    <footer className={`${config.spacing.section.replace('py-32', 'py-12')} ${config.colors.sections.white} border-t border-paper-300 dark:border-gray-800 transition-colors duration-500`}>
      <div className={config.spacing.container}>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className={`${config.colors.text.muted} mt-1 transition-colors`}>
              © {config.site.name}. 2026. Все права защищены.
            </p>
          </div>

          <div className="flex gap-8">
            {socialLinks.map((link, index) => {
              const Icon = link.icon
              return (
                <motion.a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex flex-col items-center gap-2 ${config.colors.text.muted} ${link.hoverColor} transition-colors duration-300`}
                >
                  <Icon size={28} strokeWidth={1.5} />
                  <span className="text-xs font-medium">{link.label}</span>
                </motion.a>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}
