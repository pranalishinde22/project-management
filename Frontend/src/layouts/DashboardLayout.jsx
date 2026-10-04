import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function DashboardLayout() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default DashboardLayout;