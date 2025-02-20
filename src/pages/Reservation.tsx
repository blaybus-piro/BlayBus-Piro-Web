import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from "react-router-dom";
import Header from '../components/Header/Header';
import WeeklyCalendar from '../components/WeeklyCalendar/WeeklyCalendar';
import TimeSelector from '../components/TimeSelector/TimeSelector';
import '../styles/Reservation.styles.css';
import { apiRequest } from '../utils/api';

export default function ReservationPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const consultMethod = searchParams.get("method") === "OFFLINE" ? "OFFLINE" : "ONLINE";
  const amount = searchParams.get("amount") || 0;
  const [bookedTimesByDate, setBookedTimesByDate] = useState<Record<string, string[]>>({});
  const designerId = searchParams.get("designerId") || "";

  const pageTitle = consultMethod === "OFFLINE"
    ? "대면 컨설팅 예약하기"
    : "비대면 컨설팅 예약하기";

  useEffect(() => {
    if (!designerId) return;

    const fetchBookedTimes = async () => {
      try {
        const response = await apiRequest(`/api/time/${designerId}`);

        if (Array.isArray(response)) {
          const formattedBookedTimes: Record<string, string[]> = response.reduce((acc, item) => {
            if (!item.startTime) {
              console.log("startTime이 없습니다!");
              return acc;
            }

            const [date, time] = item.startTime.split("T");
            const formattedTime = time.slice(0, 5);

            if (!acc[date]) {
              acc[date] = [];
            }
            acc[date].push(formattedTime);
            return acc;
          }, {} as Record<string, string[]>);

          console.log(formattedBookedTimes);
          setBookedTimesByDate(formattedBookedTimes);
        } else {
          console.error("API 응답이 배열이 아닙니다.", response);
          setBookedTimesByDate({});
        }
      } catch (error) {
        console.error("예약된 시간 조회 실패: ", error);
      }
    };

    fetchBookedTimes();
  }, [designerId]);
  // 예약된 시간들 (날짜별로 구성)
  // const bookedTimesByDate: Record<string, string[]> = {
  //   '2025-02-15': ['13:00', '15:30', '16:00'],
  //   '2025-02-16': ['10:00', '11:00', '13:00', '14:00']
  // };

  const formatSelectedDateTime = () => {
    if (!selectedDate || !selectedTime) return '';

    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const day = days[selectedDate.getDay()];

    return `${selectedDate.getFullYear()}년 ${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일 (${day}) ${selectedTime}`;
  };

  // Reservation.tsx의 handleNext 함수 수정
  const handleNext = async () => {
    if (selectedDate && selectedTime) {
      try {
        const startTime = `${selectedDate.toISOString().split('T')[0]}T${selectedTime}:00`;

        // 중요: localStorage에 디자이너 ID 직접 저장
        localStorage.setItem("designerId", designerId);
        localStorage.setItem("selectedDate", selectedDate.toISOString().split('T')[0]);
        localStorage.setItem("selectedTime", selectedTime);
        localStorage.setItem("consultMethod", consultMethod);
        localStorage.setItem("amount", String(amount));

        // 기존 코드 유지
        localStorage.setItem("reservationInfo", JSON.stringify({
          startTime,
          designerId,
          consultMethod,
          selectedTime,
          amount
        }));

        navigate('/payment', {
          state: {
            selectedDate: selectedDate.toISOString().split('T')[0],
            selectedTime,
            consultMethod,
            startTime,
            designerId,
            amount,
          }
        });
      } catch (error) {
        console.error('예약 정보 저장 실패:', error);
        alert('예약 정보 저장에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  // const handlePayment = () => {
  //   if (selectedDate && selectedTime) {
  //     navigate('/reservationcomplete', { state: { selectedDate, selectedTime, consultMethod } });
  //   }
  // };

  return (
    <div className="reservation-container">
      {/* 고정된 헤더 */}
      <div className="reservation-header">
        <Header title={pageTitle} />
      </div>

      {/* 스크롤이 적용될 영역 */}
      <div className="reservation-wrapper">
        <div className="reservation-content">
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
        </div>
      </div>

      {/* 고정된 푸터 */}
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
