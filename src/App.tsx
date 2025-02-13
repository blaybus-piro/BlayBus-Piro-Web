import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import "./styles/global.css";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Reservation from "./pages/Reservation";
import DesignerDetail from "./pages/DesignerDetail";

function App() {
  return (
    <Router>
      <Routes>
        {/* 기본 랜딩 페이지 (/) */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Reservation" element={<Reservation />} />
        <Route path="/DesignerDetail" element={<DesignerDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
