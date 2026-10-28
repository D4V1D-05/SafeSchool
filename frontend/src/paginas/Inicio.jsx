import { Link } from 'react-router-dom';

const Inicio = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F7FA] px-5 py-10 font-sans text-[#1F2933]">
      <main className="w-full max-w-2xl text-center">
        {/* Encabezado */}
        <header className="mb-8 sm:mb-10">
          <h1 className="text-4xl font-black tracking-tight text-[#eb9b1a] sm:text-5xl">
            SafeApp
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-base text-[#1F2933]/70 sm:text-lg">
            Sistema de Prevención de Violencia Escolar
          </p>
          <div
            aria-hidden="true"
            className="mx-auto mt-5 h-1 w-16 rounded-full bg-[#eb9b1a]"
          />
        </header>

        {/* Tarjetas de selección de rol */}
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
          {/* Alumno: rojo urgencia */}
          <Link
            to="/alumno"
            className="group flex flex-col items-center gap-4 rounded-3xl border border-[#1F2933]/10 bg-white p-6 text-center shadow-sm
              transition-all duration-200 hover:-translate-y-1 hover:border-[#B3261E]/40 hover:shadow-xl hover:shadow-[#B3261E]/10
              focus:outline-none focus-visible:ring-4 focus-visible:ring-[#B3261E]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F7FA]"
          >
            <span
              aria-hidden="true"
              className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#B3261E]/10 text-5xl transition-transform duration-200 group-hover:scale-105"
            >
              🎒
            </span>
            <div>
              <h2 className="text-2xl font-extrabold text-[#1F2933]">Soy Alumno</h2>
              <p className="mt-1 text-sm text-[#1F2933]/70">
                Pide ayuda o reporta una situación de forma segura.
              </p>
            </div>
            <span className="mt-1 inline-flex w-full items-center justify-center rounded-full bg-[#B3261E] px-5 py-3 text-base font-bold text-white transition-colors duration-200 group-hover:bg-[#9a1f19]">
              Entrar
            </span>
          </Link>

          {/* Profesor: naranja fuerza */}
          <Link
            to="/profesor"
            className="group flex flex-col items-center gap-4 rounded-3xl border border-[#1F2933]/10 bg-white p-6 text-center shadow-sm
              transition-all duration-200 hover:-translate-y-1 hover:border-[#eb9b1a]/50 hover:shadow-xl hover:shadow-[#eb9b1a]/10
              focus:outline-none focus-visible:ring-4 focus-visible:ring-[#eb9b1a]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F7FA]"
          >
            <span
              aria-hidden="true"
              className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#eb9b1a]/15 text-5xl transition-transform duration-200 group-hover:scale-105"
            >
              🍎
            </span>
            <div>
              <h2 className="text-2xl font-extrabold text-[#1F2933]">Soy Profesor</h2>
              <p className="mt-1 text-sm text-[#1F2933]/70">
                Revisa alertas, denuncias y acompaña a los alumnos.
              </p>
            </div>
            <span className="mt-1 inline-flex w-full items-center justify-center rounded-full bg-[#eb9b1a] px-5 py-3 text-base font-bold text-[#1F2933] transition-colors duration-200 group-hover:bg-[#d98f14]">
              Entrar
            </span>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Inicio;