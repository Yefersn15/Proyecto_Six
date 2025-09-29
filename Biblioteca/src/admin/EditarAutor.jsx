import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { apiGet, apiPut } from "../api/api";

const EditarAutor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    nacionalidad: '',
    generoLiterario: '',
    biografia: '',
    fotografiaUrl: '',
    idiomaPrincipal: '',
    obrasDestacadas: [],
    premios: [],
    redesSociales: {
      facebook: '',
      twitter: '',
      instagram: '',
      portafolio: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAutor = async () => {
      try {
        const autorData = await apiGet(`authors/${id}`, user.token);
        
        setFormData({
          nombre: autorData.nombre || '',
          apellido: autorData.apellido || '',
          nacionalidad: autorData.nacionalidad || '',
          generoLiterario: autorData.generoLiterario || '',
          biografia: autorData.biografia || '',
          fotografiaUrl: autorData.fotografiaUrl || '',
          idiomaPrincipal: autorData.idiomaPrincipal || '',
          obrasDestacadas: autorData.obrasDestacadas || [],
          premios: autorData.premios || [],
          redesSociales: autorData.redesSociales || {
            facebook: '',
            twitter: '',
            instagram: '',
            portafolio: ''
          }
        });
      } catch (err) {
        setError('Error al cargar el autor');
        console.error(err);
      }
    };

    fetchAutor();
  }, [id, user.token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('redesSociales.')) {
      const socialField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        redesSociales: {
          ...prev.redesSociales,
          [socialField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleArrayChange = (e, field) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value.split(',').map(item => item.trim())
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiPut(`authors/${id}`, formData, user.token);
      
      if (response.msg) {
        setError(response.msg);
      } else {
        navigate('/dashboard/autores');
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
          <h2 className="mb-0">Editar Autor: {formData.nombre} {formData.apellido} (ID: {id})</h2>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6">
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
              <div className="col-md-6">
                <label className="form-label">Apellido *</label>
                <input
                  type="text"
                  className="form-control"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">Nacionalidad *</label>
                <input
                  type="text"
                  className="form-control"
                  name="nacionalidad"
                  value={formData.nacionalidad}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Género Literario *</label>
                <input
                  type="text"
                  className="form-control"
                  name="generoLiterario"
                  value={formData.generoLiterario}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Idioma Principal *</label>
                <input
                  type="text"
                  className="form-control"
                  name="idiomaPrincipal"
                  value={formData.idiomaPrincipal}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Biografía *</label>
              <textarea
                className="form-control"
                name="biografia"
                value={formData.biografia}
                onChange={handleChange}
                rows="4"
                required
              ></textarea>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Fotografía (URL)</label>
                <input
                  type="url"
                  className="form-control"
                  name="fotografiaUrl"
                  value={formData.fotografiaUrl}
                  onChange={handleChange}
                  placeholder="URL completa de la imagen"
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Obras Destacadas (separadas por comas)</label>
                <input
                  type="text"
                  className="form-control"
                  name="obrasDestacadas"
                  value={formData.obrasDestacadas.join(', ')}
                  onChange={(e) => handleArrayChange(e, 'obrasDestacadas')}
                  placeholder="Ej: Cien años de soledad, El otoño del patriarca"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Premios (separados por comas)</label>
                <input
                  type="text"
                  className="form-control"
                  name="premios"
                  value={formData.premios.join(', ')}
                  onChange={(e) => handleArrayChange(e, 'premios')}
                  placeholder="Ej: Premio Nobel de Literatura, Premio Cervantes"
                />
              </div>
            </div>

            <div className="row mb-4">
              <h5>Redes Sociales</h5>
              <div className="col-md-3">
                <label className="form-label">Facebook</label>
                <input
                  type="url"
                  className="form-control"
                  name="redesSociales.facebook"
                  value={formData.redesSociales.facebook}
                  onChange={handleChange}
                  placeholder="URL de Facebook"
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Twitter</label>
                <input
                  type="url"
                  className="form-control"
                  name="redesSociales.twitter"
                  value={formData.redesSociales.twitter}
                  onChange={handleChange}
                  placeholder="URL de Twitter"
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Instagram</label>
                <input
                  type="url"
                  className="form-control"
                  name="redesSociales.instagram"
                  value={formData.redesSociales.instagram}
                  onChange={handleChange}
                  placeholder="URL de Instagram"
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Portafolio</label>
                <input
                  type="url"
                  className="form-control"
                  name="redesSociales.portafolio"
                  value={formData.redesSociales.portafolio}
                  onChange={handleChange}
                  placeholder="URL de portafolio"
                />
              </div>
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
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard/autores')}>
                <i className="fas fa-times me-2"></i>Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditarAutor;