import { useState } from 'react';
import Header from '../components/Header/Header';
import WeeklyCalendar from '../components/WeeklyCalendar/WeeklyCalendar';
import TimeSelector from '../components/TimeSelector/TimeSelector';
import '../styles/Reservation.styles.css';

export default function ReservationPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // 예시 예약된 시간들
  const bookedTimes = ["13:00", "15:30", "16:00"];

  const formatSelectedDateTime = () => {
    if (!selectedDate || !selectedTime) return '';
    
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const day = days[selectedDate.getDay()];
    
    return `${selectedDate.getFullYear()}년 ${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일 (${day}) ${selectedTime}`;
  };

  return (
    <div className="reservation-container">
      <Header title="비대면 컨설팅 예약하기" />
      
      <WeeklyCalendar 
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />
      
      <TimeSelector
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        onTimeSelect={setSelectedTime}
        bookedTimes={bookedTimes}
      />

      {selectedDate && selectedTime && (
        <div className="selected-datetime">
          <span className="calendar-icon">📅</span>
          {formatSelectedDateTime()}
        </div>
      )}

      <footer className="reservation-footer">
        <button className="payment-button">
          20,000원 결제하기
        </button>
      </footer>
    </div>
  );
}