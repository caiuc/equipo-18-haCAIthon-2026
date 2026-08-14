"use client";

import { useState } from "react";
import { fmtFechaHora } from "@/lib/formato";
import { derivarTags } from "@/lib/priorizacion";
import type { Llamada } from "@/lib/types";
import { C, CABECERA, estiloEstado, MONO, ROTULO, TARJETA } from "./estilos";
import { Etiquetas, SugerenciaAsistente } from "./piezas";

const COLUMNAS = "96px minmax(120px,160px) 76px 92px minmax(200px,1fr) 22px";

export function VistaLlamadas({ llamadas }: { llamadas: Llamada[] }) {
  const [expandida, setExpandida] = useState<number | null>(null);

  return (
    <div style={{ ...TARJETA, marginTop: 16 }}>
      <div style={{ ...CABECERA, display: "grid", gridTemplateColumns: COLUMNAS, gap: 10 }}>
        <div>Fecha</div>
        <div>Conversación</div>
        <div>Paciente</div>
        <div>Estado</div>
        <div>Hallazgos derivados / resumen</div>
        <div />
      </div>

      {llamadas.map((l) => {
        const est = estiloEstado(l.estado);
        const r = l.respuestas;
        const abierta = expandida === l.id;

        return (
          <div key={l.id} style={{ borderTop: `1px solid ${C.bordeSuave}` }}>
            <div
              className="pscv-fila"
              onClick={() => setExpandida(abierta ? null : l.id)}
              style={{
                display: "grid",
                gridTemplateColumns: COLUMNAS,
                gap: 10,
                padding: "12px 20px",
                cursor: "pointer",
                alignItems: "start",
              }}
            >
              <div style={{ fontFamily: MONO, fontSize: 12, color: C.medio }}>
                {fmtFechaHora(l.creado_en)}
              </div>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: "11.5px",
                  color: C.tenue,
                  wordBreak: "break-all",
                }}
              >
                {l.conversation_id ?? "— sin id"}
              </div>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 12,
                  color: l.paciente_id ? C.texto : "#a02c1c",
                }}
              >
                {l.paciente_id ?? "— null"}
              </div>
              <div>
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
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ marginBottom: 4 }}>
                  <Etiquetas tags={derivarTags(l)} />
                </div>
                <div style={{ fontSize: "12.5px", color: C.tenue, lineHeight: 1.45 }}>
                  {r?.summary_for_tens ??
                    (r ? "Sin resumen del asistente." : "Llamada registrada sin datos de respuestas.")}
                </div>
              </div>
              <div style={{ fontSize: 12, color: "#98a49b", justifySelf: "end" }} aria-hidden>
                {abierta ? "▴" : "▾"}
              </div>
            </div>

            {abierta && (
              <div
                style={{
                  background: C.expandido,
                  borderTop: `1px solid ${C.bordeMedio}`,
                  padding: "16px 20px 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                <div style={{ display: "flex", gap: 24, fontSize: 12, color: C.medio, flexWrap: "wrap" }}>
                  <div>
                    <span style={{ color: C.apagado }}>contact_type:</span>{" "}
                    <span style={{ fontFamily: MONO }}>{r?.contact_type ?? "null"}</span>
                  </div>
                  <div>
                    <span style={{ color: C.apagado }}>call_incomplete_reason:</span>{" "}
                    <span style={{ fontFamily: MONO }}>{r?.call_incomplete_reason ?? "null"}</span>
                  </div>
                </div>

                {l.transcripcion && (
                  <div>
                    <div style={{ ...ROTULO, marginBottom: 5 }}>Extracto de transcripción</div>
                    <div
                      style={{
                        fontFamily: MONO,
                        fontSize: 12,
                        color: "#51605a",
                        lineHeight: 1.6,
                        background: C.superficie,
                        border: `1px solid ${C.bordeMedio}`,
                        borderRadius: 6,
                        padding: "10px 12px",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {l.transcripcion}
                    </div>
                  </div>
                )}

                <SugerenciaAsistente
                  priority={r?.priority?.level ?? null}
                  nextBestAction={r?.next_best_action ?? null}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
