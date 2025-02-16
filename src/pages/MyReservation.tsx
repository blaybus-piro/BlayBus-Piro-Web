import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ReservationState } from "../types/Reservation";
import Header from "../components/Header/Header";
import ReservationCard from '../components/ReservationCard/ReservationCard';
import "../styles/MyReservation.styles.css";

interface Reservation {
    id: number;
    profileImage: string;
    name: string;
    time: string;
    type: "대면" | "비대면";
    status: "active" | "canceled" | "completed";
    meetLink?: string;
}

const MyReservation: React.FC = () => {
    const [myReservations, setMyReservations] = useState<ReservationState[]>([]);
    const [scheduledTab, setScheduledTab] = useState<"scheduled" | "completed">("scheduled");

    const navigate = useNavigate();

    const parseDate = (timeString: string) => {
        const regex = /(\d{4})년 (\d{1,2})월 (\d{1,2})일.*?(\d{1,2}):(\d{2})/;
        const match = timeString.match(regex);
        if (!match) return new Date(0);

        const [, year, month, day, hour, minute] = match.map(Number);
        return new Date(year, month - 1, day, hour, minute);
    };

    const filteredReservations = myReservations.filter((res) => {
        if (scheduledTab === "scheduled") return res.status === "FREE" || res.status === "SCHEDULED";
        return res.status === "CANCELED" || res.status === "COMPLETED";
    });

    const sortedMyReservations = [...filteredReservations].sort((a, b) => {
        return parseDate(b.time).getTime() - parseDate(a.time).getTime();
    });

    const handleSearchDesigners = () => {
        navigate('/designerlist');
    };

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
            <div className="my-reservation-list">
                {sortedReservations.length > 0 ? (
                <div className="my-reservation-list">
                    {sortedReservations.map((res) => (
                        <ReservationCard key={res.id} {...res} />
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
          </div>
        </div>
    );
};

export default MyReservation;