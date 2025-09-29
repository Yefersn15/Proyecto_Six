// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../components/ThemeContext"; // 🔹 Importar useTheme

const Register = () => {
  const { register } = useAuth();
  const { isDarkMode } = useTheme(); // 🔹 Estado del tema
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    genero: "",
    tipoDocumento: "",
    documento: "",
    email: "",
    celular: "",
    direccion: "",
    barrio: "",
    avatar: "",
    password: "",
    confirmPassword: "",
  });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // 🔥 Validar letras y espacios en nombre y apellidos
    if (name === "nombre" || name === "apellidos") {
      const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
      if (!soloLetras.test(value) && value !== "") return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    const letrasRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!letrasRegex.test(formData.nombre)) {
      setMsg("El nombre solo puede contener letras y espacios ❌");
      return;
    }
    if (!letrasRegex.test(formData.apellidos)) {
      setMsg("Los apellidos solo pueden contener letras y espacios ❌");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setMsg("Las contraseñas no coinciden ❌");
      return;
    }
    if (formData.password.length < 6) {
      setMsg("La contraseña debe tener al menos 6 caracteres ❌");
      return;
    }
    const celularRegex = /^[0-9]{10}$/;
    if (!celularRegex.test(formData.celular)) {
      setMsg("El número de celular debe tener 10 dígitos ❌");
      return;
    }

    const res = await register(formData);

    if (res && !res.msg) {
      setMsg("Registro exitoso ✅");
      setTimeout(() => navigate("/"), 2000);
    } else {
      setMsg(res.msg || "Error al registrar ❌");
    }
  };

  return (
    <div className={`container mt-5 ${isDarkMode ? "text-light" : ""}`}>
      <h1 className="text-center text-success">Registrar</h1>

      {msg && (
        <div
          className={`alert ${
            msg.includes("❌") ? "alert-danger" : "alert-info"
          } text-center`}
        >
          {msg}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className={`mb-4 p-4 border rounded shadow-sm ${
          isDarkMode ? "bg-dark text-light border-secondary" : "bg-light"
        }`}
      >
        <div className="row">
          {/* Nombre */}
          <div className="col-md-6 mb-3">
            <label className="form-label">Nombres *</label>
            <input
              type="text"
              className={`form-control ${
                isDarkMode ? "bg-dark text-light border-secondary" : ""
              }`}
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+"
              title="Solo se permiten letras y espacios"
              required
            />
            <small
              className={`form-text ${isDarkMode ? "text-light" : "text-muted"}`}
            >
              Solo letras y espacios
            </small>
          </div>

          {/* Apellidos */}
          <div className="col-md-6 mb-3">
            <label className="form-label">Apellidos *</label>
            <input
              type="text"
              className={`form-control ${
                isDarkMode ? "bg-dark text-light border-secondary" : ""
              }`}
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+"
              title="Solo se permiten letras y espacios"
              required
            />
            <small
              className={`form-text ${isDarkMode ? "text-light" : "text-muted"}`}
            >
              Solo letras y espacios
            </small>
          </div>

          {/* Tipo de Documento */}
          <div className="col-md-6 mb-3">
            <label className="form-label">Tipo de Documento *</label>
            <select
              className={`form-select ${
                isDarkMode ? "bg-dark text-light border-secondary" : ""
              }`}
              name="tipoDocumento"
              value={formData.tipoDocumento}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar...</option>
              <option value="cc">Cédula de Ciudadanía</option>
              <option value="ti">Tarjeta de Identidad</option>
              <option value="pasaporte">Pasaporte</option>
              <option value="cedula_extranjera">Cédula de Extranjería</option>
            </select>
          </div>

          {/* Número Documento */}
          <div className="col-md-6 mb-3">
            <label className="form-label">Número de Documento *</label>
            <input
              type="text"
              className={`form-control ${
                isDarkMode ? "bg-dark text-light border-secondary" : ""
              }`}
              name="documento"
              value={formData.documento}
              onChange={handleChange}
              required
            />
          </div>

          {/* Género */}
          <div className="col-12 mb-3">
            <label className="form-label">Género *</label>
            <div className="d-flex gap-4">
              {["hombre", "mujer", "otro"].map((g) => (
                <div className="form-check" key={g}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="genero"
                    id={`genero_${g}`}
                    value={g}
                    checked={formData.genero === g}
                    onChange={handleChange}
                    required
                  />
                  <label className="form-check-label" htmlFor={`genero_${g}`}>
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Email */}
          <div className="col-md-6 mb-3">
            <label className="form-label">Correo electrónico *</label>
            <input
              type="email"
              className={`form-control ${
                isDarkMode ? "bg-dark text-light border-secondary" : ""
              }`}
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <small className="form-text text-info">
              📧 Ingrese un email real en caso de que olvide su contraseña pueda
              recuperarla.
            </small>
          </div>

          {/* Celular */}
          <div className="col-md-6 mb-3">
            <label className="form-label">Celular *</label>
            <input
              type="tel"
              className={`form-control ${
                isDarkMode ? "bg-dark text-light border-secondary" : ""
              }`}
              name="celular"
              value={formData.celular}
              onChange={handleChange}
              pattern="[0-9]{10}"
              title="El número de celular debe tener 10 dígitos"
              required
            />
            <small
              className={`form-text ${isDarkMode ? "text-light" : "text-muted"}`}
            >
              10 dígitos sin espacios ni caracteres especiales
            </small>
          </div>

          {/* Dirección */}
          <div className="col-md-6 mb-3">
            <label className="form-label">Dirección *</label>
            <input
              type="text"
              className={`form-control ${
                isDarkMode ? "bg-dark text-light border-secondary" : ""
              }`}
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              required
            />
          </div>

          {/* Barrio */}
          <div className="col-md-6 mb-3">
            <label className="form-label">Barrio *</label>
            <input
              type="text"
              className={`form-control ${
                isDarkMode ? "bg-dark text-light border-secondary" : ""
              }`}
              name="barrio"
              value={formData.barrio}
              onChange={handleChange}
              required
            />
          </div>

          {/* Avatar */}
          <div className="col-12 mb-3">
            <label className="form-label">Foto de Perfil (URL)</label>
            <input
              type="url"
              className={`form-control ${
                isDarkMode ? "bg-dark text-light border-secondary" : ""
              }`}
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>

          {/* Contraseña */}
          <div className="col-md-6 mb-3">
            <label className="form-label">Contraseña *</label>
            <input
              type="password"
              className={`form-control ${
                isDarkMode ? "bg-dark text-light border-secondary" : ""
              }`}
              name="password"
              value={formData.password}
              onChange={handleChange}
              minLength="6"
              required
            />
            <small
              className={`form-text ${isDarkMode ? "text-light" : "text-muted"}`}
            >
              Mínimo 6 caracteres
            </small>
          </div>

          {/* Confirmar contraseña */}
          <div className="col-md-6 mb-3">
            <label className="form-label">Confirmar contraseña *</label>
            <input
              type="password"
              className={`form-control ${
                isDarkMode ? "bg-dark text-light border-secondary" : ""
              }`}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              minLength="6"
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-success w-100">
          Registrar
        </button>
      </form>
    </div>
  );
};

export default Register;