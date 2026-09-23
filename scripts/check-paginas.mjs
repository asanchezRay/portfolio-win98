#!/usr/bin/env node
/**
 * Revisa las paginas construidas contra los errores que ya aparecieron una vez.
 *
 * No pretende ser una auditoria completa: es una red para los fallos concretos
 * que se colaron durante la construccion de este sitio y que no se ven hasta
 * abrir la pagina en el ancho justo.
 *
 * Uso, con `npx astro preview` corriendo:
 *   npm run check:paginas
 */
const BASE = process.env.BASE ?? 'http://localhost:4321';
const modulo = process.env.PLAYWRIGHT ?? 'playwright-core';

let chromium;
try {
  ({ chromium } = await import(modulo));
} catch {
  console.error(`No se pudo cargar Playwright desde "${modulo}".`);
  process.exit(1);
}

const RUTAS = [
  '/', '/casos', '/trayectoria', '/cv', '/colofon', '/404',
  '/casos/migracion-bigquery', '/casos/sincronizacion-medidores',
  '/casos/puente-yii2-lambda', '/casos/mysql-sin-caida',
  '/casos/revision-codigo-ia', '/casos/organizatumatri',
  '/casos/afasiaapp', '/casos/portafolio-98',
];

const ANCHOS = [390, 1280];

const browser = await chromium.launch();
const problemas = [];

for (const ancho of ANCHOS) {
  const page = await browser.newPage({ viewport: { width: ancho, height: 900 } });
  const erroresJs = [];
  page.on('pageerror', (e) => erroresJs.push(String(e)));

  for (const ruta of RUTAS) {
    erroresJs.length = 0;
    const res = await page.goto(BASE + ruta, { waitUntil: 'networkidle' });
    if (!res || res.status() >= 400) {
      problemas.push(`${ruta} → HTTP ${res?.status() ?? 'sin respuesta'}`);
      continue;
    }

    const r = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const out = { desborde: document.documentElement.scrollWidth > vw + 1 };
      out.h1 = document.querySelectorAll('h1').length;
      out.sinAlt = [...document.querySelectorAll('img')]
        .filter((i) => !i.alt)
        .map((i) => i.getAttribute('src'));
      // Un enlace tiene nombre accesible si trae texto, aria-label, o una
      // imagen con alt adentro. Lo ultimo se olvida seguido.
      out.enlacesMudos = [...document.querySelectorAll('a')].filter(
        (a) =>
          !a.textContent.trim() &&
          !a.getAttribute('aria-label') &&
          !a.querySelector('img[alt]:not([alt=""])')
      ).length;
      // Palabras pegadas a un enlace. En Astro, un salto de linea entre texto
      // y un elemento se colapsa a nada, asi que "y conte\n<a>por que…" sale
      // como "y contepor que". No se ve en el codigo y si en la pagina.
      out.pegados = [];
      for (const a of document.querySelectorAll('p a, li a, dd a')) {
        // Solo interesa el texto en flujo. En una fila flex o grid la
        // separacion la da el gap, no un espacio en el HTML, y marcarla
        // seria un falso positivo.
        const padre = a.parentElement;
        const disp = padre ? getComputedStyle(padre).display : '';
        if (disp.includes('flex') || disp.includes('grid')) continue;
        const texto = a.textContent ?? '';
        const antes = a.previousSibling?.textContent ?? '';
        const despues = a.nextSibling?.textContent ?? '';
        const letra = /[\p{L}]/u;
        if (antes && letra.test(antes.slice(-1)) && letra.test(texto.slice(0, 1))) {
          out.pegados.push(`${antes.slice(-12)}|${texto.slice(0, 12)}`);
        }
        if (despues && letra.test(texto.slice(-1)) && letra.test(despues.slice(0, 1))) {
          out.pegados.push(`${texto.slice(-12)}|${despues.slice(0, 12)}`);
        }
      }

      out.desc = document.querySelector('meta[name=description]')?.content ?? '';
      out.titulo = document.title;
      return out;
    });

    if (r.desborde) problemas.push(`${ruta} @${ancho}px → desborde horizontal`);
    if (ancho === ANCHOS.at(-1)) {
      if (r.h1 !== 1) problemas.push(`${ruta} → ${r.h1} elementos h1 (debe ser 1)`);
      if (r.sinAlt.length) problemas.push(`${ruta} → img sin alt: ${r.sinAlt.join(', ')}`);
      if (r.enlacesMudos) problemas.push(`${ruta} → ${r.enlacesMudos} enlaces sin nombre accesible`);
      for (const p of r.pegados) problemas.push(`${ruta} → falta un espacio junto a un enlace: "${p.replace('|', '')}"`);
      if (!r.desc) problemas.push(`${ruta} → sin meta description`);
      if (r.titulo.length > 70) problemas.push(`${ruta} → title de ${r.titulo.length} caracteres`);
    }
    if (erroresJs.length) problemas.push(`${ruta} → error JS: ${erroresJs[0]}`);
  }
  await page.close();
}

await browser.close();

if (problemas.length) {
  console.error('\n  PROBLEMAS EN LAS PAGINAS\n');
  for (const p of problemas) console.error(`   - ${p}`);
  console.error('');
  process.exit(1);
}

console.log(
  `${RUTAS.length} rutas revisadas en ${ANCHOS.join(' y ')} px: sin desbordes, ` +
    'un h1 por pagina, alt en todas las imagenes, enlaces con nombre y metadata presente.'
);
