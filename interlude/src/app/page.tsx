import { Panel } from "@/components/panel/Panel";
import { cargarDatosPanel } from "@/lib/datos";

// Sin caché: recargar la página vuelve a consultar Supabase.
export const dynamic = "force-dynamic";

export default async function Home() {
  const datos = await cargarDatosPanel();

  // El "hoy" lo fija el servidor y viaja al cliente: así los días sin contacto
  // se calculan igual en ambos lados y no hay mismatch de hidratación.
  return <Panel datos={datos} hoyISO={new Date().toISOString()} />;
}
