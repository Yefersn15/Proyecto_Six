// src/routes/Rutas.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// Inicio//
import Home from "../pages/Home";
import PrivateRoute from "../routes/PrivateRoute";

// Usuario
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import Profile from "../pages/Profile";
import AdminUsers from "../admin/AdminUsers"

// Libro
import Dashboard from "../pages/Dashboard";
import InsertarLibro from "../admin/InsertarLibros";
import EditarLibro from "../admin/EditarLibro";

// Prestamo
import SolicitarPrestamo from "../pages/SolicitarPrestamo";
import GestionarPrestamos from "../admin/GestionarPrestamos";

// Autores //
import InsertarAutores from "../admin/InsertarAutores";
import AutoresDashboard from "../pages/AutoresDashboard";
import LibrosPorAutor from "../pages/LibrosPorAutor";
import EditarAutor from "../admin/EditarAutor"

// Categorias //
import CategoriasDashboard from "../pages/CategoriasDashboard";
import LibrosPorCategoria from "../pages/LibrosPorCategoria";
import InsertarCategoria from "../admin/InsertarCategoria"
import EditarCategoria from "../admin/EditarCategoria"

// Componente para redirigir usuarios autenticados lejos de las páginas de login/registro
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : children;
};

// Componente para verificar roles específicos
const RoleRoute = ({ children, requiredRoles = [] }) => {
  const { user } = useAuth();

  // Si no hay usuario autenticado → redirigir al inicio
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Si hay roles requeridos y el rol del usuario no está incluido → redirigir al dashboard
  if (requiredRoles.length > 0 && !requiredRoles.includes(user.rol)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Acceso permitido
  return children;
};

const Rutas = () => {
  return (
    <Routes>
      {/* Rutas públicas (solo para usuarios no autenticados) */}
      <Route path="/" element={
        <PublicRoute>
          <Home />
        </PublicRoute>
      } />

      <Route path="/register" element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } />


      <Route path="/forgot-password" element={
        <PublicRoute>
          <ForgotPassword />
        </PublicRoute>
      } />

      {/* Rutas protegidas (requieren autenticación) */}
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />

      <Route path="/profile" element={
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      } />

      <Route path="/admin-users" element={
        <PrivateRoute>
          <RoleRoute requiredRoles={["admin"]}>
            <AdminUsers />
          </RoleRoute>
        </PrivateRoute>
      } />

      <Route path="/solicitar-prestamo" element={
        <PrivateRoute>
          <SolicitarPrestamo />
        </PrivateRoute>
      } />

      <Route path="/dashboard/autores" element={
        <PrivateRoute>
          <AutoresDashboard />
        </PrivateRoute>
      } />

      <Route path="/dashboard/autor/:id" element={
        <PrivateRoute>
          <LibrosPorAutor />
        </PrivateRoute>
      } />

      {/* Rutas para administradores y bibliotecarios */}

      <Route path="/dashboard/autores/nuevo" element={
        <PrivateRoute>
          <RoleRoute requiredRoles={["admin", "bibliotecario"]}>
            <InsertarAutores />
          </RoleRoute>
        </PrivateRoute>} />

      <Route path="/dashboard/autores/editar/:id" element={
        <PrivateRoute>
          <RoleRoute requiredRoles={["admin", "bibliotecario"]}>
            <EditarAutor />
          </RoleRoute>
        </PrivateRoute>} />

      <Route path="/agregar-libro" element={
        <PrivateRoute>
          <RoleRoute requiredRoles={["admin", "bibliotecario"]}>
            <InsertarLibro />
          </RoleRoute>
        </PrivateRoute>
      } />

      <Route path="/editar-libro/:id" element={
        <PrivateRoute>
          <RoleRoute requiredRoles={["admin", "bibliotecario"]}>
            <EditarLibro />
          </RoleRoute>
        </PrivateRoute>
      } />

/* Rutas para categorías */
      <Route path="/dashboard/categorias" element={
        <PrivateRoute>
          <CategoriasDashboard />
        </PrivateRoute>
      } />

      <Route path="/dashboard/categoria/:id" element={
        <PrivateRoute>
          <LibrosPorCategoria />
        </PrivateRoute>
      } />

      <Route path="/dashboard/categorias/nueva" element={
        <PrivateRoute>
          <RoleRoute requiredRoles={["admin", "bibliotecario"]}>
            <InsertarCategoria />
          </RoleRoute>
        </PrivateRoute>
      } />

      <Route path="/gestionar-prestamos" element={
        <PrivateRoute>
          <RoleRoute requiredRoles={["admin", "bibliotecario"]}>
            <GestionarPrestamos />
          </RoleRoute>
        </PrivateRoute>
      } />

      <Route path="/dashboard/categorias/editar/:id" element={
        <PrivateRoute>
          <RoleRoute requiredRoles={["admin", "bibliotecario"]}>
            <EditarCategoria />
          </RoleRoute>
        </PrivateRoute>
      } />
    </Routes>
  );
};

export default Rutas;