"use client";

import { useMemo, useState } from "react";
import { fmtFecha } from "@/lib/formato";
import { etiquetaSexo, nombreCorto } from "@/lib/identidad";
import { nombreCesfam, type Caso } from "@/lib/panel";
import type { Cesfam } from "@/lib/types";
import { C, CABECERA, RIESGO_FG, ROTULO, TARJETA } from "./estilos";
import { Patologias } from "./piezas";
import { MONO } from "./estilos";

const COLUMNAS =
  "minmax(140px,180px) 72px minmax(110px,150px) minmax(90px,120px) 84px minmax(96px,120px) 120px minmax(110px,1fr)";

const FILTROS = ["todos", "alto", "moderado", "bajo"] as const;

/** Minúsculas y sin tildes, para que "veronica" encuentre a "Verónica". */
function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function VistaPacientes({
  casos,
  cesfams,
  onAbrirFicha,
}: {
  casos: Caso[];
  cesfams: Cesfam[];
  /** Salta a la cola con la ficha de ese paciente abierta. */
  onAbrirFicha: (pacienteId: string) => void;
}) {
  const [filtroRiesgo, setFiltroRiesgo] = useState<(typeof FILTROS)[number]>("todos");
  const [q, setQ] = useState("");

  const filtrados = useMemo(() => {
    const busqueda = normalizar(q.trim());
    return casos
      .filter((c) => filtroRiesgo === "todos" || c.paciente.riesgo === filtroRiesgo)
      .filter(
        (c) =>
          !busqueda ||
          normalizar(c.paciente.id).includes(busqueda) ||
          normalizar(nombreCorto(c.paciente)).includes(busqueda),
      )
      .sort((a, b) => a.paciente.id.localeCompare(b.paciente.id));
  }, [casos, filtroRiesgo, q]);

  return (
    <>
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          margin: "16px 0 10px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Buscar por nombre o ID…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{
            fontSize: "12.5px",
            padding: "7px 10px",
            border: `1px solid ${C.inputBorde}`,
            borderRadius: 6,
            background: C.superficie,
            width: 180,
          }}
        />
        <div style={{ display: "flex", gap: 6 }}>
          {FILTROS.map((f) => {
            const activo = filtroRiesgo === f;
            return (
              <button
                key={f}
                onClick={() => setFiltroRiesgo(f)}
                style={{
                  fontSize: 12,
                  fontWeight: activo ? 600 : 400,
                  padding: "5px 11px",
                  borderRadius: 99,
                  border: `1px solid ${activo ? "#b9c6ba" : C.borde}`,
                  background: activo ? "#e3ece4" : C.superficie,
                  color: activo ? C.texto : C.tenue,
                  cursor: "pointer",
                }}
              >
                {f === "todos" ? "Todos" : f}
              </button>
            );
          })}
        </div>
        <div style={{ fontSize: 12, color: C.masTenue, marginLeft: "auto" }}>
          {filtrados.length} pacientes · clic en una fila abre su ficha en la cola
        </div>
      </div>

      <div style={TARJETA}>
        <div style={{ ...CABECERA, display: "grid", gridTemplateColumns: COLUMNAS, gap: 10 }}>
          <div>Paciente</div>
          <div>Edad · Sexo</div>
          <div>CESFAM</div>
          <div>Patologías</div>
          <div>Riesgo</div>
          <div>Fase</div>
          <div>Controles</div>
          <div>Seguimiento</div>
        </div>

        {filtrados.map((caso) => {
          const p = caso.paciente;
          const n = caso.llamadas.length;
          const seguimiento =
            (n ? `${n} ${n === 1 ? "llamada" : "llamadas"}` : "sin llamadas") +
            (caso.gestion ? " · ✓ gestionado" : "");

          return (
            <div
              key={p.id}
              className="pscv-fila"
              onClick={() => onAbrirFicha(p.id)}
              style={{
                display: "grid",
                gridTemplateColumns: COLUMNAS,
                gap: 10,
                padding: "11px 20px",
                borderTop: `1px solid ${C.bordeSuave}`,
                cursor: "pointer",
                alignItems: "center",
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: C.texto,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {nombreCorto(p)}
                </div>
                <div style={{ fontFamily: MONO, fontSize: 11, color: C.masTenue }}>{p.id}</div>
              </div>
              <div style={{ fontSize: "12.5px", color: C.medio }}>
                {p.edad} · {etiquetaSexo(p.sexo)}
              </div>
              <div style={{ fontSize: 12, color: C.tenue }}>{nombreCesfam(cesfams, p.cesfam_id)}</div>
              <Patologias lista={p.patologias} />
              <div
                style={{
                  fontSize: 12,
                  fontWeight: p.riesgo === "alto" ? 600 : 400,
                  color: RIESGO_FG[p.riesgo] ?? "#51605a",
                }}
              >
                {p.riesgo}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: p.fase === "en_compensacion" ? "#8a5800" : C.tenue,
                  fontWeight: p.fase === "en_compensacion" ? 600 : 400,
                }}
              >
                {p.fase === "en_compensacion" ? "en compensación" : "compensado"}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <div>
                  <div style={{ ...ROTULO, fontSize: "9px", marginBottom: 1 }}>Último</div>
                  <div style={{ fontSize: "11.5px", fontWeight: 600, color: C.fuerte }}>
                    {fmtFecha(p.ultimo_control)}
                  </div>
                </div>
                <div>
                  <div style={{ ...ROTULO, fontSize: "9px", marginBottom: 1 }}>Próximo</div>
                  <div style={{ fontSize: "11.5px", color: C.tenue }}>
                    {fmtFecha(p.proximo_control)}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: C.medio }}>{seguimiento}</div>
            </div>
          );
        })}
      </div>
    </>
  );
}
