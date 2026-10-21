import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import Navbar from '../componentes/Navbar';

const Chat = () => {
  const [mensajes, setMensajes] = useState([]);
  const [texto, setTexto] = useState('');
  const finalChatRef = useRef(null);
  
  // Generamos o recuperamos el ID de la sala del alumno
  const [salaId] = useState(() => {
    let id = localStorage.getItem('sala_chat_alumno');
    if (!id) {
      id = "ALU-" + Math.random().toString(36).substring(2, 7).toUpperCase();
      localStorage.setItem('sala_chat_alumno', id);
    }
    return id;
  });

  useEffect(() => {
    const cargarMensajes = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/chat/${salaId}`);
        if (res.ok) {
          const datos = await res.json();
          setMensajes(Array.isArray(datos) ? datos : []);
        }
      } catch (error) { console.error(error); }
    };

    cargarMensajes();
    const intervalo = setInterval(cargarMensajes, 2000);
    return () => clearInterval(intervalo);
  }, [salaId]);

  useEffect(() => {
    if (finalChatRef.current) {
      finalChatRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [mensajes]);

  const enviarMensaje = async (e) => {
    e.preventDefault();
    if (!texto.trim()) return;

    try {
      await fetch('http://127.0.0.1:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sala_id: salaId, remitente: 'alumno', texto: texto })
      });
      setTexto('');
    } catch (error) { console.error(error); }
  };

  return (
    <div className="mx-auto flex h-[100dvh] w-full max-w-md flex-col bg-gradient-to-b from-sky-50 via-violet-50 to-rose-50 px-4 pb-24 pt-5 font-sans">
      {/* Volver */}
      <Link
        to="/"
        className="mb-4 inline-flex shrink-0 items-center gap-1 self-start rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-sky-700 shadow-sm ring-1 ring-sky-100 transition hover:bg-white active:scale-95"
      >
        <span aria-hidden="true">←</span> Volver al inicio
      </Link>

      {/* Encabezado */}
      <div className="mb-4 shrink-0 text-center">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-700">
          Apoyo Psicológico
        </h2>
        <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs text-slate-500 ring-1 ring-emerald-100">
          <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
          Conectado como: <strong className="text-slate-700">{salaId}</strong>
        </p>
      </div>

      {/* Caja del chat */}
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl bg-white/90 shadow-lg shadow-sky-100/70 ring-1 ring-sky-100">
        {/* Área de mensajes con scroll interno */}
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 pb-24 pt-4">
          {mensajes.length === 0 ? (
            <p className="mt-6 text-center text-sm text-slate-400">
              Escribe un mensaje para iniciar...
            </p>
          ) : (
            mensajes.map((msg) => (
              <div
                key={msg.id}
                className={
                  msg.remitente === 'alumno'
                    ? 'max-w-[80%] self-end break-words rounded-2xl rounded-br-md bg-sky-200 px-4 py-2.5 text-slate-800 shadow-sm'
                    : 'max-w-[80%] self-start break-words rounded-2xl rounded-bl-md bg-white px-4 py-2.5 text-slate-700 shadow-sm ring-1 ring-slate-200'
                }
              >
                <p className="m-0 text-[0.95rem] leading-snug">{msg.texto}</p>
                <span className="mt-1 block text-right text-[0.7rem] text-slate-500/80">
                  {msg.hora}
                </span>
              </div>
            ))
          )}
          <div ref={finalChatRef}></div>
        </div>

        {/* Input flotante */}
        <form
          onSubmit={enviarMensaje}
          className="absolute inset-x-3 bottom-3 flex items-center gap-2 rounded-full bg-white p-2 shadow-xl shadow-sky-200/60 ring-1 ring-sky-100"
        >
          <input
            type="text"
            placeholder="Escribe tu mensaje..."
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            className="min-w-0 flex-1 rounded-full bg-transparent px-4 py-2.5 text-slate-700 placeholder-slate-400 focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-sky-400 px-5 py-2.5 font-extrabold text-white shadow-[0_3px_0_0_#38bdf8] transition-all hover:bg-sky-300 active:translate-y-0.5 active:shadow-[0_1px_0_0_#38bdf8] focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-200"
          >
            Enviar
          </button>
        </form>
      </div>

      <Navbar />
    </div>
  );
};

export default Chat;