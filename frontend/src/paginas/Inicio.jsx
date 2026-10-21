import { Link } from 'react-router-dom';

const Inicio = () => {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-sky-50 via-violet-50 to-emerald-50 px-5 py-10 font-sans">
      {/* Decoración de fondo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-sky-200/50 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -right-16 h-64 w-64 rounded-full bg-emerald-200/50 blur-3xl"
      />

      {/* Tarjeta principal */}
      <main className="relative w-full max-w-2xl rounded-[2rem] bg-white/80 p-6 text-center shadow-xl shadow-sky-100/80 ring-1 ring-white sm:p-10">
        <h1 className="bg-gradient-to-r from-sky-600 to-emerald-500 bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-5xl">
          SafeSchool
        </h1>
        <p className="mx-auto mb-8 mt-3 max-w-sm text-base text-slate-500 sm:mb-10 sm:text-lg">
          Sistema de Prevención de Violencia Escolar
        </p>

        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
          <Link
            to="/alumno"
            className="flex min-h-[10rem] flex-col items-center justify-center gap-2 rounded-3xl bg-sky-300 px-6 py-6 text-2xl font-extrabold text-sky-950
              shadow-[0_8px_0_0_#38bdf8,0_18px_28px_-8px_rgba(56,189,248,0.5)]
              transition-all duration-150 hover:bg-sky-200
              active:translate-y-2 active:shadow-[0_2px_0_0_#38bdf8]
              focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 focus-visible:ring-offset-4"
          >
            <span aria-hidden="true" className="text-4xl">🎒</span>
            Soy Alumno
          </Link>

          <Link
            to="/profesor"
            className="flex min-h-[10rem] flex-col items-center justify-center gap-2 rounded-3xl bg-emerald-300 px-6 py-6 text-2xl font-extrabold text-emerald-950
              shadow-[0_8px_0_0_#34d399,0_18px_28px_-8px_rgba(52,211,153,0.5)]
              transition-all duration-150 hover:bg-emerald-200
              active:translate-y-2 active:shadow-[0_2px_0_0_#34d399]
              focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300 focus-visible:ring-offset-4"
          >
            <span aria-hidden="true" className="text-4xl">🍎</span>
            Soy Profesor
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Inicio;