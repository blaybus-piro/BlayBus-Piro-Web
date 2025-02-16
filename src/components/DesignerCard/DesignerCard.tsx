import './DesignerCard.styles.css';
import ellipse from "../../assets/ellipse.svg";

interface DesignerCardProps {
  name: string;
  price: number;
  image: string;
  specialty: string;
  distance?: number;
}

export const DesignerCard: React.FC<DesignerCardProps> = ({
  name,
  price,
  image,
  specialty,
  distance
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

  return (
    <div className="designer-card">
      <div className="designer-card-image">
        <img src={image} alt={name} />
        <div className="specialty-badge">{specialty}</div>
      </div>
      <div className="designer-card-info">
        <div className="designer-card-profile">
          <img src="/icons/profile.svg" alt="profile" className="profile-card-image" />
          <span className="designer-card-name">{name}</span>
        </div>
        <div className="price-and-distance">
          <div className="price">
            {price.toLocaleString()}원~
          </div>
          <img src={ellipse} alt="ellipse" />
          <div className="distance">
            {formatDistance(distance ?? 0)}
          </div>
        </div>
      </div>
    </div>
  );
};