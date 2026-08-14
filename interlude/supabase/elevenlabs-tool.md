# Configuración del tool de ElevenLabs que escribe en Supabase

Cami escribe **una sola vez, al terminar la llamada**, directo contra la API
REST de Supabase. No hay backend nuestro en el medio.

Configuración verificada con un POST real contra la base el 2026-08-14
(HTTP 201, jsonb anidado guardado correctamente).

## No hay que pasarle el schema a ElevenLabs

No pegues `schema.sql` en ningún lado. Lo único que ElevenLabs necesita saber
son los **5 campos** del body, que deben llamarse igual que las columnas de la
tabla `llamadas`. Eso se define en la sección "Body Parameters" del tool.

## Dónde

Panel de ElevenLabs → tu agente → sección **Agent** → **Add Tool** →
tipo **Webhook**.

## Campos

| Campo | Valor |
|---|---|
| Name | `guardar_llamada` |
| Method | `POST` |
| URL | `https://snwvolboghgfmiyilupm.supabase.co/rest/v1/llamadas` |

**Description** (esto es lo que hace que el LLM decida llamarlo, así que
importa):

> Guarda el registro completo de la llamada en la base de datos del CESFAM.
> Llamar exactamente una vez, al final de la conversación, con el objeto JSON
> final completo. Si la llamada termina por emergencia, llamar igual antes de
> cortar.

## Headers

| Header | Tipo | Valor |
|---|---|---|
| `apikey` | Secret | la service role key (`sb_secret_...`) |
| `Authorization` | Secret | `Bearer sb_secret_...` |
| `Content-Type` | Value | `application/json` |
| `Prefer` | Value | `return=minimal` |

Los dos primeros van como **Secret**, no como Value, para que no queden
visibles en la config. `Prefer: return=minimal` evita que Supabase devuelva la
fila insertada al agente, que no la necesita.

Va la **service role key**, no la anon: con RLS activo la anon key solo puede
leer. Vive server-side en la config de ElevenLabs, nunca llega al navegador.

## Body Parameters

| Parámetro | Tipo | Origen | Descripción para el LLM |
|---|---|---|---|
| `paciente_id` | string | **variable dinámica**, no el LLM | ID del paciente |
| `conversation_id` | string | LLM | El call_id de esta conversación |
| `estado` | string | LLM | `completed` o `incomplete` |
| `transcripcion` | string | LLM | Transcripción de la conversación |
| `respuestas` | **object** | LLM | Objeto final completo de la sección 45 del system prompt |

### `paciente_id` va por variable dinámica

No dejes que el LLM lo invente: se pasa como dynamic variable desde el cliente
al iniciar la conversación, y en el body param se referencia como
`{{patient_id}}`. Si llega vacío la fila igual se guarda (la columna es
nullable a propósito), pero queda huérfana y hay que reasignarla a mano.

### `respuestas` DEBE ser tipo object

Es el error más peligroso de esta configuración. Si se define como `string` y
el agente manda el JSON serializado, **el insert devuelve HTTP 201 igual**,
parece que funcionó, pero el contenido queda como texto plano dentro del
jsonb y deja de ser consultable.

Verificado contra la base: con `respuestas` como string, la consulta de
`emergency.active` devuelve `null` en vez de `true`. O sea, **una emergencia
real quedaría invisible en el panel y nadie se enteraría**. Si algo se ve raro
en el panel, esto es lo primero que hay que revisar.

Sus sub-campos siguen la estructura de `RespuestasCami` en `src/lib/types.ts`:
`emergency`, `symptoms`, `blood_pressure`, `medications`, `lifestyle`,
`follow_up`, `priority`, `next_best_action`, `summary_for_tens`.

## Body de ejemplo

Esta es la forma exacta que se probó con éxito:

```json
{
  "paciente_id": "P-03",
  "conversation_id": "conv_8fk20dhs71ma",
  "estado": "completed",
  "transcripcion": "Cami: Buenos días...",
  "respuestas": {
    "call_id": "conv_8fk20dhs71ma",
    "patient_id": "P-03",
    "call_status": "completed",
    "emergency": {"active": false, "type": null, "requires_immediate_escalation": false},
    "symptoms": {"chest_pain_past_week": false, "chest_pain_current": null},
    "medications": {"taking_as_prescribed": true, "medication_issue": null},
    "priority": {"level": "LOW", "reason": []},
    "summary_for_tens": "Test row."
  }
}
```

## Cómo probar que quedó bien

Después de una llamada de prueba, revisar que el jsonb sea consultable:

```
GET /rest/v1/llamadas?select=conversation_id,respuestas->emergency->>active&order=id.desc&limit=1
```

Si la columna `active` sale con valor, quedó bien. Si sale `null` habiendo
mandado datos, `respuestas` se está enviando como string.

## Si el agente no llama al tool de forma confiable

El system prompt de Cami ya contempla adaptarse al nombre real de la
integración (sección 9) y ya produce el objeto final (sección 45), así que la
descripción del tool debería bastar. Si igual falla, agregar **una** línea al
prompt nombrando el tool explícitamente, sin reescribir el resto.
