import { useEffect, useMemo, useRef, useState } from 'react'
import { experience } from '../../content'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { Reveal } from '../Reveal'
import { LogoIcon } from './logos'
import { sceneArt } from './scenes'

/*
 * Scroll world, after oso95/scroll-world: scroll drives a camera that dives
 * into each scene, pulls out and flies along the connector to the next one,
 * with no cuts. Instead of scrubbing pre rendered video, the camera moves a
 * vector world by rewriting the SVG viewBox, so it stays sharp at any zoom.
 * Each scene is an animated diagram of one kind of system I build.
 */

const N = experience.length
const SEG = 1 / N

// Where each scene sits in the world, and the visual center of its art
const centers: [number, number][] = [
  [500, 620],
  [1450, 420],
  [2400, 660],
  [3350, 440],
  [4300, 620],
]
const ART_DY = -70 // art rises above its platform center
const FIT_W = 760
const FIT_H = 640

// Hold window of each scene in progress units: dive in, hold, fly out
const holdStart = (i: number) => (i === 0 ? 0.12 : i + 0.18) * SEG
const holdEnd = (i: number) => (i === N - 1 ? N : i + 0.68) * SEG

type Cam = [x: number, y: number, zoom: number]

// Keyframes: wide establishing shot, then hold, pull out over the midpoint, dive into the next
const keys: [number, Cam][] = (() => {
  const k: [number, Cam][] = []
  const at = (i: number): [number, number] => [centers[i][0], centers[i][1] + ART_DY]
  k.push([0, [...at(0), 0.55]])
  for (let i = 0; i < N; i++) {
    k.push([holdStart(i), [...at(i), 1]])
    k.push([holdEnd(i), [...at(i), 1.08]])
    if (i < N - 1) {
      const [x0, y0] = at(i)
      const [x1, y1] = at(i + 1)
      k.push([(holdEnd(i) + holdStart(i + 1)) / 2, [(x0 + x1) / 2, (y0 + y1) / 2 - 60, 0.42]])
    }
  }
  return k
})()

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

// Eased keyframe track, as in design-to-motion
function track(t: number): Cam {
  if (t <= keys[0][0]) return keys[0][1]
  for (let i = 1; i < keys.length; i++) {
    const [t1, v1] = keys[i]
    const [t0, v0] = keys[i - 1]
    if (t <= t1) {
      const k = easeInOut(Math.min(1, (t - t0) / (t1 - t0 || 1)))
      return v0.map((v, j) => v + (v1[j] - v) * k) as Cam
    }
  }
  return keys[keys.length - 1][1]
}

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v))

function connectorPath(i: number) {
  const [x0, y0] = centers[i]
  const [x1, y1] = centers[i + 1]
  const dx = (x1 - x0) * 0.5
  return `M${x0},${y0 + 150} C${x0 + dx},${y0 + 260} ${x1 - dx},${y1 + 260} ${x1},${y1 + 150}`
}

export function Experience() {
  const reduced = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const litRefs = useRef<(SVGPathElement | null)[]>([])
  const pathRefs = useRef<(SVGPathElement | null)[]>([])
  const travelerRef = useRef<SVGGElement>(null)
  const [active, setActive] = useState(0)
  const [onScreen, setOnScreen] = useState(false)

  const paths = useMemo(() => Array.from({ length: N - 1 }, (_, i) => connectorPath(i)), [])

  useEffect(() => {
    let frame = 0
    let lastActive = -1

    const update = () => {
      frame = 0
      const section = sectionRef.current
      const stage = stageRef.current
      const svg = svgRef.current
      if (!section || !stage || !svg) return

      const vh = window.innerHeight
      const rect = section.getBoundingClientRect()
      const p = clamp(-rect.top / (rect.height - vh))
      const idx = Math.min(N - 1, Math.floor(p / SEG + 0.08))
      if (idx !== lastActive) {
        lastActive = idx
        setActive(idx)
      }

      // Camera: with reduced motion it cuts straight to the active scene
      const [cx, cy, zoom] = reduced
        ? [centers[idx][0], centers[idx][1] + ART_DY, 1]
        : track(p)

      // The free area is the part of the stage not covered by the text card
      const cw = stage.clientWidth
      const ch = stage.clientHeight
      const wide = cw >= 768
      const fx0 = wide ? Math.min(456, cw * 0.4) : 0
      const fy0 = wide ? 0 : 72
      const fw = cw - fx0
      const fh = wide ? ch : ch * 0.56 - fy0
      if (fw <= 0 || fh <= 0) return
      // phones get a tighter fit: the stage is narrow and the card sits below the scene
      const scale = Math.min(fw / (wide ? FIT_W : FIT_W * 0.8), fh / FIT_H) * zoom
      const vw = cw / scale
      const vhh = ch / scale
      const vx = cx - (fx0 + fw / 2) / scale
      const vy = cy - (fy0 + fh / 2) / scale
      svg.setAttribute('viewBox', `${vx.toFixed(1)} ${vy.toFixed(1)} ${vw.toFixed(1)} ${vhh.toFixed(1)}`)

      // Connectors light up behind a traveler that rides them between scenes
      let tx = centers[idx][0]
      let ty = centers[idx][1] + 150
      for (let i = 0; i < N - 1; i++) {
        const f = reduced ? (i < idx ? 1 : 0) : clamp((p - holdEnd(i)) / (holdStart(i + 1) - holdEnd(i)))
        litRefs.current[i]?.setAttribute('stroke-dashoffset', String(1 - f))
        const path = pathRefs.current[i]
        if (!reduced && path && f > 0 && f < 1) {
          const pt = path.getPointAtLength(easeInOut(f) * path.getTotalLength())
          tx = pt.x
          ty = pt.y
        }
      }
      travelerRef.current?.setAttribute('transform', `translate(${tx.toFixed(1)},${ty.toFixed(1)})`)
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [reduced])

  // Scene loops only run while the stage is on screen; reduced motion rests them on the finished diagram
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting))
    io.observe(stage)
    return () => io.disconnect()
  }, [])

  const paused = reduced || !onScreen

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

  const goTo = (i: number) => {
    const section = sectionRef.current
    if (!section) return
    const travel = section.offsetHeight - window.innerHeight
    const p = (holdStart(i) + Math.min(holdEnd(i), 1)) / 2
    window.scrollTo({ top: section.offsetTop + p * travel, behavior: reduced ? 'auto' : 'smooth' })
  }

  const scene = experience[active]

  return (
    <div id="experiencia">
      <header className="mx-auto max-w-6xl px-4 pt-24 pb-12 sm:px-6">
        <Reveal>
          <p className="font-mono text-sm text-accent">Experiencia</p>
          <h2 className="mt-3 max-w-[680px] text-4xl font-semibold tracking-tight sm:text-5xl">
            Arquitecturas que he diseñado y llevado a producción
          </h2>
          <p className="mt-4 max-w-[560px] text-lg text-muted">
            Cinco tipos de sistema en los que tengo experiencia real, cada uno dibujado como funciona. Sigue bajando para
            recorrerlos.
          </p>
        </Reveal>
      </header>

      <section
        ref={sectionRef}
        aria-label="Recorrido por mi experiencia"
        className="relative"
        style={{ height: `${N * 100 + 40}vh` }}
      >
        <div ref={stageRef} data-paused={paused} className="story sticky top-0 h-dvh overflow-hidden bg-olive">
          <svg ref={svgRef} className="absolute inset-0 size-full" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
            <defs>
              <pattern id="dots" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.6" fill="#2a2a20" />
              </pattern>
            </defs>
            <rect x={-2000} y={-2000} width={9000} height={5000} fill="url(#dots)" />

            {paths.map((d, i) => (
              <g key={i}>
                <path d={d} fill="none" stroke="#313131" strokeWidth={3} className="marching" />
                <path
                  ref={(el) => {
                    pathRefs.current[i] = el
                  }}
                  d={d}
                  fill="none"
                  stroke="none"
                />
                <path
                  ref={(el) => {
                    litRefs.current[i] = el
                  }}
                  d={d}
                  fill="none"
                  stroke="#f2b544"
                  strokeWidth={3}
                  pathLength={1}
                  strokeDasharray="1 1"
                  strokeDashoffset={1}
                />
              </g>
            ))}

            {experience.map((s, i) => {
              const Art = sceneArt[s.id]
              return (
                <g key={s.id} transform={`translate(${centers[i][0]},${centers[i][1]})`}>
                  <Art />
                  <text
                    y={230}
                    textAnchor="middle"
                    fontSize={16}
                    className="font-mono"
                    fill={i === active ? '#f4f4f2' : '#6e6e6e'}
                  >
                    {String(i + 1).padStart(2, '0')} {s.label}
                  </text>
                </g>
              )
            })}

            <g ref={travelerRef}>
              <circle r={14} fill="#f2b544" opacity={0.2} />
              <circle r={7} fill="#f2b544" />
            </g>
          </svg>

          <div className="absolute inset-x-4 bottom-4 md:inset-x-auto md:top-1/2 md:bottom-auto md:left-6 md:w-96 md:-translate-y-1/2">
            <div className="rounded-2xl border border-line bg-surface/85 p-4 backdrop-blur-xl sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-xs text-subtle">
                  {String(active + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
                </span>
                <ol className="flex gap-1" aria-label="Escenas">
                  {experience.map((s, i) => (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => goTo(i)}
                        aria-label={`Ir a ${s.title}`}
                        aria-current={i === active ? 'step' : undefined}
                        className="group grid size-6 place-items-center rounded-full"
                      >
                        <span
                          className={`block h-2 rounded-full transition duration-500 ease-soft ${
                            i === active ? 'w-4 bg-accent' : 'w-2 bg-line-strong group-hover:bg-muted'
                          }`}
                        />
                      </button>
                    </li>
                  ))}
                </ol>
              </div>

              <div key={scene.id} aria-hidden="true" style={reduced ? undefined : { animation: 'rise-in 600ms var(--ease-soft) both' }}>
                <p className="font-mono text-xs text-accent">{scene.kicker}</p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">{scene.title}</h3>
                <p className="mt-3 text-sm text-muted sm:text-base">{scene.summary}</p>
                <ul className="mt-4 hidden flex-col gap-2 sm:flex">
                  {scene.points.map((pt) => (
                    <li key={pt} className="flex gap-2 text-sm text-fg">
                      <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
                      {pt}
                    </li>
                  ))}
                </ul>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {scene.stack.map((t, i) => (
                    <li
                      key={t.label}
                      // phones show the first four so the card leaves room for the scene
                      className={`${i > 3 ? 'hidden sm:flex' : 'flex'} items-center gap-1 rounded-full border border-line-strong bg-surface-2 px-2 py-1 font-mono text-xs text-fg`}
                    >
                      {t.logo && <LogoIcon id={t.logo} size={14} />}
                      {t.label}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 hidden text-xs text-subtle sm:block">Aplicado en {scene.where}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full text for readers and crawlers; the stage above is decorative */}
      <ol className="sr-only">
        {experience.map((s) => (
          <li key={s.id}>
            {s.title}. {s.summary} {s.points.join('. ')}. Tecnologías: {s.stack.map((t) => t.label).join(', ')}. Aplicado
            en {s.where}.
          </li>
        ))}
      </ol>
    </div>
  )
}
