import { NavLink } from 'react-router-dom';

const enlaces = [
  {
    to: '/alumno',
    label: 'Emergencia',
    icono: (
      <>
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </>
    ),
  },
  {
    to: '/reportes',
    label: 'Reportes',
    icono: (
      <>
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </>
    ),
  },
  {
    to: '/chat',
    label: 'Chat',
    icono: <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />,
  },
];

const Navbar = () => {
  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-0 bottom-0 z-[1000] flex justify-around border-t border-[#1F2933]/10 bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_rgba(31,41,51,0.08)]"
    >
      {enlaces.map(({ to, label, icono }) => (
        <NavLink
          key={to}
          to={to}
          className="relative flex flex-1 flex-col items-center gap-1 px-2 pb-2 pt-3 text-xs font-bold text-[#1F2933]
            transition-colors focus:outline-none focus-visible:bg-[#eb9b1a]/10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#eb9b1a]"
        >
          {({ isActive }) => (
            <>
              {/* Indicador superior del ítem activo */}
              <span
                aria-hidden="true"
                className={`absolute top-0 h-1 w-10 rounded-b-full bg-[#eb9b1a] transition-opacity duration-200 ${
                  isActive ? 'opacity-100' : 'opacity-0'
                }`}
              />
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={isActive ? 2.5 : 2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`h-6 w-6 transition-all duration-200 ${
                  isActive ? 'scale-110 text-[#eb9b1a]' : 'text-[#1F2933]'
                }`}
              >
                {icono}
              </svg>
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default Navbar;