import EscudoEquipo from './EscudoEquipo'

function FilaPrediccion({ partido, logos, votosLocal, votosVisitante, eleccion, onPredecir }) {
  const total = votosLocal + votosVisitante
  const pctLocal = total > 0 ? Math.round((votosLocal / total) * 100) : 0
  const pctVisitante = total > 0 ? 100 - pctLocal : 0

  const eligioLocal = eleccion === partido.equipo_local
  const eligioVisitante = eleccion === partido.equipo_visitante

  return (
    <li className="predict-row">
      <div className="predict-row__meta">
        <strong>{partido.categoria}</strong> {partido.fecha}
      </div>

      <div className="predict-row__main">
        <div className="predict-side">
          <EscudoEquipo nombre={partido.equipo_local} logos={logos} />
          <span className="predict-side__name">{partido.equipo_local}</span>
        </div>

        <button
          type="button"
          className={eligioLocal ? "filter-chip filter-chip--active predict-row__btn" : "filter-chip predict-row__btn"}
          onClick={() => onPredecir(partido.equipo_local)}
        >
          {eligioLocal ? "✓ Tu voto" : "Votar"}
        </button>

        <div className="predict-row__bar-area">
          {total > 0 ? (
            <>
              <div className="predict-row__pct-row">
                <span>{pctLocal}%</span>
                <span>{pctVisitante}%</span>
              </div>
              <div className="predict-row__bar">
                <div className="predict-row__bar-fill--local" style={{ width: `${pctLocal}%` }}></div>
                <div className="predict-row__bar-fill--away" style={{ width: `${pctVisitante}%` }}></div>
              </div>
            </>
          ) : (
            <p className="predict-row__empty">Sin predicciones todavía</p>
          )}
        </div>

        <button
          type="button"
          className={eligioVisitante ? "filter-chip filter-chip--active predict-row__btn" : "filter-chip predict-row__btn"}
          onClick={() => onPredecir(partido.equipo_visitante)}
        >
          {eligioVisitante ? "✓ Tu voto" : "Votar"}
        </button>

        <div className="predict-side predict-side--away">
          <span className="predict-side__name">{partido.equipo_visitante}</span>
          <EscudoEquipo nombre={partido.equipo_visitante} logos={logos} />
        </div>
      </div>
    </li>
  )
}

export default FilaPrediccion