/** Datos de identidad y contacto, en un solo lugar para no duplicarlos. */
export const perfil = {
  nombre: 'Andrés Sánchez',
  rol: 'Líder Técnico',
  organizacion: 'IGX',
  ubicacion: 'Concepción, Chile',
  modalidad: 'Remoto',

  /** Una frase. Es lo primero que se lee del sitio. */
  titular:
    'Traduzco entre dos mundos que rara vez hablan el mismo idioma: el negocio y el sistema.',

  presentacion:
    'Seis años construyendo software para el mercado eléctrico chileno y para la ' +
    'nómina de miles de personas — dominios regulados donde una regla mal leída se ' +
    'convierte en plata mal cobrada. Hoy trabajo de forma transversal entre ' +
    'ingeniería y las áreas de negocio: evalúo factibilidad, propongo la solución ' +
    'más simple y ayudo a decidir qué vale la pena construir.',

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
