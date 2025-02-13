import React from 'react';
import "./HomeHeader.styles.css";
import logo from "../../assets/logo.svg";
import reservationIcon from "../../assets/reservation.svg";

const HomeHeader: React.FC = () => {
    return (
        <header className="home-header">
            <img src={logo} alt="logo" />
            <div className="reservation">
                <img src={reservationIcon} alt="reservation-icon" />
                <span>내 예약</span>
            </div>
        </header>
    );
};

export default HomeHeader;