import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

export default function PrivateRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("accessToken"));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("accessToken"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
}
