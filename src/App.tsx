import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import "./styles/global.css";
import Landing from "./pages/Landing";
import Reservation from "./pages/Reservation";
import ReservationComplete from "./pages/ReservationComplete";
import DesignerDetail from "./pages/DesignerDetail";
import OAuthCallback from "./pages/OAuthCallback";
import DesignerList from "./pages/DesignerList";
import MyReservation from "./pages/MyReservation";
import MyReservationDetail from "./pages/MyReservationDetail";
import Payment from "./pages/Payment";
// import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* 기본 랜딩 페이지 (/) */}
        <Route path="/" element={<Landing />} />
        <Route path="/oauth2" element={<OAuthCallback />} />
        <Route path="/designerlist" element={<DesignerList />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/reservationcomplete" element={<ReservationComplete />} />
        <Route path="/designerdetail/:designerId" element={<DesignerDetail />} />
        <Route path="/myreservation/:userId" element={<MyReservation />} />
        <Route path="/myreservationdetail/:myreservationId" element={<MyReservationDetail />} />
        {/* <Route element={<PrivateRoute />}>
          <Route path="/designerlist" element={<DesignerList />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/reservationcomplete" element={<ReservationComplete />} />
          <Route path="/designerdetail/:designerId" element={<DesignerDetail />} />
          <Route path="/myreservation/:userId" element={<MyReservation />} />
          <Route path="/myreservation/:myreservationId" element={<MyReservationDetail />} />
        </Route> */}
      </Routes>
    </Router>
  );
}

export default App;
