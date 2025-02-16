import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from "react-router-dom";
import Header from '../components/Header/Header';
import WeeklyCalendar from '../components/WeeklyCalendar/WeeklyCalendar';
import TimeSelector from '../components/TimeSelector/TimeSelector';
import '../styles/Reservation.styles.css';

export default function ReservationPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const consultMethod = searchParams.get("method") === "offline" ? "offline" : "online";

  const pageTitle = consultMethod === "offline" 
    ? "대면 컨설팅 예약하기" 
    : "비대면 컨설팅 예약하기";

  // 예약된 시간들 (날짜별로 구성)
  const bookedTimesByDate: Record<string, string[]> = {
    '2025-02-15': ['13:00', '15:30', '16:00'],
    '2025-02-16': ['10:00', '11:00', '13:00', '14:00']
  };

  const formatSelectedDateTime = () => {
    if (!selectedDate || !selectedTime) return '';
    
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const day = days[selectedDate.getDay()];
    
    return `${selectedDate.getFullYear()}년 ${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일 (${day}) ${selectedTime}`;
  };

  const handleNext = () => {
    if (selectedDate && selectedTime) {
      navigate('/payment', { state: { selectedDate, selectedTime, consultMethod } });
    }
  };

  // const handlePayment = () => {
  //   if (selectedDate && selectedTime) {
  //     navigate('/reservationcomplete', { state: { selectedDate, selectedTime, consultMethod } });
  //   }
  // };

  return (
    <div className="reservation-container">
      <Header title={pageTitle} />
      
      <WeeklyCalendar 
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        bookedTimesByDate={bookedTimesByDate}
      />
      
      <TimeSelector
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        onTimeSelect={setSelectedTime}
        bookedTimes={selectedDate 
          ? bookedTimesByDate[`${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`] || [] 
          : []
        }
      />

      {selectedDate && selectedTime && (
        <div className="selected-datetime">
          <img src="/icons/calendar.svg" alt="calendar" />
          {formatSelectedDateTime()}
        </div>
      )}

      {/* <footer className="reservation-footer">
        <button 
          className={`payment-button ${!(selectedDate && selectedTime) ? 'disabled' : ''}`}
          disabled={!(selectedDate && selectedTime)}
          onClick={handlePayment}
        >
          {consultMethod === 'offline' ? '40,000원' : '20,000원'} 결제하기
        </button>
      </footer> */}

      <footer className="reservation-footer">
        <button 
          className={`next-button ${!(selectedDate && selectedTime) ? 'disabled' : ''}`}
          disabled={!(selectedDate && selectedTime)}
          onClick={handleNext}
        >
          다음
        </button>
      </footer>
    </div>
  );
}
