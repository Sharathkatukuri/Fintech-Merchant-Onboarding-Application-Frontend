import { Navigate, Outlet } from "react-router-dom";
import { getUserRole, isAuthenticated } from "../utils/authStorage";

function ProtectedRoute({ allowedRoles = [] }) {
  const authenticated = isAuthenticated();
  const role = getUserRole();

  if (!authenticated) {
    return <Navigate to={allowedRoles.includes("admin") ? "/admin/login" : "/login"} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to={role === "admin" ? "/admin/dashboard" : "/dashboard"} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
