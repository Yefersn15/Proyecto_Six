// src/pages/CategoriasDashboard.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { apiGet, apiDelete } from "../api/api";
import { Link, useNavigate } from "react-router-dom";
import useDebounce from "../hooks/useDebounce"; // 🔹 Importar hook

const CategoriasDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // 🔹 Debounce en la búsqueda
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    fetchCategorias();
  }, [debouncedSearchQuery, sortBy]);

  const fetchCategorias = async () => {
    try {
      setLoading(true);
      let endpoint = "categories";
      const params = new URLSearchParams();
      if (debouncedSearchQuery) params.append("q", debouncedSearchQuery);
      if (sortBy) params.append("sort", sortBy);
      if (params.toString()) endpoint += `?${params.toString()}`;
      const data = await apiGet(endpoint, user?.token);
      setCategorias(data);
    } catch (err) {
      setError("Error al cargar las categorías");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (categoriaId, categoriaNombre) => {
    if (
      !window.confirm(
        `¿Estás seguro de que deseas eliminar la categoría "${categoriaNombre}"? Esta acción no se puede deshacer.`
      )
    ) {
      return;
    }

    try {
      await apiDelete(`categories/${categoriaId}`, user.token);
      setSuccessMessage(`Categoría "${categoriaNombre}" eliminada correctamente`);
      fetchCategorias(); // Recargar la lista
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) {
      setError("Error al eliminar la categoría");
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
              } else if (e.target.value === "autores") {
                navigate("/dashboard/autores");
              } else {
                setSortBy(e.target.value);
              }
            }}
          >
            <option value="">Ir a...</option>
            <option value="libros">Libros</option>
            <option value="autores">Autores</option>
            <optgroup label="Ordenar categorías">
              <option value="nombre">Nombre (A-Z)</option>
              <option value="-nombre">Nombre (Z-A)</option>
            </optgroup>
          </select>
        </div>
        <div className="col-md-7">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar categorías por nombre..."
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

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Catálogo de Categorías Literarias</h2>
        {(user?.rol === "admin" || user?.rol === "bibliotecario") && (
          <Link to="/dashboard/categorias/nueva" className="btn btn-success">
            <i className="fas fa-plus me-2"></i>Agregar Categoría
          </Link>
        )}
      </div>

      {categorias.length === 0 ? (
        <div className="alert alert-info text-center">
          No hay categorías disponibles.
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {categorias.map((categoria) => (
            <div key={categoria._id} className="col">
              <div
                className="card h-100 shadow-sm text-center"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/dashboard/categoria/${categoria._id}`)}
                role="button"
              >
                <div className="card-body">
                  <i className="fas fa-tag fa-3x text-primary mb-3"></i>
                  <h5 className="card-title">{categoria.nombre}</h5>
                  <p className="card-text text-muted">
                    {categoria.descripcion || "Sin descripción"}
                  </p>

                  {/* Botones de editar/eliminar */}
                  {(user?.rol === "admin" || user?.rol === "bibliotecario") && (
                    <div className="mt-3">
                      <Link
                        to={`/dashboard/categorias/editar/${categoria._id}`}
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <i className="fas fa-edit me-1"></i>Editar
                      </Link>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEliminar(categoria._id, categoria.nombre);
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

export default CategoriasDashboard;