import { useState } from "react";
import Input from "../components/Input/Input";
import Header from "../components/Header/Header";
import "../styles/Login.styles.css";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <div className="login-container">
      <Header title="계정 생성" />

      <main className="login-content">
        <h2 className="login-title">정보를 입력해 주세요</h2>

        <div className="login-form">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력해 주세요"
          >
            이름
          </Input>

          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력해 주세요"
          >
            이메일
          </Input>
        </div>
      </main>

      <footer className="login-footer">
        <button
          className="continue-btn"
          disabled={!name || !email}
        >
          계속
        </button>
      </footer>
    </div>
  );
}