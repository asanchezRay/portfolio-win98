#!/usr/bin/env node
/**
 * Verifica que las rutas publicadas sobrevivan al build.
 *
 * /readme y /myAphasia estan referenciadas desde la publicacion de AfasiaApp
 * en IEEE Latin America Transactions. Son enlaces impresos y no se pueden
 * romper. Este script corre despues de cada build y falla ruidosamente si
 * alguna desaparece o si cambia su destino.
 *
 * Si alguna vez necesitas cambiar un destino a proposito, actualiza la URL
 * aca, en public/_redirects y en la pagina .astro correspondiente.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';

const README_URL = 'https://github.com/asanchezRay/afasiaApp/blob/master/README.md';
const APK_URL = 'https://drive.google.com/file/d/1pYGfndA-e_tn_XjcofslTrW9FNAP6aC4/view';

/** Paginas estaticas de respaldo: deben existir y apuntar al destino correcto. */
const pages = [
  { path: 'readme/index.html', url: README_URL, route: '/readme' },
  { path: 'myAphasia/index.html', url: APK_URL, route: '/myAphasia' },
];

/** Reglas que deben estar presentes en _redirects (el redirect real de Netlify). */
const rules = [
  { route: '/readme', url: README_URL },
  { route: '/readme/', url: README_URL },
  { route: '/myAphasia', url: APK_URL },
  { route: '/myAphasia/', url: APK_URL },
  { route: '/myaphasia', url: APK_URL },
  { route: '/myaphasia/', url: APK_URL },
];

const errors = [];

for (const { path, url, route } of pages) {
  const full = join(DIST, path);
  if (!existsSync(full)) {
    errors.push(`Falta la pagina de respaldo ${route} (esperaba ${full})`);
    continue;
  }
  const html = readFileSync(full, 'utf8');
  if (!html.includes(url)) {
    errors.push(`${route} ya no apunta a ${url}`);
  }
  // El meta refresh es lo que hace que funcione sin JavaScript.
  if (!html.includes('http-equiv="refresh"')) {
    errors.push(`${route} perdio el <meta http-equiv="refresh"> (dejaria de funcionar sin JS)`);
  }
}

const redirectsFile = join(DIST, '_redirects');
if (!existsSync(redirectsFile)) {
  errors.push('Falta dist/_redirects (Netlify no serviria los 302)');
} else {
  const body = readFileSync(redirectsFile, 'utf8');
  const lineas = body.split('\n').filter((l) => !l.trimStart().startsWith('#') && l.trim());

  for (const { route, url } of rules) {
    const coincidencias = lineas.filter(
      (l) => l.split(/\s+/)[0] === route && l.includes(url)
    );
    if (coincidencias.length === 0) {
      errors.push(`_redirects no tiene una regla para ${route} -> ${url}`);
      continue;
    }
    // El "!" es obligatorio. Netlify ignora una redireccion cuando existe un
    // archivo estatico en esa ruta, y el build genera paginas de respaldo
    // justamente ahi. Sin forzar, el 302 no se aplica nunca y la redireccion
    // queda dependiendo del meta refresh. Paso en produccion una vez.
    if (!coincidencias.some((l) => /\s30[12]!\s*$/.test(l))) {
      errors.push(
        `la regla de ${route} no esta forzada: tiene que terminar en "302!" o la ` +
          `pagina estatica de respaldo la deja sin efecto`
      );
    }
  }
}

if (errors.length) {
  console.error('\n  RUTAS PUBLICADAS ROTAS\n');
  for (const e of errors) console.error(`   - ${e}`);
  console.error(
    '\n  Estas rutas estan impresas en la publicacion de IEEE. Arreglalo antes de desplegar.\n'
  );
  process.exit(1);
}

console.log(`Rutas publicadas OK (${pages.length} paginas de respaldo, ${rules.length} reglas de redirect)`);
