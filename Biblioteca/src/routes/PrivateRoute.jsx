// src/routes/PrivateRoute.jsx
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, requiredRoles }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  if (requiredRoles && !requiredRoles.includes(user.rol)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

export default PrivateRoute;