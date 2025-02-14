import { useState, useEffect } from 'react';
import { DesignerCard } from '../components/DesignerCard/DesignerCard';
import { ConsultingTypeButton } from '../components/ConsultingTypeButton/ConsultingTypeButton';
import { SortingButton } from '../components/SortingButton/SortingButton';
import '../styles/DesignerList.styles.css';
import ToolTip from "../components/ToolTip/ToolTip";
import question from "../assets/question.svg";

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

export default function DesignerList() {
    const [consultingType, setConsultingType] = useState('');
    const [sortBy, setSortBy] = useState('distance');
    const [designers, setDesigners] = useState(dummyDesigners);
  
    useEffect(() => {
        let filtered = [...dummyDesigners];
      
        if (consultingType) {
          filtered = filtered.filter(item => {
            // 실제로 item을 사용하는 필터링 로직
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
            // 거리순은 기본 데이터 순서 유지
            break;
        }
      
        setDesigners(filtered);
      }, [consultingType, sortBy]);
  
    return (
      <div className="designer-list-container">
        <header className="designer-list-header">
          <div className="header-content">
            <img src="/icons/header-logo.svg" alt="header-logo" />
            <button className="calendar-button">
              <img src="/icons/home-calendar.svg" alt="home-calendar" />
              <span className="sr-only">내 예약</span>
            </button>
          </div>
        </header>
  
        <main className="designerlist-content">
          <div className="filter-section">
            <div className="consulting-dropdown">
              <ConsultingTypeButton
                value={consultingType}
                onChange={setConsultingType}
              />
              <ToolTip text={"비대면 컨설팅은 구글 미트에서 진행해요!<br/>진행 후에 요약된 컨설팅 리포트를 드릴게요."}>
                <img src={question} alt="question" />
              </ToolTip>
            </div>
            <SortingButton
              value={sortBy}
              onChange={setSortBy}
            />
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
      </div>
    );
  }