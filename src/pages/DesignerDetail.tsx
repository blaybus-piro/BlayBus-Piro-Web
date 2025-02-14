import React from "react";
import Header from "../components/Header/Header";
import Portfolio from "../components/Portfolio/Portfolio";
import DesignerInfo from "../components/DesignerInfo/DesignerInfo";
import question from "../assets/question.svg";
import Button from "../components/Button/Button";
import ToolTip from "../components/ToolTip/ToolTip";
import "../styles/DesignerDetail.styles.css";

const DesignerDetail: React.FC = () => {
    const designerData = {
        name: "이초 디자이너",
        address: "서울 강남구 압구정 79길",
        specialty: "펌 전문",
        profileImage: "/src/assets/image1.png",
        portfolioImages: [
            "/src/assets/image1.png",
            "/src/assets/image2.png",
            "/src/assets/image3.png",
            "/src/assets/image4.png"
        ],
        description: "레드립, ITZY가 자주 방문하는 스타일",
        remotePrice: 20000,
        inPersonPrice: 40000
    };

    const isRemoteDisabled = !designerData.remotePrice;
    const isInpersonDisabled = !designerData.inPersonPrice;

    return (
        <div className="designerDetail-container">
            <Header title={designerData.name} />
            <Portfolio images={designerData.portfolioImages} />
            <DesignerInfo
                name={designerData.name}
                address={designerData.address}
                specialty={designerData.specialty}
                profileImage={designerData.profileImage}
            />
            <div className="description">
                <h4>소개글</h4>
                <p>{designerData.description}</p>
            </div>
            <div className="consulting-price">
                <div className="price-top">
                    <h4>컨설팅 금액</h4>
                    <ToolTip text={"비대면 컨설팅은 구글 미트에서 진행해요!<br/>진행 후에 요약된 컨설팅 리포트를 드릴게요."}>
                        <img src={question} alt="question" />
                    </ToolTip>
                </div>
                <div className="price-bottom">
                    <p className={`price ${!isRemoteDisabled ? "" : "disabled"}`}>
                        <span>비대면 컨설팅</span>
                        <div />
                        <span>{!isRemoteDisabled ? `${designerData.remotePrice.toLocaleString()}원` : "20,000원"}</span>
                    </p>
                    <p className={`price ${!isInpersonDisabled ? "" : "disabled"}`}>
                        <span>대면 컨설팅</span>
                        <div />
                        <span>{!isInpersonDisabled ? `${designerData.inPersonPrice.toLocaleString()}원` : "40,000원"}</span>
                    </p>
                </div>
            </div>
            <div className={`consulting-buttons ${isInpersonDisabled ? "reverse" : ""}`}>
                <Button
                    variant="secondary"
                    size="large"
                    children="비대면 컨설팅"
                    disabled={isRemoteDisabled}
                />
                <Button
                    variant="primary"
                    size="large"
                    children="대면 컨설팅"
                    disabled={isInpersonDisabled}
                />
            </div>
        </div >
    );
};

export default DesignerDetail;