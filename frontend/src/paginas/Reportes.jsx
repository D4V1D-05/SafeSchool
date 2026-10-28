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
    <div className="flex min-h-screen flex-col items-center bg-[#F5F7FA] px-5 pb-28 pt-6 font-sans text-[#1F2933] sm:px-8">
      <div className="flex w-full max-w-md flex-col">
        {/* Volver */}
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1 self-start rounded-full bg-[#eb9b1a] px-4 py-2 text-sm font-bold text-[#1F2933] shadow-sm transition hover:bg-[#d98f14] active:scale-95
            focus:outline-none focus-visible:ring-4 focus-visible:ring-[#eb9b1a]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F7FA]"
        >
          <span aria-hidden="true">←</span> Volver al inicio
        </Link>

        {/* Título */}
        <h2 className="mb-6 text-center text-3xl font-extrabold tracking-tight text-[#eb9b1a]">
          Reportes y Seguimiento
        </h2>

        {/* Tarjeta: denuncia anónima */}
        <section className="mb-6 rounded-3xl border border-[#1F2933]/10 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-lg font-bold text-[#1F2933]">
            📝 Hacer una Denuncia Anónima
          </h3>

          {codigoGenerado ? (
            <div className="rounded-2xl border border-[#17703F]/30 bg-[#17703F]/10 p-5 text-center">
              <p role="status" className="text-lg font-bold text-[#17703F]">
                ✅ ¡Denuncia enviada!
              </p>
              <p className="mt-1 text-sm text-[#1F2933]">Tu código de seguimiento es:</p>

              <p className="my-3 inline-block rounded-2xl bg-white px-5 py-3 text-3xl font-black tracking-widest text-[#17703F] ring-2 ring-[#17703F]/40">
                {codigoGenerado}
              </p>

              <button
                onClick={copiarCodigo}
                aria-live="polite"
                className={`mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border-2 px-5 py-4 text-base font-extrabold
                  transition-all duration-200 active:scale-95
                  focus:outline-none focus-visible:ring-4 focus-visible:ring-[#17703F]/40 focus-visible:ring-offset-2
                  ${
                    copiado
                      ? 'border-[#17703F] bg-[#17703F] text-white'
                      : 'border-[#1F2933]/20 bg-white text-[#1F2933] hover:border-[#17703F]'
                  }`}
              >
                {copiado ? '✅ ¡Copiado!' : '📋 Copiar Código'}
              </button>

              <p className="mt-4 text-sm text-[#1F2933]/80">
                Guárdalo para consultar el estado abajo.
              </p>

              <button
                onClick={() => setCodigoGenerado(null)}
                className="mt-4 w-full rounded-2xl border-2 border-[#eb9b1a] bg-white px-5 py-3 font-bold text-[#1F2933] transition hover:bg-[#eb9b1a]/15 active:scale-95
                  focus:outline-none focus-visible:ring-4 focus-visible:ring-[#eb9b1a]/50"
              >
                Hacer otra denuncia
              </button>
            </div>
          ) : (
            <form onSubmit={enviarDenuncia} className="flex flex-col">
              {errorTexto && (
                <p
                  role="alert"
                  className="mb-3 rounded-xl border border-[#8A5300]/40 bg-[#8A5300]/10 px-4 py-2 text-sm font-semibold text-[#8A5300]"
                >
                  ⚠️ {errorTexto}
                </p>
              )}

              <textarea
                placeholder="Cuéntanos qué está pasando (qué, quién, dónde). Nadie sabrá que fuiste tú."
                className="mb-4 min-h-[140px] w-full resize-y rounded-2xl border border-[#1F2933]/15 bg-[#F5F7FA] p-4 text-[#1F2933] placeholder-[#1F2933]/50 transition
                  focus:border-[#eb9b1a] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#eb9b1a]/30"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />

              <div className="mb-4 flex flex-col gap-2">
                <label className="flex cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-[#1F2933]/30 bg-[#F5F7FA] px-4 py-3 text-center text-sm font-bold text-[#1F2933] transition hover:border-[#eb9b1a] hover:bg-[#eb9b1a]/10 active:scale-[0.98]">
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
                  <span className="text-center text-xs font-semibold text-[#1F2933]/80">
                    {archivos.length} archivo(s) seleccionado(s)
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-[#eb9b1a] px-6 py-3.5 text-base font-extrabold text-[#1F2933] shadow-md shadow-[#eb9b1a]/30 transition-all hover:bg-[#d98f14] active:scale-[0.98]
                  focus:outline-none focus-visible:ring-4 focus-visible:ring-[#eb9b1a]/50 focus-visible:ring-offset-2"
              >
                Enviar Denuncia
              </button>
            </form>
          )}
        </section>

        {/* Tarjeta: consultar reporte */}
        <section className="mb-6 rounded-3xl border border-[#1F2933]/10 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-lg font-bold text-[#1F2933]">
            🔍 Consultar mi Reporte
          </h3>

          <form onSubmit={consultarEstado} className="flex gap-2">
            <input
              type="text"
              placeholder="Ej: SCH-9TKV3"
              className="min-w-0 flex-1 rounded-2xl border border-[#1F2933]/15 bg-[#F5F7FA] px-4 py-3 uppercase text-[#1F2933] placeholder-[#1F2933]/50 placeholder:normal-case transition
                focus:border-[#eb9b1a] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#eb9b1a]/30"
              value={codigoBusqueda}
              onChange={(e) => setCodigoBusqueda(e.target.value)}
            />
            <button
              type="submit"
              className="shrink-0 rounded-2xl bg-[#1F2933] px-5 py-3 font-extrabold text-white transition-all hover:bg-[#1F2933]/85 active:scale-95
                focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1F2933]/30 focus-visible:ring-offset-2"
            >
              Buscar
            </button>
          </form>

          {resultadoBusqueda && (
            <div className="mt-4 rounded-2xl border border-[#1F2933]/10 bg-[#F5F7FA] p-4 text-sm text-[#1F2933]">
              {resultadoBusqueda.error ? (
                <p
                  role="alert"
                  className="rounded-xl border border-[#8A5300]/40 bg-[#8A5300]/10 px-3 py-2 font-semibold text-[#8A5300]"
                >
                  ⚠️ {resultadoBusqueda.error}
                </p>
              ) : (
                <div className="space-y-2">
                  <p>
                    <strong>Código:</strong> {resultadoBusqueda.codigo_reporte}
                  </p>
                  <p>
                    <strong>Fecha de envío:</strong> {resultadoBusqueda.fecha_hora}
                  </p>
                  <p>
                    <strong>Estado actual:</strong>{' '}
                    <span className="inline-block rounded-full bg-[#eb9b1a]/25 px-3 py-0.5 text-xs font-bold text-[#1F2933] ring-1 ring-[#eb9b1a]">
                      {resultadoBusqueda.estado}
                    </span>
                  </p>

                  {/* AVISO DE CONFIDENCIALIDAD */}
                  <p className="mt-3 border-t border-[#1F2933]/10 pt-3 text-xs italic text-[#1F2933]/70">
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