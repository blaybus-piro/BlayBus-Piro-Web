import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMyReservations } from '../hooks/useMyReservations';
import { useFilteredReservations } from '../hooks/useFilteredReservations';
import Header from "../components/Header/Header";
import ReservationCard from '../components/ReservationCard/ReservationCard';
import Toast from "../components/Toast/Toast";
import "../styles/MyReservation.styles.css";

const MyReservation: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { myReservations, loading, error } = useMyReservations();
    const { filteredReservations, scheduledTab, setScheduledTab } = useFilteredReservations(myReservations);

    const [showToast, setShowToast] = useState(location.state?.showToast || false);

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    const handleSearchDesigners = () => {
        navigate('/designerlist');
    };

    if (loading) return <p>로딩 중...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="my-reservation-container">
            <Header title="내 예약" />
            <div className="my-reservation-tabs">
                <button
                    className={`tab ${scheduledTab === "scheduled" ? "active" : ""}`}
                    onClick={() => setScheduledTab("scheduled")}
                > 진행 예정
                </button>
                <button
                    className={`tab ${scheduledTab === "completed" ? "active" : ""}`}
                    onClick={() => setScheduledTab("completed")}
                > 완료
                </button>
            </div>
            {filteredReservations.length > 0 ? (
                <div className="my-reservation-list">
                    {filteredReservations.map((res) => (
                        <ReservationCard key={res.id} reservation={res} />
                    ))}
                </div>
            ) : (
                <div className="myreservation-empty-state">
                    <p className="empty-state-title">내 예약이 없어요!</p>
                    <p className="empty-state-subtitle">디자이너를 찾아볼까요?</p>
                    <button onClick={handleSearchDesigners} className="retry-button">
                        디자이너 검색하기
                    </button>
                    <img src="/icons/reservation-logo.svg" alt="logo" className="myreservation-logo" />
                </div>
            )}
            {showToast && <Toast message="예약이 취소되었습니다." isVisible={showToast} onClose={() => setShowToast(false)} />}
        </div>
    );
};

export default MyReservation;