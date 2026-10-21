import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Inicio from './paginas/Inicio';
import Alumno from './paginas/Alumno';
import Profesor from './paginas/Profesor';
import Reportes from './paginas/Reportes';
import Chat from './paginas/Chat';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/alumno" element={<Alumno />} />
        <Route path="/profesor" element={<Profesor />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;