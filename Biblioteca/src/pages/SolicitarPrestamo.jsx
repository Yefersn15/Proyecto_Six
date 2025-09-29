// src/pages/SolicitarPrestamo.jsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiPost, apiGet } from '../api/api';

const SolicitarPrestamo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const libro = location.state?.libro || null;

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Cargar información del usuario para mostrar dirección y barrio
    const fetchUserInfo = async () => {
      try {
        const userData = await apiGet('auth/me', user.token);
        setUserInfo(userData);
      } catch (err) {
        console.error('Error al cargar información del usuario:', err);
      }
    };

    // Verificar disponibilidad al cargar el componente
    if (libro && libro.disponibles <= 0) {
      setError('No hay copias disponibles de este libro');
    }

    fetchUserInfo();
  }, [libro, user]);

  const handleSolicitar = async () => {
    try {
      if (libro.disponibles <= 0) {
        setError('No hay copias disponibles de este libro');
        return;
      }

      const response = await apiPost('loans', { libroId: libro._id }, user.token);

      if (response) {
        setSuccess('Solicitud de préstamo enviada correctamente');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Error al solicitar el préstamo');
    }
  };

  return (
    <div className="container mt-2">
      <h3 className="mb-2">Solicitud de Préstamo de Libro</h3>

      <div className="d-flex gap-2 mb-2">
        <button
          className="btn btn-primary"
          onClick={handleSolicitar}
          disabled={!libro || libro.disponibles <= 0}
        >
          <i className="fas fa-book me-2"></i> Solicitar Préstamo
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/dashboard')}
        >
          <i className="fas fa-arrow-left me-2"></i> Volver al Catálogo
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {libro && (
        <div className="card mb-4">
          <div className="card-body">
            <div className="row">
              <div className="col-md-3">
                <img
                  src={libro.portadaUrl || "https://via.placeholder.com/200x300/6c757d/ffffff?text=Sin+imagen"}
                  className="img-fluid rounded"
                  alt={libro.titulo}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              </div>
              <div className="col-md-9">
                <h4>{libro.titulo}</h4>
                <p className="text-muted">
                  {libro.autores?.map(a => `${a.nombre} ${a.apellido}`).join(', ')}
                </p>
                <p>
                  <strong>Disponibles:</strong> {libro.disponibles} de {libro.copias}
                  {libro.disponibles <= 0 &&
                    <span className="text-danger"> - No disponible</span>
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Información de entrega */}
      {userInfo && (
        <div className="card mb-4">
          <div className="card-header bg-info text-white">
            <h5 className="mb-0">Información de Entrega</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <p><strong>Nombre:</strong> {userInfo.nombre} {userInfo.apellidos}</p>
                <p><strong>Documento:</strong> {userInfo.tipoDocumento === 'cc' && 'CC '}
                  {userInfo.tipoDocumento === 'ti' && 'TI '}
                  {userInfo.tipoDocumento === 'pasaporte' && 'Pasaporte '}
                  {userInfo.tipoDocumento === 'cedula_extranjera' && 'CE '}
                  {userInfo.documento}
                </p>
              </div>
              <div className="col-md-6">
                <p><strong>Dirección:</strong> {userInfo.direccion}</p>
                <p><strong>Barrio:</strong> {userInfo.barrio}</p>
                <p><strong>Teléfono:</strong> {userInfo.celular}</p>
              </div>
            </div>
            <div className="alert alert-warning mt-3">
              <small>
                <i className="fas fa-info-circle me-2"></i>
                El libro será entregado en esta dirección. Si necesitas actualizar tu información de contacto,
                por favor comunícate con un administrador.
              </small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SolicitarPrestamo;