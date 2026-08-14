-- Interlude: función que recibe la llamada desde ElevenLabs
-- Correr en el editor SQL de Supabase, después de schema.sql.
-- Se puede re-correr sin problema (create or replace).
--
-- POR QUÉ EXISTE
-- La UI de ElevenLabs obliga a declarar a mano cada propiedad anidada de un
-- body parameter de tipo object, y el objeto final de Cami tiene ~30 campos
-- anidados. La alternativa (mandar respuestas como string a /rest/v1/llamadas)
-- devuelve HTTP 201 pero guarda el JSON como texto plano dentro del jsonb:
-- queda inconsultable y una emergencia se vuelve invisible en el panel, sin
-- ningún error. Verificado contra la base el 2026-08-14.
--
-- Con esta función el agente manda 5 parámetros planos de tipo string y es
-- Postgres quien parsea el JSON, de forma explícita y controlada.
--
-- Se invoca por POST a /rest/v1/rpc/guardar_llamada

create or replace function guardar_llamada(
  p_conversation_id text default null,
  p_paciente_id text default null,
  p_estado text default null,
  p_transcripcion text default null,
  p_respuestas text default null
)
returns jsonb
language plpgsql
as $$
declare
  v_respuestas jsonb;
  v_paciente_id text;
  v_json_valido boolean := true;
  v_paciente_ok boolean := true;
  v_id int;
begin
  -- 1. Parseo del JSON.
  -- Si viene malformado NO perdemos la llamada: guardamos el texto crudo
  -- marcado, para poder recuperarlo a mano después.
  if p_respuestas is null then
    v_respuestas := null;
  else
    begin
      v_respuestas := p_respuestas::jsonb;
      -- JSON válido pero que no es un objeto (un string suelto, un número)
      -- tampoco sirve: se trata igual que un error de parseo.
      if jsonb_typeof(v_respuestas) <> 'object' then
        v_json_valido := false;
        v_respuestas := jsonb_build_object('_parse_error', true, '_raw', p_respuestas);
      end if;
    exception when others then
      v_json_valido := false;
      v_respuestas := jsonb_build_object('_parse_error', true, '_raw', p_respuestas);
    end;
  end if;

  -- 2. Paciente inexistente.
  -- El FK rechazaría la fila completa y perderíamos la conversación. Preferimos
  -- guardarla huérfana, dejando anotado el id que llegó para reasignarla.
  v_paciente_id := p_paciente_id;
  if p_paciente_id is not null
     and not exists (select 1 from pacientes where pacientes.id = p_paciente_id) then
    v_paciente_ok := false;
    v_paciente_id := null;
    v_respuestas := coalesce(v_respuestas, '{}'::jsonb)
                    || jsonb_build_object('_paciente_id_desconocido', p_paciente_id);
  end if;

  -- 3. Insert idempotente: si el agente reintenta con el mismo conversation_id,
  -- se actualiza la fila en vez de fallar por clave duplicada.
  insert into llamadas (paciente_id, conversation_id, estado, transcripcion, respuestas)
  values (v_paciente_id, p_conversation_id, p_estado, p_transcripcion, v_respuestas)
  on conflict (conversation_id) do update
    set paciente_id   = excluded.paciente_id,
        estado        = excluded.estado,
        transcripcion = excluded.transcripcion,
        respuestas    = excluded.respuestas
  returning llamadas.id into v_id;

  return jsonb_build_object(
    'id', v_id,
    'json_valido', v_json_valido,
    'paciente_encontrado', v_paciente_ok
  );
end;
$$;

-- Permisos: solo la service role key puede invocarla.
-- Postgres otorga EXECUTE a PUBLIC por defecto en funciones nuevas, lo que
-- abriría una vía de escritura para la anon key (que es pública y viaja al
-- navegador) y rompería el modelo de "anon solo lee". Por eso se revoca.
revoke all on function guardar_llamada(text, text, text, text, text) from public;
revoke all on function guardar_llamada(text, text, text, text, text) from anon;
revoke all on function guardar_llamada(text, text, text, text, text) from authenticated;
grant execute on function guardar_llamada(text, text, text, text, text) to service_role;
