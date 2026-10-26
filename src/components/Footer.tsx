import { ArrowUp } from '@phosphor-icons/react'
import { profile } from '../content'

export function Footer({ home = true }: { home?: boolean }) {
  return (
    <footer className="border-t border-line px-4 py-8 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-subtle sm:flex-row">
        <p>
          © {new Date().getFullYear()} {profile.fullName}
        </p>
        <nav aria-label="Legal" className="flex items-center gap-6">
          <a href="/privacidad/" className="transition-colors duration-300 ease-soft hover:text-fg">
            Privacidad
          </a>
          <a
            href={home ? '#inicio' : '/'}
            className="flex items-center gap-1 transition-colors duration-300 ease-soft hover:text-fg"
          >
            {home ? 'Volver arriba' : 'Inicio'}
            {home && <ArrowUp size={14} aria-hidden="true" />}
          </a>
        </nav>
      </div>
    </footer>
  )
}
