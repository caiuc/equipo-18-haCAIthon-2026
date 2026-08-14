/** Piezas visuales compartidas por las vistas del panel. Sin estado. */

import { fmtFecha, diasRelativos } from "@/lib/formato";
import type { Tag, SeveridadTag } from "@/lib/priorizacion";
import type { Fase } from "@/lib/types";
import { C, MONO, ROTULO, TAGC } from "./estilos";

export function Etiquetas({ tags }: { tags: Tag[] }) {
  if (tags.length === 0) return null;

  return (
    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
      {tags.map((t) => (
        <span
          key={t.id}
          style={{
            fontSize: "11px",
            fontWeight: 500,
            color: TAGC[t.sev].fg,
            background: TAGC[t.sev].bg,
            borderRadius: 4,
            padding: "1px 6px",
          }}
        >
          {t.label}
        </span>
      ))}
    </div>
  );
}

export function Patologias({ lista }: { lista: string[] }) {
  return (
    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
      {lista.map((pat) => (
        <span
          key={pat}
          style={{
            fontSize: "10.5px",
            fontWeight: 500,
            color: "#51605a",
            background: "#eef2ed",
            borderRadius: 4,
            padding: "2px 6px",
          }}
        >
          {pat}
        </span>
      ))}
    </div>
  );
}

export function Rotulo({ children }: { children: React.ReactNode }) {
  return <div style={{ ...ROTULO, marginBottom: 6 }}>{children}</div>;
}

/** Pastilla de estado. El tono reusa la escala de severidad de los tags. */
function Pastilla({ tono, children }: { tono: SeveridadTag; children: React.ReactNode }) {
  return (
    <span
      style={{
        fontSize: "10.5px",
        fontWeight: 500,
        color: TAGC[tono].fg,
        background: TAGC[tono].bg,
        borderRadius: 4,
        padding: "1px 6px",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

function MicroRotulo({ children }: { children: React.ReactNode }) {
  return <div style={{ ...ROTULO, fontSize: "9.5px", marginBottom: 3 }}>{children}</div>;
}

/**
 * Fechas de control del paciente: la de referencia va como fecha legible y el
 * tiempo relativo como pastilla, que es el dato que el TENS mira primero.
 *
 * Umbrales: el PSCV controla cada 3 o 6 meses según riesgo, así que a los 180
 * días el control está vencido para cualquiera y a los 270 ya es un caso
 * perdido de vista. El próximo control se marca en cuanto pasa su fecha.
 */
export function BloqueControles({
  ultimoControl,
  proximoControl,
  hoy,
  fase,
}: {
  ultimoControl: string | null;
  proximoControl: string | null;
  hoy: Date;
  /** Opcional: en la ficha se muestra junto al último control. */
  fase?: Fase;
}) {
  const desdeUltimo = diasRelativos(ultimoControl, hoy);
  const desdeProximo = diasRelativos(proximoControl, hoy);

  const tonoUltimo: SeveridadTag =
    desdeUltimo === null || desdeUltimo < 180 ? "info" : desdeUltimo < 270 ? "atencion" : "critica";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div>
        <MicroRotulo>Último control</MicroRotulo>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: "12.5px", fontWeight: 600, color: C.fuerte }}>
            {fmtFecha(ultimoControl)}
          </span>
          {desdeUltimo !== null && <Pastilla tono={tonoUltimo}>hace {desdeUltimo} d</Pastilla>}
        </div>
        {fase && (
          <div style={{ fontSize: "11.5px", color: C.tenue, marginTop: 2 }}>
            {fase === "en_compensacion" ? "en compensación" : "compensado"}
          </div>
        )}
      </div>

      <div>
        <MicroRotulo>Próximo control</MicroRotulo>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span
            style={{
              fontSize: "12.5px",
              fontWeight: 600,
              color: proximoControl ? C.fuerte : C.apagado,
            }}
          >
            {proximoControl ? fmtFecha(proximoControl) : "sin agendar"}
          </span>
          {desdeProximo === null ? (
            <Pastilla tono="atencion">pendiente de agendar</Pastilla>
          ) : desdeProximo > 0 ? (
            <Pastilla tono="critica">atrasado {desdeProximo} d</Pastilla>
          ) : desdeProximo === 0 ? (
            <Pastilla tono="atencion">es hoy</Pastilla>
          ) : (
            <Pastilla tono="info">en {-desdeProximo} d</Pastilla>
          )}
        </div>
      </div>
    </div>
  );
}

export type KPI = {
  label: string;
  valor: number;
  detalle: string;
  /** Punto de color a la izquierda del valor, para los KPIs de severidad. */
  dot?: string;
};

/**
 * Fila de indicadores del turno. Son conteos de la cola ya filtrada: no
 * agregan lógica propia, solo resumen lo que la tabla de abajo muestra fila
 * por fila.
 */
export function FilaKPIs({ items }: { items: KPI[] }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`,
        gap: 10,
        margin: "18px 0 4px",
      }}
    >
      {items.map((kpi) => (
        <div
          key={kpi.label}
          style={{
            background: C.superficie,
            border: `1px solid ${C.borde}`,
            borderRadius: 8,
            padding: "11px 14px 12px",
            minWidth: 0,
          }}
        >
          <MicroRotulo>{kpi.label}</MicroRotulo>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            {kpi.dot && (
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: kpi.dot,
                  flex: "none",
                }}
              />
            )}
            <span
              style={{
                fontSize: 24,
                fontWeight: 600,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                color: C.texto,
              }}
            >
              {kpi.valor}
            </span>
          </div>
          <div
            style={{
              fontSize: "11.5px",
              color: C.masTenue,
              marginTop: 3,
              lineHeight: 1.35,
            }}
          >
            {kpi.detalle}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Bloque de `priority` / `next_best_action`. Va marcado como referencia porque
 * lo produce el LLM y no interviene en el orden de la cola.
 */
export function SugerenciaAsistente({
  priority,
  nextBestAction,
}: {
  priority: string | null;
  nextBestAction: string | null;
}) {
  if (!priority && !nextBestAction) return null;

  return (
    <div
      style={{
        border: "1px dashed #cdd6cc",
        borderRadius: 6,
        padding: "10px 12px",
        background: C.inputFondo,
      }}
    >
      <div style={{ ...ROTULO, color: "#98a49b", marginBottom: 5 }}>
        Sugerencia del asistente — solo referencia, no verificada
      </div>
      <div style={{ fontSize: "12.5px", color: C.tenue, lineHeight: 1.5 }}>
        priority: <span style={{ fontFamily: MONO }}>{priority ?? "—"}</span> ·
        next_best_action: <span style={{ fontFamily: MONO }}>{nextBestAction ?? "—"}</span>
      </div>
    </div>
  );
}
