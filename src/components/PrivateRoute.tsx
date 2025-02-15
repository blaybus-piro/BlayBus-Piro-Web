import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
  const accessToken = localStorage.getItem("accessToken");

  return accessToken ? <Outlet /> : <Navigate to="/" replace />;
}
