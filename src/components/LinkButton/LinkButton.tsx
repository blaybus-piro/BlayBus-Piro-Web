import React, { useState } from "react";
import linkIcon from "../../assets/link.svg";
import "./LinkButton.styles.css";
import Toast from "../Toast/Toast";

interface LinkButtonProps {
    link: string;
    status: "SCHEDULED" | "COMPLETE";
}

const LinkButton: React.FC<LinkButtonProps> = ({ link, status }) => {
    const [isToastVisible, setIsToastVisible] = useState(false);

    const handleCopy = () => {
        if (status === "COMPLETE") return;

        navigator.clipboard.writeText(link)
            .then(() => {
                setIsToastVisible(true);
                setTimeout(() => setIsToastVisible(false), 2000);
            })
            .catch((err) => console.error("복사 실패:", err));
    };

    return (
        <>
            <div
                className={`link ${status}`}
                onClick={handleCopy}
                style={{ cursor: status === "COMPLETE" ? "not-allowed" : "pointer" }}
            >
                <img src={linkIcon} alt="link" />
            </div>

            <Toast message="링크가 복사되었습니다!" isVisible={isToastVisible} onClose={() => setIsToastVisible(false)} />
        </>
    );
};

export default LinkButton;
