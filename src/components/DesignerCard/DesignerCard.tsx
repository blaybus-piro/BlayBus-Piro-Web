import './DesignerCard.styles.css';

interface DesignerCardProps {
  name: string;
  price: number;
  image: string;
  specialty: string;
}

export const DesignerCard: React.FC<DesignerCardProps> = ({ 
  name, 
  price, 
  image, 
  specialty 
}) => {
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
        <div className="price">
          {price.toLocaleString()}원~
        </div>
      </div>
    </div>
  );
};