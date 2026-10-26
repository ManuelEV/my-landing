// Todo el texto del sitio vive aquí. Fuente: CV de Manuel Espinoza.
// Regla de estilo: sin guiones dentro del texto, oraciones en sentence case.

export const profile = {
  name: 'Manuel Espinoza',
  fullName: 'Manuel Alejandro Espinoza Valenzuela',
  role: 'Ingeniero de software',
  location: 'Temuco, Chile',
  email: 'manuelespv@gmail.com',
}

export const nav = [
  { id: 'trayectoria', label: 'Trayectoria' },
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'stack', label: 'Stack' },
  { id: 'preguntas', label: 'Preguntas' },
]

export const hero = {
  eyebrow: `${profile.role} senior`,
  eyebrowPlace: ` · ${profile.location}`,
  headline: ['Backends estables,', 'integraciones limpias', 'y agentes con contexto'],
  sub: 'Soy Manuel Espinoza. Llevo más de seis años construyendo microservicios, integraciones con Oracle Fusion Cloud y sistemas multiagente para retail y servicios financieros.',
  cta: 'Escríbeme un correo',
  proofLabel: 'He construido software para',
  companies: ['Forus', 'Equifax', 'CreaLab', 'Smart Araucanía', 'Universidad de La Frontera'],
}

export const stats = [
  {
    value: '80%',
    label: 'menos tiempo de procesamiento',
    detail: 'en la creación masiva de órdenes de compra, con Redis y consultas optimizadas.',
  },
  {
    value: '+90%',
    label: 'de cobertura de pruebas',
    detail: 'en microservicios financieros de Equifax, con JUnit y Mockito.',
  },
  {
    value: '4',
    label: 'canales desde una sola carga',
    detail: 'Oracle, VTEX, Shopify y marketplaces vía Centry.',
  },
  {
    value: '6+',
    label: 'años construyendo software',
    detail: 'en retail, finanzas, educación y ciudades inteligentes.',
  },
]

export const tagline =
  'Ordeno lo complejo: datos que llegan a tiempo, migraciones sin pausas y agentes que conocen cada proyecto.'

export type Scene = {
  id: string
  period: string
  company: string
  role: string
  summary: string
  points: string[]
  tags: string[]
}

export const journey: Scene[] = [
  {
    id: 'ufro',
    period: 'Ago 2019 a ago 2020',
    company: 'Universidad de La Frontera',
    role: 'Ayudante de investigación',
    summary: 'Diseñé lenguajes específicos de dominio para comercio electrónico que generan código Spring Boot.',
    points: ['Modelado con MetaEdit+', 'Automatización del desarrollo de software'],
    tags: ['DSL', 'MetaEdit+', 'Spring Boot'],
  },
  {
    id: 'smart',
    period: 'Abr 2020 a jul 2020',
    company: 'Smart Araucanía',
    role: 'Ingeniero de software',
    summary: 'Construí soluciones de ciudad inteligente con microservicios FIWARE sobre Docker.',
    points: ['Plataformas IoT', 'Integración de servicios urbanos'],
    tags: ['FIWARE', 'Docker', 'IoT'],
  },
  {
    id: 'crealab',
    period: 'Nov 2020 a may 2021',
    company: 'CreaLab',
    role: 'Desarrollador frontend',
    summary: 'Desarrollé una aplicación web progresiva para plataformas educativas, responsiva y accesible.',
    points: ['Equipo multidisciplinario', 'Interfaces para estudiantes y docentes'],
    tags: ['Vue.js', 'Tailwind CSS', 'PWA'],
  },
  {
    id: 'equifax',
    period: 'Jul 2021 a ene 2022',
    company: 'Equifax',
    role: 'Ingeniero de software',
    summary: 'Desarrollé microservicios para evaluar solvencia y riesgo crediticio de bancos, retailers y prestadores de salud.',
    points: ['Spring Boot sobre AWS EKS y Amazon RDS', 'Más del 90% de cobertura de pruebas', 'SonarQube, Fortify y Jenkins'],
    tags: ['Spring Boot', 'AWS EKS', 'PostgreSQL'],
  },
  {
    id: 'forus',
    period: 'Ene 2022 a hoy',
    company: 'Forus',
    role: 'Ingeniero de software senior',
    summary: 'Modernizo plataformas críticas de retail y lidero soluciones con IA generativa.',
    points: [
      'Migración de Oracle EBS a Oracle Fusion Cloud',
      'Rendimiento recuperado en Oracle 19c con HikariCP',
      'Réplica del ERP con AWS serverless y MongoDB',
    ],
    tags: ['Oracle Fusion', 'AWS', 'Go', 'IA generativa'],
  },
]

export const work = {
  knowledge: {
    title: 'Conocimiento técnico vivo',
    body: 'Varios agentes analizan los repositorios de GitLab y guardan arquitecturas, dependencias, tablas e integraciones en Neo4j. El equipo pregunta en lenguaje natural y recibe diagramas interactivos.',
    tags: ['Neo4j', 'Embeddings', 'Agentes'],
    query: '¿Qué servicios usan la tabla de órdenes?',
  },
  specs: {
    title: 'De una idea a una spec técnica',
    body: 'Preguntas dinámicas convierten una descripción inicial en una especificación clara, enriquecida con el contexto del proyecto para guiar a agentes de código como Claude Code.',
    tags: ['Specs', 'Claude Code'],
    prompt: 'Exportar órdenes aprobadas a Fusion',
    chips: ['Alcance', 'Integraciones', 'Criterios'],
  },
  agents: {
    title: 'Sistemas multiagente',
    body: 'Agentes que automatizan tareas de ingeniería de software, cada uno con el modelo que mejor resuelve su parte.',
    tags: ['Google ADK', 'LiteLLM', 'AWS Bedrock'],
  },
  orders: {
    title: 'Órdenes de compra masivas',
    body: 'Next.js y Spring Boot integrados con Oracle Fusion por SOAP y REST, con caché en Redis.',
    tags: ['Next.js', 'Redis', 'SOAP'],
  },
  catalog: {
    title: 'Catálogo multicanal',
    body: 'Microservicios que validan cada producto y lo publican en todos los canales de venta desde una sola carga.',
    tags: ['Spring Boot', 'React', 'Centry'],
    channels: ['Oracle', 'VTEX', 'Shopify', 'Centry'],
  },
}

export const process = [
  {
    title: 'Diagnóstico con datos',
    body: 'Mido antes de cambiar: consultas, conexiones, colas y tiempos de respuesta. Así encontré el cuello de botella de conexiones tras la migración a Oracle 19c.',
  },
  {
    title: 'Diseño para convivir',
    body: 'Las migraciones grandes conviven con lo que ya funciona. Réplicas espejo, APIs y colas permiten mover piezas sin frenar a los usuarios.',
  },
  {
    title: 'Automatizo lo repetible',
    body: 'Agentes, validaciones y pipelines de CI/CD hacen el trabajo mecánico para que el equipo dedique su tiempo a las decisiones.',
  },
]

export const stack = [
  { group: 'Backend', items: ['Java', 'Spring Boot', 'Go', 'Python', 'Microservicios'] },
  { group: 'Frontend', items: ['React', 'Next.js', 'Vue.js', 'Tailwind CSS', 'PWA'] },
  { group: 'Datos', items: ['Oracle 19c', 'Oracle Fusion Cloud', 'PostgreSQL', 'MongoDB', 'Redis', 'Neo4j'] },
  { group: 'Cloud', items: ['AWS Lambda', 'API Gateway', 'SNS', 'SQS', 'EKS', 'RDS', 'Docker'] },
  { group: 'IA generativa', items: ['Google ADK', 'LiteLLM', 'AWS Bedrock', 'Embeddings', 'Claude Code'] },
  { group: 'Calidad', items: ['JUnit', 'Mockito', 'SonarQube', 'Fortify', 'Jenkins'] },
  { group: 'Integraciones', items: ['REST', 'SOAP', 'VTEX', 'Shopify', 'Centry', 'FIWARE'] },
]

export const faq = [
  {
    q: '¿En qué tipo de proyectos aporto más?',
    a: 'En backends con alta carga e integraciones empresariales: sincronización de inventario, conexiones con ERP, catálogos multicanal y migraciones hacia la nube.',
  },
  {
    q: '¿Tienes experiencia con Oracle Fusion Cloud?',
    a: 'Sí. Participé en la migración de Forus desde Oracle EBS on premise hacia Oracle Fusion Cloud, modernizando aplicaciones Delphi hacia Spring Boot, Go, Python y React, e integrando procesos por SOAP y REST.',
  },
  {
    q: '¿Has llevado IA generativa a procesos reales?',
    a: 'Sí. Diseñé sistemas multiagente con Google ADK, LiteLLM y AWS Bedrock que automatizan tareas de ingeniería, y una plataforma que convierte requerimientos en specs para agentes de código.',
  },
  {
    q: '¿También trabajas en frontend?',
    a: 'Sí. Trabajo con React, Next.js y Vue.js. Construí la PWA educativa de CreaLab y las interfaces de las plataformas de órdenes y productos en Forus.',
  },
  {
    q: '¿Cómo cuidas la calidad del software?',
    a: 'Con pruebas automatizadas, análisis estático y pipelines de CI/CD. En Equifax mantuve más del 90% de cobertura con JUnit y Mockito, junto a SonarQube, Fortify y Jenkins.',
  },
  {
    q: '¿Dónde estás y cómo te contacto?',
    a: `Vivo en Temuco, Chile. La forma más directa es escribirme a ${profile.email}.`,
  },
]

export const finalCta = {
  title: '¿Tienes un sistema que necesita escalar o integrarse?',
  body: 'Cuéntame qué estás construyendo y qué te está frenando. Te respondo con preguntas concretas y una primera idea de cómo abordarlo.',
}
