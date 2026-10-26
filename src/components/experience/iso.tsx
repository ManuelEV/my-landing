import type { CSSProperties, ReactNode } from 'react'
import type { LogoId } from '../../content'
import { glyph } from './logos'

// Isometric projection. Ground axes a (down right) and b (down left), z up.
const COS = 0.866
const SIN = 0.5

export function proj(a: number, b: number, z = 0): [number, number] {
  return [(a - b) * COS, (a + b) * SIN - z]
}

/** The ground point (z = 0) under a screen position. */
export function unproj(x: number, y: number): [number, number] {
  const d = x / COS
  const s = y / SIN
  return [(s + d) / 2, (s - d) / 2]
}

const pts = (list: [number, number, number][]) =>
  list
    .map(([a, b, z]) => proj(a, b, z))
    .map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`)
    .join(' ')

export const tones = {
  ground: ['#1f1f1f', '#161616', '#101010'],
  block: ['#3a3a3a', '#2a2a2a', '#202020'],
  soft: ['#313131', '#262626', '#1c1c1c'],
  accent: ['#f2b544', '#c48e2c', '#9c6f1f'],
  light: ['#e4e4e0', '#b4b4b0', '#8a8a86'],
} as const

type Tone = keyof typeof tones

type BoxProps = {
  a: number
  b: number
  z?: number
  w: number
  d: number
  h: number
  tone?: Tone
  className?: string
  children?: ReactNode
}

/** A box resting on the ground plane; draws the three faces a viewer can see. */
export function Box({ a, b, z = 0, w, d, h, tone = 'block', className, children }: BoxProps) {
  const [top, left, right] = tones[tone]
  const A = a + w
  const B = b + d
  const Z = z + h
  return (
    <g className={className} stroke="#000" strokeWidth={1} strokeLinejoin="round">
      <polygon points={pts([[A, b, z], [A, B, z], [A, B, Z], [A, b, Z]])} fill={right} />
      <polygon points={pts([[a, B, z], [A, B, z], [A, B, Z], [a, B, Z]])} fill={left} />
      <polygon points={pts([[a, b, Z], [A, b, Z], [A, B, Z], [a, B, Z]])} fill={top} />
      {children}
    </g>
  )
}

/** A rectangle painted on the front left face (the plane b = const). */
export function FaceB({ b, a0, a1, z0, z1, fill, className, style }: { b: number; a0: number; a1: number; z0: number; z1: number; fill: string; className?: string; style?: CSSProperties }) {
  return <polygon className={className} style={style} points={pts([[a0, b, z0], [a1, b, z0], [a1, b, z1], [a0, b, z1]])} fill={fill} />
}

/** A rectangle painted on the front right face (the plane a = const). */
export function FaceA({ a, b0, b1, z0, z1, fill, className }: { a: number; b0: number; b1: number; z0: number; z1: number; fill: string; className?: string }) {
  return <polygon className={className} points={pts([[a, b0, z0], [a, b1, z0], [a, b1, z1], [a, b0, z1]])} fill={fill} />
}

/** A flat rectangle painted on a horizontal plane at height z. */
export function TopRect({ a, b, w, d, z = 0, fill, className }: { a: number; b: number; w: number; d: number; z?: number; fill: string; className?: string }) {
  return <polygon className={className} points={pts([[a, b, z], [a + w, b, z], [a + w, b + d, z], [a, b + d, z]])} fill={fill} />
}

/** A vertical cylinder, used for databases. */
export function Cylinder({ a, b, r, h, z = 0 }: { a: number; b: number; r: number; h: number; z?: number }) {
  const [cx, cy] = proj(a, b, z)
  const rx = r * 1.2247
  const ry = r * 0.7071
  return (
    <g stroke="#000" strokeWidth={1}>
      <path d={`M${cx - rx},${cy - h} V${cy} A${rx},${ry} 0 0 0 ${cx + rx},${cy} V${cy - h} Z`} fill="#262626" />
      <path d={`M${cx - rx},${cy - h * 0.5} A${rx},${ry} 0 0 0 ${cx + rx},${cy - h * 0.5}`} fill="none" stroke="#3a3a3a" />
      <ellipse cx={cx} cy={cy - h} rx={rx} ry={ry} fill="#3a3a3a" />
    </g>
  )
}

/** A small mono label pinned to a point, with an optional logo before the text. */
export function Tag({
  a,
  b,
  z = 0,
  children,
  accent = false,
  logo,
}: {
  a: number
  b: number
  z?: number
  children: string
  accent?: boolean
  logo?: LogoId
}) {
  const [x, y] = proj(a, b, z)
  const text = children.length * 8.4
  const w = text + 20 + (logo ? 24 : 0)
  return (
    <g transform={`translate(${x.toFixed(1)},${y.toFixed(1)})`}>
      <rect x={-w / 2} y={-14} width={w} height={28} rx={8} fill={accent ? '#f2b544' : '#181818'} stroke={accent ? 'none' : '#313131'} />
      {logo && (
        <g transform={`translate(${-w / 2 + 10},-8) scale(${16 / 24})`} fill={accent ? '#000' : '#f4f4f2'}>
          {glyph(logo)}
        </g>
      )}
      <text x={logo ? 12 : 0} y={5} textAnchor="middle" fontSize={14} className="font-mono" fill={accent ? '#000' : '#f4f4f2'}>
        {children}
      </text>
    </g>
  )
}

/** A round logo badge on a short stem, standing on a point. */
export function LogoPin({ a, b, z = 0, logo, stem = 26, r = 18 }: { a: number; b: number; z?: number; logo: LogoId; stem?: number; r?: number }) {
  const [x, y] = proj(a, b, z)
  const cy = y - stem - r
  const s = r * 1.1
  return (
    <g>
      <line x1={x} y1={y} x2={x} y2={cy + r} stroke="#3a3a3a" strokeWidth={2} />
      <circle cx={x} cy={y} r={3} fill="#3a3a3a" />
      <circle cx={x} cy={cy} r={r} fill="#181818" stroke="#3a3a3a" strokeWidth={1.5} />
      <g transform={`translate(${(x - s / 2).toFixed(1)},${(cy - s / 2).toFixed(1)}) scale(${s / 24})`} fill="#f4f4f2">
        {glyph(logo)}
      </g>
    </g>
  )
}

/** Live indicator: a dot with an expanding ring. */
export function Beacon({ a, b, z = 0, r = 6 }: { a: number; b: number; z?: number; r?: number }) {
  const [x, y] = proj(a, b, z)
  return (
    <g>
      <circle className="pulse-ring helper" cx={x} cy={y} r={r} fill="#f2b544" />
      <circle cx={x} cy={y} r={r} fill="#f2b544" />
    </g>
  )
}

/** The island every scene sits on. Its top face is the plane z = 0. */
export function Platform({ size = 150 }: { size?: number }) {
  return <Box a={-size} b={-size} z={-20} w={size * 2} d={size * 2} h={20} tone="ground" />
}

type P3 = [a: number, b: number, z: number]

/** A polyline through ground points, in screen space. */
export function isoPath(points: P3[]) {
  return points
    .map(([a, b, z], i) => {
      const [x, y] = proj(a, b, z)
      return `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
}

/** A curve that jumps from one point to another, rising `lift` pixels above both. */
export function isoArc(from: P3, to: P3, lift: number) {
  const [x0, y0] = proj(...from)
  const [x1, y1] = proj(...to)
  const top = Math.min(y0, y1) - lift
  return `M${x0.toFixed(1)},${y0.toFixed(1)} C${x0.toFixed(1)},${top.toFixed(1)} ${x1.toFixed(1)},${top.toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)}`
}

/** A wire drawn on the ground or in the air, with marching dashes. */
export function Wire({ d, lit = false }: { d: string; lit?: boolean }) {
  return <path d={d} fill="none" stroke={lit ? '#6b5427' : '#3a3a3a'} strokeWidth={2} className="marching" />
}

/**
 * A message: a small accent cube that rides a path once per cycle, between
 * two fractions of the cycle. Hidden at time 0, so a paused story shows the
 * finished design.
 */
export function Packet({
  d,
  dur,
  from,
  to,
  size = 10,
  begin = 0,
  linear = false,
  tone = 'accent',
}: {
  d: string
  dur: number
  from: number
  to: number
  size?: number
  /** seconds; negative values start the loop part way through */
  begin?: number
  linear?: boolean
  tone?: Tone
}) {
  const h = size / 2
  return (
    <g className="helper" opacity={0}>
      <animateMotion
        path={d}
        dur={`${dur}s`}
        begin={`${begin}s`}
        repeatCount="indefinite"
        calcMode="spline"
        keyPoints="0;0;1;1"
        keyTimes={`0;${from};${to};1`}
        keySplines={linear ? '0 0 1 1;0 0 1 1;0 0 1 1' : '0 0 1 1;0.65 0 0.35 1;0 0 1 1'}
      />
      <animate
        attributeName="opacity"
        dur={`${dur}s`}
        begin={`${begin}s`}
        repeatCount="indefinite"
        values="0;0;1;1;0;0"
        keyTimes={`0;${from};${from + 0.01};${to - 0.01};${to};1`}
      />
      {tone === 'accent' && <circle r={size * 1.3} fill="#f2b544" opacity={0.18} />}
      <Box a={-h} b={-h} z={-h} w={size} d={size} h={size} tone={tone} />
    </g>
  )
}

/** The top face of a box turns accent between two fractions of the cycle, then fades. */
export function TopFlash({ a, b, z, w, d, dur, on, off }: { a: number; b: number; z: number; w: number; d: number; dur: number; on: number; off: number }) {
  return (
    <polygon className="helper" points={pts([[a, b, z], [a + w, b, z], [a + w, b + d, z], [a, b + d, z]])} fill="#f2b544" opacity={0}>
      <animate
        attributeName="opacity"
        dur={`${dur}s`}
        repeatCount="indefinite"
        values="0;0;0.85;0.85;0;0"
        keyTimes={`0;${on};${on + 0.02};${Math.max(on + 0.03, off - 0.12)};${off};1`}
      />
    </polygon>
  )
}

/** A screen space dot that lights between two fractions of the cycle. */
export function DotFlash({ x, y, r, dur, on, off }: { x: number; y: number; r: number; dur: number; on: number; off: number }) {
  return (
    <circle className="helper" cx={x} cy={y} r={r} fill="none" stroke="#f2b544" strokeWidth={3} opacity={0}>
      <animate
        attributeName="opacity"
        dur={`${dur}s`}
        repeatCount="indefinite"
        values="0;0;1;1;0;0"
        keyTimes={`0;${on};${on + 0.02};${Math.max(on + 0.03, off - 0.12)};${off};1`}
      />
    </circle>
  )
}

/**
 * Shows its children only between two fractions of the cycle (or hides them
 * then, with `invert`). Fades take 2% of the cycle.
 */
export function Window({ dur, on, off, invert = false, children }: { dur: number; on: number; off: number; invert?: boolean; children: ReactNode }) {
  return (
    <g opacity={invert ? 1 : 0}>
      <animate
        attributeName="opacity"
        dur={`${dur}s`}
        repeatCount="indefinite"
        values={invert ? '1;1;0;0;1;1' : '0;0;1;1;0;0'}
        keyTimes={`0;${on};${on + 0.02};${off - 0.02};${off};1`}
      />
      {children}
    </g>
  )
}
