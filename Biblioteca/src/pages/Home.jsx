import { useState } from 'react';
import { Link } from 'react-router-dom';
import Login from './Login';

const Home = () => {
  return (
    <div>
      {/* Carrusel de imágenes */}
      <div id="welcomeCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active" data-bs-interval="2000">
            <img 
              src="https://www.comunidadbaratz.com/wp-content/uploads/Leer-es-un-modo-de-entretenimiento-y-conocimiento-que-desde-hace-tiempo-convive-y-compite-contra-otras-formas-de-ocio-e-informacion.jpg" 
              className="d-block carousel-image" 
              alt="Libros destacados" 
              style={{ width: '100%', height: '400px', objectFit: 'cover' }}
            />
            <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-75 rounded p-3">
              <h5>Bienvenidos a nuestra biblioteca virtual</h5>
              <p>Sumérgete en un mundo de conocimiento, descubrimiento y aventura literaria.</p>
            </div>
          </div>
          <div className="carousel-item" data-bs-interval="2000">
            <img 
              src="https://vocesazuayas.com/wp-content/uploads/2024/06/lecutra_cultura.jpg" 
              className="d-block carousel-image" 
              alt="Biblioteca virtual" 
              style={{ width: '100%', height: '400px', objectFit: 'cover' }}
            />
            <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-75 rounded p-3">
              <h5>Explora nuestro catálogo</h5>
              <p>Descubre miles de títulos disponibles para tu disfrute.</p>
            </div>
          </div>
          <div className="carousel-item" data-bs-interval="2000">
            <img 
              src="https://www.tuproyectodevida.pe/wp-content/uploads/2019/04/lectura-tradicional-vs-digitak-1200x628.jpg" 
              className="d-block carousel-image" 
              alt="Lectura digital" 
              style={{ width: '100%', height: '400px', objectFit: 'cover' }}
            />
            <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-75 rounded p-3">
              <h5>Acceso desde cualquier dispositivo</h5>
              <p>Tu biblioteca siempre disponible, cuando y donde la necesites.</p>
            </div>
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#welcomeCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Anterior</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#welcomeCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Siguiente</span>
        </button>
      </div>

      {/* Sección de tres columnas */}
      <div className="container mt-4 three-column-section">
        <div className="row">
          <Login />

          {/* Columna 2: Mapa */}
          <div className="col-md-4">
            <div className="card h-100">
              <div className="card-header bg-success text-white">
                Ubicación
              </div>
              <div className="card-body p-0">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.147276464048!2d-75.5755884!3d6.2547111!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e4429020d4090d3%3A0xd9dc5f94adc65133!2sServicio%20Nacional%20de%20Aprendizaje!5e0!3m2!1ses!2sco!4v1719712345678!5m2!1ses!2sco"
                  width="100%" 
                  height="300" 
                  style={{border:0}} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade" 
                  className="map-iframe"
                  title="Ubicación SENA Medellín"
                >
                </iframe>
              </div>
            </div>
          </div>

          {/* Columna 3: Información SENA */}
          <div className="col-md-4">
            <div className="card h-100">
              <div className="card-header bg-success text-white">
                Servicio Nacional de Aprendizaje
              </div>
              <div className="card-body">
                <div className="text-center mb-4">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/8/83/Sena_Colombia_logo.svg" 
                    alt="Logo SENA" 
                    className="sena-logo"
                    style={{width: '100px', height: 'auto'}}
                  />
                </div>
                <h5 className="text-center">SENA Medellín</h5>
                <p><i className="fas fa-map-marker-alt"></i> Cl. 52 #43-31, Medellín</p>
                <p><i className="fas fa-clock"></i> L-V: 8:00 - 20:00</p>
                <p><i className="fas fa-phone"></i> (604) 511 22 22</p>
                <p><i className="fas fa-envelope"></i> contacto@sena.edu.co</p>
                <div className="text-center mt-3">
                  <a href="https://www.sena.edu.co" target="_blank" rel="noopener noreferrer" className="btn btn-outline-success">
                    Visitar sitio web
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;