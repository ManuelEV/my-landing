import { Plus } from '@phosphor-icons/react'
import { faq } from '../content'
import { Reveal } from './Reveal'

export function Faq() {
  return (
    <section id="preguntas" className="px-4 py-24 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.4fr]">
        <Reveal>
          <p className="font-mono text-sm text-accent">Preguntas</p>
          <h2 className="mt-3 max-w-[680px] text-4xl font-semibold tracking-tight sm:text-5xl">
            Lo que suelen preguntarme
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <ul className="flex flex-col gap-2">
            {faq.map((item) => (
              <li key={item.q}>
                <details className="group rounded-2xl border border-line bg-surface transition-colors duration-300 ease-soft open:bg-surface-2">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-6 py-4 text-base font-semibold transition-colors duration-300 ease-soft hover:text-white [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <Plus
                      size={16}
                      weight="bold"
                      aria-hidden="true"
                      className="shrink-0 text-muted transition-transform duration-500 ease-soft group-open:rotate-45"
                    />
                  </summary>
                  <p className="px-6 pb-6 text-base text-muted">{item.a}</p>
                </details>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
