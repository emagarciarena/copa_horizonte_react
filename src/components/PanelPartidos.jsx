import { useState, useEffect } from 'react'
import {
  SHEET_CSV_URL,
  CATEGORIAS,
  parsearCSV,
  generarIdPartido,
  leerResultadosPanel,
  aplicarResultados,
  formatearFecha,
  leerPartidosPanel,
} from '../utils/datos'

function PanelPartidos() {
  const [partidos, setPartidos] = useState(leerPartidosPanel())
  const [partidosPlanilla, setPartidosPlanilla] = useState([])
  const [categoria, setCategoria] = useState(CATEGORIAS[0])
  const [local, setLocal] = useState("")
  const [visitante, setVisitante] = useState("")
  const [fecha, setFecha] = useState("")
  const [horario, setHorario] = useState("")
  const [cancha, setCancha] = useState("")
  const [error, setError] = useState("")
  const [ok, setOk] = useState("")

  // Equipos que cargó el administrador en la pestaña Equipos
  const equiposPanel = JSON.parse(localStorage.getItem("equiposPanel")) || []

  // Trae los equipos de la planilla
  useEffect(() => {
    async function cargarDatos() {
      try {
        const respuesta = await fetch(SHEET_CSV_URL)
        setPartidosPlanilla(parsearCSV(await respuesta.text()))
      } catch (error) {
        console.error("Error al cargar los partidos:", error)
      }
    }
    cargarDatos()
  }, [])

  // Todos los equipos que aparecen en algún partido de la planilla (jueguen o no todavía)
  const equiposPlanilla = []
  partidosPlanilla.forEach(p => {
    equiposPlanilla.push({ nombre: p.equipo_local, categoria: p.categoria })
    equiposPlanilla.push({ nombre: p.equipo_visitante, categoria: p.categoria })
  })

  // Partidos de la planilla (con los resultados que cargó el administrador)
  const partidosDeLaPlanilla = aplicarResultados(partidosPlanilla, leerResultadosPanel())

  // Solo los equipos de la categoría elegida (sin repetir)
  const nombresDeLaCategoria = [...new Set(
    [...equiposPlanilla, ...equiposPanel]
      .filter(eq => eq.categoria === categoria)
      .map(eq => eq.nombre)
  )]

  function cambiarCategoria(nueva) {
    setCategoria(nueva)
    setLocal("")
    setVisitante("")
  }

  function guardar(lista) {
    setPartidos(lista)
    localStorage.setItem("partidosPanel", JSON.stringify(lista))
  }

  function agregar(e) {
    e.preventDefault()
    setOk("")

    if (local === "" || visitante === "") {
      setError("Elegí el equipo local y el visitante.")
      return
    }
    if (local === visitante) {
      setError("El local y el visitante no pueden ser el mismo equipo.")
      return
    }
    if (fecha === "" || horario === "") {
      setError("Completá la fecha y el horario.")
      return
    }
    if (cancha.trim() === "") {
      setError("Escribí la cancha.")
      return
    }

    const repetido = partidos.some(
      p => p.fechaISO === fecha && p.categoria === categoria &&
           p.equipo_local === local && p.equipo_visitante === visitante
    )
    if (repetido) {
      setError("Ese partido ya está cargado.")
      return
    }

    const nuevo = {
      id: Date.now(),
      fechaISO: fecha,
      fecha: formatearFecha(fecha),
      horario,
      cancha: cancha.trim(),
      categoria,
      equipo_local: local,
      equipo_visitante: visitante,
      goles_local: 0,
      goles_visitante: 0,
      estado: "Próximo",
    }
    guardar([...partidos, nuevo])
    setLocal("")
    setVisitante("")
    setError("")
    setOk(`Partido ${local} vs ${visitante} programado.`)
  }

  function eliminar(partido) {
    if (window.confirm(`¿Eliminar ${partido.equipo_local} vs ${partido.equipo_visitante}?`)) {
      guardar(partidos.filter(p => p.id !== partido.id))
      setOk("")
    }
  }

  // Los ordenamos por fecha
  const ordenados = [...partidos].sort((a, b) => a.fechaISO.localeCompare(b.fechaISO))

  return (
    <div className="panel__grid">
      <div className="panel__card">
        <h3 className="panel__title">Programar partido</h3>
        <form onSubmit={agregar}>
          <div className="form-field">
            <label htmlFor="parCategoria">Categoría</label>
            <select id="parCategoria" value={categoria} onChange={(e) => cambiarCategoria(e.target.value)}>
              {CATEGORIAS.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="parLocal">Equipo local</label>
            <select id="parLocal" value={local} onChange={(e) => setLocal(e.target.value)}>
              <option value="">Elegí un equipo...</option>
              {nombresDeLaCategoria.map(nombre => (
                <option key={nombre} value={nombre}>{nombre}</option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="parVisitante">Equipo visitante</label>
            <select id="parVisitante" value={visitante} onChange={(e) => setVisitante(e.target.value)}>
              <option value="">Elegí un equipo...</option>
              {nombresDeLaCategoria.map(nombre => (
                <option key={nombre} value={nombre}>{nombre}</option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="parFecha">Fecha</label>
            <input id="parFecha" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
          </div>

          <div className="form-field">
            <label htmlFor="parHorario">Horario</label>
            <input id="parHorario" type="time" value={horario} onChange={(e) => setHorario(e.target.value)} />
          </div>

          <div className="form-field">
            <label htmlFor="parCancha">Cancha</label>
            <input
              id="parCancha"
              type="text"
              placeholder="Ej: Cancha 1"
              value={cancha}
              onChange={(e) => setCancha(e.target.value)}
            />
          </div>

          {error && <p className="form-error">{error}</p>}
          {ok && <p className="panel__ok">{ok}</p>}

          <button type="submit" className="btn btn--primary contact-form__submit">
            <i className="fa-solid fa-plus"></i> Programar partido
          </button>
        </form>
      </div>

      <div className="panel__card">
        <h3 className="panel__title">Partidos programados ({partidosDeLaPlanilla.length + partidos.length})</h3>

        {partidosDeLaPlanilla.length + partidos.length === 0 ? (
          <p className="panel__vacio">Todavía no programaste partidos.</p>
        ) : (
          <table className="panel__tabla">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Partido</th>
                <th>Categoría</th>
                <th>Cancha</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
               {partidosDeLaPlanilla.map(partido => (
                <tr key={generarIdPartido(partido)}>
                  <td>{partido.fecha}<br /><small className="panel__vacio">{partido.horario ? `${partido.horario} hs` : "-"}</small></td>
                  <td><strong>{partido.equipo_local}</strong> vs <strong>{partido.equipo_visitante}</strong></td>
                  <td><span className="panel__pill">{partido.categoria}</span></td>
                  <td>{partido.cancha}</td>
                  <td>{partido.estado}</td>
                  <td>
                    <span className="panel__planilla" title="Viene de la planilla">
                      <i className="fa-solid fa-lock"></i>
                    </span>
                  </td>
                </tr>
              ))}
              {ordenados.map(partido => (
                <tr key={partido.id}>
                  <td>{partido.fecha}<br /><small className="panel__vacio">{partido.horario ? `${partido.horario} hs` : "-"}</small></td>
                  <td><strong>{partido.equipo_local}</strong> vs <strong>{partido.equipo_visitante}</strong></td>
                  <td><span className="panel__pill">{partido.categoria}</span></td>
                  <td>{partido.cancha}</td>
                  <td>{partido.estado}</td>
                  <td>
                    <button className="panel__borrar" onClick={() => eliminar(partido)} title="Eliminar">
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default PanelPartidos