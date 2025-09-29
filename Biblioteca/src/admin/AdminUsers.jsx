// src/pages/AdminUsers.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { apiGet, apiPut, apiDelete } from "../api/api";

const AdminUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [editForm, setEditForm] = useState({
    nombre: "",
    apellidos: "",
    documento: "",
    celular: "",
    genero: "",
    tipoDocumento: "",
    direccion: "",
    barrio: "",
    email: ""
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await apiGet("admin/users", user.token);
      setUsers(data);
    } catch (err) {
      setError("Error al cargar usuarios");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const changeUserRole = async (userId, newRole) => {
    try {
      const updatedUser = await apiPut(
        `admin/users/${userId}/role`,
        { rol: newRole },
        user.token
      );
      setUsers(users.map(u => u._id === userId ? updatedUser : u));
      setSuccess(`Rol cambiado a ${newRole} correctamente ✅`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.msg || "Error al cambiar rol ❌");
      console.error(err);
    }
  };

  const handleEdit = (userData) => {
    setEditingUser(userData._id);
    setEditForm({
      nombre: userData.nombre,
      apellidos: userData.apellidos,
      documento: userData.documento,
      celular: userData.celular,
      genero: userData.genero,
      tipoDocumento: userData.tipoDocumento,
      direccion: userData.direccion,
      barrio: userData.barrio,
      email: userData.email
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await apiPut(
        `admin/users/${editingUser}`,
        editForm,
        user.token
      );
      setUsers(users.map(u => u._id === editingUser ? updatedUser : u));
      setEditingUser(null);
      setSuccess("Usuario actualizado correctamente ✅");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.msg || "Error al actualizar usuario ❌");
      console.error(err);
    }
  };

  const confirmDelete = (userItem) => {
    setUserToDelete(userItem);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      await apiDelete(`admin/users/${userToDelete._id}`, user.token);
      setUsers(users.filter(u => u._id !== userToDelete._id));
      setSuccess("Usuario eliminado correctamente ✅");
      setUserToDelete(null);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.msg || "Error al eliminar usuario ❌");
      console.error(err);
    }
  };

  const getRoleBadgeClass = (rol) => {
    switch (rol) {
      case "admin": return "bg-danger";
      case "bibliotecario": return "bg-warning";
      default: return "bg-info";
    }
  };

  // 🔹 Filtrar usuarios según búsqueda
  const filteredUsers = users.filter(userItem =>
    userItem.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    userItem.apellidos.toLowerCase().includes(searchQuery.toLowerCase()) ||
    userItem.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    userItem.documento.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 🔹 Loading
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
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Usuarios</h2>
        <span className="badge bg-secondary">{users.length} usuarios</span>
      </div>

      {/* 🔹 Barra de búsqueda */}
      <div className="row mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar usuarios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* 🔹 Tabla de usuarios */}
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Documento</th>
              <th>Celular</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((userItem) => (
              <tr key={userItem._id}>
                <td>
                  <div className="d-flex align-items-center">
                    <img
                      src={userItem.avatar || "https://via.placeholder.com/40x40/6c757d/ffffff?text=U"}
                      className="rounded-circle me-2"
                      alt={userItem.nombre}
                      style={{ width: "40px", height: "40px", objectFit: "cover" }}
                    />
                    <div>{userItem.nombre} {userItem.apellidos}</div>
                  </div>
                </td>
                <td>{userItem.email}</td>
                <td>
                  {userItem.tipoDocumento === 'cc' && 'CC '}
                  {userItem.tipoDocumento === 'ti' && 'TI '}
                  {userItem.tipoDocumento === 'pasaporte' && 'Pasaporte '}
                  {userItem.tipoDocumento === 'cedula_extranjera' && 'CE '}
                  {userItem.documento}
                </td>
                <td>{userItem.celular}</td>
                <td>
                  <select
                    className={`form-select form-select-sm ${getRoleBadgeClass(userItem.rol)} text-white`}
                    value={userItem.rol}
                    onChange={(e) => changeUserRole(userItem._id, e.target.value)}
                    style={{ width: "auto", display: "inline-block" }}
                    disabled={userItem._id === user.id}
                  >
                    <option value="usuario">Usuario</option>
                    <option value="bibliotecario">Bibliotecario</option>
                    <option value="admin">Administrador</option>
                  </select>
                </td>
                <td>
                  <button
                    className="btn btn-outline-primary me-1"
                    onClick={() => handleEdit(userItem)}
                  >
                    <i className="fas fa-edit">Editar</i>
                  </button>
                  {userItem._id !== user.id && (
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => confirmDelete(userItem)}
                    >
                      <i className="fas fa-trash">Eliminar</i>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔹 Modal de edición */}
      {editingUser && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Usuario</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditingUser(null)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleEditSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Nombre</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editForm.nombre}
                        onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Apellidos</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editForm.apellidos}
                        onChange={(e) => setEditForm({ ...editForm, apellidos: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Tipo Documento</label>
                      <select
                        className="form-select"
                        value={editForm.tipoDocumento}
                        onChange={(e) => setEditForm({ ...editForm, tipoDocumento: e.target.value })}
                        required
                      >
                        <option value="cc">Cédula</option>
                        <option value="ti">Tarjeta Identidad</option>
                        <option value="pasaporte">Pasaporte</option>
                        <option value="cedula_extranjera">Cédula Extranjería</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Documento</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editForm.documento}
                        onChange={(e) => setEditForm({ ...editForm, documento: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        required
                      />
                      <small className="form-text text-success">
                        ✅ Como administrador, puedes modificar el email
                      </small>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Celular</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={editForm.celular}
                        onChange={(e) => setEditForm({ ...editForm, celular: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Género</label>
                      <select
                        className="form-select"
                        value={editForm.genero}
                        onChange={(e) => setEditForm({ ...editForm, genero: e.target.value })}
                        required
                      >
                        <option value="hombre">Hombre</option>
                        <option value="mujer">Mujer</option>
                        <option value="otro">Otro</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Dirección</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editForm.direccion}
                        onChange={(e) => setEditForm({ ...editForm, direccion: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Barrio</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editForm.barrio}
                        onChange={(e) => setEditForm({ ...editForm, barrio: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="d-flex gap-2 justify-content-end">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setEditingUser(null)}
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Guardar Cambios
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 Modal de confirmación de eliminación */}
      {userToDelete && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar Eliminación</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setUserToDelete(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  ¿Estás seguro de eliminar a {userToDelete.nombre} {userToDelete.apellidos}?
                  Esta acción no se puede deshacer.
                </p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary"
                  onClick={() => setUserToDelete(null)} >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;