import Header from '../components/Header/Header';
import Button from '../components/Button/Button';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import '../styles/ReservationComplete.styles.css';
import { apiRequest } from '../utils/api';

export default function ReservationComplete() {
  const navigate = useNavigate();
  const [reservationCreated, setReservationCreated] = useState(false);
  const [missingData, setMissingData] = useState(false);

  // localStorage에서 데이터 불러오기
  const selectedDate = localStorage.getItem("selectedDate");
  const selectedTime = localStorage.getItem("selectedTime");
  const consultMethod = localStorage.getItem("consultMethod");
  const amount = localStorage.getItem("amount");
  const approved_at = localStorage.getItem("approved_at");
  const item_name = localStorage.getItem("item_name");
  const paymentType = localStorage.getItem("paymentType");
  const designerId = localStorage.getItem("designerId");

  // 필수 데이터 확인
  useEffect(() => {
    if (!selectedDate || !selectedTime || !consultMethod) {
      setMissingData(true);
    } else {
      setMissingData(false);
    }
  }, [selectedDate, selectedTime, consultMethod]);

  // 날짜 형식 변환
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const dateObj = selectedDate ? new Date(selectedDate) : new Date();
  const formattedDate = selectedDate && selectedTime ? 
    `${dateObj.getFullYear()}년 ${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일 (${days[dateObj.getDay()]}) ${selectedTime}` : '';

  // 결제 승인 시간 변환
  const formattedApprovedDate = approved_at ? new Date(approved_at).toLocaleString() : '';

  // 예약 생성 Effect
  useEffect(() => {
    console.log("useEffect 실행");
    if (missingData || !designerId || reservationCreated) {
      return;
    }

    const createReservation = async () => {
      try {
        const response = await apiRequest("/api/consulting/create", {
          method: "POST",
          body: JSON.stringify({
            startTime: `${selectedDate}T${selectedTime}`,
            designerId: designerId,
            meet: consultMethod,
            pay: paymentType === 'kakao' ? "카카오페이" : "계좌이체",
            address_id: 1
          })
        });

        console.log("✅ 예약 생성 성공:", response);
        setReservationCreated(true);
      } catch (error) {
        console.error("예약 생성 실패: ", error);
      }
    };

    createReservation();
  }, [selectedDate, selectedTime, consultMethod, designerId, reservationCreated, paymentType, missingData]);

  // 메시지 결정
  const getMessage = () => {
    if (paymentType === 'kakao') {
      return {
        main: '예약이 완료되었어요',
        sub: '예약 정보를 한 번 더 확인해 주세요!'
      };
    } else if (paymentType === 'direct') {
      return {
        main: '예약이 완료되었어요',
        sub: '이체 확인이 될 때까지 기다려주세요!'
      };
    } else {
      return {
        main: '예약이 완료되었어요',
        sub: '예약 정보를 한 번 더 확인해 주세요!'
      };
    }
  };

  const messages = getMessage();

  // 필수 데이터가 없을 경우 에러 화면 표시
  if (missingData) {
    return (
      <div className="error-container">
        <div className="error-message">예약 정보를 찾을 수 없습니다.</div>
        <Button variant="primary" size="large" onClick={() => navigate('/designerlist')}>
          홈으로 가기
        </Button>
      </div>
    );
  }

  // 정상 화면 렌더링
  return (
    <div className="reservation-complete-container">
      <Header title={consultMethod === 'OFFLINE' ? '대면 컨설팅 예약하기' : '비대면 컨설팅 예약하기'} />

      <div className="reservation-complete-info">
        <div className="complete-message">{messages.main}</div>
        <p className="sub-message">{messages.sub}</p>

        <div className="complete-selected-datetime">
          <img src="/icons/calendar.svg" alt="calendar" className="calendar-icon" />
          <span>{formattedDate}</span>
        </div>

        {/* 결제 정보가 있는 경우에만 표시 */}
        {amount && approved_at && item_name && (
          <div className="payment-info">
            <h3>결제 정보</h3>
            <p><strong>상품명:</strong> {item_name}</p>
            <p><strong>결제 금액:</strong> {parseInt(amount).toLocaleString()}원</p>
            <p><strong>승인 시간:</strong> {formattedApprovedDate}</p>
          </div>
        )}
      </div>

      <img src="/icons/reservation-logo.svg" alt="logo" className="reservation-logo" />

      <footer className="reservation-complete-footer">
        <Button
          variant="secondary"
          size="large"
          onClick={() => {
            // localStorage 정리
            localStorage.removeItem("selectedDate");
            localStorage.removeItem("selectedTime");
            localStorage.removeItem("consultMethod");
            localStorage.removeItem("amount");
            localStorage.removeItem("approved_at");
            localStorage.removeItem("item_name");
            localStorage.removeItem("paymentType");
            localStorage.removeItem("designerId");
            navigate('/designerlist');
          }}
        >
          홈으로 가기
        </Button>
        <Button variant="primary" size="large" onClick={() => navigate('/myreservation')}>
          나의 예약
        </Button>
      </footer>
    </div>
  );
}