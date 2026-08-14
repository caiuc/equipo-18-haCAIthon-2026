@AGENTS.md

# Interlude

Sistema de seguimiento telefónico para pacientes crónicos de CESFAM (atención
primaria, Chile). Prototipo para hackathon de 4,5 horas. Datos 100% sintéticos,
sin pacientes reales.

El nombre viene del problema: en el Programa de Salud Cardiovascular los
controles presenciales son cada 3 o 6 meses según riesgo, y entre uno y otro
casi no hay seguimiento. Interlude cubre ese intervalo.

## Cómo funciona

1. Un agente de voz de ElevenLabs conversa con el paciente sobre su última
   semana: adherencia a medicamentos, stock de remedios, automedición de
   presión, asistencia al último control, síntomas de alarma. En el prototipo
   la conversación ocurre por voz en el navegador.
2. Al terminar, el cliente notifica al backend con el conversation_id. El
   backend consulta la API de ElevenLabs y obtiene la transcripción más los
   campos ya extraídos por Data Collection (configurado en el panel de
   ElevenLabs, no en nuestro código).
3. El backend aplica reglas deterministas, asigna tags de hallazgo y guarda el
   caso en Supabase.
4. Un panel muestra al equipo de salud la lista ordenada de casos con el
   contexto de cada paciente, para que el TENS decida a quién contactar.

## Reglas del proyecto

- El sistema NO prioriza automáticamente ni toma decisiones clínicas. Asigna
  tags y ordena; la decisión es siempre del profesional de salud.
- Los tags se calculan con reglas deterministas, nunca con un LLM.
- NO usamos post-call webhooks. Nosotros iniciamos la petición a ElevenLabs,
  para poder correr en localhost sin URL pública. En producción migraría a
  webhook.
- Sin autenticación. El panel es abierto y filtra por CESFAM con un selector.
- La service role key de Supabase nunca puede llegar al cliente ni usarse en
  componentes 'use client'.
- Sin datos personales reales: nada de RUT ni nombres. El teléfono se guarda
  hasheado.

## Stack

- Next.js 16 (App Router) + TypeScript + React 19
- Tailwind v4: configuración vía CSS (@import "tailwindcss"). NO existe
  tailwind.config.js.
- Supabase (PostgreSQL) con @supabase/supabase-js. NO usamos Prisma.

## Convenciones

- Gestor de paquetes: pnpm. Nunca usar npm ni yarn.
- Tablas y columnas en snake_case y en español.
- Las respuestas de la llamada van en una columna jsonb, no en columnas
  separadas: el guion puede cambiar durante el evento.
- Código y comentarios en español.
