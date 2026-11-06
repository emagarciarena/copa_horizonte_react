import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import BotonesFlotantes from '../components/BotonesFlotantes'

function Layout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <BotonesFlotantes />
    </>
  )
}

export default Layout