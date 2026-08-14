/**
 * Reglas deterministas del panel.
 *
 * Todo lo que ordena o clasifica la cola sale de acá: son reglas explícitas y
 * auditables sobre los campos CRUDOS de `llamadas.respuestas`. `priority` y
 * `next_best_action` los produce el LLM y NO se usan en ningún cálculo de este
 * archivo — solo se muestran, etiquetados como referencia.
 *
 * Nada de esto se guarda en la base: se recalcula en cada lectura.
 */

import type { Llamada, Paciente } from "./types";
import { diasDesde } from "./formato";

export type SeveridadTag = "critica" | "atencion" | "info";
export type Severidad = "critica" | "atencion" | "rutina";

export type Tag = {
  id: string;
  label: string;
  sev: SeveridadTag;
};

/** Nombre legible de cada síntoma que reporta Cami. El orden importa: se muestran los dos primeros. */
const SINTOMAS: Record<string, string> = {
  chest_pain_past_week: "dolor de pecho",
  chest_pain_current: "dolor de pecho actual",
  shortness_of_breath_past_week: "falta de aire",
  palpitations_past_week: "palpitaciones",
  dizziness_past_week: "mareos",
  fainting_past_week: "desmayos",
  neurologic_warning_signs_current: "signos neurológicos",
};

/**
 * Tags de una llamada. `null` (paciente sin llamadas) devuelve lista vacía:
 * la ausencia de llamada se comunica aparte, en el motivo.
 */
export function derivarTags(llamada: Llamada | null): Tag[] {
  const tags: Tag[] = [];
  if (!llamada) return tags;

  const r = llamada.respuestas;

  if (r) {
    if (r.emergency?.active === true) {
      tags.push({ id: "emergencia", label: "emergencia en llamada", sev: "critica" });
    }

    const med = r.medications ?? {};
    if (med.taking_as_prescribed === false) {
      tags.push({
        id: "sin_meds",
        label:
          med.medication_issue === "MEDICATION_UNAVAILABLE"
            ? "sin acceso a medicamentos"
            : "no toma medicamentos",
        sev: "critica",
      });
    }

    const bp = r.blood_pressure ?? {};
    if (bp.reported_high_values === true) {
      // El paciente puede dictar varias mediciones ("168/98; 160/95"): se muestra la primera.
      const primera = bp.latest_reported_value
        ? String(bp.latest_reported_value).split(";")[0].trim()
        : "";
      tags.push({
        id: "presion",
        label: "presiones altas" + (primera ? ` (${primera})` : ""),
        sev: "atencion",
      });
    }
    if (bp.measured_last_7_days === false) {
      tags.push({ id: "sin_mediciones", label: "sin mediciones 7 días", sev: "atencion" });
    }

    const s = (r.symptoms ?? {}) as Record<string, unknown>;
    const presentes = Object.keys(SINTOMAS).filter((k) => s[k] === true);
    if (presentes.length > 0) {
      tags.push({
        id: "sintomas",
        label: "síntomas: " + presentes.slice(0, 2).map((k) => SINTOMAS[k]).join(", "),
        sev: "atencion",
      });
    }
    if (r.symptoms?.overall_health_worsening === true) {
      tags.push({ id: "peor", label: "refiere empeoramiento", sev: "atencion" });
    }

    if (r.follow_up?.pending_appointment_or_test === true) {
      tags.push({ id: "pendiente", label: "examen/hora pendiente", sev: "info" });
    }
    if (r.lifestyle?.smoked_last_7_days === true) {
      tags.push({ id: "fuma", label: "fumó en la semana", sev: "info" });
    }
  } else {
    tags.push({ id: "sin_datos", label: "llamada sin datos", sev: "info" });
  }

  if (llamada.estado !== "completed") {
    tags.push({ id: "incompleta", label: "llamada incompleta", sev: "info" });
  }

  return tags;
}

/**
 * Severidad visible de un caso. Un paciente sin ninguna llamada es "atención"
 * aunque no tenga tags: no saber nada de él es en sí un hallazgo.
 */
export function severidadDe(tags: Tag[], llamada: Llamada | null): Severidad {
  if (tags.some((t) => t.sev === "critica")) return "critica";
  if (tags.some((t) => t.sev === "atencion") || !llamada) return "atencion";
  return "rutina";
}

/**
 * Urgencia = riesgo (alto 3 / moderado 2 / bajo 1)
 *          + fase (en compensación 2)
 *          + tiempo sin contacto (1 punto cada 14 días, tope 5)
 *          + hallazgos (crítico 4 / atención 2).
 *
 * Solo ordena la lista. No es un score clínico ni una decisión.
 */
export function calcularUrgencia(
  paciente: Paciente,
  llamada: Llamada | null,
  tags: Tag[],
  hoy: Date,
): number {
  const riesgo = { alto: 3, moderado: 2, bajo: 1 }[paciente.riesgo] ?? 1;
  const fase = paciente.fase === "en_compensacion" ? 2 : 0;
  const referencia = llamada ? llamada.creado_en : paciente.ultimo_control;
  const dias = diasDesde(referencia, hoy);
  const hallazgos = tags.some((t) => t.sev === "critica")
    ? 4
    : tags.some((t) => t.sev === "atencion")
      ? 2
      : 0;

  return riesgo + fase + Math.min(dias / 14, 5) + hallazgos;
}

/**
 * Frase que explica por qué el caso está donde está. Es la traducción literal
 * de los tags y de las reglas de arriba: si aparece en el motivo, sumó puntos.
 */
export function motivoLegible(
  paciente: Paciente,
  llamada: Llamada | null,
  tags: Tag[],
  dias: number,
): string {
  const partes: string[] = tags
    .filter((t) => t.sev !== "info")
    .slice(0, 2)
    .map((t) => t.label);

  if (!llamada) partes.push("sin llamadas de seguimiento registradas");

  tags.filter((t) => t.sev === "info").forEach((t) => partes.push(t.label));

  if (dias >= 21) partes.push(`sin contacto hace ${Math.round(dias / 7)} semanas`);
  if (paciente.riesgo === "alto") partes.push("riesgo alto");
  if (paciente.fase === "en_compensacion") partes.push("en compensación");

  if (partes.length === 0) {
    partes.push(`sin hallazgos en la última llamada · riesgo ${paciente.riesgo}`);
  }

  return partes.join(" · ");
}
