// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { useTheme } from "./ThemeContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        {user && (
          <>
            {/* Opciones generales */}
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">
                <i className="fas fa-home me-1"></i>Libros
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard/autores">
                <i className="fas fa-pen-fancy me-1"></i>Autores
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard/categorias">
                <i className="fas fa-tags me-1"></i>Categorías
              </Link>
            </li>

            {/* Opciones para bibliotecarios y administradores */}
            {(user.rol === 'admin' || user.rol === 'bibliotecario') && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/gestionar-prestamos">
                    <i className="fas fa-exchange-alt me-1"></i>Gestionar Préstamos
                  </Link>
                </li>
              </>
            )}

            {/* Opciones exclusivas para administradores */}
            {user.rol === 'admin' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin-users">
                    <i className="fas fa-user-cog me-1"></i>Administrar Usuarios
                  </Link>
                </li>
              </>
            )}
          </>
        )}
      </ul>

      {/* Acciones a la derecha */}
      <div className="d-flex align-items-center ms-auto">
        {/* Botón cambio de tema */}
        <button
          className="btn btn-outline-light btn-sm me-2"
          onClick={toggleTheme}
          aria-label="Cambiar tema"
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>

        {user ? (
          <>
            <Link className="nav-link" to="/profile">
              <span className="navbar-text me-3 d-none d-md-block">
                Hola, {user.nombre} ({user.rol})
              </span>
            </Link>
            <button
              className="btn btn-outline-light btn-sm"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <Link to="/" className="btn btn-outline-light btn-sm">
            Iniciar sesión
          </Link>
        )}
      </div>
    </>
  );
};

export default Navbar;