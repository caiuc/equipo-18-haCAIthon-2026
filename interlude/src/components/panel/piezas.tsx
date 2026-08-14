/** Piezas visuales compartidas por las vistas del panel. Sin estado. */

import type { Tag } from "@/lib/priorizacion";
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
