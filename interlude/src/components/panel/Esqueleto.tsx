import { C, LATERAL, TARJETA } from "./estilos";

const NAV = ["Cola de hoy", "Pacientes", "Llamadas", "Gestiones", "Calidad de datos"];

/** Shell del panel mientras se consulta Supabase. Misma silueta, sin datos. */
export function Esqueleto() {
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <aside
        style={{
          width: 236,
          flex: "none",
          background: LATERAL.fondo,
          color: LATERAL.texto,
          display: "flex",
          flexDirection: "column",
          padding: "20px 0 16px",
        }}
      >
        <div style={{ padding: "0 20px 16px", borderBottom: "1px solid #31413515" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#ffffff", letterSpacing: "-0.01em" }}>
            PreventAI
          </div>
          <div style={{ fontSize: "11.5px", color: LATERAL.sutil, marginTop: 2 }}>
            Panel PSCV · seguimiento telefónico
          </div>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 2, padding: 12, flex: 1 }}>
          {NAV.map((label, i) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
                padding: "8px 10px",
                borderRadius: 6,
                fontSize: 13,
                fontWeight: i === 0 ? 600 : 400,
                color: i === 0 ? "#ffffff" : LATERAL.item,
                background: i === 0 ? C.verde : "transparent",
              }}
            >
              <span>{label}</span>
              <span
                style={{
                  fontFamily: "var(--font-plex-mono), monospace",
                  fontSize: 11,
                  color: LATERAL.sutil,
                  background: LATERAL.campo,
                  borderRadius: 10,
                  padding: "1px 7px",
                }}
              >
                …
              </span>
            </div>
          ))}
        </nav>
      </aside>

      <main style={{ flex: 1, overflowY: "auto", padding: "26px 32px 72px", minWidth: 0 }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <h1 style={{ margin: 0, fontSize: 19, fontWeight: 700, letterSpacing: "-0.01em" }}>
            Cola de seguimiento — hoy
          </h1>
          <div style={{ fontSize: "12.5px", color: C.tenue, marginTop: 5 }}>
            Consultando Supabase…
          </div>

          <div style={{ ...TARJETA, marginTop: 18 }}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="pscv-esqueleto"
                style={{
                  display: "grid",
                  gridTemplateColumns: "110px 190px 1fr 180px",
                  gap: 16,
                  padding: "16px 20px",
                  borderTop: `1px solid ${C.bordeSuave}`,
                }}
              >
                <Barra ancho="70px" />
                <Barra ancho="130px" />
                <Barra ancho="75%" />
                <Barra ancho="100px" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function Barra({ ancho }: { ancho: string }) {
  return <div style={{ height: 12, borderRadius: 4, background: "#e4eae3", width: ancho }} />;
}
