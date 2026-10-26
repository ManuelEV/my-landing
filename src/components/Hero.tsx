import { EnvelopeSimple } from '@phosphor-icons/react'
import type { CSSProperties } from 'react'
import { hero, profile } from '../content'
import { useStory } from '../hooks/useStory'
import { ButtonLink } from './Button'

const rows = [
  { label: 'operación', nodes: ['Next.js', 'Spring Boot', 'Redis', 'Fusion'] },
  { label: 'réplica del ERP', nodes: ['Gateway', 'SQS', 'Lambda', 'MongoDB'] },
  { label: 'conocimiento', nodes: ['GitLab', 'Agentes', 'Embeddings', 'Neo4j'] },
]

// One pulse crosses each row in TRAVEL seconds, rows are offset so attention moves down the card
const CYCLE = 4.8
const TRAVEL = 3.2

export function Hero() {
  return (
    <section id="inicio" className="relative px-4 pt-24 pb-20 sm:px-6 md:pt-24">
      <div className="mx-auto flex max-w-5xl flex-col items-center pt-16 text-center">
        <p className="reveal is-in mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 font-mono text-xs text-muted">
          <span className="relative flex size-2">
            <span className="pulse-ring absolute inset-0 rounded-full bg-accent" />
            <span className="relative size-2 rounded-full bg-accent" />
          </span>
          {hero.eyebrow}
          <span className="hidden sm:inline">{hero.eyebrowPlace}</span>
        </p>

        <h1 className="text-gradient-hero max-w-[680px] text-3xl font-semibold tracking-tight min-[380px]:text-4xl sm:text-5xl lg:text-6xl">
          {hero.headline.map((line) => (
            <span key={line} className="block sm:whitespace-nowrap">
              {line}{' '}
            </span>
          ))}
        </h1>

        <p className="mt-6 max-w-[680px] text-lg text-muted">{hero.sub}</p>

        <div className="mt-8 flex flex-col items-center gap-3">
          <ButtonLink href={`mailto:${profile.email}`}>
            <EnvelopeSimple size={18} weight="bold" aria-hidden="true" />
            {hero.cta}
          </ButtonLink>
          <span className="font-mono text-xs text-subtle">{profile.email}</span>
        </div>

        <SystemCard />

        <div className="mt-12 flex flex-col items-center gap-4">
          <p className="text-sm text-subtle">{hero.proofLabel}</p>
          <ul className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {hero.companies.map((c) => (
              <li key={c} className="text-base font-semibold text-muted">
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/** Hero visual: three data flows I have built, with pulses crossing each one. */
function SystemCard() {
  const { ref, entered, paused } = useStory<HTMLDivElement>()

  return (
    <div
      ref={ref}
      data-paused={paused}
      className={`story card-in ${entered ? 'is-in' : ''} mt-16 w-full max-w-4xl rounded-2xl border border-line bg-surface p-2 text-left`}
    >
      <div className="flex items-center justify-between px-3 py-2">
        <span className="font-mono text-xs text-muted">sistemas en producción</span>
        <span className="flex items-center gap-2 font-mono text-xs text-subtle">
          <span className="relative flex size-2">
            <span className="pulse-ring helper absolute inset-0 rounded-full bg-accent" />
            <span className="relative size-2 rounded-full bg-accent" />
          </span>
          en vivo
        </span>
      </div>

      {/* outer rounded-2xl (16px) minus 8px padding gives the inner rounded-lg (8px) */}
      <div className="flex flex-col gap-6 rounded-lg border border-line bg-bg px-3 py-6 sm:px-6">
        {rows.map((row, r) => (
          <div key={row.label}>
            <p className="mb-2 font-mono text-xs text-subtle">{row.label}</p>
            <div className="relative overflow-hidden">
              {/* connector */}
              <div aria-hidden="true" className="absolute inset-x-0 top-1/2 h-px bg-line-strong" />
              {/* pulse: a full width track that translates by its own width */}
              <div
                aria-hidden="true"
                className="helper hero-pulse absolute inset-x-0 top-1/2"
                style={{ '--delay': `${r * 1.2}s` } as CSSProperties}
              >
                <span className="absolute -top-1 -left-2 block size-2 rounded-full bg-accent shadow-[0_0_12px_2px_rgba(242,181,68,0.6)]" />
              </div>
              <ol className="relative grid grid-cols-4 gap-2 sm:gap-6">
                {row.nodes.map((node, i) => (
                  <li
                    key={node}
                    className="relative rounded-lg border border-line-strong bg-surface-2 px-1 py-2 text-center font-mono text-xs text-fg sm:text-sm"
                  >
                    <span
                      aria-hidden="true"
                      className="helper hero-flash absolute -inset-px rounded-lg border border-accent"
                      style={{ '--delay': `${r * 1.2 + (TRAVEL * (i + 0.5)) / 4}s` } as CSSProperties}
                    />
                    {node}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .hero-pulse { opacity: 0; animation: hero-pulse ${CYCLE}s linear var(--delay) infinite; }
        .hero-flash { opacity: 0; animation: hero-flash ${CYCLE}s var(--ease-fade) var(--delay) infinite; }
        @keyframes hero-pulse {
          0% { transform: translateX(0); opacity: 0; }
          4% { opacity: 1; }
          ${((TRAVEL / CYCLE) * 100 - 4).toFixed(1)}% { opacity: 1; }
          ${((TRAVEL / CYCLE) * 100).toFixed(1)}%, 100% { transform: translateX(calc(100% + 16px)); opacity: 0; }
        }
        @keyframes hero-flash {
          0% { opacity: 0; }
          3% { opacity: 1; }
          22%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}
