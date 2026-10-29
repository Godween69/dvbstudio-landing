// ssr/entry-server.tsx
// Серверная отрисовка для предварительной сборки HTML (prerender).
// Используется только при `npm run build`: сайт один раз рисуется в строку, и поисковики
// получают готовый текст без запуска JavaScript. В браузере React подхватывает эту разметку.

import { Writable } from 'node:stream'
import { StrictMode } from 'react'
import { renderToPipeableStream } from 'react-dom/server'
import App from '../src/App'
import { ThemeProvider } from '../src/context/ThemeContext'

// Данные для метаразметки и текстовой версии (те же, что на сайте: один источник правды)
export { areas } from '../src/data/stack'
export { projects } from '../src/data/projects'
export { siteConfig } from '../src/config/site.config'

// Рисует приложение целиком и возвращает HTML-строку (ждёт загрузки всех ленивых секций)
export function render(): Promise<string> {
  return new Promise((resolve, reject) => {
    let html = ''
    const sink = new Writable({
      write(chunk, _encoding, done) {
        html += chunk.toString()
        done()
      },
      final(done) {
        resolve(html)
        done()
      },
    })
    const { pipe } = renderToPipeableStream(
      <StrictMode>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </StrictMode>,
      {
        onAllReady() {
          pipe(sink)
        },
        onShellError: reject,
        onError: reject,
      },
    )
  })
}
