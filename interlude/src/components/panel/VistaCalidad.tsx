"use client";

import { fmtFecha, fmtFechaHora } from "@/lib/formato";
import { nombreCesfam, type Caso } from "@/lib/panel";
import type { Cesfam, Llamada } from "@/lib/types";
import { C, etiquetaTipo, MONO, TARJETA } from "./estilos";

/**
 * Lo que el pipeline no pudo asociar o completar. Se muestra en vez de
 * esconderse: una llamada huérfana es una conversación real que no le llegó a
 * nadie.
 */
export function VistaCalidad({
  huerfanas,
  incompletas,
  altoSinLlamada,
  cesfams,
}: {
  huerfanas: Llamada[];
  incompletas: Llamada[];
  altoSinLlamada: Caso[];
  cesfams: Cesfam[];
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 16 }}>
      <Seccion
        titulo="Llamadas sin paciente asociado"
        detalle={`(${huerfanas.length}) — el paciente_id no viajó bien desde el cliente`}
        vacio="Ninguna: todas las llamadas quedaron asociadas a un paciente."
        n={huerfanas.length}
      >
        {huerfanas.map((l) => (
          <div
            key={l.id}
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(140px,190px) 110px minmax(160px,1fr)",
              gap: 12,
              padding: "11px 20px",
              borderTop: `1px solid ${C.bordeSuave}`,
              alignItems: "baseline",
            }}
          >
            <div style={{ fontFamily: MONO, fontSize: "12.5px" }}>
              {l.conversation_id ?? "— sin id"}
            </div>
            <div style={{ fontFamily: MONO, fontSize: 12, color: C.tenue }}>
              {fmtFechaHora(l.creado_en)}
            </div>
            <div style={{ fontSize: "12.5px", color: C.tenue }}>
              estado: <span style={{ fontFamily: MONO }}>{l.estado ?? "null"}</span> · revisar
              asociación en el sistema
            </div>
          </div>
        ))}
      </Seccion>

      <Seccion
        titulo="Llamadas incompletas o sin datos"
        detalle={`(${incompletas.length})`}
        vacio="Ninguna: todas las llamadas se completaron con datos."
        n={incompletas.length}
      >
        {incompletas.map((l) => (
          <div
            key={l.id}
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(140px,190px) 110px 60px minmax(160px,1fr)",
              gap: 12,
              padding: "11px 20px",
              borderTop: `1px solid ${C.bordeSuave}`,
              alignItems: "baseline",
            }}
          >
            <div style={{ fontFamily: MONO, fontSize: "12.5px" }}>
              {l.conversation_id ?? "— sin id"}
            </div>
            <div style={{ fontFamily: MONO, fontSize: 12, color: C.tenue }}>
              {fmtFechaHora(l.creado_en)}
            </div>
            <div style={{ fontFamily: MONO, fontSize: 12 }}>{l.paciente_id}</div>
            <div style={{ fontSize: "12.5px", color: C.tenue }}>
              {!l.respuestas
                ? "respuestas null — llamada registrada sin datos"
                : `estado ${l.estado}` +
                  (l.respuestas.call_incomplete_reason
                    ? ` (${l.respuestas.call_incomplete_reason})`
                    : "")}
            </div>
          </div>
        ))}
      </Seccion>

      <Seccion
        titulo="Pacientes de riesgo alto sin ninguna llamada"
        detalle={`(${altoSinLlamada.length}) — los invisibles del seguimiento`}
        vacio="Ninguno: todos los pacientes de riesgo alto tienen al menos una llamada."
        n={altoSinLlamada.length}
      >
        {altoSinLlamada.map((caso) => {
          const p = caso.paciente;
          return (
            <div
              key={p.id}
              style={{
                display: "grid",
                gridTemplateColumns: "60px 90px minmax(120px,170px) minmax(150px,1fr)",
                gap: 12,
                padding: "11px 20px",
                borderTop: `1px solid ${C.bordeSuave}`,
                alignItems: "baseline",
              }}
            >
              <div style={{ fontFamily: MONO, fontSize: "12.5px" }}>{p.id}</div>
              <div style={{ fontSize: "12.5px", color: C.medio }}>
                {p.edad} a · {p.sexo}
              </div>
              <div style={{ fontSize: 12, color: C.tenue }}>
                {nombreCesfam(cesfams, p.cesfam_id)}
              </div>
              <div style={{ fontSize: "12.5px", color: C.tenue }}>
                últ. control {fmtFecha(p.ultimo_control)} ·{" "}
                {caso.gestion
                  ? `✓ gestionado (${etiquetaTipo(caso.gestion.tipo).label})`
                  : "sin gestión"}
              </div>
            </div>
          );
        })}
      </Seccion>
    </div>
  );
}

function Seccion({
  titulo,
  detalle,
  vacio,
  n,
  children,
}: {
  titulo: string;
  detalle: string;
  vacio: string;
  n: number;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 600, color: C.medio, marginBottom: 8 }}>
        {titulo} <span style={{ fontWeight: 400, color: C.apagado }}>{detalle}</span>
      </div>
      <div style={TARJETA}>
        {n === 0 ? (
          <div style={{ padding: "14px 20px", fontSize: "12.5px", color: C.apagado }}>{vacio}</div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
