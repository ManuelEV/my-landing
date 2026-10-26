import { ArrowDown, Barbell, PuzzlePiece, Robot, ShoppingCart, Sparkle } from '@phosphor-icons/react'
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { showcase, showcaseTitle } from '../../content'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useStory } from '../../hooks/useStory'
import { showScenes, type Cam, type ShowScene } from './scenes'

const icons = { eventos: ShoppingCart, integraciones: PuzzlePiece, optimizaciones: Barbell, agentes: Robot, legacy: Sparkle }

/**
 * Hero showcase: isometric stories in tabs. The tabs advance on their
 * own, one full loop each, until the visitor picks one. On phones the
 * camera follows the action instead of shrinking the whole scene, and only
 * the active tab shows its name.
 */
export function Showcase() {
  const { ref, entered, paused } = useStory<HTMLDivElement>()
  const reduced = useReducedMotion()
  const [active, setActive] = useState(0)
  const [auto, setAuto] = useState(true)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const listRef = useRef<HTMLDivElement>(null)
  const autoplay = auto && !reduced
  const tab = showcase[active]
  const scene = showScenes[tab.id]

  // Keep the active tab in view when the row scrolls sideways (narrow screens)
  useEffect(() => {
    const list = listRef.current
    const el = tabRefs.current[active]
    if (!list || !el || list.scrollWidth <= list.clientWidth) return
    list.scrollTo({ left: el.offsetLeft - list.clientWidth / 2 + el.clientWidth / 2, behavior: reduced ? 'auto' : 'smooth' })
  }, [active, reduced])

  const select = (i: number) => {
    setActive(i)
    setAuto(false)
  }

  const onKey = (e: KeyboardEvent) => {
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!step) return
    e.preventDefault()
    const next = (active + step + showcase.length) % showcase.length
    select(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <div className="mt-16 w-full max-w-4xl">
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{showcaseTitle}</h2>
      <div
        ref={ref}
        data-paused={paused}
        className={`story card-in ${entered ? 'is-in' : ''} mt-6 w-full rounded-2xl border border-line bg-surface p-2 text-left`}
      >
        <div className="flex items-center justify-between gap-2 px-1 pb-2 sm:px-2">
          <div
            ref={listRef}
            role="tablist"
            aria-label="Ejemplos de sistemas"
            onKeyDown={onKey}
            className="flex min-w-0 gap-1 overflow-x-auto [scrollbar-width:none]"
          >
            {showcase.map((t, i) => {
              const Icon = icons[t.id]
              const on = i === active
              return (
                <button
                  key={t.id}
                  ref={(el) => {
                    tabRefs.current[i] = el
                  }}
                  type="button"
                  role="tab"
                  id={`tab-${t.id}`}
                  aria-selected={on}
                  aria-controls={`panel-${t.id}`}
                  aria-label={t.label}
                  tabIndex={on ? 0 : -1}
                  onClick={() => select(i)}
                  className={`relative flex shrink-0 items-center gap-2 overflow-hidden rounded-full px-3 py-2 text-sm transition duration-300 ease-soft active:scale-[0.98] ${
                    on ? 'bg-surface-2 text-fg' : 'text-muted hover:bg-surface-2/60 hover:text-fg'
                  }`}
                >
                  <Icon size={16} weight={on ? 'fill' : 'regular'} aria-hidden="true" className={on ? 'text-accent' : ''} />
                  <span className={on ? 'md:hidden' : 'hidden'}>{t.short}</span>
                  <span className={on ? 'hidden md:inline' : 'hidden lg:inline'}>{t.label}</span>
                  {on && autoplay && (
                    <span
                      key={active}
                      aria-hidden="true"
                      className="tab-progress absolute inset-x-3 bottom-1 h-0.5 rounded-full bg-accent"
                      style={{ animationDuration: `${scene.dur}s` }}
                      onAnimationEnd={() => setActive((a) => (a + 1) % showcase.length)}
                    />
                  )}
                </button>
              )
            })}
          </div>
          <span className="hidden shrink-0 items-center gap-2 pr-2 font-mono text-xs text-subtle lg:flex">
            <span className="relative flex size-2">
              <span className="pulse-ring helper absolute inset-0 rounded-full bg-accent" />
              <span className="relative size-2 rounded-full bg-accent" />
            </span>
            en vivo
          </span>
        </div>

        {/* outer rounded-2xl (16px) minus 8px padding gives the inner rounded-lg (8px) */}
        <div
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          className="relative overflow-hidden rounded-lg border border-line bg-olive"
        >
          <div key={tab.id} className={reduced ? undefined : 'scene-in'}>
            <Stage scene={scene} paused={paused} />
          </div>
          {/* name of the architecture on show; the frames leave room for it at the top */}
          <h3
            key={`t-${tab.id}`}
            className={`absolute top-3 left-3 rounded-full border border-line bg-surface/85 px-3 py-1 font-mono text-xs text-accent backdrop-blur-xl sm:text-sm ${
              reduced ? '' : 'scene-in'
            }`}
          >
            {tab.title}
          </h3>
        </div>

        <div className="flex flex-col gap-3 px-2 pt-4 pb-2 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <p key={tab.id} className={`max-w-[560px] text-sm text-muted ${reduced ? '' : 'scene-in'}`}>
            {tab.caption}
          </p>
          <a
            href="#experiencia"
            className="flex shrink-0 items-center gap-1 text-sm text-fg transition-colors duration-300 ease-soft hover:text-accent"
          >
            Ver en detalle
            <ArrowDown size={14} aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  )
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

/** Camera position at a point of the loop; the last stop eases back to the first. */
function camAt(cams: Cam[], t: number): [number, number] {
  const track: Cam[] = [...cams, [1, cams[0][1], cams[0][2]]]
  for (let i = 1; i < track.length; i++) {
    const [t1, x1, y1] = track[i]
    const [t0, x0, y0] = track[i - 1]
    if (t <= t1) {
      const k = easeInOut(Math.min(1, Math.max(0, (t - t0) / (t1 - t0 || 1))))
      return [x0 + (x1 - x0) * k, y0 + (y1 - y0) * k]
    }
  }
  return [cams[0][1], cams[0][2]]
}

// World width the phone camera shows; the stage there is square
const PHONE_VIEW = 440

function Stage({ scene, paused }: { scene: ShowScene; paused: boolean }) {
  const svgRef = useRef<SVGSVGElement>(null)
  const narrow = useMediaQuery('(max-width: 639px)')
  const reduced = useReducedMotion()
  const [vx, vy, vw, vh] = scene.view
  const follow = narrow && !reduced

  // A new scene starts its story from the beginning
  useEffect(() => {
    svgRef.current?.setCurrentTime(0)
  }, [])

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    if (paused) {
      svg.pauseAnimations()
      if (reduced) svg.setCurrentTime(0)
    } else {
      svg.unpauseAnimations()
    }
  }, [paused, reduced])

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    if (!follow) {
      svg.setAttribute('viewBox', `${vx} ${vy} ${vw} ${vh}`)
      return
    }
    let frame = 0
    const tick = () => {
      const t = (svg.getCurrentTime() % scene.dur) / scene.dur
      const [x, y] = camAt(scene.cams, t)
      const s = PHONE_VIEW
      svg.setAttribute('viewBox', `${(x - s / 2).toFixed(1)} ${(y - s / 2).toFixed(1)} ${s} ${s}`)
      if (!paused) frame = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(frame)
  }, [follow, paused, scene, vx, vy, vw, vh])

  return (
    <svg
      ref={svgRef}
      viewBox={`${vx} ${vy} ${vw} ${vh}`}
      className="block w-full"
      style={{ aspectRatio: follow ? '1 / 1' : `${vw} / ${vh}` }}
      aria-hidden="true"
    >
      <defs>
        <pattern id="showcase-dots" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.6" fill="#2a2a20" />
        </pattern>
      </defs>
      <rect x={-1000} y={-1000} width={2000} height={2000} fill="url(#showcase-dots)" />
      <scene.Art />
    </svg>
  )
}
