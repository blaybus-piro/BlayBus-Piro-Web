import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import "./styles/global.css";
import Landing from "./pages/Landing";

function App() {
  return (
    <Router>
      <Routes>
        {/* 기본 랜딩 페이지 (/) */}
        <Route path="/" element={<Landing />} />
      </Routes>
    </Router>
  );
}

export default App;
