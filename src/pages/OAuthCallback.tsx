import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const location = useLocation(); // 현재 URL 정보 가져오기

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get("code");
    console.log(code);

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
    fetch(`${BACKEND_URL}/api/oauth2/callback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ code }).toString(), // `code`를 body에 추가
      credentials: "include",
    })
    .then((res) => {
      if (!res.ok) throw new Error("OAuth2 토큰 요청 실패");

      // 🔹 응답 헤더에서 Authorization 헤더 값 추출
      let accessToken = res.headers.get("Authorization");
      if (!accessToken) throw new Error("Authorization 헤더 없음");

      // 🔹 Bearer 접두사 제거
      accessToken = accessToken.replace("Bearer ", "");

      // 🔹 localStorage에 저장
      localStorage.setItem("accessToken", accessToken);

      console.log("OAuth2 AccessToken 저장 완료:", accessToken);
      navigate("/designerlist"); // 로그인 성공 시 이동
    })
    .catch((err) => {
      console.error("OAuth Callback Error:", err);
      navigate("/"); // 실패 시 홈으로 이동
    });
  }, [location, navigate]);

  return <div>로그인 처리 중...</div>;
}
