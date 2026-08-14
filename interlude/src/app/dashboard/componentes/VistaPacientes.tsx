'use client';

import { useMemo } from 'react';
import { REGISTRO, RESUMEN } from '../datos-demo';
import { campoBusqueda, chip, etiquetaMono, inputDesnudo, tarjeta } from '../estilos';
import type { FiltroEstado } from '../tipos';
import BadgeRiesgo from './BadgeRiesgo';

const SIN_CAMBIOS = RESUMEN.respondieron - RESUMEN.cambios;

const FILTROS: Array<{ valor: FiltroEstado; etiqueta: string; conteo: number }> = [
  { valor: 'todos', etiqueta: 'Todos', conteo: RESUMEN.contactados },
  { valor: 'cambios', etiqueta: 'Cambios reportados', conteo: RESUMEN.cambios },
  { valor: 'sinCambios', etiqueta: 'Sin cambios', conteo: SIN_CAMBIOS },
  { valor: 'sinRespuesta', etiqueta: 'Sin respuesta', conteo: RESUMEN.sinRespuesta },
];

const COLUMNAS = 'minmax(190px,1.5fr) 74px 112px 132px 132px 132px 128px';

const CABECERAS = [
  'PACIENTE',
  'EDAD',
  'RIESGO PSCV',
  'CONTROL MÉDICO',
  'LLAMADA TENS',
  'CHEQUEO AUTOM.',
  'ÚLTIMO REPORTE',
];

export type PropsPacientes = {
  busqueda: string;
  setBusqueda: (valor: string) => void;
  filtro: FiltroEstado;
  setFiltro: (valor: FiltroEstado) => void;
  abrirFicha: (id: string) => void;
};

export default function VistaPacientes({
  busqueda,
  setBusqueda,
  filtro,
  setFiltro,
  abrirFicha,
}: PropsPacientes) {
  const filas = useMemo(() => {
    let lista = REGISTRO.filter((r) => filtro === 'todos' || r.estado === filtro);
    const consulta = busqueda.trim().toLowerCase();
    if (consulta) {
      lista = lista.filter(
        (r) => r.nombre.toLowerCase().includes(consulta) || r.rut.includes(consulta),
      );
    }
    return lista;
  }, [busqueda, filtro]);

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
          Pacientes del programa
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
          Registro completo de pacientes bajo control en el Programa de Salud Cardiovascular. Las
          columnas muestran cuándo fue el último contacto de cada tipo.
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
        <div style={campoBusqueda}>
          <span
            style={{
              width: 11,
              height: 11,
              border: '1.6px solid #87a597',
              borderRadius: '50%',
              flex: 'none',
            }}
          />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar paciente o RUT"
            style={inputDesnudo}
          />
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {FILTROS.map((f) => (
            <button
              key={f.valor}
              type="button"
              onClick={() => setFiltro(f.valor)}
              style={chip(filtro === f.valor)}
            >
              {f.etiqueta} <span style={{ opacity: 0.6 }}>{f.conteo}</span>
            </button>
          ))}
        </div>

        <div style={{ marginLeft: 'auto', fontSize: 11.5, color: '#7b9489' }}>
          Mostrando {filas.length} de {RESUMEN.contactados} pacientes
        </div>
      </div>

      <div style={{ ...tarjeta, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <div style={{ minWidth: 1000 }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: COLUMNAS,
                background: '#f4fbf6',
                borderBottom: '1px solid #e7f4ea',
                ...etiquetaMono,
                letterSpacing: '0.06em',
              }}
            >
              {CABECERAS.map((titulo, indice) => (
                <div
                  key={titulo}
                  style={{
                    padding:
                      indice === 0
                        ? '12px 16px'
                        : indice === CABECERAS.length - 1
                          ? '12px 16px 12px 8px'
                          : '12px 8px',
                  }}
                >
                  {titulo}
                </div>
              ))}
            </div>

            {filas.map((r) => (
              <div
                key={r.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: COLUMNAS,
                  borderBottom: '1px solid #eef8f1',
                  alignItems: 'center',
                  fontSize: 13,
                  color: '#1d3b31',
                }}
              >
                <div
                  style={{
                    padding: '13px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 11,
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      background: '#eff8f1',
                      color: '#0e5c37',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 11,
                      fontWeight: 700,
                      flex: 'none',
                    }}
                  >
                    {r.iniciales}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {r.nombre}
                    </div>
                    <div style={{ ...etiquetaMono, fontSize: 11, color: '#7b9489', fontWeight: 400 }}>
                      {r.rut}
                    </div>
                  </div>
                </div>

                <div style={{ padding: '13px 8px', color: '#4a6b5f' }}>{r.edad}</div>
                <div style={{ padding: '13px 8px' }}>
                  <BadgeRiesgo paleta={r} texto={r.riesgo} compacto />
                </div>
                <div style={{ padding: '13px 8px', color: '#4a6b5f' }}>{r.ultimoMedico}</div>
                <div style={{ padding: '13px 8px', color: '#4a6b5f' }}>{r.ultimoTens}</div>
                <div style={{ padding: '13px 8px', color: '#4a6b5f' }}>{r.ultimoAuto}</div>

                <div
                  style={{
                    padding: '13px 16px 13px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 10,
                  }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      color: r.estadoTexto,
                    }}
                  >
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        background: r.estadoPunto,
                        flex: 'none',
                      }}
                    />
                    {r.estadoLabel}
                  </span>
                  {r.tieneFicha ? (
                    <button
                      type="button"
                      onClick={() => abrirFicha(r.id)}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        color: '#147a4a',
                        fontSize: 12.5,
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: 0,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Ver
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            padding: '13px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontSize: 12,
            color: '#7b9489',
          }}
        >
          <span>Página 1 de 7</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
            <button
              type="button"
              style={{
                padding: '6px 12px',
                borderRadius: 9,
                border: '1px solid #e0efe4',
                background: '#fff',
                color: '#9dbaad',
                fontSize: 12,
                cursor: 'default',
              }}
            >
              Anterior
            </button>
            <button
              type="button"
              className="dash-btn-suave"
              style={{
                padding: '6px 12px',
                borderRadius: 9,
                border: '1px solid #e0efe4',
                background: '#fff',
                color: '#1c463a',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
