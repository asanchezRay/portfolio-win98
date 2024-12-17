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
    day: 'Día',

    // Proyectos
    projectsList: {
      title: 'Proyectos',
      categories: {
        all: 'Todos',
        professional: 'Profesional',
        personal: 'Personal'
      },
      sections: {
        responsibilities: 'Responsabilidades',
        technologies: 'Tecnologías',
        achievements: 'Logros',
        images: 'Imágenes'
      },
      igx: {
        title: 'IGX | Energía Simple | Desarrollador',
        period: 'Mayo 2022 - Actualidad',
        description: 'Desarrollo y mantenimiento de plataformas de automatización para el sector eléctrico',
        responsibilities: [
          'Implementación de sistemas de gestión y administración para generadores eléctricos',
          'Desarrollo de módulos para automatización de cálculos de facturación en comercializadoras de energía',
          'Desarrollo de scrapers automatizados para múltiples plataformas:',
          '  • Plataforma Bizagi para extracción de datos de procesos de negocio',
          '  • Portal del SII para automatización de procesos tributarios',
          '  • Portales bancarios para obtención de información financiera',
          'Integración con múltiples APIs (SII, Coordinador Eléctrico Nacional, ERPs)',
          'Automatización de procesos de monitoreo y reportería para centrales eléctricas',
          'Implementación de pruebas unitarias y desarrollo de nuevas funcionalidades',
          'Participación en metodología SCRUM y mejora continua de procesos',
          'Optimización de rendimiento y escalabilidad de aplicaciones cloud'
        ],
        achievements: [
          'Contribución al crecimiento de la plataforma líder en el mercado eléctrico chileno',
          'Automatización exitosa de procesos críticos de gestión',
          'Desarrollo de sistema robusto de web scraping con alta disponibilidad',
          'Mejora significativa en tiempos de procesamiento de datos'
        ]
      },
      vestua: {
        title: 'Vestuá | Desarrollador FullStack',
        period: 'Febrero 2022 - Mayo 2022',
        description: 'Desarrollo de plataforma e-commerce para venta de ropa usada con enfoque en automatización y escalabilidad',
        responsibilities: [
          'Implementación de nuevas funcionalidades en frontend y backend',
          'Participación en la estimación y priorización de tareas en metodología Scrum',
          'Mantenimiento y mejora de repositorios de código',
          'Lidere los primeros pasos en SEO para la plataforma',
          'Implementacion de diversos A/B test para la plataforma'
        ],
        achievements: [
          'Contribución para encaminar el SEO de la plataforma y aumentar el trafico organico',
          'Mejora en la eficiencia de procesos internos mediante automatización',
          'Implementación exitosa de nuevas funcionalidades para el equipo de arquitectura'
        ]
      },
      everis: {
        title: 'Everis | Desarrollador FullStack',
        period: 'Enero 2021 - Agosto 2021',
        description: [
          'Desarrollo de un proyecto de migración de una aplicación monolítica en WPF a una arquitectura basada enmicro frontends y micro servicios con NodeJs y Angular.',
        ],
        responsibilities: [
          'Miembro del equipo de desarrollo encargado del proyecto Nucleo digital de la Clinica Alemana.',
          'Participe en la migración de la aplicación monolítica a micro frontends y micro servicios.',
          'Desarrollo de componentes en Angular para la aplicacion interna de Clinica Alemana',
          'Desarrollo de pruebas unitarias y automatizadas con Jest.'
        ]
      },
      drup: {
        title: 'Drup SpA | Práctica Profesional',
        period: 'Enero 2019 - Marzo 2019',
        description: [
          'Practica profesional en Drup SpA, empresa dedicada a desarrollo de software a medida para distintos clientes.'
        ],
        responsibilities: [
          'Desarrollo de landing pages para clientes de la empresa.',
          'Desarrollo de un catalogo de viviendas tipo portal inmobiliario para un cliente de Drup Spa.'
        ]
      },
      afasiaApp: {
        title: 'AfasiaApp | Tesis de Ingeniería',
        period: 'Enero 2021 - Diciembre 2021',
        description: 'Desarrollo de una aplicación móvil para tablets que ayuda a fonoaudiólogos en el tratamiento temprano de pacientes con afasia en ambiente hospitalario.',
        responsibilities: [
          'Diseño e implementación de la arquitectura completa de la aplicación',
          'Desarrollo de múltiples actividades terapéuticas con diferentes niveles de dificultad',
          'Implementación de sistema de gestión de pacientes y seguimiento de progreso',
          'Validación de la aplicación con 11 fonoaudiólogos profesionales'
        ],
        achievements: [
          'Puntaje de usabilidad SUS de 79.7/100 en evaluación con profesionales',
          'Publicación de artículo científico en IEEE Latin America Transactions',
          'Desarrollo de más de 15 actividades terapéuticas diferentes con 3 niveles de dificultad cada una',
          'Implementación exitosa de interfaz adaptada a necesidades de pacientes con afasia'
        ],
        images: {
          profile: 'Vista de perfil en AfasiaApp',
          lecturaComprensiva: 'Actividad de lectura comprensiva en AfasiaApp',
          listaActividades: 'Lista de actividades en AfasiaApp',
          login: 'Inicio de sesión en AfasiaApp'
        }
      },
      hints: {
        desktopInteraction: '¡Haz clic en los iconos del escritorio para conocerme mejor!'
      }
    }
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
    aboutMe: 'I am a software engineer. I like to learn about new technologies, share my knowledge and solve complex problems. I am interested in both software development and architecture.',
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
    day: 'Day',

    // Projects
    projectsList: {
      title: 'Projects',
      categories: {
        all: 'All',
        professional: 'Professional',
        personal: 'Personal'
      },
      sections: {
        responsibilities: 'Responsibilities',
        technologies: 'Technologies',
        achievements: 'Achievements',
        images: 'Images'
      },
      igx: {
        title: 'IGX | Energía Simple | Developer',
        period: 'May 2022 - Present',
        description: 'Development and maintenance of automation platforms for the electricity sector',
        responsibilities: [
          'Implementation of management systems for electric generators',
          'Development of modules for billing calculation automation in energy trading companies',
          'Development of automated scrapers for multiple platforms:',
          '  • Bizagi platform for business process data extraction',
          '  • SII portal for tax process automation',
          '  • Banking portals for financial information retrieval',
          'Integration with multiple APIs (SII, National Electric Coordinator, ERPs)',
          'Automation of monitoring and reporting processes for power plants',
          'Implementation of unit tests and development of new features',
          'Participation in SCRUM methodology and continuous process improvement',
          'Performance optimization and scalability of cloud applications'
        ],
        achievements: [
          'Contribution to the growth of the leading platform in the Chilean electricity market',
          'Successful automation of critical management processes',
          'Development of robust web scraping system with high availability',
          'Significant improvement in data processing times'
        ]
      },
      vestua: {
        title: 'Vestuá | FullStack Developer',
        period: 'February 2022 - May 2022',
        description: 'Development of e-commerce platform for used clothing sales with focus on automation and scalability',
        responsibilities: [
          'Implementation of new frontend and backend features',
          'Participation in task estimation and prioritization using Scrum methodology',
          'Maintenance and improvement of code repositories',
          'Led initial SEO efforts for the platform',
          'Implementation of various A/B tests for the platform'
        ],
        achievements: [
          'Contribution to platform SEO improvement and organic traffic increase',
          'Improvement in internal process efficiency through automation',
          'Successful implementation of new features for the architecture team'
        ]
      },
      everis: {
        title: 'Everis | FullStack Developer',
        period: 'January 2021 - August 2021',
        description: 'Development project migrating a monolithic WPF application to a micro frontends and microservices architecture with NodeJs and Angular.',
        responsibilities: [
          'Member of the development team in charge of Clinica Alemana\'s Digital Core project',
          'Participated in the migration from monolithic application to micro frontends and microservices',
          'Development of Angular components for Clinica Alemana\'s internal application',
          'Development of unit tests and automated testing with Jest'
        ]
      },
      drup: {
        title: 'Drup SpA | Professional Internship',
        period: 'January 2019 - March 2019',
        description: 'Professional internship at Drup SpA, a company dedicated to custom software development for various clients.',
        responsibilities: [
          'Development of landing pages for company clients',
          'Development of a real estate catalog portal for a Drup SpA client'
        ]
      },
      afasiaApp: {
        title: 'AfasiaApp | Engineering Thesis',
        period: 'January 2021 - December 2021',
        description: 'Development of a tablet mobile application that assists speech therapists in the early treatment of aphasia patients in a hospital environment.',
        responsibilities: [
          'Design and implementation of the complete application architecture',
          'Development of multiple therapeutic activities with different difficulty levels',
          'Implementation of patient management system and progress tracking',
          'Validation of the application with 11 professional speech therapists'
        ],
        achievements: [
          'SUS usability score of 79.7/100 in professional evaluation',
          'Publication of scientific article in IEEE Latin America Transactions',
          'Development of more than 15 different therapeutic activities with 3 difficulty levels each',
          'Successful implementation of interface adapted to aphasia patients needs'
        ],
        images: {
          profile: 'Profile view in AfasiaApp',
          lecturaComprensiva: 'Reading comprehension activity in AfasiaApp',
          listaActividades: 'Activities list in AfasiaApp',
          login: 'Login in AfasiaApp'
        }
      },
      hints: {
        desktopInteraction: 'Click on desktop icons to interact!'
      }
    }
  }
};

export function t(key: string, locale?: string): string | string[] {
  const currentLocale = locale || getCurrentLanguage();
  const keys = key.split('.');
  let value = translations[currentLocale];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key;
    }
  }
  
  return value;
} 