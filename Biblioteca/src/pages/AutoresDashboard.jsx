// src/pages/AutoresDashboard.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { apiGet, apiDelete } from "../api/api";
import { Link, useNavigate } from "react-router-dom";
import useDebounce from "../hooks/useDebounce"; // 🔹 Importamos el hook

const AutoresDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [autores, setAutores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // 🔹 Debounce de la búsqueda
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    fetchAutores();
  }, [debouncedSearchQuery, sortBy]);

  // 🔹 Cargar autores
  const fetchAutores = async () => {
    try {
      setLoading(true);
      let endpoint = "authors";
      const params = new URLSearchParams();
      if (debouncedSearchQuery) params.append("q", debouncedSearchQuery);
      if (sortBy) params.append("sort", sortBy);
      if (params.toString()) endpoint += `?${params.toString()}`;
      const data = await apiGet(endpoint, user?.token);
      setAutores(data);
    } catch (err) {
      setError("Error al cargar los autores");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Eliminar autor
  const handleEliminar = async (autorId, autorNombre) => {
    if (
      !window.confirm(
        `¿Estás seguro de que deseas eliminar al autor "${autorNombre}"? Esta acción no se puede deshacer y los libros asociados quedarán sin referencia.`
      )
    ) {
      return;
    }

    try {
      await apiDelete(`authors/${autorId}`, user.token);
      setSuccessMessage(`Autor "${autorNombre}" eliminado correctamente`);
      fetchAutores();
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) {
      setError("Error al eliminar el autor");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container my-4">
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      {/* 🔹 Barra de búsqueda y filtros */}
      <form className="row mb-4">
        <div className="col-md-3">
          <select
            className="form-select"
            value={sortBy}
            onChange={(e) => {
              if (e.target.value === "libros") {
                navigate("/dashboard");
              } else if (e.target.value === "categorias") {
                navigate("/dashboard/categorias");
              } else {
                setSortBy(e.target.value);
              }
            }}
          >
            <option value="">Ir a...</option>
            <option value="libros">Libros</option>
            <option value="categorias">Categorías</option>
            <optgroup label="Ordenar autores">
              <option value="nombre">Nombre (A-Z)</option>
              <option value="-nombre">Nombre (Z-A)</option>
              <option value="apellido">Apellido (A-Z)</option>
              <option value="-apellido">Apellido (Z-A)</option>
              <option value="nacionalidad">Nacionalidad</option>
            </optgroup>
          </select>
        </div>
        <div className="col-md-7">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar autores por nombre, apellido o nacionalidad..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <button
            type="button"
            className="btn btn-outline-secondary w-100"
            onClick={() => {
              setSearchQuery("");
              setSortBy("");
            }}
          >
            <i className="fas fa-times me-1"></i>Limpiar
          </button>
        </div>
      </form>

      {/* 🔹 Título y botón agregar */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Catálogo de Autores</h2>
        {(user?.rol === "admin" || user?.rol === "bibliotecario") && (
          <Link to="/dashboard/autores/nuevo" className="btn btn-success">
            <i className="fas fa-plus me-2"></i>Agregar Autor
          </Link>
        )}
      </div>

      {/* 🔹 Listado de autores */}
      {autores.length === 0 ? (
        <div className="alert alert-info text-center">
          <i className="fas fa-users fa-3x text-muted mb-3"></i>
          <h4>No hay autores registrados</h4>
          <p className="text-muted">Comienza agregando el primer autor</p>
          {(user?.rol === "admin" || user?.rol === "bibliotecario") && (
            <Link to="/dashboard/autores/nuevo" className="btn btn-primary">
              <i className="fas fa-plus me-2"></i>Agregar Primer Autor
            </Link>
          )}
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {autores.map((autor) => (
            <div key={autor._id} className="col">
              <div
                className="card h-100 shadow-sm text-center"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/dashboard/autor/${autor._id}`)}
                role="button"
              >
                <img
                  src={
                    autor.fotografiaUrl ||
                    "https://via.placeholder.com/200x200/6c757d/ffffff?text=Sin+imagen"
                  }
                  className="card-img-top rounded-circle mx-auto mt-3"
                  alt={`${autor.nombre} ${autor.apellido}`}
                  style={{ width: "150px", height: "150px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title">
                    {autor.nombre} {autor.apellido}
                  </h5>
                  <p className="card-text text-muted">{autor.nacionalidad}</p>
                  <p className="card-text small text-truncate">
                    {autor.biografia || "Sin biografía disponible"}
                  </p>

                  {/* Botones de editar/eliminar */}
                  {(user?.rol === "admin" || user?.rol === "bibliotecario") && (
                    <div className="mt-3">
                      <Link
                        to={`/dashboard/autores/editar/${autor._id}`}
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <i className="fas fa-edit me-1"></i>Editar
                      </Link>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEliminar(
                            autor._id,
                            `${autor.nombre} ${autor.apellido}`
                          );
                        }}
                      >
                        <i className="fas fa-trash me-1"></i>Eliminar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutoresDashboard;