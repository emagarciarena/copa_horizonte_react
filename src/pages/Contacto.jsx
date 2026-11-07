import { useState } from 'react'
import '../styles/styles-contacto.css'
import PageHeader from '../components/PageHeader'

const MOTIVOS = [
  "Consulta general",
  "Inscripción de equipo",
  "Cronograma y canchas",
  "Resultados o posiciones",
  "Otro",
]

function Contacto() {
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [motivo, setMotivo] = useState("")
  const [mensaje, setMensaje] = useState("")

  const [errores, setErrores] = useState({})
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)

  function enviarFormulario(e) {
    e.preventDefault()

    const nuevosErrores = {}
    if (nombre.trim() === "") nuevosErrores.nombre = true
    if (!email.includes("@") || !email.includes(".")) nuevosErrores.email = true
    if (motivo === "") nuevosErrores.motivo = true
    if (mensaje.trim() === "") nuevosErrores.mensaje = true

    setErrores(nuevosErrores)

    // Si hay algún error, no se envía
    if (Object.keys(nuevosErrores).length > 0) return

    // Envío simulado: 1 segundo "Enviando..." y después el mensaje de éxito
    setEnviando(true)
    setTimeout(() => {
      setEnviando(false)
      setEnviado(true)
      setNombre("")
      setEmail("")
      setMotivo("")
      setMensaje("")
    }, 1000)
  }

  const hayErrores = Object.keys(errores).length > 0

  return (
    <>
      <PageHeader
        titulo="Contacto"
        subtitulo="Escribinos tu consulta · Temporada 2026"
        icono="fa-solid fa-envelope"
      />

      <main className="contact">
        <section className="contact-card">
          <h2 className="contact-card__title">Enviá tu consulta</h2>

          {enviado ? (
            <div className="form-success">
              <i className="fa-solid fa-circle-check"></i>
              <h3>¡Consulta enviada!</h3>
              <p>Gracias por escribirnos. Te vamos a responder a la brevedad.</p>
              <button type="button" className="filter-chip" onClick={() => setEnviado(false)}>
                Enviar otra consulta
              </button>
            </div>
          ) : (
            <form onSubmit={enviarFormulario} noValidate>
              <div className="form-row">
                <div className={errores.nombre ? "form-field form-field--error" : "form-field"}>
                  <label htmlFor="cNombre">Nombre</label>
                  <input
                    type="text"
                    id="cNombre"
                    placeholder="Tu nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </div>

                <div className={errores.email ? "form-field form-field--error" : "form-field"}>
                  <label htmlFor="cEmail">Email</label>
                  <input
                    type="email"
                    id="cEmail"
                    placeholder="tuemail@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className={errores.motivo ? "form-field form-field--error" : "form-field"}>
                <label htmlFor="cMotivo">Motivo</label>
                <select id="cMotivo" value={motivo} onChange={(e) => setMotivo(e.target.value)}>
                  <option value="">Elegí un motivo...</option>
                  {MOTIVOS.map((m, index) => (
                    <option key={index} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className={errores.mensaje ? "form-field form-field--error" : "form-field"}>
                <label htmlFor="cMensaje">Mensaje</label>
                <textarea
                  id="cMensaje"
                  rows="6"
                  placeholder="Contanos en qué podemos ayudarte..."
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                ></textarea>
              </div>

              {hayErrores && (
                <p className="form-error">Revisá los campos marcados en rojo.</p>
              )}

              <button type="submit" className="btn btn--primary contact-form__submit" disabled={enviando}>
                {enviando ? "Enviando..." : "Enviar consulta"}
              </button>
            </form>
          )}
        </section>

        <aside className="contact-info">
          <div className="info-item">
            <i className="fa-solid fa-envelope"></i>
            <div><h3>Email</h3><p>contacto@copahorizonte.com</p></div>
          </div>
          <div className="info-item">
            <i className="fa-brands fa-instagram"></i>
            <div><h3>Instagram</h3><p>@copahorizonte</p></div>
          </div>
          <div className="info-item">
            <i className="fa-brands fa-whatsapp"></i>
            <div><h3>WhatsApp</h3><p>+54 351 000 0000</p></div>
          </div>
          <div className="info-item">
            <i className="fa-solid fa-location-dot"></i>
            <div><h3>Sede</h3><p>Córdoba, Argentina</p></div>
          </div>
        </aside>
      </main>
    </>
  )
}

export default Contacto