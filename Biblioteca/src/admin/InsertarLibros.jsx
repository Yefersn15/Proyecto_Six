import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { apiPost, apiGet } from "../api/api";

const InsertarLibros = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [autores, setAutores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [formData, setFormData] = useState({
    titulo: '',
    autores: [],
    descripcion: '',
    isbn: '',
    portadaUrl: '',
    idioma: '',
    categorias: [],
    etiquetas: [],
    paginas: 0,
    copias: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Cargar autores y categorías desde la API
  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const [autoresData, categoriasData] = await Promise.all([
          apiGet('authors', user.token),
          apiGet('categories', user.token)
        ]);
        setAutores(autoresData);
        setCategorias(categoriasData);
      } catch (err) {
        setError('Error al cargar datos');
        console.error('Error al cargar datos:', err);
      }
    };

    fetchDatos();
  }, [user.token]);

  // Manejo de campos simples
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejo de select múltiple (autores y categorías)
  const handleMultiSelectChange = (e, field) => {
    const options = e.target.options;
    const selectedValues = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    setFormData(prev => ({
      ...prev,
      [field]: selectedValues
    }));
  };

  // Manejo de arrays desde inputs separados por comas (etiquetas)
  const handleArrayChange = (e, field) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value.split(',').map(item => item.trim())
    }));
  };

  // Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const dataToSend = {
        ...formData,
        paginas: parseInt(formData.paginas),
        copias: parseInt(formData.copias),
        disponibles: parseInt(formData.copias)
      };

      const response = await apiPost('books', dataToSend, user.token);

      if (response.msg) {
        setError(response.msg);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Error al guardar el libro');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-header bg-success text-white">
          <h2 className="mb-0">
            <i className="fas fa-book-medical me-2"></i>
            Agregar Nuevo Libro
          </h2>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Título y Autores */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Título *</label>
                <input
                  type="text"
                  className="form-control"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Autores *</label>
                <select
                  multiple
                  className="form-select"
                  name="autores"
                  value={formData.autores}
                  onChange={(e) => handleMultiSelectChange(e, 'autores')}
                  required
                  size="4"
                >
                  {autores.map(autor => (
                    <option key={autor._id} value={autor._id}>
                      {autor.nombre} {autor.apellido} - {autor.nacionalidad}
                    </option>
                  ))}
                </select>
                <small className="form-text text-muted">
                  Mantén presionada la tecla Ctrl (Windows) o Comando (Mac) para seleccionar múltiples autores.
                </small>
              </div>
            </div>

            {/* ISBN e Idioma */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">ISBN</label>
                <input
                  type="text"
                  className="form-control"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Idioma *</label>
                <input
                  type="text"
                  className="form-control"
                  name="idioma"
                  value={formData.idioma}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Descripción */}
            <div className="mb-3">
              <label className="form-label">Descripción</label>
              <textarea
                className="form-control"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows="3"
              ></textarea>
            </div>

            {/* Portada, Categorías, Etiquetas */}
            <div className="row mb-4">
              <div className="col-md-6">
                <label className="form-label">Portada (URL)</label>
                <input
                  type="url"
                  className="form-control"
                  name="portadaUrl"
                  value={formData.portadaUrl}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Categorías *</label>
                <select
                  multiple
                  className="form-select"
                  name="categorias"
                  value={formData.categorias}
                  onChange={(e) => handleMultiSelectChange(e, 'categorias')}
                  required
                  size="4"
                >
                  {categorias.map(categoria => (
                    <option key={categoria._id} value={categoria._id}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Etiquetas (separadas por comas)</label>
                <input
                  type="text"
                  className="form-control"
                  name="etiquetas"
                  value={formData.etiquetas.join(', ')}
                  onChange={(e) => handleArrayChange(e, 'etiquetas')}
                  placeholder="ficción, clásico, bestseller"
                />
              </div>
            </div>

            {/* Páginas y Copias */}
            <div className="row mb-4">
              <div className="col-md-3">
                <label className="form-label">Páginas</label>
                <input
                  type="number"
                  className="form-control"
                  name="paginas"
                  value={formData.paginas}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Copias *</label>
                <input
                  type="number"
                  className="form-control"
                  name="copias"
                  value={formData.copias}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>
            </div>

            {/* Botones */}
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <button
                type="submit"
                className="btn btn-primary me-md-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Guardando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save me-2"></i>
                    Guardar Libro
                  </>
                )}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/dashboard')}
              >
                <i className="fas fa-times me-2"></i>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InsertarLibros;