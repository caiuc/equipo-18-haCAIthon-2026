"use client";

import { useMemo, useState } from "react";
import { construirCasos } from "@/lib/panel";
import type { DatosPanel } from "@/lib/datos";
import { C, LATERAL, TARJETA } from "./estilos";
import { VistaCalidad } from "./VistaCalidad";
import { VistaCola, type FilaCola } from "./VistaCola";
import { VistaGestiones } from "./VistaGestiones";
import { VistaLlamadas } from "./VistaLlamadas";
import { VistaPacientes } from "./VistaPacientes";

type Vista = "cola" | "pacientes" | "llamadas" | "gestiones" | "calidad";

const VISTAS: Record<Vista, { titulo: string; sub: string; nav: string }> = {
  cola: {
    nav: "Cola de hoy",
    titulo: "Cola de seguimiento — hoy",
    sub: "Pacientes ordenados por reglas del programa: riesgo, fase, tiempo sin contacto y hallazgos de la última llamada. El panel no llama ni decide.",
  },
  pacientes: {
    nav: "Pacientes",
    titulo: "Pacientes",
    sub: "Población PSCV bajo control. Clic en una fila abre la ficha del paciente en la cola.",
  },
  llamadas: {
    nav: "Llamadas",
    titulo: "Llamadas del agente",
    sub: "Registro de las llamadas ya realizadas por Cami, con los hallazgos derivados por reglas propias.",
  },
  gestiones: {
    nav: "Gestiones",
    titulo: "Gestiones registradas",
    sub: "Acciones del equipo tras revisar la cola: llamado, hora agendada o sin acción.",
  },
  calidad: {
    nav: "Calidad de datos",
    titulo: "Calidad de datos",
    sub: "Lo que el sistema no pudo asociar o completar. No se esconde: es señal de la salud del pipeline.",
  },
};

export function Panel({ datos, hoyISO }: { datos: DatosPanel; hoyISO: string }) {
  // `hoy` lo fija el servidor para que el render del servidor y el del cliente
  // calculen los mismos días sin contacto.
  const hoy = useMemo(() => new Date(hoyISO), [hoyISO]);

  const [vista, setVista] = useState<Vista>("cola");
  const [cesfam, setCesfam] = useState("todos");
  const [cupo, setCupo] = useState(5);
  const [expandido, setExpandido] = useState<string | null>(null);

  const derivado = useMemo(() => {
    const pacientes = datos.pacientes.filter(
      (p) => cesfam === "todos" || p.cesfam_id === cesfam,
    );
    const idsPacientes = new Set(pacientes.map((p) => p.id));

    const casos = construirCasos(pacientes, datos.llamadas, datos.acciones, hoy);

    // Las huérfanas se muestran siempre: sin paciente no hay CESFAM por el cual filtrar.
    const llamadas = datos.llamadas.filter(
      (l) => !l.paciente_id || idsPacientes.has(l.paciente_id),
    );
    const idsLlamadas = new Set(llamadas.map((l) => l.id));

    const acciones = datos.acciones
      .filter(
        (a) =>
          (a.paciente_id && idsPacientes.has(a.paciente_id)) ||
          (a.llamada_id !== null && idsLlamadas.has(a.llamada_id)),
      )
      .slice()
      .sort((a, b) => new Date(b.creado_en).getTime() - new Date(a.creado_en).getTime());

    // La cola numera solo los casos pendientes: los gestionados no ocupan cupo.
    let posicion = 0;
    const filas: FilaCola[] = casos.map((caso) => {
      const pos = caso.gestion ? -1 : posicion++;
      return { caso, posicion: pos, fueraCupo: !caso.gestion && pos >= cupo };
    });

    return {
      casos,
      filas,
      enCola: posicion,
      llamadas,
      acciones,
      huerfanas: llamadas.filter((l) => !l.paciente_id),
      incompletas: llamadas.filter((l) => l.paciente_id && (l.estado !== "completed" || !l.respuestas)),
      altoSinLlamada: casos.filter((c) => c.paciente.riesgo === "alto" && c.llamadas.length === 0),
    };
  }, [datos, cesfam, cupo, hoy]);

  const contadores: Record<Vista, number> = {
    cola: derivado.enCola,
    pacientes: derivado.casos.length,
    llamadas: derivado.llamadas.length,
    gestiones: derivado.acciones.length,
    calidad:
      derivado.huerfanas.length + derivado.incompletas.length + derivado.altoSinLlamada.length,
  };

  const abrirFicha = (pacienteId: string) => {
    setCesfam("todos");
    setExpandido(pacienteId);
    setVista("cola");
  };

  const sinDatos = datos.pacientes.length === 0 && datos.llamadas.length === 0;

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <aside
        style={{
          width: 236,
          flex: "none",
          background: LATERAL.fondo,
          color: LATERAL.texto,
          display: "flex",
          flexDirection: "column",
          padding: "20px 0 16px",
        }}
      >
        <div style={{ padding: "0 20px 16px", borderBottom: "1px solid #31413515" }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "-0.01em",
            }}
          >
            PreventAI
          </div>
          <div style={{ fontSize: "11.5px", color: LATERAL.sutil, marginTop: 2 }}>
            Panel PSCV · seguimiento telefónico
          </div>
        </div>

        <div style={{ padding: "16px 20px 6px" }}>
          <label
            htmlFor="selCesfam"
            style={{
              fontSize: "10.5px",
              fontWeight: 600,
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              color: LATERAL.etiqueta,
            }}
          >
            Centro de salud
          </label>
          <select
            id="selCesfam"
            value={cesfam}
            onChange={(e) => {
              setCesfam(e.target.value);
              setExpandido(null);
            }}
            style={{
              width: "100%",
              marginTop: 6,
              fontSize: "12.5px",
              padding: "7px 8px",
              borderRadius: 6,
              border: `1px solid ${LATERAL.campoBorde}`,
              background: LATERAL.campo,
              color: "#e6ede6",
            }}
          >
            <option value="todos">Todos los CESFAM</option>
            {datos.cesfams.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 2, padding: 12, flex: 1 }}>
          {(Object.keys(VISTAS) as Vista[]).map((v) => {
            const activa = vista === v;
            return (
              <div
                key={v}
                className={activa ? undefined : "pscv-nav"}
                onClick={() => setVista(v)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  padding: "8px 10px",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: activa ? 600 : 400,
                  color: activa ? "#ffffff" : LATERAL.item,
                  background: activa ? C.verde : "transparent",
                }}
              >
                <span>{VISTAS[v].nav}</span>
                <span
                  style={{
                    fontFamily: "var(--font-plex-mono), monospace",
                    fontSize: 11,
                    color: activa ? "#dcebe0" : LATERAL.sutil,
                    background: activa ? "#3c7a5c" : LATERAL.campo,
                    borderRadius: 10,
                    padding: "1px 7px",
                  }}
                >
                  {contadores[v]}
                </span>
              </div>
            );
          })}
        </nav>

        <div
          style={{
            padding: "14px 20px 0",
            borderTop: "1px solid #31413550",
            fontSize: 11,
            color: LATERAL.etiqueta,
            lineHeight: 1.55,
          }}
        >
          Solo lectura sobre datos clínicos. Las llamadas ya ocurrieron — desde aquí no se llama a
          nadie.
          <div
            style={{
              marginTop: 8,
              display: "inline-block",
              border: `1px solid ${LATERAL.campoBorde}`,
              borderRadius: 4,
              padding: "2px 7px",
              color: LATERAL.sutil,
            }}
          >
            datos sintéticos · sin pacientes reales
          </div>
        </div>
      </aside>

      <main style={{ flex: 1, overflowY: "auto", padding: "26px 32px 72px", minWidth: 0 }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 24,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <h1 style={{ margin: 0, fontSize: 19, fontWeight: 700, letterSpacing: "-0.01em" }}>
                {VISTAS[vista].titulo}
              </h1>
              <div
                style={{ fontSize: "12.5px", color: C.tenue, maxWidth: 600, lineHeight: 1.5 }}
              >
                {VISTAS[vista].sub}
              </div>
            </div>

            {vista === "cola" && !sinDatos && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  background: C.superficie,
                  border: `1px solid ${C.borde}`,
                  borderRadius: 8,
                  padding: "12px 16px",
                }}
              >
                <label
                  htmlFor="cupo"
                  style={{ fontSize: 13, fontWeight: 600, color: C.fuerte }}
                >
                  Puedo contactar hoy
                </label>
                <input
                  id="cupo"
                  type="number"
                  min={0}
                  max={30}
                  value={cupo}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10);
                    setCupo(Number.isNaN(v) ? 0 : Math.max(0, Math.min(30, v)));
                  }}
                  style={{
                    width: 60,
                    fontSize: 16,
                    fontWeight: 600,
                    padding: "5px 8px",
                    border: `1px solid ${C.inputBorde}`,
                    borderRadius: 6,
                    background: C.inputFondo,
                    color: C.texto,
                    textAlign: "center",
                  }}
                />
                <div
                  style={{
                    fontSize: 12,
                    color: "#5c6a61",
                    borderLeft: "1px solid #e2e8e0",
                    paddingLeft: 14,
                    lineHeight: 1.4,
                  }}
                >
                  <strong style={{ color: C.texto, fontWeight: 600 }}>
                    {Math.min(cupo, derivado.enCola)} de {derivado.enCola}
                  </strong>
                  <br />
                  en cola
                </div>
              </div>
            )}
          </div>

          {datos.errores.length > 0 && (
            <div
              style={{
                marginTop: 16,
                border: "1px solid #e6c8c3",
                background: "#f9eeec",
                borderRadius: 8,
                padding: "12px 16px",
                fontSize: "12.5px",
                color: "#a02c1c",
                lineHeight: 1.5,
              }}
            >
              <strong style={{ fontWeight: 600 }}>No se pudo leer todo desde Supabase.</strong> El
              panel muestra lo que sí llegó. {datos.errores.join(" · ")}
            </div>
          )}

          {sinDatos ? (
            <div style={{ ...TARJETA, padding: "56px 32px", textAlign: "center", marginTop: 18 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.fuerte }}>
                Ninguna llamada registrada aún
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: C.tenue,
                  marginTop: 8,
                  maxWidth: 440,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                Cuando el agente complete su primera ronda de llamadas, los pacientes aparecerán
                aquí ordenados por prioridad. Los pacientes sin llamada también se listan, para que
                nadie quede invisible.
              </div>
            </div>
          ) : (
            <>
              {vista === "cola" && (
                <VistaCola
                  filas={derivado.filas}
                  hoy={hoy}
                  expandido={expandido}
                  setExpandido={setExpandido}
                />
              )}
              {vista === "pacientes" && (
                <VistaPacientes
                  casos={derivado.casos}
                  cesfams={datos.cesfams}
                  onAbrirFicha={abrirFicha}
                />
              )}
              {vista === "llamadas" && <VistaLlamadas llamadas={derivado.llamadas} />}
              {vista === "gestiones" && (
                <VistaGestiones acciones={derivado.acciones} llamadas={datos.llamadas} />
              )}
              {vista === "calidad" && (
                <VistaCalidad
                  huerfanas={derivado.huerfanas}
                  incompletas={derivado.incompletas}
                  altoSinLlamada={derivado.altoSinLlamada}
                  cesfams={datos.cesfams}
                />
              )}
            </>
          )}

          <div
            style={{
              marginTop: 24,
              fontSize: "11.5px",
              color: C.apagado,
              maxWidth: 720,
              lineHeight: 1.5,
            }}
          >
            La severidad y el orden se derivan de reglas explícitas y auditables
            (lib/priorizacion.ts) sobre los campos crudos de respuestas — nunca de la prioridad
            sugerida por el LLM. La interpretación clínica es del equipo de salud.
          </div>
        </div>
      </main>
    </div>
  );
}
