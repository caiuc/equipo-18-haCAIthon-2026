"use client";

import { ConversationProvider, useConversation } from "@elevenlabs/react";
import { useEffect, useRef, useState } from "react";
import type { Paciente } from "@/lib/types";

type Props = { pacientes: Paciente[] };

type Turno = { rol: "paciente" | "agente"; texto: string };

export default function ConversacionCliente({ pacientes }: Props) {
  return (
    <ConversationProvider>
      <Conversacion pacientes={pacientes} />
    </ConversationProvider>
  );
}

function Conversacion({ pacientes }: Props) {
  const [pacienteId, setPacienteId] = useState(pacientes[0]?.id ?? "");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [avisoBackend, setAvisoBackend] = useState<string | null>(null);
  const [conectando, setConectando] = useState(false);

  // Los callbacks del SDK se registran una vez; leen el estado por ref para no
  // quedarse con valores viejos.
  const pacienteIdRef = useRef(pacienteId);
  const conversationIdRef = useRef<string | null>(null);
  useEffect(() => {
    pacienteIdRef.current = pacienteId;
  }, [pacienteId]);

  const conversacion = useConversation({
    onConnect: ({ conversationId: id }) => {
      conversationIdRef.current = id;
      setConversationId(id);
      setConectando(false);
      setError(null);
    },
    onMessage: ({ message, source }) => {
      setTurnos((previos) => [
        ...previos,
        { rol: source === "user" ? "paciente" : "agente", texto: message },
      ]);
    },
    onError: (mensaje) => {
      setError(mensaje);
      setConectando(false);
    },
    onDisconnect: () => {
      setConectando(false);
      avisarBackend(conversationIdRef.current, pacienteIdRef.current);
    },
  });

  const conectado = conversacion.status === "connected";

  /**
   * Avisa al backend con el conversation_id. No usamos post-call webhooks: es
   * el cliente quien dispara la petición para poder correr en localhost.
   */
  async function avisarBackend(idConversacion: string | null, idPaciente: string) {
    if (!idConversacion || !idPaciente) return;
    try {
      const respuesta = await fetch("/api/conversacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation_id: idConversacion,
          paciente_id: idPaciente,
        }),
      });
      setAvisoBackend(
        respuesta.ok
          ? `Backend notificado con ${idConversacion}`
          : `El backend respondió ${respuesta.status}`
      );
    } catch (e) {
      setAvisoBackend(`No se pudo avisar al backend: ${mensajeDeError(e)}`);
    }
  }

  async function iniciar() {
    setError(null);
    setAvisoBackend(null);
    setTurnos([]);
    setConversationId(null);
    conversationIdRef.current = null;
    setConectando(true);

    try {
      // El navegador exige el permiso antes de abrir la sesión.
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const respuesta = await fetch("/api/elevenlabs/token");
      const datos = (await respuesta.json()) as {
        token?: string;
        agentId?: string;
        error?: string;
      };

      if (!respuesta.ok || datos.error) {
        throw new Error(datos.error ?? `El servidor respondió ${respuesta.status}`);
      }

      if (datos.token) {
        conversacion.startSession({
          conversationToken: datos.token,
          connectionType: "webrtc",
        });
      } else if (datos.agentId) {
        conversacion.startSession({
          agentId: datos.agentId,
          connectionType: "webrtc",
        });
      } else {
        throw new Error("El servidor no devolvió token ni agentId");
      }
    } catch (e) {
      setError(mensajeDeError(e));
      setConectando(false);
    }
  }

  function terminar() {
    conversacion.endSession();
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-lg border border-zinc-200 p-5 dark:border-zinc-800">
        <label
          htmlFor="paciente"
          className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Paciente
        </label>

        {pacientes.length > 0 ? (
          <select
            id="paciente"
            value={pacienteId}
            onChange={(e) => setPacienteId(e.target.value)}
            disabled={conectado || conectando}
            className="w-full rounded border border-zinc-300 bg-white p-2 text-sm disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900"
          >
            {pacientes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.id} · {p.edad} años · {p.patologias.join(", ")} · riesgo {p.riesgo}
              </option>
            ))}
          </select>
        ) : (
          <input
            id="paciente"
            value={pacienteId}
            onChange={(e) => setPacienteId(e.target.value)}
            disabled={conectado || conectando}
            placeholder="P-01"
            className="w-full rounded border border-zinc-300 bg-white p-2 font-mono text-sm disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900"
          />
        )}

        {pacientes.length === 0 && (
          <p className="mt-2 text-xs text-zinc-500">
            No se pudo leer la tabla de pacientes. Escribe el id a mano.
          </p>
        )}
      </section>

      <section className="flex flex-col items-center gap-4 rounded-lg border border-zinc-200 p-8 dark:border-zinc-800">
        <button
          type="button"
          onClick={conectado ? terminar : iniciar}
          disabled={conectando || !pacienteId}
          className={`flex h-32 w-32 items-center justify-center rounded-full text-center text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
            conectado
              ? "bg-red-600 hover:bg-red-700"
              : "bg-emerald-600 hover:bg-emerald-700"
          } ${conversacion.isSpeaking ? "ring-8 ring-emerald-300 dark:ring-emerald-900" : ""}`}
        >
          {conectando ? "Conectando…" : conectado ? "Terminar" : "Hablar"}
        </button>

        <Estado
          status={conversacion.status}
          isSpeaking={conversacion.isSpeaking}
          conectado={conectado}
        />

        {conectado && (
          <button
            type="button"
            onClick={() => conversacion.setMuted(!conversacion.isMuted)}
            className="rounded border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
          >
            {conversacion.isMuted ? "Reactivar micrófono" : "Silenciar micrófono"}
          </button>
        )}

        {conversationId && (
          <p className="font-mono text-xs text-zinc-500">
            conversation_id: {conversationId}
          </p>
        )}
      </section>

      {error && (
        <p className="rounded bg-red-100 p-4 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
          {error}
        </p>
      )}

      {avisoBackend && (
        <p className="rounded bg-zinc-100 p-4 text-sm text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
          {avisoBackend}
        </p>
      )}

      {turnos.length > 0 && (
        <section className="rounded-lg border border-zinc-200 p-5 dark:border-zinc-800">
          <h2 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Transcripción en vivo
          </h2>
          <ul className="flex flex-col gap-3">
            {turnos.map((turno, indice) => (
              <li key={indice} className="flex flex-col gap-0.5">
                <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  {turno.rol}
                </span>
                <span className="text-sm text-zinc-800 dark:text-zinc-200">
                  {turno.texto}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-zinc-500">
            Esta transcripción es solo para ver la llamada mientras ocurre. La
            que se guarda es la que entrega la API de ElevenLabs al terminar.
          </p>
        </section>
      )}
    </div>
  );
}

function Estado({
  status,
  isSpeaking,
  conectado,
}: {
  status: string;
  isSpeaking: boolean;
  conectado: boolean;
}) {
  const texto = conectado
    ? isSpeaking
      ? "El agente está hablando"
      : "Escuchando"
    : status === "connecting"
      ? "Conectando"
      : "Desconectado";

  return <p className="text-sm text-zinc-600 dark:text-zinc-400">{texto}</p>;
}

function mensajeDeError(e: unknown) {
  if (e instanceof DOMException && e.name === "NotAllowedError") {
    return "El navegador bloqueó el micrófono. Permítelo y vuelve a intentar.";
  }
  return e instanceof Error ? e.message : String(e);
}
