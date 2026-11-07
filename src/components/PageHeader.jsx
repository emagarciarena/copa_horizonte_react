function PageHeader({ titulo, subtitulo, icono }) {
  return (
    <section className="page-header">
      <div className="page-header__text">
        <h1 className="page-header__title">{titulo}</h1>
        <p className="page-header__subtitle">{subtitulo}</p>
      </div>
      <i className={`${icono} page-header__icon`}></i>
    </section>
  )
}

export default PageHeader