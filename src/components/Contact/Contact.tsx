// components/Contact/Contact.tsx
// Секция "Контакты": прямые ссылки вместо формы обратной связи

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Mail, Code2, Copy, Check } from 'lucide-react'
import { useConfig } from '../../config/useConfig'

export function Contact() {
  const config = useConfig()
  // Показываем галочку после копирования адреса почты
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(config.site.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Буфер обмена недоступен (например, http) — просто ничего не делаем
    }
  }

  // GitHub иконка (используем Code2, т.к. бренд-иконок в Lucide нет)
  const contacts = [
    { icon: Send, label: 'Telegram', value: '@Godween69', href: config.social.telegram },
    { icon: Mail, label: 'Почта', value: config.site.email, href: config.social.email },
    { icon: Code2, label: 'GitHub', value: 'Godween69', href: config.social.github },
  ]

  return (
    <section id="contact" className="py-32 px-6 bg-paper-100 dark:bg-gray-950">
      <div className="max-w-2xl mx-auto">
        {/* Заголовок секции */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Связаться
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Проще всего написать в Telegram — отвечу быстрее всего
          </p>
        </motion.div>

        {/* Карточки контактов */}
        <div className="space-y-4">
          {contacts.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="flex items-center gap-4 p-5 rounded-xl bg-paper-50 dark:bg-gray-900 border border-paper-300 dark:border-gray-800 hover:border-purple-500 transition-colors"
              >
                <Icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
                  <p className="font-semibold text-gray-900 dark:text-white truncate">{item.value}</p>
                </div>
              </motion.a>
            )
          })}

          {/* Копирование почты отдельной кнопкой, чтобы не открывать почтовый клиент */}
          <button
            type="button"
            onClick={copyEmail}
            className="flex items-center gap-2 mx-auto text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Адрес скопирован' : 'Скопировать адрес почты'}
          </button>
        </div>
      </div>
    </section>
  )
}
