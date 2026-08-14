export type Pantalla = 'inicio' | 'ficha' | 'pacientes' | 'seguimientos' | 'historial';

/** Filtro por estado del último chequeo automático. */
export type FiltroEstado = 'todos' | 'cambios' | 'sinCambios' | 'sinRespuesta';

export type Orden = 'reciente' | 'tens' | 'cambios';

export type FiltroHistorial = 'todos' | 'medico' | 'tens' | 'auto';
