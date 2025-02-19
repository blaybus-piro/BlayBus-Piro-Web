import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import ReservationCard from "../components/ReservationCard/ReservationCard";
import MeetLinkButton from "../components/MeetLinkButton";
import EnhancedMeetLinkButton from "../components/EnhancedMeetLinkButton";
import Modal from "../components/Modal/Modal";
import { cancelReservation } from "../api/cancelReservatin";
import { apiRequest } from "../utils/api";
import { ReservationState } from "../types/Reservation";
import { getUserIdFromToken } from '../utils/auth';
import "../styles/MyReservationDetail.styles.css";

const MyReservationDetail: React.FC = () => {
    const { myreservationId } = useParams();
    const userId = getUserIdFromToken();

    const [myReservationDetail, setMyReservationDetail] = useState<ReservationState | null>(null);
    const [userInfo, setUserInfo] = useState<{ name: string; email: string } | null>(null);

    const isMountedRef = useRef(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const [useDynamicMeetLink, setUseDynamicMeetLink] = useState(false);

    useEffect(() => {
        const fetchReservationDetail = async () => {
            if (!myreservationId) {
                console.log("myreservationId 존재하지 않음");
                return;
            }

            try {
                console.log("api 호출 시작");
                console.log("예약 상세 조회 API 호출: ", `/api/consulting/${myreservationId}`);
                const reservationData = await apiRequest(`/api/consulting/${myreservationId}`);

                console.log(reservationData);

                const formattedData = {
                    id: reservationData.consultingId,
                    designerId: reservationData.designerId,
                    designerName: reservationData.designerName,
                    profileImage: reservationData.designerProfile,
                    time: reservationData.startTime,
                    type: reservationData.type,
                    status: reservationData.status,
                    meetLink: reservationData.meetLink || null,
                    paymentAmount: reservationData.paymentAmount || 0,
                    paymentMethod: reservationData.pay,
                };

                console.log("포맷팅 후: ", formattedData);

                if (isMountedRef.current) {
                    setMyReservationDetail(formattedData);

                    if (userId) {
                        const userData = await apiRequest(`/api/users/${userId}`);

                        setUserInfo({
                            name: userData.name,
                            email: userData.mail,
                        });
                    }
                    // 기존에 미팅 링크가 없고 OFFLINE 타입이면 동적 링크 생성 활성화
                    if (formattedData.type === "OFFLINE" && !formattedData.meetLink) {
                        setUseDynamicMeetLink(true);
                    }
                }
            } catch (error) {
                console.error("예약 상세 조회를 실패했습니다.", error);
            }
        };

        fetchReservationDetail();

        return () => {
            isMountedRef.current = false;
        };
    }, [myreservationId]);


    if (!myReservationDetail) return <p>예약 정보를 찾을 수 없습니다.</p>


    const displayMethodText =
        myReservationDetail.paymentMethod === "ACCOUNTMENT" ? "계좌 이체"
            : "카카오 페이";

    const handleCancelReservation = async () => {
        try {
            await cancelReservation(myReservationDetail.id);
            setIsModalOpen(false);

            navigate(`/myreservation`, { state: { showToast: true } });
            console.log("홈 페이지로 이동");
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
                    <p>{userInfo?.name}</p>
                </div>
                <div className="reservation-person-email">
                    <p>이메일</p>
                    <p>{userInfo?.email}</p>
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
                    useDynamicMeetLink ? (
                        // 동적으로 미팅 링크를 생성할 수 있는 버튼
                        <EnhancedMeetLinkButton
                            children="구글 미트 링크"
                            meetLink={myReservationDetail.meetLink}
                            reservationTime={myReservationDetail.time}
                            designerName={myReservationDetail.designerName}
                        />
                    ) : (
                        // 기존 미팅 링크가 있는 경우 일반 버튼 사용
                        <MeetLinkButton
                            children="구글 미트 링크"
                            meetLink={myReservationDetail.meetLink}
                        />
                    )
                )}
            </footer>
        </div>
    );
};

export default MyReservationDetail;