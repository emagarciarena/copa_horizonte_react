import { useState } from 'react'
import { iniciales } from '../utils/datos'

function EscudoEquipo({ nombre, logos, clase = "match-card__badge" }) {
  const [falloImagen, setFalloImagen] = useState(false)
  const logo = logos[nombre]

  if (!logo || falloImagen) {
    return <span className={clase}>{iniciales(nombre)}</span>
  }

  return (
    <img
      src={logo}
      alt={nombre}
      className={clase}
      style={{ objectFit: "contain", background: "var(--color-bg-dark)" }}
      onError={() => setFalloImagen(true)}
    />
  )
}

export default EscudoEquipo