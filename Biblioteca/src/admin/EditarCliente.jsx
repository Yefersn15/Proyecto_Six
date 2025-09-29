import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditarCliente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    documento: '',
    correo: '',
    genero: '',
    celular: ''
  });

  useEffect(() => {
    // Simular carga de datos del cliente
    const fetchCliente = async () => {
      // Aquí harías la llamada a la API para obtener el cliente
      const clienteData = {
        id: id,
        nombres: "Juan",
        apellidos: "Pérez",
        documento: "123456789",
        correo: "juan@example.com",
        genero: "masculino",
        celular: "3001234567"
      };
      setFormData(clienteData);
    };

    fetchCliente();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para guardar los cambios del cliente
    console.log("Guardando cambios:", formData);
    navigate('/gestionar-clientes');
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Editar Cliente</h2>
      <form onSubmit={handleSubmit} className="form-control p-4">
        <div className="mb-3">
          <label className="form-label">Nombres</label>
          <input
            type="text"
            className="form-control"
            name="nombres"
            value={formData.nombres}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Apellidos</label>
          <input
            type="text"
            className="form-control"
            name="apellidos"
            value={formData.apellidos}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Documento</label>
          <input
            type="text"
            className="form-control"
            name="documento"
            value={formData.documento}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Correo</label>
          <input
            type="email"
            className="form-control"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Género</label>
          <select
            className="form-control"
            name="genero"
            value={formData.genero}
            onChange={handleChange}
            required
          >
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
            <option value="otro">Otro</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Celular</label>
          <input
            type="tel"
            className="form-control"
            name="celular"
            value={formData.celular}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-success me-2">Guardar Cambios</button>
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/gestionar-clientes')}>
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default EditarCliente;