import { useState } from 'react'
import { NavLink } from 'react-router-dom'

function Navbar({ usuario, onIngresar, onSalir}) {
  const [menuAbierto, setMenuAbierto] = useState(false)

  function alternarMenu() {
    setMenuAbierto(!menuAbierto)
  }

  function cerrarMenu() {
    setMenuAbierto(false)
  }
  function clickAuth() {
    cerrarMenu()
    if (usuario) {
      onSalir()
    } else {
      onIngresar()
    }
  }

  return (
    <header className="navbar">
      <div className="navbar__brand">
        <img src="/logo-escudo-transparente.png" alt="Escudo Copa Horizonte" className="navbar__logo" />
        <span className="navbar__title">COPA <strong>HORIZONTE</strong></span>
      </div>

      <button
        className="navbar__toggle"
        aria-label="Abrir menú"
        aria-expanded={menuAbierto}
        onClick={alternarMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav className={menuAbierto ? "navbar__menu open" : "navbar__menu"}>
        <NavLink to="/" end onClick={cerrarMenu}>Inicio</NavLink>
        <NavLink to="/cronograma" onClick={cerrarMenu}>Cronograma</NavLink>
        <NavLink to="/posiciones" onClick={cerrarMenu}>Posiciones</NavLink>
        <NavLink to="/fanaticos" onClick={cerrarMenu}>Fanáticos</NavLink>
        <NavLink to="/equipos" onClick={cerrarMenu}>Equipos</NavLink>
        <NavLink to="/contacto" onClick={cerrarMenu}>Contacto</NavLink>
                <button type="button" className="navbar__auth" onClick={clickAuth}>
          {usuario ? `Salir (${usuario})` : "Ingresar"}
        </button>
      </nav>
    </header>
  )
}

export default Navbar