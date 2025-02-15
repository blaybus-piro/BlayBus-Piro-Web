import React from 'react';
import Header from "../components/Header/Header";
import ReservationCard from '../components/ReservationCard/ReservationCard';
import "../styles/MyReservation.styles.css";

const MyReservation: React.FC = () => {
    const reservations = [
        {
            id: 1,
            profileImage: "/src/assets/image1.png",
            name: "이초 디자이너",
            time: "2025년 2월 7일 (토) 18:30",
            type: "비대면" as const,
            status: "active" as const,
            meetLink: "/",
        },
        {
            id: 2,
            name: "이초 디자이너",
            profileImage: "/src/assets/image2.png",
            time: "2025년 2월 8일 (일) 18:30",
            type: "대면" as const,
            status: "active" as const,
        },
        {
            id: 3,
            name: "이초 디자이너",
            profileImage: "/src/assets/image3.png",
            time: "2025년 2월 8일 (일) 20:30",
            type: "대면" as const,
            status: "canceled" as const,
        },
        {
            id: 4,
            name: "이초 디자이너",
            profileImage: "/src/assets/image2.png",
            time: "2025년 2월 3일 (토) 10:30",
            type: "비대면" as const,
            status: "completed" as const,
            meetLink: "/",
        },
        {
            id: 5,
            name: "이초 디자이너",
            profileImage: "/src/assets/image2.png",
            time: "2025년 2월 3일 (토) 10:30",
            type: "비대면" as const,
            status: "completed" as const,
            meetLink: "/",
        }
    ];

    const parseDate = (timeString: string) => {
        const regex = /(\d{4})년 (\d{1,2})월 (\d{1,2})일.*?(\d{1,2}):(\d{2})/;
        const match = timeString.match(regex);
        if (!match) return new Date(0); // 변환 실패 시 기본값 반환

        const [, year, month, day, hour, minute] = match.map(Number);
        return new Date(year, month - 1, day, hour, minute); // JavaScript Date 객체 생성
    };

    const sortedReservations = [...reservations].sort((a, b) => {
        return parseDate(b.time).getTime() - parseDate(a.time).getTime();
    });

    return (
        <div className="my-reservation-container">
            <Header title="내 예약" />
            <div className="my-reservation-list">
                {sortedReservations.map((res) => (
                    <ReservationCard key={res.id} {...res} />
                ))}
            </div>
        </div>
    );
};

export default MyReservation;