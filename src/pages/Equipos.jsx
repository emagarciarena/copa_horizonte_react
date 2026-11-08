import { useState, useEffect } from 'react'
import '../styles/styles-equipos.css'
import PageHeader from '../components/PageHeader'
import FiltroChips from '../components/FiltroChips'
import EscudoEquipo from '../components/EscudoEquipo'
import {
  SHEET_CSV_URL,
  SHEET_EQUIPOS_CSV_URL,
  CATEGORIAS,
  parsearCSV,
  armarLogos,
  armarLinks,
  armarLinkImagenDrive,
  calcularTodosLosEquipos,
  mezclarPartidos,
} from '../utils/datos'

function Equipos() {
  const [partidos, setPartidos] = useState([])
  const [logos, setLogos] = useState({})
  const [links, setLinks] = useState({})
  const [cargando, setCargando] = useState(true)
  const [categoria, setCategoria] = useState("Todos")
  const [busqueda, setBusqueda] = useState("")

  useEffect(() => {
    async function cargarDatos() {
      try {
        const respuestaPartidos = await fetch(SHEET_CSV_URL)
        setPartidos(mezclarPartidos(parsearCSV(await respuestaPartidos.text())))

        const respuestaEquipos = await fetch(SHEET_EQUIPOS_CSV_URL)
        const filasEquipos = parsearCSV(await respuestaEquipos.text())
        setLogos(armarLogos(filasEquipos))
        setLinks(armarLinks(filasEquipos))
      } catch (error) {
        console.error("Error al cargar los datos:", error)
      }
      setCargando(false)
    }
    cargarDatos()
  }, [])

    // equipos que agregó el administrador desde el panel
  const equiposPanel = JSON.parse(localStorage.getItem("equiposPanel")) || []
  const logosPanel = {}
  equiposPanel.forEach(eq => {
    if (eq.logo) logosPanel[eq.nombre] = armarLinkImagenDrive(eq.logo)
  })

  const equiposDelSheet = calcularTodosLosEquipos(partidos)
  const nuevos = equiposPanel
    .filter(eq => !equiposDelSheet.some(e => e.nombre === eq.nombre && e.categoria === eq.categoria))
    .map(eq => ({ nombre: eq.nombre, categoria: eq.categoria, pj: 0, pts: 0 }))
  const todos = [...equiposDelSheet, ...nuevos]

  const filtrados = todos.filter(equipo => {
    const coincideCategoria = categoria === "Todos" || equipo.categoria === categoria
    const coincideBusqueda = equipo.nombre.toLowerCase().includes(busqueda.toLowerCase())
    return coincideCategoria && coincideBusqueda
  })

  return (
    <>
      <PageHeader
        titulo="Equipos"
        subtitulo={`${filtrados.length} ${filtrados.length === 1 ? "equipo" : "equipos"} · Temporada 2026`}
        icono="fa-solid fa-shield-halved"
      />

      <section className="filters">
        <div className="team-search">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            placeholder="Buscar equipo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <FiltroChips opciones={["Todos", ...CATEGORIAS]} activo={categoria} onCambiar={setCategoria} />
      </section>

      {cargando && <p style={{ textAlign: "center", padding: "40px 0" }}>Cargando equipos...</p>}

      <div className="teams-grid">
        {!cargando && filtrados.length === 0 && (
          <p style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px 0" }}>
            No se encontraron equipos
          </p>
        )}

        {filtrados.map((equipo, index) => (
          <a
            key={index}
            className="team-card"
            href={links[equipo.nombre]}
            target="_blank"
            rel="noopener"
          >
            <EscudoEquipo nombre={equipo.nombre} logos={{...logos, ...logosPanel}} clase="team-card__badge" />
            <div className="team-card__name">{equipo.nombre}</div>
            <div className="team-card__category">{equipo.categoria}</div>
            <div className="team-card__stats">
              <span className="team-card__pj">{equipo.pj} PJ</span>
              <span className="team-card__pts">{equipo.pts} pts</span>
            </div>
          </a>
        ))}
      </div>
    </>
  )
}

export default Equipos