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
  price: number;
  image: string;
  specialty: string;
  distance: number;
  type: string;
}

// const dummyDesigners = [
//   {
//     id: 1,
//     name: '이초 디자이너',
//     price: 20000,
//     image: '/api/placeholder/400/400',
//     specialty: '펌 전문',
//     distance: 0,
//   },
//   {
//     id: 2,
//     name: '로로 원장',
//     price: 34000,
//     image: '/api/placeholder/400/400',
//     specialty: '탈/염색 전문',
//     distance: 0,
//   },
//   {
//     id: 3,
//     name: '수 대표원장',
//     price: 20000,
//     image: '/api/placeholder/400/400',
//     specialty: '탈/염색 전문',
//     distance: 0,
//   },
//   {
//     id: 4,
//     name: '랑 원장',
//     price: 34000,
//     image: '/api/placeholder/400/400',
//     specialty: '탈/염색 전문',
//     distance: 0,
//   },
//   {
//     id: 5,
//     name: '수 대표원장',
//     price: 20000,
//     image: '/api/placeholder/400/400',
//     specialty: '탈/염색 전문',
//     distance: 0,
//   },
//   {
//     id: 6,
//     name: '랑 원장',
//     price: 34000,
//     image: '/api/placeholder/400/400',
//     specialty: '탈/염색 전문',
//     distance: 0,
//   },
//   {
//     id: 7,
//     name: '수 대표원장',
//     price: 20000,
//     image: '/api/placeholder/400/400',
//     specialty: '탈/염색 전문',
//     distance: 0,
//   },
//   {
//     id: 8,
//     name: '랑 원장',
//     price: 34000,
//     image: '/api/placeholder/400/400',
//     specialty: '탈/염색 전문',
//     distance: 0,
//   }
// ];

// const dummyDesigners: Designer[] = []; // 빈 배열에도 타입 명시

export default function DesignerList() {
  const [consultingType, setConsultingType] = useState('');
  const [sortBy, setSortBy] = useState('distance');
  const [originalDesigners, setOriginalDesigners] = useState<Designer[]>([]);
  const [designers, setDesigners] = useState<Designer[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasUpComingReservation, setHasUpComingReservation] = useState(false);
  const [viewMode, setViewMode] = useState<'simple' | 'detailed'>('simple');
  const navigate = useNavigate();
  const userId = getUserIdFromToken();

  useEffect(() => {
    if (!userId) return;

    const fetchReservations = async () => {
      try {
        const reservations = await apiRequest(`/api/consulting/user/${userId}`);

        const now = new Date();

        // 예약 목록 필터링해 업데이트할 예약 찾기
        const completedReservations = reservations.filter((reservation: ReservationState) => {
          const reservationTime = new Date(reservation.time);
          return reservationTime < now && reservation.status == "SCHEDULED";
        })

        // 지난 예약 상태를 COMPLETED로 업데이트
        for (const reservation of completedReservations) {
          await apiRequest(`/api/consulting/${reservation.id}/complete`, { method: "PATCH" });
          reservation.status = "COMPLETE";
        }

        // 임박한 예약이 있는지 확인
        const hasUpComing = reservations.some((reservation: ReservationState) => {
          const reservationTime = new Date(reservation.time);
          const diffHours = (reservationTime.getTime() - now.getTime()) / (1000 * 60 * 60);
          return diffHours > 0 && diffHours <= 24;
        });

        setHasUpComingReservation(hasUpComing);

        // ✅ 툴팁을 3초 동안 표시
        if (hasUpComing) {
          setShowTooltip(true);
          setTimeout(() => setShowTooltip(false), 3000);
        }
      } catch (error) {
        console.error('예약 정보를 불러오는 데 실패했습니다.', error);
      }
    };
    fetchReservations();
  }, [userId]);

  // 현재 위치 구하기
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error('위치 정보를 가져올 수 없습니다.', error);
      }
    );
  }, []);

  // 거리 순으로 디자이너 리스트 가져오기
  // fetchDesigners 함수 부분을 다음과 같이 수정하세요
  useEffect(() => {
    if (!userLocation) return;

    const fetchDesigners = async () => {
      try {
        const response = await apiRequest(
          `/api/designers/nearby?lat=${userLocation.lat}&lng=${userLocation.lng}`
        );

        // 응답이 배열인지 확인
        if (Array.isArray(response)) {
          const formattedData = response.map((designer: any) => ({
            id: designer.id,
            name: designer.name,
            price: Math.min(designer.offlinePrice, designer.onlinePrice),
            image: designer.profile,
            specialty: designer.expertField,
            distance: designer.distance,
            type: designer.type,
          }));

          setOriginalDesigners(formattedData);
          setDesigners(formattedData);
        } else {
          // 응답이 배열이 아닌 경우 처리
          console.error('API 응답이 배열 형식이 아닙니다:', response);
          setOriginalDesigners([]);
          setDesigners([]);
        }
      } catch (error) {
        console.error('디자이너 목록을 불러오는 데 실패했습니다.', error);
        setOriginalDesigners([]);
        setDesigners([]);
      }
    };

    fetchDesigners();
  }, [userLocation]);

  useEffect(() => {
    if (originalDesigners.length === 0) return;

    let filtered = [...originalDesigners];

    if (consultingType) {
      filtered = filtered.filter(item => {
        if (consultingType === 'OFFLINE') {
          return item.type === "OFFLINE" || item.type === "BOTH";
        } else if (consultingType === 'ONLINE') {
          return item.type === "ONLINE" || item.type === "BOTH";
        }
        return true;
      });
    }

    if (sortBy === "price_asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setDesigners([...filtered]);
    console.log("정렬된 데이터: ", filtered);
  }, [sortBy, consultingType, originalDesigners]);

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="designer-list-container">
      <header className="designer-list-header">
        <div className="header-content">
          <img src="/icons/header-logo.svg" alt="header-logo" />
          <button className="calendar-button" onClick={() => navigate(`/myreservation`)}>
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
            <img src="/icons/reservation-logo.svg" alt="logo" className="designerlist-logo" />
          </div>
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
                onClick={() => navigate(`/designerdetail/${item.id}`)}
                key={item.id}
                name={item.name}
                price={item.price}
                image={item.image}
                specialty={item.specialty}
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