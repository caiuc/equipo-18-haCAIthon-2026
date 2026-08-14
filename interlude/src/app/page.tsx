import { supabase } from "@/lib/supabase/client";
import type { Paciente } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { data: pacientes, error } = await supabase
    .from("pacientes")
    .select("*")
    .order("id")
    .returns<Paciente[]>();

  return (
    <div className="min-h-screen bg-zinc-50 p-8 dark:bg-black">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Interlude — pacientes (verificación de conexión)
        </h1>
        <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
          Página temporal. Se reemplaza por el panel real en la próxima sesión.
        </p>

        {error && (
          <p className="rounded bg-red-100 p-4 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
            Error al consultar Supabase: {error.message}
          </p>
        )}

        {!error && (
          <div className="overflow-x-auto rounded border border-zinc-200 dark:border-zinc-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-100 dark:bg-zinc-900">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">CESFAM</th>
                  <th className="p-3">Edad</th>
                  <th className="p-3">Sexo</th>
                  <th className="p-3">Patologías</th>
                  <th className="p-3">Riesgo</th>
                  <th className="p-3">Fase</th>
                  <th className="p-3">Último control</th>
                </tr>
              </thead>
              <tbody>
                {pacientes?.map((paciente) => (
                  <tr
                    key={paciente.id}
                    className="border-t border-zinc-200 dark:border-zinc-800"
                  >
                    <td className="p-3 font-mono">{paciente.id}</td>
                    <td className="p-3">{paciente.cesfam_id}</td>
                    <td className="p-3">{paciente.edad}</td>
                    <td className="p-3">{paciente.sexo}</td>
                    <td className="p-3">{paciente.patologias.join(", ")}</td>
                    <td className="p-3">{paciente.riesgo}</td>
                    <td className="p-3">{paciente.fase}</td>
                    <td className="p-3">{paciente.ultimo_control}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {pacientes?.length === 0 && (
              <p className="p-4 text-sm text-zinc-500">Sin pacientes cargados.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
