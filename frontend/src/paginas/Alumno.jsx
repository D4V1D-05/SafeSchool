import { Link } from 'react-router-dom';
import { useState } from 'react';
import Navbar from '../componentes/Navbar';

const Alumno = () => {
  const [enviando, setEnviando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState(false);
  const [detalle, setDetalle] = useState(''); // NUEVO ESTADO

  const enviarAlerta = async () => {
    setEnviando(true);
    setMensajeExito(false);
    try {
      const respuesta = await fetch('http://127.0.0.1:8000/api/alertas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ubicacion: "Botón de pánico presionado", 
          descripcion: detalle // ENVIAMOS EL TEXTO
        })
      });
      if (respuesta.ok) {
        setMensajeExito(true);
        setDetalle(''); // Limpiamos el campo
        setTimeout(() => setMensajeExito(false), 4000);
      }
    } catch (error) { console.error(error); }
    setEnviando(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#F5F7FA] px-5 pb-28 pt-6 font-sans text-[#1F2933] sm:px-8">
      <div className="flex w-full max-w-md flex-col items-center">
        {/* Volver */}
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1 self-start rounded-full bg-[#eb9b1a] px-4 py-2 text-sm font-bold text-[#1F2933] shadow-sm transition hover:bg-[#d98f14] active:scale-95
            focus:outline-none focus-visible:ring-4 focus-visible:ring-[#eb9b1a]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F7FA]"
        >
          <span aria-hidden="true">←</span> Volver al inicio
        </Link>

        {/* Título */}
        <h2 className="mb-8 text-center text-3xl font-extrabold tracking-tight text-[#eb9b1a]">
          Panel de Alumno
        </h2>

        {/* Mensaje de éxito */}
        {mensajeExito && (
          <div
            role="status"
            className="mb-6 w-full rounded-2xl border border-[#eb9b1a] bg-white px-4 py-3 text-center font-semibold text-[#1F2933] shadow-sm"
          >
            ✅ ¡Alerta enviada a los profesores!
          </div>
        )}

        {/* Botón de emergencia */}
        <button
          onClick={enviarAlerta}
          disabled={enviando}
          aria-busy={enviando}
          aria-label="Enviar alerta de emergencia a los profesores"
          className={`flex h-56 w-56 flex-col items-center justify-center gap-2 rounded-full border-8 border-[#B3261E]/25 bg-[#B3261E] text-center text-white
            shadow-[0_20px_40px_-8px_rgba(179,38,30,0.55)]
            transition-all duration-150
            hover:brightness-110
            active:scale-95 active:shadow-[0_8px_16px_-4px_rgba(179,38,30,0.55)]
            focus:outline-none focus-visible:ring-4 focus-visible:ring-[#B3261E]/50 focus-visible:ring-offset-4 focus-visible:ring-offset-[#F5F7FA]
            disabled:cursor-not-allowed ${enviando ? 'opacity-60' : 'opacity-100'}`}
        >
          {/* Ícono de alerta */}
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`h-16 w-16 ${enviando ? 'animate-pulse' : ''}`}
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span className="text-2xl font-black tracking-wide">
            {enviando ? 'ENVIANDO...' : '¡EMERGENCIA!'}
          </span>
          {!enviando && (
            <span className="text-xs font-semibold uppercase tracking-wider text-white/90">
              Toca para pedir ayuda
            </span>
          )}
        </button>

        <p className="mt-8 text-center text-sm text-[#1F2933]/80">
          Presiona el botón si necesitas ayuda inmediata.
        </p>

        {/* Cuadro de texto para detalles */}
        <div className="mt-8 w-full rounded-3xl border border-[#1F2933]/10 bg-white p-5 shadow-sm">
          <label
            htmlFor="detalle"
            className="mb-2 block text-sm font-medium text-[#1F2933]"
          >
            (Opcional) Si puedes, escribe dónde estás o qué pasa:
          </label>
          <textarea
            id="detalle"
            placeholder="Ej: Baño del 2do piso B..."
            value={detalle}
            onChange={(e) => setDetalle(e.target.value)}
            className="min-h-[96px] w-full resize-none rounded-2xl border border-[#1F2933]/15 bg-[#F5F7FA] p-4 text-[#1F2933] placeholder-[#1F2933]/50 transition
              focus:border-[#eb9b1a] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#eb9b1a]/30"
          />
        </div>
      </div>

      <Navbar />
    </div>
  );
};

export default Alumno;