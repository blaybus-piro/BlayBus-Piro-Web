import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DesignerCard } from '../components/DesignerCard/DesignerCard';
import { ConsultingTypeButton } from '../components/ConsultingTypeButton/ConsultingTypeButton';
import { SortingButton } from '../components/SortingButton/SortingButton';
import '../styles/DesignerList.styles.css';
import ToolTip from "../components/ToolTip/ToolTip";
import question from "../assets/question.svg";

interface Designer {
  id: number;
  name: string;
  price: number;
  image: string;
  specialty: string;
}

const dummyDesigners = [
  {
    id: 1,
    name: '이초 디자이너',
    price: 20000,
    image: '/api/placeholder/400/400',
    specialty: '펌 전문'
  },
  {
    id: 2,
    name: '로로 원장',
    price: 34000,
    image: '/api/placeholder/400/400',
    specialty: '탈/염색 전문'
  },
  {
    id: 3,
    name: '수 대표원장',
    price: 20000,
    image: '/api/placeholder/400/400',
    specialty: '탈/염색 전문'
  },
  {
    id: 4,
    name: '랑 원장',
    price: 34000,
    image: '/api/placeholder/400/400',
    specialty: '탈/염색 전문'
  }
];

// const dummyDesigners: Designer[] = []; // 빈 배열에도 타입 명시

export default function DesignerList() {
    const [consultingType, setConsultingType] = useState('');
    const [sortBy, setSortBy] = useState('distance');
    const [designers, setDesigners] = useState<Designer[]>(dummyDesigners);
    const navigate = useNavigate();
  
    useEffect(() => {
      let filtered = [...dummyDesigners];
  
      if (consultingType) {
        filtered = filtered.filter(item => {
          if (consultingType === 'offline') {
            return item.specialty.includes('펌');
          } else if (consultingType === 'online') {
            return item.specialty.includes('탈/염색');
          }
          return true;
        });
      }
  
      switch (sortBy) {
        case 'price_asc':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'distance':
        default:
          break;
      }
  
      setDesigners(filtered);
    }, [consultingType, sortBy]);
  
    const handleRetry = () => {
      window.location.reload();
    };
  
    return (
      <div className="designer-list-container">
        <header className="designer-list-header">
          <div className="header-content">
            <img src="/icons/header-logo.svg" alt="header-logo" />
            <button className="calendar-button" onClick={() => navigate('/myreservation')}>
              <img src="/icons/home-calendar.svg" alt="home-calendar" />
              <span className="sr-only">내 예약</span>
            </button>
          </div>
        </header>
  
        {/* 빈 배열일 경우 main이 아닌 다른 곳에 표시 */}
        {designers.length === 0 && (
          <div className="empty-container">
            <div className={`filter-section ${designers.length === 0 ? "empty-filter" : ""}`}>
              <div className="consulting-dropdown">
                <ConsultingTypeButton value={consultingType} onChange={setConsultingType} />
                <ToolTip text={"비대면 컨설팅은 구글 미트에서 진행해요!<br/>진행 후에 요약된 컨설팅 리포트를 드릴게요."}>
                  <img src={question} alt="question" />
                </ToolTip>
              </div>
              <SortingButton value={sortBy} onChange={setSortBy} />
            </div>
            <div className="empty-state">
              <p className="empty-state-title">검색 결과가 없어요!</p>
              <p className="empty-state-subtitle">다시 한 번 찾아볼까요?</p>
              <button onClick={handleRetry} className="retry-button">
                다시 시도하기
              </button>
            </div>
            <img src="/icons/reservation-logo.svg" alt="logo" className="designerlist-logo" />
          </div>
        )}
  
        {designers.length > 0 && (
          <main className="designerlist-content">
            <div className="filter-section">
              <div className="consulting-dropdown">
                <ConsultingTypeButton value={consultingType} onChange={setConsultingType} />
                <ToolTip text={"비대면 컨설팅은 구글 미트에서 진행해요!<br/>진행 후에 요약된 컨설팅 리포트를 드릴게요."}>
                  <img src={question} alt="question" />
                </ToolTip>
              </div>
              <SortingButton value={sortBy} onChange={setSortBy} />
            </div>
  
            <div className="designers-grid">
              {designers.map((item) => (
                <DesignerCard
                  key={item.id}
                  name={item.name}
                  price={item.price}
                  image={item.image}
                  specialty={item.specialty}
                />
              ))}
            </div>
          </main>
        )}
      </div>
    );
  }
  