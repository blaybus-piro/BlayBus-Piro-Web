import { ReservationState } from "../types/Reservation";
import Header from "../components/Header/Header";
import ReservationCard from '../components/ReservationCard/ReservationCard';
import "../styles/MyReservation.styles.css";

const MyReservation: React.FC = () => {
    const [myReservations, setMyReservations] = useState<ReservationState[]>([]);
    const [scheduledTab, setScheduledTab] = useState<"scheduled" | "completed">("scheduled");

    const parseDate = (timeString: string) => {
        const regex = /(\d{4})년 (\d{1,2})월 (\d{1,2})일.*?(\d{1,2}):(\d{2})/;
        const match = timeString.match(regex);
        if (!match) return new Date(0); // 변환 실패 시 기본값 반환

        const [, year, month, day, hour, minute] = match.map(Number);
        return new Date(year, month - 1, day, hour, minute); // JavaScript Date 객체 생성
    };

    const filteredReservations = myReservations.filter((res) => {
        if (scheduledTab === "scheduled") return res.status === "FREE" || res.status === "SCHEDULED";
        return res.status === "CANCELED" || res.status === "COMPLETED";
    });

    const sortedMyReservations = [...filteredReservations].sort((a, b) => {
        return parseDate(b.time).getTime() - parseDate(a.time).getTime();
    });

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
                {sortedMyReservations.map((res) => (
                    <ReservationCard
                        key={res.id}
                        {...res}
                    />
                ))}
            </div>
        </div>
    );
};

export default MyReservation;