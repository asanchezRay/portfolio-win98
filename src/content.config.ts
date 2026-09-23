import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Casos: el nucleo del portafolio.
 *
 * Hay dos sabores segun que se puede mostrar. Los de tipo 'producto' tienen
 * interfaz que ensenar (capturas, video, demo); los de 'infraestructura' y
 * 'practica' son trabajo que no se puede pantallazear, y se muestran con
 * diagramas y graficos.
 */
const casos = defineCollection({
  loader: glob({ base: './src/content/casos', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    titulo: z.string(),
    subtitulo: z.string(),
    /** Frase corta para la tarjeta de la portada. */
    resumen: z.string(),
    tipo: z.enum(['producto', 'infraestructura', 'practica']),
    organizacion: z.string(),
    periodo: z.string(),
    rol: z.string(),
    stack: z.array(z.string()),

    /** Orden de aparicion; menor primero. */
    orden: z.number(),
    /** Si aparece en la portada o solo en el indice de casos. */
    destacado: z.boolean().default(false),

    /**
     * Cifras dura del caso. Se renderizan grandes, con unidad separada del
     * numero para poder componerlas tipograficamente.
     */
    cifras: z
      .array(
        z.object({
          valor: z.string(),
          unidad: z.string().optional(),
          etiqueta: z.string(),
        })
      )
      .max(4)
      .default([]),

    /**
     * Captura que representa al caso en las rejillas. Los casos que no tienen
     * interfaz que mostrar la omiten y la tarjeta se apoya en su cifra
     * principal; los diagramas viven en el cuerpo, donde tienen contexto y
     * pie de figura.
     */
    imagen: z
      .object({
        src: z.string(),
        alt: z.string(),
      })
      .optional(),

    enlaces: z
      .array(
        z.object({
          href: z.string(),
          texto: z.string(),
          /** Marca los enlaces que salen del sitio. */
          externo: z.boolean().default(false),
        })
      )
      .default([]),

    /** Aparece al pie del caso como nota de honestidad cuando corresponde. */
    nota: z.string().optional(),
  }),
});

export const collections = { casos };
