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

    const formData = new URLSearchParams();
    formData.append("code", code);

    const isDockerEnv = window.location.hostname === "backend";
    const BACKEND_URL = isDockerEnv
      ? "http://backend:8080"
      : import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

    fetch(`${BACKEND_URL}/api/oauth2/callback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
      credentials: "include",
    })


      .then((res) => {
        if (!res.ok) throw new Error("서버 응답 오류");

        const accessToken = res.headers.get("Authorization"); // 응답 헤더에서 AccessToken 추출
        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
          navigate("/designerlist"); // 로그인 성공 후 디자이너 리스트 페이지로 이동
        } else {
          throw new Error("AccessToken이 없습니다.");
        }
      })
      .catch((err) => {
        console.error("OAuth Callback Error:", err);
        navigate("/"); // 로그인 실패 시 홈으로 이동
      });
  }, [navigate]);

  return <div>로그인 처리 중...</div>;
}
