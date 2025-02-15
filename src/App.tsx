import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import "./styles/global.css";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Reservation from "./pages/Reservation";
import ReservationComplete from "./pages/ReservationComplete";
import DesignerDetail from "./pages/DesignerDetail";
import OAuthCallback from "./pages/OAuthCallback";
import DesignerList from "./pages/DesignerList";
import MyReservation from "./pages/MyReservation";
import MyReservationDetail from "./pages/MyReservationDetail";

function App() {
  return (
    <Router>
      <Routes>
        {/* 기본 랜딩 페이지 (/) */}
        <Route path="/" element={<Landing />} />
        <Route path="/oauth2" element={<OAuthCallback />} />
        <Route path="/designerlist" element={<DesignerList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/reservationcomplete" element={<ReservationComplete />} />
        <Route path="/designerdetail" element={<DesignerDetail />} />
        <Route path="/myreservation" element={<MyReservation />} />
        <Route path="/myreservation/:myreservationId" element={<MyReservationDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
