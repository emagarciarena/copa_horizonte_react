import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './layouts/Layout'
import Inicio from './pages/Inicio'
import Cronograma from './pages/Cronograma'
import Posiciones from './pages/Posiciones'
import Fanaticos from './pages/Fanaticos'
import Equipos from './pages/Equipos'
import Contacto from './pages/Contacto'
import NoEncontrada from './pages/NoEncontrada'
import ModalLogin from './components/ModalLogin'

function App() {
  // El usuario logueado se guarda en localStorage para que no se pierda al recargar
  const [usuario, setUsuario] = useState(localStorage.getItem("usuarioLogueado"))
  const [modalAbierto, setModalAbierto] = useState(false)

  function iniciarSesion(nombre) {
    localStorage.setItem("usuarioLogueado", nombre)
    setUsuario(nombre)
  }

  function cerrarSesion() {
    localStorage.removeItem("usuarioLogueado")
    setUsuario(null)
  }

  function abrirModal() {
    setModalAbierto(true)
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<Layout usuario={usuario} onIngresar={abrirModal} onSalir={cerrarSesion} />}
        >
          <Route index element={<Inicio />} />
          <Route path="cronograma" element={<Cronograma />} />
          <Route path="posiciones" element={<Posiciones />} />
          <Route path="fanaticos" element={<Fanaticos usuario={usuario} onIngresar={abrirModal} />} />
          <Route path="equipos" element={<Equipos />} />
          <Route path="contacto" element={<Contacto />} />
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