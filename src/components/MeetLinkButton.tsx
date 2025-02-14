import React from "react";
import Button from "./Button/Button";

interface MeetLinkButtonProps {
    children: React.ReactNode;
    meetLink?: string;
}

const MeetLinkButton: React.FC<MeetLinkButtonProps> = ({ children, meetLink }) => {
    const handleClick = () => {
        if (meetLink) {
            window.open(meetLink, "_blank");  // 새 창에서 미트 링크 열기
        } else {
            console.error("유효한 링크가 없습니다.");
        }
    };

    return (
        <Button
            variant="primary"
            children={children}
            onClick={handleClick}
            disabled={!meetLink}
        />
    );
};

export default MeetLinkButton;