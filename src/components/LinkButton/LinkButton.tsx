import React from 'react';
import linkIcon from "../../assets/link.svg";
import "./LinkButton.styles.css";

interface LinkButtonProps {
    link: string;
    status: "active" | "completed";
}

const LinkButton: React.FC<LinkButtonProps> = ({ link, status }) => {
    const handleCopy = () => {
        if (status === "completed") return;

        navigator.clipboard.writeText(link).catch((err) => console.error("복사 실패:", err));
    };

    return (
        <div
            className={`link ${status}`} onClick={handleCopy}
            style={{ cursor: status === "completed" ? "not-allowed" : "pointer" }}
        >
            <img src={linkIcon} alt="link" />
        </div>
    );
};

export default LinkButton;