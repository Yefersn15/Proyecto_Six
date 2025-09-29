import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { apiGet, apiPut } from "../api/api";

const EditarLibro = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

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
    copias: 1,
    disponibles: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Cargar datos del libro
  useEffect(() => {
    const fetchLibro = async () => {
      try {
        const libroData = await apiGet(`books/${id}`, user.token);

        // Asegurar arrays
        const autores = libroData.autores ? libroData.autores.map(a => a._id) : [];
        const categorias = libroData.categorias ? libroData.categorias.map(c => c._id) : [];

        setFormData({
          titulo: libroData.titulo || '',
          autores,
          descripcion: libroData.descripcion || '',
          isbn: libroData.isbn || '',
          portadaUrl: libroData.portadaUrl || '',
          idioma: libroData.idioma || '',
          categorias,
          etiquetas: libroData.etiquetas || [],
          paginas: libroData.paginas || 0,
          copias: libroData.copias || 1,
          disponibles: libroData.disponibles || 0
        });
      } catch (err) {
        setError('Error al cargar el libro');
        console.error(err);
      }
    };

    fetchLibro();
  }, [id, user.token]);

  // Manejo de campos simples
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejo de campos que son arrays desde input (separados por comas)
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
        disponibles: parseInt(formData.disponibles)
      };

      const response = await apiPut(`books/${id}`, dataToSend, user.token);

      if (response.msg) {
        setError(response.msg);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Error al guardar los cambios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0">
            Editar Libro: {formData.titulo} (ID: {id})
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
                <label className="form-label">Autores (IDs separados por comas) *</label>
                <input
                  type="text"
                  className="form-control"
                  name="autores"
                  value={formData.autores.join(', ')}
                  onChange={(e) => handleArrayChange(e, 'autores')}
                  placeholder="Ej: 507f1f77bcf86cd799439011, 507f1f77bcf86cd799439012"
                  required
                />
                <small className="text-muted">
                  Debes conocer los IDs de los autores en la base de datos
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
                <label className="form-label">Categorías (IDs separados por comas)</label>
                <input
                  type="text"
                  className="form-control"
                  name="categorias"
                  value={formData.categorias.join(', ')}
                  onChange={(e) => handleArrayChange(e, 'categorias')}
                  placeholder="Ej: 507f1f77bcf86cd799439011, 507f1f77bcf86cd799439012"
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Etiquetas (separadas por comas)</label>
                <input
                  type="text"
                  className="form-control"
                  name="etiquetas"
                  value={formData.etiquetas.join(', ')}
                  onChange={(e) => handleArrayChange(e, 'etiquetas')}
                  placeholder="Ej: ficción, clásico, bestseller"
                />
              </div>
            </div>

            {/* Páginas, Copias y Disponibles */}
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
              <div className="col-md-3">
                <label className="form-label">Disponibles *</label>
                <input
                  type="number"
                  className="form-control"
                  name="disponibles"
                  value={formData.disponibles}
                  onChange={handleChange}
                  min="0"
                  max={formData.copias}
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
                    Guardar Cambios
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

export default EditarLibro;