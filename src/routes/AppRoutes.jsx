import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "../components/AppLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminApplicationDetailsPage from "../pages/AdminApplicationDetailsPage";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import AdminLoginPage from "../pages/AdminLoginPage";
import ApplicationFormPage from "../pages/ApplicationFormPage";
import DashboardPage from "../pages/DashboardPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import StatusPage from "../pages/StatusPage";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/login" replace />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route element={<ProtectedRoute allowedRoles={["merchant"]} />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/application" element={<ApplicationFormPage />} />
            <Route path="/status" element={<StatusPage />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route
              path="/admin/applications/:id"
              element={<AdminApplicationDetailsPage />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
