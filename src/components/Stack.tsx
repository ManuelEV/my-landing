import { stack } from '../content'
import { Reveal } from './Reveal'

export function Stack() {
  return (
    <section id="stack" className="px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="font-mono text-sm text-accent">Stack</p>
          <h2 className="mt-3 max-w-[680px] text-4xl font-semibold tracking-tight sm:text-5xl">
            Herramientas que uso en producción
          </h2>
        </Reveal>
        <Reveal delay={80} className="mt-12 overflow-hidden rounded-2xl border border-line bg-surface">
          <dl className="divide-y divide-line">
            {stack.map((g) => (
              <div key={g.group} className="grid gap-3 p-6 md:grid-cols-[200px_1fr] md:items-center">
                <dt className="text-base font-semibold">{g.group}</dt>
                <dd>
                  <ul className="flex flex-wrap gap-2">
                    {g.items.map((it) => (
                      <li
                        key={it}
                        className="rounded-full border border-line-strong bg-surface-2 px-3 py-1 font-mono text-sm text-muted transition duration-300 ease-soft hover:border-muted hover:text-fg"
                      >
                        {it}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  )
}
