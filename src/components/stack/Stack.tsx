import { useEffect, useRef, useState } from 'react'
import { stackGroups, stackMap, type StackGroup, type StackItem } from '../../content'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useStory } from '../../hooks/useStory'
import { LogoIcon } from '../experience/logos'
import { Reveal } from '../Reveal'

/*
 * Stack map. The core sits in the middle and three tilted orbits turn around
 * it, closer means more used. Orbits pause while the pointer is over them, and
 * hovering a technology or a legend entry lights its whole group. Phones get
 * the same rings as rows that drift sideways.
 */

export function Stack() {
  const wide = useMediaQuery('(min-width: 1024px)')
  // `hover` previews a group, `locked` keeps one after a click on the legend
  const [hover, setHover] = useState<StackGroup | null>(null)
  const [locked, setLocked] = useState<StackGroup | null>(null)
  const active = hover ?? locked

  return (
    <section id="stack" className="px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="font-mono text-sm text-accent">Stack</p>
          <h2 className="mt-3 max-w-[680px] text-4xl font-semibold tracking-tight sm:text-5xl">
            Tecnologías que uso en producción
          </h2>
          <p className="mt-4 max-w-[560px] text-lg text-muted">
            Al centro, lo que más uso y donde he puesto más énfasis. Hacia afuera, el resto del ecosistema.
          </p>
        </Reveal>

        {/* the map is visual; this list carries the same content for screen readers */}
        <ul className="sr-only">
          {[...stackMap.core, ...stackMap.rings.flat()].map((t) => (
            <li key={t.label}>{t.label}</li>
          ))}
        </ul>
        <div aria-hidden="true">{wide ? <Orbits active={active} onHover={setHover} /> : <Rows active={active} />}</div>

        <ul className="mt-8 flex flex-wrap justify-center gap-2" aria-label="Resaltar por área">
          {stackGroups.map((g) => {
            const on = active === g.id
            return (
              <li key={g.id}>
                <button
                  type="button"
                  aria-pressed={locked === g.id}
                  onClick={() => setLocked((v) => (v === g.id ? null : g.id))}
                  onMouseEnter={() => setHover(g.id)}
                  onMouseLeave={() => setHover(null)}
                  className={`flex items-center gap-2 rounded-full border px-3 py-1 text-sm transition duration-300 ease-soft active:scale-[0.98] ${
                    on ? 'border-accent text-fg' : 'border-line-strong text-muted hover:text-fg'
                  }`}
                >
                  <span className={`size-2 rounded-full transition-colors duration-300 ${on ? 'bg-accent' : 'bg-line-strong'}`} />
                  {g.label}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

/** One technology as a pill; `level` 0 is the core, 3 the outer ring. */
function Chip({ item, level, dim }: { item: StackItem; level: number; dim: boolean }) {
  const size = level === 0 ? 'px-4 py-2 text-base' : level === 3 ? 'px-3 py-1 text-xs' : 'px-3 py-1 text-sm'
  const tone =
    level === 0
      ? 'border-accent bg-surface-2 text-fg'
      : level === 1
        ? 'border-accent/50 bg-surface-2 text-fg'
        : level === 2
          ? 'border-line-strong bg-surface text-fg'
          : 'border-line bg-surface text-muted'
  return (
    <span
      className={`flex items-center gap-2 rounded-full border font-mono whitespace-nowrap transition-opacity duration-300 ${size} ${tone} ${
        dim ? 'opacity-20' : ''
      }`}
    >
      {item.logo && <LogoIcon id={item.logo} size={level === 0 ? 18 : level === 3 ? 12 : 14} />}
      {item.label}
    </span>
  )
}

/* ---------- Wide screens: tilted orbits ---------- */

const RINGS = [
  { f: 0.36, speed: 0.07 },
  { f: 0.68, speed: -0.045 },
  { f: 1, speed: 0.03 },
]
const TILT = 0.48 // vertical radius as a share of the horizontal one

function Orbits({ active, onHover }: { active: StackGroup | null; onHover: (g: StackGroup | null) => void }) {
  const { ref, entered, paused } = useStory<HTMLDivElement>()
  const reduced = useReducedMotion()
  const itemRefs = useRef<(HTMLDivElement | null)[][]>(RINGS.map(() => []))
  const [width, setWidth] = useState(0)
  const hovering = useRef(false)

  const rx = Math.max(0, width / 2 - 80)
  const ry = rx * TILT
  const height = Math.round(2 * ry + 110)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])

  useEffect(() => {
    if (!width) return
    let frame = 0
    let last = performance.now()
    let t = 0
    let speed = 1
    const place = () => {
      stackMap.rings.forEach((ring, k) => {
        const { f, speed: w } = RINGS[k]
        ring.forEach((_, i) => {
          const el = itemRefs.current[k][i]
          if (!el) return
          const a = (i / ring.length) * Math.PI * 2 + t * w + k * 0.6
          const x = Math.cos(a) * rx * f
          const y = Math.sin(a) * ry * f
          // front of the orbit (bottom) is closer: larger, brighter and on top
          const depth = (Math.sin(a) + 1) / 2
          el.style.transform = `translate(-50%, -50%) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${(0.82 + 0.18 * depth).toFixed(3)})`
          el.style.opacity = (0.45 + 0.55 * depth).toFixed(2)
          el.style.zIndex = String(Math.round(depth * 20) + k)
        })
      })
    }
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      // ease the spin down while the pointer is over the map, and back up after
      speed += ((hovering.current ? 0 : 1) - speed) * Math.min(1, dt * 4)
      t += dt * speed
      place()
      frame = requestAnimationFrame(tick)
    }
    place()
    if (!paused && !reduced) frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [width, rx, ry, paused, reduced])

  return (
    <div
      ref={ref}
      data-paused={paused}
      onMouseEnter={() => (hovering.current = true)}
      onMouseLeave={() => {
        hovering.current = false
        onHover(null)
      }}
      className={`story card-in ${entered ? 'is-in' : ''} relative mt-12`}
      style={{ height: height || 520 }}
    >
      {/* orbit lines */}
      <svg className="pointer-events-none absolute inset-0 size-full" aria-hidden="true">
        {RINGS.map(({ f }) => (
          <ellipse key={f} cx="50%" cy="50%" rx={rx * f} ry={ry * f} fill="none" stroke="#272727" strokeWidth={1.5} strokeDasharray="4 8" />
        ))}
        <ellipse cx="50%" cy="50%" rx={rx * 0.2} ry={ry * 0.2} fill="#f2b544" opacity={0.06} />
      </svg>

      {stackMap.rings.map((ring, k) =>
        ring.map((item, i) => (
          <div
            key={item.label}
            ref={(el) => {
              itemRefs.current[k][i] = el
            }}
            className="absolute top-1/2 left-1/2"
            onMouseEnter={() => onHover(item.group)}
            onMouseLeave={() => onHover(null)}
          >
            <Chip item={item} level={k + 1} dim={!!active && active !== item.group} />
          </div>
        )),
      )}

      {/* the core */}
      <div className="absolute top-1/2 left-1/2 z-50 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2">
        {stackMap.core.map((item) => (
          <div key={item.label} onMouseEnter={() => onHover(item.group)} onMouseLeave={() => onHover(null)}>
            <Chip item={item} level={0} dim={!!active && active !== item.group} />
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------- Phones: the core on top, each ring as a row drifting sideways ---------- */

function Rows({ active }: { active: StackGroup | null }) {
  const { ref, entered, paused } = useStory<HTMLDivElement>()
  const reduced = useReducedMotion()

  return (
    <div ref={ref} data-paused={paused} className={`story card-in ${entered ? 'is-in' : ''} mt-12 flex flex-col gap-3`}>
      <div className="flex flex-wrap justify-center gap-2">
        {stackMap.core.map((item) => (
          <Chip key={item.label} item={item} level={0} dim={!!active && active !== item.group} />
        ))}
      </div>
      {stackMap.rings.map((ring, k) =>
        reduced ? (
          <div key={k} className="flex flex-wrap justify-center gap-2">
            {ring.map((item) => (
              <Chip key={item.label} item={item} level={k + 1} dim={!!active && active !== item.group} />
            ))}
          </div>
        ) : (
          <div key={k} className="marquee-mask overflow-hidden">
            {/* the list twice, so the row can loop by moving half its width */}
            <div
              className="marquee flex w-max gap-2"
              style={{ animationDuration: `${ring.length * 5}s`, animationDirection: k % 2 ? 'reverse' : 'normal' }}
            >
              {[...ring, ...ring].map((item, i) => (
                <span key={i}>
                  <Chip item={item} level={k + 1} dim={!!active && active !== item.group} />
                </span>
              ))}
            </div>
          </div>
        ),
      )}
    </div>
  )
}
