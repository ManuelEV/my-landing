import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { SubPage } from './components/SubPage'
import { profile } from './content'

const sections = [
  {
    title: 'Sin cookies ni analítica de terceros',
    body: 'Este sitio no instala cookies, no usa píxeles de seguimiento y no comparte datos con redes publicitarias.',
  },
  {
    title: 'Sin formularios',
    body: 'No hay formularios que guarden información. Si me escribes, el correo llega directo a mi bandeja y uso tu dirección solo para responderte.',
  },
  {
    title: 'Registros del servidor',
    body: 'El sitio se sirve desde Cloudflare Pages. Como cualquier proveedor de hosting, Cloudflare puede registrar datos técnicos de la conexión, como la dirección IP, para operar y proteger el servicio.',
  },
  {
    title: 'Contacto',
    body: `Para cualquier consulta sobre tus datos, escríbeme a ${profile.email}.`,
  },
]

function Privacy() {
  return (
    <SubPage>
      <p className="font-mono text-sm text-accent">Privacidad</p>
      <h1 className="text-gradient-hero mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
        Qué hace este sitio con tus datos
      </h1>
      <p className="mt-6 text-lg text-muted">Respuesta corta: casi nada. Este es el detalle.</p>
      <div className="mt-12 flex flex-col gap-8">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="text-xl font-semibold tracking-tight">{s.title}</h2>
            <p className="mt-2 text-base text-muted">{s.body}</p>
          </section>
        ))}
      </div>
      <p className="mt-12 font-mono text-xs text-subtle">Última actualización: octubre de 2026</p>
    </SubPage>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Privacy />
  </StrictMode>,
)
