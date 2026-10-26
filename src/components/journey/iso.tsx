import type { ReactNode } from 'react'

// Isometric projection. Ground axes a (down right) and b (down left), z up.
const COS = 0.866
const SIN = 0.5

export function proj(a: number, b: number, z = 0): [number, number] {
  return [(a - b) * COS, (a + b) * SIN - z]
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
export function FaceB({ b, a0, a1, z0, z1, fill, className }: { b: number; a0: number; a1: number; z0: number; z1: number; fill: string; className?: string }) {
  return <polygon className={className} points={pts([[a0, b, z0], [a1, b, z0], [a1, b, z1], [a0, b, z1]])} fill={fill} />
}

/** A rectangle painted on the front right face (the plane a = const). */
export function FaceA({ a, b0, b1, z0, z1, fill, className }: { a: number; b0: number; b1: number; z0: number; z1: number; fill: string; className?: string }) {
  return <polygon className={className} points={pts([[a, b0, z0], [a, b1, z0], [a, b1, z1], [a, b0, z1]])} fill={fill} />
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

/** A small mono label pinned to a ground point. */
export function Tag({ a, b, z = 0, children, accent = false }: { a: number; b: number; z?: number; children: string; accent?: boolean }) {
  const [x, y] = proj(a, b, z)
  const w = children.length * 8.4 + 20
  return (
    <g transform={`translate(${x.toFixed(1)},${y.toFixed(1)})`}>
      <rect x={-w / 2} y={-14} width={w} height={28} rx={8} fill={accent ? '#f2b544' : '#181818'} stroke={accent ? 'none' : '#313131'} />
      <text x={0} y={5} textAnchor="middle" fontSize={14} className="font-mono" fill={accent ? '#000' : '#f4f4f2'}>
        {children}
      </text>
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
