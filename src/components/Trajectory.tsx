import type { CSSProperties } from 'react'
import { trajectory } from '../content'
import { useStory } from '../hooks/useStory'

// Seconds the comet takes from one stop to the next
const STEP = 0.6

const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

function parse(ym?: string): [number, number] {
  if (!ym) {
    const now = new Date()
    return [now.getFullYear(), now.getMonth() + 1]
  }
  const [y, m] = ym.split('-').map(Number)
  return [y, m]
}

const fmt = (ym: string) => {
  const [y, m] = parse(ym)
  return `${months[m - 1]} ${y}`
}

/**
 * Career timeline in the hero. Once in view, a comet travels the line and
 * lights each stop as it arrives, ending on today's job. Role and dates show
 * on hover. Phones stack it newest first, like a CV, so the comet rises from
 * the oldest stop at the bottom and the role shows inline.
 */
export function Trajectory() {
  const { ref, paused } = useStory<HTMLOListElement>()
  const { stops } = trajectory
  const last = stops.length - 1

  return (
    <ol
      ref={ref}
      data-paused={paused}
      className="story mx-auto mt-8 flex w-fit flex-col-reverse text-left sm:grid sm:w-full sm:grid-cols-[repeat(var(--n),minmax(0,1fr))] sm:text-center"
      style={{ '--n': stops.length, '--step': `${STEP}s` } as CSSProperties}
    >
      {stops.map((s, i) => {
        const current = i === last
        const period = `${fmt(s.from)} → ${s.to ? fmt(s.to) : trajectory.current.toLowerCase()}`
        return (
          <li
            key={s.company}
            tabIndex={0}
            className="group relative rounded-lg pb-6 first:pb-0 sm:px-2 sm:pb-0"
            style={{ '--d': `${i * STEP}s` } as CSSProperties}
          >
            {/* phones: the segment from the previous stop, which sits below, up to this one */}
            {i > 0 && (
              <span
                aria-hidden="true"
                className="trajectory-up absolute top-3 -bottom-3 left-[5.5px] w-px bg-line sm:hidden"
                style={{ '--d': `${(i - 1) * STEP}s` } as CSSProperties}
              >
                <span className="trajectory-fill absolute inset-0 origin-bottom bg-accent/50" />
                <span className="trajectory-comet absolute size-1.5 rounded-full bg-accent shadow-[0_0_12px_4px] shadow-accent/60" />
              </span>
            )}
            {/* wider screens: the segment from this stop to the next one on the right */}
            {i < last && (
              <span
                aria-hidden="true"
                className="trajectory-right absolute top-[5.5px] left-1/2 hidden h-px w-full bg-line sm:block"
              >
                <span className="trajectory-fill absolute inset-0 origin-left bg-accent/50" />
                <span className="trajectory-comet absolute size-1.5 rounded-full bg-accent shadow-[0_0_12px_4px] shadow-accent/60" />
              </span>
            )}

            <div className="flex gap-4 sm:flex-col sm:items-center sm:gap-3">
              <span className="relative mt-1.5 flex size-3 shrink-0 sm:mt-0">
                <span aria-hidden="true" className="trajectory-ping absolute inset-0 rounded-full bg-accent" />
                {current && <span aria-hidden="true" className="trajectory-pulse pulse-ring absolute inset-0 rounded-full bg-accent" />}
                <span
                  className={`trajectory-dot relative size-3 rounded-full border transition-[scale] duration-300 ease-soft group-hover:scale-130 ${
                    current ? 'border-accent bg-accent' : 'border-muted bg-muted'
                  }`}
                />

                {/* role and dates on wider screens; kept in the DOM so screen readers get them */}
                <span className="pointer-events-none absolute bottom-full left-1/2 mb-3 hidden -translate-x-1/2 translate-y-1 rounded-lg border border-line-strong bg-surface-2 px-3 py-2 text-left whitespace-nowrap opacity-0 transition duration-300 ease-soft group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 sm:block">
                  <span className="block text-sm text-fg">{s.role}</span>
                  <span className="block font-mono text-xs text-subtle">{period}</span>
                </span>
              </span>

              <span className="trajectory-label flex flex-col">
                <span className="font-mono text-xs text-subtle">
                  {parse(s.from)[0]}
                  {current && <span className="text-accent"> · {trajectory.current}</span>}
                </span>
                <span
                  className={`text-base font-medium transition-colors duration-300 ease-soft group-hover:text-fg sm:text-lg ${
                    current ? 'text-fg' : 'text-muted'
                  }`}
                >
                  {s.company}
                </span>
                <span className={`font-mono text-xs ${current ? 'text-accent' : 'text-subtle'}`}>{s.kicker}</span>
                <span className="mt-1 text-xs text-subtle sm:hidden">
                  {s.role}
                </span>
              </span>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
