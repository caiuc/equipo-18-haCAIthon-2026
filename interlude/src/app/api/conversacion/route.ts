import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { conversation_id, paciente_id } = body;

  if (!conversation_id || !paciente_id) {
    return NextResponse.json(
      { error: "Faltan conversation_id o paciente_id" },
      { status: 400 }
    );
  }

  // TODO (siguiente sesión): consultar la API de ElevenLabs, aplicar reglas
  // deterministas y guardar el caso en Supabase.
  return NextResponse.json({ conversation_id, paciente_id });
}
