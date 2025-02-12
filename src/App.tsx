import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import "./styles/global.css";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Reservation from "./pages/Reservation";
import ReservationComplete from "./pages/ReservationComplete";

function App() {
  return (
    <Router>
      <Routes>
        {/* 기본 랜딩 페이지 (/) */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/reservationcomplete" element={<ReservationComplete />} />
      </Routes>
    </Router>
  );
}

export default App;
