interface MenuItem {
  icon: string;
  translationKey: string;
  link?: string;
}

export const menuItems: MenuItem[] = [
  {
    icon: 'fa-solid fa-user-tie',
    translationKey: 'about',
  },
  {
    icon: 'fa-solid fa-folder-tree',
    translationKey: 'projects',
  },
  {
    icon: 'fa-solid fa-laptop-code',
    translationKey: 'skills',
  },
  {
    icon: 'fa-solid fa-paper-plane',
    translationKey: 'contact',
    link: 'mailto:and.sanchezc@outlook.com'
  },
  {
    icon: 'fa-brands fa-github',
    translationKey: 'Github',
    link: 'https://github.com/asanchezRay'
  },
  {
    icon: 'fa-brands fa-gitlab',
    translationKey: 'Gitlab',
    link: 'https://gitlab.com/asanchez35'
  },
  {
    icon: 'fa-brands fa-linkedin',
    translationKey: 'Linkedin',
    link: 'https://cl.linkedin.com/in/andressanchezc'
  },
  {
    icon: 'fa-solid fa-file-pdf',
    translationKey: 'cv',
    link: '/CV_Andres_Sanchez_Cabrera.pdf',
  }
]; 