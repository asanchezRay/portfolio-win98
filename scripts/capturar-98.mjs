#!/usr/bin/env node
/**
 * Regenera las capturas del escritorio Windows 98 que usa /casos/portafolio-98.
 *
 * Se guardan en el repo en vez de generarse en cada build porque el escritorio
 * es una pieza de archivo que ya no cambia, y porque el build de Netlify no
 * tiene navegador.
 *
 * Uso:
 *   npm run build && npx astro preview --port 4321 &
 *   node scripts/capturar-98.mjs
 *
 * Requiere Playwright. Si no esta instalado en este repo, se le puede pasar la
 * ruta a otra instalacion:
 *   PLAYWRIGHT=/ruta/a/node_modules/playwright-core/index.mjs node scripts/capturar-98.mjs
 */
import { mkdir } from 'node:fs/promises';

const BASE = process.env.BASE ?? 'http://localhost:4321';
const SALIDA = 'public/img/98';
const modulo = process.env.PLAYWRIGHT ?? 'playwright-core';

let chromium;
try {
  ({ chromium } = await import(modulo));
} catch {
  console.error(
    `No se pudo cargar Playwright desde "${modulo}".\n` +
      'Instálalo con `npm i -D playwright-core` o apunta a otra instalación con la ' +
      'variable PLAYWRIGHT.'
  );
  process.exit(1);
}

await mkdir(SALIDA, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 2,
});

await page.goto(`${BASE}/98`, { waitUntil: 'networkidle' });
// El fondo de código se dibuja con una animación; se le da tiempo a asentarse.
await page.waitForTimeout(1500);

// 1. El estado con el que recibía a una visita: iconos y nada más.
await page.screenshot({ path: `${SALIDA}/escritorio-vacio.png` });
console.log(`${SALIDA}/escritorio-vacio.png`);

// 2. Con una ventana abierta, que es donde se ve el chrome hecho a mano.
//    La ventana no trae posicion inicial en CSS (queda donde la deja el flujo),
//    asi que para la captura se la coloca a mano en un lugar que deje ver a la
//    vez los iconos del escritorio y la barra de tareas.
await page.evaluate(() => {
  const ventana = document.querySelector('.window-modal[data-window="about"]');
  if (!(ventana instanceof HTMLElement)) return;
  ventana.setAttribute('data-open', 'true');
  ventana.style.left = '430px';
  ventana.style.top = '96px';
});
await page.waitForTimeout(600);
await page.screenshot({ path: `${SALIDA}/escritorio.png` });
console.log(`${SALIDA}/escritorio.png`);

await browser.close();
