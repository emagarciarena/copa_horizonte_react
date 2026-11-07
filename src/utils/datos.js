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