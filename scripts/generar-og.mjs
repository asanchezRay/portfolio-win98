#!/usr/bin/env node
/**
 * Genera public/og.png, la imagen que se ve al compartir el sitio.
 *
 * Lee los datos de src/data/perfil.ts en vez de repetirlos. La version
 * anterior los tenia escritos a mano y quedo mostrando el titular de dos
 * revisiones atras, el rol antiguo y una cifra con formato viejo: nadie se da
 * cuenta hasta que pega el enlace en alguna parte.
 *
 * Se versiona el PNG resultante porque el build de Netlify no tiene navegador.
 *
 * Uso:  npm run generar:og
 * Requiere Playwright; si no esta en este repo, pasar PLAYWRIGHT=<ruta>.
 */
const modulo = process.env.PLAYWRIGHT ?? 'playwright-core';
let chromium;
try {
  ({ chromium } = await import(modulo));
} catch {
  console.error(`No se pudo cargar Playwright desde "${modulo}".`);
  process.exit(1);
}

const { perfil } = await import('../src/data/perfil.ts');

const cifras = perfil.cifras
  .map(
    (c) => `<div class="cifra">
      <b>${c.valor}${c.unidad ? `<i>${c.unidad}</i>` : ''}</b>
      <span>${c.etiqueta}</span>
    </div>`
  )
  .join('');

// El mismo lenguaje visual de la portada: consola, monoespaciada, cuadricula
// de fondo y ambar de fosforo. Una tarjeta que no se parece al sitio confunde.
const html = `<!doctype html>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; }
  body {
    width: 1200px; height: 630px;
    padding: 64px 72px;
    display: flex; flex-direction: column; justify-content: space-between;
    background: #0a0d0c;
    color: #d6e2d6;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace;
    background-image:
      linear-gradient(#1e2826 1px, transparent 1px),
      linear-gradient(90deg, #1e2826 1px, transparent 1px);
    background-size: 40px 40px;
  }
  .rotulo {
    font-size: 17px; font-weight: 600;
    letter-spacing: 0.16em; text-transform: uppercase; color: #64756a;
  }
  h1 {
    margin-top: 26px;
    font-size: 58px; line-height: 1.08; font-weight: 600;
    letter-spacing: -0.01em; text-transform: uppercase;
    max-width: 19ch;
  }
  h1 b { color: #ffb000; font-weight: 600; }
  .pie { display: flex; align-items: flex-end; justify-content: space-between; gap: 40px; }
  .quien strong { display: block; font-size: 27px; font-weight: 600; }
  .quien span { display: block; margin-top: 6px; font-size: 17px; color: #8fa08f; }
  .cifras { display: flex; gap: 40px; }
  .cifra { border-top: 2px solid #35443f; padding-top: 12px; }
  .cifra b { display: block; font-size: 42px; font-weight: 600; line-height: 1; letter-spacing: -0.02em; }
  .cifra b i { font-style: normal; font-size: 22px; color: #ff7b3d; }
  .cifra span {
    display: block; margin-top: 9px; max-width: 15ch;
    font-size: 13px; line-height: 1.35; color: #64756a;
  }
</style>
<p class="rotulo">${perfil.ubicacion} · ${perfil.modalidad}</p>
<h1><b>&gt;</b> ${perfil.titular}</h1>
<div class="pie">
  <p class="quien"><strong>${perfil.nombre}</strong><span>${perfil.rol} · ${perfil.organizacion}</span></p>
  <div class="cifras">${cifras}</div>
</div>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: 'networkidle' });
await page.screenshot({ path: 'public/og.png' });
await browser.close();

console.log('public/og.png');
console.log(`  titular: ${perfil.titular}`);
console.log(`  rol:     ${perfil.rol}`);
