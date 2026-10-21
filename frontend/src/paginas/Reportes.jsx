import { Link } from 'react-router-dom';
import { useState } from 'react';
import Navbar from '../componentes/Navbar';

const Reportes = () => {
  const [descripcion, setDescripcion] = useState('');
  const [archivos, setArchivos] = useState(null);
  const [codigoGenerado, setCodigoGenerado] = useState(null);
  
  const [codigoBusqueda, setCodigoBusqueda] = useState('');
  const [resultadoBusqueda, setResultadoBusqueda] = useState(null);

  // Estados para mensajes en pantalla (reemplazan los alerts)
  const [errorTexto, setErrorTexto] = useState('');
  const [copiado, setCopiado] = useState(false);

  const enviarDenuncia = async (e) => {
    e.preventDefault();
    setErrorTexto('');
    if (!descripcion.trim()) {
      setErrorTexto('Por favor, escribe los detalles de la denuncia.');
      return;
    }

    const formData = new FormData();
    formData.append('descripcion', descripcion);
    
    if (archivos) {
      for (let i = 0; i < archivos.length; i++) {
        formData.append('archivos', archivos[i]);
      }
    }

    try {
      const respuesta = await fetch('http://127.0.0.1:8000/api/denuncias', {
        method: 'POST',
        body: formData 
      });
      const datos = await respuesta.json();
      setCodigoGenerado(datos.codigo);
      setDescripcion('');
      setArchivos(null);
    } catch (error) {
      console.error(error);
      setErrorTexto('Error de conexión con el servidor.');
    }
  };

  const consultarEstado = async (e) => {
    e.preventDefault();
    setResultadoBusqueda(null);
    if (!codigoBusqueda.trim()) return;

    try {
      const respuesta = await fetch(`http://127.0.0.1:8000/api/denuncias/${codigoBusqueda.toUpperCase()}`);
      const datos = await respuesta.json();
      
      if (datos.error) {
        setResultadoBusqueda({ error: "Código no encontrado. Verifica que esté bien escrito." });
      } else {
        setResultadoBusqueda(datos);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const copiarCodigo = () => {
    navigator.clipboard.writeText(codigoGenerado);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000); // El botón vuelve a la normalidad en 2 seg
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-b from-sky-50 via-violet-50 to-rose-50 px-5 pb-28 pt-6 font-sans sm:px-8">
      <div className="flex w-full max-w-md flex-col">
        {/* Volver */}
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1 self-start rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-sky-700 shadow-sm ring-1 ring-sky-100 transition hover:bg-white active:scale-95"
        >
          <span aria-hidden="true">←</span> Volver al inicio
        </Link>

        {/* Título */}
        <h2 className="mb-6 text-center text-3xl font-extrabold tracking-tight text-slate-700">
          Reportes y Seguimiento
        </h2>

        {/* Tarjeta: denuncia anónima */}
        <section className="mb-6 rounded-3xl bg-white/90 p-5 shadow-lg shadow-sky-100/70 ring-1 ring-sky-100">
          <h3 className="mb-4 text-lg font-bold text-slate-700">
            📝 Hacer una Denuncia Anónima
          </h3>

          {codigoGenerado ? (
            <div className="rounded-2xl bg-sky-50 p-5 text-center ring-1 ring-sky-100">
              <p className="text-lg font-bold text-emerald-700">¡Denuncia enviada!</p>
              <p className="mt-1 text-sm text-slate-600">Tu código de seguimiento es:</p>

              <h1 className="my-3 inline-block rounded-2xl bg-white px-5 py-3 text-3xl font-black tracking-widest text-sky-600 shadow-inner ring-2 ring-sky-200">
                {codigoGenerado}
              </h1>

              <button
                onClick={copiarCodigo}
                className={`mt-2 flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-base font-extrabold text-white
                  transition-all duration-200 active:translate-y-1
                  focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200 focus-visible:ring-offset-2
                  ${
                    copiado
                      ? 'scale-[1.02] bg-emerald-500 shadow-[0_3px_0_0_#059669,0_10px_20px_-6px_rgba(16,185,129,0.5)]'
                      : 'bg-emerald-400 shadow-[0_6px_0_0_#10b981,0_14px_24px_-8px_rgba(16,185,129,0.45)] hover:bg-emerald-300 active:shadow-[0_2px_0_0_#10b981]'
                  }`}
              >
                {copiado ? '✅ ¡Copiado!' : '📋 Copiar Código'}
              </button>

              <p className="mt-4 text-sm text-slate-500">
                Guárdalo para consultar el estado abajo.
              </p>

              <button
                onClick={() => setCodigoGenerado(null)}
                className="mt-4 w-full rounded-2xl bg-sky-100 px-5 py-3 font-bold text-sky-700 transition hover:bg-sky-200 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-200"
              >
                Hacer otra denuncia
              </button>
            </div>
          ) : (
            <form onSubmit={enviarDenuncia} className="flex flex-col">
              {errorTexto && (
                <p
                  role="alert"
                  className="mb-3 rounded-xl bg-rose-100 px-4 py-2 text-sm font-medium text-rose-700 ring-1 ring-rose-200"
                >
                  {errorTexto}
                </p>
              )}

              <textarea
                placeholder="Cuéntanos qué está pasando (qué, quién, dónde). Nadie sabrá que fuiste tú."
                className="mb-4 min-h-[140px] w-full resize-y rounded-2xl border border-sky-100 bg-sky-50/50 p-4 text-slate-700 placeholder-slate-400 transition focus:border-sky-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-sky-100"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />

              <div className="mb-4 flex flex-col gap-2">
                <label className="flex cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm font-bold text-amber-800 transition hover:bg-amber-100 active:scale-[0.98]">
                  📎 Adjuntar fotos o videos (Opcional)
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={(e) => setArchivos(e.target.files)}
                    className="hidden"
                  />
                </label>
                {archivos && (
                  <span className="text-center text-xs font-medium text-sky-600">
                    {archivos.length} archivo(s) seleccionado(s)
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-sky-400 px-6 py-3.5 text-base font-extrabold text-white shadow-[0_5px_0_0_#38bdf8] transition-all hover:bg-sky-300 active:translate-y-1 active:shadow-[0_1px_0_0_#38bdf8] focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-200 focus-visible:ring-offset-2"
              >
                Enviar Denuncia
              </button>
            </form>
          )}
        </section>

        {/* Tarjeta: consultar reporte */}
        <section className="mb-6 rounded-3xl bg-white/90 p-5 shadow-lg shadow-violet-100/70 ring-1 ring-violet-100">
          <h3 className="mb-4 text-lg font-bold text-slate-700">
            🔍 Consultar mi Reporte
          </h3>

          <form onSubmit={consultarEstado} className="flex gap-2">
            <input
              type="text"
              placeholder="Ej: SCH-9TKV3"
              className="min-w-0 flex-1 rounded-2xl border border-violet-100 bg-violet-50/50 px-4 py-3 uppercase text-slate-700 placeholder-slate-400 placeholder:normal-case transition focus:border-violet-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-100"
              value={codigoBusqueda}
              onChange={(e) => setCodigoBusqueda(e.target.value)}
            />
            <button
              type="submit"
              className="shrink-0 rounded-2xl bg-violet-400 px-5 py-3 font-extrabold text-white shadow-[0_4px_0_0_#a78bfa] transition-all hover:bg-violet-300 active:translate-y-1 active:shadow-[0_1px_0_0_#a78bfa] focus:outline-none focus-visible:ring-4 focus-visible:ring-violet-200"
            >
              Buscar
            </button>
          </form>

          {resultadoBusqueda && (
            <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 ring-1 ring-slate-200">
              {resultadoBusqueda.error ? (
                <p className="font-medium text-rose-600">{resultadoBusqueda.error}</p>
              ) : (
                <div className="space-y-2">
                  <p>
                    <strong className="text-slate-800">Código:</strong>{' '}
                    {resultadoBusqueda.codigo_reporte}
                  </p>
                  <p>
                    <strong className="text-slate-800">Fecha de envío:</strong>{' '}
                    {resultadoBusqueda.fecha_hora}
                  </p>
                  <p>
                    <strong className="text-slate-800">Estado actual:</strong>{' '}
                    <span className="inline-block rounded-full bg-amber-100 px-3 py-0.5 text-xs font-bold text-amber-800 ring-1 ring-amber-200">
                      {resultadoBusqueda.estado}
                    </span>
                  </p>

                  {/* AVISO DE CONFIDENCIALIDAD */}
                  <p className="mt-3 border-t border-slate-200 pt-3 text-xs italic text-slate-400">
                    * Por seguridad y protección de la víctima, los detalles de la denuncia solo son visibles para el personal de orientación del colegio.
                  </p>
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      <Navbar />
    </div>
  );
};

export default Reportes;