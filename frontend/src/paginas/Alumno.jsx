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
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-b from-sky-50 via-violet-50 to-rose-50 px-5 pb-28 pt-6 font-sans sm:px-8">
      <div className="flex w-full max-w-md flex-col items-center">
        {/* Volver */}
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1 self-start rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-sky-700 shadow-sm ring-1 ring-sky-100 transition hover:bg-white active:scale-95"
        >
          <span aria-hidden="true">←</span> Volver al inicio
        </Link>

        {/* Título */}
        <h2 className="mb-8 text-center text-3xl font-extrabold tracking-tight text-slate-700">
          Panel de Alumno
        </h2>

        {/* Mensaje de éxito */}
        {mensajeExito && (
          <div
            role="status"
            className="mb-6 w-full rounded-2xl bg-emerald-100 px-4 py-3 text-center font-semibold text-emerald-800 shadow-sm ring-1 ring-emerald-200"
          >
            ✅ ¡Alerta enviada a los profesores!
          </div>
        )}

        {/* Botón de emergencia */}
        <button
          onClick={enviarAlerta}
          disabled={enviando}
          className={`flex h-56 w-56 items-center justify-center rounded-full border-8 border-rose-200 bg-rose-400 text-center text-2xl font-black tracking-wide text-white
            shadow-[0_12px_0_0_#fb7185,0_24px_30px_-6px_rgba(244,63,94,0.35)]
            transition-all duration-150
            hover:bg-rose-300
            active:translate-y-2 active:shadow-[0_4px_0_0_#fb7185,0_8px_16px_-4px_rgba(244,63,94,0.35)]
            focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-300 focus-visible:ring-offset-4
            disabled:cursor-not-allowed ${enviando ? 'opacity-50' : 'opacity-100'}`}
        >
          {enviando ? 'ENVIANDO...' : '¡EMERGENCIA!'}
        </button>

        <p className="mt-8 text-center text-sm text-slate-500">
          Presiona el botón si necesitas ayuda inmediata.
        </p>

        {/* Cuadro de texto para detalles */}
        <div className="mt-8 w-full rounded-3xl bg-white/80 p-5 shadow-sm ring-1 ring-violet-100">
          <label
            htmlFor="detalle"
            className="mb-2 block text-sm font-medium text-slate-600"
          >
            (Opcional) Si puedes, escribe dónde estás o qué pasa:
          </label>
          <textarea
            id="detalle"
            placeholder="Ej: Baño del 2do piso B..."
            value={detalle}
            onChange={(e) => setDetalle(e.target.value)}
            className="min-h-[96px] w-full resize-none rounded-2xl border border-violet-100 bg-violet-50/50 p-4 text-slate-700 placeholder-slate-400 transition focus:border-violet-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-100"
          />
        </div>
      </div>

      <Navbar />
    </div>
  );
};

export default Alumno;