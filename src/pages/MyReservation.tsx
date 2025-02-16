import React from 'react';
import { useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();
    const reservations: Reservation[] = [];
    // const reservations = [
    //     {
    //         id: 1,
    //         profileImage: "/src/assets/image1.png",
    //         name: "이초 디자이너",
    //         time: "2025년 2월 7일 (토) 18:30",
    //         type: "비대면" as const,
    //         status: "active" as const,
    //         meetLink: "/",
    //     },
    //     {
    //         id: 2,
    //         name: "이초 디자이너",
    //         profileImage: "/src/assets/image2.png",
    //         time: "2025년 2월 8일 (일) 18:30",
    //         type: "대면" as const,
    //         status: "active" as const,
    //     },
    //     {
    //         id: 3,
    //         name: "이초 디자이너",
    //         profileImage: "/src/assets/image3.png",
    //         time: "2025년 2월 8일 (일) 20:30",
    //         type: "대면" as const,
    //         status: "canceled" as const,
    //     },
    //     {
    //         id: 4,
    //         name: "이초 디자이너",
    //         profileImage: "/src/assets/image2.png",
    //         time: "2025년 2월 3일 (토) 10:30",
    //         type: "비대면" as const,
    //         status: "completed" as const,
    //         meetLink: "/",
    //     },
    // ];

    const parseDate = (timeString: string) => {
        const regex = /(\d{4})년 (\d{1,2})월 (\d{1,2})일.*?(\d{1,2}):(\d{2})/;
        const match = timeString.match(regex);
        if (!match) return new Date(0);

        const [, year, month, day, hour, minute] = match.map(Number);
        return new Date(year, month - 1, day, hour, minute);
    };

    const sortedReservations = [...reservations].sort((a, b) => {
        return parseDate(b.time).getTime() - parseDate(a.time).getTime();
    });

    const handleSearchDesigners = () => {
        navigate('/designerlist');
    };

    return (
        <div className="my-reservation-container">
            <Header title="내 예약" />
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
    );
};

export default MyReservation;