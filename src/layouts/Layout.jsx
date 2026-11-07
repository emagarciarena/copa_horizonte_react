import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import BotonesFlotantes from '../components/BotonesFlotantes'

function Layout({ usuario, onIngresar, onSalir }) {
  return (
    <>
      <Navbar usuario={usuario} onIngresar={onIngresar} onSalir={onSalir} />
      <main>
        <Outlet />
      </main>
      <BotonesFlotantes />
    </>
  )
}

export default Layout