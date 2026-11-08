import { useState, useEffect } from 'react'
import {
  SHEET_CSV_URL,
  parsearCSV,
  calcularTodosLosEquipos,
} from '../utils/datos'

const POSICIONES = ["Arquera", "Defensora", "Mediocampista", "Delantera"]

function PanelJugadoras() {
  const [jugadoras, setJugadoras] = useState(
    JSON.parse(localStorage.getItem("jugadorasPanel")) || []
  )
  const [equiposPlanilla, setEquiposPlanilla] = useState([])
  const [nombre, setNombre] = useState("")
  const [equipo, setEquipo] = useState("")
  const [numero, setNumero] = useState("")
  const [posicion, setPosicion] = useState(POSICIONES[0])
  const [error, setError] = useState("")
  const [ok, setOk] = useState("")

  // Equipos que cargó el administrador en la pestaña Equipos
  const equiposPanel = JSON.parse(localStorage.getItem("equiposPanel")) || []

  // Trae los equipos de la planilla
  useEffect(() => {
    async function cargarDatos() {
      try {
        const respuesta = await fetch(SHEET_CSV_URL)
        setEquiposPlanilla(calcularTodosLosEquipos(parsearCSV(await respuesta.text())))
      } catch (error) {
        console.error("Error al cargar los equipos:", error)
      }
    }
    cargarDatos()
  }, [])

  // Lista de opciones del selector: "Nombre (Categoría)"
  const opciones = [...equiposPlanilla, ...equiposPanel].map(eq => `${eq.nombre} (${eq.categoria})`)

  function guardar(lista) {
    setJugadoras(lista)
    localStorage.setItem("jugadorasPanel", JSON.stringify(lista))
  }

  function agregar(e) {
    e.preventDefault()
    setOk("")

    if (nombre.trim() === "") {
      setError("Escribí el nombre y apellido.")
      return
    }
    if (equipo === "") {
      setError("Elegí un equipo.")
      return
    }
    if (numero === "" || Number(numero) < 1 || Number(numero) > 99) {
      setError("El número de camiseta tiene que ser entre 1 y 99.")
      return
    }

    const numeroRepetido = jugadoras.some(j => j.equipo === equipo && j.numero === Number(numero))
    if (numeroRepetido) {
      setError("Ese número ya lo tiene otra jugadora del equipo.")
      return
    }

    const nueva = {
      id: Date.now(),
      nombre: nombre.trim(),
      equipo,
      numero: Number(numero),
      posicion,
    }
    guardar([...jugadoras, nueva])
    setNombre("")
    setNumero("")
    setError("")
    setOk(`${nueva.nombre} fue agregada a ${nueva.equipo}.`)
  }

  function eliminar(jugadora) {
    if (window.confirm(`¿Eliminar a ${jugadora.nombre}?`)) {
      guardar(jugadoras.filter(j => j.id !== jugadora.id))
      setOk("")
    }
  }

  return (
    <div className="panel__grid">
      <div className="panel__card">
        <h3 className="panel__title">Nueva jugadora</h3>
        <form onSubmit={agregar}>
          <div className="form-field">
            <label htmlFor="jugNombre">Nombre y apellido</label>
            <input
              id="jugNombre"
              type="text"
              placeholder="Ej: Sofía Martínez"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="jugEquipo">Equipo</label>
            <select id="jugEquipo" value={equipo} onChange={(e) => setEquipo(e.target.value)}>
              <option value="">Elegí un equipo...</option>
              {opciones.map(op => (
                <option key={op} value={op}>{op}</option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="jugNumero">Número de camiseta</label>
            <input
              id="jugNumero"
              type="number"
              placeholder="1 a 99"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="jugPosicion">Posición</label>
            <select id="jugPosicion" value={posicion} onChange={(e) => setPosicion(e.target.value)}>
              {POSICIONES.map(pos => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </select>
          </div>

          {error && <p className="form-error">{error}</p>}
          {ok && <p className="panel__ok">{ok}</p>}

          <button type="submit" className="btn btn--primary contact-form__submit">
            <i className="fa-solid fa-plus"></i> Agregar jugadora
          </button>
        </form>
      </div>

      <div className="panel__card">
        <h3 className="panel__title">Jugadoras cargadas ({jugadoras.length})</h3>

        {jugadoras.length === 0 ? (
          <p className="panel__vacio">Todavía no cargaste jugadoras.</p>
        ) : (
          <table className="panel__tabla">
            <thead>
              <tr>
                <th>N°</th>
                <th>Jugadora</th>
                <th>Equipo</th>
                <th>Posición</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {jugadoras.map(jugadora => (
                <tr key={jugadora.id}>
                  <td><span className="panel__numero">{jugadora.numero}</span></td>
                  <td><strong>{jugadora.nombre}</strong></td>
                  <td>{jugadora.equipo}</td>
                  <td><span className="panel__pill">{jugadora.posicion}</span></td>
                  <td>
                    <button className="panel__borrar" onClick={() => eliminar(jugadora)} title="Eliminar">
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

export default PanelJugadoras