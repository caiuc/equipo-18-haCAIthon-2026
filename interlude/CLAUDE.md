@AGENTS.md

# Interlude

Sistema de seguimiento telefónico para pacientes crónicos de CESFAM (atención
primaria, Chile). Prototipo para hackathon de 4,5 horas. Datos 100% sintéticos,
sin pacientes reales.

El nombre viene del problema: en el Programa de Salud Cardiovascular los
controles presenciales son cada 3 o 6 meses según riesgo, y entre uno y otro
casi no hay seguimiento. Interlude cubre ese intervalo.

## Cómo funciona

1. Un agente de voz de ElevenLabs (Cami) conversa con el paciente sobre su
   última semana: síntomas de alarma, presión, medicamentos, tabaco,
   controles pendientes. En el prototipo la conversación ocurre por voz en el
   navegador. El system prompt de Cami vive en ElevenLabs, no en este repo.
2. Al terminar la llamada, ElevenLabs hace un POST directo a la tabla
   `llamadas` de Supabase (su API REST ya es pública, así que no necesitamos
   exponer nuestro backend). La transcripción y el JSON estructurado que
   arma Cami (síntomas, presión, medicamentos, emergencia, prioridad
   sugerida, etc., ver el system prompt de Cami) quedan en las columnas
   `transcripcion` y `respuestas`.
3. La prioridad y el `next_best_action` que Cami sugiere dentro de
   `respuestas` son solo referencia: no se usan para ordenar el panel. Los
   tags se calculan al leer, en TypeScript, con reglas deterministas propias
   sobre los campos crudos de `respuestas` (pendiente de implementar), nunca
   copiando lo que sugirió el LLM. No se guardan en la base.
4. Un panel muestra al equipo de salud la lista ordenada de casos con el
   contexto de cada paciente, para que el TENS decida a quién contactar.

## Reglas del proyecto

- El sistema NO prioriza automáticamente ni toma decisiones clínicas. Asigna
  tags y ordena; la decisión es siempre del profesional de salud.
- Los tags se calculan con reglas deterministas, nunca con un LLM.
- No exponemos ninguna URL nuestra: quien recibe el POST de ElevenLabs es la
  API REST de Supabase, que ya es pública. Por eso podemos correr en
  localhost. PENDIENTE de verificar cómo se configura ese POST del lado de
  ElevenLabs (post-call webhook vs. tool del agente): el webhook manda un
  envoltorio propio que no calza con nuestras columnas, así que puede que
  haga falta un tool con body configurable o una tabla de aterrizaje.
- El panel no necesita Realtime ni polling: recargar la página vuelve a
  consultar Supabase. Las páginas van con `dynamic = "force-dynamic"` para
  que no haya caché stale.
- Sin autenticación. El panel es abierto y filtra por CESFAM con un selector.
- La service role key de Supabase nunca puede llegar al cliente ni usarse en
  componentes 'use client'.
- RLS está activo en las cuatro tablas. La anon key SOLO puede leer: es
  pública porque viaja al navegador, así que darle permiso de escritura
  permitiría a cualquiera vaciar la base. Toda escritura va con la service
  role key desde el servidor (`supabaseAdmin`), incluidas las acciones que
  registra el panel. No agregar políticas de insert/update/delete para anon.
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
- La tabla `llamadas` tiene restricciones laxas a propósito (sin CHECK en
  `estado`, `paciente_id` nullable). Como la escribe ElevenLabs directo, un
  rechazo de Postgres significa perder la conversación completa y en silencio.
  Guardar una fila imperfecta es mejor que perderla; se normaliza al leer.
- Código y comentarios en español.
