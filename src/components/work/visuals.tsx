import { CheckCircle, MagnifyingGlass } from '@phosphor-icons/react'
import { work } from '../../content'

const ACCENT = '#f2b544'

/** A pulse that travels a path once per cycle, between two fractions of the cycle. */
function Pulse({ d, dur, from, to, r = 4 }: { d: string; dur: number; from: number; to: number; r?: number }) {
  return (
    <circle r={r} fill={ACCENT} className="helper" opacity={0}>
      <animateMotion
        path={d}
        dur={`${dur}s`}
        repeatCount="indefinite"
        calcMode="linear"
        keyPoints="0;0;1;1"
        keyTimes={`0;${from};${to};1`}
      />
      <animate
        attributeName="opacity"
        dur={`${dur}s`}
        repeatCount="indefinite"
        values="0;0;1;1;0;0"
        keyTimes={`0;${from};${from + 0.01};${to - 0.01};${to};1`}
      />
    </circle>
  )
}

/** Accent outline that lights a node between two fractions of the cycle. */
function Glow({ x, y, w, h, dur, on, off, rx = 8 }: { x: number; y: number; w: number; h: number; dur: number; on: number; off: number; rx?: number }) {
  return (
    <rect x={x} y={y} width={w} height={h} rx={rx} fill="none" stroke={ACCENT} strokeWidth={2} opacity={0}>
      <animate
        attributeName="opacity"
        dur={`${dur}s`}
        repeatCount="indefinite"
        values="0;0;1;1;0;0"
        keyTimes={`0;${on};${on + 0.04};${off - 0.04};${off};1`}
      />
    </rect>
  )
}

function Node({ x, y, w, label, accent = false }: { x: number; y: number; w: number; label: string; accent?: boolean }) {
  return (
    <g>
      <rect x={x - w / 2} y={y - 15} width={w} height={30} rx={8} fill={accent ? ACCENT : '#1f1f1f'} stroke={accent ? 'none' : '#313131'} />
      <text x={x} y={y + 4} textAnchor="middle" fontSize={12} className="font-mono" fill={accent ? '#000' : '#f4f4f2'}>
        {label}
      </text>
    </g>
  )
}

/* ---------- Knowledge graph: a question finds the services that use a table ---------- */

export function KnowledgeVisual() {
  const DUR = 6
  const center = { x: 300, y: 122 }
  const services = [
    { label: 'OC API', x: 105, y: 70, hit: true },
    { label: 'Reportes', x: 105, y: 182, hit: true },
    { label: 'Fusion sync', x: 495, y: 70, hit: true },
    { label: 'Inventario', x: 495, y: 182, hit: false },
    { label: 'Productos', x: 300, y: 205, hit: false },
  ]
  const hits = services.filter((s) => s.hit)

  return (
    <div className="flex h-full flex-col">
      <div className="mx-3 mt-3 flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2 font-mono text-xs text-muted">
        <MagnifyingGlass size={14} aria-hidden="true" />
        <span className="min-w-0 truncate">{work.knowledge.query}</span>
      </div>
      <svg viewBox="0 0 600 230" className="min-h-0 w-full flex-1" aria-hidden="true">
        <g stroke="#313131" strokeWidth={1.5}>
          {services.map((s) =>
            s.hit ? <line key={s.label} x1={center.x} y1={center.y} x2={s.x} y2={s.y} /> : null,
          )}
          <line x1={495} y1={182} x2={300} y2={205} />
          <line x1={495} y1={182} x2={495} y2={70} strokeDasharray="4 4" />
        </g>
        {hits.map((s, i) => (
          <Pulse
            key={s.label}
            d={`M${center.x},${center.y} L${s.x},${s.y}`}
            dur={DUR}
            from={0.12 + i * 0.1}
            to={0.3 + i * 0.1}
          />
        ))}
        <Node x={center.x} y={center.y} w={132} label="tabla órdenes" accent />
        <circle cx={center.x + 66} cy={center.y - 15} r={4} fill={ACCENT} className="pulse-ring helper" />
        {services.map((s) => (
          <g key={s.label}>
            <Node x={s.x} y={s.y} w={112} label={s.label} />
          </g>
        ))}
        {hits.map((s, i) => (
          <Glow key={s.label} x={s.x - 58} y={s.y - 17} w={116} h={34} rx={10} dur={DUR} on={0.3 + i * 0.1} off={0.9} />
        ))}
      </svg>
    </div>
  )
}

/* ---------- Specs: the prompt is typed, the checks run, the spec appears ---------- */

export function SpecsVisual() {
  const { prompt, chips } = work.specs
  return (
    <div className="flex h-full flex-col gap-3 p-3">
      <div className="rounded-lg border border-line bg-surface px-3 py-2 font-mono text-xs text-fg">
        <span className="text-accent">&gt; </span>
        <span className="relative inline-block whitespace-nowrap align-bottom" style={{ width: `${prompt.length}ch` }}>
          <span className="spec-type block" style={{ ['--n' as string]: prompt.length }}>
            {prompt}
          </span>
          <span className="spec-caret helper absolute top-0 left-0 h-full w-px bg-accent" style={{ ['--n' as string]: prompt.length }} />
        </span>
      </div>
      <ul className="flex flex-wrap gap-2">
        {chips.map((c, i) => (
          <li
            key={c}
            className="spec-chip flex items-center gap-1 rounded-full border border-line-strong bg-surface-2 px-2 py-1 text-xs text-fg"
            style={{ animationDelay: `${i * 0.45}s` }}
          >
            <CheckCircle size={14} weight="fill" className="text-accent" aria-hidden="true" />
            {c}
          </li>
        ))}
      </ul>
      <div className="spec-doc flex-1 rounded-lg border border-line bg-surface p-3 font-mono text-xs">
        <p className="text-subtle">spec.md</p>
        <p className="mt-2 text-fg">Contexto: módulo de compras</p>
        <p className="text-muted">Integración: Fusion REST</p>
        <p className="text-muted">Criterios de aceptación: 4</p>
      </div>
    </div>
  )
}

/* ---------- Agents: an orchestrator hands work to agents, each with its own model ---------- */

export function AgentsVisual() {
  const DUR = 6
  const top = { x: 160, y: 40 }
  const agents = [
    { label: 'Análisis', model: 'liviano', x: 56 },
    { label: 'Código', model: 'código', x: 160 },
    { label: 'Revisión', model: 'razonamiento', x: 264 },
  ]
  const ay = 130
  const down = (x: number) => `M${top.x},${top.y + 15} C${top.x},${top.y + 60} ${x},${ay - 60} ${x},${ay - 15}`
  const up = (x: number) => `M${x},${ay - 15} C${x},${ay - 60} ${top.x},${top.y + 60} ${top.x},${top.y + 15}`

  return (
    <svg viewBox="0 0 320 210" className="size-full" aria-hidden="true">
      {agents.map((a) => (
        <path key={a.label} d={down(a.x)} fill="none" stroke="#313131" strokeWidth={1.5} />
      ))}
      {agents.map((a, i) => (
        <Pulse key={`d${a.label}`} d={down(a.x)} dur={DUR} from={0.05 + i * 0.18} to={0.18 + i * 0.18} />
      ))}
      {agents.map((a) => (
        <Pulse key={`u${a.label}`} d={up(a.x)} dur={DUR} from={0.68} to={0.8} />
      ))}
      <Node x={top.x} y={top.y} w={120} label="Orquestador" accent />
      {agents.map((a, i) => (
        <g key={a.label}>
          <Node x={a.x} y={ay} w={88} label={a.label} />
          <Glow x={a.x - 46} y={ay - 17} w={92} h={34} dur={DUR} on={0.18 + i * 0.18} off={0.72} rx={10} />
          <rect x={a.x - 48} y={ay + 26} width={96} height={22} rx={11} fill="none" stroke="#313131" />
          <text x={a.x} y={ay + 41} textAnchor="middle" fontSize={11} className="font-mono" fill="#9b9b9b">
            {a.model}
          </text>
        </g>
      ))}
      <Glow x={top.x - 62} y={top.y - 17} w={124} h={34} dur={DUR} on={0.8} off={0.96} rx={10} />
    </svg>
  )
}

/* ---------- Purchase orders: the slow path fills, the new path fills in a fifth of the time ---------- */

export function OrdersVisual() {
  return (
    <div className="flex h-full flex-col justify-center gap-6 p-6">
      <div className="flex items-baseline gap-2">
        <span className="orders-num font-mono text-5xl font-semibold tracking-tight text-fg">80%</span>
        <span className="text-sm text-muted">menos tiempo</span>
      </div>
      <div className="flex flex-col gap-3">
        <Bar label="Antes" width="100%" cls="orders-bar-a" muted />
        <Bar label="Ahora" width="20%" cls="orders-bar-b" />
      </div>
    </div>
  )
}

function Bar({ label, width, cls, muted = false }: { label: string; width: string; cls: string; muted?: boolean }) {
  return (
    <div>
      <p className="mb-1 font-mono text-xs text-subtle">{label}</p>
      <div className="h-3 rounded-full bg-surface-2">
        <div className={`${cls} h-full rounded-full ${muted ? 'bg-line-strong' : 'bg-accent'}`} style={{ width }} />
      </div>
    </div>
  )
}

/* ---------- Catalog: one upload is validated and published to every channel ---------- */

export function CatalogVisual() {
  const DUR = 6
  const src = { x: 70, y: 105 }
  const channels = work.catalog.channels.map((label, i) => ({ label, y: 36 + i * 46 }))
  const cx = 240
  const path = (y: number) => `M${src.x + 46},${src.y} C${src.x + 100},${src.y} ${cx - 100},${y} ${cx - 44},${y}`

  return (
    <svg viewBox="0 0 320 210" className="size-full" aria-hidden="true">
      {channels.map((c) => (
        <path key={c.label} d={path(c.y)} fill="none" stroke="#313131" strokeWidth={1.5} />
      ))}
      {channels.map((c, i) => (
        <Pulse key={c.label} d={path(c.y)} dur={DUR} from={0.1 + i * 0.12} to={0.28 + i * 0.12} />
      ))}
      <rect x={src.x - 46} y={src.y - 42} width={92} height={84} rx={10} fill="#1f1f1f" stroke="#313131" />
      <text x={src.x} y={src.y - 20} textAnchor="middle" fontSize={11} className="font-mono" fill="#9b9b9b">
        carga.xlsx
      </text>
      {[0, 1, 2].map((r) => (
        <rect key={r} x={src.x - 32} y={src.y - 8 + r * 14} width={r === 1 ? 46 : 64} height={6} rx={3} fill="#313131" />
      ))}
      {channels.map((c, i) => (
        <g key={c.label}>
          <Node x={cx} y={c.y} w={88} label={c.label} />
          <Glow x={cx - 46} y={c.y - 17} w={92} h={34} dur={DUR} on={0.28 + i * 0.12} off={0.9} rx={10} />
        </g>
      ))}
    </svg>
  )
}
