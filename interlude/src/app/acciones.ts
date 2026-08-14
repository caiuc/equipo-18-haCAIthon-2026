"use server";

import { refresh } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/server";
import type { TipoAccion } from "@/lib/types";

const TIPOS_VALIDOS: TipoAccion[] = ["llamado", "agendado", "sin_accion"];

const LARGO_MAX_NOTA = 500;

export type ResultadoGestion = { ok: true } | { ok: false; error: string };

/**
 * Única escritura del panel. Va con la service role key desde el servidor:
 * la anon key es pública y solo tiene permiso de lectura (ver schema.sql).
 *
 * El panel no tiene autenticación, así que esta acción es alcanzable por POST
 * directo. Por eso se valida todo lo que llega y se acota a insertar una fila
 * en `acciones`: no toca pacientes ni llamadas.
 */
export async function registrarGestion(entrada: {
  pacienteId: string;
  llamadaId: number | null;
  tipo: TipoAccion;
  nota: string;
}): Promise<ResultadoGestion> {
  const pacienteId = String(entrada.pacienteId ?? "").trim();
  if (!pacienteId) return { ok: false, error: "Falta el paciente." };

  if (!TIPOS_VALIDOS.includes(entrada.tipo)) {
    return { ok: false, error: "Tipo de gestión desconocido." };
  }

  const llamadaId =
    typeof entrada.llamadaId === "number" && Number.isInteger(entrada.llamadaId)
      ? entrada.llamadaId
      : null;

  const nota = String(entrada.nota ?? "").trim().slice(0, LARGO_MAX_NOTA);

  const { error } = await supabaseAdmin.from("acciones").insert({
    paciente_id: pacienteId,
    llamada_id: llamadaId,
    tipo: entrada.tipo,
    nota: nota || null,
  });

  if (error) return { ok: false, error: error.message };

  // La página es force-dynamic, así que basta con refrescar el router del
  // cliente para que vuelva a consultar Supabase.
  refresh();
  return { ok: true };
}
