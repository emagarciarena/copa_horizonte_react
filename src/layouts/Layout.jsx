import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import BotonesFlotantes from '../components/BotonesFlotantes'

function Layout({ usuario, rol, onIngresar, onSalir }) {
  return (
    <>
      <Navbar usuario={usuario} rol={rol} onIngresar={onIngresar} onSalir={onSalir} />
      <main>
        <Outlet />
      </main>
      <BotonesFlotantes />
    </>
  )
}

export default Layout