'use client';

import { NAV_OFF, NAV_ON } from '../estilos';
import type { Pantalla } from '../tipos';

const ITEMS: Array<{ pantalla: Pantalla; etiqueta: string }> = [
  { pantalla: 'inicio', etiqueta: 'Inicio' },
  { pantalla: 'pacientes', etiqueta: 'Pacientes' },
  { pantalla: 'seguimientos', etiqueta: 'Seguimientos' },
  { pantalla: 'historial', etiqueta: 'Historial' },
];

export default function BarraLateral({
  pantalla,
  ir,
}: {
  pantalla: Pantalla;
  ir: (destino: Pantalla) => void;
}) {
  // La ficha de paciente se abre desde Inicio, así que mantiene ese ítem activo.
  const activo: Pantalla = pantalla === 'ficha' ? 'inicio' : pantalla;

  return (
    <aside
      style={{
        width: 238,
        flex: 'none',
        background: '#f1faf3',
        color: '#22453a',
        display: 'flex',
        flexDirection: 'column',
        padding: '22px 0',
      }}
    >
      <div style={{ padding: '0 22px 26px', display: 'flex', flexDirection: 'column', gap: 3 }}>
        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: '-0.01em',
            color: '#0e5c37',
          }}
        >
          Seguimiento PSCV
        </div>
        <div style={{ fontSize: 11.5, color: '#6a8b79', letterSpacing: '0.02em' }}>
          Atención Primaria · APS
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '0 10px' }}>
        {ITEMS.map((item) => (
          <button
            key={item.pantalla}
            type="button"
            onClick={() => ir(item.pantalla)}
            style={activo === item.pantalla ? NAV_ON : NAV_OFF}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'currentColor',
                flex: 'none',
                opacity: 0.75,
              }}
            />
            {item.etiqueta}
          </button>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', padding: '20px 22px 0' }}>
        <div
          style={{
            borderTop: '1px solid rgba(0,0,0,.08)',
            paddingTop: 16,
            fontSize: 11.5,
            lineHeight: 1.5,
            color: '#5d7f6d',
          }}
        >
          El chequeo automático recopila información.
          <br />
          El seguimiento telefónico lo realiza el TENS.
        </div>
      </div>
    </aside>
  );
}
