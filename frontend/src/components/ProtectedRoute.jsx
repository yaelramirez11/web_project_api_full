import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, loggedIn, anonymous = false }) => {
  const location = useLocation();
  const from = location.state?.from || "/";
  // Si el usuario ha iniciado la sesión le redirigimos fuera de nuestras rutas anónimas.
  if (anonymous && loggedIn) {
    return <Navigate to={from} />;
  }
  // Si el usuario no ha iniciado la sesión e intenta acceder a una ruta que
  // requiere autorización (!anonymous), le redirigimos a la ruta /login.
  if (!anonymous && !loggedIn) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  // Si está autorizado, renderiza los componentes hijos
  return children;
};

export default ProtectedRoute;
