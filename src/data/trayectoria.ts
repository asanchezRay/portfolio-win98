/**
 * Trayectoria profesional.
 *
 * Dos vias en paralelo: industria y docencia. Se modelan juntas y se
 * distinguen por `via`, porque el traslape es parte de lo que cuentan —
 * los cuatro anios y medio de clases ocurrieron mientras trabajaba
 * full-time.
 *
 * Orden: de mas reciente a mas antiguo. `hasta: null` significa actual.
 */

export interface Etapa {
  organizacion: string;
  rol: string;
  /** ISO YYYY-MM, para ordenar y calcular duracion. */
  desde: string;
  hasta: string | null;
  ubicacion: string;
  via: 'industria' | 'docencia';
  resumen: string;
  hitos?: string[];
  stack?: string[];
  /** slug del caso relacionado, si existe. */
  casos?: string[];
  /** Aclaracion que va en letra chica bajo el titulo. */
  nota?: string;
}

export const trayectoria: Etapa[] = [
  {
    organizacion: 'IGX',
    rol: 'Líder Técnico / Senior Software Engineer',
    desde: '2026-07',
    hasta: null,
    ubicacion: 'Remoto',
    via: 'industria',
    resumen:
      'Rol transversal a toda la plataforma, entre ingeniería y las áreas de negocio ' +
      '(Administración, Comercial, Energía Simple). En vez de ser dueño de una vertical, ' +
      'aporto en horizontal: conecto producto con ingeniería, evalúo la factibilidad ' +
      'técnica de lo que se pide, propongo alternativas más simples y ayudo a decidir ' +
      'qué vale la pena construir junto al CTO y al PO.',
    hitos: [
      'Elevar el estándar del equipo a través de mejores prácticas de ingeniería',
      'Identificar dónde la tecnología —incluida la IA— mejora de verdad un flujo interno, de cliente o puntual',
      'Actuar como facilitador del cambio entre áreas que no comparten vocabulario',
    ],
    casos: ['revision-codigo-ia'],
  },
  {
    organizacion: 'IGX',
    rol: 'Senior Software Engineer',
    desde: '2025-12',
    hasta: '2026-07',
    ubicacion: 'Remoto',
    via: 'industria',
    resumen:
      'Trabajo transversal a toda la plataforma en vez de una sola vertical: ' +
      'infraestructura de datos, backend, frontend, arquitectura serverless y lógica ' +
      'de negocio, donde el sistema lo pidiera.',
    hitos: [
      'Bajé 53% el costo operacional recurrente migrando ~900 GB de historia de ION desde MySQL/RDS a BigQuery, rediseñando el esquema para eficiencia de costo',
      'Construí la infraestructura de sincronización en vivo (Cloud Run) para ingesta de datos de medidores en tiempo real, integrada con el scraper existente',
      'Ejecuté un upgrade de alto riesgo del motor MySQL en AWS RDS productivo sin interrupción de la plataforma',
      'Integré el monolito Yii2 heredado con la arquitectura nueva de AWS Lambda + React vía API, como parte de la migración a serverless',
      'Introduje la revisión de código asistida por IA como práctica de equipo',
      'Definí el marco de progresión técnica de carrera del equipo',
    ],
    stack: ['PHP', 'Yii2', 'Python', 'AWS', 'BigQuery', 'Cloud Run', 'MySQL/RDS', 'Lambda', 'React'],
    casos: ['migracion-bigquery', 'mysql-sin-caida', 'puente-yii2-lambda', 'sincronizacion-medidores'],
  },
  {
    organizacion: 'Buk',
    rol: 'Software Engineer L2',
    desde: '2025-05',
    hasta: '2025-11',
    ubicacion: 'Chile · Remoto',
    via: 'industria',
    resumen:
      'Módulos críticos de una aplicación monolítica en Ruby on Rails con arquitectura ' +
      'modular: contratos de trabajo y liquidación de remuneraciones en varios países.',
    hitos: [
      'Implementé un sistema completo de sincronización de fechas que previene inconsistencias en los registros de empleados (+800 líneas)',
      'Resolví bugs críticos del módulo de nómina de Colombia que afectaban el cálculo de días PILA',
      'Reduje consultas a soporte mejorando la ayuda contextual y los formularios',
      'Trabajé sobre arquitectura multi-tenant con la gema Apartment y sharding de base de datos',
    ],
    stack: ['Ruby on Rails', 'Minitest', 'TDD', 'PostgreSQL', 'Sentry'],
  },
  {
    organizacion: 'IGX · Energía Simple',
    rol: 'Software Engineer',
    desde: '2022-05',
    hasta: '2025-04',
    ubicacion: 'Santiago · Remoto',
    via: 'industria',
    nota:
      'IGX y Energía Simple son dos empresas distintas, con focos de negocio distintos, ' +
      'atendidas en paralelo por el mismo departamento de TI. Comparten parte de su ' +
      'infraestructura AWS y su capa de datos, y mi trabajo abarcó ambas plataformas.',
    resumen:
      'Sistemas de gestión para generadores eléctricos y para clientes libres, ' +
      'automatización de cálculos de facturación en comercializadoras, y una flota de ' +
      'scrapers contra plataformas que no ofrecen API.',
    hitos: [
      'Construí y mantuve scrapers automatizados contra SII, bancos, el Coordinador Eléctrico Nacional, BADX y PJDX',
      'Desarrollé integraciones con APIs del mercado eléctrico, ERPs y el SII',
      'Automaticé procesos críticos de facturación y de subastas de energía',
      'Optimicé los algoritmos de cálculo de precios y facturación de energía',
      'Contribuí a la arquitectura cloud de la plataforma en rendimiento, escalabilidad y confiabilidad',
    ],
    stack: ['PHP', 'Yii2', 'Python', 'AWS Lambda', 'MySQL', 'Docker', 'Puppeteer', 'JavaScript'],
  },
  {
    organizacion: 'Universidad Católica de la Santísima Concepción',
    rol: 'Profesor — Computación e Inteligencia Artificial',
    desde: '2020-08',
    hasta: '2024-12',
    ubicacion: 'Concepción · Presencial',
    via: 'docencia',
    resumen:
      'Cursos de pregrado en paralelo al trabajo full-time: Inteligencia Artificial ' +
      '(búsqueda, aprendizaje automático, redes neuronales), Programación I y ' +
      'Programación II — Orientación a Objetos.',
    hitos: [
      'Diseñé y dicté material que combina fundamentos teóricos con proyectos prácticos',
      'Mentoría a estudiantes, con foco en pensamiento crítico y resolución de problemas',
      'Participación en la mejora continua de la malla de la carrera',
    ],
    stack: ['Python', 'Keras', 'Java'],
  },
  {
    organizacion: 'Vestuá',
    rol: 'Full-stack Developer',
    desde: '2022-03',
    hasta: '2022-05',
    ubicacion: 'Santiago · Remoto',
    via: 'industria',
    resumen:
      'Funcionalidades de frontend y backend en Angular y Node.js para una plataforma ' +
      'de e-commerce, con metodología Shape-Up.',
    hitos: [
      'Diseñé e implementé varios A/B tests para la plataforma',
      'Participé en la estimación y priorización de trabajo',
    ],
    stack: ['Angular', 'Node.js', 'Docker'],
  },
  {
    organizacion: 'Universidad del Bío-Bío',
    rol: 'Profesor adjunto — Paradigmas de Programación',
    desde: '2021-07',
    hasta: '2022-01',
    ubicacion: 'Concepción · Híbrido',
    via: 'docencia',
    resumen:
      'Curso de pregrado sobre paradigmas imperativo, orientado a objetos, funcional ' +
      'y lógico, y sobre cuándo conviene cada uno.',
    stack: ['Java', 'Programación reactiva'],
  },
  {
    organizacion: 'everis',
    rol: 'Solutions Assistant',
    desde: '2021-02',
    hasta: '2021-08',
    ubicacion: 'Santiago',
    via: 'industria',
    resumen:
      'Equipo del proyecto Núcleo Digital de Clínica Alemana: migración de una ' +
      'aplicación monolítica en WPF a micro frontends y microservicios con Node.js ' +
      'y Angular.',
    hitos: [
      'Desarrollo de componentes Angular para la aplicación interna de la clínica',
      'Pruebas unitarias y automatizadas con Jest',
    ],
    stack: ['Angular', 'Node.js', 'Jest', 'Docker'],
  },
];

const MESES = [
  'ene', 'feb', 'mar', 'abr', 'may', 'jun',
  'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
];

/** '2026-07' -> 'jul 2026' */
export function mes(iso: string): string {
  const [anio, m] = iso.split('-');
  return `${MESES[Number(m) - 1]} ${anio}`;
}

/** Rango legible: 'may 2022 — abr 2025' o 'jul 2026 — presente'. */
export function rango(desde: string, hasta: string | null): string {
  return `${mes(desde)} — ${hasta ? mes(hasta) : 'presente'}`;
}

/** Duración en texto: '3 años 1 mes'. */
export function duracion(desde: string, hasta: string | null, hoy = new Date()): string {
  const [a1, m1] = desde.split('-').map(Number);
  const [a2, m2] = hasta
    ? hasta.split('-').map(Number)
    : [hoy.getFullYear(), hoy.getMonth() + 1];
  const total = (a2 - a1) * 12 + (m2 - m1) + 1;
  const anios = Math.floor(total / 12);
  const meses = total % 12;
  const partes: string[] = [];
  if (anios) partes.push(`${anios} ${anios === 1 ? 'año' : 'años'}`);
  if (meses) partes.push(`${meses} ${meses === 1 ? 'mes' : 'meses'}`);
  return partes.join(' ') || '1 mes';
}
