'use client';

import { useState } from 'react';
import BarraLateral from './componentes/BarraLateral';
import Encabezado from './componentes/Encabezado';
import VistaFicha from './componentes/VistaFicha';
import VistaHistorial from './componentes/VistaHistorial';
import VistaInicio from './componentes/VistaInicio';
import VistaPacientes from './componentes/VistaPacientes';
import VistaSeguimientos from './componentes/VistaSeguimientos';
import {
  ESTADO_LLAMADA_INICIAL,
  PACIENTES,
  SIGUIENTE_ESTADO_LLAMADA,
  type EstadoLlamada,
  type Riesgo,
} from './datos-demo';
import type { FiltroEstado, FiltroHistorial, Orden, Pantalla } from './tipos';

export default function DashboardPage() {
  const [pantalla, setPantalla] = useState<Pantalla>('inicio');
  const [pacienteId, setPacienteId] = useState<string>(PACIENTES[0].id);

  // Vista de información reciente.
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState<FiltroEstado>('cambios');
  const [orden, setOrden] = useState<Orden>('reciente');
  const [riesgos, setRiesgos] = useState<Riesgo[]>([]);
  const [filtroTens, setFiltroTens] = useState(false);

  // Ficha.
  const [mostrarTranscripcion, setMostrarTranscripcion] = useState(false);

  // Registro de pacientes.
  const [busquedaRegistro, setBusquedaRegistro] = useState('');
  const [filtroRegistro, setFiltroRegistro] = useState<FiltroEstado>('todos');

  // Jornada de seguimiento.
  const [estadosLlamada, setEstadosLlamada] =
    useState<Record<string, EstadoLlamada>>(ESTADO_LLAMADA_INICIAL);

  // Historial.
  const [filtroHistorial, setFiltroHistorial] = useState<FiltroHistorial>('todos');

  const abrirFicha = (id: string) => {
    setPacienteId(id);
    setMostrarTranscripcion(false);
    setPantalla('ficha');
  };

  const alternarRiesgo = (riesgo: Riesgo) =>
    setRiesgos((previos) =>
      previos.includes(riesgo) ? previos.filter((r) => r !== riesgo) : [...previos, riesgo],
    );

  const cambiarEstadoLlamada = (id: string) =>
    setEstadosLlamada((previos) => ({
      ...previos,
      [id]: SIGUIENTE_ESTADO_LLAMADA[previos[id] ?? 'pendiente'],
    }));

  const paciente = PACIENTES.find((p) => p.id === pacienteId) ?? PACIENTES[0];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'stretch' }}>
      <BarraLateral pantalla={pantalla} ir={setPantalla} />

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Encabezado />

        {pantalla === 'inicio' ? (
          <VistaInicio
            mostrarFlujo
            busqueda={busqueda}
            setBusqueda={setBusqueda}
            filtro={filtro}
            setFiltro={setFiltro}
            orden={orden}
            setOrden={setOrden}
            riesgos={riesgos}
            alternarRiesgo={alternarRiesgo}
            filtroTens={filtroTens}
            alternarFiltroTens={() => setFiltroTens((v) => !v)}
            abrirFicha={abrirFicha}
          />
        ) : null}

        {pantalla === 'ficha' ? (
          <VistaFicha
            paciente={paciente}
            mostrarTranscripcion={mostrarTranscripcion}
            alternarTranscripcion={() => setMostrarTranscripcion((v) => !v)}
            volver={() => setPantalla('inicio')}
          />
        ) : null}

        {pantalla === 'pacientes' ? (
          <VistaPacientes
            busqueda={busquedaRegistro}
            setBusqueda={setBusquedaRegistro}
            filtro={filtroRegistro}
            setFiltro={setFiltroRegistro}
            abrirFicha={abrirFicha}
          />
        ) : null}

        {pantalla === 'seguimientos' ? (
          <VistaSeguimientos
            estadosLlamada={estadosLlamada}
            cambiarEstado={cambiarEstadoLlamada}
            abrirFicha={abrirFicha}
          />
        ) : null}

        {pantalla === 'historial' ? (
          <VistaHistorial filtro={filtroHistorial} setFiltro={setFiltroHistorial} />
        ) : null}
      </div>
    </div>
  );
}
