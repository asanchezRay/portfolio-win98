export function getCurrentLanguage(): string {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem('preferredLanguage') || 'es';
  }
  return 'es';
}

export const translations = {
  es: {
    // Títulos principales
    portfolio: 'Portafolio',
    start: 'Inicio',
    
    // Menú y navegación
    about: 'Sobre mí',
    projects: 'Proyectos',
    contact: 'Contacto',
    skills: 'Habilidades Técnicas',
    experience: 'Experiencia',
    education: 'Educación',

    // Categorías de habilidades
    frontend: 'Frontend',
    backend: 'Backend',
    mobile: 'Móvil',
    database: 'Bases de Datos',
    tools: 'Herramientas',
    cloud: 'Nube',
    ai: 'Inteligencia Artificial',
    architecture: 'Arquitectura',

    // Descripciones de habilidades (opcional)
    microservices: 'Microservicios',
    microfrontend: 'Microfrontends',
    unitTesting: 'Pruebas Unitarias',
    oop: 'Programación Orientada a Objetos',

    // Sección Sobre mí
    aboutMe: 'Soy un ingeniero de software. Me gusta aprender sobre nuevas tecnologias, compartir mis conocimientos y resolver problemas complejos. Estoy interesado tanto en el desarrollo como la arquitectura de software.',
    location: 'Ubicación',
    email: 'Correo',
    phone: 'Teléfono',

    // Sección de contacto
    contactMe: 'Contáctame',
    sendMessage: 'Enviar mensaje',
    name: 'Nombre',
    subject: 'Asunto',
    message: 'Mensaje',

    // Botones y acciones
    send: 'Enviar',
    close: 'Cerrar',
    minimize: 'Minimizar',
    maximize: 'Maximizar',
    
    // Estados y mensajes
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    
    // Fechas y tiempo
    present: 'Presente',
    year: 'Año',
    month: 'Mes',
    day: 'Día'
  },
  en: {
    // Main titles
    portfolio: 'Portfolio',
    start: 'Start',
    
    // Menu and navigation
    about: 'About me',
    projects: 'Projects',
    contact: 'Contact',
    skills: 'Technical Skills',
    experience: 'Experience',
    education: 'Education',

    // Skill categories
    frontend: 'Frontend',
    backend: 'Backend',
    mobile: 'Mobile',
    database: 'Databases',
    tools: 'Tools',
    cloud: 'Cloud',
    ai: 'Artificial Intelligence',
    architecture: 'Architecture',

    // Skill descriptions (optional)
    microservices: 'Microservices',
    microfrontend: 'Microfrontend',
    unitTesting: 'Unit Testing',
    oop: 'Object-Oriented Programming',

    // About section
    aboutMe: 'I am a software engineer. I like to learn about new technologies, share my knowledge and solve complex problems. I am interested in both software development and software architecture.',
    location: 'Location',
    email: 'Email',
    phone: 'Phone',

    // Contact section
    contactMe: 'Contact me',
    sendMessage: 'Send message',
    name: 'Name',
    subject: 'Subject',
    message: 'Message',

    // Buttons and actions
    send: 'Send',
    close: 'Close',
    minimize: 'Minimize',
    maximize: 'Maximize',
    
    // States and messages
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    
    // Dates and time
    present: 'Present',
    year: 'Year',
    month: 'Month',
    day: 'Day'
  }
};

export function t(key: string, locale?: string): string {
  const currentLocale = locale || getCurrentLanguage();
  return translations[currentLocale]?.[key] || key;
} 