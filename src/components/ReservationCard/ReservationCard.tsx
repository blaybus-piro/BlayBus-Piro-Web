import React from 'react';
import { useNavigate } from "react-router-dom";
import component from "../../assets/component.svg";
import calendar from "../../assets/calendar.svg";
import Button from "../Button/Button";
import LinkButton from "../LinkButton/LinkButton";
import MeetLinkButton from "../MeetLinkButton";
import "./ReservationCard.styles.css";

interface ReservationCardProps {
    id: number;
    profileImage: string;
    name: string;
    time: string;
    type: "대면" | "비대면";
    status: "active" | "canceled" | "completed";
    meetLink?: string;
}

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
        <div className={`reservation-card ${status}`} key={id}>
            <div className="reservation-card-header">
                <img className="profile-image" src={profileImage} alt={name} />
                <div className={`reservation-info ${status}`}>
                    <h3>{name}</h3>
                    <div className="my-reservation-date">
                        <img src={calendar} alt="calendar" />
                        <p>{time}</p>
                    </div>
                    <span className={`tag ${status}`}>{displayText}</span>
                </div>
                <img
                    className={`more ${status}`}
                    src={component}
                    alt="component"
                    onClick={() => {
                        if (status !== "canceled") {
                            navigate(`/myreservation/${id}`, {
                                state: {
                                    id,
                                    name,
                                    profileImage,
                                    time,
                                    type,
                                    status,
                                    meetLink,
                                },
                            });
                        }
                    }}
                    style={{ cursor: status === "canceled" ? "not-allowed" : "pointer" }}
                />
            </div>

            {
                status === "active" && type === "비대면" && (
                    <div className="reservation-card-bottom1">
                        <LinkButton
                            link={meetLink ?? ""}
                            status={status}
                        />
                        <MeetLinkButton
                            children="구글 미트 링크 바로가기"
                            meetLink={meetLink ?? ""}
                        />
                    </div>
                )
            }

            {
                status === "completed" && type === "비대면" && (
                    <div className="reservation-card-bottom1">
                        <LinkButton
                            link={meetLink ?? ""}
                            status={status}
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
                />
            </div>
        </div >
    );
};

export default ReservationCard;