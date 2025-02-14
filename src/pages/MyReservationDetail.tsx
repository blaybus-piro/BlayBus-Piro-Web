import React, { useState } from 'react';
import { useLocation } from "react-router-dom";
import Header from "../components/Header/Header";
import ReservationCard from "../components/ReservationCard/ReservationCard";
import MeetLinkButton from "../components/MeetLinkButton";
import Modal from "../components/Modal/Modal";
import "../styles/MyReservationDetail.styles.css";

const MyReservationDetail: React.FC = () => {
    const location = useLocation();
    const reservation = location.state;
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="my-reservation-detail-container">
            <Header title="내 예약 상세" />
            <ReservationCard {...reservation} />
            <div className="division" />
            <div className="deposit-info">
                <h3>입금 정보</h3>
                <div className="deposit-price">
                    <p>결제 금액</p>
                    <p>20,000원</p>
                </div>
                <div className="deposit-account">
                    <p>결제 계좌</p>
                    <p>하나은행 13891030599207</p>
                </div>
                <div className="deposit-time">
                    <p>결제 시간</p>
                    <p>2025년 2월 4일 23:32:29</p>
                </div>
            </div>
            <div className="division" />
            <div className="reservation-person">
                <h3>예약자 정보</h3>
                <div className="reservation-person-name">
                    <p>이름</p>
                    <p>장지요</p>
                </div>
                <div className="reservation-person-email">
                    <p>이메일</p>
                    <p>wldy4627@gmail.com</p>
                </div>
            </div>
            <footer>
                <p className="reservation-cancel" onClick={() => setIsModalOpen(true)}>예약 취소</p>
                {isModalOpen && (
                    <Modal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        children="정말 예약을 취소할까요?"
                        confirmVariant="negative"
                    />
                )}
                {reservation.type === "비대면" && (
                    <MeetLinkButton
                        children="구글 미트 링크"
                        meetLink={reservation.meetLink}
                    />
                )}
            </footer>
        </div>
    );
};

export default MyReservationDetail;