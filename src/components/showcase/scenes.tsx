import type { ReactNode } from 'react'
import type { LogoId } from '../../content'
import {
  Box,
  Cylinder,
  FaceA,
  FaceB,
  LogoPin,
  Packet,
  Tag,
  TopFlash,
  Window,
  isoArc,
  isoPath,
  proj,
  TopRect,
  unproj,
} from '../experience/iso'
import { glyph } from '../experience/logos'

/*
 * The three stories of the hero showcase, drawn in the same isometric world
 * as Experiencia. Every story rests on its finished state at time 0, which is
 * what reduced motion shows.
 */

const lit = '#f2b544'
const dark = '#141414'

export type Cam = [t: number, x: number, y: number]

export type ShowScene = {
  dur: number
  /** full frame in screen units: x, y, width, height */
  view: [number, number, number, number]
  /** camera stops for narrow screens, as fractions of the loop */
  cams: Cam[]
  Art: () => ReactNode
}

/** A rectangular island; its top face is the plane z = 0. */
function Ground({ a0, a1, b0, b1 }: { a0: number; a1: number; b0: number; b1: number }) {
  return <Box a={a0} b={b0} z={-20} w={a1 - a0} d={b1 - b0} h={20} tone="ground" />
}

/** Accent outline that lights a screen space rectangle for a moment. */
function Ring({ x, y, w, h, dur, on, off, rx = 10 }: { x: number; y: number; w: number; h: number; dur: number; on: number; off: number; rx?: number }) {
  return (
    <g className="helper">
      <Window dur={dur} on={on} off={off}>
        <rect x={x} y={y} width={w} height={h} rx={rx} fill="none" stroke={lit} strokeWidth={2} />
      </Window>
    </g>
  )
}

/** A speech bubble pinned above a point, visible between on and off. */
function Bubble({ a, b, z, dur, on, off, children, accent = false }: { a: number; b: number; z: number; dur: number; on: number; off: number; children: string; accent?: boolean }) {
  const [x, y] = proj(a, b, z)
  const w = children.length * 7.8 + 24
  return (
    <Window dur={dur} on={on} off={off}>
      <g transform={`translate(${x.toFixed(1)},${y.toFixed(1)})`}>
        <rect x={-w / 2} y={-30} width={w} height={26} rx={13} fill={accent ? lit : '#f4f4f2'} />
        <polygon points="-6,-5 6,-5 0,3" fill={accent ? lit : '#f4f4f2'} />
        <text y={-13} textAnchor="middle" fontSize={13} className="font-mono" fill="#000">
          {children}
        </text>
      </g>
    </Window>
  )
}

/* ---------- 1. A sale travels through Kafka and RabbitMQ, and stock updates everywhere ---------- */

/** Channel label with a stock counter that drops by one when the update arrives. */
function StockBadge({ x, y, label, logo, dur, at, right = false }: { x: number; y: number; label: string; logo?: LogoId; dur: number; at: number; right?: boolean }) {
  const nameW = 12 + (logo ? 22 : 0) + label.length * 7.8 + 10
  const numW = 38
  // `right` anchors the badge by its right edge, for labels that sit to the left of their object
  const left = right ? x - nameW - numW : x
  return (
    <g transform={`translate(${left.toFixed(1)},${y.toFixed(1)})`}>
      <rect x={0} y={-14} width={nameW + numW} height={28} rx={8} fill="#181818" stroke="#313131" />
      {logo && (
        <g transform={`translate(10,-8) scale(${16 / 24})`} fill="#f4f4f2">
          {glyph(logo)}
        </g>
      )}
      <text x={logo ? 32 : 12} y={5} fontSize={13} className="font-mono" fill="#f4f4f2">
        {label}
      </text>
      <line x1={nameW} y1={-14} x2={nameW} y2={14} stroke="#313131" />
      <Window dur={dur} on={0.04} off={at}>
        <text x={nameW + numW / 2} y={5} textAnchor="middle" fontSize={13} className="font-mono" fill="#9b9b9b">
          12
        </text>
      </Window>
      <Window dur={dur} on={0.04} off={at} invert>
        <text x={nameW + numW / 2} y={5} textAnchor="middle" fontSize={13} className="font-mono" fill={lit}>
          11
        </text>
      </Window>
      <Ring x={-3} y={-17} w={nameW + numW + 6} h={34} dur={dur} on={at} off={Math.min(at + 0.2, 0.98)} />
    </g>
  )
}

const SALE_DUR = 8
const channels: { label: string; logo?: LogoId }[] = [
  { label: 'VTEX', logo: 'vtex' },
  { label: 'Shopify', logo: 'shopify' },
  { label: 'Marketplaces', logo: 'store' },
]

function SaleArt() {
  const D = SALE_DUR
  const log = { a: -185, b: -22, w: 140, d: 44, h: 18 }
  const svc = { a: -10, b: -20, w: 40, d: 40, h: 48 }
  const ex = { a: 70, b: -15, w: 30, d: 30, h: 28 }
  const dbs: { a: number; label: string; logo: LogoId }[] = [
    { a: -70, label: 'MongoDB', logo: 'mongodb' },
    { a: 34, label: 'Oracle', logo: 'oracle' },
  ]
  const DB = -120
  const toDb = (a: number, h: number) => isoPath([[10, svc.b, h], [10, -70, h], [a, -70, h], [a, DB + 26, h]])
  const chA = 170
  const chB = [-96, 0, 96]
  const sale = isoPath([
    [-215, 0, 5],
    [-190, 0, 5],
    [-180, 0, log.h + 5],
    [-52, 0, log.h + 5],
    [-42, 0, 5],
    [svc.a, 0, 5],
  ])
  const arrive = (i: number) => 0.66 + i * 0.035

  return (
    <>
      <Ground a0={-280} a1={220} b0={-150} b1={132} />

      <path d={isoPath([[-215, 0, 0], [log.a, 0, 0]])} fill="none" stroke="#3a3a3a" strokeWidth={2} className="marching" />
      <path d={isoPath([[log.a + log.w, 0, 0], [svc.a, 0, 0]])} fill="none" stroke="#3a3a3a" strokeWidth={2} className="marching" />
      {dbs.map((d) => (
        <path key={d.a} d={toDb(d.a, 0)} fill="none" stroke="#3a3a3a" strokeWidth={2} className="marching" />
      ))}
      <path d={isoPath([[svc.a + svc.w, 0, 0], [ex.a, 0, 0]])} fill="none" stroke="#3a3a3a" strokeWidth={2} className="marching" />
      {chB.map((b) => (
        <path
          key={b}
          d={isoPath([[ex.a + ex.w, 0, 0], [140, 0, 0], [140, b, 0], [chA, b, 0]])}
          fill="none"
          stroke="#3a3a3a"
          strokeWidth={2}
          className="marching"
        />
      ))}

      {/* point of sale */}
      <Box a={-260} b={-22} w={45} d={44} h={34} tone="block">
        <FaceB b={22} a0={-252} a1={-224} z0={14} z1={28} fill={lit} />
      </Box>
      <TopFlash a={-260} b={-22} z={34} w={45} d={44} dur={D} on={0.02} off={0.14} />

      {/* Kafka topic with three partitions */}
      <Box a={log.a} b={log.b} w={log.w} d={log.d} h={log.h} tone="soft" />
      {[-18, -5, 8].map((b) => (
        <polygon
          key={b}
          points={[[log.a + 4, b], [log.a + log.w - 4, b], [log.a + log.w - 4, b + 9], [log.a + 4, b + 9]]
            .map(([a, bb]) => proj(a, bb, log.h).map((v) => v.toFixed(1)).join(','))
            .join(' ')}
          fill="#1b1b1b"
        />
      ))}

      {dbs.map((d) => {
        const [x, y] = proj(d.a, DB, 44)
        return (
          <g key={d.a}>
            <Cylinder a={d.a} b={DB} r={24} h={44} />
            <g className="helper">
              <Window dur={D} on={0.5} off={0.7}>
                <ellipse cx={x} cy={y} rx={24 * 1.2247} ry={24 * 0.7071} fill={lit} opacity={0.85} />
              </Window>
            </g>
          </g>
        )
      })}

      {/* stock service */}
      <Box a={svc.a} b={svc.b} w={svc.w} d={svc.d} h={svc.h} tone="soft">
        <FaceB b={svc.b + svc.d} a0={svc.a + 8} a1={svc.a + 32} z0={svc.h - 14} z1={svc.h - 8} fill={dark} />
        <FaceB b={svc.b + svc.d} a0={svc.a + 8} a1={svc.a + 22} z0={svc.h - 24} z1={svc.h - 18} fill={dark} />
      </Box>
      <TopFlash a={svc.a} b={svc.b} z={svc.h} w={svc.w} d={svc.d} dur={D} on={0.36} off={0.6} />

      {/* RabbitMQ exchange */}
      <Box a={ex.a} b={ex.b} w={ex.w} d={ex.d} h={ex.h} tone="accent" />

      {chB.map((b, i) => (
        <g key={b}>
          <Box a={chA} b={b - 15} w={30} d={30} h={22} tone="block">
            <FaceB b={b + 15} a0={chA + 6} a1={chA + 24} z0={8} z1={14} fill={dark} />
          </Box>
          <TopFlash a={chA} b={b - 15} z={22} w={30} d={30} dur={D} on={arrive(i)} off={0.95} />
        </g>
      ))}

      {/* labels */}
      <g className="bob">
        <Tag a={-237} b={0} z={84} accent>
          Nueva venta
        </Tag>
      </g>
      <Tag a={-115} b={46} z={0} logo="kafka">
        Kafka
      </Tag>
      <Tag a={10} b={0} z={svc.h + 22} logo="springboot">
        Stock
      </Tag>
      <Tag a={85} b={60} z={0} logo="rabbitmq">
        RabbitMQ
      </Tag>
      {dbs.map((d, i) => {
        const [x, y] = proj(d.a, DB, 44)
        return <StockBadge key={d.a} x={i ? x + 36 : x - 36} y={y - 4} label={d.label} logo={d.logo} dur={D} at={0.5} right={!i} />
      })}
      {chB.map((b, i) => {
        const [x, y] = proj(chA + 30, b, 11)
        return <StockBadge key={b} x={x + 12} y={y} label={channels[i].label} logo={channels[i].logo} dur={D} at={arrive(i)} />
      })}

      {/* the sale, then the stock update fanning out */}
      <Packet d={sale} dur={D} from={0.06} to={0.36} />
      {dbs.map((d) => (
        <Packet key={d.a} d={toDb(d.a, 5)} dur={D} from={0.4} to={0.5} />
      ))}
      <Packet d={isoPath([[svc.a + svc.w, 0, 5], [ex.a, 0, 5]])} dur={D} from={0.4} to={0.5} />
      {chB.map((b, i) => (
        <Packet
          key={b}
          d={isoPath([[ex.a + ex.w, 0, 5], [140, 0, 5], [140, b, 5], [chA, b, 5]])}
          dur={D}
          from={0.52 + i * 0.035}
          to={arrive(i)}
          size={8}
        />
      ))}
    </>
  )
}

/* ---------- 2. Robots split a bug between them and open a pull request ---------- */

type Work = [on: number, off: number]

/** A small robot: body, a bobbing head with two eyes and an antenna. */
function Robot({ a, b, s = 28, lead = false, delay = 0, dur, work = [] }: { a: number; b: number; s?: number; lead?: boolean; delay?: number; dur: number; work?: Work[] }) {
  const body = s * 0.8
  const hs = s * 0.8
  const hh = s * 0.62
  const hz = body + 4
  const x0 = a - s / 2
  const y0 = b - s / 2
  const ha = a - hs / 2
  const hb = b - hs / 2
  const [tx, ty] = proj(a, b, hz + hh)
  return (
    <g>
      <Box a={x0} b={y0} w={s} d={s} h={body} tone={lead ? 'accent' : 'block'}>
        <FaceB b={y0 + s} a0={x0 + s * 0.25} a1={x0 + s * 0.75} z0={body * 0.3} z1={body * 0.55} fill={lead ? '#7a5a1c' : dark} />
      </Box>
      <g className="bob" style={{ animationDelay: `${delay}s` }}>
        <Box a={ha} b={hb} z={hz} w={hs} d={hs} h={hh} tone={lead ? 'accent' : 'soft'}>
          <FaceB b={hb + hs} a0={ha + hs * 0.16} a1={ha + hs * 0.38} z0={hz + hh * 0.35} z1={hz + hh * 0.68} fill={lead ? '#000' : lit} />
          <FaceB b={hb + hs} a0={ha + hs * 0.62} a1={ha + hs * 0.84} z0={hz + hh * 0.35} z1={hz + hh * 0.68} fill={lead ? '#000' : lit} />
        </Box>
        {work.map(([on, off]) => (
          <TopFlash key={on} a={ha} b={hb} z={hz + hh} w={hs} d={hs} dur={dur} on={on} off={off} />
        ))}
        <line x1={tx} y1={ty} x2={tx} y2={ty - 12} stroke="#6e6e6e" strokeWidth={2} />
        <circle className="pulse-ring helper" cx={tx} cy={ty - 15} r={3.5} fill={lit} />
        <circle cx={tx} cy={ty - 15} r={3.5} fill={lit} />
      </g>
    </g>
  )
}

const AGENTS_DUR = 10

const graphNodes: [number, number, number][] = [
  [0, 0, 9],
  [-40, -16, 6],
  [34, -26, 7],
  [-26, 26, 6],
  [42, 16, 6],
  [4, -48, 5],
]
const graphEdges: [number, number][] = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [1, 5],
  [2, 5],
  [2, 4],
]

function AgentsArt() {
  const D = AGENTS_DUR
  const orch: [number, number] = [-60, 30]
  const analyst: [number, number] = [-40, -90]
  const coder: [number, number] = [80, -60]
  const reviewer: [number, number] = [70, 80]
  const repo = { a: 140, b: 10, w: 40, d: 40, h: 14 }
  const graph: [number, number, number] = [-140, -110, 64]
  const [gx, gy] = proj(...graph)
  const head = ([a, b]: [number, number], s = 36): [number, number, number] => [a, b, s * 0.8 + 4 + s * 0.62]
  const bubbleZ = (s = 36) => s * 0.8 + 4 + s * 0.62 + 30
  // the monitor stands at the coder's right, its screen faces the viewer
  const mon = { a: 106, b: -88, w: 6, d: 54, h: 46 }

  return (
    <>
      <Ground a0={-200} a1={200} b0={-130} b1={130} />

      {/* inbox with the ticket */}
      <Box a={-185} b={70} w={40} d={40} h={8} tone="soft" />
      <Box a={-178} b={77} z={8} w={26} d={26} h={3} tone="accent" />

      {/* knowledge graph, floating */}
      <line x1={gx} y1={gy + 20} x2={gx} y2={proj(graph[0], graph[1], 0)[1]} stroke="#2a2a2a" strokeWidth={2} strokeDasharray="4 6" />
      <g className="bob">
        {graphEdges.map(([p, q]) => (
          <line key={`${p}-${q}`} x1={gx + graphNodes[p][0]} y1={gy + graphNodes[p][1]} x2={gx + graphNodes[q][0]} y2={gy + graphNodes[q][1]} stroke="#3a3a3a" strokeWidth={2} />
        ))}
        {graphNodes.map(([x, y, r], i) => (
          <circle key={i} cx={gx + x} cy={gy + y} r={r} fill={i === 0 ? lit : '#2a2a2a'} stroke={i === 0 ? 'none' : '#4a4a4a'} strokeWidth={1.5} />
        ))}
        <g className="helper">
          <Window dur={D} on={0.34} off={0.44}>
            {graphNodes.slice(1).map(([x, y, r], i) => (
              <circle key={i} cx={gx + x} cy={gy + y} r={r + 4} fill="none" stroke={lit} strokeWidth={2} />
            ))}
          </Window>
        </g>
        <LogoPin a={graph[0] + 60} b={graph[1] - 60} z={graph[2] + 10} logo="neo4j" stem={8} r={15} />
      </g>

      <Robot a={analyst[0]} b={analyst[1]} s={36} delay={0.4} dur={D} work={[[0.28, 0.46]]} />

      {/* coder and the monitor where the fix gets written */}
      <Robot a={coder[0]} b={coder[1]} s={36} delay={0.9} dur={D} work={[[0.52, 0.68]]} />
      <Box a={mon.a} b={mon.b} w={mon.w} d={mon.d} h={mon.h} tone="block">
        <FaceA a={mon.a + mon.w} b0={mon.b + 4} b1={mon.b + mon.d - 4} z0={6} z1={mon.h - 4} fill={dark} />
        {[0, 1, 2, 3].map((i) => (
          <FaceA key={i} a={mon.a + mon.w} b0={mon.b + 9 + (i % 2) * 8} b1={mon.b + mon.d - 10 - ((i * 7) % 12)} z0={mon.h - 14 - i * 7} z1={mon.h - 11 - i * 7} fill="#2a2a2a" />
        ))}
      </Box>
      <g className="helper">
        {[0, 1, 2, 3].map((i) => (
          <Window key={i} dur={D} on={0.54 + i * 0.025} off={0.97}>
            <FaceA a={mon.a + mon.w} b0={mon.b + 9 + (i % 2) * 8} b1={mon.b + mon.d - 10 - ((i * 7) % 12)} z0={mon.h - 14 - i * 7} z1={mon.h - 11 - i * 7} fill={lit} />
          </Window>
        ))}
      </g>

      <Robot a={orch[0]} b={orch[1]} s={46} lead dur={D} work={[[0.12, 0.22]]} />

      {/* repository that receives the pull request */}
      <Box a={repo.a} b={repo.b} w={repo.w} d={repo.d} h={repo.h} tone="soft" />
      <Box a={repo.a + 4} b={repo.b + 4} z={repo.h} w={repo.w - 8} d={repo.d - 8} h={8} tone="block" />
      <TopFlash a={repo.a + 4} b={repo.b + 4} z={repo.h + 8} w={repo.w - 8} d={repo.d - 8} dur={D} on={0.9} off={0.99} />
      <LogoPin a={repo.a + 20} b={repo.b + 20} z={repo.h + 8} logo="gitlab" stem={20} r={15} />

      <Robot a={reviewer[0]} b={reviewer[1]} s={36} delay={1.4} dur={D} work={[[0.72, 0.86]]} />

      <Tag a={-60} b={120} z={0} logo="google">
        Google ADK
      </Tag>
      <Tag a={150} b={120} z={0} logo="aws">
        guardrails
      </Tag>

      {/* the ticket travels from robot to robot */}
      <g className="bob">
        <Tag a={-165} b={90} z={52} accent>
          bug: stock negativo
        </Tag>
      </g>
      <Packet d={isoArc([-165, 90, 20], head(orch, 46), 40)} dur={D} from={0.03} to={0.12} />
      <Packet d={isoArc(head(orch, 46), head(analyst), 40)} dur={D} from={0.2} to={0.28} />
      <Packet d={isoArc(head(analyst), graph, 20)} dur={D} from={0.3} to={0.34} size={8} />
      <Packet d={isoArc(graph, head(analyst), 20)} dur={D} from={0.38} to={0.42} size={8} />
      <Packet d={isoArc(head(analyst), head(coder), 40)} dur={D} from={0.44} to={0.52} />
      <Packet d={isoArc(head(coder), head(reviewer), 40)} dur={D} from={0.66} to={0.74} />
      <Packet d={isoArc(head(reviewer), [repo.a + 20, repo.b + 20, repo.h + 8], 50)} dur={D} from={0.84} to={0.9} />

      <Bubble a={orch[0]} b={orch[1]} z={bubbleZ(46)} dur={D} on={0.12} off={0.22}>
        reparto la tarea
      </Bubble>
      <Bubble a={analyst[0]} b={analyst[1]} z={bubbleZ()} dur={D} on={0.28} off={0.46}>
        busco contexto
      </Bubble>
      <Bubble a={coder[0]} b={coder[1]} z={bubbleZ()} dur={D} on={0.52} off={0.68}>
        escribo el fix
      </Bubble>
      <Bubble a={reviewer[0]} b={reviewer[1]} z={bubbleZ()} dur={D} on={0.74} off={0.88}>
        pruebas ok
      </Bubble>
      <Bubble a={repo.a + 20} b={repo.b + 20} z={repo.h + 70} dur={D} on={0.9} off={0.99} accent>
        PR abierto
      </Bubble>
    </>
  )
}

/* ---------- 3. Old Delphi code is read, goes through the migration and comes back as modern services ---------- */

const LEGACY_DUR = 9

function LegacyArt() {
  const D = LEGACY_DUR
  const crt = { a: -185, b: -10, w: 80, d: 70, h: 84 }
  const F = crt.b + crt.d
  const crtTop: [number, number, number] = [crt.a + crt.w / 2, crt.b + crt.d / 2, crt.h]
  const portal: [number, number, number] = [-10, -10, 56]
  const [px, py] = proj(...portal)
  const slab = { a: 44, b: -128, w: 148, d: 132, h: 8 }
  const S = 44
  const services: { a: number; b: number; h: number; logo: LogoId }[] = [
    { a: 58, b: -114, h: 50, logo: 'springboot' },
    { a: 128, b: -114, h: 64, logo: 'go' },
    { a: 58, b: -48, h: 58, logo: 'python' },
    { a: 128, b: -48, h: 46, logo: 'react' },
  ]
  const pass = (i: number) => 0.3 + i * 0.14
  const arrive = (i: number) => pass(i) + 0.08
  const codeLines = [40, 52, 30, 46, 24, 38]
  const top = (s: { a: number; b: number; h: number }): [number, number, number] => [s.a + S / 2, s.b + S / 2, slab.h + s.h]
  const flight = (i: number) => {
    const second = isoArc(portal, top(services[i]), 40)
    return second.slice(second.indexOf('C'))
  }

  return (
    <>
      <Ground a0={-200} a1={200} b0={-130} b1={110} />

      {/* the old terminal: its code lights up line by line as it gets read */}
      <Box a={crt.a} b={crt.b} w={crt.w} d={crt.d} h={crt.h} tone="block">
        <FaceB b={F} a0={crt.a + 8} a1={crt.a + crt.w - 8} z0={16} z1={crt.h - 10} fill="#0f0f0f" />
        {codeLines.map((w, i) => (
          <FaceB key={i} b={F} a0={crt.a + 14 + (i % 3) * 6} a1={crt.a + 14 + (i % 3) * 6 + w} z0={crt.h - 20 - i * 9} z1={crt.h - 16 - i * 9} fill="#2a2a2a" />
        ))}
        {[0, 1, 2].map((i) => (
          <FaceA key={i} a={crt.a + crt.w} b0={crt.b + 12} b1={crt.b + 30} z0={20 + i * 10} z1={24 + i * 10} fill="#1a1a1a" />
        ))}
      </Box>
      <g className="helper">
        {codeLines.map((w, i) => (
          <Window key={i} dur={D} on={0.06 + i * 0.03} off={0.97}>
            <FaceB b={F} a0={crt.a + 14 + (i % 3) * 6} a1={crt.a + 14 + (i % 3) * 6 + w} z0={crt.h - 20 - i * 9} z1={crt.h - 16 - i * 9} fill={lit} />
          </Window>
        ))}
      </g>
      <Box a={crt.a + 6} b={F + 6} w={crt.w - 12} d={22} h={6} tone="soft" />

      {/* migration gate */}
      <Box a={-30} b={-30} w={40} d={40} h={10} tone="soft" />
      <ellipse cx={px} cy={py} rx={22} ry={42} fill="#131209" stroke="#6b5427" strokeWidth={3} />
      <ellipse cx={px} cy={py} rx={14} ry={32} fill="none" stroke={lit} strokeWidth={1.5} className="marching" />
      <g className="helper">
        {services.map((_, i) => (
          <Window key={i} dur={D} on={pass(i) - 0.01} off={pass(i) + 0.05}>
            <ellipse cx={px} cy={py} rx={24} ry={44} fill="none" stroke={lit} strokeWidth={4} />
          </Window>
        ))}
      </g>

      {/* modern platform */}
      <Box a={slab.a} b={slab.b} w={slab.w} d={slab.d} h={slab.h} tone="soft" />
      {services.map((s, i) => (
        <Drop key={s.logo} dur={D} at={arrive(i)}>
          <Box a={s.a} b={s.b} z={slab.h} w={S} d={S} h={s.h} tone="block">
            <FaceB b={s.b + S} a0={s.a + 8} a1={s.a + 34} z0={slab.h + s.h - 16} z1={slab.h + s.h - 9} fill={dark} />
            <FaceB b={s.b + S} a0={s.a + 8} a1={s.a + 24} z0={slab.h + s.h - 27} z1={slab.h + s.h - 20} fill={dark} />
          </Box>
          <TopFlash a={s.a} b={s.b} z={slab.h + s.h} w={S} d={S} dur={D} on={arrive(i)} off={0.95} />
          <LogoPin a={s.a + S / 2} b={s.b + S / 2} z={slab.h + s.h} logo={s.logo} stem={18} />
        </Drop>
      ))}

      <Tag a={crtTop[0]} b={crtTop[1]} z={crt.h + 34} logo="delphi">
        Delphi
      </Tag>
      <Tag a={-10} b={60} z={0}>
        migración gradual
      </Tag>
      <Tag a={160} b={36} z={0} logo="kubernetes">
        Kubernetes
      </Tag>

      {services.map((_, i) => (
        <g key={i}>
          <Packet d={isoArc(crtTop, portal, 30)} dur={D} from={pass(i) - 0.07} to={pass(i)} tone="block" size={12} />
          <Packet d={`M${px.toFixed(1)},${py.toFixed(1)} ${flight(i)}`} dur={D} from={pass(i)} to={arrive(i)} size={12} />
        </g>
      ))}
    </>
  )
}

/** Hides its children until `at`, then drops them into place. Visible at time 0 and at the end. */
function Drop({ dur, at, children }: { dur: number; at: number; children: ReactNode }) {
  const kt = `0;0.05;0.06;${at};${at + 0.04};1`
  return (
    <g>
      <animate attributeName="opacity" dur={`${dur}s`} repeatCount="indefinite" values="1;1;0;0;1;1" keyTimes={kt} />
      <animateTransform
        attributeName="transform"
        type="translate"
        dur={`${dur}s`}
        repeatCount="indefinite"
        values="0 0;0 0;0 -36;0 -36;0 0;0 0"
        keyTimes={kt}
        calcMode="spline"
        keySplines="0 0 1 1;0 0 1 1;0 0 1 1;0.16 1 0.3 1;0 0 1 1"
      />
      {children}
    </g>
  )
}

/** Moves any drawing (centred on 0,0) along a path once per cycle, between two fractions of it. */
function Carry({ d, dur, from, to, linear = false, children }: { d: string; dur: number; from: number; to: number; linear?: boolean; children: ReactNode }) {
  return (
    <g className="helper" opacity={0}>
      <animateMotion
        path={d}
        dur={`${dur}s`}
        repeatCount="indefinite"
        calcMode="spline"
        keyPoints="0;0;1;1"
        keyTimes={`0;${from};${to};1`}
        keySplines={linear ? '0 0 1 1;0 0 1 1;0 0 1 1' : '0 0 1 1;0.65 0 0.35 1;0 0 1 1'}
      />
      <animate
        attributeName="opacity"
        dur={`${dur}s`}
        repeatCount="indefinite"
        values="0;0;1;1;0;0"
        keyTimes={`0;${from};${from + 0.01};${to - 0.01};${to};1`}
      />
      {children}
    </g>
  )
}

/* ---------- 4. Spreadsheets become bricks that snap into each platform ---------- */

/** A small round stud on top of a brick. */
function Stud({ a, b, z, fill }: { a: number; b: number; z: number; fill: [string, string] }) {
  const [x, y] = proj(a, b, z)
  const rx = 4.4
  const ry = 2.5
  return (
    <g stroke="#000" strokeWidth={1}>
      <path d={`M${x - rx},${y - 3} V${y} A${rx},${ry} 0 0 0 ${x + rx},${y} V${y - 3} Z`} fill={fill[1]} />
      <ellipse cx={x} cy={y - 3} rx={rx} ry={ry} fill={fill[0]} />
    </g>
  )
}

const brickTones = {
  accent: ['#f2b544', '#c48e2c'],
  light: ['#e4e4e0', '#b4b4b0'],
} as const

/** A 2 by 1 building brick. */
function Brick({ a, b, z = 0, tone = 'accent' }: { a: number; b: number; z?: number; tone?: 'accent' | 'light' }) {
  const fill = brickTones[tone] as unknown as [string, string]
  return (
    <g>
      <Box a={a} b={b} z={z} w={26} d={14} h={11} tone={tone} />
      <Stud a={a + 7} b={b + 7} z={z + 11} fill={fill} />
      <Stud a={a + 19} b={b + 7} z={z + 11} fill={fill} />
    </g>
  )
}

/** A flat base plate with a grid of studs, where bricks snap in. */
function Plate({ a, b, w, d }: { a: number; b: number; w: number; d: number }) {
  const studs: ReactNode[] = []
  for (let i = 0; i < Math.floor(w / 12); i++) {
    for (let j = 0; j < Math.floor(d / 12); j++) {
      studs.push(<Stud key={`${i}-${j}`} a={a + 6 + i * 12} b={b + 6 + j * 12} z={6} fill={['#3a3a3a', '#262626']} />)
    }
  }
  return (
    <g>
      <Box a={a} b={b} w={w} d={d} h={6} tone="soft" />
      {studs}
    </g>
  )
}

/** A spreadsheet lying on the ground: header row and data rows. */
function Sheet({ a, b, w = 70, d = 70 }: { a: number; b: number; w?: number; d?: number }) {
  return (
    <g>
      <Box a={a} b={b} w={w} d={d} h={6} tone="soft" />
      <TopRect a={a + 5} b={b + 5} w={w - 10} d={10} z={6} fill="#6b5427" />
      {[0, 1, 2, 3].map((r) => (
        <TopRect key={r} a={a + 5} b={b + 19 + r * 12} w={w - 10} d={8} z={6} fill={r % 2 ? '#1f1f1f' : '#2a2a2a'} />
      ))}
      {[1, 2].map((c) => (
        <TopRect key={c} a={a + 5 + ((w - 10) * c) / 3} b={b + 5} w={1.5} d={d - 10} z={6} fill="#141414" />
      ))}
    </g>
  )
}

const INTEG_DUR = 11
const targets: { label: string; logo: LogoId; b: number }[] = [
  { label: 'VTEX', logo: 'vtex', b: -142 },
  { label: 'Shopify', logo: 'shopify', b: -74 },
  { label: 'Marketplaces', logo: 'store', b: -6 },
]

function IntegrationsArt() {
  const D = INTEG_DUR
  const prodSheet = { a: -225, b: -115 }
  const orderSheet = { a: -225, b: 45 }
  const hub = { a: -62, b: -26, w: 52, d: 52, h: 40 }
  const hubTop: [number, number, number] = [hub.a + hub.w / 2, hub.b + hub.d / 2, hub.h + 8]
  const PA = 78 // product plates start here
  const fusion = { a: 40, b: 72, w: 72, d: 60 }
  const snap = (i: number) => 0.32 + i * 0.04
  const orderSnap = 0.74
  const brick = (tone: 'accent' | 'light' = 'accent') => <Brick a={-13} b={-7} z={-6} tone={tone} />

  return (
    <>
      <Ground a0={-245} a1={175} b0={-155} b1={145} />

      {[prodSheet, orderSheet].map((s) => (
        <path key={s.b} d={isoPath([[s.a + 70, s.b + 35, 0], [hub.a - 20, s.b + 35, 0], [hub.a - 20, 0, 0], [hub.a, 0, 0]])} fill="none" stroke="#3a3a3a" strokeWidth={2} className="marching" />
      ))}
      {targets.map((t) => (
        <path key={t.b} d={isoPath([[hub.a + hub.w, 0, 0], [60, 0, 0], [60, t.b + 22, 0], [PA, t.b + 22, 0]])} fill="none" stroke="#3a3a3a" strokeWidth={2} className="marching" />
      ))}
      <path d={isoPath([[hub.a + hub.w / 2, hub.b + hub.d, 0], [hub.a + hub.w / 2, fusion.b + 30, 0], [fusion.a, fusion.b + 30, 0]])} fill="none" stroke="#3a3a3a" strokeWidth={2} className="marching" />

      <Sheet {...prodSheet} />

      {/* product plates, each keeps the bricks it already received */}
      {targets.map((t, i) => (
        <g key={t.label}>
          <Plate a={PA} b={t.b} w={60} d={48} />
          <Brick a={PA + 6} b={t.b + 4} z={6} />
          <Drop dur={D} at={snap(i)}>
            <Brick a={PA + 30} b={t.b + 24} z={6} />
          </Drop>
          <Ring {...ringAt(PA + 30, t.b + 24, 6)} dur={D} on={snap(i)} off={snap(i) + 0.12} />
        </g>
      ))}

      {/* integration hub: validates every row before it goes out */}
      <Box a={hub.a} b={hub.b} w={hub.w} d={hub.d} h={hub.h} tone="block">
        <FaceB b={hub.b + hub.d} a0={hub.a + 10} a1={hub.a + 20} z0={14} z1={26} fill={lit} />
        <FaceB b={hub.b + hub.d} a0={hub.a + 32} a1={hub.a + 42} z0={14} z1={26} fill={lit} />
        <FaceA a={hub.a + hub.w} b0={hub.b + 10} b1={hub.b + 20} z0={14} z1={26} fill="#6b5427" />
        <FaceA a={hub.a + hub.w} b0={hub.b + 32} b1={hub.b + 42} z0={14} z1={26} fill="#6b5427" />
      </Box>
      <Box a={hub.a + 8} b={hub.b + 8} z={hub.h} w={hub.w - 16} d={hub.d - 16} h={8} tone="soft" />
      <TopFlash a={hub.a + 8} b={hub.b + 8} z={hub.h + 8} w={hub.w - 16} d={hub.d - 16} dur={D} on={0.14} off={0.24} />
      <TopFlash a={hub.a + 8} b={hub.b + 8} z={hub.h + 8} w={hub.w - 16} d={hub.d - 16} dur={D} on={0.56} off={0.64} />

      <Sheet {...orderSheet} />

      {/* Oracle Fusion plate for purchase orders */}
      <Plate {...fusion} />
      <Brick a={fusion.a + 8} b={fusion.b + 8} z={6} tone="light" />
      <Brick a={fusion.a + 38} b={fusion.b + 8} z={6} tone="light" />
      <Drop dur={D} at={orderSnap}>
        <Brick a={fusion.a + 22} b={fusion.b + 34} z={6} tone="light" />
      </Drop>
      <Ring {...ringAt(fusion.a + 22, fusion.b + 34, 6)} dur={D} on={orderSnap} off={orderSnap + 0.12} />

      {/* labels */}
      <Tag a={prodSheet.a + 35} b={prodSheet.b + 35} z={50} logo="excel">
        productos.xlsx
      </Tag>
      <Tag a={orderSheet.a + 35} b={orderSheet.b + 35} z={50} logo="excel">
        ordenes.xlsx
      </Tag>
      <Tag a={hubTop[0]} b={hubTop[1]} z={hubTop[2] + 30} logo="springboot">
        Integrador
      </Tag>
      {targets.map((t) => (
        <LogoPin key={t.label} a={PA + 50} b={t.b + 8} z={6} logo={t.logo} stem={40} r={16} />
      ))}
      <Tag a={fusion.a + 36} b={fusion.b + 30} z={46} logo="oracle">
        Oracle Fusion
      </Tag>
      <Tag a={fusion.a + 104} b={fusion.b + 40} z={0}>
        SOAP y REST
      </Tag>

      <Bubble a={hubTop[0]} b={hubTop[1]} z={hubTop[2] + 66} dur={D} on={0.15} off={0.24} accent>
        validado
      </Bubble>
      <Bubble a={hubTop[0]} b={hubTop[1]} z={hubTop[2] + 66} dur={D} on={0.57} off={0.65} accent>
        validado
      </Bubble>

      {/* products: a row leaves the sheet, gets validated and snaps into every channel */}
      <Carry d={isoArc([prodSheet.a + 35, prodSheet.b + 35, 14], hubTop, 50)} dur={D} from={0.04} to={0.14}>
        {brick()}
      </Carry>
      {targets.map((t, i) => (
        <Carry key={t.label} d={isoArc(hubTop, [PA + 43, t.b + 31, 24], 50)} dur={D} from={0.22 + i * 0.04} to={snap(i)}>
          {brick()}
        </Carry>
      ))}

      {/* purchase orders: same path, into Oracle Fusion */}
      <Carry d={isoArc([orderSheet.a + 35, orderSheet.b + 35, 14], hubTop, 50)} dur={D} from={0.46} to={0.56}>
        {brick('light')}
      </Carry>
      <Carry d={isoArc(hubTop, [fusion.a + 35, fusion.b + 41, 24], 50)} dur={D} from={0.64} to={orderSnap}>
        {brick('light')}
      </Carry>
    </>
  )
}

/** Screen rectangle around a brick resting at a ground point, for the snap flash. */
function ringAt(a: number, b: number, z: number) {
  const [x, y] = proj(a + 13, b + 7, z + 6)
  return { x: x - 22, y: y - 20, w: 44, h: 36 }
}

/* ---------- 5. A slow process trains and comes back fast ---------- */

const OPT_DUR = 12

/** A lightning badge: what the process gets after the pit stop. */
function Bolt({ x = 0, y = 0, r = 10 }: { x?: number; y?: number; r?: number }) {
  const k = r / 10
  return (
    <g transform={`translate(${x},${y}) scale(${k})`}>
      <circle r={10} fill={lit} stroke="#000" strokeWidth={1} />
      <path d="M1.5,-7 L-4.5,1 L-0.5,1 L-1.5,7 L4.5,-1 L0.5,-1 Z" fill="#000" />
    </g>
  )
}

/** Short sparks around a point, while the crew works on it. */
function Sparks({ x, y, dur, on, off }: { x: number; y: number; dur: number; on: number; off: number }) {
  return (
    <g className="helper">
      <Window dur={dur} on={on} off={off}>
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <line
            key={deg}
            x1={x + Math.cos((deg * Math.PI) / 180) * 8}
            y1={y + Math.sin((deg * Math.PI) / 180) * 8}
            x2={x + Math.cos((deg * Math.PI) / 180) * 15}
            y2={y + Math.sin((deg * Math.PI) / 180) * 15}
            stroke={lit}
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        ))}
      </Window>
    </g>
  )
}

/** The process as a block with eyes; the fast version is smaller, accent and wears the bolt. */
function Runner({ fast = false }: { fast?: boolean }) {
  const s = fast ? 20 : 28
  const h = s / 2
  return (
    <g>
      {fast && <line x1={-56} y1={-32} x2={-12} y2={-7} stroke={lit} strokeWidth={10} strokeLinecap="round" opacity={0.25} />}
      <Box a={-h} b={-h} z={-h} w={s} d={s} h={s} tone={fast ? 'accent' : 'block'}>
        <FaceB b={h} a0={-h + s * 0.2} a1={-h + s * 0.38} z0={-h + s * 0.45} z1={-h + s * 0.65} fill={fast ? '#000' : lit} />
        <FaceB b={h} a0={h - s * 0.38} a1={h - s * 0.2} z0={-h + s * 0.45} z1={-h + s * 0.65} fill={fast ? '#000' : lit} />
      </Box>
      {fast && <Bolt y={-30} r={10} />}
    </g>
  )
}

function OptimizationArt() {
  const D = OPT_DUR
  // a rectangular loop: main straight in the back, return straight in front, pit box beside the return
  const A0 = -210
  const A1 = 150
  const MAIN = 0
  const BACK = 80
  const pit = { a: -20, b: 128 }
  const z = 14
  const zf = 10
  const lap = (h: number): [number, number, number][] => [
    [A0, MAIN, h],
    [A1, MAIN, h],
    [A1 + 22, MAIN + 18, h],
    [A1 + 22, BACK - 18, h],
    [A1, BACK, h],
    [A0, BACK, h],
    [A0 - 22, BACK - 18, h],
    [A0 - 22, MAIN + 18, h],
    [A0, MAIN, h],
  ]
  const slowLap = isoPath([...lap(z).slice(0, 5), [pit.a, BACK, z], [pit.a, pit.b, z]])
  const fastLap = isoPath(lap(zf))
  const pitExit = isoPath([[pit.a, pit.b, zf], [pit.a, BACK, zf], [A0, BACK, zf], [A0 - 22, BACK - 18, zf], [A0 - 22, MAIN + 18, zf], [A0, MAIN, zf]])
  const T = {
    slow: [0.03, 0.3] as const,
    crew: [0.34, 0.4, 0.46] as const,
    bolt: 0.52,
    exit: [0.55, 0.6] as const,
    laps: [0.6, 0.7, 0.8] as const,
  }
  const LAP = 0.1
  // the main straight is about 40% of a lap
  const straight = (t: number) => t + LAP * 0.4
  const crew: { a: number; b: number; say: string }[] = [
    { a: -68, b: 166, say: 'caché Redis' },
    { a: 50, b: 172, say: 'consultas optimizadas' },
    { a: 40, b: 107, say: 'pool de conexiones' },
  ]
  const [kx, ky] = proj(pit.a, pit.b, z)
  // results panel, in screen space
  const [px, py] = [150, -150]
  const BAR = 150
  const badge = unproj(px + 117, py - 62)

  return (
    <>
      <Ground a0={-250} a1={210} b0={-70} b1={200} />

      {/* track: an outer band with an infield */}
      <TopRect a={A0 - 40} b={MAIN - 24} w={A1 - A0 + 80} d={BACK - MAIN + 48} fill="#191919" />
      <TopRect a={A0 + 4} b={MAIN + 24} w={A1 - A0 - 8} d={BACK - MAIN - 48} fill="#232323" />
      <path d={isoPath(lap(0))} fill="none" stroke="#2a2a2a" strokeWidth={2} strokeDasharray="10 10" />
      {[0, 1, 2, 3].map((k) => (
        <TopRect key={k} a={A1 - 8 + (k % 2) * 6} b={MAIN - 22 + k * 11} w={6} d={11} fill="#f4f4f2" />
      ))}
      <TopRect a={A0 - 2} b={MAIN - 22} w={4} d={44} fill="#6b5427" />

      {/* pit box with hazard stripes */}
      <TopRect a={pit.a - 40} b={pit.b - 24} w={80} d={56} fill="#141414" />
      {[0, 1, 2, 3, 4, 5, 6].map((k) => (
        <TopRect key={k} a={pit.a - 40 + k * 12} b={pit.b + 27} w={6} d={4} fill={k % 2 ? '#141414' : '#6b5427'} />
      ))}
      {/* "PITS" painted on the floor, in the plane of the ground */}
      <text
        transform={(() => {
          const [x, y] = proj(pit.a - 18, pit.b + 23)
          return `matrix(0.866 0.5 -0.866 0.5 ${x.toFixed(1)} ${y.toFixed(1)})`
        })()}
        fontSize={13}
        fontWeight={600}
        className="font-mono"
        fill="#6b5427"
      >
        PITS
      </text>

      {/* results: the bar of each run, before and after */}
      <g transform={`translate(${px.toFixed(1)},${py.toFixed(1)})`}>
        <rect x={0} y={-36} width={BAR + 84} height={78} rx={10} fill="#181818" stroke="#313131" />
        <text x={12} y={-12} fontSize={12} className="font-mono" fill="#9b9b9b">
          antes
        </text>
        <text x={12} y={22} fontSize={12} className="font-mono" fill="#9b9b9b">
          ahora
        </text>
        <rect x={66} y={-21} width={BAR} height={10} rx={5} fill="#262626" />
        <rect x={66} y={13} width={BAR} height={10} rx={5} fill="#262626" />
        <rect x={66} y={-21} width={BAR} height={10} rx={5} fill="#4a4a4a">
          <animate
            attributeName="width"
            dur={`${D}s`}
            repeatCount="indefinite"
            values={`${BAR};${BAR};0;0;${BAR};${BAR}`}
            keyTimes={`0;0.02;0.025;${T.slow[0]};${T.slow[0] + 0.16};1`}
          />
        </rect>
        <rect x={66} y={13} width={BAR * 0.2} height={10} rx={5} fill={lit}>
          <animate
            attributeName="width"
            dur={`${D}s`}
            repeatCount="indefinite"
            values={`${BAR * 0.2};${BAR * 0.2};0;0;${BAR * 0.2};${BAR * 0.2}`}
            keyTimes={`0;0.02;0.025;${T.laps[0]};${straight(T.laps[0])};1`}
          />
        </rect>
      </g>
      <g className="bob">
        <Window dur={D} on={0.03} off={straight(T.laps[0]) + 0.02} invert>
          <Tag a={badge[0]} b={badge[1]} accent>
            80% menos tiempo
          </Tag>
        </Window>
      </g>

      {/* 1. the slow lap ends in the pits */}
      <Carry d={slowLap} dur={D} from={T.slow[0]} to={T.slow[1]} linear>
        <Runner />
        <g transform="translate(0,-44)">
          <rect x={-16} y={-12} width={32} height={22} rx={11} fill="#f4f4f2" />
          <text y={4} textAnchor="middle" fontSize={12} className="font-mono" fill="#000">
            uf
          </text>
        </g>
      </Carry>

      {/* 2. pit stop: the process waits while the crew works, then gets its bolt */}
      <g transform={`translate(${kx.toFixed(1)},${ky.toFixed(1)})`}>
        <Window dur={D} on={T.slow[1]} off={T.bolt + 0.01}>
          <Runner />
        </Window>
        <Window dur={D} on={T.bolt} off={T.exit[0] + 0.01}>
          <Runner fast />
          <circle r={26} fill="none" stroke={lit} strokeWidth={2} opacity={0.6} />
        </Window>
      </g>
      {crew.map((c, i) => (
        <Robot key={c.say} a={c.a} b={c.b} s={24} delay={i * 0.3} dur={D} work={[[T.crew[i], T.crew[i] + 0.06]]} />
      ))}
      {crew.map((_, i) => (
        <Sparks key={i} x={kx + (i - 1) * 16} y={ky - 10} dur={D} on={T.crew[i]} off={T.crew[i] + 0.06} />
      ))}
      {/* one bubble over the pit names each fix while it happens */}
      {crew.map((c, i) => (
        <Bubble key={c.say} a={pit.a} b={pit.b} z={74} dur={D} on={T.crew[i]} off={T.crew[i] + 0.06} accent>
          {c.say}
        </Bubble>
      ))}

      {/* 3. back on track: three laps in a fifth of the time */}
      <Carry d={pitExit} dur={D} from={T.exit[0]} to={T.exit[1]} linear>
        <Runner fast />
      </Carry>
      {T.laps.map((t) => (
        <Carry key={t} d={fastLap} dur={D} from={t} to={t + LAP} linear>
          <Runner fast />
        </Carry>
      ))}
    </>
  )
}

export const showScenes: Record<'eventos' | 'integraciones' | 'optimizaciones' | 'agentes' | 'legacy', ShowScene> = {
  eventos: {
    dur: SALE_DUR,
    view: [-366, -276, 790, 482],
    cams: [
      [0, -170, -70],
      [0.3, -170, -70],
      [0.4, 60, -90],
      [0.52, 60, -90],
      [0.6, 230, 20],
      [0.92, 230, 20],
    ],
    Art: SaleArt,
  },
  integraciones: {
    dur: INTEG_DUR,
    view: [-376, -286, 790, 482],
    cams: [
      [0, -100, -110],
      [0.12, -40, -50],
      [0.2, 140, -20],
      [0.38, 140, -20],
      [0.44, -170, -40],
      [0.56, -60, -10],
      [0.66, 40, 50],
      [0.92, 40, 50],
    ],
    Art: IntegrationsArt,
  },
  optimizaciones: {
    dur: OPT_DUR,
    view: [-404, -272, 820, 499],
    cams: [
      [0, -150, -80],
      [0.03, -150, -80],
      [0.18, 110, 30],
      [0.3, -100, 10],
      [0.34, -120, 40],
      [0.55, -120, 40],
      [0.62, -20, 10],
      [0.7, -20, 10],
      [0.76, 240, -120],
      [0.95, 240, -120],
    ],
    Art: OptimizationArt,
  },
  agentes: {
    dur: AGENTS_DUR,
    view: [-386, -298, 790, 482],
    cams: [
      [0, -130, -40],
      [0.18, -130, -40],
      [0.26, -40, -120],
      [0.46, -40, -120],
      [0.52, 90, -60],
      [0.68, 90, -60],
      [0.74, 40, 30],
      [0.86, 40, 30],
      [0.9, 110, 20],
      [0.98, 110, 20],
    ],
    Art: AgentsArt,
  },
  legacy: {
    dur: LEGACY_DUR,
    view: [-380, -272, 780, 476],
    cams: [
      [0, -150, -50],
      [0.22, -150, -50],
      [0.3, -30, -50],
      [0.38, 60, -60],
      [0.9, 60, -60],
    ],
    Art: LegacyArt,
  },
}
