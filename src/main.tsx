import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Faq } from './components/Faq'
import { FinalCta } from './components/FinalCta'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { Journey } from './components/journey/Journey'
import { Nav } from './components/Nav'
import { Process } from './components/Process'
import { SkipLink } from './components/SkipLink'
import { Stack } from './components/Stack'
import { Stats } from './components/Stats'
import { Tagline } from './components/Tagline'
import { Work } from './components/work/Work'

function App() {
  return (
    <>
      <SkipLink />
      <Nav />
      <main id="contenido">
        <Hero />
        <Stats />
        <Journey />
        <Tagline />
        <Work />
        <Process />
        <Stack />
        <Faq />
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
