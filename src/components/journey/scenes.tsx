import type { ReactNode } from 'react'
import { Beacon, Box, Cylinder, FaceA, FaceB, Platform, Tag, proj } from './iso'

const lit = '#f2b544'
const dark = '#0c0c0c'

/** Universidad de La Frontera: a faculty building and a DSL model that generates Spring Boot code. */
function Ufro() {
  return (
    <>
      <Platform />
      <Box a={-120} b={-120} w={150} d={90} h={110}>
        {[0, 1, 2, 3].map((k) =>
          [0, 1].map((row) => (
            <FaceB
              key={`${k}-${row}`}
              b={-30}
              a0={-108 + k * 34}
              a1={-90 + k * 34}
              z0={34 + row * 38}
              z1={56 + row * 38}
              fill={(k + row) % 3 === 0 ? lit : '#151515'}
              className={(k + row) % 3 === 0 ? 'opacity-80' : undefined}
            />
          )),
        )}
        <FaceA a={30} b0={-110} b1={-40} z0={34} z1={56} fill="#151515" />
        <FaceA a={30} b0={-110} b1={-40} z0={72} z1={94} fill="#151515" />
      </Box>
      <Box a={-128} b={-128} z={110} w={166} d={106} h={10} tone="soft" />
      <g className="bob">
        <Box a={50} b={-90} z={90} w={70} d={70} h={14} tone="accent" />
        <Tag a={85} b={-55} z={150}>MetaEdit+</Tag>
      </g>
      <path
        d={(() => {
          const [x0, y0] = proj(85, -55, 86)
          const [x1, y1] = proj(85, 60, 44)
          return `M${x0},${y0} C${x0},${y0 + 60} ${x1},${y1 - 60} ${x1},${y1}`
        })()}
        fill="none"
        stroke={lit}
        strokeWidth={2}
        className="marching"
      />
      <Box a={50} b={30} w={70} d={70} h={40} tone="soft" />
      <Tag a={85} b={65} z={70}>Spring Boot</Tag>
      <Box a={-140} b={60} w={24} d={24} h={18} tone="soft" />
      <Box a={-100} b={90} w={24} d={24} h={18} tone="soft" />
    </>
  )
}

/** Smart Araucanía: a small city, IoT antennas and FIWARE services in containers. */
function Smart() {
  return (
    <>
      <Platform />
      <Box a={-140} b={-140} w={60} d={60} h={130} />
      <Box a={-60} b={-140} w={50} d={50} h={86} tone="soft" />
      <Box a={60} b={-110} w={8} d={8} h={160} tone="soft" />
      <Beacon a={64} b={-106} z={168} />
      <Box a={-140} b={-60} w={50} d={60} h={64} tone="soft" />
      <Box a={-60} b={-60} w={60} d={60} h={44} />
      <Box a={-30} b={70} w={8} d={8} h={110} tone="soft" />
      <Beacon a={-26} b={74} z={118} />
      <Box a={40} b={30} w={60} d={34} h={26} tone="accent" />
      <Box a={40} b={30} z={26} w={60} d={34} h={26} />
      <Box a={40} b={70} w={60} d={34} h={26} />
      <Tag a={70} b={60} z={90}>FIWARE</Tag>
      <Beacon a={110} b={-30} r={4} />
      <Beacon a={-90} b={40} r={4} />
      <Tag a={-26} b={74} z={150} accent>
        IoT
      </Tag>
    </>
  )
}

/** CreaLab: a tablet and a phone running the same progressive web app. */
function Crealab() {
  const screen = (b: number, a0: number, a1: number, z0: number, z1: number) => {
    const h = z1 - z0
    const rows: ReactNode[] = []
    for (let i = 0; i < 4; i++) {
      const top = z1 - h * 0.22 - i * h * 0.19
      rows.push(<FaceB key={i} b={b} a0={a0 + 10} a1={a1 - 10 - (i % 2) * 30} z0={top - h * 0.12} z1={top} fill="#272727" />)
    }
    return (
      <>
        <FaceB b={b} a0={a0} a1={a1} z0={z0} z1={z1} fill={dark} />
        <FaceB b={b} a0={a0} a1={a1} z0={z1 - h * 0.1} z1={z1} fill={lit} />
        {rows}
      </>
    )
  }
  return (
    <>
      <Platform />
      <Box a={-110} b={-30} w={180} d={16} h={210} tone="soft">
        {screen(-14, -100, 60, 14, 196)}
      </Box>
      <Box a={60} b={50} w={64} d={10} h={120} tone="soft">
        {screen(60, 66, 118, 10, 110)}
      </Box>
      <g className="bob">
        <Tag a={-120} b={90} z={50} accent>
          PWA
        </Tag>
      </g>
      <Tag a={90} b={60} z={150}>Vue.js</Tag>
    </>
  )
}

/** Equifax: a Kubernetes cluster of services next to a PostgreSQL database. */
function Equifax() {
  const pods: ReactNode[] = []
  for (let s = 0; s <= 4; s++) {
    for (let i = 0; i < 3; i++) {
      const j = s - i
      if (j < 0 || j > 2) continue
      const active = (i * 3 + j) % 4 === 1
      pods.push(
        <Box
          key={`${i}-${j}`}
          a={-136 + i * 50}
          b={-136 + j * 50}
          z={10}
          w={36}
          d={36}
          h={active ? 54 : 38}
          tone={active ? 'accent' : 'block'}
        />,
      )
    }
  }
  return (
    <>
      <Platform />
      <Box a={-146} b={-146} w={160} d={160} h={10} tone="soft" />
      {pods}
      <Tag a={-60} b={-60} z={110}>AWS EKS</Tag>
      <Cylinder a={95} b={95} r={42} h={80} />
      <Tag a={150} b={20}>PostgreSQL</Tag>
      <g className="bob">
        <Tag a={100} b={-90} z={60} accent>
          90% cobertura
        </Tag>
      </g>
    </>
  )
}

/** Forus: a store, its inventory, the AWS serverless replica and a knowledge graph. */
function Forus() {
  const [gx, gy] = proj(-95, 105, 110)
  const nodes: [number, number][] = [
    [0, 0],
    [-46, -24],
    [44, -30],
    [-30, 34],
    [40, 30],
  ]
  return (
    <>
      <Platform size={160} />
      <Box a={60} b={-150} w={44} d={44} h={34} />
      <Box a={110} b={-150} w={44} d={44} h={34} tone="soft" />
      <Box a={60} b={-150} z={34} w={44} d={44} h={34} tone="soft" />
      <Box a={60} b={-100} w={44} d={44} h={34} tone="soft" />
      <Box a={-140} b={-90} w={160} d={110} h={90}>
        <FaceB b={20} a0={-80} a1={-48} z0={0} z1={46} fill={dark} />
        <FaceB b={20} a0={-130} a1={-94} z0={26} z1={56} fill={lit} className="opacity-80" />
        <FaceB b={20} a0={-34} a1={10} z0={26} z1={56} fill={lit} className="opacity-80" />
        <FaceA a={20} b0={-80} b1={10} z0={26} z1={60} fill="#151515" />
      </Box>
      <Box a={-140} b={20} z={64} w={160} d={18} h={8} tone="accent" />
      <Tag a={-60} b={-35} z={130}>Oracle Fusion</Tag>
      <g className="bob">
        <g transform={`translate(${gx},${gy})`} stroke="#9b9b9b" strokeWidth={1.5}>
          {nodes.slice(1).map(([x, y], i) => (
            <line key={i} x1={0} y1={0} x2={x} y2={y} />
          ))}
          <line x1={nodes[1][0]} y1={nodes[1][1]} x2={nodes[3][0]} y2={nodes[3][1]} />
          {nodes.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i === 0 ? 10 : 7} fill={i === 0 ? lit : '#3a3a3a'} stroke="#000" />
          ))}
        </g>
        <Tag a={-95} b={105} z={170}>Neo4j</Tag>
      </g>
      <Box a={70} b={50} w={50} d={50} h={24} tone="soft" />
      <Beacon a={95} b={75} z={30} r={5} />
      <g className="bob">
        <Tag a={105} b={-105} z={110} accent>
          AWS · SQS · Lambda
        </Tag>
      </g>
    </>
  )
}

export const sceneArt: Record<string, () => ReactNode> = {
  ufro: Ufro,
  smart: Smart,
  crealab: Crealab,
  equifax: Equifax,
  forus: Forus,
}
