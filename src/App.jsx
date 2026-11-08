import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './layouts/Layout'
import Inicio from './pages/Inicio'
import Cronograma from './pages/Cronograma'
import Posiciones from './pages/Posiciones'
import Fanaticos from './pages/Fanaticos'
import Equipos from './pages/Equipos'
import Contacto from './pages/Contacto'
import Panel from './pages/Panel'
import NoEncontrada from './pages/NoEncontrada'
import ModalLogin from './components/ModalLogin'

function App() {
  // El usuario y su rol se guardan en localStorage para que no se pierdan al recargar
  const [usuario, setUsuario] = useState(localStorage.getItem("usuarioLogueado"))
  const [rol, setRol] = useState(localStorage.getItem("rolLogueado"))
  const [modalAbierto, setModalAbierto] = useState(false)

  function iniciarSesion(nombre, rolElegido) {
    localStorage.setItem("usuarioLogueado", nombre)
    localStorage.setItem("rolLogueado", rolElegido)
    setUsuario(nombre)
    setRol(rolElegido)
  }

  function cerrarSesion() {
    localStorage.removeItem("usuarioLogueado")
    localStorage.removeItem("rolLogueado")
    setUsuario(null)
    setRol(null)
  }

  function abrirModal() {
    setModalAbierto(true)
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<Layout usuario={usuario} rol={rol} onIngresar={abrirModal} onSalir={cerrarSesion} />}
        >
          <Route index element={<Inicio />} />
          <Route path="cronograma" element={<Cronograma />} />
          <Route path="posiciones" element={<Posiciones />} />
          <Route path="fanaticos" element={<Fanaticos usuario={usuario} onIngresar={abrirModal} />} />
          <Route path="equipos" element={<Equipos />} />
          <Route path="contacto" element={<Contacto />} />
          <Route path="panel" element={<Panel rol={rol} />} />
          <Route path="*" element={<NoEncontrada />} />
        </Route>
      </Routes>

      <ModalLogin
        abierto={modalAbierto}
        onCerrar={() => setModalAbierto(false)}
        onLoginOk={iniciarSesion}
      />
    </>
  )
}

export default App