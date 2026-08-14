"use client";

import { fmtFechaHora } from "@/lib/formato";
import type { Accion, Llamada } from "@/lib/types";
import { C, CABECERA, etiquetaTipo, MONO, TARJETA } from "./estilos";

const COLUMNAS = "110px 120px 80px minmax(160px,1fr)";

export function VistaGestiones({
  acciones,
  llamadas,
}: {
  /** Ya filtradas por CESFAM y ordenadas de la más reciente a la más antigua. */
  acciones: Accion[];
  llamadas: Llamada[];
}) {
  const pacienteDeLlamada = new Map(llamadas.map((l) => [l.id, l.paciente_id]));

  return (
    <>
      <div style={{ ...TARJETA, marginTop: 16 }}>
        <div style={{ ...CABECERA, display: "grid", gridTemplateColumns: COLUMNAS, gap: 10 }}>
          <div>Fecha</div>
          <div>Tipo</div>
          <div>Paciente</div>
          <div>Nota</div>
        </div>

        {acciones.map((a) => {
          const tipo = etiquetaTipo(a.tipo);
          const pacienteId =
            a.paciente_id ?? (a.llamada_id !== null ? pacienteDeLlamada.get(a.llamada_id) : null);

          return (
            <div
              key={a.id}
              style={{
                display: "grid",
                gridTemplateColumns: COLUMNAS,
                gap: 10,
                padding: "11px 20px",
                borderTop: `1px solid ${C.bordeSuave}`,
                alignItems: "baseline",
              }}
            >
              <div style={{ fontFamily: MONO, fontSize: 12, color: C.medio }}>
                {fmtFechaHora(a.creado_en)}
              </div>
              <div>
                <span
                  style={{
                    fontSize: "11.5px",
                    fontWeight: 600,
                    color: tipo.fg,
                    background: tipo.bg,
                    borderRadius: 4,
                    padding: "2px 8px",
                  }}
                >
                  {tipo.label}
                </span>
              </div>
              <div style={{ fontFamily: MONO, fontSize: 12 }}>{pacienteId ?? "—"}</div>
              <div style={{ fontSize: "12.5px", color: C.tenue, lineHeight: 1.5 }}>
                {a.nota ?? "—"}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ fontSize: "11.5px", color: C.apagado, marginTop: 12 }}>
        Las gestiones son la única escritura del panel — van por Server Action con supabaseAdmin.
      </div>
    </>
  );
}
