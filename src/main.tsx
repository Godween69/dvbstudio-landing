// main.tsx
// Точка входа приложения с ThemeProvider.
// Если страница уже собрана заранее (prerender), React подхватывает готовую разметку (hydrate),
// иначе (режим разработки) рисует с нуля.

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ThemeProvider } from './context/ThemeContext'
import './index.css'

const container = document.getElementById('root')!

const app = (
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
)

if (container.hasChildNodes()) {
  ReactDOM.hydrateRoot(container, app)
} else {
  ReactDOM.createRoot(container).render(app)
}
