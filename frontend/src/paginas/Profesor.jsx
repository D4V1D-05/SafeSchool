import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

const Profesor = () => {
  const [tabActiva, setTabActiva] = useState('alertas');

  // --- ESTADOS DE ALERTAS ---
  const [alertas, setAlertas] = useState([]);
  const [audioPermitido, setAudioPermitido] = useState(false);
  const alertasAnteriores = useRef(0);
  const audioRef = useRef(null);

  // --- ESTADOS DE DENUNCIAS ---
  const [denuncias, setDenuncias] = useState([]);
  const [denunciaSeleccionada, setDenunciaSeleccionada] = useState(null);

  // --- ESTADOS DE CHAT (SISTEMA DE SALAS) ---
  const [salasActivas, setSalasActivas] = useState([]);
  const [salaSeleccionada, setSalaSeleccionada] = useState(null);
  const [mensajesChat, setMensajesChat] = useState([]);
  const [textoChat, setTextoChat] = useState('');
  const finalChatRef = useRef(null);

  // --- FUNCIÓN AUXILIAR PARA COLORES DE RIESGO (ahora devuelve clases de Tailwind) ---
  const obtenerColorRiesgo = (riesgo) => {
    if (riesgo === 'Alto') return 'bg-rose-100 text-rose-800 ring-rose-300';
    if (riesgo === 'Medio') return 'bg-amber-100 text-amber-800 ring-amber-300';
    return 'bg-emerald-100 text-emerald-800 ring-emerald-300'; // Bajo
  };

  // --- LÓGICA DE ALERTAS ---
  useEffect(() => {
    audioRef.current = new Audio('https://actions.google.com/sounds/v1/alarms/spaceship_alarm.ogg');
    audioRef.current.volume = 1.0; 
  }, []);

  useEffect(() => {
    const obtenerAlertas = async () => {
      try {
        const respuesta = await fetch('http://127.0.0.1:8000/api/alertas');
        const datos = await respuesta.json();
        
        if (datos.length > alertasAnteriores.current && audioPermitido) {
          audioRef.current.play().catch(e => console.log("Audio bloqueado", e));
        }
        alertasAnteriores.current = datos.length;
        setAlertas(datos);
      } catch (error) { console.error(error); }
    };

    obtenerAlertas();
    const intervalo = setInterval(obtenerAlertas, 3000); 
    return () => clearInterval(intervalo);
  }, [audioPermitido]);

  const manejarAlarma = () => {
    if (!audioPermitido) {
      audioRef.current.play().then(() => {
        audioRef.current.pause(); audioRef.current.currentTime = 0;
        setAudioPermitido(true);
      }).catch(e => console.log(e));
    } else {
      if (window.confirm("¿Seguro que deseas apagar la alarma?")) setAudioPermitido(false);
    }
  };

  // --- LÓGICA DE DENUNCIAS ---
  useEffect(() => {
    const cargarDenuncias = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/denuncias');
        const datos = await res.json();
        setDenuncias(datos);
      } catch (error) { console.error(error); }
    };

    if (tabActiva === 'denuncias') {
      cargarDenuncias();
      const intervalo = setInterval(cargarDenuncias, 5000);
      return () => clearInterval(intervalo);
    }
  }, [tabActiva]);

  const cambiarEstado = async (codigo, nuevoEstado) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/denuncias/${codigo}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nuevo_estado: nuevoEstado })
      });
      
      const res = await fetch('http://127.0.0.1:8000/api/denuncias');
      const datos = await res.json();
      setDenuncias(datos);
      setDenunciaSeleccionada(null); 
    } catch (error) { console.error(error); }
  };

  // --- LÓGICA DE CHAT (SALAS) ---
  useEffect(() => {
    const cargarSalas = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/chat/salas/activas');
        if (res.ok) {
          const datos = await res.json();
          setSalasActivas(datos);
        }
      } catch (error) { console.error(error); }
    };

    if (tabActiva === 'chat') {
      cargarSalas();
      const intervalo = setInterval(cargarSalas, 3000);
      return () => clearInterval(intervalo);
    }
  }, [tabActiva]);

  useEffect(() => {
    if (!salaSeleccionada) return;
    
    const cargarMensajes = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/chat/${salaSeleccionada.sala_id}`);
        if (res.ok) {
          const datos = await res.json();
          setMensajesChat(Array.isArray(datos) ? datos : []);
        }
      } catch (error) { console.error(error); }
    };

    cargarMensajes();
    const intervalo = setInterval(cargarMensajes, 2000);
    return () => clearInterval(intervalo);
  }, [salaSeleccionada]);

  useEffect(() => {
    if (finalChatRef.current) {
      finalChatRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [mensajesChat]);

  const enviarMensajeChat = async (e) => {
    e.preventDefault();
    if (!textoChat.trim() || !salaSeleccionada) return;

    try {
      await fetch('http://127.0.0.1:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sala_id: salaSeleccionada.sala_id, remitente: 'profesor', texto: textoChat })
      });
      setTextoChat('');
    } catch (error) { console.error(error); }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-sky-50 via-violet-50 to-emerald-50 font-sans text-slate-700">
      
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-sky-100 bg-white/80 px-4 py-4 shadow-sm backdrop-blur sm:px-10">
        <h1 className="text-xl font-black tracking-tight text-sky-700 sm:text-2xl">
          SafeSchool{' '}
          <span className="text-base font-normal text-slate-500">| Panel Docente</span>
        </h1>
        <Link
          to="/"
          className="rounded-full border border-rose-300 bg-rose-50 px-5 py-2 text-sm font-bold text-rose-600 transition hover:bg-rose-100 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-200"
        >
          Cerrar Sesión
        </Link>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-8">
        
        {/* Pestañas tipo dashboard */}
        <div className="mb-8 inline-flex max-w-full gap-1 overflow-x-auto rounded-2xl bg-white/90 p-1.5 shadow-sm ring-1 ring-sky-100">
          <button
            onClick={() => setTabActiva('alertas')}
            className={`whitespace-nowrap rounded-xl px-5 py-2.5 text-sm font-bold transition focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-200 sm:text-base ${
              tabActiva === 'alertas'
                ? 'bg-sky-200 text-sky-900 shadow-sm ring-1 ring-sky-300'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
            }`}
          >
            🚨 Alertas en Vivo
          </button>
          <button
            onClick={() => setTabActiva('denuncias')}
            className={`whitespace-nowrap rounded-xl px-5 py-2.5 text-sm font-bold transition focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-200 sm:text-base ${
              tabActiva === 'denuncias'
                ? 'bg-sky-200 text-sky-900 shadow-sm ring-1 ring-sky-300'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
            }`}
          >
            📝 Bandeja de Denuncias
          </button>
          <button
            onClick={() => setTabActiva('chat')}
            className={`whitespace-nowrap rounded-xl px-5 py-2.5 text-sm font-bold transition focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-200 sm:text-base ${
              tabActiva === 'chat'
                ? 'bg-sky-200 text-sky-900 shadow-sm ring-1 ring-sky-300'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
            }`}
          >
            💬 Chat de Soporte
          </button>
        </div>

        {/* --- PESTAÑA 1: ALERTAS --- */}
        {tabActiva === 'alertas' && (
          <div className="flex flex-col gap-6">
            
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-700 sm:text-3xl">
                  Monitoreo de Emergencias
                </h2>
                <p className="mt-2 text-slate-500">
                  Alertas en tiempo real enviadas por los alumnos.
                </p>
              </div>
              <button
                onClick={manejarAlarma}
                className={`shrink-0 rounded-2xl px-6 py-3 font-extrabold transition-all duration-150 active:translate-y-1 focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 ${
                  audioPermitido
                    ? 'bg-rose-300 text-rose-950 shadow-[0_5px_0_0_#fb7185,0_0_24px_rgba(251,113,133,0.45)] hover:bg-rose-200 active:shadow-[0_1px_0_0_#fb7185] focus-visible:ring-rose-300'
                    : 'bg-sky-300 text-sky-950 shadow-[0_5px_0_0_#38bdf8,0_12px_20px_-8px_rgba(56,189,248,0.5)] hover:bg-sky-200 active:shadow-[0_1px_0_0_#38bdf8] focus-visible:ring-sky-300'
                }`}
              >
                {audioPermitido ? '🔕 Apagar Alarma' : '🔔 Activar Alarma Sonora'}
              </button>
            </div>

            {/* Mapa */}
            <div className="relative flex h-72 flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-sky-300 bg-sky-50 shadow-lg shadow-sky-100/70 sm:h-96 bg-[linear-gradient(to_right,rgba(125,211,252,0.35)_1px,transparent_1px),linear-gradient(to_bottom,rgba(125,211,252,0.35)_1px,transparent_1px)] bg-[size:40px_40px]">
              <p className="relative z-10 rounded-full bg-white/80 px-5 py-2 font-bold text-sky-800 shadow-sm ring-1 ring-sky-100">
                🗺️ Mapa de Geolocalización (Simulación)
              </p>
              <div className="absolute left-[30%] top-[40%] h-6 w-6">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-300 opacity-75" />
                <span className="relative inline-flex h-6 w-6 rounded-full bg-rose-400 shadow-[0_0_20px_#fb7185] ring-4 ring-white/70" />
              </div>
              <div className="absolute left-[60%] top-[70%] h-5 w-5 rounded-full bg-rose-400 shadow-[0_0_15px_#fb7185] ring-4 ring-white/70" />
            </div>

            <div className="rounded-3xl bg-white/90 p-5 shadow-lg shadow-sky-100/70 ring-1 ring-sky-100 sm:p-8">
              <h3 className="mb-4 text-lg font-bold text-rose-600">
                🚨 Historial de Alertas Recientes
              </h3>
              {alertas.length === 0 ? (
                <p className="p-8 text-center text-slate-500">
                  No hay alertas por el momento. El colegio está tranquilo.
                </p>
              ) : (
                <div className="overflow-x-auto rounded-2xl ring-1 ring-slate-200">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                        <th className="px-4 py-3 font-bold">ID</th>
                        <th className="px-4 py-3 font-bold">Hora</th>
                        <th className="px-4 py-3 font-bold">Ubicación / Detalle</th>
                        <th className="px-4 py-3 font-bold">Riesgo (IA)</th>
                        <th className="px-4 py-3 font-bold">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {alertas.map((a) => (
                        <tr key={a.id} className="transition hover:bg-sky-50/50">
                          <td className="px-4 py-3 font-semibold text-slate-600">#{a.id}</td>
                          <td className="whitespace-nowrap px-4 py-3 text-slate-600">{a.fecha_hora}</td>
                          <td className="px-4 py-3">
                            <div className="text-slate-700">{a.ubicacion}</div>
                            {a.descripcion && (
                              <div className="mt-0.5 text-xs text-slate-500">"{a.descripcion}"</div>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-bold ring-1 ${obtenerColorRiesgo(a.nivel_riesgo)}`}>
                              {a.nivel_riesgo}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-block rounded-full bg-rose-100 px-3 py-0.5 text-xs font-bold text-rose-800 ring-1 ring-rose-200">
                              {a.estado}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- PESTAÑA 2: DENUNCIAS PASIVAS --- */}
        {tabActiva === 'denuncias' && (
          <div className="rounded-3xl bg-white/90 p-5 shadow-lg shadow-sky-100/70 ring-1 ring-sky-100 sm:p-8">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-700 sm:text-3xl">
              Gestión de Denuncias Anónimas
            </h2>
            <p className="mb-6 mt-2 text-slate-500">
              La IA clasifica el riesgo del caso automáticamente.
            </p>
            
            {denuncias.length === 0 ? <p className="text-slate-500">No hay denuncias registradas.</p> : (
              <div className="overflow-x-auto rounded-2xl ring-1 ring-slate-200">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                      <th className="px-4 py-3 font-bold">Código</th>
                      <th className="px-4 py-3 font-bold">Fecha</th>
                      <th className="px-4 py-3 font-bold">Riesgo (IA)</th>
                      <th className="px-4 py-3 font-bold">Estado</th>
                      <th className="px-4 py-3 font-bold">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {denuncias.map((d) => (
                      <tr key={d.codigo_reporte} className="transition hover:bg-sky-50/50">
                        <td className="px-4 py-3 font-bold text-sky-600">{d.codigo_reporte}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-slate-600">{d.fecha_hora}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-bold ring-1 ${obtenerColorRiesgo(d.nivel_riesgo)}`}>
                            {d.nivel_riesgo || 'Pendiente'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-block rounded-full bg-amber-100 px-3 py-0.5 text-xs font-bold text-amber-800 ring-1 ring-amber-200">
                            {d.estado}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setDenunciaSeleccionada(d)}
                            className="rounded-xl bg-sky-100 px-4 py-2 text-sm font-bold text-sky-700 ring-1 ring-sky-200 transition hover:bg-sky-200 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-200"
                          >
                            🔍 Ver Detalles
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* MODAL DE DETALLE DE DENUNCIA */}
            {denunciaSeleccionada && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
                <div
                  role="dialog"
                  aria-modal="true"
                  className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-sky-100 sm:p-8"
                >
                  <h3 className="mb-4 text-2xl font-extrabold text-slate-700">
                    Reporte: <span className="text-sky-600">{denunciaSeleccionada.codigo_reporte}</span>
                  </h3>
                  
                  <div className="mb-6 rounded-2xl bg-slate-50 p-5 text-sm text-slate-700 ring-1 ring-slate-200">
                    <p><strong>Fecha:</strong> {denunciaSeleccionada.fecha_hora}</p>
                    <p className="mt-2">
                      <strong>Nivel de Riesgo Evaluado por IA:</strong> 
                      <span className={`ml-2 inline-block rounded-full px-3 py-0.5 text-xs font-bold ring-1 ${obtenerColorRiesgo(denunciaSeleccionada.nivel_riesgo)}`}>
                        {denunciaSeleccionada.nivel_riesgo || 'Pendiente'}
                      </span>
                    </p>
                    <p className="mt-4"><strong>Descripción:</strong></p>
                    <p className="mt-2 rounded-2xl bg-white p-4 italic text-slate-600 ring-1 ring-slate-200">
                      "{denunciaSeleccionada.descripcion}"
                    </p>
                    
                    {/* VISUALIZACIÓN DE ARCHIVOS ADJUNTOS */}
                    <p className="mt-6"><strong>Evidencias adjuntas:</strong></p>
                    {denunciaSeleccionada.archivos_adjuntos && denunciaSeleccionada.archivos_adjuntos.length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-3">
                        {denunciaSeleccionada.archivos_adjuntos.map((archivo, index) => {
                          const extension = archivo.split('.').pop().toLowerCase();
                          const esImagen = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension);
                          const esVideo = ['mp4', 'webm', 'ogg'].includes(extension);
                          const urlArchivo = `http://127.0.0.1:8000/uploads/${archivo}`;

                          if (esImagen) {
                            return (
                              <a key={index} href={urlArchivo} target="_blank" rel="noopener noreferrer" title="Clic para ampliar">
                                <img
                                  src={urlArchivo}
                                  alt="Evidencia"
                                  className="h-28 w-28 cursor-pointer rounded-2xl object-cover shadow-sm ring-2 ring-slate-200 transition hover:ring-sky-300"
                                />
                              </a>
                            );
                          } else if (esVideo) {
                            return (
                              <video
                                key={index}
                                src={urlArchivo}
                                controls
                                className="w-52 rounded-2xl shadow-sm ring-2 ring-slate-200"
                              />
                            );
                          } else {
                            return (
                              <a
                                key={index}
                                href={urlArchivo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 rounded-2xl bg-slate-100 px-4 py-2.5 text-sm text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-200"
                              >
                                📄 {archivo}
                              </a>
                            );
                          }
                        })}
                      </div>
                    ) : (
                      <p className="mt-2 rounded-2xl bg-white p-4 italic text-slate-500 ring-1 ring-slate-200">
                        No se adjuntaron archivos.
                      </p>
                    )}
                  </div>
                  
                  <div className="mb-6 flex flex-col items-center rounded-2xl bg-sky-50 p-5 ring-1 ring-sky-100">
                    <p className="mb-4 font-bold text-slate-700">Actualizar Estado del Caso:</p>
                    <div className="flex w-full flex-col gap-3 sm:flex-row">
                      <button
                        onClick={() => cambiarEstado(denunciaSeleccionada.codigo_reporte, 'EN ATENCIÓN')}
                        className="flex-1 rounded-2xl bg-amber-300 px-4 py-3 text-sm font-extrabold text-amber-950 shadow-[0_4px_0_0_#fbbf24] transition-all hover:bg-amber-200 active:translate-y-1 active:shadow-[0_1px_0_0_#fbbf24] focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-200"
                      >
                        Marcar en Atención
                      </button>
                      <button
                        onClick={() => cambiarEstado(denunciaSeleccionada.codigo_reporte, 'CUMPLIDO')}
                        className="flex-1 rounded-2xl bg-emerald-300 px-4 py-3 text-sm font-extrabold text-emerald-950 shadow-[0_4px_0_0_#34d399] transition-all hover:bg-emerald-200 active:translate-y-1 active:shadow-[0_1px_0_0_#34d399] focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200"
                      >
                        Marcar Cumplido
                      </button>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setDenunciaSeleccionada(null)}
                    className="w-full rounded-2xl bg-rose-100 px-4 py-3 font-bold text-rose-700 ring-1 ring-rose-200 transition hover:bg-rose-200 active:scale-[0.98] focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-200"
                  >
                    Cerrar Ventana
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- PESTAÑA 3: CHAT (SISTEMA DE SALAS) --- */}
        {tabActiva === 'chat' && (
          <div className="flex h-[70vh] max-h-[720px] min-h-[480px] flex-col overflow-hidden rounded-3xl bg-white shadow-lg shadow-sky-100/70 ring-1 ring-sky-100 md:flex-row">
            
            {/* LISTA DE SALAS (IZQUIERDA) */}
            <aside className="flex max-h-56 w-full shrink-0 flex-col border-b border-slate-200 bg-white md:max-h-none md:w-80 md:border-b-0 md:border-r">
              <h3 className="border-b border-slate-100 px-5 py-4 text-lg font-bold text-slate-700">
                Bandeja de Entrada
              </h3>
              <div className="flex-1 space-y-1 overflow-y-auto p-2">
                {salasActivas.length === 0 ? (
                  <p className="p-3 text-sm text-slate-500">No hay chats activos.</p>
                ) : (
                  salasActivas.map((sala) => (
                    <button 
                      key={sala.sala_id} 
                      onClick={() => setSalaSeleccionada(sala)}
                      className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left transition focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-200 ${
                        salaSeleccionada?.sala_id === sala.sala_id
                          ? 'bg-sky-100 ring-1 ring-sky-200'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xl ring-1 ring-violet-200">
                        🎓
                      </span>
                      <span className="min-w-0 flex-1">
                        <strong className="block text-sm text-sky-700">{sala.sala_id}</strong>
                        <span className="block truncate text-sm text-slate-500">
                          {sala.ultimo_mensaje}
                        </span>
                      </span>
                    </button>
                  ))
                )}
              </div>
            </aside>

            {/* VENTANA DE CHAT (DERECHA) */}
            <section className="flex min-h-0 flex-1 flex-col">
              {salaSeleccionada ? (
                <>
                  <h3 className="flex items-center gap-3 border-b border-slate-100 bg-white px-5 py-3 font-bold text-slate-700">
                    <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 ring-1 ring-violet-200">
                      🎓
                    </span>
                    <span>
                      Conversación con: <span className="text-sky-600">{salaSeleccionada.sala_id}</span>
                    </span>
                  </h3>
                  <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto bg-gradient-to-b from-sky-50 to-violet-50 p-4 sm:p-6">
                    {mensajesChat.map((msg) => (
                      <div
                        key={msg.id}
                        className={
                          msg.remitente === 'profesor'
                            ? 'max-w-[70%] self-end break-words rounded-2xl rounded-br-md bg-sky-200 px-4 py-2.5 text-slate-800 shadow-sm'
                            : 'max-w-[70%] self-start break-words rounded-2xl rounded-bl-md bg-white px-4 py-2.5 text-slate-700 shadow-sm ring-1 ring-slate-200'
                        }
                      >
                        <p className="m-0 text-[0.95rem] leading-snug">{msg.texto}</p>
                        <span className="mt-1 block text-right text-[0.7rem] text-slate-500/80">
                          {msg.hora}
                        </span>
                      </div>
                    ))}
                    <div ref={finalChatRef}></div>
                  </div>
                  <form onSubmit={enviarMensajeChat} className="flex items-center gap-3 border-t border-slate-100 bg-white p-3">
                    <input 
                      type="text" 
                      placeholder="Responde al alumno..." 
                      value={textoChat}
                      onChange={(e) => setTextoChat(e.target.value)}
                      className="min-w-0 flex-1 rounded-full bg-slate-100 px-5 py-3 text-slate-700 placeholder-slate-400 transition focus:bg-white focus:outline-none focus:ring-4 focus:ring-sky-100"
                    />
                    <button
                      type="submit"
                      className="shrink-0 rounded-full bg-sky-300 px-6 py-3 font-extrabold text-sky-950 shadow-[0_3px_0_0_#38bdf8] transition-all hover:bg-sky-200 active:translate-y-0.5 active:shadow-[0_1px_0_0_#38bdf8] focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-200"
                    >
                      Enviar
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 bg-gradient-to-b from-sky-50 to-violet-50 text-slate-400">
                  <span aria-hidden="true" className="text-5xl">💬</span>
                  <p>Selecciona una conversación de la izquierda</p>
                </div>
              )}
            </section>

          </div>
        )}
      </main>
    </div>
  );
};

export default Profesor;