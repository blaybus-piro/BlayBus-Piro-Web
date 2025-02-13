import "../styles/Landing.styles.css";

export default function LandingPage() {
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
        <button className="google-login-btn">
          <img src="/icons/google-icon.svg" alt="Google" />
          구글로 시작하기
        </button>
      </div>
    </div>
  );
}
