import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import ReservationCard from "../components/ReservationCard/ReservationCard";
import MeetLinkButton from "../components/MeetLinkButton";
import Modal from "../components/Modal/Modal";
import { cancelReservation } from "../api/cancelReservatin";
import { apiRequest } from "../utils/api";
import { ReservationState } from "../types/Reservation";
import "../styles/MyReservationDetail.styles.css";

const MyReservationDetail: React.FC = () => {
    const { reservationId } = useParams();
    const [myReservationDetail, setMyReservationDetail] = useState<ReservationState | null>(null);
    const isMountedRef = useRef(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReservationDetail = async () => {
            if (!reservationId) return;

            try {
                const reservationData = await apiRequest(`/api/consulting/${reservationId}`);

                console.log(reservationData);

                const designerInfo = await apiRequest(`/api/designer/${reservationData.designerId}`);

                console.log(designerInfo);

                const formattedData = {
                    id: reservationData.id,
                    designerId: reservationData.designer.id,
                    designerName: reservationData.designer.name,
                    profileImage: designerInfo.profileImage,
                    time: reservationData.time,
                    type: reservationData.type,
                    status: reservationData.status,
                    meetLink: reservationData.meeting?.meetUrl || null,
                    paymentAmount: reservationData.paymentAmount,
                    paymentMethod: reservationData.paymentMethod,
                };

                console.log("포맷팅 후: ", formattedData);

                if (isMountedRef.current) {
                    setMyReservationDetail(formattedData);

                    console.log("셋후: ", myReservationDetail);
                }
            } catch (error) {
                console.error("예약 상세 조회를 실패했습니다.", error);
            }
        };

        fetchReservationDetail();

        return () => {
            isMountedRef.current = false;
        };
    }, [reservationId]);


    if (!myReservationDetail) return <p>예약 정보를 찾을 수 없습니다.</p>


    const displayMethodText =
        myReservationDetail.paymentMethod === "ACCOUNTMENT" ? "계좌 이체"
            : "카카오 페이";

    const handleCancelReservation = async () => {
        try {
            await cancelReservation(myReservationDetail.id);
            setIsModalOpen(false);

            navigate(`/myreservation`, { state: { showToast: true } });
        } catch (error) {
            console.error("예약 취소 실패", error);
        }
    }

    return (
        <div className="my-reservation-detail-container">
            <Header title="내 예약 상세" />
            <ReservationCard reservation={myReservationDetail} />
            <div className="division" />
            <div className="deposit-info">
                <h3>입금 정보</h3>
                <div className="deposit-price">
                    <p>결제 금액</p>
                    <p>{myReservationDetail.paymentAmount}원</p>
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
                <p className={`reservation-cancel ${myReservationDetail.status}`} onClick={() => setIsModalOpen(true)}>예약 취소</p>
                {isModalOpen && (
                    <Modal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onConfirm={handleCancelReservation}
                        children="정말 예약을 취소할까요?"
                        confirmVariant="negative"
                    />
                )}
                {myReservationDetail.type === "OFFLINE" && (
                    <MeetLinkButton
                        children="구글 미트 링크"
                        meetLink={myReservationDetail.meetLink}
                    />
                )}
            </footer>
        </div>
    );
};

export default MyReservationDetail;