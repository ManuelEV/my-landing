import { useEffect, useState } from 'react'
import { nav, profile } from '../content'
import { useActiveSection } from '../hooks/useActiveSection'
import { buttonClass } from './Button'

const ids = nav.map((n) => n.id)

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`grid size-8 place-items-center rounded-full bg-fg font-mono text-xs font-semibold text-black ${className}`}
    >
      ME
    </span>
  )
}

/** Floating compact bar. `home` decides whether links are in page anchors or point back to the home page. */
export function Nav({ home = true }: { home?: boolean }) {
  const [open, setOpen] = useState(false)
  const active = useActiveSection(home ? ids : [])
  const href = (id: string) => (home ? `#${id}` : `/#${id}`)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-4">
        <nav
          aria-label="Principal"
          className="pointer-events-auto flex items-center gap-1 rounded-full border border-line bg-surface/70 p-2 backdrop-blur-xl"
        >
          <a
            href={home ? '#inicio' : '/'}
            className="flex items-center gap-2 rounded-full pr-3 transition duration-300 ease-soft hover:opacity-80"
          >
            <Logo />
            <span className="hidden text-sm font-semibold min-[360px]:inline">{profile.name}</span>
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {nav.map((item) => {
              const isActive = active === item.id
              return (
                <li key={item.id}>
                  <a
                    href={href(item.id)}
                    aria-current={isActive ? 'location' : undefined}
                    className={`block rounded-full px-3 py-2 text-sm transition duration-300 ease-soft ${
                      isActive ? 'bg-surface-2 text-fg' : 'text-muted hover:bg-surface-2/60 hover:text-fg'
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              )
            })}
          </ul>

          <a href={`mailto:${profile.email}`} className={`${buttonClass('primary', 'sm')} ml-1`}>
            Contacto
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            className="relative grid size-8 place-items-center rounded-full bg-surface-2 transition duration-300 ease-soft hover:bg-line active:scale-[0.98] md:hidden"
          >
            <span
              className={`absolute h-0.5 w-4 rounded-full bg-fg transition-transform duration-500 ease-soft ${
                open ? 'rotate-45' : '-translate-y-1'
              }`}
            />
            <span
              className={`absolute h-0.5 w-4 rounded-full bg-fg transition-transform duration-500 ease-soft ${
                open ? '-rotate-45' : 'translate-y-1'
              }`}
            />
          </button>
        </nav>
      </header>

      <div
        id="mobile-menu"
        inert={!open}
        className={`fixed inset-0 z-40 bg-bg/90 backdrop-blur-2xl transition-opacity duration-500 ease-soft md:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <ul className="flex h-full flex-col justify-center gap-4 px-6">
          {[...nav, { id: 'contacto', label: 'Contacto' }].map((item, i) => (
            <li
              key={item.id}
              className={`transition duration-500 ease-soft ${open ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
              style={{ transitionDelay: open ? `${Math.min(i * 60, 400)}ms` : '0ms' }}
            >
              <a
                href={href(item.id)}
                onClick={() => setOpen(false)}
                aria-current={active === item.id ? 'location' : undefined}
                className={`block py-2 text-4xl font-semibold tracking-tight ${active === item.id ? 'text-fg' : 'text-muted'}`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
