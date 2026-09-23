#!/usr/bin/env node
/**
 * Comprueba las rutas publicadas contra el sitio desplegado.
 *
 * Existe porque el guard de build no alcanza: verifica el contenido de
 * dist/_redirects, pero no como se comporta Netlify al servirlo. Una vez
 * llegaron a produccion reglas correctas que Netlify no aplicaba, porque no
 * estaban forzadas con "!" y las paginas estaticas de respaldo las tapaban.
 * Eso solo se ve preguntandole al sitio de verdad.
 *
 * Uso:  npm run check:prod
 *       BASE=https://otro-deploy.netlify.app npm run check:prod
 */
const BASE = process.env.BASE ?? 'https://asanchezc.netlify.app';

const esperado = [
  { ruta: '/readme', destino: 'github.com/asanchezRay/afasiaApp' },
  { ruta: '/myAphasia', destino: 'drive.google.com/file/d/1pYGfndA' },
  { ruta: '/myaphasia', destino: 'drive.google.com/file/d/1pYGfndA' },
];

/** Sigue la cadena de redirecciones a mano para poder inspeccionar cada salto. */
async function seguir(url, saltos = 0) {
  if (saltos > 5) return { url, cadena: [], error: 'demasiadas redirecciones' };
  const res = await fetch(url, { redirect: 'manual' });
  const location = res.headers.get('location');
  if (res.status >= 300 && res.status < 400 && location) {
    const siguiente = new URL(location, url).href;
    // Si ya salio del dominio, la redireccion del servidor cumplio su trabajo.
    if (!siguiente.startsWith(BASE)) {
      return { url: siguiente, cadena: [`${res.status} → ${siguiente}`], servidor: true };
    }
    const r = await seguir(siguiente, saltos + 1);
    return { ...r, cadena: [`${res.status} → ${siguiente}`, ...r.cadena] };
  }
  return { url, cadena: [`${res.status}`], servidor: false, cuerpo: await res.text() };
}

const fallos = [];

for (const { ruta, destino } of esperado) {
  const r = await seguir(BASE + ruta);
  const linea = `${ruta.padEnd(12)} ${r.cadena.join('  ')}`;

  if (r.servidor && r.url.includes(destino)) {
    console.log(`  ok   ${linea}`);
    continue;
  }

  // Si no hubo redireccion del servidor, se sirvio la pagina de respaldo.
  // Funciona, pero solo con el meta refresh, que es lo que se queria evitar.
  if (!r.servidor && r.cuerpo?.includes(destino)) {
    fallos.push(
      `${ruta}: la redireccion del servidor NO se esta aplicando. Se sirve la ` +
        `pagina de respaldo y solo funciona por el meta refresh. Revisa que la ` +
        `regla en public/_redirects termine en "302!".`
    );
    console.log(`  MAL  ${linea}  (respaldo, sin 302)`);
    continue;
  }

  fallos.push(`${ruta}: no llega a ${destino}. Cadena: ${r.cadena.join(' ')}`);
  console.log(`  MAL  ${linea}`);
}

if (fallos.length) {
  console.error('\n  RUTAS PUBLICADAS CON PROBLEMAS EN PRODUCCION\n');
  for (const f of fallos) console.error(`   - ${f}`);
  console.error('');
  process.exit(1);
}

console.log(`\nLas ${esperado.length} rutas publicadas redirigen desde el servidor en ${BASE}.`);
