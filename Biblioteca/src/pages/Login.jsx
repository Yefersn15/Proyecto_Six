// src/pages/Login.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { user, login } = useAuth();
  const navigate = useNavigate();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    const res = await login(form);
    if (!res) {
      setError('Credenciales inválidas');
      return;
    }
    navigate("/dashboard");
  };

  return (
    <div className="col-md-4">
      <div className="card h-100">
        <div className="card-header bg-success text-white">
          <h4 className="mb-0">Iniciar Sesión</h4>
        </div>
        <div className="card-body">
          {error && <p className="text-danger text-center">{error}</p>}
          <form onSubmit={handleLogin}>
            <div className="form-group mb-3">
              <label>Email</label>
              <input type="email" className="form-control" name="email" required value={form.email} onChange={handleChange} />
            </div>
            <div className="form-group mb-3">
              <label>Contraseña</label>
              <input type="password" className="form-control" name="password" required value={form.password} onChange={handleChange} />
            </div>
            <button type="submit" className="btn btn-success w-100">Iniciar sesión</button>
            <div className="mt-3 text-center">
              <p className="mb-1">¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link></p>
              <p><Link to="/forgot-password">Recuperar contraseña</Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;