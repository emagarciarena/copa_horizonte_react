import { useState } from 'react'

function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false)

  function alternarMenu() {
    setMenuAbierto(!menuAbierto)
  }

  function cerrarMenu() {
    setMenuAbierto(false)
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
        <a href="#inicio" className="active" onClick={cerrarMenu}>Inicio</a>
        <a href="#cronograma" onClick={cerrarMenu}>Cronograma</a>
        <a href="#posiciones" onClick={cerrarMenu}>Posiciones</a>
        <a href="#fanaticos" onClick={cerrarMenu}>Fanáticos</a>
        <a href="#equipos" onClick={cerrarMenu}>Equipos</a>
        <a href="#contacto" onClick={cerrarMenu}>Contacto</a>
      </nav>
    </header>
  )
}

export default Navbar