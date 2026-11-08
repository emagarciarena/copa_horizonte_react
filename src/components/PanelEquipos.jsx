import { useState, useEffect } from 'react'
import EscudoEquipo from './EscudoEquipo'
import {
  SHEET_CSV_URL,
  SHEET_EQUIPOS_CSV_URL,
  CATEGORIAS,
  parsearCSV,
  armarLogos,
  armarLinkImagenDrive,
  calcularTodosLosEquipos,
} from '../utils/datos'

function PanelEquipos() {
  const [equipos, setEquipos] = useState(
    JSON.parse(localStorage.getItem("equiposPanel")) || []
  )
  const [nombre, setNombre] = useState("")
  const [categoria, setCategoria] = useState(CATEGORIAS[0])
  const [logo, setLogo] = useState("")
  const [error, setError] = useState("")
  const [ok, setOk] = useState("")
  const [equiposPlanilla, setEquiposPlanilla] = useState([])
  const [logosPlanilla, setLogosPlanilla] = useState({})

  // Trae los equipos que ya existen en la planilla
  useEffect(() => {
    async function cargarDatos() {
      try {
        const respuestaPartidos = await fetch(SHEET_CSV_URL)
        setEquiposPlanilla(calcularTodosLosEquipos(parsearCSV(await respuestaPartidos.text())))

        const respuestaEquipos = await fetch(SHEET_EQUIPOS_CSV_URL)
        setLogosPlanilla(armarLogos(parsearCSV(await respuestaEquipos.text())))
      } catch (error) {
        console.error("Error al cargar los equipos:", error)
      }
    }
    cargarDatos()
  }, [])

  function guardar(lista) {
    setEquipos(lista)
    localStorage.setItem("equiposPanel", JSON.stringify(lista))
  }

  function agregar(e) {
    e.preventDefault()
    setOk("")

    if (nombre.trim() === "") {
      setError("Escribí el nombre del equipo.")
      return
    }

    const repetido = [...equiposPlanilla, ...equipos].some(
      eq => eq.nombre.toLowerCase() === nombre.trim().toLowerCase() && eq.categoria === categoria
    )
    if (repetido) {
      setError("Ese equipo ya existe en esa categoría.")
      return
    }

    const nuevo = { id: Date.now(), nombre: nombre.trim(), categoria, logo: logo.trim() }
    guardar([...equipos, nuevo])
    setNombre("")
    setLogo("")
    setError("")
    setOk(`Equipo "${nuevo.nombre}" agregado.`)
  }

  function eliminar(equipo) {
    if (window.confirm(`¿Eliminar a ${equipo.nombre}?`)) {
      guardar(equipos.filter(eq => eq.id !== equipo.id))
      setOk("")
    }
  }

  return (
    <div className="panel__grid">
      <div className="panel__card">
        <h3 className="panel__title">Nuevo equipo</h3>
        <form onSubmit={agregar}>
          <div className="form-field">
            <label htmlFor="eqNombre">Nombre</label>
            <input
              id="eqNombre"
              type="text"
              placeholder="Ej: Club Atlético Central"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="eqCategoria">Categoría</label>
            <select id="eqCategoria" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
              {CATEGORIAS.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="eqLogo">Link del escudo (opcional)</label>
            <input
              id="eqLogo"
              type="text"
              placeholder="https://..."
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
            />
          </div>

          {error && <p className="form-error">{error}</p>}
          {ok && <p className="panel__ok">{ok}</p>}

          <button type="submit" className="btn btn--primary contact-form__submit">
            <i className="fa-solid fa-plus"></i> Agregar equipo
          </button>
        </form>
      </div>

      <div className="panel__card">
        <h3 className="panel__title">Equipos cargados ({equiposPlanilla.length + equipos.length}) </h3>

        {equiposPlanilla.length + equipos.length === 0 ? (
          <p className="panel__vacio">Todavía no cargaste equipos.</p>
        ) : (
          <table className="panel__tabla">
            <thead>
              <tr>
                <th>Equipo</th>
                <th>Categoría</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
                {equiposPlanilla.map(equipo => (
                <tr key={equipo.nombre + equipo.categoria}>
                  <td>
                    <div className="panel__equipo">
                      <EscudoEquipo nombre={equipo.nombre} logos={logosPlanilla} clase="panel__badge" />
                      <span>{equipo.nombre}</span>
                    </div>
                  </td>
                  <td><span className="panel__pill">{equipo.categoria}</span></td>
                  <td>
                    <span className="panel__planilla" title="Viene de la planilla">
                      <i className="fa-solid fa-lock"></i>
                    </span>
                  </td>
                </tr>
                ))}
              {equipos.map(equipo => (
                <tr key={equipo.id}>
                  <td>
                    <div className="panel__equipo">
                      <EscudoEquipo
                        nombre={equipo.nombre}
                        logos={{ [equipo.nombre]: equipo.logo ? armarLinkImagenDrive(equipo.logo) : "" }}
                        clase="panel__badge"
                      />
                      <span>{equipo.nombre}</span>
                    </div>
                  </td>
                  <td><span className="panel__pill">{equipo.categoria}</span></td>
                  <td>
                    <button className="panel__borrar" onClick={() => eliminar(equipo)} title="Eliminar">
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

export default PanelEquipos