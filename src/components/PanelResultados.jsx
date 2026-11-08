import { useState, useEffect } from 'react'
import {
  SHEET_CSV_URL,
  parsearCSV,
  generarIdPartido,
  leerPartidosPanel,
  leerResultadosPanel,
  aplicarResultados,
} from '../utils/datos'

function PanelResultados() {
  const [partidosPanel, setPartidosPanel] = useState(leerPartidosPanel())
  const [resultados, setResultados] = useState(leerResultadosPanel())
  const [partidosPlanilla, setPartidosPlanilla] = useState([])
  const [idElegido, setIdElegido] = useState("")
  const [golesLocal, setGolesLocal] = useState("")
  const [golesVisitante, setGolesVisitante] = useState("")
  const [error, setError] = useState("")
  const [ok, setOk] = useState("")

  // Trae los partidos de la planilla
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

  // Todos los partidos: los de la planilla (con los resultados cargados acá) y los programados desde el panel
  const todos = [...aplicarResultados(partidosPlanilla, resultados), ...partidosPanel]

  const pendientes = todos.filter(p => p.estado === "Próximo")
  const finalizados = todos.filter(p => p.estado === "Final")

  // Los partidos del panel tienen "id"; los de la planilla no
  function esDelPanel(partido) {
    return partido.id !== undefined
  }

  // ¿Se puede corregir? Sí si es del panel o si el resultado lo cargamos nosotros
  function sePuedeCorregir(partido) {
    return esDelPanel(partido) || resultados[generarIdPartido(partido)] !== undefined
  }

  function guardarPartidosPanel(lista) {
    setPartidosPanel(lista)
    localStorage.setItem("partidosPanel", JSON.stringify(lista))
  }

  function guardarResultados(objeto) {
    setResultados(objeto)
    localStorage.setItem("resultadosPanel", JSON.stringify(objeto))
  }

  function cargarResultado(e) {
    e.preventDefault()
    setOk("")

    if (idElegido === "") {
      setError("Elegí un partido.")
      return
    }
    if (golesLocal === "" || golesVisitante === "" || Number(golesLocal) < 0 || Number(golesVisitante) < 0) {
      setError("Cargá los goles de los dos equipos (0 o más).")
      return
    }

    const elegido = pendientes.find(p => generarIdPartido(p) === idElegido)
    const goles = { goles_local: Number(golesLocal), goles_visitante: Number(golesVisitante) }

    if (esDelPanel(elegido)) {
      guardarPartidosPanel(partidosPanel.map(p => {
        if (p.id === elegido.id) {
          return { ...p, ...goles, estado: "Final" }
        }
        return p
      }))
    } else {
      guardarResultados({ ...resultados, [idElegido]: goles })
    }

    setIdElegido("")
    setGolesLocal("")
    setGolesVisitante("")
    setError("")
    setOk(`Resultado guardado: ${elegido.equipo_local} ${golesLocal} - ${golesVisitante} ${elegido.equipo_visitante}.`)
  }

  // Vuelve el partido a "Próximo" para poder cargarlo de nuevo
  function corregir(partido) {
    if (!window.confirm("¿Querés borrar este resultado para cargarlo de nuevo?")) {
      return
    }

    if (esDelPanel(partido)) {
      guardarPartidosPanel(partidosPanel.map(p => {
        if (p.id === partido.id) {
          return { ...p, goles_local: 0, goles_visitante: 0, estado: "Próximo" }
        }
        return p
      }))
    } else {
      const copia = { ...resultados }
      delete copia[generarIdPartido(partido)]
      guardarResultados(copia)
    }
    setOk("")
  }

  return (
    <div className="panel__grid">
      <div className="panel__card">
        <h3 className="panel__title">Cargar resultado</h3>

        {pendientes.length === 0 ? (
          <p className="panel__vacio">
            No hay partidos pendientes. Programá uno en la pestaña Partidos.
          </p>
        ) : (
          <form onSubmit={cargarResultado}>
            <div className="form-field">
              <label htmlFor="resPartido">Partido</label>
              <select id="resPartido" value={idElegido} onChange={(e) => setIdElegido(e.target.value)}>
                <option value="">Elegí un partido...</option>
                {pendientes.map(p => (
                  <option key={generarIdPartido(p)} value={generarIdPartido(p)}>
                    {p.fecha} · {p.categoria} · {p.equipo_local} vs {p.equipo_visitante}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="resLocal">Goles del local</label>
              <input
                id="resLocal"
                type="number"
                min="0"
                value={golesLocal}
                onChange={(e) => setGolesLocal(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label htmlFor="resVisitante">Goles del visitante</label>
              <input
                id="resVisitante"
                type="number"
                min="0"
                value={golesVisitante}
                onChange={(e) => setGolesVisitante(e.target.value)}
              />
            </div>

            {error && <p className="form-error">{error}</p>}
            {ok && <p className="panel__ok">{ok}</p>}

            <button type="submit" className="btn btn--primary contact-form__submit">
              <i className="fa-solid fa-check"></i> Guardar resultado
            </button>
          </form>
        )}

        {pendientes.length === 0 && ok && <p className="panel__ok">{ok}</p>}
      </div>

      <div className="panel__columna">
        <div className="panel__card">
          <h3 className="panel__title">Resultados cargados ({finalizados.length})</h3>

          {finalizados.length === 0 ? (
            <p className="panel__vacio">Todavía no hay resultados cargados.</p>
          ) : (
            <table className="panel__tabla">
              <thead>
                <tr>
                  <th>Partido</th>
                  <th>Resultado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {finalizados.map(partido => (
                  <tr key={generarIdPartido(partido)}>
                    <td>
                      {partido.equipo_local} vs {partido.equipo_visitante}<br />
                      <small className="panel__vacio">{partido.fecha} · {partido.categoria}</small>
                    </td>
                    <td><strong>{partido.goles_local} - {partido.goles_visitante}</strong></td>
                    <td>
                      {sePuedeCorregir(partido) ? (
                        <button className="panel__borrar" onClick={() => corregir(partido)} title="Corregir">
                          <i className="fa-solid fa-rotate-left"></i>
                        </button>
                      ) : (
                        <span className="panel__planilla" title="Viene de la planilla">
                          <i className="fa-solid fa-lock"></i>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default PanelResultados