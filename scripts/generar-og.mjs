#!/usr/bin/env node
/**
 * Genera public/og.png, la imagen que se ve al compartir el sitio.
 *
 * Se renderiza una pagina HTML a 1200x630 y se captura. Se versiona el PNG
 * resultante en vez de generarlo en cada build porque el build de Netlify no
 * tiene navegador, y porque el contenido de la tarjeta casi nunca cambia.
 *
 * Uso:  node scripts/generar-og.mjs
 * Requiere Playwright; si no esta en este repo, pasar PLAYWRIGHT=<ruta>.
 */
import { readFileSync } from 'node:fs';

const modulo = process.env.PLAYWRIGHT ?? 'playwright-core';
let chromium;
try {
  ({ chromium } = await import(modulo));
} catch {
  console.error(`No se pudo cargar Playwright desde "${modulo}".`);
  process.exit(1);
}

// La fuente se incrusta en base64 para que la captura no dependa de la red.
const fuente = readFileSync('public/fonts/source-serif-4-upright.woff2').toString('base64');

const html = `<!doctype html>
<meta charset="utf-8">
<style>
  @font-face {
    font-family: 'Source Serif 4';
    font-weight: 400 600;
    src: url(data:font/woff2;base64,${fuente}) format('woff2');
  }
  * { box-sizing: border-box; margin: 0; }
  body {
    width: 1200px; height: 630px;
    padding: 76px 84px;
    display: flex; flex-direction: column; justify-content: space-between;
    background: #faf9f7;
    color: #1a1816;
    font-family: 'Source Serif 4', Georgia, serif;
  }
  .rotulo {
    font-family: ui-sans-serif, system-ui, sans-serif;
    font-size: 19px; font-weight: 600;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: #7d766d;
  }
  h1 { font-size: 66px; line-height: 1.08; letter-spacing: -0.03em; font-weight: 600; max-width: 17ch; }
  .pie { display: flex; align-items: flex-end; justify-content: space-between; gap: 48px; }
  .quien { font-family: ui-sans-serif, system-ui, sans-serif; font-size: 25px; }
  .quien strong { display: block; font-size: 31px; font-weight: 600; letter-spacing: -0.015em; }
  .quien span { color: #55504a; }
  .cifras { display: flex; gap: 52px; }
  .cifra { border-top: 3px solid #cdc6bb; padding-top: 12px; }
  .cifra b {
    display: block;
    font-family: ui-sans-serif, system-ui, sans-serif;
    font-size: 47px; font-weight: 600; letter-spacing: -0.04em; line-height: 1;
  }
  .cifra b i { font-style: normal; font-size: 26px; color: #c4670f; }
  .cifra span {
    display: block; margin-top: 8px; max-width: 13ch;
    font-family: ui-sans-serif, system-ui, sans-serif;
    font-size: 15px; line-height: 1.35; color: #55504a;
  }
</style>
<p class="rotulo">Concepción, Chile · Remoto</p>
<h1>Traduzco entre dos mundos que rara vez hablan el mismo idioma: el negocio y el sistema.</h1>
<div class="pie">
  <p class="quien"><strong>Andrés Sánchez</strong><span>Líder Técnico · IGX</span></p>
  <div class="cifras">
    <div class="cifra"><b>53<i>%</i></b><span>menos costo recurrente</span></div>
    <div class="cifra"><b>900<i>GB</i></b><span>de historia migrados</span></div>
    <div class="cifra"><b>4½<i>años</i></b><span>enseñando en la universidad</span></div>
  </div>
</div>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'networkidle' });
await page.screenshot({ path: 'public/og.png' });
await browser.close();
console.log('public/og.png');
