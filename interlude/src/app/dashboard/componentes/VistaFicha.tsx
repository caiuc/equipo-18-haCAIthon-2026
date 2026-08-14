'use client';

import type { Paciente } from '../datos-demo';
import { botonSuave, etiquetaMono, tarjeta } from '../estilos';
import BadgeRiesgo from './BadgeRiesgo';

const COLUMNAS_COMPARACION =
  'minmax(120px,170px) minmax(0,1fr) minmax(0,1.2fr) minmax(110px,150px)';

function TarjetaContacto({
  color,
  colorTitulo,
  titulo,
  subtitulo,
  fecha,
  children,
}: {
  /** Color de la barra superior. */
  color: string;
  /** Color del rótulo; en el chequeo automático es más oscuro para contraste. */
  colorTitulo: string;
  titulo: string;
  subtitulo: string;
  fecha: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ ...tarjeta, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 3, background: color }} />
      <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 9 }}>
        <div
          style={{
            ...etiquetaMono,
            fontSize: 10.5,
            letterSpacing: '0.09em',
            color: colorTitulo,
          }}
        >
          {titulo}
        </div>
        <div style={{ fontSize: 12, color: '#7b9489' }}>{subtitulo}</div>
        <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.01em' }}>{fecha}</div>
        {children}
      </div>
    </div>
  );
}

export type PropsFicha = {
  paciente: Paciente;
  mostrarTranscripcion: boolean;
  alternarTranscripcion: () => void;
  volver: () => void;
};

export default function VistaFicha({
  paciente,
  mostrarTranscripcion,
  alternarTranscripcion,
  volver,
}: PropsFicha) {
  return (
    <main style={{ flex: 1, padding: '24px 34px 56px', maxWidth: 1400 }}>
      <button
        type="button"
        onClick={volver}
        style={{
          border: 'none',
          background: 'transparent',
          color: '#147a4a',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          padding: 0,
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 7,
        }}
      >
        ← Volver a información reciente
      </button>

      <div
        style={{
          ...tarjeta,
          padding: '22px 24px',
          display: 'flex',
          gap: 24,
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          marginBottom: 18,
        }}
      >
        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: '50%',
            background: '#e4f6e9',
            color: '#147a4a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 17,
            fontWeight: 700,
            flex: 'none',
          }}
        >
          {paciente.iniciales}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, minWidth: 240 }}>
          <div
            style={{ fontSize: 23, fontWeight: 700, letterSpacing: '-0.015em', lineHeight: 1.1 }}
          >
            {paciente.nombre}
          </div>
          <div style={{ fontSize: 13.5, color: '#4a6b5f' }}>
            {paciente.edad} años · Programa de Salud Cardiovascular
          </div>
          <BadgeRiesgo paleta={paciente} texto={`Riesgo ${paciente.riesgo}`} />
        </div>
        <div
          style={{
            marginLeft: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 9,
          }}
        >
          <button
            type="button"
            className="dash-btn-primario"
            style={{
              padding: '12px 20px',
              borderRadius: 12,
              border: '1px solid #147a4a',
              background: '#147a4a',
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 9,
            }}
          >
            <span
              style={{
                width: 9,
                height: 9,
                borderRadius: '50%',
                background: '#fff',
                opacity: 0.85,
              }}
            />
            Llamar paciente
          </button>
          <div
            style={{
              fontSize: 11.5,
              color: '#7b9489',
              maxWidth: 230,
              textAlign: 'right',
              textWrap: 'pretty',
            }}
          >
            Llamada de seguimiento realizada por el TENS.
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3,minmax(0,1fr))',
          gap: 16,
          marginBottom: 22,
        }}
      >
        <TarjetaContacto
          color="#0e5c37"
          colorTitulo="#0e5c37"
          titulo="CONTROL MÉDICO"
          subtitulo="Último control presencial"
          fecha={paciente.controlFecha}
        >
          <div
            style={{
              fontSize: 12.5,
              color: '#4a6b5f',
              paddingTop: 8,
              borderTop: '1px solid #eef8f1',
              textWrap: 'pretty',
            }}
          >
            Realizado por médico del CESFAM. {paciente.controlNota}
          </div>
        </TarjetaContacto>

        <TarjetaContacto
          color="#3aa855"
          colorTitulo="#3aa855"
          titulo="SEGUIMIENTO TENS"
          subtitulo="Última llamada"
          fecha={paciente.tensFecha}
        >
          <div
            style={{
              fontSize: 12.5,
              color: '#4a6b5f',
              paddingTop: 8,
              borderTop: '1px solid #eef8f1',
              textWrap: 'pretty',
            }}
          >
            Llamada telefónica realizada por personal TENS. {paciente.tensNota}
          </div>
        </TarjetaContacto>

        <TarjetaContacto
          color="#c99a1e"
          colorTitulo="#8a6a12"
          titulo="CHEQUEO AUTOMÁTICO"
          subtitulo="Último contacto"
          fecha={paciente.autoFecha}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              paddingTop: 8,
              borderTop: '1px solid #eef8f1',
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#3aa855' }} />
            <span style={{ fontSize: 12.5, color: '#4a6b5f' }}>
              Resultado: <strong style={{ color: '#1d3b31' }}>{paciente.autoResultado}</strong>
            </span>
          </div>
        </TarjetaContacto>
      </div>

      <div style={{ ...tarjeta, padding: '20px 22px', marginBottom: 22 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 12,
            marginBottom: 4,
            flexWrap: 'wrap',
          }}
        >
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, letterSpacing: '-0.01em' }}>
            Cambios desde el último contacto
          </h2>
          <span style={{ fontSize: 12.5, color: '#638074' }}>
            Comparación entre la información anterior y la actual
          </span>
        </div>
        <p style={{ margin: '0 0 16px', fontSize: 12.5, color: '#7b9489' }}>
          Información reportada directamente por la paciente. No constituye diagnóstico.
        </p>

        <div style={{ border: '1px solid #e7f4ea', borderRadius: 14, overflow: 'hidden' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: COLUMNAS_COMPARACION,
              background: '#f4fbf6',
              borderBottom: '1px solid #e7f4ea',
              ...etiquetaMono,
              letterSpacing: '0.06em',
            }}
          >
            {['ÁMBITO', 'ANTES', 'AHORA', 'ESTADO'].map((titulo) => (
              <div key={titulo} style={{ padding: '10px 16px' }}>
                {titulo}
              </div>
            ))}
          </div>

          {paciente.comparacion.map((f) => (
            <div
              key={f.campo}
              style={{
                display: 'grid',
                gridTemplateColumns: COLUMNAS_COMPARACION,
                borderBottom: '1px solid #eef8f1',
                background: f.fondo,
                alignItems: 'center',
              }}
            >
              <div style={{ padding: '14px 16px', fontSize: 13.5, fontWeight: 600 }}>{f.campo}</div>
              <div style={{ padding: '14px 16px', fontSize: 13.5, color: '#7b9489' }}>
                {f.antes}
              </div>
              <div
                style={{
                  padding: '14px 16px',
                  fontSize: 13.5,
                  color: f.ahoraColor,
                  fontWeight: f.ahoraPeso,
                  textWrap: 'pretty',
                }}
              >
                {f.ahora}
              </div>
              <div style={{ padding: '14px 16px' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '4px 9px',
                    borderRadius: 9,
                    fontSize: 11.5,
                    fontWeight: 600,
                    background: f.tagFondo,
                    color: f.tagTexto,
                    border: `1px solid ${f.tagBorde}`,
                  }}
                >
                  <span
                    style={{ width: 6, height: 6, borderRadius: '50%', background: f.tagPunto }}
                  />
                  {f.estado}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1.05fr) minmax(0,1fr)',
          gap: 18,
          alignItems: 'start',
        }}
      >
        <div style={{ ...tarjeta, padding: '20px 22px' }}>
          <h2
            style={{
              margin: '0 0 4px',
              fontSize: 17,
              fontWeight: 700,
              letterSpacing: '-0.01em',
            }}
          >
            Línea de tiempo
          </h2>
          <p
            style={{
              margin: '0 0 18px',
              fontSize: 12.5,
              color: '#7b9489',
              textWrap: 'pretty',
            }}
          >
            Los chequeos automáticos entregan información en el período entre controles médicos.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {paciente.timeline.map((t) => (
              <div
                key={`${t.fecha}-${t.tipo}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '92px 22px 1fr',
                  alignItems: 'start',
                }}
              >
                <div
                  style={{
                    padding: '2px 12px 24px 0',
                    textAlign: 'right',
                    ...etiquetaMono,
                    fontSize: 11.5,
                    letterSpacing: '0.03em',
                  }}
                >
                  {t.fecha}
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    alignSelf: 'stretch',
                  }}
                >
                  <span
                    style={{
                      width: 11,
                      height: 11,
                      borderRadius: '50%',
                      background: t.punto,
                      border: '2px solid #fff',
                      boxShadow: `0 0 0 2px ${t.punto}`,
                      flex: 'none',
                      marginTop: 3,
                    }}
                  />
                  <span
                    style={{ width: 2, flex: 1, background: '#e7f4ea', minHeight: 18 }}
                  />
                </div>
                <div
                  style={{
                    padding: '0 0 24px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 5,
                  }}
                >
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: t.tituloColor }}>
                    {t.tipo}
                  </div>
                  <div style={{ fontSize: 13, color: '#4a6b5f' }}>{t.detalle}</div>
                  {t.vinetas.length > 0 ? (
                    <ul
                      style={{
                        margin: '4px 0 0',
                        padding: 0,
                        listStyle: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6,
                      }}
                    >
                      {t.vinetas.map((v) => (
                        <li
                          key={v}
                          style={{
                            display: 'flex',
                            gap: 9,
                            fontSize: 13,
                            lineHeight: 1.4,
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
                              marginTop: 6,
                            }}
                          />
                          <span style={{ textWrap: 'pretty' }}>{v}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ ...tarjeta, padding: '20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#3aa855' }} />
              <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, letterSpacing: '-0.01em' }}>
                Chequeo completado
              </h2>
            </div>

            <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
              {[
                ['Duración', paciente.chequeo.duracion],
                ['Preguntas respondidas', paciente.chequeo.preguntas],
              ].map(([etiqueta, valor]) => (
                <div
                  key={etiqueta}
                  style={{
                    flex: 1,
                    minWidth: 120,
                    background: '#f4fbf6',
                    border: '1px solid #e7f4ea',
                    borderRadius: 12,
                    padding: '11px 13px',
                  }}
                >
                  <div style={{ fontSize: 11.5, color: '#7b9489', marginBottom: 4 }}>
                    {etiqueta}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{valor}</div>
                </div>
              ))}
            </div>

            <div style={{ ...etiquetaMono, marginBottom: 11 }}>RESPUESTAS REPORTADAS</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {paciente.chequeo.respuestas.map((r) => (
                <div
                  key={r.pregunta}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                    padding: '11px 0',
                    borderTop: '1px solid #eef8f1',
                  }}
                >
                  <div style={{ fontSize: 12.5, color: '#7b9489', textWrap: 'pretty' }}>
                    {r.pregunta}
                  </div>
                  <div
                    style={{
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: r.color,
                      textWrap: 'pretty',
                    }}
                  >
                    {r.respuesta}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="dash-btn-suave"
              onClick={alternarTranscripcion}
              style={{ ...botonSuave, marginTop: 14 }}
            >
              {mostrarTranscripcion ? 'Ocultar conversación completa' : 'Ver conversación completa'}
            </button>

            {mostrarTranscripcion ? (
              <div
                style={{
                  marginTop: 14,
                  border: '1px solid #e7f4ea',
                  borderRadius: 14,
                  background: '#f8fcf9',
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 11,
                  maxHeight: 280,
                  overflow: 'auto',
                }}
              >
                {paciente.transcripcion.map((m, indice) => (
                  <div
                    key={`${m.quien}-${indice}`}
                    style={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                  >
                    <div style={{ ...etiquetaMono, fontSize: 10.5, color: m.color }}>{m.quien}</div>
                    <div
                      style={{
                        fontSize: 13,
                        lineHeight: 1.5,
                        color: '#1d3b31',
                        textWrap: 'pretty',
                      }}
                    >
                      {m.texto}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div
            style={{
              ...tarjeta,
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
              style={{
                fontSize: 12.5,
                lineHeight: 1.55,
                color: '#4a6b5f',
                textWrap: 'pretty',
              }}
            >
              La información de esta ficha fue reportada por la paciente durante el chequeo
              telefónico. El chequeo automático no realiza diagnóstico ni indica conducta clínica.
              La decisión sobre a quién llamar corresponde al TENS; los controles clínicos continúan
              a cargo del médico.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
