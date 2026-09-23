/**
 * Sitios de las organizaciones donde trabajo o trabajé.
 *
 * Viven en un solo lugar porque el mismo nombre aparece en la trayectoria, el
 * CV, la ficha de cada caso y el índice del taller. Las que no están acá se
 * muestran como texto: es mejor no enlazar que enlazar a donde no corresponde.
 */
export const organizaciones: Record<string, string> = {
  IGX: 'https://igx.cl',
  'Energía Simple': 'https://energiasimple.cl/',
  Buk: 'https://buk.cl',
  Vestuá: 'https://vestua.cl',
};

/** Los nombres compuestos vienen separados por " · " y se enlazan por parte. */
export function partirOrganizacion(nombre: string): string[] {
  return nombre.split('·').map((p) => p.trim());
}
