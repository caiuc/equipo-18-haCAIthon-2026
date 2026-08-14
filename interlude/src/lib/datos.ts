import { supabase } from "@/lib/supabase/client";
import type { Accion, Cesfam, Llamada, Paciente, RespuestasCami } from "@/lib/types";

export type DatosPanel = {
  cesfams: Cesfam[];
  pacientes: Paciente[];
  llamadas: Llamada[];
  acciones: Accion[];
  /** Mensajes de Supabase por tabla que falló. El panel se dibuja igual con lo que sí llegó. */
  errores: string[];
};

/**
 * `respuestas` es jsonb, pero la escribe ElevenLabs desde la config de su tool:
 * si manda el objeto serializado, Postgres guarda un jsonb de tipo string y
 * supabase-js lo devuelve como string. Se normaliza acá, al leer.
 */
function normalizarRespuestas(valor: unknown): RespuestasCami | null {
  if (valor === null || valor === undefined) return null;

  if (typeof valor === "string") {
    try {
      const parseado: unknown = JSON.parse(valor);
      return parseado && typeof parseado === "object" ? (parseado as RespuestasCami) : null;
    } catch {
      return null;
    }
  }

  return typeof valor === "object" ? (valor as RespuestasCami) : null;
}

type FilaLlamada = Omit<Llamada, "respuestas"> & { respuestas: unknown };
type FilaPaciente = Omit<Paciente, "patologias"> & { patologias: string[] | null };

/**
 * Lee las cuatro tablas con la anon key (solo select, ver RLS en schema.sql).
 * Sin caché: la página es force-dynamic, así que recargar vuelve a consultar.
 *
 * Si una tabla falla, se devuelve vacía y el error se acumula: perder la lista
 * de acciones no debería dejar la cola de pacientes en blanco.
 */
export async function cargarDatosPanel(): Promise<DatosPanel> {
  const [cesfams, pacientes, llamadas, acciones] = await Promise.all([
    supabase.from("cesfams").select("*").order("nombre").returns<Cesfam[]>(),
    supabase.from("pacientes").select("*").order("id").returns<FilaPaciente[]>(),
    supabase
      .from("llamadas")
      .select("*")
      .order("creado_en", { ascending: false })
      .returns<FilaLlamada[]>(),
    supabase
      .from("acciones")
      .select("*")
      .order("creado_en", { ascending: true })
      .returns<Accion[]>(),
  ]);

  const errores = [
    cesfams.error && `cesfams: ${cesfams.error.message}`,
    pacientes.error && `pacientes: ${pacientes.error.message}`,
    llamadas.error && `llamadas: ${llamadas.error.message}`,
    acciones.error && `acciones: ${acciones.error.message}`,
  ].filter((e): e is string => Boolean(e));

  return {
    cesfams: cesfams.data ?? [],
    pacientes: (pacientes.data ?? []).map((p) => ({ ...p, patologias: p.patologias ?? [] })),
    llamadas: (llamadas.data ?? []).map((l) => ({
      ...l,
      respuestas: normalizarRespuestas(l.respuestas),
    })),
    acciones: acciones.data ?? [],
    errores,
  };
}
