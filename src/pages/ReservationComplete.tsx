import Header from '../components/Header/Header';
import Button from '../components/Button/Button'; // 버튼 컴포넌트 추가
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/ReservationComplete.styles.css';

export default function ReservationComplete() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { selectedDate, selectedTime, consultMethod } = location.state || {};

  if (!selectedDate || !selectedTime) {
    return <div className="error-message">예약 정보가 없습니다.</div>;
  }
  
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const dateObj = new Date(selectedDate);
  const formattedDate = `${dateObj.getFullYear()}년 ${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일 (${days[dateObj.getDay()]}) ${selectedTime}`;

  return (
    <div className="reservation-complete-container">
      <Header title={consultMethod === 'offline' ? '대면 컨설팅 예약하기' : '비대면 컨설팅 예약하기'} />
      
      <div className="reservation-info">
        <div className="complete-message">예약이 완료되었어요</div>
        <p className="sub-message">예약 정보를 한 번 더 확인해 주세요</p>
        
        <div className="complete-selected-datetime">
            <img src="/icons/calendar.svg" alt="calendar" className="calendar-icon" />
            <span>{formattedDate}</span>
        </div>
      </div>

      <img src="/icons/reservation-logo.svg" alt="logo" className="reservation-logo" />     
      
      <footer className="reservation-complete-footer">
        <Button variant="secondary" size="large" onClick={() => navigate('/')}>홈으로 가기</Button>
        <Button variant="primary" size="large" onClick={() => navigate('/my-reservations')}>나의 예약</Button>
      </footer>
    </div>
  );
}
