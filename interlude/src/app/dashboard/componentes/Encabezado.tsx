export default function Encabezado() {
  return (
    <header
      style={{
        height: 66,
        flex: 'none',
        background: '#fff',
        borderBottom: '1px solid #e0efe4',
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        padding: '0 34px',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <div style={{ fontSize: 14.5, fontWeight: 600 }}>CESFAM Los Alerces</div>
        <div style={{ fontSize: 11.5, color: '#638074' }}>Programa de Salud Cardiovascular</div>
      </div>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 14 }}>
        <button
          type="button"
          className="dash-btn-suave"
          aria-label="Notificaciones"
          style={{
            position: 'relative',
            width: 34,
            height: 34,
            borderRadius: 12,
            border: '1px solid #e0efe4',
            background: '#fff',
            color: '#3f556e',
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          <span
            style={{
              display: 'block',
              width: 11,
              height: 11,
              border: '1.6px solid currentColor',
              borderRadius: '3px 3px 0 0',
              margin: '0 auto',
            }}
          />
          <span
            style={{
              position: 'absolute',
              top: 5,
              right: 5,
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: '#b3453b',
              border: '1.5px solid #fff',
            }}
          />
        </button>

        <div style={{ width: 1, height: 26, background: '#dcecdf' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#dcf2e2',
              color: '#147a4a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            CR
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Camila Rodríguez</div>
            <div style={{ fontSize: 11, color: '#638074', letterSpacing: '0.03em' }}>
              TENS · Seguimiento
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
