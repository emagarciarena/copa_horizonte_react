import EscudoEquipo from './EscudoEquipo'

function FilaVoto({ puesto, equipo, logos, cantidad, porcentaje, esMio, esLider, onVotar }) {
  return (
    <li className={esMio ? "vote-row vote-row--mine" : "vote-row"}>
      <span className={esLider ? "vote-row__rank vote-row__rank--leader" : "vote-row__rank"}>
        {puesto}
      </span>

      <EscudoEquipo nombre={equipo} logos={logos} />

      <span className="vote-row__name">{equipo}</span>

      <div className="vote-row__bar">
        <div className="vote-row__bar-fill" style={{ width: `${porcentaje}%` }}></div>
      </div>

      <span className="vote-row__stats">
        <strong>{porcentaje}%</strong> · {cantidad} {cantidad === 1 ? "voto" : "votos"}
      </span>

      <button
        type="button"
        className={esMio ? "filter-chip filter-chip--active vote-row__btn" : "filter-chip vote-row__btn"}
        onClick={() => onVotar(equipo)}
      >
        {esMio ? "✓ Tu voto" : "Votar"}
      </button>
    </li>
  )
}

export default FilaVoto