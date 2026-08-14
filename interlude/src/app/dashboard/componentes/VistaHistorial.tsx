'use client';

import { HISTORIAL } from '../datos-demo';
import { botonSuave, chip, etiquetaMono, selector, tarjeta } from '../estilos';
import type { FiltroHistorial } from '../tipos';

const FILTROS: Array<{ valor: FiltroHistorial; etiqueta: string }> = [
  { valor: 'todos', etiqueta: 'Todo' },
  { valor: 'medico', etiqueta: 'Control médico' },
  { valor: 'tens', etiqueta: 'Seguimiento TENS' },
  { valor: 'auto', etiqueta: 'Chequeo automático' },
];

export type PropsHistorial = {
  filtro: FiltroHistorial;
  setFiltro: (valor: FiltroHistorial) => void;
};

export default function VistaHistorial({ filtro, setFiltro }: PropsHistorial) {
  const registros = HISTORIAL.filter((h) => filtro === 'todos' || h.clase === filtro);

  return (
    <main style={{ flex: 1, padding: '30px 34px 56px', maxWidth: 1400 }}>
      <div style={{ marginBottom: 22 }}>
        <h1
          style={{
            margin: '0 0 7px',
            fontSize: 25,
            lineHeight: 1.2,
            fontWeight: 700,
            letterSpacing: '-0.015em',
          }}
        >
          Historial de contactos
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: 14,
            lineHeight: 1.5,
            color: '#4a6b5f',
            maxWidth: 680,
            textWrap: 'pretty',
          }}
        >
          Registro cronológico de las tres actividades del programa: controles médicos, seguimientos
          telefónicos del TENS y chequeos automáticos.
        </p>
      </div>

      <div
        style={{
          ...tarjeta,
          padding: '14px 18px',
          marginBottom: 18,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {FILTROS.map((f) => (
            <button
              key={f.valor}
              type="button"
              onClick={() => setFiltro(f.valor)}
              style={chip(filtro === f.valor)}
            >
              {f.etiqueta}
            </button>
          ))}
        </div>

        <div style={{ width: 1, height: 20, background: '#dcecdf' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11.5, color: '#638074' }}>Período</span>
          <select style={selector} defaultValue="30">
            <option value="30">Últimos 30 días</option>
            <option value="14">Últimos 14 días</option>
            <option value="90">Últimos 3 meses</option>
          </select>
        </div>

        <button
          type="button"
          className="dash-btn-suave"
          style={{ ...botonSuave, marginLeft: 'auto', padding: '8px 13px' }}
        >
          Exportar registro
        </button>
      </div>

      <div style={{ ...tarjeta, overflow: 'hidden' }}>
        {registros.map((h) => (
          <div
            key={`${h.fecha}-${h.paciente}`}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px 20px',
              padding: '15px 20px',
              borderBottom: '1px solid #eef8f1',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                flex: '0 0 120px',
                ...etiquetaMono,
                fontSize: 11.5,
                letterSpacing: '0.03em',
              }}
            >
              {h.fecha}
            </div>
            <div style={{ flex: '0 0 180px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: h.punto,
                  flex: 'none',
                }}
              />
              <span style={{ fontSize: 13, fontWeight: 600, color: h.tipoColor }}>{h.tipo}</span>
            </div>
            <div
              style={{
                flex: '0 1 190px',
                minWidth: 150,
                fontSize: 13.5,
                fontWeight: 600,
                color: '#16302a',
              }}
            >
              {h.paciente}
            </div>
            <div
              style={{
                flex: '2 1 260px',
                minWidth: 220,
                fontSize: 13,
                color: '#4a6b5f',
                textWrap: 'pretty',
              }}
            >
              {h.detalle}
            </div>
            <div style={{ flex: '0 0 auto', marginLeft: 'auto' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 9px',
                  borderRadius: 9,
                  fontSize: 11.5,
                  fontWeight: 600,
                  background: h.tagFondo,
                  color: h.tagTexto,
                  border: `1px solid ${h.tagBorde}`,
                }}
              >
                {h.resultado}
              </span>
            </div>
          </div>
        ))}
        <div style={{ padding: '14px 20px', fontSize: 12, color: '#7b9489' }}>
          Mostrando {registros.length} registros del período seleccionado.
        </div>
      </div>
    </main>
  );
}
