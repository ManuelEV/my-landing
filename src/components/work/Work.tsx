import type { CSSProperties, ReactNode } from 'react'
import { work } from '../../content'
import { useStory } from '../../hooks/useStory'
import { Reveal } from '../Reveal'
import { AgentsVisual, CatalogVisual, KnowledgeVisual, OrdersVisual, SpecsVisual } from './visuals'
import './work.css'

type Item = { title: string; body: string; tags: string[] }

const cards: { item: Item; visual: ReactNode; wide?: boolean }[] = [
  { item: work.knowledge, visual: <KnowledgeVisual />, wide: true },
  { item: work.specs, visual: <SpecsVisual /> },
  { item: work.agents, visual: <AgentsVisual /> },
  { item: work.orders, visual: <OrdersVisual /> },
  { item: work.catalog, visual: <CatalogVisual /> },
]

export function Work() {
  return (
    <section id="proyectos" className="px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="font-mono text-sm text-accent">Proyectos</p>
          <h2 className="mt-3 max-w-[680px] text-4xl font-semibold tracking-tight sm:text-5xl">
            Plataformas que hoy usan equipos reales
          </h2>
          <p className="mt-4 max-w-[560px] text-lg text-muted">
            Una selección de lo que diseñé y desarrollé en Forus, desde la operación de retail hasta la IA aplicada al
            desarrollo.
          </p>
        </Reveal>

        <ul className="mt-12 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ item, visual, wide }, i) => (
            <Card key={item.title} item={item} wide={wide} index={i}>
              {visual}
            </Card>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Card({ item, wide, index, children }: { item: Item; wide?: boolean; index: number; children: ReactNode }) {
  const { ref, entered, paused } = useStory<HTMLLIElement>()
  return (
    <li
      ref={ref}
      data-paused={paused}
      // cards rise in reading order, 80ms apart within a row
      style={{ '--d': `${(index % 3) * 80}ms` } as CSSProperties}
      className={`story card-in ${entered ? 'is-in' : ''} flex min-w-0 flex-col rounded-2xl border border-line bg-surface p-2 ${
        wide ? 'md:col-span-2' : ''
      }`}
    >
      {/* 16px outer radius minus 8px padding */}
      <div className="h-64 overflow-hidden rounded-lg border border-line bg-bg">{children}</div>
      <div className="flex flex-1 flex-col px-4 pt-6 pb-4">
        <h3 className="text-xl font-semibold tracking-tight">{item.title}</h3>
        <p className="mt-2 text-sm text-muted">{item.body}</p>
        <ul className="mt-auto flex flex-wrap gap-2 pt-4">
          {item.tags.map((t) => (
            <li key={t} className="rounded-full border border-line-strong px-2 py-1 font-mono text-xs text-muted">
              {t}
            </li>
          ))}
        </ul>
      </div>
    </li>
  )
}
