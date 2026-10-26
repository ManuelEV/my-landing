import { ChartLineUp, GitFork, Robot } from '@phosphor-icons/react'
import { process } from '../content'
import { Reveal } from './Reveal'

const icons = [ChartLineUp, GitFork, Robot]

export function Process() {
  return (
    <section aria-labelledby="como-trabajo" className="px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="font-mono text-sm text-accent">Cómo trabajo</p>
          <h2 id="como-trabajo" className="mt-3 max-w-[680px] text-4xl font-semibold tracking-tight sm:text-5xl">
            Tres hábitos que repito en cada proyecto
          </h2>
        </Reveal>
        <ol className="mt-12 grid gap-3 md:grid-cols-3">
          {process.map((step, i) => {
            const Icon = icons[i]
            return (
              <Reveal as="li" key={step.title} delay={i * 80} className="rounded-2xl border border-line bg-surface p-6">
                <div className="flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-lg bg-surface-2 text-accent">
                    <Icon size={20} weight="duotone" aria-hidden="true" />
                  </span>
                  <span className="font-mono text-sm text-subtle">0{i + 1}</span>
                </div>
                <h3 className="mt-6 text-xl font-semibold tracking-tight">{step.title}</h3>
                <p className="mt-2 text-base text-muted">{step.body}</p>
              </Reveal>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
