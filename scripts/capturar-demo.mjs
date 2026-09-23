#!/usr/bin/env node
/**
 * Congela Organizatumatri como un sitio estatico navegable dentro de este repo.
 *
 * El portafolio es estatico en Netlify, asi que no puede correr una app Next
 * con Postgres. Lo que si puede es servir una copia congelada: se visita la
 * app corriendo en local, se guarda el DOM ya renderizado de cada pantalla,
 * se bajan sus assets y se le quita el JavaScript.
 *
 * Quitar el JS es deliberado y no una limitacion aceptada a regañadientes.
 * Con el runtime de Next vivo, cada pagina intentaria hidratar y llamar a una
 * API que no existe: errores en consola, estados de carga infinitos y botones
 * que fallan al tocarlos. Sin JS, la copia se ve exactamente como la app y no
 * miente sobre lo que puede hacer.
 *
 * A cambio se gana algo que un demo con login no da: las pantallas privadas
 * (panel del proveedor, CRM, cotizador, panel de novios) quedan visibles para
 * cualquiera, sin credenciales y sin riesgo, porque no hay nada que operar.
 *
 * Uso, con Organizatumatri corriendo en :3000 y sembrado con datos de demo:
 *   node scripts/capturar-demo.mjs
 *
 * Requiere Playwright. Si no esta en este repo:
 *   PLAYWRIGHT=/ruta/a/node_modules/playwright-core/index.mjs node scripts/capturar-demo.mjs
 */
import { mkdir, writeFile, copyFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const ORIGEN = process.env.ORIGEN ?? 'http://localhost:3000';
/** Repo de la app, para rescatar assets que el dev server no sirve. */
const REPO = process.env.REPO ?? path.resolve('../vivanlosnovios');
const BASE = '/demo/organizatumatri';
const SALIDA = path.resolve('public/demo/organizatumatri');

const CUENTAS = {
  proveedor: { email: 'proveedor0@ejemplo.cl', password: 'demo1234' },
  pareja: { email: 'pareja0@ejemplo.cl', password: 'demo1234' },
};

/** Cada entrada es [ruta en la app, nombre del archivo, titulo para el indice]. */
const PANTALLAS = {
  publico: [
    ['/', 'portada', 'Portada'],
    ['/proveedores', 'proveedores', 'Directorio de proveedores'],
    ['/para-proveedores', 'para-proveedores', 'Landing para proveedores'],
    ['/calculadora-presupuesto', 'calculadora', 'Calculadora de presupuesto'],
    ['/nosotros', 'nosotros', 'Nosotros'],
  ],
  proveedor: [
    ['/vendor/dashboard', 'proveedor-resumen', 'Panel del proveedor'],
    ['/vendor/dashboard?tab=parejas', 'proveedor-crm', 'CRM de parejas'],
    ['/vendor/dashboard?tab=consultas', 'proveedor-consultas', 'Consultas recibidas'],
    ['/vendor/dashboard?tab=cotizador', 'proveedor-cotizador', 'Cotizador'],
    ['/vendor/dashboard?tab=contratos', 'proveedor-contratos', 'Contratos'],
    ['/vendor/dashboard?tab=calendario', 'proveedor-agenda', 'Agenda'],
    ['/vendor/dashboard?tab=estadisticas', 'proveedor-estadisticas', 'Estadísticas'],
    ['/vendor/dashboard?tab=perfil', 'proveedor-perfil', 'Edición de perfil'],
  ],
  pareja: [
    ['/couple/dashboard', 'novios-resumen', 'Panel de novios'],
    ['/couple/dashboard?tab=budget', 'novios-presupuesto', 'Presupuesto'],
    ['/couple/dashboard?tab=checklist', 'novios-checklist', 'Checklist'],
    ['/couple/dashboard?tab=guests', 'novios-invitados', 'Invitados'],
    ['/couple/dashboard?tab=itinerary', 'novios-itinerario', 'Itinerario'],
    ['/couple/dashboard?tab=favorites', 'novios-favoritos', 'Favoritos'],
  ],
};

const modulo = process.env.PLAYWRIGHT ?? 'playwright-core';
let chromium;
try {
  ({ chromium } = await import(modulo));
} catch {
  console.error(`No se pudo cargar Playwright desde "${modulo}".`);
  process.exit(1);
}

const assets = new Map(); // url absoluta -> ruta dentro del snapshot

/**
 * Convierte una URL de la app en su ruta dentro del snapshot y la registra
 * para descargarla despues. Las URL del optimizador de imagenes de Next se
 * resuelven a la imagen original: guardar "?url=...&w=640&q=75" como nombre de
 * archivo es un problema innecesario.
 */
function registrarAsset(url) {
  if (!url || url.startsWith('data:') || url.startsWith('blob:')) return url;

  let u;
  try {
    u = new URL(url, ORIGEN);
  } catch {
    return url;
  }
  if (u.origin !== new URL(ORIGEN).origin) return url; // externo, se deja

  if (u.pathname === '/_next/image') {
    const original = u.searchParams.get('url');
    if (original) return registrarAsset(decodeURIComponent(original));
  }

  const rel = u.pathname.replace(/^\//, '');
  assets.set(u.href, rel);
  return `${BASE}/${rel}`;
}

const browser = await chromium.launch();

async function sesion(cuenta, destino) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
  });

  // La app muestra un modal de "muy pronto el lanzamiento oficial" que tapa
  // todo y se recuerda en sessionStorage. Como la copia va sin JavaScript, el
  // boton de cerrar no funcionaria y el modal quedaria encima para siempre.
  // Se marca como visto antes de cargar nada, que es lo mismo que pasa cuando
  // un usuario lo cierra.
  await ctx.addInitScript(() => {
    try {
      sessionStorage.setItem('launch_popup_seen', '1');
    } catch {
      /* sin sessionStorage el modal tampoco se muestra */
    }
  });

  if (!cuenta) return ctx;

  const p = await ctx.newPage();
  // El callbackUrl importa: sin el, Auth.js deja la sesion a medias y la
  // navegacion siguiente vuelve al login.
  await p.goto(`${ORIGEN}/login?callbackUrl=${encodeURIComponent(destino)}`, {
    waitUntil: 'networkidle',
  });
  await p.fill('input[name="email"]', cuenta.email);
  await p.fill('input[name="password"]', cuenta.password);
  await p.click('button[type="submit"]');

  // Esperar a la URL de destino y no a networkidle: el idle llega antes de
  // que la cookie de sesion este puesta, y entonces se capturan logins.
  try {
    await p.waitForURL(`**${destino}**`, { timeout: 60_000 });
  } catch {
    await p.close();
    await ctx.close();
    throw new Error(
      `No se pudo iniciar sesión como ${cuenta.email}. ` +
        '¿Corriste la semilla de demo contra esta base?'
    );
  }
  await p.close();
  return ctx;
}

/** Aviso fijo, para que nadie crea que esta usando la plataforma de verdad. */
const AVISO = `
<div id="aviso-demo">
  <span><strong>Copia congelada</strong> de Organizatumatri, sin backend. Los datos son inventados y no se puede operar nada.</span>
  <a href="${BASE}/">Ver todas las pantallas</a>
  <a href="/casos/organizatumatri">El caso</a>
</div>
<style>
  #aviso-demo {
    position: sticky; top: 0; z-index: 99999;
    display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem 1.25rem;
    padding: 0.6rem 1rem;
    background: #0a0d0c; color: #d6e2d6;
    border-bottom: 1px solid #35443f;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 12px; line-height: 1.4;
  }
  #aviso-demo strong { color: #ffb000; }
  #aviso-demo a { color: #ffb000; }
</style>
`;

async function capturar(ctx, ruta, archivo) {
  const page = await ctx.newPage();
  const res = await page.goto(ORIGEN + ruta, { waitUntil: 'networkidle', timeout: 60_000 });
  if (!res || res.status() >= 400) {
    console.warn(`  ${ruta} → ${res?.status() ?? 'sin respuesta'}, se omite`);
    await page.close();
    return false;
  }
  // Si una pantalla privada rebota al login, guardarla seria peor que
  // omitirla: el snapshot mostraria un formulario en vez de la aplicacion.
  if (!ruta.startsWith('/login') && page.url().includes('/login')) {
    console.warn(`  ${ruta} → rebotó al login, se omite`);
    await page.close();
    return false;
  }

  // Deja asentar imagenes diferidas y animaciones de entrada.
  await page.waitForTimeout(1500);

  const { html, css } = await page.evaluate(
    async ({ BASE, rutas }) => {
      // El dev server de Next sirve el CSS con un ?v= que cambia en cada
      // recompilacion, asi que bajarlo despues da 404. Se trae aqui, desde
      // la propia pagina y mientras la URL sigue siendo valida.
      //
      // Se piden las hojas por fetch en vez de leer document.styleSheets
      // porque Turbopack inyecta los estilos fuera de la CSSOM clasica
      // (adoptedStyleSheets), y recorrer styleSheets devolvia vacio.
      let css = '';

      const enlaces = [...document.querySelectorAll('link[rel="stylesheet"]')];
      for (const l of enlaces) {
        try {
          const r = await fetch(l.href);
          if (r.ok) css += (await r.text()) + '\n';
        } catch {
          /* se intenta con lo que haya en la CSSOM mas abajo */
        }
      }

      const hojas = [...document.styleSheets, ...(document.adoptedStyleSheets ?? [])];
      for (const hoja of hojas) {
        try {
          for (const regla of hoja.cssRules) css += regla.cssText + '\n';
        } catch {
          // Hoja de otro origen: no se puede leer y no se necesita.
        }
      }

      for (const l of document.querySelectorAll('link[rel="stylesheet"], link[rel="preload"]')) {
        l.remove();
      }

      // Sin JS no hay hidratacion, asi que el DOM que se guarda es el final.
      for (const s of document.querySelectorAll('script')) s.remove();
      for (const n of document.querySelectorAll('noscript')) n.remove();

      // Red de seguridad: cualquier capa fija que cubra la pantalla completa
      // quedaria encima para siempre, porque no hay JS que la cierre.
      for (const el of document.querySelectorAll('body *')) {
        const e = getComputedStyle(el);
        if (e.position !== 'fixed' || e.display === 'none') continue;
        const c = el.getBoundingClientRect();
        const tapaTodo =
          c.width >= innerWidth * 0.9 &&
          c.height >= innerHeight * 0.9 &&
          Number(e.zIndex || 0) >= 10;
        if (tapaTodo) el.remove();
      }

      const aRuta = (href) => {
        if (!href) return null;
        let u;
        try {
          u = new URL(href, location.origin);
        } catch {
          return null;
        }
        if (u.origin !== location.origin) return null;
        const clave = u.pathname + u.search;
        return rutas[clave] ?? rutas[u.pathname] ?? null;
      };

      // Los enlaces internos apuntan a la pantalla capturada equivalente; los
      // que no se capturaron quedan inertes en vez de llevar a un 404.
      for (const a of document.querySelectorAll('a[href]')) {
        const destino = aRuta(a.getAttribute('href'));
        if (destino) {
          a.setAttribute('href', `${BASE}/${destino}/`);
        } else if (!a.getAttribute('href').startsWith('http')) {
          a.removeAttribute('href');
          a.style.cursor = 'default';
        }
      }

      // Los formularios no van a ninguna parte.
      for (const f of document.querySelectorAll('form')) {
        f.removeAttribute('action');
        f.setAttribute('onsubmit', 'return false');
      }

      return { html: document.documentElement.outerHTML, css };
    },
    { BASE, rutas: RUTAS_A_ARCHIVO }
  );

  await page.close();

  // Reescritura de assets fuera del navegador: es mas facil de depurar.
  let salida = html
    .replace(/(src|href)="(\/[^"]*)"/g, (m, attr, url) => {
      if (url.startsWith(BASE)) return m;
      return `${attr}="${registrarAsset(url)}"`;
    })
    .replace(/srcset="([^"]*)"/g, (m, valor) => {
      // Se queda la variante mas grande y se descarta el resto: en una copia
      // estatica no hay nada que negociar.
      const ultima = valor.split(',').pop().trim().split(/\s+/)[0];
      return `src="${registrarAsset(ultima)}"`;
    })
    .replace(/url\((['"]?)(\/[^)'"]+)\1\)/g, (m, q, url) => `url(${q}${registrarAsset(url)}${q})`);

  const cssReescrito = css.replace(
    /url\((['"]?)(\/[^)'"]+)\1\)/g,
    (m, q, url) => `url(${q}${registrarAsset(url)}${q})`
  );
  salida = salida.replace('</head>', `<style>${cssReescrito}</style></head>`);
  salida = salida.replace(/<body([^>]*)>/i, `<body$1>${AVISO}`);

  const dir = path.join(SALIDA, archivo);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, 'index.html'), `<!doctype html>\n${salida}`);

  // Se bajan ahora y no al final: en desarrollo las URL de los assets caducan.
  await bajarPendientes(ctx);
  return true;
}

const yaBajados = new Set();

async function bajarPendientes(ctx) {
  for (const [url, rel] of assets) {
    if (yaBajados.has(url)) continue;
    yaBajados.add(url);
    try {
      const res = await ctx.request.get(url, { timeout: 30_000 });
      if (!res.ok()) throw new Error(`HTTP ${res.status()}`);
      const destino = path.join(SALIDA, rel);
      await mkdir(path.dirname(destino), { recursive: true });
      await writeFile(destino, await res.body());
      conteo.ok++;
    } catch (e) {
      // Los assets importados desde el codigo (logos, iconos) se sirven en
      // /_next/static/media con un hash de contenido en el nombre, y el dev
      // server a veces responde 404 al pedirlos por separado. Se buscan por
      // nombre en el repo de la app, que es donde viven de verdad.
      if (await rescatarDelRepo(rel)) {
        conteo.rescatados++;
        continue;
      }
      conteo.fallidos++;
      if (conteo.fallidos <= 6) console.warn(`  falló ${url}: ${e.message}`);
    }
  }
}

const conteo = { ok: 0, fallidos: 0, rescatados: 0 };

/** Índice perezoso de los archivos del repo de la app, por nombre base. */
let indiceRepo = null;

async function construirIndice(dir, acum, prof = 0) {
  if (prof > 4) return acum;
  let entradas;
  try {
    entradas = await readdir(dir, { withFileTypes: true });
  } catch {
    return acum;
  }
  for (const e of entradas) {
    if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
    const completo = path.join(dir, e.name);
    if (e.isDirectory()) await construirIndice(completo, acum, prof + 1);
    else if (!acum.has(e.name)) acum.set(e.name, completo);
  }
  return acum;
}

async function rescatarDelRepo(rel) {
  const archivo = path.basename(rel);
  // Se quita el hash de contenido que Next intercala: logo.7780855b.png.
  const sinHash = archivo.replace(/\.[0-9a-f]{8}(\.[a-z0-9]+)$/i, '$1');

  if (!indiceRepo) {
    indiceRepo = new Map();
    for (const sub of ['assets', 'public', 'src']) {
      await construirIndice(path.join(REPO, sub), indiceRepo);
    }
  }

  const origen = indiceRepo.get(sinHash) ?? indiceRepo.get(archivo);
  if (!origen) return false;

  const destino = path.join(SALIDA, rel);
  await mkdir(path.dirname(destino), { recursive: true });
  await copyFile(origen, destino);
  return true;
}

// Mapa ruta-de-la-app → carpeta del snapshot, disponible dentro del navegador.
const RUTAS_A_ARCHIVO = Object.fromEntries(
  Object.values(PANTALLAS).flat().map(([ruta, archivo]) => [ruta, archivo])
);

const capturadas = [];

for (const [perfil, lista] of Object.entries(PANTALLAS)) {
  console.log(`\n${perfil}:`);
  const ctx = await sesion(
    perfil === 'publico' ? null : CUENTAS[perfil],
    lista[0][0].split('?')[0]
  );
  for (const [ruta, archivo, titulo] of lista) {
    const ok = await capturar(ctx, ruta, archivo);
    if (ok) {
      capturadas.push({ perfil, archivo, titulo, ruta });
      console.log(`  ${archivo}`);
    }
  }
  await ctx.close();
}

await browser.close();
console.log(
  `\nAssets: ${conteo.ok} bajados, ${conteo.rescatados} rescatados del repo, ${conteo.fallidos} fallidos`
);

// ── Índice ───────────────────────────────────────────────────────────────────
const grupo = (p) =>
  ({ publico: 'Público', proveedor: 'Panel del proveedor', pareja: 'Panel de novios' })[p];

const filas = ['publico', 'proveedor', 'pareja']
  .map((p) => {
    const items = capturadas.filter((c) => c.perfil === p);
    if (!items.length) return '';
    return `<section>
      <h2>${grupo(p)}</h2>
      <ul>${items
        .map((c) => `<li><a href="${BASE}/${c.archivo}/">${c.titulo}</a><span>${c.ruta}</span></li>`)
        .join('')}</ul>
    </section>`;
  })
  .join('\n');

await writeFile(
  path.join(SALIDA, 'index.html'),
  `<!doctype html>
<html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Organizatumatri — copia congelada</title>
<style>
  :root { color-scheme: dark; }
  body { margin:0; padding:2.5rem 1.25rem 4rem; background:#0a0d0c; color:#d6e2d6;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size:14px; line-height:1.55; }
  .caja { max-width:52rem; margin-inline:auto; }
  h1 { font-size:1.5rem; text-transform:uppercase; letter-spacing:-0.01em; margin:0 0 1rem; }
  h1::before { content:'> '; color:#ffb000; }
  p { color:#8fa08f; max-width:44rem; }
  h2 { font-size:0.75rem; letter-spacing:0.14em; text-transform:uppercase; color:#64756a;
    margin:2.5rem 0 0.75rem; padding-bottom:0.5rem; border-bottom:1px solid #35443f; }
  ul { list-style:none; margin:0; padding:0; }
  li { display:flex; justify-content:space-between; gap:1rem; padding:0.5rem 0;
    border-bottom:1px solid #1e2826; }
  li span { color:#64756a; font-size:12px; }
  a { color:#ffb000; }
  .volver { display:inline-block; margin-top:2.5rem; }
</style></head>
<body><div class="caja">
<h1>Organizatumatri</h1>
<p>Copia congelada de la plataforma, capturada el ${new Date().toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })}. No tiene backend: los datos son inventados y no se puede operar nada.</p>
<p>Están incluidas las pantallas privadas, que en la plataforma real exigían cuenta. Acá se ven sin credenciales porque no hay nada que proteger.</p>
${filas}
<a class="volver" href="/casos/organizatumatri">← El caso completo</a>
</div></body></html>
`
);

console.log(`\nSnapshot en ${SALIDA}`);
console.log(`Pantallas: ${capturadas.length}`);
