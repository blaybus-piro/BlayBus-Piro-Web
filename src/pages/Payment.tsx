import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import '../styles/Payment.styles.css';

type PaymentMethod = 'account' | 'kakao' | null;

export default function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedDate, selectedTime, consultMethod } = location.state || {};
  
  const amount = consultMethod === 'offline' ? 40000 : 20000;

  const formatDateTime = (date: Date, time: string) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const day = days[date.getDay()];
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 (${day}) ${time}`;
  };

  const isDockerEnv = window.location.hostname === "backend";
  const BACKEND_URL = isDockerEnv
      ? "http://backend:8080"
      : import.meta.env.VITE_BACKEND_URL || "https://blarybus-haertz.netlify.app";
  const handlePayment = async () => {
    if (!paymentMethod) return;
  
    if (paymentMethod === 'kakao') {
      try {
        const response = await fetch(`${BACKEND_URL}/api/pay/ready`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ amount }),
        });
  
        if (!response.ok) {
          throw new Error('카카오페이 결제 요청 실패');
        }
  
        const data = await response.json();
        const redirectUrl = window.innerWidth > 768 ? data.next_redirect_pc_url : data.next_redirect_mobile_url;
  
        window.location.href = redirectUrl; // 카카오페이 결제 페이지로 이동
      } catch (error) {
        console.error('카카오페이 결제 에러:', error);
        alert('결제 요청 중 오류가 발생했습니다.');
      }
    } else {
      navigate('/reservationcomplete', {
        state: {
          selectedDate,
          selectedTime,
          consultMethod,
          paymentMethod,
        },
      });
    }
  };

  return (
    <div className="payment-container">
      <Header title="결제하기" />
      
      <div className="payment-content">
        <div className="info-section">
          <h2 className="section-title">예약 정보</h2>
          <div className="info-box">
            <div className="info-row">
              <span className="info-label">예약 시간</span>
              <span className="info-value">{formatDateTime(selectedDate, selectedTime)}</span>
            </div>
            <div className="info-row">
              <span className="info-label">상담 방식</span>
              <span className="info-value">{consultMethod === 'offline' ? '대면 상담' : '비대면 상담'}</span>
            </div>
          </div>
        </div>

        <div className="payment-method-section">
          <h2 className="section-title">결제 방식을 선택해 주세요</h2>
          <div className="payment-buttons">
            <button 
              className={`payment-method-button ${paymentMethod === 'account' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('account')}
            >
              계좌이체
            </button>
            <button 
              className={`payment-method-button ${paymentMethod === 'kakao' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('kakao')}
            >
              <img src="/icons/kakaopay.svg" alt="kakaopay" className="kakao-icon" />
              카카오페이
            </button>
          </div>
        </div>
      </div>

      <footer className="payment-footer">
        <button 
          className={`payment-button ${!paymentMethod ? 'disabled' : ''}`}
          disabled={!paymentMethod}
          onClick={handlePayment}
        >
          {amount.toLocaleString()}원 결제하기
        </button>
      </footer>
    </div>
  );
}
