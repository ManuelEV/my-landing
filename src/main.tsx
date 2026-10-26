import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Experience } from './components/experience/Experience'
import { FinalCta } from './components/FinalCta'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { Nav } from './components/Nav'
import { SkipLink } from './components/SkipLink'
import { Stack } from './components/stack/Stack'

function App() {
  return (
    <>
      <SkipLink />
      <Nav />
      <main id="contenido">
        <Hero />
        <Stack />
        <Experience />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
