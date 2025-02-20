import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/api';

export default function ReservationComplete2() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('처리 중...');
  // location은 사용하지 않으므로 제거
  
  // 날짜 변환 함수를 먼저 선언
  const formatToFullTimestamp = (isoString: string) => {
    if (!isoString) return '';
    
    const date = new Date(isoString);
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(6, '1');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
  };

  // 그 다음 useEffect 선언
  useEffect(() => {
    // 저장된 데이터 가져오기
    const createReservation = async () => {
      try {
        // 필수 데이터 확인
        const selectedDate = localStorage.getItem("selectedDate");
        const selectedTime = localStorage.getItem("selectedTime");
        const consultMethod = localStorage.getItem("consultMethod");
        const designerId = localStorage.getItem("designerId");
        const startTimeISO = localStorage.getItem("startTimeISO");
  
        console.log("예약 생성에 필요한 데이터 확인:", {
          selectedDate,
          selectedTime,
          consultMethod,
          designerId,
          startTimeISO
        });
  
        if (!selectedDate || !selectedTime || !consultMethod || !designerId) {
          setStatus('예약 정보를 찾을 수 없습니다.');
          setTimeout(() => navigate('/designerlist'), 2000);
          return;
        }
  
        // startTimeISO가 있으면 그대로 사용하고, 없으면 생성
        const finalStartTimeISO = startTimeISO || formatToFullTimestamp(`${selectedDate}T${selectedTime}`);
        
        // 로컬 스토리지에서 토큰 가져오기
        const token = localStorage.getItem("token");
        
        setStatus('예약 생성 중...');
        const response = await apiRequest("/api/consulting/create", {
          method: "POST",
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',  // 인증 헤더 추가
          },
          body: JSON.stringify({
            startTime: finalStartTimeISO,
            designerId: designerId,
            meet: consultMethod === 'ONLINE' ? 'ONLINE' : 'OFFLINE',
            pay: "카카오페이",
            address_id: 1
          })
        });
  
        console.log("예약 생성 성공:", response);
  
        if (response && response.consultingId) {
          localStorage.setItem("consultingId", response.consultingId);
          localStorage.setItem("status", response.status || "PENDING");
          localStorage.setItem("paymentType", "카카오페이");
          localStorage.setItem("approved_at", new Date().toISOString());
          localStorage.setItem("item_name", consultMethod);
          
          // 성공 후 리디렉션
          setStatus('예약이 완료되었습니다!');
          setTimeout(() => navigate('/reservationcomplete'), 1000);
        } else {
          throw new Error("예약 ID를 받지 못했습니다.");
        }
      } catch (error) {
        console.error("예약 생성 실패:", error);
        setStatus('예약 생성에 실패했습니다. 다시 시도해주세요.');
        setTimeout(() => navigate('/designerlist'), 2000);
      }
    };
  
    createReservation();
  }, [navigate]); // formatToFullTimestamp는 컴포넌트 내에 선언되어 의존성에서 제외

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h2>{status}</h2>
      <p>잠시만 기다려주세요...</p>
      {/* 로딩 인디케이터 추가 */}
      <div style={{
        width: '48px',
        height: '48px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #3498db',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginTop: '20px'
      }}></div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}