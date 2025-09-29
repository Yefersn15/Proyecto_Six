import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { apiGet, apiPut } from "../api/api";

const EditarCategoria = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategoria = async () => {
      try {
        const categoriaData = await apiGet(`categories/${id}`, user.token);
        
        setFormData({
          nombre: categoriaData.nombre || '',
          descripcion: categoriaData.descripcion || ''
        });
      } catch (err) {
        setError('Error al cargar la categoría');
        console.error(err);
      }
    };

    fetchCategoria();
  }, [id, user.token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiPut(`categories/${id}`, formData, user.token);
      
      if (response.msg) {
        setError(response.msg);
      } else {
        navigate('/dashboard/categorias');
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
          <h2 className="mb-0">Editar Categoría: {formData.nombre} (ID: {id})</h2>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-12">
                <label className="form-label">Nombre *</label>
                <input
                  type="text"
                  className="form-control"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Descripción</label>
              <textarea
                className="form-control"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows="4"
              ></textarea>
            </div>

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
                    <i className="fas fa-save me-2"></i>Guardar Cambios
                  </>
                )}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard/categorias')}>
                <i className="fas fa-times me-2"></i>Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditarCategoria;