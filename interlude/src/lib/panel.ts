/**
 * Derivaciones que necesita el panel: agrupar llamadas por paciente, resolver
 * qué casos ya tienen gestión y armar la cola ordenada.
 *
 * Funciones puras sobre los datos crudos. Nada de esto se persiste.
 */

import type { Accion, Cesfam, Llamada, Paciente, TipoAccion } from "./types";
import {
  calcularUrgencia,
  derivarTags,
  motivoLegible,
  severidadDe,
  type Severidad,
  type Tag,
} from "./priorizacion";
import { diasDesde } from "./formato";

export type Gestion = {
  tipo: TipoAccion;
  nota: string | null;
  fecha: string;
};

export type Caso = {
  paciente: Paciente;
  /** Llamadas del paciente, de la más reciente a la más antigua. */
  llamadas: Llamada[];
  ultima: Llamada | null;
  tags: Tag[];
  /** Días desde la última llamada; si no hay ninguna, desde el último control. */
  dias: number;
  severidad: Severidad;
  urgencia: number;
  motivo: string;
  /** Gestión más reciente del equipo, si el caso ya fue trabajado. */
  gestion: Gestion | null;
};

/**
 * Última gestión por paciente. Una acción puede colgar del paciente o de una
 * llamada; en el segundo caso se resuelve el paciente a través de la llamada.
 * Las acciones llegan en orden ascendente, así que la última sobreescribe.
 */
export function gestionesPorPaciente(
  acciones: Accion[],
  llamadas: Llamada[],
): Record<string, Gestion> {
  const pacienteDeLlamada = new Map(llamadas.map((l) => [l.id, l.paciente_id]));
  const salida: Record<string, Gestion> = {};

  for (const a of acciones) {
    const pacienteId =
      a.paciente_id ?? (a.llamada_id !== null ? pacienteDeLlamada.get(a.llamada_id) : null);
    if (!pacienteId) continue;
    salida[pacienteId] = { tipo: a.tipo, nota: a.nota, fecha: a.creado_en };
  }

  return salida;
}

/** Llamadas de cada paciente, ya ordenadas de la más reciente a la más antigua. */
export function llamadasPorPaciente(llamadas: Llamada[]): Map<string, Llamada[]> {
  const mapa = new Map<string, Llamada[]>();

  for (const l of llamadas) {
    if (!l.paciente_id) continue;
    const lista = mapa.get(l.paciente_id);
    if (lista) lista.push(l);
    else mapa.set(l.paciente_id, [l]);
  }

  for (const lista of mapa.values()) {
    lista.sort((a, b) => new Date(b.creado_en).getTime() - new Date(a.creado_en).getTime());
  }

  return mapa;
}

/** Cola completa, ordenada por urgencia descendente. Incluye casos ya gestionados. */
export function construirCasos(
  pacientes: Paciente[],
  llamadas: Llamada[],
  acciones: Accion[],
  hoy: Date,
): Caso[] {
  const porPaciente = llamadasPorPaciente(llamadas);
  const gestiones = gestionesPorPaciente(acciones, llamadas);

  return pacientes
    .map((paciente) => {
      const suyas = porPaciente.get(paciente.id) ?? [];
      const ultima = suyas[0] ?? null;
      const tags = derivarTags(ultima);
      const dias = diasDesde(ultima ? ultima.creado_en : paciente.ultimo_control, hoy);

      return {
        paciente,
        llamadas: suyas,
        ultima,
        tags,
        dias,
        severidad: severidadDe(tags, ultima),
        urgencia: calcularUrgencia(paciente, ultima, tags, hoy),
        motivo: motivoLegible(paciente, ultima, tags, dias),
        gestion: gestiones[paciente.id] ?? null,
      };
    })
    .sort((a, b) => b.urgencia - a.urgencia);
}

export function nombreCesfam(cesfams: Cesfam[], id: string): string {
  return cesfams.find((c) => c.id === id)?.nombre ?? id;
}
