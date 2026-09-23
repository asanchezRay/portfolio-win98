// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://asanchezc.netlify.app',
  output: 'static',
  integrations: [
    mdx(),
    sitemap({
      // El escritorio Windows 98 es una pieza de archivo y las dos rutas
      // publicadas son redirecciones: ninguna deberia competir en buscadores
      // con el portafolio real.
      filter: (page) =>
        !page.includes('/98') &&
        !page.includes('/readme') &&
        !page.includes('/myAphasia'),
    }),
  ],
  // Nota: NO cambiar build.format a 'file'. El formato de directorio
  // (dist/readme/index.html) es el que esta desplegado y probado; /readme y
  // /myAphasia estan impresas en la publicacion de IEEE y no se arriesga
  // alterar como se sirven por cosmetica de barra final.
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true,
    },
  },
});
