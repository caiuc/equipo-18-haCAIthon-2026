/**
 * Datos placeholder del dashboard, tal como venían en el diseño importado.
 * 100% sintéticos. Se reemplazan por Supabase cuando exista la BBDD.
 */

export type Riesgo = 'Alto' | 'Medio' | 'Bajo';
export type EstadoContacto = 'cambios' | 'sinCambios' | 'sinRespuesta';
export type TipoActividad = 'medico' | 'tens' | 'auto';
export type EstadoLlamada = 'pendiente' | 'realizada' | 'noContesta';

export type PaletaRiesgo = {
  riesgoFondo: string;
  riesgoTexto: string;
  riesgoBorde: string;
  riesgoPunto: string;
  franja: string;
};

export type FilaComparacion = {
  campo: string;
  antes: string;
  ahora: string;
  estado: string;
  fondo: string;
  ahoraColor: string;
  ahoraPeso: number;
  tagFondo: string;
  tagTexto: string;
  tagBorde: string;
  tagPunto: string;
};

export type HitoTimeline = {
  fecha: string;
  tipo: string;
  detalle: string;
  punto: string;
  tituloColor: string;
  vinetas: string[];
};

export type Respuesta = { pregunta: string; respuesta: string; color: string };
export type MensajeTranscripcion = { quien: string; color: string; texto: string };

export type Paciente = PaletaRiesgo & {
  id: string;
  nombre: string;
  edad: number;
  riesgo: Riesgo;
  iniciales: string;
  estado: EstadoContacto;
  tensDias: number;
  autoOrden: number;
  cambios: string[];
  meta: string;
  ultimoMedico: string;
  ultimoTens: string;
  ultimoAuto: string;
  controlFecha: string;
  controlNota: string;
  tensFecha: string;
  tensNota: string;
  autoFecha: string;
  autoResultado: string;
  comparacion: FilaComparacion[];
  timeline: HitoTimeline[];
  chequeo: { duracion: string; preguntas: string; respuestas: Respuesta[] };
  transcripcion: MensajeTranscripcion[];
};

export const RIESGO: Record<Riesgo, PaletaRiesgo> = {
  Alto: {
    riesgoFondo: '#fdf1ef',
    riesgoTexto: '#9c3a2f',
    riesgoBorde: '#f2d6d0',
    riesgoPunto: '#b3453b',
    franja: '#c99a1e',
  },
  Medio: {
    riesgoFondo: '#fdf8ec',
    riesgoTexto: '#8a6a12',
    riesgoBorde: '#f0e3c4',
    riesgoPunto: '#c99a1e',
    franja: '#c99a1e',
  },
  Bajo: {
    riesgoFondo: '#e8f6ec',
    riesgoTexto: '#1c7a3f',
    riesgoBorde: '#bde3c9',
    riesgoPunto: '#3aa855',
    franja: '#c99a1e',
  },
};

export const ESTADOS: Record<
  EstadoContacto,
  { estadoLabel: string; estadoTexto: string; estadoPunto: string }
> = {
  cambios: { estadoLabel: 'Cambios reportados', estadoTexto: '#8a6a12', estadoPunto: '#c99a1e' },
  sinCambios: { estadoLabel: 'Sin cambios', estadoTexto: '#1c7a3f', estadoPunto: '#3aa855' },
  sinRespuesta: { estadoLabel: 'No respondió', estadoTexto: '#638074', estadoPunto: '#9dbaad' },
};

export const ESTADOS_LLAMADA: Record<
  EstadoLlamada,
  {
    llamadaLabel: string;
    llamadaFondo: string;
    llamadaTexto: string;
    llamadaBorde: string;
    llamadaPunto: string;
    franja: string;
  }
> = {
  pendiente: {
    llamadaLabel: 'Pendiente de llamada',
    llamadaFondo: '#f4fbf6',
    llamadaTexto: '#4a6b5f',
    llamadaBorde: '#e0efe4',
    llamadaPunto: '#9dbaad',
    franja: '#c99a1e',
  },
  realizada: {
    llamadaLabel: 'Llamada realizada',
    llamadaFondo: '#e8f6ec',
    llamadaTexto: '#1c7a3f',
    llamadaBorde: '#bde3c9',
    llamadaPunto: '#3aa855',
    franja: '#3aa855',
  },
  noContesta: {
    llamadaLabel: 'No contestó',
    llamadaFondo: '#fdf8ec',
    llamadaTexto: '#8a6a12',
    llamadaBorde: '#f0e3c4',
    llamadaPunto: '#c99a1e',
    franja: '#e0cfa0',
  },
};

export const SIGUIENTE_ESTADO_LLAMADA: Record<EstadoLlamada, EstadoLlamada> = {
  pendiente: 'realizada',
  realizada: 'noContesta',
  noContesta: 'pendiente',
};

const fila = (
  campo: string,
  antes: string,
  ahora: string,
  cambio: boolean,
): FilaComparacion =>
  cambio
    ? {
        campo,
        antes,
        ahora,
        estado: 'Cambio reportado',
        fondo: '#fffdf7',
        ahoraColor: '#1d3b31',
        ahoraPeso: 600,
        tagFondo: '#fdf8ec',
        tagTexto: '#8a6a12',
        tagBorde: '#f0e3c4',
        tagPunto: '#c99a1e',
      }
    : {
        campo,
        antes,
        ahora,
        estado: 'Sin cambios',
        fondo: '#fff',
        ahoraColor: '#4a6b5f',
        ahoraPeso: 400,
        tagFondo: '#eff9f2',
        tagTexto: '#4a6b5f',
        tagBorde: '#dcecdf',
        tagPunto: '#9dbaad',
      };

const hito = (
  fecha: string,
  tipo: string,
  detalle: string,
  clase: TipoActividad | 'cambio',
  vinetas: string[] = [],
): HitoTimeline => ({
  fecha,
  tipo,
  detalle,
  punto:
    clase === 'medico'
      ? '#0e5c37'
      : clase === 'tens'
        ? '#3aa855'
        : clase === 'cambio'
          ? '#c99a1e'
          : '#b6cdbf',
  tituloColor: clase === 'medico' ? '#0b4b2d' : clase === 'tens' ? '#1c7a3f' : '#16302a',
  vinetas,
});

type PacienteBase = Omit<Paciente, keyof PaletaRiesgo | 'meta'>;

const BASE: PacienteBase[] = [
  {
    id: 'maria',
    nombre: 'María González',
    edad: 72,
    riesgo: 'Alto',
    iniciales: 'MG',
    estado: 'cambios',
    tensDias: 22,
    autoOrden: 1,
    cambios: [
      'Refiere mayor cansancio durante la última semana.',
      'Le quedan aproximadamente 5 días de medicamentos.',
      'Reporta dos valores de presión superiores a lo habitual.',
    ],
    ultimoMedico: 'hace 4 meses',
    ultimoTens: 'hace 22 días',
    ultimoAuto: 'hoy',
    controlFecha: '12 abril 2026',
    controlNota: 'Próximo control agendado por el equipo médico.',
    tensFecha: '23 julio 2026',
    tensNota: 'Registrada como llamada completada.',
    autoFecha: '14 agosto 2026 · 09:42',
    autoResultado: 'Completado',
    comparacion: [
      fila('Estado general', 'Sin novedades', 'Refiere mayor cansancio', true),
      fila('Medicamentos', 'Suficientes', 'Aproximadamente 5 días restantes', true),
      fila('Presión', 'Sin novedades', 'Dos valores superiores a lo habitual', true),
      fila('Síntomas nuevos', 'Ninguno reportado', 'Ninguno reportado', false),
    ],
    timeline: [
      hito('12 ABR 2026', 'Control médico', 'Control presencial', 'medico'),
      hito('23 ABR 2026', 'Chequeo automático', 'Sin novedades', 'auto'),
      hito('10 MAY 2026', 'Chequeo automático', 'Sin novedades', 'auto'),
      hito('23 JUL 2026', 'Seguimiento TENS', 'Llamada realizada', 'tens'),
      hito('14 AGO 2026', 'Chequeo automático', 'Cambios reportados:', 'cambio', [
        'Mayor cansancio',
        'Medicamentos próximos a terminar',
        'Cambios en presión reportados',
      ]),
    ],
    chequeo: {
      duracion: '2 min 13 s',
      preguntas: '5 / 5',
      respuestas: [
        {
          pregunta: '¿Cómo se ha sentido durante las últimas semanas?',
          respuesta: 'Refiere mayor cansancio que lo habitual.',
          color: '#1d3b31',
        },
        {
          pregunta: '¿Ha notado cambios importantes en su estado general?',
          respuesta: 'Sí, se cansa al caminar distancias cortas.',
          color: '#1d3b31',
        },
        {
          pregunta: '¿Ha podido tomar sus medicamentos?',
          respuesta: 'Sí, todos los días.',
          color: '#1c7a3f',
        },
        {
          pregunta: '¿Dispone de medicamentos suficientes?',
          respuesta: 'Le quedan aproximadamente 5 días.',
          color: '#8a6a12',
        },
        {
          pregunta: '¿Ha controlado su presión? ¿Valores distintos a lo habitual?',
          respuesta: 'Dos mediciones más altas de lo habitual esta semana.',
          color: '#8a6a12',
        },
      ],
    },
    transcripcion: [
      {
        quien: 'CHEQUEO AUTOMÁTICO',
        color: '#8a6a12',
        texto:
          'Buenos días, doña María. Llamo del CESFAM Los Alerces para hacerle unas preguntas breves sobre cómo se ha sentido. No es una consulta médica.',
      },
      { quien: 'PACIENTE', color: '#0e5c37', texto: 'Sí, está bien.' },
      {
        quien: 'CHEQUEO AUTOMÁTICO',
        color: '#8a6a12',
        texto: '¿Cómo se ha sentido durante las últimas semanas?',
      },
      {
        quien: 'PACIENTE',
        color: '#0e5c37',
        texto: 'Más cansada que antes. Camino un poco y tengo que sentarme.',
      },
      {
        quien: 'CHEQUEO AUTOMÁTICO',
        color: '#8a6a12',
        texto: '¿Ha podido tomar sus medicamentos todos los días?',
      },
      {
        quien: 'PACIENTE',
        color: '#0e5c37',
        texto: 'Sí, todos los días, pero me quedan pocos, como para cinco días.',
      },
      {
        quien: 'CHEQUEO AUTOMÁTICO',
        color: '#8a6a12',
        texto: '¿Se ha tomado la presión? ¿Ha notado valores distintos a lo habitual?',
      },
      { quien: 'PACIENTE', color: '#0e5c37', texto: 'Dos veces me salió más alta que siempre.' },
      {
        quien: 'CHEQUEO AUTOMÁTICO',
        color: '#8a6a12',
        texto:
          'Gracias, doña María. Registré esta información para el equipo del CESFAM. Una persona del equipo podría llamarla para conversar.',
      },
    ],
  },
  {
    id: 'pedro',
    nombre: 'Pedro Soto',
    edad: 68,
    riesgo: 'Medio',
    iniciales: 'PS',
    estado: 'cambios',
    tensDias: 8,
    autoOrden: 0,
    cambios: ['Refiere nuevo malestar durante los últimos días.'],
    ultimoMedico: 'hace 2 meses',
    ultimoTens: 'hace 8 días',
    ultimoAuto: 'hace 1 hora',
    controlFecha: '9 junio 2026',
    controlNota: 'Control presencial dentro del programa.',
    tensFecha: '6 agosto 2026',
    tensNota: 'Registrada como llamada completada.',
    autoFecha: '14 agosto 2026 · 11:05',
    autoResultado: 'Completado',
    comparacion: [
      fila('Estado general', 'Sin novedades', 'Refiere nuevo malestar', true),
      fila('Medicamentos', 'Suficientes', 'Suficientes', false),
      fila('Presión', 'Sin novedades', 'Sin novedades', false),
      fila(
        'Síntomas nuevos',
        'Ninguno reportado',
        'Molestia en el pecho al esfuerzo, según refiere',
        true,
      ),
    ],
    timeline: [
      hito('9 JUN 2026', 'Control médico', 'Control presencial', 'medico'),
      hito('27 JUN 2026', 'Chequeo automático', 'Sin novedades', 'auto'),
      hito('21 JUL 2026', 'Chequeo automático', 'Sin novedades', 'auto'),
      hito('6 AGO 2026', 'Seguimiento TENS', 'Llamada realizada', 'tens'),
      hito('14 AGO 2026', 'Chequeo automático', 'Cambios reportados:', 'cambio', [
        'Nuevo malestar referido en los últimos días',
      ]),
    ],
    chequeo: {
      duracion: '1 min 48 s',
      preguntas: '5 / 5',
      respuestas: [
        {
          pregunta: '¿Cómo se ha sentido durante las últimas semanas?',
          respuesta: 'Refiere malestar nuevo en los últimos días.',
          color: '#1d3b31',
        },
        {
          pregunta: '¿Ha notado cambios importantes en su estado general?',
          respuesta: 'Sí, desde hace tres días.',
          color: '#1d3b31',
        },
        {
          pregunta: '¿Ha podido tomar sus medicamentos?',
          respuesta: 'Sí, sin olvidos.',
          color: '#1c7a3f',
        },
        {
          pregunta: '¿Dispone de medicamentos suficientes?',
          respuesta: 'Sí, retiró en farmacia hace dos semanas.',
          color: '#1c7a3f',
        },
        {
          pregunta: '¿Ha controlado su presión? ¿Valores distintos a lo habitual?',
          respuesta: 'Sin valores distintos a lo habitual.',
          color: '#1c7a3f',
        },
      ],
    },
    transcripcion: [
      {
        quien: 'CHEQUEO AUTOMÁTICO',
        color: '#8a6a12',
        texto:
          'Buenos días, don Pedro. Llamo del CESFAM Los Alerces con unas preguntas breves sobre cómo se ha sentido.',
      },
      { quien: 'PACIENTE', color: '#0e5c37', texto: 'Bueno.' },
      {
        quien: 'CHEQUEO AUTOMÁTICO',
        color: '#8a6a12',
        texto: '¿Cómo se ha sentido durante las últimas semanas?',
      },
      {
        quien: 'PACIENTE',
        color: '#0e5c37',
        texto: 'Bien, pero estos últimos días he andado con un malestar que no tenía antes.',
      },
      {
        quien: 'CHEQUEO AUTOMÁTICO',
        color: '#8a6a12',
        texto: '¿Ha podido tomar sus medicamentos y le quedan suficientes?',
      },
      {
        quien: 'PACIENTE',
        color: '#0e5c37',
        texto: 'Sí, los tomo todos los días y tengo para el mes.',
      },
      {
        quien: 'CHEQUEO AUTOMÁTICO',
        color: '#8a6a12',
        texto: 'Gracias, don Pedro. Dejé esta información registrada para el equipo del CESFAM.',
      },
    ],
  },
  {
    id: 'rosa',
    nombre: 'Rosa Muñoz',
    edad: 76,
    riesgo: 'Alto',
    iniciales: 'RM',
    estado: 'cambios',
    tensDias: 31,
    autoOrden: 2,
    cambios: [
      'Refiere haber quedado sin uno de sus medicamentos.',
      'Indica que no ha podido asistir a controlar su presión.',
    ],
    ultimoMedico: 'hace 5 meses',
    ultimoTens: 'hace 31 días',
    ultimoAuto: 'ayer',
    controlFecha: '6 marzo 2026',
    controlNota: 'Sin controles posteriores registrados.',
    tensFecha: '14 julio 2026',
    tensNota: 'Registrada como llamada completada.',
    autoFecha: '13 agosto 2026 · 16:20',
    autoResultado: 'Completado',
    comparacion: [
      fila('Estado general', 'Sin novedades', 'Sin novedades', false),
      fila('Medicamentos', 'Suficientes', 'Refiere haber quedado sin uno de ellos', true),
      fila('Presión', 'Controlada en domicilio', 'No ha podido controlarse', true),
      fila('Síntomas nuevos', 'Ninguno reportado', 'Ninguno reportado', false),
    ],
    timeline: [
      hito('6 MAR 2026', 'Control médico', 'Control presencial', 'medico'),
      hito('2 ABR 2026', 'Chequeo automático', 'Sin novedades', 'auto'),
      hito('14 JUL 2026', 'Seguimiento TENS', 'Llamada realizada', 'tens'),
      hito('13 AGO 2026', 'Chequeo automático', 'Cambios reportados:', 'cambio', [
        'Sin uno de sus medicamentos',
        'No ha controlado su presión',
      ]),
    ],
    chequeo: {
      duracion: '2 min 02 s',
      preguntas: '5 / 5',
      respuestas: [
        {
          pregunta: '¿Cómo se ha sentido durante las últimas semanas?',
          respuesta: 'Igual que siempre, sin novedades.',
          color: '#1c7a3f',
        },
        {
          pregunta: '¿Ha notado cambios importantes en su estado general?',
          respuesta: 'No.',
          color: '#1c7a3f',
        },
        {
          pregunta: '¿Ha podido tomar sus medicamentos?',
          respuesta: 'Uno lo dejó de tomar porque se le acabó.',
          color: '#8a6a12',
        },
        {
          pregunta: '¿Dispone de medicamentos suficientes?',
          respuesta: 'No para uno de ellos.',
          color: '#8a6a12',
        },
        {
          pregunta: '¿Ha controlado su presión?',
          respuesta: 'No ha podido ir a controlarse.',
          color: '#8a6a12',
        },
      ],
    },
    transcripcion: [
      {
        quien: 'CHEQUEO AUTOMÁTICO',
        color: '#8a6a12',
        texto: 'Buenas tardes, doña Rosa. Llamo del CESFAM Los Alerces con unas preguntas breves.',
      },
      { quien: 'PACIENTE', color: '#0e5c37', texto: 'Dígame.' },
      {
        quien: 'CHEQUEO AUTOMÁTICO',
        color: '#8a6a12',
        texto: '¿Ha podido tomar todos sus medicamentos?',
      },
      {
        quien: 'PACIENTE',
        color: '#0e5c37',
        texto: 'Uno se me acabó y no he podido ir a buscarlo.',
      },
      {
        quien: 'CHEQUEO AUTOMÁTICO',
        color: '#8a6a12',
        texto: 'Gracias, doña Rosa. Registré esta información para el equipo del CESFAM.',
      },
    ],
  },
  {
    id: 'luis',
    nombre: 'Luis Cárdenas',
    edad: 64,
    riesgo: 'Bajo',
    iniciales: 'LC',
    estado: 'cambios',
    tensDias: 5,
    autoOrden: 3,
    cambios: ['Refiere olvidos ocasionales de su medicamento de la tarde.'],
    ultimoMedico: 'hace 1 mes',
    ultimoTens: 'hace 5 días',
    ultimoAuto: 'hace 2 días',
    controlFecha: '10 julio 2026',
    controlNota: 'Control presencial dentro del programa.',
    tensFecha: '9 agosto 2026',
    tensNota: 'Registrada como llamada completada.',
    autoFecha: '12 agosto 2026 · 10:14',
    autoResultado: 'Completado',
    comparacion: [
      fila('Estado general', 'Sin novedades', 'Sin novedades', false),
      fila('Medicamentos', 'Toma diaria completa', 'Olvidos ocasionales en la tarde', true),
      fila('Presión', 'Sin novedades', 'Sin novedades', false),
      fila('Síntomas nuevos', 'Ninguno reportado', 'Ninguno reportado', false),
    ],
    timeline: [
      hito('10 JUL 2026', 'Control médico', 'Control presencial', 'medico'),
      hito('26 JUL 2026', 'Chequeo automático', 'Sin novedades', 'auto'),
      hito('9 AGO 2026', 'Seguimiento TENS', 'Llamada realizada', 'tens'),
      hito('12 AGO 2026', 'Chequeo automático', 'Cambios reportados:', 'cambio', [
        'Olvidos ocasionales del medicamento de la tarde',
      ]),
    ],
    chequeo: {
      duracion: '1 min 31 s',
      preguntas: '5 / 5',
      respuestas: [
        {
          pregunta: '¿Cómo se ha sentido durante las últimas semanas?',
          respuesta: 'Bien, sin molestias.',
          color: '#1c7a3f',
        },
        {
          pregunta: '¿Ha notado cambios importantes en su estado general?',
          respuesta: 'No.',
          color: '#1c7a3f',
        },
        {
          pregunta: '¿Ha podido tomar sus medicamentos?',
          respuesta: 'A veces olvida el de la tarde.',
          color: '#8a6a12',
        },
        { pregunta: '¿Dispone de medicamentos suficientes?', respuesta: 'Sí.', color: '#1c7a3f' },
        {
          pregunta: '¿Ha controlado su presión?',
          respuesta: 'Sí, valores habituales.',
          color: '#1c7a3f',
        },
      ],
    },
    transcripcion: [
      {
        quien: 'CHEQUEO AUTOMÁTICO',
        color: '#8a6a12',
        texto: 'Buenos días, don Luis. Llamo del CESFAM Los Alerces con unas preguntas breves.',
      },
      { quien: 'PACIENTE', color: '#0e5c37', texto: 'Sí, adelante.' },
      {
        quien: 'CHEQUEO AUTOMÁTICO',
        color: '#8a6a12',
        texto: '¿Ha podido tomar sus medicamentos todos los días?',
      },
      {
        quien: 'PACIENTE',
        color: '#0e5c37',
        texto: 'El de la mañana sí. El de la tarde a veces se me pasa.',
      },
      {
        quien: 'CHEQUEO AUTOMÁTICO',
        color: '#8a6a12',
        texto: 'Gracias, don Luis. Dejé esta información registrada para el equipo.',
      },
    ],
  },
];

export const PACIENTES: Paciente[] = BASE.map((p) => ({
  ...RIESGO[p.riesgo],
  ...p,
  meta: `${p.edad} años · PSCV · Riesgo ${p.riesgo.toLowerCase()}`,
}));

export type FilaRegistro = PaletaRiesgo & {
  id: string;
  nombre: string;
  edad: number;
  riesgo: Riesgo;
  iniciales: string;
  estado: EstadoContacto;
  estadoLabel: string;
  estadoTexto: string;
  estadoPunto: string;
  ultimoMedico: string;
  ultimoTens: string;
  ultimoAuto: string;
  rut: string;
  tieneFicha: boolean;
};

const RUTS: Record<string, string> = {
  maria: '6.482.771-5',
  pedro: '8.145.902-3',
  rosa: '5.877.410-2',
  luis: '9.663.128-K',
};

const EXTRA: Array<[string, number, Riesgo, EstadoContacto, string, string, string, string]> = [
  ['Carmen Vidal', 70, 'Medio', 'sinCambios', 'hace 3 meses', 'hace 12 días', 'hace 2 días', '9.412.556-7'],
  ['Jorge Peña', 61, 'Bajo', 'sinCambios', 'hace 2 meses', 'hace 19 días', 'ayer', '10.883.201-4'],
  ['Ana Torres', 79, 'Alto', 'sinRespuesta', 'hace 6 meses', 'hace 27 días', 'hace 1 día · sin respuesta', '5.204.778-9'],
  ['Héctor Rivas', 66, 'Medio', 'sinCambios', 'hace 1 mes', 'hace 9 días', 'hace 3 días', '8.771.043-2'],
  ['Gloria Sepúlveda', 74, 'Alto', 'sinRespuesta', 'hace 4 meses', 'hace 34 días', 'hace 2 días · sin respuesta', '6.339.812-K'],
  ['Manuel Fuentes', 69, 'Bajo', 'sinCambios', 'hace 2 meses', 'hace 15 días', 'hace 4 días', '9.008.664-1'],
  ['Elena Navarro', 73, 'Medio', 'sinCambios', 'hace 3 meses', 'hace 21 días', 'hoy', '7.556.190-3'],
  ['Óscar Bustos', 65, 'Bajo', 'sinRespuesta', 'hace 1 mes', 'hace 11 días', 'hoy · sin respuesta', '11.204.337-8'],
];

export const REGISTRO: FilaRegistro[] = [
  ...PACIENTES.map((p) => ({
    ...p,
    ...ESTADOS[p.estado],
    rut: RUTS[p.id],
    tieneFicha: true,
  })),
  ...EXTRA.map(([nombre, edad, riesgo, estado, ultimoMedico, ultimoTens, ultimoAuto, rut]) => ({
    ...RIESGO[riesgo],
    ...ESTADOS[estado],
    id: `x-${nombre}`,
    nombre,
    edad,
    riesgo,
    estado,
    ultimoMedico,
    ultimoTens,
    ultimoAuto,
    rut,
    tieneFicha: false,
    iniciales: nombre
      .split(' ')
      .map((palabra) => palabra[0])
      .join(''),
  })),
];

export type ItemJornada = {
  id: string;
  contexto: string;
  ultimoAuto: string;
  ultimoTens: string;
};

export const JORNADA: ItemJornada[] = [
  {
    id: 'maria',
    contexto:
      'Refiere mayor cansancio, medicamentos para ~5 días y dos valores de presión superiores a lo habitual.',
    ultimoAuto: 'hoy 09:42',
    ultimoTens: 'hace 22 días',
  },
  {
    id: 'rosa',
    contexto:
      'Refiere haber quedado sin uno de sus medicamentos y no haber podido controlar su presión.',
    ultimoAuto: 'ayer 16:20',
    ultimoTens: 'hace 31 días',
  },
  {
    id: 'pedro',
    contexto: 'Refiere nuevo malestar durante los últimos días.',
    ultimoAuto: 'hoy 11:05',
    ultimoTens: 'hace 8 días',
  },
  {
    id: 'luis',
    contexto: 'Refiere olvidos ocasionales del medicamento de la tarde.',
    ultimoAuto: 'hace 2 días',
    ultimoTens: 'hace 5 días',
  },
];

export const ESTADO_LLAMADA_INICIAL: Record<string, EstadoLlamada> = {
  maria: 'pendiente',
  rosa: 'pendiente',
  pedro: 'realizada',
  luis: 'noContesta',
};

export type RegistroHistorial = {
  fecha: string;
  tipo: string;
  clase: TipoActividad;
  paciente: string;
  detalle: string;
  resultado: string;
  punto: string;
  tipoColor: string;
  tagFondo: string;
  tagTexto: string;
  tagBorde: string;
};

const registro = (
  fecha: string,
  paciente: string,
  detalle: string,
  resultado: string,
  clase: TipoActividad,
): RegistroHistorial => ({
  fecha,
  paciente,
  detalle,
  resultado,
  clase,
  tipo:
    clase === 'medico'
      ? 'Control médico'
      : clase === 'tens'
        ? 'Seguimiento TENS'
        : 'Chequeo automático',
  punto: clase === 'medico' ? '#0e5c37' : clase === 'tens' ? '#3aa855' : '#c99a1e',
  tipoColor: clase === 'medico' ? '#0b4b2d' : clase === 'tens' ? '#1c7a3f' : '#8a6a12',
  ...(resultado === 'Cambios reportados'
    ? { tagFondo: '#fdf8ec', tagTexto: '#8a6a12', tagBorde: '#f0e3c4' }
    : resultado === 'Sin respuesta'
      ? { tagFondo: '#f4fbf6', tagTexto: '#638074', tagBorde: '#e0efe4' }
      : { tagFondo: '#e8f6ec', tagTexto: '#1c7a3f', tagBorde: '#bde3c9' }),
});

export const HISTORIAL: RegistroHistorial[] = [
  registro('14 AGO · 11:05', 'Pedro Soto', 'Refiere nuevo malestar durante los últimos días.', 'Cambios reportados', 'auto'),
  registro('14 AGO · 10:31', 'Elena Navarro', 'Sin novedades reportadas por la paciente.', 'Completado', 'auto'),
  registro('14 AGO · 09:42', 'María González', 'Cansancio, medicamentos próximos a terminar, presión sobre lo habitual.', 'Cambios reportados', 'auto'),
  registro('14 AGO · 09:10', 'Óscar Bustos', 'Sin contacto tras tres intentos.', 'Sin respuesta', 'auto'),
  registro('13 AGO · 16:20', 'Rosa Muñoz', 'Sin uno de sus medicamentos; no ha controlado presión.', 'Cambios reportados', 'auto'),
  registro('13 AGO · 12:04', 'Carmen Vidal', 'Llamada de seguimiento realizada por Camila Rodríguez.', 'Completado', 'tens'),
  registro('12 AGO · 10:14', 'Luis Cárdenas', 'Olvidos ocasionales del medicamento de la tarde.', 'Cambios reportados', 'auto'),
  registro('11 AGO · 15:38', 'Ana Torres', 'Sin contacto tras tres intentos.', 'Sin respuesta', 'auto'),
  registro('9 AGO · 11:20', 'Luis Cárdenas', 'Llamada de seguimiento realizada por Camila Rodríguez.', 'Completado', 'tens'),
  registro('6 AGO · 09:55', 'Pedro Soto', 'Llamada de seguimiento realizada por Camila Rodríguez.', 'Completado', 'tens'),
  registro('4 AGO · 08:30', 'Héctor Rivas', 'Control presencial en box 3, equipo médico.', 'Completado', 'medico'),
  registro('23 JUL · 10:15', 'María González', 'Llamada de seguimiento realizada por Camila Rodríguez.', 'Completado', 'tens'),
  registro('10 JUL · 08:45', 'Luis Cárdenas', 'Control presencial en box 1, equipo médico.', 'Completado', 'medico'),
];

/** Totales del resumen superior. Placeholder hasta conectar Supabase. */
export const RESUMEN = {
  contactados: 84,
  respondieron: 67,
  cambios: 18,
  sinRespuesta: 17,
} as const;
