import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get("code");
    console.log('Authorization code:', code);  // 코드 값 확인

    if (!code) {
      console.error("Authorization code가 없습니다.");
      navigate("/");
      return;
    }

    const isDockerEnv = window.location.hostname === "backend";
    const BACKEND_URL = isDockerEnv
      ? "http://backend:8080"
      : import.meta.env.VITE_BACKEND_URL || "https://blarybus-haertz.netlify.app";

    console.log('Requesting token from:', `${BACKEND_URL}/api/oauth2/callback`);  // 요청 URL 확인

    fetch(`${BACKEND_URL}/api/oauth2/callback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ code }).toString(),
      credentials: "include",
    })
    .then(async (res) => {
      console.log('Response status:', res.status);  // 응답 상태 확인
      console.log('Response headers:', Object.fromEntries(res.headers));  // 모든 헤더 확인

      if (!res.ok) {
        // 에러 응답의 내용도 확인
        const errorText = await res.text();
        console.error('Error response:', errorText);
        throw new Error(`OAuth2 토큰 요청 실패: ${res.status}`);
      }

      let accessToken = res.headers.get("Authorization");
      if (!accessToken) {
        // 응답 본문에서도 토큰을 확인
        try {
          const body = await res.json();
          accessToken = body.access_token || body.token;
          if (!accessToken) throw new Error("토큰을 찾을 수 없음");
        } catch (e) {
          throw new Error("Authorization 헤더와 응답 본문에 토큰이 없음");
        }
      } else {
        accessToken = accessToken.replace("Bearer ", "");
      }

      localStorage.setItem("accessToken", accessToken);
      console.log("OAuth2 AccessToken 저장 완료. 토큰 길이:", accessToken.length);
      
      // 저장된 토큰 확인
      const storedToken = localStorage.getItem("accessToken");
      console.log("저장된 토큰 확인. 길이:", storedToken?.length);

      navigate("/designerlist");
    })
    .catch((err) => {
      console.error("OAuth Callback Error:", err);
      // 에러 발생 시 토큰 삭제
      localStorage.removeItem("accessToken");
      navigate("/");
    });
  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="mb-4">로그인 처리 중...</div>
        <div className="text-sm text-gray-500">잠시만 기다려주세요.</div>
      </div>
    </div>
  );
}