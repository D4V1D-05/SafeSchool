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
    <div className="mx-auto flex h-[100dvh] w-full max-w-md flex-col bg-[#F5F7FA] px-4 pb-24 pt-5 font-sans text-[#1F2933]">
      {/* Volver */}
      <Link
        to="/"
        className="mb-4 inline-flex shrink-0 items-center gap-1 self-start rounded-full bg-[#eb9b1a] px-4 py-2 text-sm font-bold text-[#1F2933] shadow-sm transition hover:bg-[#d98f14] active:scale-95
          focus:outline-none focus-visible:ring-4 focus-visible:ring-[#eb9b1a]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F7FA]"
      >
        <span aria-hidden="true">←</span> Volver al inicio
      </Link>

      {/* Encabezado */}
      <div className="mb-4 shrink-0 text-center">
        <h2 className="text-2xl font-extrabold tracking-tight text-[#eb9b1a]">
          Apoyo Psicológico
        </h2>
        <p className="mt-2 inline-flex items-center gap-2 rounded-full border border-[#1F2933]/10 bg-white px-3 py-1 text-xs text-[#1F2933]">
          <span className="h-2 w-2 rounded-full bg-[#17703F]" aria-hidden="true" />
          Conectado como: <strong>{salaId}</strong>
        </p>
      </div>

      {/* Caja del chat */}
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-[#1F2933]/10 bg-white shadow-sm">
        {/* Área de mensajes con scroll interno */}
        <div
          role="log"
          aria-live="polite"
          aria-label="Mensajes del chat"
          className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 pb-24 pt-4"
        >
          {mensajes.length === 0 ? (
            <p className="mt-6 text-center text-sm text-[#1F2933]/70">
              Escribe un mensaje para iniciar...
            </p>
          ) : (
            mensajes.map((msg) => (
              <div
                key={msg.id}
                className={
                  msg.remitente === 'alumno'
                    ? 'max-w-[80%] self-end break-words rounded-2xl rounded-br-md bg-[#eb9b1a] px-4 py-2.5 text-[#1F2933] shadow-sm'
                    : 'max-w-[80%] self-start break-words rounded-2xl rounded-bl-md border border-[#1F2933]/10 bg-[#F5F7FA] px-4 py-2.5 text-[#1F2933] shadow-sm'
                }
              >
                <p className="m-0 text-[0.95rem] leading-snug">{msg.texto}</p>
                <span className="mt-1 block text-right text-[0.7rem] text-[#1F2933]/80">
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
          className="absolute inset-x-3 bottom-3 flex items-center gap-2 rounded-full border border-[#1F2933]/10 bg-white p-2 shadow-xl shadow-[#1F2933]/10 transition focus-within:border-[#eb9b1a] focus-within:ring-4 focus-within:ring-[#eb9b1a]/30"
        >
          <input
            type="text"
            aria-label="Escribe tu mensaje"
            placeholder="Escribe tu mensaje..."
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            className="min-w-0 flex-1 rounded-full bg-transparent px-4 py-2.5 text-[#1F2933] placeholder-[#1F2933]/50 focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-[#eb9b1a] px-5 py-2.5 font-extrabold text-[#1F2933] transition-all hover:bg-[#d98f14] active:scale-95
              focus:outline-none focus-visible:ring-4 focus-visible:ring-[#eb9b1a]/50"
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