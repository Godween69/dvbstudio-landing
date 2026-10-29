// scripts/prerender.mjs
// Шаг сборки после `vite build` и серверной сборки (dist-ssr).
// Что делает:
//   1. Рисует сайт в готовый HTML и вкладывает его в dist/index.html (поисковики видят текст без JavaScript).
//   2. Добавляет в <head> метатеги: canonical, Open Graph, Twitter, структурированные данные JSON-LD.
//   3. Добавляет текстовую версию резюме для тех, у кого выключен JavaScript (<noscript>).
//   4. Создаёт sitemap.xml и картинку для превью ссылки og-image.png.
// Если что-то пошло не так, сборка не падает: сайт остаётся обычным одностраничным приложением,
// а в журнале сборки появляется заметное предупреждение.

import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { seo } from '../seo.config.mjs'
import { makeOgPng, OG_SIZE } from './og-image.mjs'

const dist = path.resolve('dist')

// Экранирование текста и значений атрибутов для HTML
const esc = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

// JSON внутри <script>: нельзя закрывать тег раньше времени
const jsonForScript = (value) => JSON.stringify(value).replace(/</g, '\\u003c')

// ---------- Структурированные данные (JSON-LD) ----------
function buildJsonLd(data, today, hasImage) {
  const url = seo.siteUrl + '/'
  const technologies = [...new Set(data.areas.flatMap((area) => area.technologies.map((tech) => tech.name)))]
  const personId = url + '#person'
  const person = {
    '@type': 'Person',
    '@id': personId,
    name: seo.person.name,
    alternateName: seo.person.alternateName,
    jobTitle: seo.person.jobTitle,
    description: seo.description,
    url,
    knowsAbout: technologies,
    knowsLanguage: 'ru',
    sameAs: [data.siteConfig.social.github, data.siteConfig.social.telegram],
  }
  if (hasImage) person.image = seo.siteUrl + '/og-image.png'

  // Проекты с открытым кодом: отдельные записи, чтобы поисковик видел репозитории
  const repositories = data.projects.flatMap((project) =>
    project.links
      .filter((link) => link.href.startsWith('https://github.com/'))
      .map((link) => ({
        '@type': 'SoftwareSourceCode',
        name: project.title,
        description: project.description,
        codeRepository: link.href,
        programmingLanguage: project.tech,
        author: { '@id': personId },
      })),
  )

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': url + '#website',
        url,
        name: seo.siteName,
        inLanguage: 'ru',
        publisher: { '@id': personId },
      },
      {
        '@type': 'ProfilePage',
        '@id': url + '#profile',
        url,
        name: seo.title,
        inLanguage: 'ru',
        dateModified: today,
        isPartOf: { '@id': url + '#website' },
        mainEntity: { '@id': personId },
      },
      person,
      ...repositories,
    ],
  }
}

// ---------- Метатеги для <head> ----------
function buildHead(jsonLd, hasImage) {
  const pageUrl = seo.siteUrl + '/'
  const image = seo.siteUrl + '/og-image.png'
  const lines = [
    `<link rel="canonical" href="${esc(pageUrl)}" />`,
    `<meta name="robots" content="index, follow, max-image-preview:large" />`,
    `<meta name="author" content="${esc(seo.person.name)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(seo.siteName)}" />`,
    `<meta property="og:locale" content="${esc(seo.locale)}" />`,
    `<meta property="og:url" content="${esc(pageUrl)}" />`,
    `<meta property="og:title" content="${esc(seo.title)}" />`,
    `<meta property="og:description" content="${esc(seo.description)}" />`,
    `<meta name="twitter:card" content="${hasImage ? 'summary_large_image' : 'summary'}" />`,
    `<meta name="twitter:title" content="${esc(seo.title)}" />`,
    `<meta name="twitter:description" content="${esc(seo.description)}" />`,
  ]
  if (hasImage) {
    lines.push(
      `<meta property="og:image" content="${esc(image)}" />`,
      `<meta property="og:image:type" content="image/png" />`,
      `<meta property="og:image:width" content="${OG_SIZE.width}" />`,
      `<meta property="og:image:height" content="${OG_SIZE.height}" />`,
      `<meta property="og:image:alt" content="${esc(seo.title)}" />`,
      `<meta name="twitter:image" content="${esc(image)}" />`,
    )
  }
  if (seo.verification.yandex) lines.push(`<meta name="yandex-verification" content="${esc(seo.verification.yandex)}" />`)
  if (seo.verification.google) lines.push(`<meta name="google-site-verification" content="${esc(seo.verification.google)}" />`)
  lines.push(`<script type="application/ld+json">${jsonForScript(jsonLd)}</script>`)
  // Без JavaScript показываем сайт сразу: убираем начальную прозрачность анимаций
  lines.push(
    `<noscript><style>[style*="opacity"]{opacity:1!important;transform:none!important;filter:none!important}</style></noscript>`,
  )
  return lines.join('\n    ')
}

// ---------- Текстовая версия резюме (видна при выключенном JavaScript, читается роботами) ----------
function buildNoscript(data) {
  const parts = []
  parts.push(`<h2>${esc(seo.person.name)}: ${esc(seo.person.jobTitle)}</h2>`)
  parts.push(`<p>${esc(seo.description)}</p>`)
  for (const area of data.areas) {
    parts.push(`<h3>${esc(area.title)}</h3>`)
    parts.push(`<p>${esc(area.tagline)}</p>`)
    parts.push('<ul>')
    for (const item of area.cases) {
      parts.push(`<li><strong>${esc(item.title)}.</strong> ${esc(item.description)}</li>`)
    }
    parts.push('</ul>')
    parts.push(`<p>Технологии: ${area.technologies.map((tech) => esc(tech.name)).join(', ')}.</p>`)
  }
  parts.push('<h3>Проекты</h3>')
  parts.push('<ul>')
  for (const project of data.projects) {
    const links = project.links.map((link) => `<a href="${esc(link.href)}">${esc(link.label)}</a>`).join(', ')
    parts.push(`<li><strong>${esc(project.title)}.</strong> ${esc(project.description)}${links ? ' ' + links : ''}</li>`)
  }
  parts.push('</ul>')
  parts.push('<h3>Контакты</h3>')
  parts.push(
    `<p><a href="${esc(data.siteConfig.social.telegram)}">Telegram</a>, <a href="${esc(data.siteConfig.social.github)}">GitHub</a>, <a href="${esc(data.siteConfig.social.email)}">почта</a></p>`,
  )
  return `<noscript>\n<section style="max-width:48rem;margin:2rem auto;padding:0 1rem;font-family:sans-serif;line-height:1.5">\n${parts.join('\n')}\n</section>\n</noscript>`
}

// ---------- Карта сайта ----------
function buildSitemap(today) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${esc(seo.siteUrl)}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`
}

async function main() {
  const template = await readFile(path.join(dist, 'index.html'), 'utf-8')
  if (template.includes('data-prerendered')) {
    console.log('[prerender] dist/index.html уже обработан, пропускаю')
    return
  }
  for (const needle of ['<div id="root"></div>', '<!--seo-head-->', '<!--seo-body-->']) {
    if (!template.includes(needle)) throw new Error(`в index.html нет фрагмента ${needle}`)
  }

  // Серверная сборка сайта
  const entry = await import(pathToFileURL(path.resolve('dist-ssr/entry-server.js')).href)
  const appHtml = await entry.render()
  if (!appHtml.includes('Стек технологий') || !appHtml.includes('<h1')) {
    throw new Error('отрисованный HTML неполный (нет заголовка или раздела «Стек технологий»)')
  }
  const data = { areas: entry.areas, projects: entry.projects, siteConfig: entry.siteConfig }

  const today = new Date().toISOString().slice(0, 10)

  // Картинка для превью ссылки: если не получилась, сайт работает без неё
  let hasImage = false
  try {
    await writeFile(path.join(dist, 'og-image.png'), makeOgPng())
    hasImage = true
  } catch (error) {
    console.warn('[prerender] ПРЕДУПРЕЖДЕНИЕ: не удалось создать og-image.png:', error.message)
  }

  const jsonLd = buildJsonLd(data, today, hasImage)
  const html = template
    .replace(/<title>[\s\S]*?<\/title>/, () => `<title>${esc(seo.title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, () => `<meta name="description" content="${esc(seo.description)}" />`)
    .replace('<!--seo-head-->', () => buildHead(jsonLd, hasImage))
    .replace('<div id="root"></div>', () => `<div id="root" data-prerendered="true">${appHtml}</div>`)
    .replace('<!--seo-body-->', () => buildNoscript(data))

  await writeFile(path.join(dist, 'index.html'), html)
  await writeFile(path.join(dist, 'sitemap.xml'), buildSitemap(today))
  console.log(`[prerender] готово: HTML ${Math.round(appHtml.length / 1024)} КБ, og-image: ${hasImage ? 'да' : 'нет'}, sitemap.xml создан`)
}

main().catch((error) => {
  // Не роняем сборку: сайт останется обычным одностраничным приложением
  console.warn('[prerender] ПРЕДУПРЕЖДЕНИЕ: предварительная отрисовка не выполнена, сайт собран без неё.')
  console.warn('[prerender] Причина:', error && error.stack ? error.stack : error)
})
