import './DesignerCard.styles.css';
import ellipse from "../../assets/ellipse.svg";

interface DesignerCardProps {
  name: string;
  price: number;
  image: string;
  specialty: string;
  distance?: number;
  onClick?: () => void;
  viewMode: 'simple' | 'detailed';
}

export const DesignerCard: React.FC<DesignerCardProps> = ({
  name,
  price,
  image,
  specialty,
  distance,
  onClick,
  viewMode
}) => {
  const formatDistance = (distance: number): string => {
    if (distance < 1) {
      return `${Math.round(distance * 1000 / 10) * 10}m`;
    } else if (distance < 100) {
      return `${distance.toFixed(1)}km`;
    } else {
      return `100km 이상`;
    }
  }

  const displaySpecialtyText =
    specialty === "CUL" ? "컬 전문"
      : specialty === "PERM" ? "펌 전문"
        : specialty === "DYE" ? "염색 전문"
          : "탈/염색 전문";

  return (
    <div className={`designer-card ${viewMode === 'detailed' ? 'detailed-view' : ''}`} onClick={onClick}>
      {viewMode === 'simple' ? (
        <>
          <div className="designer-card-image">
            <img src={image} alt={name} />
            <div className="specialty-badge">{displaySpecialtyText}</div>
          </div>
          <div className="designer-card-info">
            <div className="designer-card-profile">
              <img src="/icons/profile.svg" alt="profile" className="profile-card-image" />
              <span className="designer-card-name">{name}</span>
            </div>
            <div className="price-and-distance">
              <div className="price">{price.toLocaleString()}원~</div>
              <img src={ellipse} alt="ellipse" />
              <div className="distance">{formatDistance(distance ?? 0)}</div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="detailed-profile-content">
            <div className="designer-card-info">
              <div className="profile-section">
                <img src="/icons/profile.svg" alt="profile" className="profile-card-image" />
                <div className="designer-card-name">{name}</div>
              </div>
              <div className="price-and-distance">
                <span className="price">{price.toLocaleString()}원~</span>
                <img src={ellipse} alt="ellipse" />
                <span className="distance">{formatDistance(distance ?? 0)}</span>
              </div>
            </div>
            <div className="specialty-badge-detailed">{displaySpecialtyText}</div>
          </div>
          <div className="designer-card-image-container">
            <div className="designer-card-image-scroll">
              <img src={image} alt={name} />
              <img src={image} alt={name} />
              <img src={image} alt={name} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
