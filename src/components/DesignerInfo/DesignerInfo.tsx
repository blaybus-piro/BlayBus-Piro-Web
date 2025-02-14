import React from 'react';
import "./DesignerInfo.styles.css";

interface DesignerInfo {
    name: string;
    address: string;
    specialty: string;
    profileImage: string;
}

const DesignerDetail: React.FC<DesignerInfo> = ({
    name,
    address,
    specialty,
    profileImage,
}) => {
    return (
        <div className="designer-info">
            <img className="profile" src={profileImage} alt={name} />
            <div className="info-right">
                <div className="info">
                    <h3>{name}</h3>
                    <p className="specialty">{specialty}</p>
                </div>
                <p className="address">{address}</p>
            </div>
        </div>
    );
};

export default DesignerDetail;