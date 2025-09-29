// src/pages/LibrosPorAutor.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiGet, apiDelete } from "../api/api";

const LibrosPorAutor = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [autor, setAutor] = useState(null);
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLibro, setSelectedLibro] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchAutorYLibros();
  }, [id]);

  const fetchAutorYLibros = async () => {
    try {
      // Obtener información del autor
      const autorData = await apiGet(`authors/${id}`, user?.token);
      setAutor(autorData);

      // Obtener libros de este autor
      const librosData = await apiGet("books", user?.token);
      const librosDelAutor = librosData.filter(libro =>
        libro.autores.some(autor => autor._id === id)
      );
      setLibros(librosDelAutor);
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
        setLibros((prev) => prev.filter((libro) => libro._id !== libroId));
      } catch (err) {
        console.error("Error al eliminar el libro", err);
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

  if (!autor) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">Autor no encontrado</div>
        <Link to="/dashboard/autores" className="btn btn-primary">
          Volver a Autores
        </Link>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <Link to="/dashboard/autores" className="btn btn-secondary me-2">
            <i className="fas fa-arrow-left me-2"></i>Volver a Autores
          </Link>
          <Link to="/dashboard" className="btn btn-primary">
            <i className="fas fa-book me-2"></i>Ver Todos los Libros
          </Link>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-3 text-center">
          <img
            src={autor.fotografiaUrl || "https://via.placeholder.com/200x200/6c757d/ffffff?text=Sin+imagen"}
            className="img-fluid rounded-circle"
            alt={`${autor.nombre} ${autor.apellido}`}
            style={{ width: "200px", height: "200px", objectFit: "cover" }}
          />
        </div>
        <div className="col-md-9">
          <h1>{autor.nombre} {autor.apellido}</h1>
          <p>{autor.nacionalidad} • {autor.generoLiterario}</p>
          <p>{autor.biografia}</p>
        </div>
      </div>

      <h2>Libros de {autor.nombre} {autor.apellido}</h2>

      {libros.length === 0 ? (
        <div className="alert alert-info text-center">
          No hay libros de este autor en el catálogo.
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
                    className={`badge position-absolute bottom-0 start-0 m-2 ${libro.disponibles > 0 ? "bg-success" : "bg-danger"}`}
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
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title">{selectedLibro.titulo}</h3>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  {/* Columna de información (izquierda) */}
                  <div className="col-md-7">
                    <div className="mb-4">
                      <h5 className="text-muted">{selectedLibro.autores?.map(a => a.nombre).join(", ") || "Autor desconocido"}</h5>
                      <div className="mb-3">
                        {selectedLibro.categorias?.map((cat, index) => (
                          <span key={index} className="badge bg-secondary me-1">{cat.nombre}</span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-3">
                      <p><strong>ISBN:</strong> {selectedLibro.isbn || "No especificado"}</p>
                      <p><strong>Idioma:</strong> {selectedLibro.idioma || "No especificado"}</p>
                      <p><strong>Páginas:</strong> {selectedLibro.paginas || "No especificado"}</p>
                      <span className={`badge ${selectedLibro.disponibles > 0 ? "bg-success" : "bg-danger"}`}>
                      disponibles: {selectedLibro.disponibles} de {selectedLibro.copias}
                      </span>
                    </div>

                    <hr />

                    <div className="mb-4">
                      <h5>Descripción</h5>
                      <p className="text-justify">
                        {selectedLibro.descripcion || "No hay descripción disponible."}
                      </p>
                    </div>

                    <div className="mt-4 d-flex justify-content-between">
                      {/* Botones de editar/eliminar para admin/bibliotecario */}
                      <div>
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
                                if (window.confirm("¿Estás seguro de que deseas eliminar este libro?")) {
                                  handleDelete(selectedLibro._id);
                                  closeModal();
                                }
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
                      src={selectedLibro.portadaUrl || "https://via.placeholder.com/300x450/6c757d/ffffff?text=Sin+imagen"}
                      className="img-fluid rounded shadow mb-3"
                      alt={selectedLibro.titulo}
                      style={{ maxHeight: "400px", width: "260px", objectFit: "fit" }}
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

export default LibrosPorAutor;