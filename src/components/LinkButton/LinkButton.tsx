import React, { useState } from "react";
import linkIcon from "../../assets/link.svg";
import "./LinkButton.styles.css";
import Toast from "../Toast/Toast"; // 새로 만든 Toast 컴포넌트 import

interface LinkButtonProps {
    link: string;
    status: "active" | "completed";
}

const LinkButton: React.FC<LinkButtonProps> = ({ link, status }) => {
    const [isToastVisible, setIsToastVisible] = useState(false);

    const handleCopy = () => {
        if (status === "completed") return;

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
                style={{ cursor: status === "completed" ? "not-allowed" : "pointer" }}
            >
                <img src={linkIcon} alt="link" />
            </div>

            {/* 토스트 메시지 */}
            <Toast message="링크가 복사되었습니다!" isVisible={isToastVisible} onClose={() => setIsToastVisible(false)} />
        </>
    );
};

export default LinkButton;
