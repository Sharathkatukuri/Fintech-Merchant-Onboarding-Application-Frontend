import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  clearAuthSession,
  getUserRole,
  isAuthenticated,
} from "../utils/authStorage";

function AppLayout() {
  const navigate = useNavigate();
  const authenticated = isAuthenticated();
  const role = getUserRole();

  const handleLogout = () => {
    clearAuthSession();
    navigate(role === "admin" ? "/admin/login" : "/login", { replace: true });
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <Link className="brand" to="/">
            Viyona
          </Link>
          <p className="subtle-text">Merchant onboarding portal</p>
        </div>
        <nav className="nav-links">
          {!authenticated ? (
            <>
              <Link to="/register">Register</Link>
              <Link to="/login">Login</Link>
              <Link to="/admin/login">Admin Login</Link>
            </>
          ) : null}
          {authenticated && role === "merchant" ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/application">Application</Link>
              <Link to="/status">Status</Link>
            </>
          ) : null}
          {authenticated && role === "admin" ? (
            <>
              <Link to="/admin/dashboard">Admin Dashboard</Link>
            </>
          ) : null}
          {authenticated ? (
            <button type="button" className="link-button" onClick={handleLogout}>
              Logout
            </button>
          ) : null}
        </nav>
      </header>
      <main className="page-container">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
