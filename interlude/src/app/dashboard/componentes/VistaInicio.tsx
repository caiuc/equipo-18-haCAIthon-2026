'use client';

import { Fragment, useMemo } from 'react';
import { PACIENTES, RESUMEN, type Paciente, type Riesgo } from '../datos-demo';
import {
  botonPrimario,
  campoBusqueda,
  chip,
  etiquetaMono,
  inputDesnudo,
  selector,
  tarjeta,
} from '../estilos';
import type { FiltroEstado, Orden } from '../tipos';
import BadgeRiesgo from './BadgeRiesgo';

const SIN_CAMBIOS = RESUMEN.respondieron - RESUMEN.cambios;

const CONTEOS: Record<FiltroEstado, number> = {
  todos: RESUMEN.contactados,
  cambios: RESUMEN.cambios,
  sinCambios: SIN_CAMBIOS,
  sinRespuesta: RESUMEN.sinRespuesta,
};

const FILTROS: Array<{ valor: FiltroEstado; etiqueta: string }> = [
  { valor: 'todos', etiqueta: 'Todos' },
  { valor: 'cambios', etiqueta: 'Cambios reportados' },
  { valor: 'sinCambios', etiqueta: 'Sin cambios' },
  { valor: 'sinRespuesta', etiqueta: 'Sin respuesta' },
];

const RIESGOS: Riesgo[] = ['Alto', 'Medio', 'Bajo'];

function Metrica({
  valor,
  titulo,
  detalle,
  color,
}: {
  valor: number;
  titulo: string;
  detalle: string;
  color?: string;
}) {
  return (
    <div style={{ ...tarjeta, padding: '18px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
        <div
          style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1 }}
        >
          {valor}
        </div>
        {color ? (
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
        ) : null}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#1c463a', marginBottom: 4 }}>
        {titulo}
      </div>
      <div style={{ fontSize: 11.5, color: '#7b9489' }}>{detalle}</div>
    </div>
  );
}

function ResumenLateral({ color, titulo, texto }: { color: string; titulo: string; texto: string }) {
  return (
    <div
      style={{
        ...tarjeta,
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: color }} />
        <h3 style={{ margin: 0, fontSize: 14.5, fontWeight: 700 }}>{titulo}</h3>
      </div>
      <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.5, color: '#4a6b5f' }}>{texto}</p>
      <a href="#" style={{ fontSize: 13, fontWeight: 600 }}>
        Revisar información
      </a>
    </div>
  );
}

export type PropsInicio = {
  mostrarFlujo: boolean;
  busqueda: string;
  setBusqueda: (valor: string) => void;
  filtro: FiltroEstado;
  setFiltro: (valor: FiltroEstado) => void;
  orden: Orden;
  setOrden: (valor: Orden) => void;
  riesgos: Riesgo[];
  alternarRiesgo: (riesgo: Riesgo) => void;
  filtroTens: boolean;
  alternarFiltroTens: () => void;
  abrirFicha: (id: string) => void;
};

export default function VistaInicio({
  mostrarFlujo,
  busqueda,
  setBusqueda,
  filtro,
  setFiltro,
  orden,
  setOrden,
  riesgos,
  alternarRiesgo,
  filtroTens,
  alternarFiltroTens,
  abrirFicha,
}: PropsInicio) {
  const visibles: Paciente[] = useMemo(() => {
    let lista = PACIENTES.filter((p) => filtro === 'todos' || p.estado === filtro);

    const consulta = busqueda.trim().toLowerCase();
    if (consulta) lista = lista.filter((p) => p.nombre.toLowerCase().includes(consulta));
    if (riesgos.length) lista = lista.filter((p) => riesgos.includes(p.riesgo));
    if (filtroTens) lista = lista.filter((p) => p.tensDias > 14);

    return [...lista].sort((a, b) =>
      orden === 'tens'
        ? b.tensDias - a.tensDias
        : orden === 'cambios'
          ? b.cambios.length - a.cambios.length
          : a.autoOrden - b.autoOrden,
    );
  }, [busqueda, filtro, filtroTens, orden, riesgos]);

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
        <div style={{ minWidth: 420, flex: 1 }}>
          <h1
            style={{
              margin: '0 0 7px',
              fontSize: 25,
              lineHeight: 1.2,
              fontWeight: 700,
              letterSpacing: '-0.015em',
              textWrap: 'pretty',
            }}
          >
            Información reciente para tus llamadas de seguimiento
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              lineHeight: 1.5,
              color: '#4a6b5f',
              maxWidth: 640,
              textWrap: 'pretty',
            }}
          >
            Información reportada por pacientes durante los chequeos telefónicos.
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 13px',
            background: '#fff',
            border: '1px solid #e0efe4',
            borderRadius: 12,
            fontSize: 12.5,
            color: '#3f556e',
          }}
        >
          <span style={{ ...etiquetaMono, letterSpacing: '0.04em' }}>RESUMEN</span>
          Últimos 14 días
        </div>
      </div>

      {mostrarFlujo ? (
        <div
          style={{
            ...tarjeta,
            borderLeft: 'none',
            padding: 0,
            marginBottom: 24,
            display: 'flex',
            overflow: 'hidden',
          }}
        >
          <div style={{ width: 4, flex: 'none', background: '#147a4a' }} />
          <div
            style={{
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 28,
              flexWrap: 'wrap',
              flex: 1,
            }}
          >
            <div
              style={{
                fontSize: 13.5,
                lineHeight: 1.5,
                fontWeight: 600,
                maxWidth: 340,
                textWrap: 'pretty',
              }}
            >
              El agente no reemplaza la llamada del TENS. Le entrega información antes de que la
              realice.
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                flexWrap: 'wrap',
                fontSize: 11.5,
                color: '#3f556e',
              }}
            >
              {['Paciente', 'Chequeo automático', 'Información reportada'].map((paso) => (
                <Fragment key={paso}>
                  <span
                    style={{
                      padding: '5px 10px',
                      background: '#eff8f1',
                      border: '1px solid #dcecdf',
                      borderRadius: 20,
                    }}
                  >
                    {paso}
                  </span>
                  <span style={{ color: '#9dbaad' }}>→</span>
                </Fragment>
              ))}
              <span
                style={{
                  padding: '5px 10px',
                  background: '#e4f6e9',
                  border: '1px solid #bce4c8',
                  borderRadius: 20,
                  color: '#0e5c37',
                  fontWeight: 600,
                }}
              >
                TENS decide a quién llamar
              </span>
            </div>
          </div>
        </div>
      ) : null}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4,minmax(0,1fr))',
          gap: 16,
          marginBottom: 30,
        }}
      >
        <Metrica
          valor={RESUMEN.contactados}
          titulo="pacientes contactados"
          detalle="por el chequeo automático"
        />
        <Metrica
          valor={RESUMEN.respondieron}
          titulo="respondieron"
          detalle="chequeo completado"
          color="#3aa855"
        />
        <Metrica
          valor={RESUMEN.cambios}
          titulo="reportaron cambios"
          detalle="respecto del contacto anterior"
          color="#c99a1e"
        />
        <Metrica
          valor={RESUMEN.sinRespuesta}
          titulo="sin respuesta"
          detalle="no contestaron la llamada"
          color="#9dbaad"
        />
      </div>

      <div
        style={{
          ...tarjeta,
          padding: '14px 18px',
          marginBottom: 18,
          display: 'flex',
          flexDirection: 'column',
          gap: 13,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
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
              placeholder="Buscar paciente"
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
                {f.etiqueta} <span style={{ opacity: 0.6 }}>{CONTEOS[f.valor]}</span>
              </button>
            ))}
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11.5, color: '#638074' }}>Ordenar por</span>
            <select
              value={orden}
              onChange={(e) => setOrden(e.target.value as Orden)}
              style={selector}
            >
              <option value="reciente">Más reciente</option>
              <option value="tens">Último seguimiento TENS</option>
              <option value="cambios">Cantidad de cambios reportados</option>
            </select>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            flexWrap: 'wrap',
            paddingTop: 12,
            borderTop: '1px solid #eef8f1',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ fontSize: 11.5, color: '#638074' }}>Riesgo PSCV</span>
            {RIESGOS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => alternarRiesgo(r)}
                style={chip(riesgos.includes(r))}
              >
                {r}
              </button>
            ))}
          </div>
          <div style={{ width: 1, height: 20, background: '#e7f4ea' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ fontSize: 11.5, color: '#638074' }}>Último seguimiento TENS</span>
            <button type="button" onClick={alternarFiltroTens} style={chip(filtroTens)}>
              Hace más de 14 días
            </button>
          </div>
          <div style={{ marginLeft: 'auto', fontSize: 11.5, color: '#87a597' }}>
            Los filtros organizan información. No constituyen una clasificación clínica.
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, margin: '26px 0 12px' }}>
        <h2 style={{ margin: 0, fontSize: 16.5, fontWeight: 700, letterSpacing: '-0.01em' }}>
          Pacientes con cambios reportados
        </h2>
        <span style={{ fontSize: 12.5, color: '#638074' }}>
          {visibles.length} de {RESUMEN.cambios} · según filtros aplicados
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {visibles.map((p) => (
          <article key={p.id} style={{ ...tarjeta, display: 'flex', overflow: 'hidden' }}>
            <div style={{ width: 4, flex: 'none', background: p.franja }} />
            <div
              style={{
                flex: 1,
                minWidth: 0,
                display: 'flex',
                flexWrap: 'wrap',
                gap: '20px 24px',
                padding: '18px 20px',
                alignItems: 'flex-start',
              }}
            >
              <div
                style={{
                  flex: '1 1 220px',
                  minWidth: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em' }}>
                  {p.nombre}
                </div>
                <div style={{ fontSize: 12.5, color: '#4a6b5f' }}>{p.meta}</div>
                <BadgeRiesgo paleta={p} texto={`Riesgo ${p.riesgo}`} />
              </div>

              <div
                style={{
                  flex: '2 1 300px',
                  minWidth: 280,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 9,
                }}
              >
                <div style={{ ...etiquetaMono, color: '#8a6a12' }}>
                  {p.cambios.length > 1 ? 'CAMBIOS REPORTADOS' : 'CAMBIO REPORTADO'}
                </div>
                <ul
                  style={{
                    margin: 0,
                    padding: 0,
                    listStyle: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 7,
                  }}
                >
                  {p.cambios.map((c) => (
                    <li
                      key={c}
                      style={{
                        display: 'flex',
                        gap: 9,
                        fontSize: 13.5,
                        lineHeight: 1.45,
                        color: '#1d3b31',
                      }}
                    >
                      <span
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: '50%',
                          background: '#c99a1e',
                          flex: 'none',
                          marginTop: 7,
                        }}
                      />
                      <span style={{ textWrap: 'pretty' }}>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                style={{
                  flex: '0 1 218px',
                  minWidth: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 5,
                    fontSize: 12,
                    color: '#4a6b5f',
                  }}
                >
                  {[
                    ['Último control médico', p.ultimoMedico],
                    ['Última llamada TENS', p.ultimoTens],
                    ['Último chequeo automático', p.ultimoAuto],
                  ].map(([etiqueta, valor]) => (
                    <div
                      key={etiqueta}
                      style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}
                    >
                      <span style={{ color: '#7b9489' }}>{etiqueta}</span>
                      <span style={{ fontWeight: 600, color: '#1d3b31' }}>{valor}</span>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="dash-btn-primario"
                  onClick={() => abrirFicha(p.id)}
                  style={{ ...botonPrimario, width: '100%' }}
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
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
          marginTop: 26,
        }}
      >
        <ResumenLateral
          color="#3aa855"
          titulo="Sin cambios reportados"
          texto={`${SIN_CAMBIOS} pacientes respondieron y no reportaron novedades.`}
        />
        <ResumenLateral
          color="#9dbaad"
          titulo="Sin respuesta"
          texto={`${RESUMEN.sinRespuesta} pacientes no respondieron al último chequeo automático.`}
        />
      </div>
    </main>
  );
}
