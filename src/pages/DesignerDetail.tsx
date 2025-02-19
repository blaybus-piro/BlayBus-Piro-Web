import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import Portfolio from "../components/Portfolio/Portfolio";
import DesignerInfo from "../components/DesignerInfo/DesignerInfo";
import question from "../assets/question.svg";
import Button from "../components/Button/Button";
import ToolTip from "../components/ToolTip/ToolTip";
import "../styles/DesignerDetail.styles.css";
import { useDesignerDetail } from "../hooks/useDesignerDetail";


const DesignerDetail: React.FC = () => {
    const { designerId } = useParams<{ designerId: string }>();
    const navigate = useNavigate();
    const { designer, loading, error } = useDesignerDetail(designerId);

    const handleConsultingClick = (method: "ONLINE" | "OFFLINE", price: number) => {
        navigate(`/reservation?method=${method}&designerId=${designerId}&price=${price}`);
    };

    if (loading) return <p>로딩 중...</p>;
    if (error) return <p>{error}</p>
    if (!designer) return <p>디자이너 정보를 불러올 수 없습니다.</p>;

    const isRemoteDisabled = designer.type === "OFFLINE";
    const isInpersonDisabled = designer.type === "ONLINE";

    return (
        <div className="designerDetail-container">
            <Header title={designer.name} />
            <Portfolio images={designer.portfolioImages} />
            <DesignerInfo
                name={designer.name}
                address={designer.address}
                specialty={designer.specialty}
                profileImage={designer.profileImage}
            />
            <div className="description">
                <h4>소개글</h4>
                <p>{designer.description}</p>
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
                        <span>{designer.remotePrice.toLocaleString()}원</span>
                    </p>
                    <p className={`price ${!isInpersonDisabled ? "" : "disabled"}`}>
                        <span>대면 컨설팅</span>
                        <div />
                        <span>{designer.inPersonPrice.toLocaleString()}원</span>
                    </p>
                </div>
            </div>

            <footer className={`consulting-buttons ${isInpersonDisabled ? "reverse" : ""}`}>
                <Button
                    variant="secondary"
                    size="large"
                    children="비대면 컨설팅"
                    disabled={isRemoteDisabled}
                    onClick={() => handleConsultingClick("ONLINE", designer.remotePrice)}
                />
                <Button
                    variant="primary"
                    size="large"
                    children="대면 컨설팅"
                    disabled={isInpersonDisabled}
                    onClick={() => handleConsultingClick("OFFLINE", designer.inPersonPrice)}
                />
            </footer>
        </div >
    );
};

export default DesignerDetail;