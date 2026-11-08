import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../styles/styles-index.css'
import ResultCard from '../components/ResultCard'
import { SHEET_CSV_URL, SHEET_EQUIPOS_CSV_URL, parsearCSV, armarLogos, mezclarPartidos } from '../utils/datos'

function Inicio() {
  const [partidos, setPartidos] = useState([])
  const [logos, setLogos] = useState({})
  const [cargando, setCargando] = useState(true)

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

  const proximos = partidos.filter(p => p.estado === "Próximo").slice(0, 3)
  const ultimos = partidos.filter(p => p.estado === "Final").slice(0, 3)

  return (
    <>
      <section className="hero">
        <div className="hero__overlay"></div>

        <div className="hero__content">
          <div className="hero__season">
            <span className="hero__season-line"></span>
            <span>Temporada 2026</span>
            <span className="hero__season-line"></span>
          </div>

          <h1 className="hero__title">
            <span>COPA</span>
            <span className="hero__title--accent">HORIZONTE</span>
          </h1>

          <p className="hero__tagline">Liga de Hockey</p>

          <div className="hero__ornament"></div>

          <Link to="/cronograma" className="btn btn--primary">Ver cronograma</Link>

          <div className="hero__app">
            <p>Seguí el torneo desde tu celular</p>
            <div className="hero__app-badges">
              <a href="#" className="app-badge"><i className="fa-brands fa-apple"></i> App Store</a>
              <a href="#" className="app-badge"><i className="fa-brands fa-google-play"></i> Google Play</a>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="section-title">
          <h2>Próximos partidos</h2>
        </div>

        {cargando && <p style={{ textAlign: "center", padding: "20px 0" }}>Cargando...</p>}

        {!cargando && proximos.length === 0 && (
          <div className="empty-state">
            <i className="fa-regular fa-calendar"></i>
            <p>No hay partidos programados próximamente.</p>
          </div>
        )}

        <div className="results-grid">
          {proximos.map((partido, index) => (
            <ResultCard key={index} partido={partido} logos={logos} />
          ))}
        </div>
      </section>

      <section>
        <div className="section-title">
          <h2>Últimos resultados</h2>
        </div>

        {cargando && <p style={{ textAlign: "center", padding: "20px 0" }}>Cargando...</p>}

        <div className="results-grid">
          {ultimos.map((partido, index) => (
            <ResultCard key={index} partido={partido} logos={logos} />
          ))}
        </div>
      </section>
    </>
  )
}

export default Inicio