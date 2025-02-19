import React from 'react';
import { useNavigate } from "react-router-dom";
import { ReservationState } from "../../types/Reservation";
import component from "../../assets/component.svg";
import calendar from "../../assets/calendar.svg";
import Button from "../Button/Button";
import LinkButton from "../LinkButton/LinkButton";
import MeetLinkButton from "../MeetLinkButton";
import "./ReservationCard.styles.css";

interface ReservationCardProps {
    reservation: ReservationState;
}

const ReservationCard: React.FC<ReservationCardProps> = ({ reservation }) => {
    const navigate = useNavigate();

    const displayTypeText =
        reservation.type === "OFFLINE" ? "오프라인"
            : "온라인";

    const displayStatusText =
        reservation.status === "FREE" ? "입금 확인 중"
            : reservation.status === "SCHEDULED" ? `${displayTypeText} 컨설팅`
                : reservation.status === "CANCELED" ? "취소된 예약"
                    : "상담 완료";

    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "short",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false // 24시간 형식 사용
        });
    };

    return (
        <div className={`reservation-card ${reservation.status}`} key={reservation.id}>
            <div className="reservation-card-header">
                <img className="profile-image" src={reservation.profileImage} alt={reservation.designerName} />
                <div className={`reservation-info ${reservation.status}`}>
                    <h3>{reservation.designerName}</h3>
                    <div className="my-reservation-date">
                        <img src={calendar} alt="calendar" />
                        <p>{formatDate(reservation.time)}</p>
                    </div>
                    <span className={`tag ${reservation.status}`}>{displayStatusText}</span>
                </div>
                <img
                    className={`more ${reservation.status}`}
                    src={component}
                    alt="component"
                    onClick={() => {
                        if (reservation.status !== "CANCELED") {
                            navigate(`/myreservationdetail/${reservation.id}`, {
                                state: reservation,
                            });
                        }
                    }}
                    style={{ cursor: "pointer" }}
                />
            </div>

            {
                reservation.status === "SCHEDULED" && reservation.type === "OFFLINE" && (
                    <div className="reservation-card-bottom1">
                        <LinkButton
                            link={reservation.meetLink ?? ""}
                            status={reservation.status}
                        />
                        <MeetLinkButton
                            children="구글 미트 링크 바로가기"
                            meetLink={reservation.meetLink ?? ""}
                        />
                    </div>
                )
            }

            {
                reservation.status === "COMPLETE" && reservation.type === "OFFLINE" && (
                    <div className="reservation-card-bottom1">
                        <LinkButton
                            link={reservation.meetLink ?? ""}
                            status={reservation.status}
                        />
                        <MeetLinkButton
                            children="구글 미트 링크 바로가기"
                        />
                    </div>
                )
            }

            <div className="reservation-card-bottom2">
                <Button
                    variant="secondary"
                    children="디자이너 정보 더보기"
                    onClick={() => {
                        navigate(`/designerdetail/${reservation.designerId}`);
                    }}
                />
            </div>
        </div >
    );
};

export default ReservationCard;