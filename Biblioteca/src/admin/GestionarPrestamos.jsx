// src/pages/GestionarPrestamos.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { apiGet, apiPut } from "../api/api";

const GestionarPrestamos = () => {
  const { user } = useAuth();
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");

  // Estado para modal de confirmación
  const [actionModal, setActionModal] = useState({
    show: false,
    type: "",
    prestamo: null,
    message: "",
  });

  useEffect(() => {
    fetchPrestamos();
  }, [filtroEstado]);

  // 🔹 Cargar préstamos desde la API
  const fetchPrestamos = async () => {
    try {
      setLoading(true);
      let endpoint = "loans";

      if (user.rol === "usuario") {
        endpoint = "loans/mis-prestamos";
      }

      const data = await apiGet(endpoint, user.token);

      // Aplicar filtro
      let prestamosFiltrados = data;
      if (filtroEstado !== "todos") {
        prestamosFiltrados = data.filter((p) => p.estado === filtroEstado);
      }

      setPrestamos(prestamosFiltrados);
    } catch (err) {
      setError("Error al cargar los préstamos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Cambiar estado del préstamo
  const cambiarEstadoPrestamo = async (prestamoId, nuevoEstado, observaciones = "") => {
    try {
      const body = { estado: nuevoEstado };
      if (observaciones) body.observacion = observaciones;

      await apiPut(`loans/${prestamoId}`, body, user.token);

      setSuccessMessage("Préstamo actualizado correctamente");
      fetchPrestamos();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("Error al actualizar el préstamo");
      console.error(err);
    }
  };

  // 🔹 Registrar devolución
  const handleDevolucion = async (prestamoId, observaciones = "") => {
    try {
      const body = {
        fechaDevolucionReal: new Date().toISOString(),
        observacion: observaciones,
      };

      await apiPut(`loans/${prestamoId}`, body, user.token);

      setSuccessMessage("Devolución registrada correctamente");
      fetchPrestamos();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("Error al registrar la devolución");
      console.error(err);
    }
  };

  // 🔹 Función para mostrar confirmación
  const confirmAction = (type, prestamo, message = "") => {
    setActionModal({ show: true, type, prestamo, message });
  };

  // 🔹 Función para ejecutar acción después de confirmación
  const executeAction = async () => {
    const { type, prestamo, message } = actionModal;

    if (type === "approve") {
      await cambiarEstadoPrestamo(prestamo._id, "prestado");
    } else if (type === "reject") {
      await cambiarEstadoPrestamo(prestamo._id, "prestamo rechazado", message);
    } else if (type === "return") {
      await handleDevolucion(prestamo._id, message);
    }

    setActionModal({ show: false, type: "", prestamo: null, message: "" });
  };

  // 🔹 Loading spinner
  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-4">
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* 🔹 Título + Filtro */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Préstamos</h2>

        {user.rol !== "usuario" && (
          <select
            className="form-select w-auto"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="todos">Todos los estados</option>
            <option value="en espera">En espera</option>
            <option value="prestado">Prestados</option>
            <option value="prestamo rechazado">Rechazados</option>
          </select>
        )}
      </div>

      {/* 🔹 Tabla de préstamos */}
      {prestamos.length === 0 ? (
        <div className="alert alert-info text-center">
          No hay préstamos {filtroEstado !== "todos" ? `con estado "${filtroEstado}"` : ""}.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Libro</th>
                {user.rol !== "usuario" && (
                  <>
                    <th>Usuario</th>
                    <th>Dirección</th>
                    <th>Barrio</th>
                    <th>Contacto</th>
                  </>
                )}
                <th>Fecha Préstamo</th>
                <th>Fecha Devolución</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {prestamos.map((prestamo) => (
                <tr key={prestamo._id}>
                  {/* 🔹 Libro */}
                  <td>
                    <div className="d-flex align-items-center">
                      <img
                        src={
                          prestamo.libro.portadaUrl ||
                          "https://via.placeholder.com/50x75/6c757d/ffffff?text=Sin+imagen"
                        }
                        alt={prestamo.libro.titulo}
                        className="me-2"
                        style={{ width: "40px", height: "60px", objectFit: "cover" }}
                      />
                      <div>
                        <strong>{prestamo.libro.titulo}</strong>
                        <br />
                        <small className="text-muted">ISBN: {prestamo.libro.isbn}</small>
                      </div>
                    </div>
                  </td>

                  {/* 🔹 Usuario (solo admin/bibliotecario) */}
                  {user.rol !== "usuario" && (
                    <>
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={
                              prestamo.usuario.avatar ||
                              "https://via.placeholder.com/40x40/6c757d/ffffff?text=U"
                            }
                            alt={prestamo.usuario.nombre}
                            className="rounded-circle me-2"
                            style={{ width: "40px", height: "40px", objectFit: "cover" }}
                          />
                          <div>
                            <strong>{prestamo.usuario.nombre}</strong>
                            <br />
                            <small className="text-muted">{prestamo.usuario.email}</small>
                          </div>
                        </div>
                      </td>
                      <td><small>{prestamo.usuario.direccion}</small></td>
                      <td><small>{prestamo.usuario.barrio}</small></td>
                      <td>
                        <small>
                          {prestamo.usuario.celular}
                          <br />
                          <span className="text-muted">
                            {prestamo.usuario.tipoDocumento === "cc" && "CC "}
                            {prestamo.usuario.tipoDocumento === "ti" && "TI "}
                            {prestamo.usuario.tipoDocumento === "pasaporte" && "Pasaporte "}
                            {prestamo.usuario.tipoDocumento === "cedula_extranjera" && "CE "}
                            {prestamo.usuario.documento}
                          </span>
                        </small>
                      </td>
                    </>
                  )}

                  {/* 🔹 Fechas */}
                  <td>{new Date(prestamo.fechaPrestamo).toLocaleDateString()}</td>
                  <td>{new Date(prestamo.fechaDevolucion).toLocaleDateString()}</td>

                  {/* 🔹 Estado */}
                  <td>
                    <span
                      className={`badge ${
                        prestamo.estado === "prestado"
                          ? "bg-success"
                          : prestamo.estado === "en espera"
                          ? "bg-warning"
                          : "bg-danger"
                      }`}
                    >
                      {prestamo.estado}
                    </span>
                  </td>

                  {/* 🔹 Acciones */}
                  <td>
                    {user.rol !== "usuario" && (
                      <>
                        {prestamo.estado === "en espera" && (
                          <>
                            <button
                              className="btn btn-sm btn-success me-1"
                              onClick={() => confirmAction("approve", prestamo)}
                            >
                              Aprobar
                            </button>
                            <button
                              className="btn btn-sm btn-danger me-1"
                              onClick={() =>
                                confirmAction(
                                  "reject",
                                  prestamo,
                                  "Rechazado por el administrador"
                                )
                              }
                            >
                              Rechazar
                            </button>
                          </>
                        )}

                        {prestamo.estado === "prestado" && !prestamo.fechaDevolucionReal && (
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => confirmAction("return", prestamo)}
                          >
                            Registrar Devolución
                          </button>
                        )}
                      </>
                    )}

                    {prestamo.observacion && (
                      <button
                        className="btn btn-sm btn-info"
                        onClick={() =>
                          confirmAction("info", prestamo, prestamo.observacion)
                        }
                      >
                        Ver Observación
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 🔹 Modal de confirmación */}
      {actionModal.show && actionModal.type !== "info" && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar acción</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() =>
                    setActionModal({ show: false, type: "", prestamo: null, message: "" })
                  }
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  ¿Está seguro de que desea{" "}
                  {actionModal.type === "approve"
                    ? "aprobar"
                    : actionModal.type === "reject"
                    ? "rechazar"
                    : "registrar la devolución de"}{" "}
                  este préstamo?
                </p>
                {(actionModal.type === "reject" ||
                  actionModal.type === "return") && (
                  <div className="form-group mb-3">
                    <label htmlFor="observaciones">Observaciones (opcional)</label>
                    <textarea
                      name="observaciones"
                      className="form-control"
                      rows="3"
                      value={actionModal.message}
                      onChange={(e) =>
                        setActionModal({ ...actionModal, message: e.target.value })
                      }
                    ></textarea>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() =>
                    setActionModal({ show: false, type: "", prestamo: null, message: "" })
                  }
                >
                  Cancelar
                </button>
                <button type="button" className="btn btn-primary" onClick={executeAction}>
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 Modal de solo información (observación) */}
      {actionModal.show && actionModal.type === "info" && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Observación del préstamo</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() =>
                    setActionModal({ show: false, type: "", prestamo: null, message: "" })
                  }
                ></button>
              </div>
              <div className="modal-body">
                <p>{actionModal.message}</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() =>
                    setActionModal({ show: false, type: "", prestamo: null, message: "" })
                  }
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionarPrestamos;