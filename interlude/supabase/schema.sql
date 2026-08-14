-- Interlude: esquema inicial
-- Pegar completo en el editor SQL de Supabase.

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
  ultima_llamada timestamptz,
  telefono_hash text,
  contacto_emergencia boolean not null default false
);

create table if not exists llamadas (
  id serial primary key,
  paciente_id text not null references pacientes (id),
  conversation_id text unique,
  estado text not null check (estado in ('completada', 'no_contesta', 'cortada')),
  intentos int not null default 1,
  respuestas jsonb,
  tags text[],
  transcripcion text,
  creado_en timestamptz not null default now()
);

create table if not exists acciones (
  id serial primary key,
  llamada_id int not null references llamadas (id),
  tipo text not null check (tipo in ('llamado', 'agendado', 'sin_accion')),
  nota text,
  creado_en timestamptz not null default now()
);

create index if not exists idx_llamadas_paciente_id on llamadas (paciente_id);
create index if not exists idx_llamadas_creado_en on llamadas (creado_en);
create index if not exists idx_pacientes_cesfam_id on pacientes (cesfam_id);

-- Realtime: permite que el panel escuche INSERT/UPDATE en llamadas.
alter publication supabase_realtime add table llamadas;
