import React, { useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import ReservationCard from "../components/ReservationCard/ReservationCard";
import MeetLinkButton from "../components/MeetLinkButton";
import Modal from "../components/Modal/Modal";
import { cancelReservation } from "../api/cancelReservatin";
import "../styles/MyReservationDetail.styles.css";

const MyReservationDetail: React.FC = () => {
    const location = useLocation();
    const reservation = location.state;
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const displayMethodText =
        reservation.paymentMethod === "ACCOUNTMENT" ? "계좌 이체"
            : "카카오 페이";

    const handleCancelReservation = async () => {
        setLoading(true);
        try {
            await cancelReservation(reservation.id);
            setIsModalOpen(false);

            navigate(`/myreservation`, { state: { showToast: true } });
        } catch (error) {
            console.error("예약 취소 실패", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="my-reservation-detail-container">
            <Header title="내 예약 상세" />
            <ReservationCard {...reservation} />
            <div className="division" />
            <div className="deposit-info">
                <h3>입금 정보</h3>
                <div className="deposit-price">
                    <p>결제 금액</p>
                    <p>{reservation.paymentAmount}원</p>
                </div>
                <div className="deposit-method">
                    <p>결제 방식</p>
                    <p>{displayMethodText}</p>
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
                <p className={`reservation-cancel ${reservation.status}`} onClick={() => setIsModalOpen(true)}>예약 취소</p>
                {isModalOpen && (
                    <Modal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onConfirm={handleCancelReservation}
                        children="정말 예약을 취소할까요?"
                        confirmVariant="negative"
                    />
                )}
                {reservation.type === "OFFLINE" && (
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