import { ArrowLeft } from '@phosphor-icons/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ButtonLink } from './components/Button'
import { SubPage } from './components/SubPage'

function NotFound() {
  return (
    <SubPage>
      <div className="flex flex-col items-center text-center">
        <p className="font-mono text-sm text-accent">Error 404</p>
        <h1 className="text-gradient-hero mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Esta ruta no lleva a ningún servicio
        </h1>
        <p className="mt-6 text-lg text-muted">
          La página que buscas no existe o cambió de dirección. Desde el inicio puedes ver mi trayectoria, proyectos y
          forma de contacto.
        </p>
        <ButtonLink href="/" className="mt-8">
          <ArrowLeft size={18} weight="bold" aria-hidden="true" />
          Volver al inicio
        </ButtonLink>
      </div>
    </SubPage>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NotFound />
  </StrictMode>,
)
