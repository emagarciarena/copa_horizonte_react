import { Routes, Route } from 'react-router-dom'
import Layout from './layouts/Layout'
import Inicio from './pages/Inicio'
import Cronograma from './pages/Cronograma'
import Posiciones from './pages/Posiciones'
import Fanaticos from './pages/Fanaticos'
import Equipos from './pages/Equipos'
import Contacto from './pages/Contacto'
import NoEncontrada from './pages/NoEncontrada'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Inicio />} />
        <Route path="cronograma" element={<Cronograma />} />
        <Route path="posiciones" element={<Posiciones />} />
        <Route path="fanaticos" element={<Fanaticos />} />
        <Route path="equipos" element={<Equipos />} />
        <Route path="contacto" element={<Contacto />} />
        <Route path="*" element={<NoEncontrada />} />
      </Route>
    </Routes>
  )
}

export default App