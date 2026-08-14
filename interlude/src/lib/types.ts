export type Riesgo = "alto" | "moderado" | "bajo";
export type Fase = "compensado" | "en_compensacion";
export type EstadoLlamada = "completada" | "no_contesta" | "cortada";
export type TipoAccion = "llamado" | "agendado" | "sin_accion";

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
  ultima_llamada: string | null;
  telefono_hash: string | null;
  contacto_emergencia: boolean;
};

export type Llamada = {
  id: number;
  paciente_id: string;
  conversation_id: string | null;
  estado: EstadoLlamada;
  intentos: number;
  respuestas: Record<string, unknown> | null;
  tags: string[] | null;
  transcripcion: string | null;
  creado_en: string;
};

export type Accion = {
  id: number;
  llamada_id: number;
  tipo: TipoAccion;
  nota: string | null;
  creado_en: string;
};
