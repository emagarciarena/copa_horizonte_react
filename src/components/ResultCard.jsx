import EscudoEquipo from './EscudoEquipo'

function ResultCard({ partido, logos }) {
  const finalizado = partido.estado === "Final"

  return (
    <div className="result-card">
      <div className="result-card__meta">
        <span className="result-card__status">{partido.estado}</span>
        <span className="result-card__info">{partido.categoria} · {partido.fecha}</span>
      </div>

      <div className="result-card__match">
        <div className="result-card__team">
          <EscudoEquipo nombre={partido.equipo_local} logos={logos} />
        </div>

        <span className="result-card__score">
          {finalizado ? `${partido.goles_local} — ${partido.goles_visitante}` : "vs"}
        </span>

        <div className="result-card__team">
          <EscudoEquipo nombre={partido.equipo_visitante} logos={logos} />
        </div>
      </div>
    </div>
  )
}

export default ResultCard