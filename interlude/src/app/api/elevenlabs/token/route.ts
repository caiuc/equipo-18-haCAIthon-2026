import { NextResponse } from "next/server";

// Nunca hacemos dev/build cache de esto: el token es de un solo uso.
export const dynamic = "force-dynamic";

const AGENT_ID = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
const API_KEY = process.env.ELEVENLABS_API_KEY;

/**
 * Entrega al navegador lo mínimo para abrir la sesión de voz.
 *
 * Con ELEVENLABS_API_KEY pedimos un conversation token de un solo uso: la key
 * se queda en el servidor y nunca llega al cliente. Sin key solo devolvemos el
 * agent_id, que sirve únicamente si el agente está configurado como público.
 */
export async function GET() {
  if (!AGENT_ID) {
    return NextResponse.json(
      { error: "Falta NEXT_PUBLIC_ELEVENLABS_AGENT_ID en .env.local" },
      { status: 500 }
    );
  }

  if (!API_KEY) {
    return NextResponse.json({ agentId: AGENT_ID });
  }

  const respuesta = await fetch(
    `https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${AGENT_ID}`,
    { headers: { "xi-api-key": API_KEY }, cache: "no-store" }
  );

  if (!respuesta.ok) {
    const detalle = await respuesta.text();
    return NextResponse.json(
      { error: `ElevenLabs respondió ${respuesta.status}: ${detalle}` },
      { status: 502 }
    );
  }

  const { token } = (await respuesta.json()) as { token: string };
  return NextResponse.json({ token });
}
