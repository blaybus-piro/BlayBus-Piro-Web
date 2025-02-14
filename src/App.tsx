import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import "./styles/global.css";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Reservation from "./pages/Reservation";
import ReservationComplete from "./pages/ReservationComplete";
import DesignerDetail from "./pages/DesignerDetail";
import OAuthCallback from "./pages/OAuthCallback";

function App() {
  return (
    <Router>
      <Routes>
        {/* 기본 랜딩 페이지 (/) */}
        <Route path="/" element={<Landing />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/reservationcomplete" element={<ReservationComplete />} />
        <Route path="/DesignerDetail" element={<DesignerDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
