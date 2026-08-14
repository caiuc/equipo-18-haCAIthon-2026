export type Riesgo = "alto" | "moderado" | "bajo";
export type Fase = "compensado" | "en_compensacion";
export type TipoAccion = "llamado" | "agendado" | "sin_accion";

/**
 * Valores que manda Cami en llamadas.estado. Vienen en inglés porque los
 * define su system prompt. La columna no tiene CHECK: si llega algo fuera de
 * esta lista igual se guarda, y acá se trata como desconocido.
 */
export type EstadoLlamada = "completed" | "incomplete";

export type Cesfam = {
  id: string;
  nombre: string;
  comuna: string;
};

export type Paciente = {
  id: string;
  cesfam_id: string;
  edad: number;
  sexo: string;
  patologias: string[];
  riesgo: Riesgo;
  fase: Fase;
  ultimo_control: string | null;
  proximo_control: string | null;
  telefono_hash: string | null;
  contacto_emergencia: boolean;
};

/** true = confirmó que sí, false = confirmó que no, null = no se pudo determinar. */
type Respuesta = boolean | null;

export type TipoEmergencia =
  | "CURRENT_CHEST_PAIN"
  | "CURRENT_SEVERE_SHORTNESS_OF_BREATH"
  | "CURRENT_NEUROLOGIC_WARNING_SIGNS";

export type ProblemaMedicamento =
  | "FORGETTING"
  | "SIDE_EFFECT_CONCERN"
  | "MEDICATION_UNAVAILABLE"
  | "DIFFICULTY_PICKING_UP"
  | "FINANCIAL_BARRIER"
  | "TRANSPORTATION_BARRIER"
  | "CONFUSION"
  | "SELF_DISCONTINUATION"
  | "OTHER";

/**
 * Objeto final que entrega Cami al terminar la llamada, guardado tal cual en
 * llamadas.respuestas.
 *
 * priority y next_best_action los produce el LLM: son solo referencia y no se
 * usan para ordenar el panel. Los tags salen de reglas deterministas propias
 * aplicadas sobre los campos crudos de symptoms, blood_pressure, medications y
 * follow_up.
 *
 * Todos los campos son opcionales porque nada valida el payload en el borde:
 * preferimos guardar una llamada incompleta antes que perderla.
 */
export type RespuestasCami = {
  call_id?: string;
  patient_id?: string;
  started_at?: string;
  completed_at?: string;
  call_completed?: boolean;
  call_status?: EstadoLlamada;
  call_incomplete_reason?: string | null;
  contact_type?: "patient" | "third_party" | null;
  third_party_authorized?: Respuesta;

  emergency?: {
    active?: boolean;
    type?: TipoEmergencia | null;
    requires_immediate_escalation?: boolean;
  };

  symptoms?: {
    chest_pain_past_week?: Respuesta;
    chest_pain_current?: Respuesta;
    shortness_of_breath_past_week?: Respuesta;
    shortness_of_breath_current?: Respuesta;
    palpitations_past_week?: Respuesta;
    palpitations_current?: Respuesta;
    dizziness_past_week?: Respuesta;
    fainting_past_week?: Respuesta;
    neurologic_warning_signs_current?: Respuesta;
    overall_health_worsening?: Respuesta;
    new_health_problem?: Respuesta;
    new_health_problem_detail?: string | null;
  };

  blood_pressure?: {
    has_home_monitor?: Respuesta;
    measured_last_7_days?: Respuesta;
    /** Valor textual tal como lo reportó el paciente, ej. "158/92 mmHg". */
    latest_reported_value?: string | null;
    reported_high_values?: Respuesta;
  };

  medications?: {
    taking_as_prescribed?: Respuesta;
    difficulty_getting_medications?: Respuesta;
    medication_issue?: ProblemaMedicamento | null;
    medication_issue_detail?: string | null;
  };

  lifestyle?: {
    smoked_last_7_days?: Respuesta;
  };

  follow_up?: {
    recent_cholesterol_test?: Respuesta;
    pending_appointment_or_test?: Respuesta;
    pending_appointment_or_test_detail?: string | null;
  };

  /** Sugerido por el LLM. Solo referencia, no ordena el panel. */
  priority?: {
    level?: "EMERGENCY" | "HIGH" | "MEDIUM" | "LOW" | "PENDING";
    reason?: string[];
  };
  /** Sugerido por el LLM. Solo referencia. */
  next_best_action?: string | null;
  summary_for_tens?: string | null;
};

export type Llamada = {
  id: number;
  /** Null si el patient_id no viajó bien desde el cliente. */
  paciente_id: string | null;
  /** call_id de ElevenLabs. */
  conversation_id: string | null;
  estado: EstadoLlamada | string | null;
  respuestas: RespuestasCami | null;
  transcripcion: string | null;
  creado_en: string;
};

export type Accion = {
  id: number;
  /** Una acción cuelga de una llamada o de un paciente. Al menos una de las dos. */
  llamada_id: number | null;
  paciente_id: string | null;
  tipo: TipoAccion;
  nota: string | null;
  creado_en: string;
};
