// src/pages/Profile.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiGet } from "../api/api";

const Profile = () => {
  const { user, updateProfile, fetchMyLoans } = useAuth();
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
    avatar: ""
  });
  const [prestamos, setPrestamos] = useState([]);
  const [msg, setMsg] = useState("");

  // Cargar datos del perfil + préstamos
  useEffect(() => {
    const loadData = async () => {
      if (!user?.token) return;

      const perfil = await apiGet("auth/me", user.token);
      setFormData({
        nombre: perfil.nombre || "",
        apellidos: perfil.apellidos || "",
        documento: perfil.documento || "",
        genero: perfil.genero || "",
        tipoDocumento: perfil.tipoDocumento || "",
        email: perfil.email || "",
        celular: perfil.celular || "",
        direccion: perfil.direccion || "",
        barrio: perfil.barrio || "",
        avatar: perfil.avatar || ""
      });

      const loans = await fetchMyLoans();
      setPrestamos(loans || []);
    };
    loadData();
  }, [user]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updated = await updateProfile(formData);
    if (updated) setMsg("Perfil actualizado correctamente ✅");
  };

  return (
    <div>
      {/* Información visual del perfil */}
      <div className="row mb-4">
        <div className="px-0">
          <div className="card shadow-lg overflow-hidden rounded-0">
            {/* Banner */}
            <div className="position-relative">
              <img
                src="https://tse1.explicit.bing.net/th/id/OIP.IluhiYxxDh1BFobLDxhThQAAAA?r=0&w=474&h=228&rs=1&pid=ImgDetMain&o=7&rm=3"
                alt="Banner"
                className="w-100"
                style={{ height: "200px", objectFit: "fit" }}
              />
              <div
                className="position-absolute top-100 start-50 translate-middle"
                style={{ zIndex: 2 }}
              >
                <img
                  src={
                    formData.avatar ||
                    "https://via.placeholder.com/130x130/6c757d/ffffff?text=Usuario"
                  }
                  className="rounded-circle border border-3 border-white"
                  alt="Perfil"
                  style={{ width: "130px", height: "130px", objectFit: "fit" }}
                />
              </div>
            </div>

            <div className="card-body text-center mt-5">
              <h4>
                {formData.nombre} {formData.apellidos}
              </h4>
              <p className="text-muted">
                {user?.rol === "admin"
                  ? "Administrador"
                  : user?.rol === "bibliotecario"
                  ? "Bibliotecario"
                  : "Usuario"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario de perfil */}
      <div className="container mb-4">
        <div className="row justify-content-center">
          <div className="col-lg-6 mb-4">
            <div className="card shadow">
              <div className="card-header bg-primary text-white">
                Información Personal
              </div>
              <div className="card-body">
                {msg && <div className="alert alert-info">{msg}</div>}
                <form onSubmit={handleSubmit}>
                  {/* Tipo de Documento */}
                  <div className="mb-3">
                    <label className="form-label">Tipo de Documento</label>
                    <select
                      className="form-control"
                      name="tipoDocumento"
                      value={formData.tipoDocumento}
                      onChange={handleChange}
                      disabled={user.rol === "usuario"}
                    >
                      <option value="cc">Cédula de Ciudadanía</option>
                      <option value="ti">Tarjeta de Identidad</option>
                      <option value="pasaporte">Pasaporte</option>
                      <option value="cedula_extranjera">
                        Cédula de Extranjería
                      </option>
                    </select>
                    {user.rol === "usuario" && (
                      <small className="form-text text-muted">
                        El tipo de documento no puede ser modificado.
                      </small>
                    )}
                  </div>

                  {/* Número de Documento */}
                  <div className="mb-3">
                    <label className="form-label">Número de Documento</label>
                    <input
                      type="text"
                      className="form-control"
                      name="documento"
                      value={formData.documento}
                      onChange={handleChange}
                      readOnly={user.rol === "usuario"}
                    />
                    {user.rol === "usuario" && (
                      <small className="form-text text-muted">
                        El número de documento no puede ser modificado.
                      </small>
                    )}
                  </div>

                  {/* Género */}
                  <div className="mb-3">
                    <label className="form-label">Género</label>
                    <select
                      className="form-control"
                      name="genero"
                      value={formData.genero}
                      onChange={handleChange}
                    >
                      <option value="hombre">Hombre</option>
                      <option value="mujer">Mujer</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>

                  {/* Nombres */}
                  <div className="mb-3">
                    <label className="form-label">Nombres</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Apellidos */}
                  <div className="mb-3">
                    <label className="form-label">Apellidos</label>
                    <input
                      type="text"
                      className="form-control"
                      name="apellidos"
                      value={formData.apellidos}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Dirección */}
                  <div className="mb-3">
                    <label className="form-label">Dirección</label>
                    <input
                      type="text"
                      className="form-control"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                      readOnly={user.rol === "usuario"}
                    />
                    {user.rol === "usuario" && (
                      <small className="form-text text-muted">
                        Para modificar tu dirección, contacta a un administrador.
                      </small>
                    )}
                  </div>

                  {/* Barrio */}
                  <div className="mb-3">
                    <label className="form-label">Barrio</label>
                    <input
                      type="text"
                      className="form-control"
                      name="barrio"
                      value={formData.barrio}
                      onChange={handleChange}
                      readOnly={user.rol === "usuario"}
                    />
                    {user.rol === "usuario" && (
                      <small className="form-text text-muted">
                        Para modificar tu barrio, contacta a un administrador.
                      </small>
                    )}
                  </div>

                  {/* Email (solo editable para admin) */}
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      readOnly={user.rol !== "admin"} // 🔥 Solo admin puede modificar
                    />
                    {user.rol !== "admin" ? (
                      <small className="form-text text-muted">
                        El email no puede ser modificado. Contacta a un administrador.
                      </small>
                    ) : (
                      <small className="form-text text-success">
                        ✅ Como administrador, puedes modificar el email
                      </small>
                    )}
                  </div>

                  {/* Teléfono */}
                  <div className="mb-3">
                    <label className="form-label">Teléfono</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="celular"
                      value={formData.celular}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Avatar */}
                  <div className="mb-3">
                    <label className="form-label">Foto de Perfil</label>
                    <input
                      type="url"
                      className="form-control"
                      name="avatar"
                      value={formData.avatar}
                      onChange={handleChange}
                      placeholder="URL de la imagen"
                    />
                  </div>

                  <button type="submit" className="btn btn-primary">
                    <i className="fas fa-save me-2"></i> Guardar Cambios
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Préstamos */}
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">Mis Préstamos</div>
          <div className="card-body">
            {prestamos.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Libro</th>
                      <th>Fecha Préstamo</th>
                      <th>Fecha Devolución</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prestamos.map((prestamo) => (
                      <tr key={prestamo._id}>
                        <td>{prestamo.libro?.titulo || "Sin título"}</td>
                        <td>
                          {new Date(prestamo.fechaPrestamo).toLocaleDateString()}
                        </td>
                        <td>
                          {prestamo.fechaDevolucion
                            ? new Date(prestamo.fechaDevolucion).toLocaleDateString()
                            : "-"}
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              prestamo.estado === "prestado"
                                ? "bg-success"
                                : prestamo.estado === "rechazado"
                                ? "bg-danger"
                                : "bg-secondary"
                            }`}
                          >
                            {prestamo.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="alert alert-info">
                No tienes préstamos registrados.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;