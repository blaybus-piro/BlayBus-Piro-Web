import "../styles/Landing.styles.css";

export default function LandingPage() {
  const isDockerEnv = window.location.hostname === "backend"; // Docker 내부인지 확인
  const BACKEND_URL = isDockerEnv
    ? "http://backend:8080"  // Docker 컨테이너 내부에서 실행할 때
    : import.meta.env.VITE_BACKEND_URL || "http://backend:8080"; // 로컬 환경

  const handleGoogleLogin = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/oauth2/login`);
      if (!res.ok) throw new Error("로그인 URL 요청 실패");

      const loginUrl = await res.text(); // 응답이 단순 URL일 경우
      window.location.href = loginUrl;
    } catch (err) {
      console.error("Google Login Error:", err);
    }
  };


  return (
    <div className="landing-container">
      <header className="header">
        <img src="/icons/logo.svg" alt="logo" />
      </header>

      <div className="hero-container">
        <section className="hero-section-1">
          <h2 className="hero-text-1">당신을 위한</h2>
        </section>

        <section className="hero-section-2">
          <h2 className="hero-text-2">헤어스타일</h2>
        </section>
      </div>

      <div className="button-container">
        <button className="google-login-btn" onClick={handleGoogleLogin}>
          <img src="/icons/google-icon.svg" alt="Google" />
          구글로 시작하기
        </button>
      </div>
    </div>
  );
}
