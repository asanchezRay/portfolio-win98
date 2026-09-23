/**
 * El taller: todo lo construido, junto y en una sola rejilla.
 *
 * La idea es que el volumen y la variedad sean el mensaje. Un portafolio de
 * ocho ensayos largos comunica "persona pausada"; catorce fichas cortas de
 * cosas distintas comunican otra cosa. Por eso se mezclan aqui el trabajo
 * remunerado, los proyectos propios, la docencia y las practicas de equipo,
 * en vez de separarlos en secciones.
 *
 * Las que tienen `caso` enlazan a su pagina; las demas se leen completas aqui.
 */

export type Estado =
  | 'en curso'
  | 'en producción'
  | 'cerrado'
  | 'archivado'
  | 'continuo';

export interface Pieza {
  nombre: string;
  /**
   * Solo se muestra en las piezas destacadas, y corta. En el indice no va
   * ninguna descripcion: quince frases sueltas son quince parrafos, y hacian
   * que lo chico pesara lo mismo que lo grande.
   */
  que: string;
  /** Las pocas que se muestran con presencia real arriba del indice. */
  destacado?: boolean;
  /** Para las destacadas que no tienen captura: el numero hace de imagen. */
  cifra?: { valor: string; unidad?: string; etiqueta: string };
  anios: string;
  estado: Estado;
  /** Tres o cuatro, no el stack completo. */
  tags: string[];
  contexto?: string;
  /** slug del caso, si tiene pagina propia. */
  caso?: string;
  /** enlace externo o a otra ruta del sitio. */
  enlace?: { href: string; texto: string };
  imagen?: { src: string; alt: string };
}

export const taller: Pieza[] = [
  {
    nombre: 'Organizatumatri',
    destacado: true,
    que: 'Marketplace de dos lados, de punta a punta.',
    anios: '2025 — 2026',
    estado: 'cerrado',
    tags: ['Next.js', 'Prisma', 'MercadoPago', 'Playwright'],
    contexto: 'Proyecto propio',
    caso: 'organizatumatri',
    enlace: { href: '/demo/organizatumatri/portada/', texto: 'Ver demo' },
    imagen: {
      src: '/img/organizatumatri/directorio.png',
      alt: 'Directorio de proveedores de Organizatumatri',
    },
  },
  {
    nombre: '900 GB a BigQuery',
    destacado: true,
    cifra: { valor: '53', unidad: '%', etiqueta: 'menos costo recurrente' },
    que: 'Saqué la historia de medidores del motor operacional.',
    anios: '2026',
    estado: 'en producción',
    tags: ['BigQuery', 'MySQL', 'AWS RDS'],
    contexto: 'IGX',
    caso: 'migracion-bigquery',
  },
  {
    nombre: 'Sincronización en vivo',
    que: 'Ingesta de medidores en tiempo real sobre Cloud Run, encima del scraper que ya existía.',
    anios: '2026',
    estado: 'en producción',
    tags: ['Cloud Run', 'Python', 'Docker'],
    contexto: 'IGX',
    caso: 'sincronizacion-medidores',
  },
  {
    nombre: 'Puente Yii2 ↔ Lambda',
    que: 'Le abrí una API al monolito para que la migración a serverless avanzara por módulos.',
    anios: '2026',
    estado: 'en producción',
    tags: ['PHP', 'AWS Lambda', 'React'],
    contexto: 'IGX',
    caso: 'puente-yii2-lambda',
  },
  {
    nombre: 'Upgrade de MySQL sin caída',
    que: 'Cambié el motor de la base productiva en RDS sin interrumpir la plataforma.',
    anios: '2026',
    estado: 'en producción',
    tags: ['MySQL', 'AWS RDS'],
    contexto: 'IGX',
    caso: 'mysql-sin-caida',
  },
  {
    nombre: 'Revisión de código con IA',
    que: 'Introduje la práctica en el equipo para sacarle la primera capa mecánica a las revisiones.',
    anios: '2026',
    estado: 'continuo',
    tags: ['IA aplicada', 'prácticas de equipo'],
    contexto: 'IGX',
    caso: 'revision-codigo-ia',
  },
  {
    nombre: 'Scrapers del mercado eléctrico',
    que: 'Flota de scrapers contra portales que no ofrecen API: SII, bancos, CEN, BADX, PJDX.',
    anios: '2022 — 2025',
    estado: 'en producción',
    tags: ['Python', 'Puppeteer', 'AWS Lambda'],
    contexto: 'IGX · Energía Simple',
  },
  {
    nombre: 'Marco de progresión técnica',
    que: 'Definí los niveles de carrera del equipo de ingeniería y qué se espera en cada uno.',
    anios: '2026',
    estado: 'continuo',
    tags: ['liderazgo'],
    contexto: 'IGX',
  },
  {
    nombre: 'Formato de reuniones de TI',
    que: 'Propuesta para rehacer la reunión del área, con análisis de sprint y planificación por épicas.',
    anios: '2025',
    estado: 'continuo',
    tags: ['proceso', 'Scrum'],
    contexto: 'IGX',
  },
  {
    nombre: 'sum',
    que: 'Dashboard colaborativo tipo Trello sobre la API de Google Tasks, con gamificación.',
    anios: '2024',
    estado: 'archivado',
    tags: ['Vue 3', 'Firebase', 'Google API'],
    contexto: 'Proyecto propio',
  },
  {
    nombre: 'AfasiaApp',
    destacado: true,
    que: 'Tratamiento temprano de la afasia, en tablet.',
    anios: '2021',
    estado: 'archivado',
    tags: ['Flutter', 'Dart', 'SQLite'],
    contexto: 'Tesis de ingeniería',
    caso: 'afasiaapp',
    imagen: {
      src: '/img/afasiaApp/lecturaComprensiva.png',
      alt: 'Actividad de lectura comprensiva en AfasiaApp',
    },
  },
  {
    nombre: 'Escritorio Windows 98',
    destacado: true,
    que: 'Mi portafolio anterior, en CSS a mano.',
    anios: '2024 — 2026',
    estado: 'archivado',
    tags: ['Astro', 'TypeScript', 'CSS'],
    contexto: 'Proyecto propio',
    caso: 'portafolio-98',
    enlace: { href: '/98', texto: 'Abrirlo' },
    imagen: {
      src: '/img/98/escritorio.png',
      alt: 'El escritorio Windows 98 con una ventana abierta',
    },
  },
  {
    nombre: 'Clases de IA y programación',
    que: 'Inteligencia Artificial, Programación I y II, y Paradigmas. En paralelo al trabajo.',
    anios: '2020 — 2024',
    estado: 'archivado',
    tags: ['Python', 'Keras', 'Java'],
    contexto: 'UCSC · UBB',
    enlace: { href: '/trayectoria', texto: 'En la trayectoria' },
  },
  {
    nombre: 'LeetCode',
    que: 'Práctica de algoritmos en Python, a ratos. No todo lo que uno construye tiene que servir para algo.',
    anios: '2025',
    estado: 'continuo',
    tags: ['Python'],
    contexto: 'Proyecto propio',
  },
  {
    nombre: 'Este sitio',
    que: 'Astro, diagramas en SVG y cero JavaScript enviado al navegador. Construido con IA.',
    anios: '2026',
    estado: 'en curso',
    tags: ['Astro', 'MDX', 'SVG'],
    contexto: 'Proyecto propio',
    enlace: { href: '/colofon', texto: 'Colofón' },
  },
];
