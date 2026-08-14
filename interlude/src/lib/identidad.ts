/**
 * Identidad de presentación del paciente.
 *
 * La base NO guarda nombres a propósito: los pacientes viven identificados por
 * su id sintético (P-01, P-02…). Pero una lista de códigos no se lee como una
 * lista de personas, así que acá se deriva un nombre de fantasía a partir del
 * id.
 *
 * La derivación es determinista: el mismo id da siempre el mismo nombre, en el
 * servidor y en el cliente (nada de Math.random, que rompería la hidratación).
 * Nada de esto se persiste ni sirve para buscar: es puro rótulo de pantalla y
 * no corresponde a ninguna persona.
 */

const NOMBRES_H = [
  "Luis",
  "Juan",
  "Carlos",
  "José",
  "Manuel",
  "Pedro",
  "Jorge",
  "Sergio",
  "Héctor",
  "Ramón",
  "Óscar",
  "Patricio",
  "Nelson",
  "Hernán",
  "Guillermo",
  "Rodrigo",
];

const NOMBRES_M = [
  "María",
  "Rosa",
  "Carmen",
  "Ana",
  "Gladys",
  "Patricia",
  "Marta",
  "Elena",
  "Sonia",
  "Verónica",
  "Julia",
  "Norma",
  "Teresa",
  "Ximena",
  "Isabel",
  "Silvia",
];

const APELLIDOS = [
  "González",
  "Muñoz",
  "Rojas",
  "Díaz",
  "Pérez",
  "Soto",
  "Contreras",
  "Silva",
  "Martínez",
  "Sepúlveda",
  "Morales",
  "Araya",
  "Fuentes",
  "Espinoza",
  "Vergara",
  "Torres",
  "Castillo",
  "Reyes",
  "Riquelme",
  "Bravo",
];

/** FNV-1a de 32 bits con semilla, para sacar índices estables desde el id. */
function hash(texto: string, semilla: number): number {
  let h = (0x811c9dc5 ^ semilla) >>> 0;
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/** Sexo tal como viene de la base ('M' | 'F') normalizado a su inicial. */
function inicialSexo(sexo: string): string {
  return (sexo ?? "").trim().charAt(0).toUpperCase();
}

/**
 * Nombre de fantasía del paciente. Placeholder de demo, no un dato clínico:
 * se deriva del id y concuerda con el sexo registrado.
 */
export function nombrePaciente(paciente: { id: string; sexo: string }): string {
  const pila = inicialSexo(paciente.sexo) === "F" ? NOMBRES_M : NOMBRES_H;
  const nombre = pila[hash(paciente.id, 0) % pila.length];
  const apellido = APELLIDOS[hash(paciente.id, 7) % APELLIDOS.length];
  const segundo = APELLIDOS[hash(paciente.id, 31) % APELLIDOS.length];
  return `${nombre} ${apellido} ${segundo}`;
}

/** Versión corta para tablas: 'Luis Rojas'. */
export function nombreCorto(paciente: { id: string; sexo: string }): string {
  const [nombre, apellido] = nombrePaciente(paciente).split(" ");
  return `${nombre} ${apellido}`;
}

/**
 * Etiqueta de sexo para pantalla. La base guarda 'M'/'F' (male/female), pero en
 * español el TENS lee H (hombre) y M (mujer): mostrar 'M' para masculino se
 * confunde con mujer. Un valor fuera de la tabla se muestra crudo.
 */
export function etiquetaSexo(sexo: string): string {
  const inicial = inicialSexo(sexo);
  if (inicial === "F") return "M";
  if (inicial === "M") return "H";
  return sexo || "—";
}

/** 'Hombre' | 'Mujer' para la ficha, donde sí hay espacio. */
export function sexoLargo(sexo: string): string {
  const inicial = inicialSexo(sexo);
  if (inicial === "F") return "Mujer";
  if (inicial === "M") return "Hombre";
  return sexo || "—";
}
