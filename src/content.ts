// Todo el texto del sitio vive aquí. Fuente: CV de Manuel Espinoza.
// Regla de estilo: sin guiones dentro del texto, oraciones en sentence case.

export const profile = {
  name: 'Manuel Espinoza',
  fullName: 'Manuel Alejandro Espinoza Valenzuela',
  role: 'Ingeniero de software',
  location: 'Temuco, Chile',
  email: 'manuelespv@gmail.com',
  linkedin: 'https://www.linkedin.com/in/manuelespv/',
}

export const nav = [
  { id: 'stack', label: 'Stack' },
  { id: 'experiencia', label: 'Experiencia' },
]

export const hero = {
  eyebrow: `${profile.role} senior`,
  eyebrowPlace: ` · ${profile.location}`,
  headline: ['Manuel Espinoza'],
  sub: 'Ingeniero de software senior con más de 6 años construyendo soluciones a nivel empresarial. Trabajo con distintos tipos de arquitectura y he participado en grandes proyectos de modernización de sistemas legacy, migraciones, integraciones y sistemas multiagente.',
  proofLabel: 'He construido software para',
  companies: ['Forus', 'Equifax', 'CreaLab', 'Smart Araucanía', 'Universidad de La Frontera'],
}

/** Diagrama del inicio: título del cuadro y sus pestañas. El dibujo de cada una está en src/components/showcase/scenes.tsx */
export const showcaseTitle = 'Así funcionan los sistemas que construyo'

export const showcase = [
  {
    id: 'eventos',
    label: 'Eventos',
    short: 'Eventos',
    title: 'Arquitectura orientada a eventos',
    caption:
      'Una venta entra a Kafka y el servicio de stock la procesa: actualiza Oracle y MongoDB, y RabbitMQ lleva el nuevo stock a VTEX, Shopify y los marketplaces.',
  },
  {
    id: 'integraciones',
    label: 'Integraciones',
    short: 'Integración',
    title: 'Integración de datos empresariales',
    caption:
      'Una planilla de productos se valida y se publica en VTEX, Shopify y marketplaces; una de órdenes de compra entra a Oracle Fusion. Cada pieza encaja en su lugar.',
  },
  {
    id: 'optimizaciones',
    label: 'Optimizaciones',
    short: 'Rendimiento',
    title: 'Optimización de rendimiento',
    caption:
      'Un proceso lento entra a pits: el equipo le agrega caché con Redis, optimiza las consultas y ajusta el pool de conexiones. Sale con 80% menos tiempo.',
  },
  {
    id: 'agentes',
    label: 'Agentes',
    short: 'Agentes',
    title: 'Sistemas multiagente',
    caption:
      'Un orquestador reparte un bug: un agente busca contexto en el grafo de conocimiento, otro escribe el fix y otro lo revisa antes de abrir el pull request.',
  },
  {
    id: 'legacy',
    label: 'Modernización',
    short: 'Legacy',
    title: 'Modernización de código legacy',
    caption:
      'El código Delphi se lee línea por línea, pasa por una migración gradual y vuelve a la vida como servicios modernos sobre Kubernetes.',
  },
] as const

/** Logos disponibles en src/components/experience/logos.tsx */
export type LogoId =
  | 'kafka'
  | 'rabbitmq'
  | 'oracle'
  | 'aws'
  | 'springboot'
  | 'go'
  | 'python'
  | 'react'
  | 'docker'
  | 'kubernetes'
  | 'postgresql'
  | 'redis'
  | 'mongodb'
  | 'neo4j'
  | 'gitlab'
  | 'google'
  | 'delphi'
  | 'claude'
  | 'vtex'
  | 'shopify'
  | 'store'
  | 'excel'
  | 'java'
  | 'nextjs'
  | 'vue'
  | 'tailwind'
  | 'jenkins'
  | 'sonarqube'
  | 'junit'
  | 'spark'

export type Capability = {
  id: string
  /** Etiqueta corta que se ve bajo la escena */
  label: string
  kicker: string
  title: string
  summary: string
  points: string[]
  where: string
  stack: { label: string; logo?: LogoId }[]
}

export const experience: Capability[] = [
  {
    id: 'microservicios',
    label: 'microservicios',
    kicker: 'Arquitectura distribuida',
    title: 'Microservicios',
    summary: 'Dividí sistemas grandes en servicios pequeños, cada uno con sus datos, que se despliegan y escalan por separado.',
    points: [
      'Spring Boot y Go en contenedores sobre AWS EKS',
      'Evaluación de riesgo crediticio y catálogo multicanal en producción',
      'Más del 90% de cobertura con pruebas automatizadas',
    ],
    where: 'Forus, Equifax y Smart Araucanía',
    stack: [
      { label: 'Spring Boot', logo: 'springboot' },
      { label: 'Go', logo: 'go' },
      { label: 'Kubernetes', logo: 'kubernetes' },
      { label: 'Docker', logo: 'docker' },
      { label: 'Redis', logo: 'redis' },
    ],
  },
  {
    id: 'eventos',
    label: 'eventos',
    kicker: 'Integración asíncrona',
    title: 'Arquitectura orientada a eventos',
    summary: 'Conecté sistemas con eventos y colas para que cada parte reaccione a tiempo, sin esperar a que las demás respondan.',
    points: [
      'Kafka para flujos de eventos y RabbitMQ para colas de trabajo',
      'SNS y SQS en la réplica del ERP',
      'Sincronización de inventario en tiempo real',
    ],
    where: 'Forus',
    stack: [
      { label: 'Apache Kafka', logo: 'kafka' },
      { label: 'RabbitMQ', logo: 'rabbitmq' },
      { label: 'SNS y SQS', logo: 'aws' },
    ],
  },
  {
    id: 'legacy',
    label: 'modernización',
    kicker: 'Código legacy',
    title: 'De legacy a código moderno',
    summary: 'Llevé aplicaciones antiguas a lenguajes actuales sin perder lo que el negocio ya hacía bien.',
    points: [
      'Aplicaciones Delphi reescritas en Spring Boot, Go, Python y React',
      'Compatibilidad funcional para que los usuarios no noten el cambio',
      'Reemplazo por partes, conviviendo con el sistema anterior',
    ],
    where: 'Forus',
    stack: [
      { label: 'Delphi', logo: 'delphi' },
      { label: 'Spring Boot', logo: 'springboot' },
      { label: 'Go', logo: 'go' },
      { label: 'Python', logo: 'python' },
      { label: 'React', logo: 'react' },
    ],
  },
  {
    id: 'erp',
    label: 'migración erp',
    kicker: 'Migración de ERP',
    title: 'De Oracle EBS a Oracle Fusion Cloud',
    summary: 'Participé en el paso del ERP on premise a la nube, con integraciones nuevas y una réplica que mantuvo vivas las herramientas existentes.',
    points: [
      'Integraciones SOAP y REST con Oracle Fusion',
      'Base espejo del ERP con API Gateway, SNS, SQS, Lambda y MongoDB',
      'Rendimiento recuperado en Oracle 19c ajustando conexiones con HikariCP',
    ],
    where: 'Forus',
    stack: [
      { label: 'Oracle EBS', logo: 'oracle' },
      { label: 'Oracle Fusion', logo: 'oracle' },
      { label: 'AWS serverless', logo: 'aws' },
      { label: 'MongoDB', logo: 'mongodb' },
    ],
  },
  {
    id: 'agentes',
    label: 'multiagente',
    kicker: 'IA generativa',
    title: 'Sistemas multiagente',
    summary: 'Diseñé agentes para automatizar y mejorar procesos de ingeniería a nivel empresarial.',
    points: [
      'Orquestación con Google ADK, LiteLLM y AWS Bedrock, con un modelo por agente',
      'Persistencia del conocimiento técnico en un grafo Neo4j, consultable con embeddings',
      'Foco en seguridad y tratamiento de datos, con guardrails en el código y políticas de AWS Bedrock',
    ],
    where: 'Forus',
    stack: [
      { label: 'Google ADK', logo: 'google' },
      { label: 'AWS Bedrock', logo: 'aws' },
      { label: 'Neo4j', logo: 'neo4j' },
      { label: 'Embeddings' },
      { label: 'GitLab', logo: 'gitlab' },
      { label: 'Guardrails' },
    ],
  },
]

export type StackGroup = 'backend' | 'ia' | 'datos' | 'eventos' | 'cloud' | 'erp' | 'frontend' | 'calidad'
export type StackItem = { label: string; logo?: LogoId; group: StackGroup }

export const stackGroups: { id: StackGroup; label: string }[] = [
  { id: 'backend', label: 'Backend' },
  { id: 'ia', label: 'IA generativa' },
  { id: 'datos', label: 'Datos' },
  { id: 'eventos', label: 'Eventos' },
  { id: 'cloud', label: 'Cloud' },
  { id: 'erp', label: 'ERP e integraciones' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'calidad', label: 'Calidad' },
]

/** Mapa del stack: el núcleo va al centro y cada anillo se aleja según cuánto lo uso. */
export const stackMap: { core: StackItem[]; rings: StackItem[][] } = {
  core: [
    { label: 'Spring Boot', logo: 'springboot', group: 'backend' },
    { label: 'IA generativa', logo: 'spark', group: 'ia' },
  ],
  rings: [
    [
      { label: 'Java', logo: 'java', group: 'backend' },
      { label: 'Google ADK', logo: 'google', group: 'ia' },
      { label: 'Go', logo: 'go', group: 'backend' },
      { label: 'AWS Bedrock', logo: 'aws', group: 'ia' },
      { label: 'Python', logo: 'python', group: 'backend' },
      { label: 'LiteLLM', group: 'ia' },
    ],
    [
      { label: 'Apache Kafka', logo: 'kafka', group: 'eventos' },
      { label: 'Oracle Fusion', logo: 'oracle', group: 'erp' },
      { label: 'Neo4j', logo: 'neo4j', group: 'ia' },
      { label: 'PostgreSQL', logo: 'postgresql', group: 'datos' },
      { label: 'RabbitMQ', logo: 'rabbitmq', group: 'eventos' },
      { label: 'Kubernetes', logo: 'kubernetes', group: 'cloud' },
      { label: 'Embeddings', group: 'ia' },
      { label: 'MongoDB', logo: 'mongodb', group: 'datos' },
      { label: 'Redis', logo: 'redis', group: 'datos' },
      { label: 'Claude Code', logo: 'claude', group: 'ia' },
    ],
    [
      { label: 'Docker', logo: 'docker', group: 'cloud' },
      { label: 'React', logo: 'react', group: 'frontend' },
      { label: 'AWS Lambda', logo: 'aws', group: 'cloud' },
      { label: 'Oracle EBS', logo: 'oracle', group: 'erp' },
      { label: 'SNS y SQS', logo: 'aws', group: 'eventos' },
      { label: 'Next.js', logo: 'nextjs', group: 'frontend' },
      { label: 'GitLab', logo: 'gitlab', group: 'calidad' },
      { label: 'VTEX', logo: 'vtex', group: 'erp' },
      { label: 'API Gateway', logo: 'aws', group: 'cloud' },
      { label: 'Vue.js', logo: 'vue', group: 'frontend' },
      { label: 'Jenkins', logo: 'jenkins', group: 'calidad' },
      { label: 'Shopify', logo: 'shopify', group: 'erp' },
      { label: 'Tailwind CSS', logo: 'tailwind', group: 'frontend' },
      { label: 'SonarQube', logo: 'sonarqube', group: 'calidad' },
      { label: 'Delphi', logo: 'delphi', group: 'backend' },
      { label: 'JUnit', logo: 'junit', group: 'calidad' },
    ],
  ],
}

export const finalCta = {
  title: 'Conversemos',
  body: 'Si crees que mi perfil se ajusta a lo que buscas, o que puedo aportar en tu empresa o proyecto, escríbeme un correo o conectemos en LinkedIn.',
}
