function FiltroChips({ opciones, activo, onCambiar }) {
  return (
    <div className="filters__group">
      {opciones.map((opcion, index) => (
        <button
          key={index}
          type="button"
          className={opcion === activo ? "filter-chip filter-chip--active" : "filter-chip"}
          onClick={() => onCambiar(opcion)}
        >
          {opcion}
        </button>
      ))}
    </div>
  )
}

export default FiltroChips