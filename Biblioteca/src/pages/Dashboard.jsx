// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { apiGet, apiDelete } from "../api/api";
import { Link, useNavigate } from "react-router-dom";
import useDebounce from "../hooks/useDebounce"; // 🔹 Importar hook

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [selectedLibro, setSelectedLibro] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // 🔹 Debounce en la búsqueda
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    fetchLibros();
  }, [user.token, debouncedSearchQuery, sortBy]);

  const fetchLibros = async () => {
    try {
      setLoading(true);
      let endpoint = "books";
      const params = new URLSearchParams();

      if (debouncedSearchQuery) params.append("q", debouncedSearchQuery);
      if (sortBy) params.append("sort", sortBy);

      if (params.toString()) endpoint += `?${params.toString()}`;

      const data = await apiGet(endpoint, user.token);
      setLibros(data);
    } catch (err) {
      setError("Error al cargar los libros");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (libroId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este libro?")) {
      try {
        await apiDelete(`books/${libroId}`, user.token);
        setSuccessMessage("Libro eliminado correctamente");
        fetchLibros();
        setTimeout(() => setSuccessMessage(""), 5000);
      } catch (err) {
        setError("Error al eliminar el libro");
        console.error(err);
      }
    }
  };

  const openModal = (libro) => {
    setSelectedLibro(libro);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedLibro(null);
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

      {/* Barra de búsqueda y filtros */}
      <form className="row mb-4">
        <div className="col-md-3">
          <select
            className="form-select"
            value={sortBy}
            onChange={(e) => {
              if (e.target.value === "autores") {
                navigate("/dashboard/autores");
              } else if (e.target.value === "categorias") {
                navigate("/dashboard/categorias");
              } else {
                setSortBy(e.target.value);
              }
            }}
          >
            <option value="">Ir a...</option>
            <option value="autores">Autores</option>
            <option value="categorias">Categorías</option>
            <optgroup label="Ordenar libros">
              <option value="titulo">Título (A-Z)</option>
              <option value="-titulo">Título (Z-A)</option>
              <option value="disponibles">Disponibles (Mayor a menor)</option>
              <option value="-disponibles">Disponibles (Menor a mayor)</option>
            </optgroup>
          </select>
        </div>
        <div className="col-md-7">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar libros por título o descripción..."
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
        <h2>Catálogo de Libros</h2>
        {(user?.rol === "admin" || user?.rol === "bibliotecario") && (
          <Link to="/agregar-libro" className="btn btn-success">
            <i className="fas fa-plus me-2"></i>Agregar Libro
          </Link>
        )}
      </div>

      {libros.length === 0 ? (
        <div className="alert alert-info text-center">
          No hay libros disponibles en este momento.
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {libros.map((libro) => (
            <div key={libro._id} className="col">
              <div
                className="card h-100 shadow-sm"
                style={{ cursor: "pointer" }}
                onClick={() => openModal(libro)}
              >
                <div className="position-relative">
                  <img
                    src={
                      libro.portadaUrl ||
                      "https://via.placeholder.com/200x300/6c757d/ffffff?text=Sin+imagen"
                    }
                    className="card-img-top"
                    alt={libro.titulo}
                    style={{ height: "400px", objectFit: "fit" }}
                  />
                  <span
                    className={`badge position-absolute bottom-0 start-0 m-2 ${
                      libro.disponibles > 0 ? "bg-success" : "bg-danger"
                    }`}
                  >
                    {libro.disponibles > 0
                      ? `Disponibles: ${libro.disponibles}/${libro.copias}`
                      : "Agotado"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal del libro */}
      {showModal && selectedLibro && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title">{selectedLibro.titulo}</h3>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  {/* Columna izquierda */}
                  <div className="col-md-7">
                    {/* Autores y categorías */}
                    <div className="mb-4">
                      <h5 className="text-muted">
                        {selectedLibro.autores?.map((autor, index) => (
                          <span key={autor._id}>
                            <Link
                              to={`/dashboard/autor/${autor._id}`}
                              className="text-decoration-none"
                              onClick={(e) => e.stopPropagation()} // Evita cerrar modal al hacer click
                            >
                              {autor.nombre} {autor.apellido}
                            </Link>
                            {index < selectedLibro.autores.length - 1
                              ? ", "
                              : ""}
                          </span>
                        )) || "Autor desconocido"}
                      </h5>
                      <div className="mb-3">
                        {selectedLibro.categorias?.map((cat, index) => (
                          <span
                            key={index}
                            className="badge bg-secondary me-1"
                          >
                            {cat.nombre}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Detalles */}
                    <div className="mb-3">
                      <p>
                        <strong>ISBN:</strong>{" "}
                        {selectedLibro.isbn || "No especificado"}
                      </p>
                      <p>
                        <strong>Idioma:</strong>{" "}
                        {selectedLibro.idioma || "No especificado"}
                      </p>
                      <p>
                        <strong>Páginas:</strong>{" "}
                        {selectedLibro.paginas || "No especificado"}
                      </p>
                      <span
                        className={`badge ${
                          selectedLibro.disponibles > 0
                            ? "bg-success"
                            : "bg-danger"
                        }`}
                      >
                        Disponibles: {selectedLibro.disponibles} de{" "}
                        {selectedLibro.copias}
                      </span>
                    </div>

                    <hr />

                    {/* Descripción */}
                    <div className="mb-4">
                      <h5>Descripción</h5>
                      <p className="text-justify">
                        {selectedLibro.descripcion ||
                          "No hay descripción disponible."}
                      </p>
                    </div>

                    {/* Acciones */}
                    <div className="mt-4 d-flex justify-content-between">
                      <div>
                        {(user?.rol === "admin" ||
                          user?.rol === "bibliotecario") && (
                          <>
                            <Link
                              to={`/editar-libro/${selectedLibro._id}`}
                              className="btn btn-outline-primary me-2"
                              onClick={closeModal}
                            >
                              <i className="fas fa-edit me-2"></i>Editar
                            </Link>
                            <button
                              className="btn btn-outline-danger me-2"
                              onClick={() => {
                                handleDelete(selectedLibro._id);
                                closeModal();
                              }}
                            >
                              <i className="fas fa-trash me-2"></i>Eliminar
                            </button>
                          </>
                        )}
                      </div>

                      {/* Botón de préstamo para TODOS los usuarios autenticados */}
                      {selectedLibro.disponibles > 0 && user && (
                        <Link
                          to="/solicitar-prestamo"
                          state={{ libro: selectedLibro }}
                          className="btn btn-primary"
                          onClick={closeModal}
                        >
                          <i className="fas fa-bookmark me-2"></i>Solicitar
                          préstamo
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Columna derecha: Imagen */}
                  <div className="col-md-5 text-center">
                    <img
                      src={
                        selectedLibro.portadaUrl ||
                        "https://via.placeholder.com/300x450/6c757d/ffffff?text=Sin+imagen"
                      }
                      className="img-fluid rounded shadow mb-3"
                      alt={selectedLibro.titulo}
                      style={{
                        maxHeight: "400px",
                        width: "260px",
                        objectFit: "fit",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;