import type { ReactNode } from 'react'
import {
  siApachekafka,
  siClaude,
  siDelphi,
  siDocker,
  siGitlab,
  siGo,
  siGoogle,
  siKubernetes,
  siMongodb,
  siNeo4j,
  siPostgresql,
  siPython,
  siRabbitmq,
  siReact,
  siRedis,
  siJenkins,
  siJunit5,
  siNextdotjs,
  siOpenjdk,
  siShopify,
  siSonarqubeserver,
  siTailwindcss,
  siSpringboot,
  siVtex,
  siVuedotjs,
} from 'simple-icons'
import type { LogoId } from '../../content'

/*
 * Monochrome technology marks on a 24x24 grid, drawn with currentColor.
 * Paths come from Simple Icons (CC0). Oracle and AWS are not in that set,
 * so they are simple drawings of their marks.
 */

const paths: Partial<Record<LogoId, string>> = {
  kafka: siApachekafka.path,
  rabbitmq: siRabbitmq.path,
  springboot: siSpringboot.path,
  go: siGo.path,
  python: siPython.path,
  react: siReact.path,
  docker: siDocker.path,
  kubernetes: siKubernetes.path,
  postgresql: siPostgresql.path,
  redis: siRedis.path,
  mongodb: siMongodb.path,
  neo4j: siNeo4j.path,
  gitlab: siGitlab.path,
  google: siGoogle.path,
  delphi: siDelphi.path,
  claude: siClaude.path,
  vtex: siVtex.path,
  shopify: siShopify.path,
  java: siOpenjdk.path,
  nextjs: siNextdotjs.path,
  vue: siVuedotjs.path,
  tailwind: siTailwindcss.path,
  jenkins: siJenkins.path,
  sonarqube: siSonarqubeserver.path,
  junit: siJunit5.path,
}

/** The logo drawn in a 24x24 box. Works inside any svg. */
export function glyph(id: LogoId): ReactNode {
  if (id === 'oracle') {
    // the Oracle ring: a stadium outline
    return (
      <path
        fillRule="evenodd"
        d="M7 6h10a6 6 0 0 1 0 12H7A6 6 0 0 1 7 6Zm.4 2.6a3.4 3.4 0 0 0 0 6.8h9.2a3.4 3.4 0 0 0 0-6.8Z"
      />
    )
  }
  if (id === 'spark') {
    // a four point spark, for generative AI
    return <path d="M12 1.5l2.4 8.1 8.1 2.4-8.1 2.4L12 22.5l-2.4-8.1L1.5 12l8.1-2.4Z" />
  }
  if (id === 'store') {
    // a storefront: awning over a shop with a door
    return (
      <>
        <path d="M4.2 3h15.6l2.2 6.2a3 3 0 0 1-5 2.3 3 3 0 0 1-5 0 3 3 0 0 1-5 0 3 3 0 0 1-5-2.3Z" />
        <path fillRule="evenodd" d="M4 13.2h16V21H4Zm6 2.3v5.5h4v-5.5Z" />
      </>
    )
  }
  if (id === 'excel') {
    // a spreadsheet tile with an X
    return (
      <>
        <rect x={3} y={3} width={18} height={18} rx={3.5} />
        <path d="M8.5 8.5l7 7M15.5 8.5l-7 7" fill="none" stroke="#181818" strokeWidth={2.6} strokeLinecap="round" />
      </>
    )
  }
  if (id === 'aws') {
    return (
      <>
        <text x={12} y={13} textAnchor="middle" fontSize={10.5} fontWeight={700} letterSpacing={-0.4} fontFamily="Geist Variable, sans-serif">
          aws
        </text>
        <path d="M3.6 15.8c4.9 3.1 11.9 3.1 16.8 0" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" />
        <path d="M17.7 14.8l2.9.9-.8 2.9" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
      </>
    )
  }
  return <path d={paths[id]} />
}

/** Inline logo for HTML. */
export function LogoIcon({ id, size = 16, className }: { id: LogoId; size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" className={className}>
      {glyph(id)}
    </svg>
  )
}
