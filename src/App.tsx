import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import "./styles/global.css";
import Landing from "./pages/Landing";
import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <Routes>
        {/* 기본 랜딩 페이지 (/) */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
