/**
 * Formateo de fechas para el panel.
 *
 * Dos tipos de valor conviven en la base:
 *   - Columnas `date` (ultimo_control, proximo_control) que llegan como
 *     'YYYY-MM-DD'. Se parsean a mano: pasarlas por `new Date()` las
 *     interpreta como medianoche UTC y, al mostrarlas en horario de Chile,
 *     retrocederían un día.
 *   - Columnas `timestamptz` (creado_en) que llegan con zona. Esas sí se
 *     convierten a America/Santiago.
 *
 * Todo el formateo es determinista (zona horaria explícita) para que el
 * servidor y el cliente rendericen igual y no haya mismatch de hidratación.
 */

const TZ = "America/Santiago";

const MESES = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];

const SOLO_FECHA = /^(\d{4})-(\d{2})-(\d{2})$/;

const FORMATO_FECHA = new Intl.DateTimeFormat("es-CL", {
  timeZone: TZ,
  day: "numeric",
  month: "numeric",
});

const FORMATO_FECHA_HORA = new Intl.DateTimeFormat("es-CL", {
  timeZone: TZ,
  day: "numeric",
  month: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function partes(formato: Intl.DateTimeFormat, fecha: Date) {
  const salida: Record<string, string> = {};
  for (const parte of formato.formatToParts(fecha)) salida[parte.type] = parte.value;
  return salida;
}

/** '2026-06-02' o ISO completo -> '2 jun'. Null/inválido -> '—'. */
export function fmtFecha(valor: string | null | undefined): string {
  if (!valor) return "—";

  const plana = SOLO_FECHA.exec(valor.trim());
  if (plana) {
    const mes = Number(plana[2]) - 1;
    return `${Number(plana[3])} ${MESES[mes] ?? "?"}`;
  }

  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return "—";
  const p = partes(FORMATO_FECHA, fecha);
  return `${Number(p.day)} ${MESES[Number(p.month) - 1] ?? "?"}`;
}

/** timestamptz -> '13 ago 06:20' en hora de Chile. */
export function fmtFechaHora(valor: string | null | undefined): string {
  if (!valor) return "—";
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return "—";
  const p = partes(FORMATO_FECHA_HORA, fecha);
  const mes = MESES[Number(p.month) - 1] ?? "?";
  return `${Number(p.day)} ${mes} ${p.hour}:${p.minute}`;
}

/**
 * Días entre `iso` y `hoy`, con signo: positivo si la fecha ya pasó, negativo
 * si está por venir. Null si no hay fecha o no se puede parsear.
 */
export function diasRelativos(iso: string | null | undefined, hoy: Date): number | null {
  if (!iso) return null;
  const fecha = new Date(iso);
  if (Number.isNaN(fecha.getTime())) return null;
  return Math.round((hoy.getTime() - fecha.getTime()) / 86_400_000);
}

/** Días transcurridos entre `iso` y `hoy`. Nunca negativo. */
export function diasDesde(iso: string | null | undefined, hoy: Date): number {
  return Math.max(0, diasRelativos(iso, hoy) ?? 0);
}
