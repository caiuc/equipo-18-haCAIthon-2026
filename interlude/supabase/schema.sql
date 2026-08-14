-- Interlude: esquema inicial
-- Pegar completo en el editor SQL de Supabase. Correr antes que seed.sql.
--
-- Nota sobre idioma: los nombres de tablas y columnas van en español, pero los
-- VALORES que llegan desde el agente de voz (Cami) están en inglés, porque su
-- system prompt define ese vocabulario y no lo modificamos desde acá.

create table if not exists cesfams (
  id text primary key,
  nombre text not null,
  comuna text not null
);

create table if not exists pacientes (
  id text primary key,
  cesfam_id text not null references cesfams (id),
  edad int not null,
  sexo text not null,
  patologias text[] not null default '{}',
  riesgo text not null check (riesgo in ('alto', 'moderado', 'bajo')),
  fase text not null check (fase in ('compensado', 'en_compensacion')),
  ultimo_control date,
  proximo_control date,
  telefono_hash text,
  -- Flag de ficha: el paciente tiene un contacto de emergencia o cuidador
  -- registrado. Distinto de third_party_authorized, que Cami confirma llamada
  -- por llamada y vive dentro de respuestas.
  contacto_emergencia boolean not null default false
);

-- Una fila por conversación. La escribe ElevenLabs (Cami) directamente contra
-- la API REST de Supabase, con una sola escritura al terminar la llamada.
--
-- Las restricciones son laxas a propósito: si el agente manda algo inesperado,
-- preferimos guardar la fila igual antes que perder la conversación completa.
-- La normalización de valores y el cálculo de tags ocurren al leer, en el panel.
create table if not exists llamadas (
  id serial primary key,
  -- Nullable a propósito: si el patient_id no viajó bien como variable
  -- dinámica, la llamada se guarda igual y queda huérfana, visible en el panel.
  paciente_id text references pacientes (id),
  -- call_id de ElevenLabs. Unique para que sirva de clave de idempotencia si
  -- el agente reintenta la escritura.
  conversation_id text unique,
  -- Valor crudo de call_status de Cami: 'completed' | 'incomplete'. Sin CHECK,
  -- porque el vocabulario lo define el system prompt del agente, no nosotros.
  estado text,
  -- Objeto completo de la sección 45 del prompt de Cami: symptoms,
  -- blood_pressure, medications, lifestyle, follow_up, emergency, priority,
  -- next_best_action y summary_for_tens.
  --
  -- priority y next_best_action vienen del LLM y son SOLO REFERENCIA: no se
  -- usan para ordenar el panel. Los tags salen de reglas deterministas propias
  -- aplicadas sobre los campos crudos.
  respuestas jsonb,
  transcripcion text,
  creado_en timestamptz not null default now()
);

-- Registro de lo que el equipo de salud hizo con un caso. Puede colgar de una
-- llamada o directamente de un paciente: alguien sin llamadas registradas
-- igual necesita poder recibir una acción.
create table if not exists acciones (
  id serial primary key,
  llamada_id int references llamadas (id),
  paciente_id text references pacientes (id),
  tipo text not null check (tipo in ('llamado', 'agendado', 'sin_accion')),
  nota text,
  creado_en timestamptz not null default now(),
  constraint acciones_referencia_check check (
    llamada_id is not null or paciente_id is not null
  )
);

create index if not exists idx_llamadas_paciente_id on llamadas (paciente_id);
create index if not exists idx_llamadas_creado_en on llamadas (creado_en desc);
create index if not exists idx_pacientes_cesfam_id on pacientes (cesfam_id);
create index if not exists idx_acciones_llamada_id on acciones (llamada_id);
create index if not exists idx_acciones_paciente_id on acciones (paciente_id);

-- ---------------------------------------------------------------------------
-- Row Level Security
--
-- El panel es abierto por diseño (sin autenticación), así que la anon key
-- necesita poder LEER todo. Pero esa key viaja al navegador vía NEXT_PUBLIC_,
-- o sea que es pública: no puede tener permiso de escribir ni borrar, o
-- cualquiera podría vaciar la base.
--
-- Por eso: anon solo lee. Todas las escrituras van con la service role key,
-- que nunca llega al cliente:
--   - ElevenLabs inserta en llamadas desde la config de su tool (server-side).
--   - El panel registra acciones desde el servidor, con supabaseAdmin.
-- La service role key salta RLS, así que no necesita políticas.
--
-- El editor SQL del dashboard también salta RLS, por lo que seed.sql corre
-- sin problemas después de esto.
-- ---------------------------------------------------------------------------

alter table cesfams enable row level security;
alter table pacientes enable row level security;
alter table llamadas enable row level security;
alter table acciones enable row level security;

drop policy if exists "lectura publica cesfams" on cesfams;
drop policy if exists "lectura publica pacientes" on pacientes;
drop policy if exists "lectura publica llamadas" on llamadas;
drop policy if exists "lectura publica acciones" on acciones;

create policy "lectura publica cesfams"   on cesfams   for select to anon using (true);
create policy "lectura publica pacientes" on pacientes for select to anon using (true);
create policy "lectura publica llamadas"  on llamadas  for select to anon using (true);
create policy "lectura publica acciones"  on acciones  for select to anon using (true);

-- Realtime en llamadas. Opcional: el panel funciona recargando la página.
-- Va dentro de un guard porque "add table" falla si la tabla ya es miembro de
-- la publicación, y este archivo se re-corre durante el desarrollo.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'llamadas'
  ) then
    alter publication supabase_realtime add table llamadas;
  end if;
end $$;
