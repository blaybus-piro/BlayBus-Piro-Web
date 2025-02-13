import { useNavigate } from 'react-router-dom';
import './Header.styles.css';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

export default function Header({ 
  title, 
  showBackButton = true,
  onBackClick
}: HeaderProps) {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="page-header">
      {showBackButton && (
        <button className="back-button" onClick={handleBackClick}>
          <img src="/icons/backarrow.svg" alt="back" />
        </button>
      )}
      <h1 className="header-title">{title}</h1>
    </header>
  );
}