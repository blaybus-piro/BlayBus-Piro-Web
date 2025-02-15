import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get("code");
    console.log(code);

    if (!code) {
      console.error("Authorization code가 없습니다.");
      navigate("/");
      return;
    }

    const isDockerEnv = window.location.hostname === "backend";
    const BACKEND_URL = isDockerEnv
      ? "http://backend:8080"
      : import.meta.env.VITE_BACKEND_URL || "https://blarybus-haertz.netlify.app";

    fetch(`${BACKEND_URL}/api/oauth2/callback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ code }).toString(),
      credentials: "include",
    })
    .then((res) => {
      if (!res.ok) throw new Error("OAuth2 토큰 요청 실패");
      console.log(res.headers);

      let accessToken = res.headers.get("Authorization");
      if (!accessToken) throw new Error("Authorization 헤더 없음");

      accessToken = accessToken.replace("Bearer ", "");

      localStorage.setItem("accessToken", accessToken);

      console.log("OAuth2 AccessToken 저장 완료:", accessToken);
      navigate("/designerlist");
    })
    .catch((err) => {
      console.error("OAuth Callback Error:", err);
      navigate("/");
    });
  }, [location, navigate]);

  return <div>로그인 처리 중...</div>;
}
