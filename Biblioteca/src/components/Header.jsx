// src/components/Header.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from "./ThemeContext";
import Navbar from './Navbar';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDarkMode } = useTheme();

  return (
    <header>
      <nav
        className={`navbar navbar-expand-lg navbar-dark ${
          isDarkMode ? 'bg-dark' : 'bg-success bg-gradient'
        } text-white`}
      >
        <div className="container">
          {/* Marca de la app */}
          <Link className="navbar-brand" to="/">
            <i className="fas fa-book-open me-2"></i>
            Biblioteca SENA
          </Link>

          {/* Botón menú hamburguesa */}
          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-controls="navbarNav"
            aria-expanded={isMenuOpen}
            aria-label="Alternar navegación"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Contenido colapsable */}
          <div
            id="navbarNav"
            className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}
          >
            <Navbar />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;