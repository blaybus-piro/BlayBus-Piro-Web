import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

export default function PrivateRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("accessToken"));

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("accessToken");
      setIsAuthenticated(!!token); // 🔹 상태 업데이트

      if (!token) {
        console.warn("🚨 토큰 없음 → 자동 로그아웃 실행");
        window.location.href = "/"; // 🔹 로그인 페이지로 이동
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
}
