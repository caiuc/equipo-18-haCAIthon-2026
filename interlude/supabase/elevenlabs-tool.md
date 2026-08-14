# Configuración del tool de ElevenLabs que escribe en Supabase

Cami escribe **una sola vez, al terminar la llamada**, contra la API REST de
Supabase. No hay backend nuestro en el medio.

El agente NO inserta directo en la tabla: invoca la función `guardar_llamada`
(ver `funcion-guardar-llamada.sql`).

## Por qué vía función y no directo a la tabla

La UI de ElevenLabs obliga a declarar a mano cada propiedad anidada de un
parámetro de tipo `object`, y el objeto final de Cami tiene ~30 campos
anidados: inmanejable.

La salida obvia es mandar `respuestas` como string, pero eso está **roto de
forma silenciosa**. Verificado contra la base el 2026-08-14: un POST a
`/rest/v1/llamadas` con `respuestas` serializado devuelve **HTTP 201**, se ve
exitoso, pero el JSON queda como texto plano dentro de la columna jsonb.

```
respuestas->priority->>level   -> null      (fila mandada como string)
respuestas->priority->>level   -> EMERGENCY (fila bien guardada)
```

O sea: una emergencia real quedaría invisible en el panel, sin ningún error.

Con la función, mandar `respuestas` como string es lo **correcto**, porque el
parseo lo hace Postgres de forma explícita y controlada.

## Requisito previo

Correr `funcion-guardar-llamada.sql` en el editor SQL de Supabase.

## Campos del tool

| Campo | Valor |
|---|---|
| Name | `guardar_llamada` |
| Method | `POST` |
| URL | `https://snwvolboghgfmiyilupm.supabase.co/rest/v1/rpc/guardar_llamada` |

Ojo con la URL: `/rest/v1/rpc/guardar_llamada`, **no** `/rest/v1/llamadas`.

**Description** (esto es lo que hace que el LLM decida invocarlo, así que
importa):

> Guarda el registro completo de la llamada en la base de datos del CESFAM.
> Llamar exactamente una vez, al final de la conversación. Si la llamada
> termina por una emergencia, llamar igual antes de cortar.

## Headers

| Header | Tipo | Valor |
|---|---|---|
| `apikey` | Secret | la service role key (`sb_secret_...`) |
| `Authorization` | Secret | `Bearer sb_secret_...` |

Ambos como **Secret**, no como Value. El Content-Type debe quedar en JSON,
que suele ser un selector propio del tool y no un header manual.

Va la **service role key**, no la anon: con RLS activo la anon key solo puede
leer, y la función tiene EXECUTE revocado para anon a propósito.

## Body Parameters

Los cinco son de tipo **string**. Sin objetos, sin anidamiento.

| Parámetro | Origen | Descripción para el LLM |
|---|---|---|
| `p_paciente_id` | **variable dinámica** `{{patient_id}}` | ID del paciente |
| `p_conversation_id` | LLM | El call_id de esta conversación |
| `p_estado` | LLM | `completed` o `incomplete` |
| `p_transcripcion` | LLM | Transcripción de la conversación |
| `p_respuestas` | LLM | El objeto JSON final completo de la sección 45 del system prompt, serializado como texto |

El prefijo `p_` es obligatorio: PostgREST mapea las claves del body a los
nombres de los argumentos de la función.

### `p_paciente_id` va por variable dinámica

No dejes que el LLM lo invente. Se pasa como dynamic variable desde el cliente
al iniciar la conversación. Si llega vacío o con un id inexistente, la llamada
**igual se guarda**: la función la deja huérfana y anota el id recibido en
`respuestas._paciente_id_desconocido` para poder reasignarla después.

## Respuesta de la función

Devuelve un objeto útil para depurar:

```json
{"id": 12, "json_valido": true, "paciente_encontrado": true}
```

- `json_valido: false` → el agente mandó algo que no era un objeto JSON. La
  fila se guardó igual, con el texto crudo en `respuestas._raw`.
- `paciente_encontrado: false` → el `p_paciente_id` no existe en `pacientes`.

## Cómo probar que quedó bien

Después de una llamada de prueba:

```
GET /rest/v1/llamadas?select=conversation_id,respuestas->priority->>level&order=id.desc&limit=1
```

Si sale el nivel, el jsonb quedó consultable. Si sale `null`, revisar
`respuestas->_parse_error`.

## Si el agente no invoca el tool de forma confiable

El system prompt de Cami ya contempla adaptarse al nombre real de la
integración (sección 9) y ya produce el objeto final (sección 45), así que la
descripción del tool debería bastar. Si igual falla, agregar **una** línea al
prompt nombrando el tool explícitamente, sin reescribir el resto.
