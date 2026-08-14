import type { CSSProperties } from 'react';

// Paleta del diseño importado desde Claude Design.
export const COLORES = {
  fondo: '#dff0e4',
  panel: '#ffffff',
  borde: '#e0efe4',
  bordeSuave: '#eef8f1',
  bordeMedio: '#e7f4ea',
  verde: '#147a4a',
  verdeOscuro: '#0e5c37',
  verdeClaro: '#3aa855',
  tinta: '#16302a',
  tintaSuave: '#1d3b31',
  texto: '#4a6b5f',
  textoTenue: '#638074',
  textoDebil: '#7b9489',
  gris: '#9dbaad',
  ambar: '#c99a1e',
  ambarOscuro: '#8a6a12',
  rojo: '#b3453b',
} as const;

export const FUENTE_MONO = 'var(--fuente-mono), ui-monospace, monospace';

/** Tarjeta blanca con borde y sombra, base de casi todo el dashboard. */
export const tarjeta: CSSProperties = {
  background: COLORES.panel,
  border: `1px solid ${COLORES.borde}`,
  borderRadius: 18,
  boxShadow: '0 2px 10px rgba(20,90,55,.06)',
};

/** Etiqueta monoespaciada en versalitas usada como encabezado de sección. */
export const etiquetaMono: CSSProperties = {
  fontFamily: FUENTE_MONO,
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.07em',
  color: COLORES.textoTenue,
};

const CHIP_BASE: CSSProperties = {
  padding: '7px 11px',
  borderRadius: 20,
  fontSize: 12.5,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: 6,
};

export const CHIP_OFF: CSSProperties = {
  ...CHIP_BASE,
  border: `1px solid ${COLORES.borde}`,
  background: COLORES.panel,
  color: '#3f556e',
  fontWeight: 500,
};

export const CHIP_ON: CSSProperties = {
  ...CHIP_BASE,
  border: `1px solid ${COLORES.verde}`,
  background: '#e4f6e9',
  color: COLORES.verdeOscuro,
  fontWeight: 600,
};

export const chip = (activo: boolean): CSSProperties => (activo ? CHIP_ON : CHIP_OFF);

const NAV_BASE: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  width: '100%',
  textAlign: 'left',
  padding: '10px 12px',
  border: 'none',
  borderRadius: 12,
  fontSize: 13.5,
  cursor: 'pointer',
};

export const NAV_OFF: CSSProperties = {
  ...NAV_BASE,
  background: 'transparent',
  color: '#3d5f51',
  fontWeight: 500,
};

export const NAV_ON: CSSProperties = {
  ...NAV_BASE,
  background: COLORES.verdeOscuro,
  color: '#fff',
  fontWeight: 600,
};

/** Botón verde sólido. La clase agrega el hover (ver dashboard/layout.tsx). */
export const botonPrimario: CSSProperties = {
  padding: '9px 12px',
  borderRadius: 12,
  border: `1px solid ${COLORES.verde}`,
  background: COLORES.verde,
  color: '#fff',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
};

/** Botón blanco con borde. La clase agrega el hover. */
export const botonSuave: CSSProperties = {
  padding: '9px 14px',
  borderRadius: 12,
  border: '1px solid #cde5d3',
  background: COLORES.panel,
  color: '#1c463a',
  fontSize: 12.5,
  fontWeight: 600,
  cursor: 'pointer',
};

export const selector: CSSProperties = {
  fontFamily: 'inherit',
  fontSize: 12.5,
  color: '#1c463a',
  border: `1px solid ${COLORES.borde}`,
  borderRadius: 12,
  padding: '7px 9px',
  background: COLORES.panel,
};

export const campoBusqueda: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  flex: 1,
  minWidth: 250,
  maxWidth: 320,
  border: `1px solid ${COLORES.borde}`,
  borderRadius: 12,
  padding: '8px 11px',
  background: '#f7fcf8',
};

export const inputDesnudo: CSSProperties = {
  border: 'none',
  outline: 'none',
  background: 'transparent',
  fontSize: 13,
  color: COLORES.tinta,
  width: '100%',
  fontFamily: 'inherit',
};

/** Punto de color reutilizado en badges, timeline y leyendas. */
export const punto = (color: string, tamano = 6): CSSProperties => ({
  width: tamano,
  height: tamano,
  borderRadius: '50%',
  background: color,
  flex: 'none',
});
