import type { PaletaRiesgo } from '../datos-demo';

/** Píldora "Riesgo Alto/Medio/Bajo" usada en tarjetas, ficha y tabla. */
export default function BadgeRiesgo({
  paleta,
  texto,
  compacto = false,
}: {
  paleta: PaletaRiesgo;
  texto: string;
  compacto?: boolean;
}) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: compacto ? '3px 8px' : '4px 9px',
        borderRadius: 9,
        fontSize: 11.5,
        fontWeight: 600,
        alignSelf: 'flex-start',
        background: paleta.riesgoFondo,
        color: paleta.riesgoTexto,
        border: `1px solid ${paleta.riesgoBorde}`,
      }}
    >
      <span
        style={{
          width: compacto ? 5 : 6,
          height: compacto ? 5 : 6,
          borderRadius: '50%',
          background: paleta.riesgoPunto,
        }}
      />
      {texto}
    </span>
  );
}
