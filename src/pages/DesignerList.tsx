import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DesignerCard } from '../components/DesignerCard/DesignerCard';
import { ConsultingTypeButton } from '../components/ConsultingTypeButton/ConsultingTypeButton';
import { SortingButton } from '../components/SortingButton/SortingButton';
import '../styles/DesignerList.styles.css';
import ToolTip from "../components/ToolTip/ToolTip";
import question from "../assets/question.svg";
import { getUserIdFromToken } from '../utils/auth';
import { apiRequest } from '../utils/api';
import { ReservationState } from '../types/Reservation';

interface Designer {
  id: string;
  name: string;
  profile: string;
  area: string;
  expert_field: string;
  introduce: string;
  portfolio: string;
  type: string;
  offlinePrice: number;
  onlinePrice: number;
  distance?: number;
  latitude?: number;
  longitude?: number;
}

// const dummyDesigners = [
//   {
//     id: 1,
//     name: '이초 디자이너',
//     price: 20000,
//     image: '/api/placeholder/400/400',
//     specialty: '펌 전문',
//     latitude: 37.5035,
//     longitude: 126.9550,
//     distance: 0,
//   },
//   {
//     id: 2,
//     name: '로로 원장',
//     price: 34000,
//     image: '/api/placeholder/400/400',
//     specialty: '탈/염색 전문',
//     latitude: 36.3504,
//     longitude: 87.3249328,
//     distance: 0,
//   },
//   {
//     id: 3,
//     name: '수 대표원장',
//     price: 20000,
//     image: '/api/placeholder/400/400',
//     specialty: '탈/염색 전문',
//     latitude: 37.3405,
//     longitude: 127.3845,
//     distance: 0,
//   },
//   {
//     id: 4,
//     name: '랑 원장',
//     price: 34000,
//     image: '/api/placeholder/400/400',
//     specialty: '탈/염색 전문',
//     latitude: 37.2735,
//     longitude: 127.6345,
//     distance: 0,
//   },
//   {
//     id: 5,
//     name: '수 대표원장',
//     price: 20000,
//     image: '/api/placeholder/400/400',
//     specialty: '탈/염색 전문',
//     latitude: 37.3405,
//     longitude: 127.3845,
//     distance: 0,
//   },
//   {
//     id: 6,
//     name: '랑 원장',
//     price: 34000,
//     image: '/api/placeholder/400/400',
//     specialty: '탈/염색 전문',
//     latitude: 37.2735,
//     longitude: 127.6345,
//     distance: 0,
//   },
//   {
//     id: 7,
//     name: '수 대표원장',
//     price: 20000,
//     image: '/api/placeholder/400/400',
//     specialty: '탈/염색 전문',
//     latitude: 37.3405,
//     longitude: 127.3845,
//     distance: 0,
//   },
//   {
//     id: 8,
//     name: '랑 원장',
//     price: 34000,
//     image: '/api/placeholder/400/400',
//     specialty: '탈/염색 전문',
//     latitude: 37.2735,
//     longitude: 127.6345,
//     distance: 0,
//   }
// ];

// const dummyDesigners: Designer[] = []; // 빈 배열에도 타입 명시

const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;  // 거리 (km)
};

export default function DesignerList() {
  const [consultingType, setConsultingType] = useState('');
  const [sortBy, setSortBy] = useState('distance');
  const [designers, setDesigners] = useState<Designer[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasUpComingReservation, setHasUpComingReservation] = useState(false);
  const [viewMode, setViewMode] = useState<'simple' | 'detailed'>('simple');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const userId = getUserIdFromToken();

  useEffect(() => {
    const fetchDesigners = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const endpoint = consultingType === 'online' 
          ? '/api/designer/online'
          : '/api/designer/offline';
          
        const response = await apiRequest(endpoint, {
          method: 'GET',
          params: {
            sortOrder: 'ASC'
          }
        });

        setDesigners(response);
      } catch (err) {
        setError('디자이너 목록을 불러오는데 실패했습니다.');
        console.error('Error fetching designers:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDesigners();
  }, [consultingType]);

  useEffect(() => {
    if (!userId) return;

    apiRequest(`api/consulting/user/${userId}`)
      .then((reservations) => {
        const now = new Date();
        const hasUpComing = reservations.some((reservation: ReservationState) => {
          const reservationTime = new Date(reservation.time);
          const diffHours = (reservationTime.getTime() - now.getTime()) / (1000 * 60 * 60);
          return diffHours > 0 && diffHours <= 24;
        });

        setHasUpComingReservation(hasUpComing);
        if (hasUpComing) {
          setShowTooltip(true);
          const timeout = setTimeout(() => setShowTooltip(false), 3000);
          return () => clearTimeout(timeout);
        }
      })
      .catch((error) => {
        console.error("예약 정보를 불러오는데 실패했습니다.", error);
      });
  }, [userId]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        console.error('위치 정보를 가져올 수 없습니다.', error);
      }
    );
  }, []);

  useEffect(() => {
    let sortedDesigners = [...designers];

    if (userLocation) {
      sortedDesigners = sortedDesigners.map((designer) => ({
        ...designer,
        distance: designer.latitude && designer.longitude
          ? haversineDistance(userLocation.lat, userLocation.lon, designer.latitude, designer.longitude)
          : Infinity
      }));
    }

    switch (sortBy) {
      case 'price_asc':
        sortedDesigners.sort((a, b) => 
          (consultingType === 'online' ? a.onlinePrice - b.onlinePrice : a.offlinePrice - b.offlinePrice)
        );
        break;
      case 'price_desc':
        sortedDesigners.sort((a, b) => 
          (consultingType === 'online' ? b.onlinePrice - a.onlinePrice : b.offlinePrice - a.offlinePrice)
        );
        break;
      case 'distance':
        sortedDesigners.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
        break;
      default:
        break;
    }

    setDesigners(sortedDesigners);
  }, [sortBy, userLocation, designers, consultingType]);

  const handleRetry = () => {
    window.location.reload();
  };

  if (isLoading) {
    return <div className="loading-state">로딩 중...</div>;
  }

  if (error) {
    return (
      <div className="error-state">
        <p>{error}</p>
        <button onClick={handleRetry} className="retry-button">
          다시 시도하기
        </button>
      </div>
    );
  }

  return (
    <div className="designer-list-container">
      <header className="designer-list-header">
        <div className="header-content">
          <img src="/icons/header-logo.svg" alt="header-logo" />
          <button className="calendar-button" onClick={() => navigate(`/myreservation/${userId}`)}>
            {hasUpComingReservation && <div className="red-dot" />}
            <img src="/icons/home-calendar.svg" alt="home-calendar" />
            {showTooltip && hasUpComingReservation && (
              <div className="upComing-tooltip">
                임박한 예약이 있어요!
              </div>
            )}
            <span className="sr-only">내 예약</span>
          </button>
        </div>
      </header>

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
            <div className="right-filters">
              <button 
                className="view-mode-button"
                onClick={() => setViewMode(viewMode === 'simple' ? 'detailed' : 'simple')}
              >
                <img 
                  src={viewMode === 'simple' ? "/icons/detail.svg" : "/icons/simple.svg"} 
                  alt={viewMode === 'simple' ? "상세히 보기 아이콘" : "간단히 보기 아이콘"}
                />
                {viewMode === 'simple' ? '상세히' : '간단히'}
              </button>
              <SortingButton value={sortBy} onChange={setSortBy} />
            </div>
          </div>

          <div className={`designers-grid ${viewMode === 'detailed' ? 'designers-grid-detailed' : ''}`}>
            {designers.map((item) => (
              <DesignerCard
                key={item.id}
                onClick={() => navigate(`/designerdetail/${item.id}`)}
                name={item.name}
                price={consultingType === 'online' ? item.onlinePrice : item.offlinePrice}
                image={item.profile}
                specialty={item.expert_field}
                distance={item.distance}
                viewMode={viewMode}
              />
            ))}
          </div>
        </main>
      )}
    </div>
  );
}