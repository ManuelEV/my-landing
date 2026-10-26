import type { FC } from 'react'
import type { LogoId } from '../../content'
import {
  Box,
  Cylinder,
  DotFlash,
  FaceA,
  FaceB,
  LogoPin,
  Packet,
  Platform,
  Tag,
  TopFlash,
  TopRect,
  Wire,
  isoArc,
  isoPath,
  proj,
  unproj,
} from './iso'

/*
 * One isometric diagram per capability. Each one tells a short story on a
 * loop (a request, a message, a migration) and rests on the finished
 * diagram at time 0, which is what reduced motion shows.
 */

const lit = '#f2b544'
const dark = '#141414'

/* ---------- Microservices: a request enters the gateway, fans out to services and their own databases ---------- */

function Microservices() {
  const DUR = 6
  const services: { a: number; h: number; logo: LogoId }[] = [
    { a: -135, h: 56, logo: 'springboot' },
    { a: -70, h: 44, logo: 'go' },
    { a: -5, h: 64, logo: 'python' },
    { a: 60, h: 48, logo: 'springboot' },
  ]
  const SB = -60 // services sit between b = -60 and b = -20
  const DB = 10 // each service keeps its own database just in front of it
  const gw = { a: -140, b: 46, w: 240, d: 36, h: 22 }
  const mid = gw.a + gw.w / 2
  const wire = (s: { a: number }) => s.a + 8
  const db = (s: { a: number }) => s.a + 30

  return (
    <>
      <Platform />
      {services.map((s) => (
        <g key={`w${s.a}`}>
          <Wire d={isoPath([[wire(s), gw.b, 0], [wire(s), SB + 40, 0]])} />
          <Wire d={isoPath([[db(s), SB + 40, 0], [db(s), DB, 0]])} />
        </g>
      ))}
      <Wire d={isoPath([[mid, 150, 0], [mid, gw.b + gw.d, 0]])} lit />

      {services.map((s, i) => (
        <g key={s.a}>
          <Box a={s.a} b={SB} w={40} d={40} h={s.h} tone="soft">
            <FaceB b={SB + 40} a0={s.a + 8} a1={s.a + 32} z0={s.h - 14} z1={s.h - 8} fill={dark} />
            <FaceB b={SB + 40} a0={s.a + 8} a1={s.a + 22} z0={s.h - 24} z1={s.h - 18} fill={dark} />
          </Box>
          <TopFlash a={s.a} b={SB} z={s.h} w={40} d={40} dur={DUR} on={0.3 + i * 0.03} off={0.74} />
        </g>
      ))}
      {services.map((s, i) => (
        <Packet key={`db${s.a}`} d={isoPath([[db(s), SB + 40, 5], [db(s), DB - 6, 5]])} dur={DUR} from={0.36 + i * 0.03} to={0.46 + i * 0.03} size={8} />
      ))}
      {services.map((s) => (
        <Cylinder key={`c${s.a}`} a={db(s)} b={DB} r={12} h={22} />
      ))}

      <Box a={gw.a} b={gw.b} w={gw.w} d={gw.d} h={gw.h} tone="block">
        <FaceB b={gw.b + gw.d} a0={gw.a + 8} a1={gw.a + gw.w - 8} z0={8} z1={12} fill={dark} />
      </Box>
      <TopFlash a={gw.a} b={gw.b} z={gw.h} w={gw.w} d={gw.d} dur={DUR} on={0.13} off={0.32} />

      {services.map((s) => (
        <LogoPin key={`p${s.a}`} a={s.a + 20} b={SB + 20} z={s.h} logo={s.logo} />
      ))}
      <Tag a={gw.a + gw.w + 34} b={gw.b + gw.d / 2} z={0}>
        API Gateway
      </Tag>
      <g className="bob">
        <Tag a={130} b={-130} z={60} logo="kubernetes" accent>
          Kubernetes
        </Tag>
      </g>

      <Packet d={isoPath([[mid, 150, 5], [mid, gw.b + gw.d, 5]])} dur={DUR} from={0.02} to={0.13} />
      {services.map((s, i) => (
        <Packet key={`f${s.a}`} d={isoPath([[wire(s), gw.b, 5], [wire(s), SB + 40, 5]])} dur={DUR} from={0.16 + i * 0.03} to={0.3 + i * 0.03} />
      ))}
      {services.map((s, i) => (
        <Packet key={`r${s.a}`} d={isoPath([[wire(s), SB + 40, 5], [wire(s), gw.b, 5]])} dur={DUR} from={0.56 + i * 0.02} to={0.68 + i * 0.02} />
      ))}
      <Packet d={isoPath([[mid, gw.b + gw.d, 5], [mid, 150, 5]])} dur={DUR} from={0.76} to={0.88} />
    </>
  )
}

/* ---------- Events: a Kafka log streams to a consumer group; a RabbitMQ exchange routes to queues ---------- */

function Events() {
  const DUR = 6
  const STREAM = 4.8
  // Kafka rail, at the back
  const log = { a: -100, b: -122, w: 176, d: 42, h: 18 }
  const lanes = [-116, -103, -90]
  const kConsumers = [-134, -96]
  // RabbitMQ rail, in front
  const ex = { a: -82, b: 36, w: 34, d: 34 }
  const queues = [-12, 38, 88]
  const qa = -14
  const qw = 86

  return (
    <>
      <Platform />

      {/* Kafka */}
      <Wire d={isoPath([[-116, -100, 0], [log.a, -100, 0]])} />
      {kConsumers.map((b) => (
        <Wire key={b} d={isoPath([[log.a + log.w, b + 14, 0], [106, b + 14, 0]])} />
      ))}
      <Box a={-150} b={-118} w={34} d={36} h={46} tone="block">
        <FaceB b={-82} a0={-144} a1={-122} z0={30} z1={36} fill={dark} />
      </Box>
      <Box a={log.a} b={log.b} w={log.w} d={log.d} h={log.h} tone="soft" />
      {lanes.map((b) => (
        <TopRect key={b} a={log.a + 4} b={b} w={log.w - 8} d={9} z={log.h} fill="#1b1b1b" />
      ))}
      {lanes.map((b, k) =>
        [0, 1, 2].map((j) => (
          <Packet
            key={`${b}-${j}`}
            d={isoPath([[log.a + 8, b + 4.5, log.h + 4], [log.a + log.w - 8, b + 4.5, log.h + 4]])}
            dur={STREAM}
            from={0}
            to={1}
            size={8}
            linear
            begin={-(k * 0.55 + j * (STREAM / 3))}
          />
        )),
      )}
      {kConsumers.map((b, i) => (
        <g key={b}>
          <Box a={106} b={b} w={30} d={28} h={34} tone="block" />
          <TopFlash a={106} b={b} z={34} w={30} d={28} dur={DUR / 2} on={0.1 + i * 0.4} off={0.5 + i * 0.4} />
        </g>
      ))}
      <Tag a={-12} b={-101} z={70} logo="kafka">
        Kafka
      </Tag>

      {/* RabbitMQ */}
      <Wire d={isoPath([[-116, 53, 0], [ex.a, 53, 0]])} />
      {queues.map((b) => (
        <g key={b}>
          <Wire d={isoPath([[ex.a + ex.w, 53, 0], [-31, 53, 0], [-31, b + 8, 0], [qa, b + 8, 0]])} />
          <Wire d={isoPath([[qa + qw, b + 8, 0], [92, b + 8, 0]])} />
        </g>
      ))}
      <Box a={-150} b={35} w={34} d={36} h={40} tone="block">
        <FaceB b={71} a0={-144} a1={-122} z0={24} z1={30} fill={dark} />
      </Box>
      <Packet d={isoPath([[-116, 53, 5], [ex.a, 53, 5]])} dur={DUR} from={0.04} to={0.16} />
      <Box a={ex.a} b={ex.b} w={ex.w} d={ex.d} h={30} tone="accent" />
      {queues.map((b, k) => (
        <Packet
          key={`x${b}`}
          d={isoPath([[ex.a + ex.w, 53, 5], [-31, 53, 5], [-31, b + 8, 5], [qa, b + 8, 5]])}
          dur={DUR}
          from={0.2 + k * 0.04}
          to={0.32 + k * 0.04}
        />
      ))}
      {queues.map((b, k) => (
        <g key={b}>
          <Box a={qa} b={b} w={qw} d={16} h={12} tone="soft" />
          {[0, 1, 2, 3].map((s) => (
            <TopRect key={s} a={qa + 6 + s * 20} b={b + 4} w={14} d={8} z={12} fill={s < 3 - k ? '#3a3a3a' : '#1b1b1b'} />
          ))}
          <Box a={92} b={b - 6} w={28} d={28} h={30} tone="block" />
          <TopFlash a={92} b={b - 6} z={30} w={28} d={28} dur={DUR} on={0.6 + k * 0.05} off={0.94} />
        </g>
      ))}
      {queues.map((b, k) => (
        <Packet
          key={`q${b}`}
          d={isoPath([[qa + 4, b + 8, 17], [qa + qw - 4, b + 8, 17], [96, b + 8, 17]])}
          dur={DUR}
          from={0.34 + k * 0.05}
          to={0.6 + k * 0.05}
          size={8}
        />
      ))}
      <Tag a={-64} b={54} z={86} logo="rabbitmq">
        RabbitMQ
      </Tag>
    </>
  )
}

/* ---------- Legacy: pieces of a Delphi monolith move, one by one, into modern services ---------- */

function Legacy() {
  const DUR = 8
  const mono = { a: -150, b: 0, w: 90, d: 120, h: 130 }
  const top: [number, number, number] = [mono.a + mono.w / 2, mono.b + mono.d / 2, mono.h]
  const services: { a: number; b: number; h: number; logo: LogoId }[] = [
    { a: -40, b: -124, h: 44, logo: 'springboot' },
    { a: 14, b: -124, h: 58, logo: 'go' },
    { a: 68, b: -124, h: 50, logo: 'python' },
    { a: 122, b: -124, h: 40, logo: 'react' },
  ]
  const F = mono.b + mono.d // front left face of the monolith
  const A = mono.a + mono.w // front right face

  return (
    <>
      <Platform />
      <Wire d={isoPath([[A, 60, 0], [-10, 60, 0], [-10, -84, 0]])} lit />
      {services.map((s) => (
        <Wire key={s.a} d={isoPath([[s.a + 14, -70, 0], [s.a + 14, -84, 0]])} />
      ))}
      <Wire d={isoPath([[-26, -70, 0], [136, -70, 0]])} />

      <Box a={mono.a} b={mono.b} w={mono.w} d={mono.d} h={mono.h} tone="block">
        {/* an old desktop form: title bar, fields and buttons */}
        <FaceB b={F} a0={mono.a + 8} a1={A - 8} z0={22} z1={118} fill={dark} />
        <FaceB b={F} a0={mono.a + 8} a1={A - 8} z0={106} z1={118} fill="#2f2f2f" />
        <FaceB b={F} a0={A - 18} a1={A - 11} z0={109} z1={115} fill={lit} />
        {[0, 1, 2].map((r) => (
          <g key={r}>
            <FaceB b={F} a0={mono.a + 14} a1={mono.a + 32} z0={86 - r * 18} z1={92 - r * 18} fill="#3a3a3a" />
            <FaceB b={F} a0={mono.a + 36} a1={A - 14} z0={84 - r * 18} z1={94 - r * 18} fill="#202020" />
          </g>
        ))}
        <FaceB b={F} a0={A - 40} a1={A - 14} z0={30} z1={40} fill="#3a3a3a" />
        {/* code columns on the side */}
        {[0, 1, 2, 3, 4, 5].map((r) => (
          <FaceA key={r} a={A} b0={mono.b + 10} b1={mono.b + 30 + ((r * 37) % 70)} z0={100 - r * 14} z1={104 - r * 14} fill="#1a1a1a" />
        ))}
      </Box>

      {services.map((s, i) => (
        <g key={s.logo + s.a}>
          <Box a={s.a} b={s.b} w={28} d={40} h={s.h} tone="soft">
            <FaceB b={s.b + 40} a0={s.a + 6} a1={s.a + 22} z0={s.h - 14} z1={s.h - 8} fill={dark} />
          </Box>
          <TopFlash a={s.a} b={s.b} z={s.h} w={28} d={40} dur={DUR} on={0.2 + i * 0.2} off={0.97} />
        </g>
      ))}
      {services.map((_, i) => (
        <TopFlash key={i} a={mono.a} b={mono.b} z={mono.h} w={mono.w} d={mono.d} dur={DUR} on={0.04 + i * 0.2} off={0.16 + i * 0.2} />
      ))}

      <Tag a={top[0]} b={top[1]} z={mono.h + 34} logo="delphi">
        Delphi
      </Tag>
      {services.map((s) => (
        <LogoPin key={`p${s.logo}${s.a}`} a={s.a + 14} b={s.b + 20} z={s.h} logo={s.logo} />
      ))}
      <g className="bob">
        <Tag a={90} b={40} z={8} accent>
          misma funcionalidad
        </Tag>
      </g>

      {services.map((s, i) => (
        <Packet key={i} d={isoArc(top, [s.a + 14, s.b + 20, s.h + 6], 70)} dur={DUR} from={0.05 + i * 0.2} to={0.2 + i * 0.2} size={14} />
      ))}
    </>
  )
}

/* ---------- ERP: Oracle EBS racks hand data to Fusion Cloud, which feeds a serverless mirror ---------- */

function Erp() {
  const DUR = 7
  const racks = [-150, -116, -82]
  const RB = 18
  const RD = 44
  const RH = 120
  const cloud = { a: 10, b: -140, w: 130, d: 100, z: 112 }
  const cloudTop: [number, number, number] = [cloud.a + 66, cloud.b + 52, cloud.z + 24]
  const chainA = 106
  const replica = isoPath([[chainA, cloud.b + cloud.d, cloud.z - 4], [chainA, cloud.b + cloud.d, 5], [chainA, 90, 5]])
  const [mx, my] = [-14, -204] // label position on the bridge, in screen space
  const [la, lb] = unproj(mx, my)

  return (
    <>
      <Platform />
      {/* shadow of the floating cloud */}
      <TopRect a={cloud.a} b={cloud.b} w={cloud.w} d={cloud.d} fill="#191919" />
      <Wire d={replica} lit />
      <Packet d={replica} dur={DUR} from={0.52} to={0.86} />

      {racks.map((a, i) => (
        <Box key={a} a={a} b={RB} w={28} d={RD} h={RH} tone="block">
          {[0, 1, 2, 3, 4, 5, 6].map((k) => (
            <g key={k}>
              <FaceB b={RB + RD} a0={a + 4} a1={a + 24} z0={10 + k * 15} z1={20 + k * 15} fill={dark} />
              <FaceB
                b={RB + RD}
                a0={a + 18}
                a1={a + 22}
                z0={13 + k * 15}
                z1={17 + k * 15}
                fill={lit}
                className="led"
                // a stable, uneven blink pattern across the racks
                style={{ animationDelay: `${((i * 7 + k * 3) % 9) * 0.23}s` }}
              />
            </g>
          ))}
        </Box>
      ))}

      {/* the mirror: queue, function and MongoDB */}
      <Box a={chainA - 11} b={-24} w={22} d={44} h={14} tone="soft" />
      <Box a={chainA - 14} b={38} w={28} d={28} h={26} tone="accent" />
      <Cylinder a={chainA} b={100} r={18} h={34} />

      <g className="bob">
        <Box a={cloud.a} b={cloud.b} z={cloud.z} w={cloud.w} d={cloud.d} h={12} tone="soft" />
        <Box a={cloud.a + 14} b={cloud.b + 12} z={cloud.z + 12} w={36} d={34} h={24} tone="block" />
        <Box a={cloud.a + 66} b={cloud.b + 12} z={cloud.z + 12} w={50} d={34} h={32} tone="block" />
        <Box a={cloud.a + 14} b={cloud.b + 58} z={cloud.z + 12} w={36} d={30} h={16} tone="accent" />
        <Box a={cloud.a + 66} b={cloud.b + 58} z={cloud.z + 12} w={50} d={30} h={22} tone="block" />
        <TopFlash a={cloud.a + 66} b={cloud.b + 12} z={cloud.z + 44} w={50} d={34} dur={DUR} on={0.3} off={0.6} />
        <Tag a={cloudTop[0] + 40} b={cloudTop[1] - 20} z={cloud.z + 100} logo="oracle">
          Fusion Cloud
        </Tag>
      </g>

      <Wire d={isoArc([-102, RB + RD / 2, RH], cloudTop, 70)} lit />
      {racks.map((a, i) => (
        <Packet key={a} d={isoArc([a + 14, RB + RD / 2, RH], cloudTop, 70)} dur={DUR} from={0.04 + i * 0.08} to={0.28 + i * 0.08} />
      ))}
      <Tag a={la} b={lb} z={0}>
        SOAP y REST
      </Tag>
      <Tag a={-100} b={118} z={0} logo="oracle">
        EBS on premise
      </Tag>
      <Tag a={chainA + 64} b={40} z={14} logo="aws">
        SQS y Lambda
      </Tag>
      <Tag a={60} b={160} z={0} logo="mongodb">
        MongoDB
      </Tag>
      <TopFlash a={chainA - 14} b={38} z={26} w={28} d={28} dur={DUR} on={0.7} off={0.95} />
    </>
  )
}

/* ---------- Agents: agents read the repositories and write what they learn to a graph and to embeddings ---------- */

const graphNodes: [number, number, number][] = [
  [0, 0, 13],
  [-62, -26, 9],
  [52, -44, 10],
  [-40, 42, 9],
  [64, 26, 8],
  [6, -82, 8],
  [-96, 14, 7],
  [100, -18, 7],
]
const graphEdges: [number, number][] = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [2, 5],
  [1, 5],
  [1, 6],
  [3, 6],
  [2, 7],
  [4, 7],
]

function Agents() {
  const DUR = 7
  const orch = { a: -62, b: -22, w: 40, d: 40, h: 36 }
  const oc: [number, number] = [orch.a + 20, orch.b + 20]
  const agents = [
    { a: 6, b: -124 },
    { a: 40, b: -54 },
    { a: -10, b: 50 },
  ]
  const graph: [number, number, number] = [104, -40, 168]
  const [gx, gy] = proj(...graph)
  const field = { a: 70, b: 16 }
  const bars = [22, 36, 14, 30, 40, 18, 28, 12, 16, 32, 24, 38, 30, 12, 26, 20]

  return (
    <>
      <Platform />
      <Wire d={isoPath([[-100, 50, 0], [oc[0], 50, 0], [oc[0], oc[1], 0]])} lit />
      {agents.map((g) => (
        <Wire key={g.a} d={isoPath([[oc[0], oc[1], 0], [g.a + 14, oc[1], 0], [g.a + 14, g.b + 14, 0]])} />
      ))}
      <Wire d={isoPath([[agents[2].a + 28, agents[2].b + 14, 0], [field.a - 10, agents[2].b + 14, 0], [field.a - 10, field.b + 30, 0], [field.a, field.b + 30, 0]])} />

      {/* repositories */}
      {[0, 1, 2].map((k) => (
        <Box key={k} a={-150} b={20} z={k * 14} w={50} d={60} h={10} tone={k === 1 ? 'block' : 'soft'} />
      ))}

      {agents.slice(0, 2).map((g, i) => (
        <Agent key={g.a} {...g} dur={DUR} on={0.3 + i * 0.04} />
      ))}
      <Box a={orch.a} b={orch.b} w={orch.w} d={orch.d} h={orch.h} tone="accent">
        <FaceB b={orch.b + orch.d} a0={orch.a + 8} a1={orch.a + 15} z0={20} z1={27} fill="#000" />
        <FaceB b={orch.b + orch.d} a0={orch.a + 25} a1={orch.a + 32} z0={20} z1={27} fill="#000" />
      </Box>
      <Agent {...agents[2]} dur={DUR} on={0.38} />

      {/* embeddings: a field of vector components */}
      {bars.map((h, i) => {
        const r = Math.floor(i / 4)
        const c = i % 4
        return (
          <g key={i}>
            <Box a={field.a + c * 20} b={field.b + r * 18} w={14} d={12} h={h} tone={i % 5 === 2 ? 'accent' : 'soft'} />
            {i % 3 === 0 && <TopFlash a={field.a + c * 20} b={field.b + r * 18} z={h} w={14} d={12} dur={DUR} on={0.52 + c * 0.02} off={0.85} />}
          </g>
        )
      })}

      <LogoPin a={-125} b={50} z={38} logo="gitlab" />
      <Tag a={oc[0] - 10} b={oc[1] - 10} z={orch.h + 40} logo="google">
        Google ADK
      </Tag>
      <Tag a={-70} b={120} z={0} logo="aws">
        Bedrock
      </Tag>
      <Tag a={field.a + 110} b={field.b + 50} z={0}>
        embeddings
      </Tag>

      {/* the knowledge graph, floating */}
      <line x1={gx} y1={gy + 40} x2={gx} y2={proj(graph[0], graph[1], 0)[1]} stroke="#2a2a2a" strokeWidth={2} strokeDasharray="4 6" />
      <g className="bob">
        {graphEdges.map(([p, q]) => (
          <line
            key={`${p}-${q}`}
            x1={gx + graphNodes[p][0]}
            y1={gy + graphNodes[p][1]}
            x2={gx + graphNodes[q][0]}
            y2={gy + graphNodes[q][1]}
            stroke="#3a3a3a"
            strokeWidth={2}
          />
        ))}
        {graphNodes.map(([x, y, r], i) => (
          <g key={i}>
            <circle cx={gx + x} cy={gy + y} r={r} fill={i === 0 ? lit : '#2a2a2a'} stroke={i === 0 ? 'none' : '#4a4a4a'} strokeWidth={1.5} />
            {i > 0 && i < 6 && <DotFlash x={gx + x} y={gy + y} r={r + 4} dur={DUR} on={0.5 + i * 0.04} off={0.9} />}
          </g>
        ))}
        <LogoPinScreen x={gx + 100} y={gy - 60} logo="neo4j" />
      </g>

      <Packet d={isoPath([[-100, 50, 5], [oc[0], 50, 5], [oc[0], oc[1] + 20, 5]])} dur={DUR} from={0.03} to={0.16} />
      {agents.map((g, i) => (
        <Packet
          key={`o${g.a}`}
          d={isoPath([[oc[0], oc[1], orch.h + 6], [g.a + 14, oc[1], 20], [g.a + 14, g.b + 14, 32]])}
          dur={DUR}
          from={0.18 + i * 0.04}
          to={0.3 + i * 0.04}
          size={8}
        />
      ))}
      {agents.slice(0, 2).map((g, i) => (
        <Packet key={`g${g.a}`} d={isoArc([g.a + 14, g.b + 14, 32], graph, 30)} dur={DUR} from={0.36 + i * 0.05} to={0.52 + i * 0.05} size={8} />
      ))}
      <Packet
        d={isoPath([[agents[2].a + 28, agents[2].b + 14, 5], [field.a - 10, agents[2].b + 14, 5], [field.a - 10, field.b + 30, 5], [field.a, field.b + 30, 5]])}
        dur={DUR}
        from={0.4}
        to={0.52}
        size={8}
      />
    </>
  )
}

/** A small agent: a box with two eyes on its front face. */
function Agent({ a, b, dur, on }: { a: number; b: number; dur: number; on: number }) {
  return (
    <g>
      <Box a={a} b={b} w={28} d={28} h={26} tone="block">
        <FaceB b={b + 28} a0={a + 6} a1={a + 11} z0={14} z1={19} fill={lit} />
        <FaceB b={b + 28} a0={a + 17} a1={a + 22} z0={14} z1={19} fill={lit} />
      </Box>
      <TopFlash a={a} b={b} z={26} w={28} d={28} dur={dur} on={on} off={0.8} />
    </g>
  )
}

/** LogoPin for a point given in screen space. */
function LogoPinScreen({ x, y, logo }: { x: number; y: number; logo: LogoId }) {
  const [a, b] = unproj(x, y)
  return <LogoPin a={a} b={b} logo={logo} stem={10} />
}

export const sceneArt: Record<string, FC> = {
  microservicios: Microservices,
  eventos: Events,
  legacy: Legacy,
  erp: Erp,
  agentes: Agents,
}
