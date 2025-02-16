import React from 'react';
import { ReservationState } from "../../types/Reservation";
import component from "../../assets/component.svg";
import calendar from "../../assets/calendar.svg";
import Button from "../Button/Button";
import LinkButton from "../LinkButton/LinkButton";
import MeetLinkButton from "../MeetLinkButton";
import "./ReservationCard.styles.css";

const ReservationCard: React.FC = () => {
    const location = useLocation();
    const reservation = location.state as ReservationState;

const ReservationCard: React.FC<ReservationCardProps> = ({
    id,
    profileImage,
    name,
    time,
    type,
    status,
    meetLink
}) => {
    const displayText =
        status === "active" ? `${type} 컨설팅`
            : status === "canceled" ? "취소된 예약"
                : "완료된 예약";

    const navigate = useNavigate();

    return (
        <div className={`reservation-card ${reservation.status}`} key={reservation.id}>
            <div className="reservation-card-header">
                <img className="profile-image" src={reservation.profileImage} alt={reservation.designerName} />
                <div className={`reservation-info ${reservation.status}`}>
                    <h3>{reservation.designerName}</h3>
                    <div className="my-reservation-date">
                        <img src={calendar} alt="calendar" />
                        <p>{reservation.time}</p>
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
                reservation.status === "COMPLETED" && reservation.type === "OFFLINE" && (
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