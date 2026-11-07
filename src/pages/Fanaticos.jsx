import { useState, useEffect } from 'react'
import '../styles/styles-fanaticos.css'
import PageHeader from '../components/PageHeader'
import FilaVoto from '../components/FilaVoto'
import FilaPrediccion from '../components/FilaPrediccion'
import {
  SHEET_CSV_URL,
  SHEET_EQUIPOS_CSV_URL,
  parsearCSV,
  armarLogos,
  obtenerListaEquipos,
  generarIdPartido,
} from '../utils/datos'

function Fanaticos({ usuario, onIngresar }) {
  const [partidos, setPartidos] = useState([])
  const [logos, setLogos] = useState({})
  const [cargando, setCargando] = useState(true)

  // Los votos se guardan así: { fan1: "La Tablada", fan2: "UNRC" }
  const [votos, setVotos] = useState(JSON.parse(localStorage.getItem("votosPorUsuario")) || {})

  // Las predicciones se guardan así: { fan1: { "idDelPartido": "La Tablada" }, fan2: {...} }
  const [predicciones, setPredicciones] = useState(
    JSON.parse(localStorage.getItem("prediccionesPorUsuario")) || {}
  )

  useEffect(() => {
    async function cargarDatos() {
      try {
        const respuestaPartidos = await fetch(SHEET_CSV_URL)
        setPartidos(parsearCSV(await respuestaPartidos.text()))

        const respuestaEquipos = await fetch(SHEET_EQUIPOS_CSV_URL)
        setLogos(armarLogos(parsearCSV(await respuestaEquipos.text())))
      } catch (error) {
        console.error("Error al cargar los datos:", error)
      }
      setCargando(false)
    }
    cargarDatos()
  }, [])

  function votar(equipo) {
    // Sin sesión no se puede votar: se abre el modal
    if (!usuario) {
      onIngresar()
      return
    }

    // Copiamos los votos, cambiamos el del usuario (si ya había votado se reemplaza) y guardamos
    const nuevosVotos = { ...votos }
    nuevosVotos[usuario] = equipo
    setVotos(nuevosVotos)
    localStorage.setItem("votosPorUsuario", JSON.stringify(nuevosVotos))
  }

  function predecir(idPartido, equipo) {
    if (!usuario) {
      onIngresar()
      return
    }

    // Copiamos las predicciones de este usuario, cambiamos la de este partido y guardamos
    const susPredicciones = { ...predicciones[usuario] }
    susPredicciones[idPartido] = equipo

    const nuevasPredicciones = { ...predicciones }
    nuevasPredicciones[usuario] = susPredicciones

    setPredicciones(nuevasPredicciones)
    localStorage.setItem("prediccionesPorUsuario", JSON.stringify(nuevasPredicciones))
  }

  // Cuántos votos tiene cada equipo: { "La Tablada": 2, "UNRC": 1 }
  const conteo = {}
  Object.values(votos).forEach(equipo => {
    conteo[equipo] = (conteo[equipo] || 0) + 1
  })
  const totalVotos = Object.values(votos).length

  // Equipos ordenados del más votado al menos votado
  const equipos = obtenerListaEquipos(partidos)
  equipos.sort((a, b) => (conteo[b] || 0) - (conteo[a] || 0))

  // Partidos que todavía no se jugaron y lo que predijo el usuario actual
  const proximos = partidos.filter(partido => partido.estado === "Próximo")
  const misPredicciones = predicciones[usuario] || {}

  return (
    <>
      <PageHeader
        titulo="Fanáticos"
        subtitulo="Votá y hacé sentir tu apoyo · Temporada 2026"
        icono="fa-solid fa-heart"
      />

      <div className="section-title">
        <h2>Equipo favorito</h2>
      </div>

      <section className="fan-section">
        <p className="vote-summary">
          {totalVotos} {totalVotos === 1 ? "voto" : "votos"} en total
        </p>

        {cargando && <p style={{ textAlign: "center", padding: "40px 0" }}>Cargando equipos...</p>}

        <ul className="vote-list">
          {equipos.map((equipo, index) => {
            const cantidad = conteo[equipo] || 0
            const porcentaje = totalVotos > 0 ? Math.round((cantidad / totalVotos) * 100) : 0

            return (
              <FilaVoto
                key={equipo}
                puesto={index + 1}
                equipo={equipo}
                logos={logos}
                cantidad={cantidad}
                porcentaje={porcentaje}
                esMio={votos[usuario] === equipo}
                esLider={index === 0 && cantidad > 0}
                onVotar={votar}
              />
            )
          })}
        </ul>
      </section>

      <div className="section-title">
        <h2>Predicciones</h2>
      </div>

      <section className="fan-section">
        {!cargando && proximos.length === 0 && (
          <p className="predict-row__empty">No hay partidos próximos para predecir todavía</p>
        )}

        <ul className="predict-list">
          {proximos.map(partido => {
            const id = generarIdPartido(partido)

            // Contamos cuántos usuarios eligieron a cada equipo en este partido
            let votosLocal = 0
            let votosVisitante = 0
            Object.values(predicciones).forEach(deUnUsuario => {
              if (deUnUsuario[id] === partido.equipo_local) votosLocal++
              if (deUnUsuario[id] === partido.equipo_visitante) votosVisitante++
            })

            return (
              <FilaPrediccion
                key={id}
                partido={partido}
                logos={logos}
                votosLocal={votosLocal}
                votosVisitante={votosVisitante}
                eleccion={misPredicciones[id]}
                onPredecir={(equipo) => predecir(id, equipo)}
              />
            )
          })}
        </ul>
      </section>
    </>
  )
}

export default Fanaticos