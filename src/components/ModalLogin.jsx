import { useState } from 'react'
import { USUARIOS } from '../utils/datos'

function ModalLogin({ abierto, onCerrar, onLoginOk }) {
  // vista puede ser "login", "registro" o "recuperar"
  const [vista, setVista] = useState("login")

  const [usuario, setUsuario] = useState("")
  const [password, setPassword] = useState("")
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [error, setError] = useState(false)

  const [regUsuario, setRegUsuario] = useState("")
  const [regPassword, setRegPassword] = useState("")
  const [mostrarRegPassword, setMostrarRegPassword] = useState(false)
  const [regError, setRegError] = useState(false)
  const [nota, setNota] = useState(false)

  const [recUsuario, setRecUsuario] = useState("")
  const [recError, setRecError] = useState(false)
  const [recEnviando, setRecEnviando] = useState(false)
  const [recEnviado, setRecEnviado] = useState(false)

  // Si el modal está cerrado, no se dibuja nada
  if (!abierto) return null

  // Deja todos los campos y avisos como al principio
  function limpiarTodo() {
    setUsuario("")
    setPassword("")
    setMostrarPassword(false)
    setError(false)
    setRegUsuario("")
    setRegPassword("")
    setMostrarRegPassword(false)
    setRegError(false)
    setNota(false)
    setRecUsuario("")
    setRecError(false)
    setRecEnviando(false)
    setRecEnviado(false)
  }

  function cerrar() {
    limpiarTodo()
    setVista("login")
    onCerrar()
  }

  function cambiarVista(nuevaVista) {
    limpiarTodo()
    setVista(nuevaVista)
  }

  function enviarLogin(e) {
    e.preventDefault()
    const valido = USUARIOS.some(u => u.usuario === usuario.trim() && u.password === password)

    if (valido) {
      onLoginOk(usuario.trim())
      cerrar()
    } else {
      setError(true)
    }
  }

  // Crear cuenta es solo visual: no guarda nada
  function enviarRegistro(e) {
    e.preventDefault()

    if (regUsuario.trim() === "" || regPassword === "") {
      setRegError(true)
      setNota(false)
      return
    }

    setRegError(false)
    setNota(true)
  }

  // Recuperar contraseña es simulado: espera 1 segundo y muestra el mensaje de éxito
  function enviarRecuperacion(e) {
    e.preventDefault()

    if (recUsuario.trim() === "") {
      setRecError(true)
      return
    }

    setRecError(false)
    setRecEnviando(true)
    setTimeout(() => {
      setRecEnviando(false)
      setRecEnviado(true)
    }, 1000)
  }

  return (
    <div className="modal modal--open">
      <div className="modal__overlay" onClick={cerrar}></div>

      <div className="modal__box">
        <button type="button" className="modal__close" aria-label="Cerrar" onClick={cerrar}>
          &times;
        </button>

        {vista === "login" && (
          <form onSubmit={enviarLogin}>
            <h2 className="modal__title">Ingresá a tu cuenta</h2>
            <p className="modal__subtitle">Para votar y hacer tus predicciones</p>

            <label className="modal__label" htmlFor="loginUser">Usuario</label>
            <input
              type="text"
              id="loginUser"
              className="modal__input"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />

            <label className="modal__label" htmlFor="loginPass">Contraseña</label>
            <div className="modal__password">
              <input
                type={mostrarPassword ? "text" : "password"}
                id="loginPass"
                className="modal__input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="modal__eye"
                aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                onClick={() => setMostrarPassword(!mostrarPassword)}
              >
                <i className={mostrarPassword ? "fa-regular fa-eye" : "fa-regular fa-eye-slash"}></i>
              </button>
            </div>

            <p className="modal__forgot">
              <button type="button" className="modal__link" onClick={() => cambiarVista("recuperar")}>
                ¿Olvidaste tu contraseña?
              </button>
            </p>

            {error && <p className="modal__error">Usuario o contraseña incorrectos.</p>}

            <button type="submit" className="btn btn--primary modal__submit">Ingresar</button>

            <p className="modal__switch">
              ¿No tenés cuenta?{" "}
              <button type="button" className="modal__link" onClick={() => cambiarVista("registro")}>
                Crear cuenta
              </button>
            </p>
          </form>
        )}

        {vista === "registro" && (
          <form onSubmit={enviarRegistro}>
            <h2 className="modal__title">Crear cuenta</h2>
            <p className="modal__subtitle">Para votar y hacer tus predicciones</p>

            <label className="modal__label" htmlFor="regUser">Usuario</label>
            <input
              type="text"
              id="regUser"
              className="modal__input"
              value={regUsuario}
              onChange={(e) => setRegUsuario(e.target.value)}
            />

            <label className="modal__label" htmlFor="regPass">Contraseña</label>
            <div className="modal__password">
              <input
                type={mostrarRegPassword ? "text" : "password"}
                id="regPass"
                className="modal__input"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
              />
              <button
                type="button"
                className="modal__eye"
                aria-label={mostrarRegPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                onClick={() => setMostrarRegPassword(!mostrarRegPassword)}
              >
                <i className={mostrarRegPassword ? "fa-regular fa-eye" : "fa-regular fa-eye-slash"}></i>
              </button>
            </div>

            {regError && <p className="modal__error">Completá tu usuario y tu contraseña.</p>}

            {nota && (
              <p className="modal__note">
                Por ahora la cuenta no se crea. Ingresá con un usuario de prueba.
              </p>
            )}

            <button type="submit" className="btn btn--primary modal__submit">Crear cuenta</button>

            <p className="modal__switch">
              ¿Ya tenés cuenta?{" "}
              <button type="button" className="modal__link" onClick={() => cambiarVista("login")}>
                Ingresar
              </button>
            </p>
          </form>
        )}

        {vista === "recuperar" && recEnviado && (
          <div className="modal__ok">
            <i className="fa-solid fa-circle-check"></i>
            <h2 className="modal__title">¡Revisá tu correo!</h2>
            <p className="modal__subtitle">
              Si el usuario o el email que escribiste existe, te enviamos las
              instrucciones para crear una contraseña nueva.
            </p>

            <button
              type="button"
              className="btn btn--primary modal__submit"
              onClick={() => cambiarVista("login")}
            >
              Volver a ingresar
            </button>
          </div>
        )}

        {vista === "recuperar" && !recEnviado && (
          <form onSubmit={enviarRecuperacion}>
            <h2 className="modal__title">Recuperar contraseña</h2>
            <p className="modal__subtitle">Te mandamos las instrucciones para crear una nueva</p>

            <label className="modal__label" htmlFor="recUser">Usuario o email</label>
            <input
              type="text"
              id="recUser"
              className="modal__input"
              placeholder="fan1 o tuemail@ejemplo.com"
              value={recUsuario}
              onChange={(e) => setRecUsuario(e.target.value)}
            />

            {recError && <p className="modal__error">Escribí tu usuario o tu email.</p>}

            <button type="submit" className="btn btn--primary modal__submit" disabled={recEnviando}>
              {recEnviando ? "Enviando..." : "Enviar instrucciones"}
            </button>

            <p className="modal__switch">
              <button type="button" className="modal__link" onClick={() => cambiarVista("login")}>
                Volver a ingresar
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

export default ModalLogin