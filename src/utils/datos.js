export const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSLj-lJamDKc9Y7bWZbDJUz5zThrZ-oadBfnZCPgYmOee7pX9W16iybjY2v4xCxUn1kmn5jGR0jmlJs/pub?gid=0&single=true&output=csv"

export const SHEET_EQUIPOS_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSLj-lJamDKc9Y7bWZbDJUz5zThrZ-oadBfnZCPgYmOee7pX9W16iybjY2v4xCxUn1kmn5jGR0jmlJs/pub?gid=53800298&single=true&output=csv"

export const CATEGORIAS = ["Sub 14", "Sub 16", "Sub 19", "Intermedia", "Primera"]

export function parsearCSV(texto) {
  const filas = texto.trim().split("\n")
  const encabezados = parsearFila(filas[0]).map(h => h.trim())

  return filas.slice(1).map(fila => {
    const valores = parsearFila(fila)
    const objeto = {}
    encabezados.forEach((encabezado, i) => {
      objeto[encabezado] = valores[i] ? valores[i].trim() : ""
    })
    return objeto
  })
}

function parsearFila(fila) {
  const valores = []
  let actual = ""
  let dentroDeComillas = false

  for (const char of fila) {
    if (char === '"') {
      dentroDeComillas = !dentroDeComillas
    } else if (char === "," && !dentroDeComillas) {
      valores.push(actual)
      actual = ""
    } else {
      actual += char
    }
  }
  valores.push(actual)
  return valores
}

function crearEquipoVacio(nombre) {
  return { nombre, pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 }
}

export function calcularTabla(partidos, categoria) {
  const finalizados = partidos.filter(
    p => p.estado === "Final" && p.categoria === categoria
  )

  const tabla = {}

  finalizados.forEach(partido => {
    const local = partido.equipo_local
    const visitante = partido.equipo_visitante
    const golesLocal = parseInt(partido.goles_local) || 0
    const golesVisitante = parseInt(partido.goles_visitante) || 0

    if (!tabla[local]) tabla[local] = crearEquipoVacio(local)
    if (!tabla[visitante]) tabla[visitante] = crearEquipoVacio(visitante)

    tabla[local].pj++
    tabla[visitante].pj++
    tabla[local].gf += golesLocal
    tabla[local].gc += golesVisitante
    tabla[visitante].gf += golesVisitante
    tabla[visitante].gc += golesLocal

    if (golesLocal > golesVisitante) {
      tabla[local].g++
      tabla[local].pts += 3
      tabla[visitante].p++
    } else if (golesLocal < golesVisitante) {
      tabla[visitante].g++
      tabla[visitante].pts += 3
      tabla[local].p++
    } else {
      tabla[local].e++
      tabla[visitante].e++
      tabla[local].pts += 1
      tabla[visitante].pts += 1
    }
  })

  const equipos = Object.values(tabla)
  equipos.forEach(e => (e.dg = e.gf - e.gc))
  equipos.sort((a, b) => b.pts - a.pts || b.dg - a.dg || b.gf - a.gf)
  return equipos
}

export function iniciales(nombreEquipo) {
  return nombreEquipo
    .split(" ")
    .map(palabra => palabra[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

// Convierte un link de Google Drive en un link de imagen que se puede mostrar
export function armarLinkImagenDrive(url) {
  const match = url.match(/[-\w]{25,}/)
  return match ? `https://drive.google.com/thumbnail?id=${match[0]}&sz=w200` : url
}

// A partir de la planilla de equipos arma un objeto { "Nombre equipo": "link del logo" }
export function armarLogos(filasEquipos) {
  const logos = {}
  filasEquipos.forEach(fila => {
    if (fila.nombre_equipo && fila.logo_url) {
      logos[fila.nombre_equipo.trim()] = armarLinkImagenDrive(fila.logo_url.trim())
    }
  })
  return logos
}

// Agrupa los partidos por fecha: [{ fecha: "Sáb 7 nov", partidos: [...] }, ...]
export function agruparPorFecha(partidos) {
  const grupos = []
  partidos.forEach(partido => {
    let grupo = grupos.find(g => g.fecha === partido.fecha)
    if (!grupo) {
      grupo = { fecha: partido.fecha, partidos: [] }
      grupos.push(grupo)
    }
    grupo.partidos.push(partido)
  })
  return grupos
}

// Una tabla por cada categoría, todas juntas en una lista
export function calcularTodosLosEquipos(partidos) {
  const categorias = [...new Set(partidos.map(p => p.categoria))]
  const todos = []
  categorias.forEach(categoria => {
    calcularTabla(partidos, categoria).forEach(equipo => {
      todos.push({ ...equipo, categoria })
    })
  })
  return todos
}

// Arma un objeto { "Nombre equipo": "link del equipo" }
export function armarLinks(filasEquipos) {
  const links = {}
  filasEquipos.forEach(fila => {
    if (fila.nombre_equipo && fila.link_equipo) {
      links[fila.nombre_equipo.trim()] = fila.link_equipo.trim()
    }
  })
  return links
}

// Usuarios de prueba para el login
export const USUARIOS = [
  { usuario: "fan1", password: "hockey123", rol: "Fan" },
  { usuario: "fan2", password: "copa2026", rol: "Fan" },
  { usuario: "jugadora1", password: "cancha123", rol: "Jugador" },
  { usuario: "admin", password: "admin2026", rol: "Administrador" },
]

// Roles que se pueden elegir al iniciar sesión
export const ROLES = ["Fan", "Jugador", "Administrador"]

// Lista de todos los equipos que aparecen en los partidos
export function obtenerListaEquipos(partidos) {
  const nombres = partidos.flatMap(p => [p.equipo_local, p.equipo_visitante])
  return [...new Set(nombres)].filter(Boolean).sort()
}

// Identificador único de un partido (incluye la categoría para no mezclar partidos iguales de distintas categorías)
export function generarIdPartido(partido) {
  return `${partido.fecha}__${partido.categoria}__${partido.equipo_local}__${partido.equipo_visitante}`
}

// Partidos que cargó el administrador desde el panel
export function leerPartidosPanel() {
  return JSON.parse(localStorage.getItem("partidosPanel")) || []
}

// Pasa "2026-11-14" a "Sáb 14 nov" 
export function formatearFecha(fechaISO) {
  const [anio, mes, dia] = fechaISO.split("-").map(Number)
  const fecha = new Date(anio, mes - 1, dia)
  const dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
  const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]
  return `${dias[fecha.getDay()]} ${dia} ${meses[mes - 1]}`
}

// Resultados que cargó el administrador para partidos de la planilla: { "idPartido": { goles_local, goles_visitante } }
export function leerResultadosPanel() {
  return JSON.parse(localStorage.getItem("resultadosPanel")) || {}
}

// A los partidos de la planilla les aplica los resultados cargados desde el panel
export function aplicarResultados(partidosPlanilla, resultados) {
  return partidosPlanilla.map(partido => {
    const resultado = resultados[generarIdPartido(partido)]
    if (resultado) {
      return {
        ...partido,
        goles_local: resultado.goles_local,
        goles_visitante: resultado.goles_visitante,
        estado: "Final",
      }
    }
    return partido
  })
}

// Partidos de la planilla (con sus resultados cargados) + partidos programados desde el panel
export function mezclarPartidos(partidosPlanilla) {
  return [...aplicarResultados(partidosPlanilla, leerResultadosPanel()), ...leerPartidosPanel()]
}