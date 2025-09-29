// src/components/Footer.jsx
import { Link } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { useTheme } from "./ThemeContext";

const Footer = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();

  return (
    <footer className={`footer ${isDarkMode ? 'bg-dark' : 'bg-success bg-gradient'} text-white pt-4 pb-2`}>
      <div className="container">
        <div className="row">
          {/* Acerca de */}
          <div className="col-md-4">
            <h3>Acerca de</h3>
            <p>
              Sistema de Biblioteca Virtual - Plataforma para gestión de préstamos de libros.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div className="col-md-4">
            <h3>Enlaces rápidos</h3>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-white">Inicio</Link></li>
              {user ? (
                <>
                  <li><Link to="/dashboard" className="text-white">Libros</Link></li>
                  <li><Link to="/profile" className="text-white">Mi Perfil</Link></li>

                  {/* Opciones extra para bibliotecarios y administradores */}
                  {(user.rol === 'admin' || user.rol === 'bibliotecario') && (
                    <>
                      <li><Link to="/agregar-libro" className="text-white">Agregar Libro</Link></li>
                      <li><Link to="/gestionar-prestamos" className="text-white">Gestionar Préstamos</Link></li>
                    </>
                  )}
                </>
              ) : (
                <>
                  <li><Link to="/register" className="text-white">Registrarse</Link></li>
                  <li><Link to="/forgot-password" className="text-white">Recuperar Contraseña</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* Contacto */}
          <div className="col-md-4">
            <h3>Contacto</h3>
            <p><i className="fas fa-envelope me-2"></i> contacto@bibliotecasena.com</p>
            <p><i className="fas fa-phone me-2"></i> +123 456 789</p>
          </div>
        </div>

        {/* Footer inferior */}
        <div className="row mt-3 pt-3 border-top border-white">
          <div className="col-md-6">
            <p>&copy; 2025 Sistema de Biblioteca Virtual SENA.</p>
          </div>
          <div className="col-md-6 text-md-end">
            <a href="#" className="text-white me-2"><i className="fab fa-facebook"></i></a>
            <a href="#" className="text-white me-2"><i className="fab fa-twitter"></i></a>
            <a href="#" className="text-white"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;