import { useState, useEffect } from 'react'
import '../styles/styles-cronograma.css'
import PageHeader from '../components/PageHeader'
import FiltroChips from '../components/FiltroChips'
import MatchCard from '../components/MatchCard'
import {
  SHEET_CSV_URL,
  SHEET_EQUIPOS_CSV_URL,
  CATEGORIAS,
  parsearCSV,
  armarLogos,
  agruparPorFecha,
  mezclarPartidos,
} from '../utils/datos'

const ESTADOS = ["Todos", "Próximos", "Finalizados"]

function Cronograma() {
  const [partidos, setPartidos] = useState([])
  const [logos, setLogos] = useState({})
  const [cargando, setCargando] = useState(true)
  const [estado, setEstado] = useState("Todos")
  const [categoria, setCategoria] = useState("Todas")

  useEffect(() => {
    async function cargarDatos() {
      try {
        const respuestaPartidos = await fetch(SHEET_CSV_URL)
        setPartidos(mezclarPartidos(parsearCSV(await respuestaPartidos.text())))

        const respuestaEquipos = await fetch(SHEET_EQUIPOS_CSV_URL)
        setLogos(armarLogos(parsearCSV(await respuestaEquipos.text())))
      } catch (error) {
        console.error("Error al cargar los datos:", error)
      }
      setCargando(false)
    }
    cargarDatos()
  }, [])

  const filtrados = partidos.filter(partido => {
    const coincideEstado =
      estado === "Todos" ||
      (estado === "Próximos" && partido.estado === "Próximo") ||
      (estado === "Finalizados" && partido.estado === "Final")

    const coincideCategoria = categoria === "Todas" || partido.categoria === categoria

    return coincideEstado && coincideCategoria
  })

  const grupos = agruparPorFecha(filtrados)

  return (
    <>
      <PageHeader
        titulo="Cronograma"
        subtitulo="Fixture completo · Temporada 2026"
        icono="fa-regular fa-calendar"
      />

      <section className="filters">
        <FiltroChips opciones={ESTADOS} activo={estado} onCambiar={setEstado} />
        <FiltroChips opciones={["Todas", ...CATEGORIAS]} activo={categoria} onCambiar={setCategoria} />

        {cargando && <p style={{ textAlign: "center", padding: "40px 0" }}>Cargando partidos...</p>}

        {!cargando && grupos.length === 0 && (
          <p style={{ textAlign: "center", padding: "40px 0" }}>No hay partidos para este filtro</p>
        )}

        {grupos.map((grupo, index) => (
          <div className="match-day" key={index}>
            <p className="match-day__date">{grupo.fecha}</p>
            <ul className="matches-list">
              {grupo.partidos.map((partido, i) => (
                <MatchCard key={i} partido={partido} logos={logos} />
              ))}
            </ul>
          </div>
        ))}
      </section>
    </>
  )
}

export default Cronograma