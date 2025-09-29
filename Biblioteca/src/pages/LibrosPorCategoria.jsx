// src/pages/LibrosPorCategoria.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiGet, apiDelete } from "../api/api";

const LibrosPorCategoria = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [categoria, setCategoria] = useState(null);
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLibro, setSelectedLibro] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchCategoriaYLibros();
  }, [id]);

  const fetchCategoriaYLibros = async () => {
    try {
      // Obtener información de la categoría
      const categoriaData = await apiGet(`categories/${id}`, user?.token);
      setCategoria(categoriaData);

      // Obtener libros de esta categoría
      const librosData = await apiGet("books", user?.token);
      const librosDeCategoria = librosData.filter(libro =>
        libro.categorias && libro.categorias.some(cat => cat._id === id)
      );
      setLibros(librosDeCategoria);
    } catch (err) {
      setError("Error al cargar la información");
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
        setLibros((prev) => prev.filter((libro) => libro._id !== libroId));
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

  if (!categoria) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">Categoría no encontrada</div>
        <Link to="/dashboard/categorias" className="btn btn-primary">
          Volver a Categorías
        </Link>
      </div>
    );
  }

  return (
    <div className="container my-4">
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <Link to="/dashboard/categorias" className="btn btn-secondary me-2">
            <i className="fas fa-arrow-left me-2"></i>Volver a Categorías
          </Link>
          <Link to="/dashboard" className="btn btn-primary">
            <i className="fas fa-book me-2"></i>Ver Todos los Libros
          </Link>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-12 text-center">
          <i className="fas fa-tag fa-4x text-primary mb-3"></i>
          <h1>{categoria.nombre}</h1>
          {categoria.descripcion && (
            <p className="lead">{categoria.descripcion}</p>
          )}
        </div>
      </div>

      <h2>Libros de la categoría "{categoria.nombre}"</h2>

      {libros.length === 0 ? (
        <div className="alert alert-info text-center">
          No hay libros en esta categoría en el catálogo.
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
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
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
                  {/* Columna de información (izquierda) */}
                  <div className="col-md-7">
                    <div className="mb-4">
                      <h5 className="text-muted">
                        {selectedLibro.autores?.map((autor, index) => (
                          <span key={autor._id}>
                            <Link
                              to={`/dashboard/autor/${autor._id}`}
                              className="text-decoration-none"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {autor.nombre} {autor.apellido}
                            </Link>
                            {index < selectedLibro.autores.length - 1 ? ", " : ""}
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

                    <div className="mb-4">
                      <h5>Descripción</h5>
                      <p className="text-justify">
                        {selectedLibro.descripcion ||
                          "No hay descripción disponible."}
                      </p>
                    </div>

                    {/* Botones de acción */}
                    <div className="mt-4 d-flex justify-content-between">
                      <div>
                        {/* Botones de editar/eliminar para admin/bibliotecario */}
                        {(user?.rol === "admin" || user?.rol === "bibliotecario") && (
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
                          <i className="fas fa-bookmark me-2"></i>Solicitar préstamo
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Columna de imagen (derecha) */}
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

export default LibrosPorCategoria;