import { stats } from '../content'
import { Reveal } from './Reveal'

export function Stats() {
  return (
    <section aria-label="Resultados" className="px-4 py-20 sm:px-6">
      <ul className="mx-auto grid max-w-6xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal as="li" key={s.label} delay={i * 80} className="rounded-2xl border border-line bg-surface p-6">
            <p className="font-mono text-5xl font-semibold tracking-tight text-fg">{s.value}</p>
            <p className="mt-4 text-base font-semibold text-fg">{s.label}</p>
            <p className="mt-2 text-sm text-muted">{s.detail}</p>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}
