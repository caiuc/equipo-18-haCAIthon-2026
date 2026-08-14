"use client";

import { useState, useTransition } from "react";
import { registrarGestion } from "@/app/acciones";
import { fmtFecha } from "@/lib/formato";
import { etiquetaSexo, nombreCorto, nombrePaciente, sexoLargo } from "@/lib/identidad";
import { derivarTags } from "@/lib/priorizacion";
import type { Caso } from "@/lib/panel";
import type { RespuestasCami, TipoAccion } from "@/lib/types";
import { C, CABECERA, estiloEstado, MONO, ROTULO, SEV, TARJETA, TIPO } from "./estilos";
import {
  BloqueControles,
  Etiquetas,
  FilaKPIs,
  Patologias,
  Rotulo,
  SugerenciaAsistente,
  type KPI,
} from "./piezas";

const COLUMNAS = "104px 200px minmax(200px,1fr) minmax(160px,180px) 22px";

export type FilaCola = {
  caso: Caso;
  /** Posición en la cola sin contar los ya gestionados. -1 si está gestionado. */
  posicion: number;
  fueraCupo: boolean;
};

export function VistaCola({
  filas,
  hoy,
  expandido,
  setExpandido,
}: {
  filas: FilaCola[];
  hoy: Date;
  /** Vive en el Panel porque la vista Pacientes abre una ficha concreta de la cola. */
  expandido: string | null;
  setExpandido: (id: string | null) => void;
}) {
  return (
    <>
      <FilaKPIs items={kpisDeCola(filas)} />
      <Leyenda />
      <div style={TARJETA}>
        <div style={{ ...CABECERA, display: "grid", gridTemplateColumns: COLUMNAS, gap: 12 }}>
          <div>Severidad</div>
          <div>Paciente</div>
          <div>Motivo de priorización</div>
          <div>Controles</div>
          <div />
        </div>
        {filas.map((fila) => (
          <Fila
            key={fila.caso.paciente.id}
            fila={fila}
            hoy={hoy}
            expandido={expandido === fila.caso.paciente.id}
            onToggle={() =>
              setExpandido(expandido === fila.caso.paciente.id ? null : fila.caso.paciente.id)
            }
          />
        ))}
      </div>
    </>
  );
}

/**
 * Indicadores del turno. Todos se cuentan sobre los casos PENDIENTES (los
 * gestionados salen de la cola), salvo el último, que es justamente lo ya
 * trabajado. No hay lógica nueva acá: son conteos de lo que la tabla muestra.
 */
function kpisDeCola(filas: FilaCola[]): KPI[] {
  const pendientes = filas.filter((f) => !f.caso.gestion);
  const criticas = pendientes.filter((f) => f.caso.severidad === "critica");
  const atencion = pendientes.filter((f) => f.caso.severidad === "atencion");
  const sinLlamada = pendientes.filter((f) => f.caso.llamadas.length === 0);
  const gestionados = filas.filter((f) => f.caso.gestion);
  const dentroDelCupo = pendientes.filter((f) => !f.fueraCupo);

  return [
    {
      label: "En cola",
      valor: pendientes.length,
      detalle: `${dentroDelCupo.length} dentro del cupo de hoy`,
    },
    {
      label: "Críticas",
      valor: criticas.length,
      detalle: "hallazgos de alarma en la última llamada",
      dot: SEV.critica.dot,
    },
    {
      label: "Atención",
      valor: atencion.length,
      detalle: "requieren revisión, sin señal de alarma",
      dot: SEV.atencion.dot,
    },
    {
      label: "Sin llamada",
      valor: sinLlamada.length,
      detalle: "ningún seguimiento registrado aún",
    },
    {
      label: "Gestionados",
      valor: gestionados.length,
      detalle: "ya trabajados por el equipo",
    },
  ];
}

function Leyenda() {
  const items: [string, string][] = [
    ["Crítica", SEV.critica.dot],
    ["Atención", SEV.atencion.dot],
    ["Rutina", SEV.rutina.dot],
  ];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        margin: "16px 0 10px",
        flexWrap: "wrap",
      }}
    >
      {items.map(([label, color]) => (
        <div
          key={label}
          style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.medio }}
        >
          <span
            style={{ width: 8, height: 8, borderRadius: "50%", background: color, flex: "none" }}
          />
          {label}
        </div>
      ))}
      <div style={{ fontSize: 12, color: C.masTenue, marginLeft: "auto" }}>
        Orden según reglas del programa — no según el asistente
      </div>
    </div>
  );
}

function Fila({
  fila,
  hoy,
  expandido,
  onToggle,
}: {
  fila: FilaCola;
  hoy: Date;
  expandido: boolean;
  onToggle: () => void;
}) {
  const { caso, fueraCupo } = fila;
  const { paciente: p, ultima, gestion } = caso;
  const sev = SEV[caso.severidad];

  return (
    <div style={{ borderTop: `1px solid ${C.bordeSuave}` }}>
      <div
        className="pscv-fila"
        onClick={onToggle}
        style={{
          display: "grid",
          gridTemplateColumns: COLUMNAS,
          gap: 12,
          padding: "13px 20px",
          cursor: "pointer",
          alignItems: "start",
          opacity: fueraCupo ? 0.45 : gestion ? 0.75 : 1,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 5, alignItems: "flex-start" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: "11.5px",
              fontWeight: 600,
              padding: "3px 9px",
              borderRadius: 99,
              color: sev.fg,
              background: sev.bg,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: sev.dot,
                flex: "none",
              }}
            />
            {sev.label}
          </span>
          {fueraCupo && (
            <span style={{ fontSize: "10.5px", color: C.apagado }}>fuera del cupo</span>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ fontSize: "13.5px", fontWeight: 600, color: C.texto, lineHeight: 1.3 }}>
            {nombreCorto(p)}
          </div>
          <div style={{ fontSize: 12, color: "#5c6a61" }}>
            <span style={{ fontFamily: MONO }}>{p.id}</span> · {p.edad} a ·{" "}
            {etiquetaSexo(p.sexo)}
          </div>
          <div style={{ fontSize: 12, color: "#5c6a61" }}>
            riesgo {p.riesgo}
            {p.fase === "en_compensacion" && (
              <span style={{ color: "#8a5800", fontWeight: 600 }}> · en compensación</span>
            )}
          </div>
          <Patologias lista={p.patologias} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 5, minWidth: 0 }}>
          <div style={{ fontSize: "13.5px", fontWeight: 500, lineHeight: 1.4 }}>{caso.motivo}</div>
          {gestion && (
            <div style={{ fontSize: 12, fontWeight: 600, color: C.verde }}>
              ✓ Gestionada · {TIPO[gestion.tipo].label}
              {gestion.nota && (
                <span style={{ fontWeight: 400, color: "#5c6a61" }}> — “{gestion.nota}”</span>
              )}
            </div>
          )}
        </div>

        <BloqueControles
          ultimoControl={p.ultimo_control}
          proximoControl={p.proximo_control}
          hoy={hoy}
        />

        <div
          style={{ fontSize: 12, color: "#98a49b", justifySelf: "end", paddingTop: 2 }}
          aria-hidden
        >
          {expandido ? "▴" : "▾"}
        </div>
      </div>

      {expandido && <Detalle caso={caso} ultima={ultima} hoy={hoy} />}
    </div>
  );
}

/**
 * Grupos crudos de `respuestas`, sin los campos que quedaron en null.
 *
 * El orden de los campos va explícito: jsonb no conserva el orden con que Cami
 * arma el objeto (Postgres reordena las claves), y leer los síntomas alfabéticos
 * y mezclados no ayuda a nadie. Las claves que no estén acá van al final, en
 * orden alfabético: si el prompt de Cami agrega un campo, igual se muestra.
 */
const GRUPOS: [keyof RespuestasCami, string, string[]][] = [
  [
    "symptoms",
    "Síntomas",
    [
      "chest_pain_current",
      "chest_pain_past_week",
      "shortness_of_breath_current",
      "shortness_of_breath_past_week",
      "palpitations_current",
      "palpitations_past_week",
      "dizziness_past_week",
      "fainting_past_week",
      "neurologic_warning_signs_current",
      "overall_health_worsening",
      "new_health_problem",
      "new_health_problem_detail",
    ],
  ],
  [
    "blood_pressure",
    "Presión",
    ["reported_high_values", "latest_reported_value", "measured_last_7_days", "has_home_monitor"],
  ],
  [
    "medications",
    "Medicamentos",
    [
      "taking_as_prescribed",
      "medication_issue",
      "medication_issue_detail",
      "difficulty_getting_medications",
    ],
  ],
  ["lifestyle", "Estilo de vida", ["smoked_last_7_days"]],
  [
    "follow_up",
    "Seguimiento",
    [
      "pending_appointment_or_test",
      "pending_appointment_or_test_detail",
      "recent_cholesterol_test",
    ],
  ],
];

function gruposCrudos(r: RespuestasCami | null) {
  if (!r) return [];

  return GRUPOS.map(([clave, titulo, orden]) => {
    const valor = r[clave];
    if (!valor || typeof valor !== "object") return { titulo, kv: [] };

    const posicion = (k: string) => {
      const i = orden.indexOf(k);
      return i === -1 ? orden.length : i;
    };

    const kv = Object.entries(valor)
      .filter(([, v]) => v !== null && v !== undefined)
      .sort(([a], [b]) => posicion(a) - posicion(b) || a.localeCompare(b))
      .map(([k, v]) => ({ k, v: String(v) }));

    return { titulo, kv };
  }).filter((g) => g.kv.length > 0);
}

function Detalle({ caso, ultima, hoy }: { caso: Caso; ultima: Caso["ultima"]; hoy: Date }) {
  const p = caso.paciente;
  const r = ultima?.respuestas ?? null;
  const grupos = gruposCrudos(r);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        background: C.expandido,
        borderTop: `1px solid ${C.bordeMedio}`,
        padding: "20px 20px 24px",
        display: "grid",
        gridTemplateColumns: "1.15fr 1fr",
        gap: 32,
        cursor: "default",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 18, minWidth: 0 }}>
        <div>
          <Rotulo>Resumen de la última llamada</Rotulo>
          {r?.summary_for_tens ? (
            <div style={{ fontSize: "13.5px", lineHeight: 1.55, color: C.fuerte }}>
              {r.summary_for_tens}
            </div>
          ) : (
            <div style={{ fontSize: 13, color: C.apagado, fontStyle: "italic" }}>
              {!ultima
                ? "Ningún registro de llamada para este paciente. Aparece en la cola precisamente por eso."
                : "Llamada registrada sin datos de respuestas."}
            </div>
          )}
        </div>

        {grupos.length > 0 && (
          <div>
            <div style={{ ...ROTULO, marginBottom: 8 }}>
              Datos reportados en la llamada (crudos)
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 20px" }}>
              {grupos.map((g) => (
                <div
                  key={g.titulo}
                  style={{
                    border: `1px solid ${C.bordeMedio}`,
                    borderRadius: 6,
                    background: C.superficie,
                    padding: "10px 12px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "11.5px",
                      fontWeight: 600,
                      color: C.medio,
                      marginBottom: 6,
                    }}
                  >
                    {g.titulo}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    {g.kv.map((kv) => (
                      <div
                        key={kv.k}
                        style={{ display: "flex", gap: 8, fontSize: "11.5px", lineHeight: 1.5 }}
                      >
                        <span
                          style={{
                            color: C.apagado,
                            flex: "none",
                            minWidth: 150,
                            wordBreak: "break-word",
                          }}
                        >
                          {kv.k}
                        </span>
                        <span
                          style={{ fontFamily: MONO, color: C.fuerte, wordBreak: "break-word" }}
                        >
                          {kv.v}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <SugerenciaAsistente
          priority={r?.priority?.level ?? null}
          nextBestAction={r?.next_best_action ?? null}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18, minWidth: 0 }}>
        <div>
          <Rotulo>Paciente</Rotulo>
          <div style={{ fontSize: 15, fontWeight: 600, color: C.texto, letterSpacing: "-0.01em" }}>
            {nombrePaciente(p)}
          </div>
          <div style={{ fontSize: "12.5px", color: C.tenue, marginTop: 2 }}>
            <span style={{ fontFamily: MONO }}>{p.id}</span> · {p.edad} años ·{" "}
            {sexoLargo(p.sexo)} · riesgo {p.riesgo}
          </div>
        </div>

        <div>
          <div style={{ ...ROTULO, marginBottom: 8 }}>Historial de llamadas</div>
          {caso.llamadas.length === 0 ? (
            <div style={{ fontSize: 13, color: C.apagado, fontStyle: "italic" }}>
              Sin llamadas de seguimiento registradas.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {caso.llamadas.slice(0, 3).map((l) => {
                const est = estiloEstado(l.estado);
                return (
                  <div
                    key={l.id}
                    style={{
                      display: "flex",
                      gap: 8,
                      alignItems: "baseline",
                      flexWrap: "wrap",
                      fontSize: "12.5px",
                    }}
                  >
                    <span style={{ fontFamily: MONO, color: C.medio, flex: "none" }}>
                      {fmtFecha(l.creado_en)}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 500,
                        color: est.fg,
                        background: est.bg,
                        borderRadius: 4,
                        padding: "1px 6px",
                      }}
                    >
                      {est.t}
                    </span>
                    <Etiquetas tags={derivarTags(l)} />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <BloqueControles
          ultimoControl={p.ultimo_control}
          proximoControl={p.proximo_control}
          hoy={hoy}
          fase={p.fase}
        />

        {p.contacto_emergencia && (
          <div style={{ fontSize: "12.5px", color: C.medio }}>
            ☎ Tiene contacto de emergencia registrado
          </div>
        )}

        {caso.gestion ? (
          <div
            style={{
              border: "1px solid #cfe0d4",
              background: "#f0f7f2",
              borderRadius: 6,
              padding: "12px 14px",
              fontSize: 13,
              color: "#22513c",
            }}
          >
            <strong style={{ fontWeight: 600 }}>✓ Gestión registrada:</strong>{" "}
            {TIPO[caso.gestion.tipo].label}
            {caso.gestion.nota ? ` — “${caso.gestion.nota}”` : ""}
          </div>
        ) : (
          <FormularioGestion pacienteId={p.id} llamadaId={ultima?.id ?? null} />
        )}
      </div>
    </div>
  );
}

function FormularioGestion({
  pacienteId,
  llamadaId,
}: {
  pacienteId: string;
  llamadaId: number | null;
}) {
  const [nota, setNota] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pendiente, iniciar] = useTransition();

  const registrar = (tipo: TipoAccion) => {
    setError(null);
    iniciar(async () => {
      const resultado = await registrarGestion({ pacienteId, llamadaId, tipo, nota });
      if (!resultado.ok) setError(resultado.error);
    });
  };

  return (
    <div
      style={{
        border: `1px solid ${C.bordeMedio}`,
        borderRadius: 6,
        background: C.superficie,
        padding: "12px 14px",
      }}
    >
      <div style={{ fontSize: "11.5px", fontWeight: 600, color: C.medio, marginBottom: 8 }}>
        Registrar gestión{" "}
        <span style={{ fontWeight: 400, color: "#98a49b" }}>— única escritura del panel</span>
      </div>
      <input
        type="text"
        placeholder="Nota opcional…"
        value={nota}
        onChange={(e) => setNota(e.target.value)}
        maxLength={500}
        style={{
          width: "100%",
          fontSize: 13,
          padding: "7px 10px",
          border: `1px solid ${C.inputBorde}`,
          borderRadius: 6,
          background: C.inputFondo,
          marginBottom: 9,
        }}
      />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          className="pscv-btn-primario"
          disabled={pendiente}
          onClick={() => registrar("llamado")}
          style={{
            fontSize: "12.5px",
            fontWeight: 600,
            padding: "7px 12px",
            border: `1px solid ${C.verde}`,
            borderRadius: 6,
            background: C.verde,
            color: "#ffffff",
            cursor: "pointer",
          }}
        >
          Llamado realizado
        </button>
        <button
          className="pscv-btn-secundario"
          disabled={pendiente}
          onClick={() => registrar("agendado")}
          style={{
            fontSize: "12.5px",
            fontWeight: 600,
            padding: "7px 12px",
            border: "1px solid #b9c6ba",
            borderRadius: 6,
            background: C.superficie,
            color: C.fuerte,
            cursor: "pointer",
          }}
        >
          Hora agendada
        </button>
        <button
          className="pscv-btn-secundario"
          disabled={pendiente}
          onClick={() => registrar("sin_accion")}
          style={{
            fontSize: "12.5px",
            fontWeight: 500,
            padding: "7px 12px",
            border: `1px solid ${C.borde}`,
            borderRadius: 6,
            background: C.superficie,
            color: C.tenue,
            cursor: "pointer",
          }}
        >
          Sin acción
        </button>
      </div>
      {error && (
        <div style={{ fontSize: 12, color: "#a02c1c", marginTop: 8 }}>
          No se pudo registrar: {error}
        </div>
      )}
    </div>
  );
}
