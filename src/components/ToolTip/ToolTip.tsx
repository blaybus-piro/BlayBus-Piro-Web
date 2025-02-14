import React, { useState } from "react";
import "./ToolTip.styles.css";

interface ToolTipProps {
    text: string;
    children: React.ReactNode;
}

const ToolTip: React.FC<ToolTipProps> = ({ text, children }) => {
    const [visible, setVisible] = useState(false);

    return (
        <div
            className="tooltip-wrapper"
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
        >
            {children}
            {visible && ( // visible 상태에 따라 툴팁을 표시
                <div className="tooltip" dangerouslySetInnerHTML={{ __html: text }} />
            )}
        </div>
    );
};

export default ToolTip;