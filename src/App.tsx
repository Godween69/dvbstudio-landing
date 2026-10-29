// App.tsx
// Главный компонент приложения с ленивой загрузкой секций

import { lazy, Suspense } from 'react'
import { Sidebar } from './components/Sidebar'

// Ленивая загрузка секций
const Hero = lazy(() => import('./components/Hero/Hero').then(m => ({ default: m.Hero })))
const About = lazy(() => import('./components/About/About').then(m => ({ default: m.About })))
const Stack = lazy(() => import('./components/Stack/Stack').then(m => ({ default: m.Stack })))
const Projects = lazy(() => import('./components/Projects/Projects').then(m => ({ default: m.Projects })))
const Contact = lazy(() => import('./components/Contact/Contact').then(m => ({ default: m.Contact })))
const Footer = lazy(() => import('./components/Footer/Footer').then(m => ({ default: m.Footer })))

function App() {
  return (
    <div className="min-h-screen bg-paper-100 dark:bg-gray-950 transition-colors">
      <Sidebar />
      <main>
        <Suspense fallback={null}>
          <Hero />
        </Suspense>
        
        <Suspense fallback={null}>
          <About />
        </Suspense>
        
        <Suspense fallback={null}>
          <Stack />
        </Suspense>
        
        <Suspense fallback={null}>
          <Projects />
        </Suspense>
        
        <Suspense fallback={null}>
          <Contact />
        </Suspense>
        
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </main>
    </div>
  )
}

export default App
