/** Datos de identidad y contacto, en un solo lugar para no duplicarlos. */
export const perfil = {
  nombre: 'Andrés Sánchez',
  rol: 'Líder Técnico',
  organizacion: 'IGX',
  ubicacion: 'Concepción, Chile',
  modalidad: 'Remoto',

  /** Una frase. Es lo primero que se lee del sitio. */
  titular: 'Seis años construyendo software para el mercado eléctrico chileno.',

  presentacion:
    'Hoy soy líder técnico en IGX, en un rol transversal a toda la plataforma. ' +
    'Escribo menos código que antes y paso más tiempo entre ingeniería y las ' +
    'áreas de negocio: evalúo si lo que se pide es factible, propongo alternativas ' +
    'más simples y ayudo a decidir qué vale la pena construir. Antes de volver ' +
    'estuve siete meses en Buk, en nómina multipaís. Los dos son dominios ' +
    'regulados, y en los dos un cálculo mal hecho termina en plata mal cobrada.',

  /** Las tres cifras de la portada. Verificables, no adjetivos. */
  cifras: [
    { valor: '53', unidad: '%', etiqueta: 'menos costo operacional recurrente', caso: 'migracion-bigquery' },
    { valor: '900', unidad: 'GB', etiqueta: 'de historia migrados sin pérdida', caso: 'migracion-bigquery' },
    { valor: '4½', unidad: 'años', etiqueta: 'enseñando IA y programación', caso: null },
  ],

  contacto: {
    correo: 'and.sanchezc@outlook.com',
    linkedin: 'https://cl.linkedin.com/in/andressanchezc',
    github: 'https://github.com/asanchezRay',
    gitlab: 'https://gitlab.com/asanchez35',
    cv: '/CV_Andres_Sanchez_Cabrera.pdf',
  },
} as const;
