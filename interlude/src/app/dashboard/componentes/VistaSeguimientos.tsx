'use client';

import {
  ESTADOS_LLAMADA,
  JORNADA,
  PACIENTES,
  type EstadoLlamada,
} from '../datos-demo';
import { botonSuave, etiquetaMono, tarjeta } from '../estilos';

export type PropsSeguimientos = {
  estadosLlamada: Record<string, EstadoLlamada>;
  cambiarEstado: (id: string) => void;
  abrirFicha: (id: string) => void;
};

export default function VistaSeguimientos({
  estadosLlamada,
  cambiarEstado,
  abrirFicha,
}: PropsSeguimientos) {
  const items = JORNADA.map((item) => {
    const paciente = PACIENTES.find((p) => p.id === item.id)!;
    const estado = estadosLlamada[item.id] ?? 'pendiente';
    return { ...paciente, ...item, ...ESTADOS_LLAMADA[estado], estado };
  });

  const realizadas = items.filter((i) => i.estado === 'realizada').length;
  const pendientes = items.filter((i) => i.estado === 'pendiente').length;
  const noContestaron = items.filter((i) => i.estado === 'noContesta').length;
  const avance = Math.round((realizadas / items.length) * 100);

  return (
    <main style={{ flex: 1, padding: '30px 34px 56px', maxWidth: 1400 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 24,
          flexWrap: 'wrap',
          marginBottom: 22,
        }}
      >
        <div style={{ minWidth: 400, flex: 1 }}>
          <h1
            style={{
              margin: '0 0 7px',
              fontSize: 25,
              lineHeight: 1.2,
              fontWeight: 700,
              letterSpacing: '-0.015em',
            }}
          >
            Mi jornada de seguimiento
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
            Lista de llamadas que decidiste realizar hoy. El orden lo defines tú; el sistema solo
            aporta la información previa de cada paciente.
          </p>
        </div>

        <div style={{ ...tarjeta, padding: '14px 18px', minWidth: 250 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 9 }}>
            <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>
              {realizadas}
            </span>
            <span style={{ fontSize: 13, color: '#638074' }}>
              de {items.length} llamadas registradas
            </span>
          </div>
          <div
            style={{ height: 7, borderRadius: 20, background: '#eff8f1', overflow: 'hidden' }}
          >
            <div style={{ height: '100%', background: '#3aa855', width: `${avance}%` }} />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {[
          ['Pendientes', pendientes, '#16302a'],
          ['Realizadas', realizadas, '#1c7a3f'],
          ['No contestó', noContestaron, '#8a6a12'],
        ].map(([etiqueta, valor, color]) => (
          <span
            key={etiqueta as string}
            style={{
              padding: '7px 11px',
              borderRadius: 20,
              border: '1px solid #e0efe4',
              background: '#fff',
              color: '#4a6b5f',
              fontSize: 12.5,
            }}
          >
            {etiqueta} <strong style={{ color: color as string }}>{valor}</strong>
          </span>
        ))}
        <span
          style={{
            marginLeft: 'auto',
            fontSize: 11.5,
            color: '#7b9489',
            alignSelf: 'center',
          }}
        >
          Toca el estado de cada fila para registrar el resultado de tu llamada.
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map((w) => (
          <article key={w.id} style={{ ...tarjeta, display: 'flex', overflow: 'hidden' }}>
            <div style={{ width: 4, flex: 'none', background: w.franja }} />
            <div
              style={{
                flex: 1,
                minWidth: 0,
                display: 'flex',
                flexWrap: 'wrap',
                gap: '18px 24px',
                padding: '16px 20px',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  flex: '1 1 230px',
                  minWidth: 200,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: '#eff8f1',
                    color: '#0e5c37',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 700,
                    flex: 'none',
                  }}
                >
                  {w.iniciales}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em' }}>
                    {w.nombre}
                  </div>
                  <div style={{ fontSize: 12, color: '#638074' }}>{w.meta}</div>
                </div>
              </div>

              <div
                style={{
                  flex: '2 1 320px',
                  minWidth: 280,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 5,
                }}
              >
                <div style={{ ...etiquetaMono, fontSize: 10.5 }}>
                  INFORMACIÓN PREVIA A LA LLAMADA
                </div>
                <div
                  style={{
                    fontSize: 13.5,
                    lineHeight: 1.45,
                    color: '#1d3b31',
                    textWrap: 'pretty',
                  }}
                >
                  {w.contexto}
                </div>
                <div style={{ fontSize: 12, color: '#7b9489' }}>
                  Último chequeo automático: {w.ultimoAuto} · Última llamada TENS: {w.ultimoTens}
                </div>
              </div>

              <div
                style={{
                  flex: '0 1 210px',
                  minWidth: 190,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 9,
                }}
              >
                <button
                  type="button"
                  onClick={() => cambiarEstado(w.id)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 12,
                    fontSize: 12.5,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    background: w.llamadaFondo,
                    color: w.llamadaTexto,
                    border: `1px solid ${w.llamadaBorde}`,
                  }}
                >
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: w.llamadaPunto,
                    }}
                  />
                  {w.llamadaLabel}
                </button>
                <button
                  type="button"
                  className="dash-btn-suave"
                  onClick={() => abrirFicha(w.id)}
                  style={{ ...botonSuave, width: '100%', padding: '8px 12px' }}
                >
                  Ver información
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div
        style={{
          ...tarjeta,
          marginTop: 22,
          padding: '16px 20px',
          display: 'flex',
          gap: 14,
          alignItems: 'flex-start',
        }}
      >
        <span
          style={{
            width: 4,
            alignSelf: 'stretch',
            background: '#147a4a',
            borderRadius: 2,
            flex: 'none',
          }}
        />
        <div
          style={{ fontSize: 12.5, lineHeight: 1.55, color: '#4a6b5f', textWrap: 'pretty' }}
        >
          Esta lista no se genera automáticamente por criterio clínico: contiene los pacientes que
          tú agregaste desde la vista de información reciente. Puedes quitar o agregar pacientes en
          cualquier momento.
        </div>
      </div>
    </main>
  );
}
