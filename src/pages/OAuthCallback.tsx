import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get("code");
    console.log("Authorization code:", code); // 디버깅용 로그

    if (!code) {
      console.error("Authorization code가 없습니다.");
      navigate("/");
      return;
    }

    const isDockerEnv = window.location.hostname === "backend";
    const BACKEND_URL = isDockerEnv
      ? "http://backend:8080"
      : import.meta.env.VITE_BACKEND_URL || "https://blarybus-haertz.netlify.app";

    console.log("Requesting token from:", `${BACKEND_URL}/api/oauth2/callback`);

    fetch(`${BACKEND_URL}/api/oauth2/callback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ code }).toString(),
      credentials: "include",
    })
      .then(async (res) => {
        console.log("Response status:", res.status);

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Error response:", errorText);
          throw new Error(`OAuth2 토큰 요청 실패: ${res.status}`);
        }

        // 전체 헤더 로그 출력
        const headers = Object.fromEntries(res.headers);
        console.log("All headers:", headers);

        let accessToken = res.headers.get("Authorization");

        if (!accessToken) {
          // 만약 Authorization 헤더가 없다면, 응답 본문에서 토큰을 찾아 저장
          const data = await res.json();
          accessToken = data.access_token || null;
        }

        console.log("Raw Authorization header:", accessToken);

        if (accessToken) {
          accessToken = accessToken.replace("Bearer ", "");
          localStorage.setItem("accessToken", accessToken);
          console.log("Token saved:", accessToken);
        } else {
          throw new Error("토큰이 없습니다");
        }

        // 저장된 토큰 확인
        console.log("Stored token:", localStorage.getItem("accessToken"));

        navigate("/designerlist");
      })
      .catch((err) => {
        console.error("OAuth Callback Error:", err);
        localStorage.removeItem("accessToken"); // 에러 발생 시 토큰 삭제
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
