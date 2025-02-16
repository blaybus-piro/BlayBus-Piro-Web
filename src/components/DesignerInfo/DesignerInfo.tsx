import React from 'react';
import "./DesignerInfo.styles.css";

interface DesignerInfo {
    name: string;
    address: string;
    specialty: "CUL" | "PERM" | "DYE" | "BLEACH";
    profileImage: string;
}

const DesignerDetail: React.FC<DesignerInfo> = ({
    name,
    address,
    specialty,
    profileImage,
}) => {
    const displaySpecialtyText =
        specialty === "CUL" ? "컬 전문"
            : specialty === "PERM" ? "펌 전문"
                : specialty === "DYE" ? "염색 전문"
                    : "탈/염색 전문";

    return (
        <div className="designer-info">
            <img className="profile" src={profileImage} alt={name} />
            <div className="info-right">
                <div className="info">
                    <h3>{name}</h3>
                    <p className="specialty">{displaySpecialtyText}</p>
                </div>
                <p className="address">{address}</p>
            </div>
        </div>
    );
};

export default DesignerDetail;