// src/config/useConfig.ts
// Хук для доступа к конфигу сайта

import { siteConfig } from './site.config'

export function useConfig() {
  return siteConfig
}
