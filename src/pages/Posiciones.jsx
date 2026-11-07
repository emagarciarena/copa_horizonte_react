import { useState, useEffect } from 'react'
import '../styles/styles-posiciones.css'
import PageHeader from '../components/PageHeader'
import FiltroChips from '../components/FiltroChips'
import { SHEET_CSV_URL, CATEGORIAS, parsearCSV, calcularTabla } from '../utils/datos'

function Posiciones() {
  const [partidos, setPartidos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [categoria, setCategoria] = useState("Sub 14")

  useEffect(() => {
    async function cargarDatos() {
      try {
        const respuesta = await fetch(SHEET_CSV_URL)
        const texto = await respuesta.text()
        setPartidos(parsearCSV(texto))
      } catch (error) {
        console.error("Error al cargar los partidos:", error)
      }
      setCargando(false)
    }
    cargarDatos()
  }, [])

  const equipos = calcularTabla(partidos, categoria)

  return (
    <>
      <PageHeader
        titulo="Posiciones"
        subtitulo="Por zona · Temporada 2026"
        icono="fa-solid fa-trophy"
      />

      <section className="filters">
        <FiltroChips opciones={CATEGORIAS} activo={categoria} onCambiar={setCategoria} />
      </section>

      <section className="standings">
        {cargando ? (
          <p className="standings__count">Cargando posiciones...</p>
        ) : (
          <>
            <p className="standings__count">
              {equipos.length} {equipos.length === 1 ? "equipo" : "equipos"}
            </p>

            <table className="standings-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Equipo</th>
                  <th>PJ</th>
                  <th>G</th>
                  <th>E</th>
                  <th>P</th>
                  <th>GF</th>
                  <th>GC</th>
                  <th>DG</th>
                  <th>PTS</th>
                </tr>
              </thead>
              <tbody>
                {equipos.length === 0 && (
                  <tr>
                    <td colSpan="10" style={{ textAlign: "center", padding: 30 }}>
                      Todavía no hay partidos finalizados en esta categoría
                    </td>
                  </tr>
                )}

                {equipos.map((equipo, index) => (
                  <tr key={index}>
                    <td>
                      <span className={index === 0 ? "rank-badge rank-badge--leader" : "rank-badge"}>
                        {index + 1}
                      </span>
                    </td>
                    <td>{equipo.nombre}</td>
                    <td>{equipo.pj}</td>
                    <td>{equipo.g}</td>
                    <td>{equipo.e}</td>
                    <td>{equipo.p}</td>
                    <td>{equipo.gf}</td>
                    <td>{equipo.gc}</td>
                    <td className={equipo.dg > 0 ? "dg-positivo" : equipo.dg < 0 ? "dg-negativo" : ""}>
                      {equipo.dg > 0 ? "+" + equipo.dg : equipo.dg}
                    </td>
                    <td>{equipo.pts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </section>
    </>
  )
}

export default Posiciones