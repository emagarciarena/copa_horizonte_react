import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import '../styles/styles-panel.css'
import PageHeader from '../components/PageHeader'
import FiltroChips from '../components/FiltroChips'
import PanelEquipos from '../components/PanelEquipos'

const SECCIONES = ["Equipos", "Jugadoras", "Partidos", "Resultados y puntos"]

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

        {seccion !== "Equipos" && (
            <div className="panel__card">
                <h3 className="panel__title">{seccion}</h3>
                <p>Esta sección la armamos en el próximo paso.</p>
            </div>
        )}
      </section>
    </>
  )
}

export default Panel