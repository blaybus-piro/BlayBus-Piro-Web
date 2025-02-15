import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (!code) {
      console.error("Authorization code가 없습니다.");
      navigate("/"); // 로그인 실패 시 홈으로 리디렉트
      return;
    }

    const isDockerEnv = window.location.hostname === "backend";
    const BACKEND_URL = isDockerEnv
      ? "http://backend:8080"
      : import.meta.env.VITE_BACKEND_URL || "https://blarybus-haertz.netlify.app";

    // 백엔드에서 요청한 대로 '/oauth2'로 리디렉션 처리
    const redirectUrl = `${BACKEND_URL}/oauth2`;
    window.location.href = `${redirectUrl}?code=${code}`;
  }, [navigate]);

  return <div>로그인 처리 중...</div>;
}
