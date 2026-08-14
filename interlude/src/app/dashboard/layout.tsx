import type { Metadata } from 'next';
import { IBM_Plex_Mono, Public_Sans } from 'next/font/google';

const publicSans = Public_Sans({
  variable: '--fuente-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const plexMono = IBM_Plex_Mono({
  variable: '--fuente-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: 'Seguimiento PSCV · Interlude',
  description:
    'Información reportada por pacientes durante los chequeos telefónicos del Programa de Salud Cardiovascular.',
};

// Los hovers del diseño original venían como atributo `style-hover`; en React
// se resuelven con estas clases para no duplicar handlers en cada botón.
const HOVERS = `
.dash-raiz a { color: #147a4a; text-decoration: none; }
.dash-raiz a:hover { color: #0e5c37; text-decoration: underline; }
.dash-btn-primario:hover { background: #0e5c37; border-color: #0e5c37; }
.dash-btn-suave:hover { background: #eff9f2; }
`;

export default function DashboardLayout({ children }: LayoutProps<'/dashboard'>) {
  return (
    <div
      className={`dash-raiz ${publicSans.variable} ${plexMono.variable}`}
      style={{
        background: '#dff0e4',
        color: '#16302a',
        fontFamily: 'var(--fuente-sans), system-ui, -apple-system, "Segoe UI", Helvetica, sans-serif',
        minHeight: '100vh',
      }}
    >
      <style>{HOVERS}</style>
      {children}
    </div>
  );
}
