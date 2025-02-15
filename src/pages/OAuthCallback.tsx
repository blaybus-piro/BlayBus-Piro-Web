import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const location = useLocation(); // 현재 URL 정보 가져오기

  useEffect(() => {
    if (location.pathname !== "/oauth2") return; // '/oauth2'에서만 실행

    const urlParams = new URLSearchParams(location.search);
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

    // 🔹 `fetch`를 사용하여 `/oauth2/callback`으로 POST 요청 보내기
    fetch(`${BACKEND_URL}/oauth2/callback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ code }).toString(), // `code`를 body에 추가
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("OAuth2 토큰 요청 실패");
        return res.json();
      })
      .then((data) => {
        console.log("OAuth2 토큰 응답:", data);
        navigate("/designerlist"); // 로그인 성공 시 이동
      })
      .catch((err) => {
        console.error("OAuth Callback Error:", err);
        navigate("/"); // 실패 시 홈으로 이동
      });
  }, [location, navigate]);

  return <div>로그인 처리 중...</div>;
}
