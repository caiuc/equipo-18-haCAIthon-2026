import { supabase } from "@/lib/supabase/client";
import type { Paciente } from "@/lib/types";
import ConversacionCliente from "./ConversacionCliente";

export const dynamic = "force-dynamic";

export default async function ConversacionPage() {
  // Si Supabase todavía no está configurado seguimos igual: el cliente deja
  // escribir el paciente_id a mano.
  const { data: pacientes } = await supabase
    .from("pacientes")
    .select("*")
    .order("id")
    .returns<Paciente[]>();

  return (
    <div className="min-h-screen bg-zinc-50 p-8 dark:bg-black">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Chequeo telefónico
        </h1>
        <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
          Conversación de voz con el agente de ElevenLabs. Elige el paciente,
          aprieta Hablar y permite el micrófono. Al terminar, el
          conversation_id se envía al backend.
        </p>

        <ConversacionCliente pacientes={pacientes ?? []} />
      </div>
    </div>
  );
}
