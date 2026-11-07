import EscudoEquipo from './EscudoEquipo'

function MatchCard({ partido, logos }) {
  return (
    <li className="match-card">
      <div className="match-card__meta">
        <span className="match-card__status">{partido.estado}</span>
        <span className="match-card__category">{partido.categoria}</span>
      </div>

      <div className="match-card__team">
        <span className="match-card__team-name">{partido.equipo_local}</span>
        <EscudoEquipo nombre={partido.equipo_local} logos={logos} />
      </div>

      <div className="match-card__score">
        <span>{partido.goles_local}</span>
        <span className="match-card__score-sep">-</span>
        <span>{partido.goles_visitante}</span>
      </div>

      <div className="match-card__team match-card__team--away">
        <EscudoEquipo nombre={partido.equipo_visitante} logos={logos} />
        <span className="match-card__team-name">{partido.equipo_visitante}</span>
      </div>

      <div className="match-card__info">
        <span><i className="fa-solid fa-location-dot"></i> {partido.cancha}</span>
        <span className="match-card__info-row">
          <i className="fa-solid fa-clock"></i> Horario: {partido.horario || "-"}
        </span>
      </div>
    </li>
  )
}

export default MatchCard