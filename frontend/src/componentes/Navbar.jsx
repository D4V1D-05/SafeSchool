import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={estilos.barra}>
      <NavLink to="/alumno" style={({ isActive }) => isActive ? estilos.activo : estilos.enlace}>
        🚨 Emergencia
      </NavLink>
      <NavLink to="/reportes" style={({ isActive }) => isActive ? estilos.activo : estilos.enlace}>
        📝 Reportes
      </NavLink>
      <NavLink to="/chat" style={({ isActive }) => isActive ? estilos.activo : estilos.enlace}>
        💬 Chat
      </NavLink>
    </nav>
  );
};

const estilos = {
  barra: { 
    position: 'fixed', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    display: 'flex', 
    justifyContent: 'space-around', 
    backgroundColor: 'white', 
    padding: '10px 0', 
    boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
    zIndex: 1000
  },
  enlace: { 
    textDecoration: 'none', 
    color: '#6b7280', 
    fontSize: '0.9rem', 
    fontWeight: 'bold',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  activo: { 
    textDecoration: 'none', 
    color: '#3b82f6', 
    fontSize: '0.9rem', 
    fontWeight: 'bold',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
};

export default Navbar;