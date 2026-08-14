/**
 * Paleta y tokens del panel, tomados tal cual del diseño (Panel PSCV).
 *
 * El diseño es denso y usa valores muy específicos (12.5px, #eff3ee), así que
 * se aplican como estilos inline en vez de traducirlos a utilidades Tailwind.
 * Los estados :hover, que no se pueden expresar inline, viven en globals.css
 * bajo las clases `pscv-*`.
 */

import type { Severidad, SeveridadTag } from "@/lib/priorizacion";
import type { TipoAccion } from "@/lib/types";

export const C = {
  fondo: "#eff3ee",
  texto: "#1b241e",
  superficie: "#ffffff",
  borde: "#dbe2da",
  bordeSuave: "#edf1ec",
  bordeMedio: "#e6ebe4",
  cabecera: "#f6f9f5",
  expandido: "#f8faf7",
  verde: "#2e6a4d",
  verdeOscuro: "#24523d",
  tenue: "#66736a",
  masTenue: "#7c887f",
  apagado: "#8b968d",
  medio: "#4c584f",
  fuerte: "#2c372f",
  inputBorde: "#c7d1c6",
  inputFondo: "#fbfdfa",
} as const;

export const LATERAL = {
  fondo: "#1e2b22",
  texto: "#cfdad0",
  sutil: "#8fa393",
  etiqueta: "#7e937f",
  item: "#aebfb0",
  campo: "#26352a",
  campoBorde: "#3a4c3e",
} as const;

export const SEV: Record<Severidad, { label: string; fg: string; bg: string; dot: string }> = {
  critica: { label: "Crítica", fg: "#a02c1c", bg: "#f9eeec", dot: "#b3271b" },
  atencion: { label: "Atención", fg: "#7d5600", bg: "#f8f2de", dot: "#c98a08" },
  rutina: { label: "Rutina", fg: "#51605a", bg: "#eef2ed", dot: "#98a49b" },
};

export const TAGC: Record<SeveridadTag, { fg: string; bg: string }> = {
  critica: { fg: "#a02c1c", bg: "#f9eeec" },
  atencion: { fg: "#7d5600", bg: "#f8f2de" },
  info: { fg: "#51605a", bg: "#eef2ed" },
};

/**
 * `estado` viene del system prompt de Cami y la columna no tiene CHECK: si
 * llega un valor fuera de esta tabla se muestra crudo con estilo neutro.
 */
const ESTADOS: Record<string, { t: string; fg: string; bg: string }> = {
  completed: { t: "completada", fg: "#2e6a4d", bg: "#eef5f0" },
  incomplete: { t: "incompleta", fg: "#7d5600", bg: "#f8f2de" },
  failed: { t: "fallida", fg: "#a02c1c", bg: "#f9eeec" },
};

export function estiloEstado(estado: string | null) {
  if (estado && ESTADOS[estado]) return ESTADOS[estado];
  return { t: estado ? String(estado) : "sin estado", fg: "#51605a", bg: "#eef2ed" };
}

export const TIPO: Record<TipoAccion, { label: string; fg: string; bg: string }> = {
  llamado: { label: "llamado realizado", fg: "#22513c", bg: "#eef5f0" },
  agendado: { label: "hora agendada", fg: "#22513c", bg: "#eef5f0" },
  sin_accion: { label: "sin acción", fg: "#51605a", bg: "#eef2ed" },
};

export function etiquetaTipo(tipo: string) {
  return TIPO[tipo as TipoAccion] ?? { label: tipo, fg: "#51605a", bg: "#eef2ed" };
}

export const RIESGO_FG: Record<string, string> = {
  alto: "#a02c1c",
  moderado: "#7d5600",
  bajo: "#51605a",
};

/** Cabecera de tabla: mismo tratamiento en las cinco vistas. */
export const CABECERA: React.CSSProperties = {
  padding: "9px 20px",
  background: C.cabecera,
  borderBottom: `1px solid ${C.bordeMedio}`,
  fontSize: "10.5px",
  fontWeight: 600,
  letterSpacing: "0.07em",
  textTransform: "uppercase",
  color: C.masTenue,
};

export const TARJETA: React.CSSProperties = {
  background: C.superficie,
  border: `1px solid ${C.borde}`,
  borderRadius: 8,
  overflow: "hidden",
};

export const ROTULO: React.CSSProperties = {
  fontSize: "10.5px",
  fontWeight: 600,
  letterSpacing: "0.07em",
  textTransform: "uppercase",
  color: C.masTenue,
};

export const MONO = "var(--font-plex-mono), ui-monospace, monospace";
