import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import '../styles/styles-panel.css'
import PageHeader from '../components/PageHeader'
import FiltroChips from '../components/FiltroChips'
import PanelEquipos from '../components/PanelEquipos'
import PanelJugadoras from '../components/PanelJugadoras'
import PanelPartidos from '../components/PanelPartidos'
import PanelResultados from '../components/PanelResultados'

const SECCIONES = ["Equipos", "Jugadoras", "Partidos", "Resultados"]

function Panel({ rol }) {
  const [seccion, setSeccion] = useState("Equipos")

  // Si no es administrador, lo mandamos al inicio
  if (rol !== "Administrador") {
    return <Navigate to="/" />
  }

  return (
    <>
      <PageHeader
        titulo="Panel de administración"
        subtitulo="Gestioná la liga · Temporada 2026"
        icono="fa-solid fa-user-shield"
      />

      <section className="filters">
        <FiltroChips opciones={SECCIONES} activo={seccion} onCambiar={setSeccion} />
      </section>

      <section className="panel">
        {seccion === "Equipos" && <PanelEquipos />}
        {seccion === "Jugadoras" && <PanelJugadoras />}
        {seccion === "Partidos" && <PanelPartidos />}
        {seccion === "Resultados" && <PanelResultados />}
      </section>
    </>
  )
}

export default Panel