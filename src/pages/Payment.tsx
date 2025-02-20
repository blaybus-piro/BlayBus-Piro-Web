import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import '../styles/Payment.styles.css';
// createConsulting 임포트 제거 (사용하지 않음)
import { getUserIdFromToken } from '../utils/auth';
import { apiRequest } from "../utils/api";

type PaymentMethod = 'account' | '카카오페이' | null;
type TransferMethod = 'app' | 'direct' | null;
type BankOption = 'toss' | 'kakaopay' | 'won' | 'kb' | null;

export default function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [transferMethod, setTransferMethod] = useState<TransferMethod>(null);
  const [selectedBank, setSelectedBank] = useState<BankOption>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedDate, selectedTime, consultMethod, designerId, amount } = location.state || {};
  const [isReservationInfoOpen, setIsReservationInfoOpen] = useState(false);
  const [isAppTransferVisible, setIsAppTransferVisible] = useState(false);
  const userId = getUserIdFromToken();
  const [userInfo, setUserInfo] = useState<{ name: string; email: string } | null>(null);

  const toggleReservationInfo = () => {
    setIsReservationInfoOpen((prev) => !prev);
  };

  console.log("결제 금액: ", amount);

  const isDockerEnv = window.location.hostname === "backend";
  const BACKEND_URL = isDockerEnv
    ? "http://backend:8080"
    : import.meta.env.VITE_BACKEND_URL || "https://blarybus-haertz.netlify.app";

  const startTime = selectedDate && selectedTime ? `${selectedDate}T${selectedTime}` : '';

  const formatToFullTimestamp = (isoString: string) => {
    const date = new Date(isoString); // ISO 문자열을 Date 객체로 변환

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(6, '1'); // 마이크로초까지 확장

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
  }

  const startTimeISO = startTime ? formatToFullTimestamp(startTime) : '';

  // 예약 생성 함수
  // 예약 생성 함수도 useCallback으로 감싸기
  const createReservation = useCallback(async (payType: string) => {
    try {
      console.log("예약 생성 요청 데이터:", {
        startTime: startTimeISO,
        designerId,
        meet: consultMethod === 'ONLINE' ? 'ONLINE' : 'OFFLINE',
        pay: payType === '카카오페이' ? "카카오페이" : "계좌이체",
        address_id: 1
      });
  
      console.log("apiRequest 호출 직전");
      const response = await apiRequest("/api/consulting/create", {
        method: "POST",
        body: JSON.stringify({
          startTime: startTimeISO,
          designerId: designerId,
          meet: consultMethod === 'ONLINE' ? 'ONLINE' : 'OFFLINE',
          pay: payType === '카카오페이' ? "카카오페이" : "계좌이체",
          address_id: 1
        })
      });
  
      console.log("✅ 예약 생성 성공:", response);
  
      if (response && response.consultingId) {
        localStorage.setItem("consultingId", response.consultingId);
        localStorage.setItem("status", response.status || "PENDING");
      }
  
      return true;
    } catch (error) {
      console.error("❌ 예약 생성 실패:", error);
      return false;
    }
  }, [startTimeISO, designerId, consultMethod]);

  // 결제 승인 API를 통해 결제 확인 후 예약 생성
  // exhaustive-deps 경고 수정: 모든 의존성 추가
  // confirmPaymentAndReserve 함수 수정
const confirmPaymentAndReserve = useCallback(async (pg_token?: string) => {
  console.log("confirmPaymentAndReserve 시작");
  const tid = localStorage.getItem("kakao_tid");
  if (!tid) {
    alert("결제 정보가 없습니다.");
    return;
  }
  console.log("tid 확인", tid);

  try {
    console.log("카카오페이 승인 요청 시작");
    const response = await fetch(`${BACKEND_URL}/api/pay/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        tid, 
        pg_token,
        amount: amount || 0  // null/undefined 대응
      }),
    });
    console.log("카카오페이 응답:", response.status);
    if (!response.ok) {
      throw new Error(`결제 승인 실패: ${response.status}`);
    }

    const paymentData = await response.json();
    console.log("카카오페이 승인 데이터:", paymentData);

    if (!paymentData.approved) {
      throw new Error("결제가 승인되지 않았습니다.");
    }

    // ✅ 결제 정보를 localStorage에 저장
    localStorage.setItem("paymentType", "카카오페이");
    localStorage.setItem("approved_at", new Date().toISOString());
    localStorage.setItem("item_name", consultMethod === 'OFFLINE' ? 'OFFLINE' : 'ONLINE');
    
    // amount 안전하게 처리
    if (amount !== null && amount !== undefined) {
      localStorage.setItem("amount", String(amount));
    }
    
    // designerId 안전하게 처리
    if (designerId) {
      localStorage.setItem("designerId", designerId);
    }

    // 필요한 정보도 모두 저장
    localStorage.setItem("selectedDate", selectedDate || "");
    localStorage.setItem("selectedTime", selectedTime || "");
    localStorage.setItem("consultMethod", consultMethod || "");
    
    console.log("5");
    // 결제 성공 시 예약 생성 - 여기에서 API 호출
    console.log("createReservation 호출 직전");
    const reservationSuccess = await createReservation('카카오페이');

    if (reservationSuccess) {
      navigate('/reservationcomplete');
    } else {
      throw new Error("예약 생성에 실패했습니다.");
    }

  } catch (error) {
    console.error("결제 승인 또는 예약 생성 실패:", error);
    alert(`결제 승인 처리 중 오류가 발생했습니다: ${(error as Error).message}`);
  }
}, [navigate, amount, selectedDate, selectedTime, consultMethod, BACKEND_URL, designerId, createReservation]);

  // ✅ useEffect에서 pg_token 감지하여 실행
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const pgToken = queryParams.get("pg_token");
    
    console.log("🔍 pgToken 감지:", pgToken);
    console.log("localStorage 확인:", {
      tid: localStorage.getItem("kakao_tid"),
      selectedDate: localStorage.getItem("selectedDate"),
      selectedTime: localStorage.getItem("selectedTime"),
      consultMethod: localStorage.getItem("consultMethod"),
      designerId: localStorage.getItem("designerId"),
      amount: localStorage.getItem("amount")
    });
    
    // tid가 있을 경우에만 결제 승인 진행
    const tid = localStorage.getItem("kakao_tid");
    if (tid && pgToken) {
      confirmPaymentAndReserve(pgToken);
    }
  }, [location.search, confirmPaymentAndReserve]);
  

  // ✅ 결제 요청 함수
  const handlePayment = async () => {
    if (!paymentMethod || !amount) return;
    console.log("결제 시작:", paymentMethod, amount);
  
    try {
      if (paymentMethod === '카카오페이') {
        console.log("카카오페이 결제 요청", BACKEND_URL);
        const response = await fetch(`${BACKEND_URL}/api/pay/ready`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount }),
          credentials: 'include', // 쿠키 포함
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          console.error("결제 요청 응답:", errorText);
          throw new Error(`결제 요청 실패: ${response.status}`);
        }
  
        const data = await response.json();
        console.log("카카오페이 응답:", data);
        
        if (data.tid) {
          localStorage.setItem("kakao_tid", data.tid);  // 결제 고유 ID 저장
        }
        
        if (designerId) {
          localStorage.setItem("designerId", designerId); // 디자이너 ID 저장
        }
  
        // 예약 정보도 저장
        localStorage.setItem("selectedDate", selectedDate || "");
        localStorage.setItem("selectedTime", selectedTime || "");
        localStorage.setItem("consultMethod", consultMethod || "");
        localStorage.setItem("amount", String(amount));
  
        // 리디렉션 URL 확인
        const redirectUrl = window.innerWidth > 768 ? data.next_redirect_pc_url : data.next_redirect_mobile_url;
        console.log("리디렉션:", redirectUrl);
        
        // 수정된 부분: 백엔드에서 reservationcomplete2로 리다이렉트
        window.location.href = redirectUrl;
      }
    } catch (error) {
      console.error('결제 요청 중 오류:', error);
      alert(`결제 처리 중 오류가 발생했습니다: ${(error as Error).message}`);
    }
  };

  const handleAccountTransfer = () => {
    setPaymentMethod('account');
    setIsAppTransferVisible(true);
    setTransferMethod(null);
    setSelectedBank(null);
  };

  const handleKakaoPay = () => {
    setPaymentMethod('카카오페이');
    setIsAppTransferVisible(false);
    setTransferMethod(null);
    setSelectedBank(null);
  };

  const handleTransferMethodChange = (method: TransferMethod) => {
    setTransferMethod(method);
    if (method === 'direct') {
      setSelectedBank(null);
    }
  };

  const handleBankSelection = (bank: BankOption) => {
    setSelectedBank(bank);
  };

  const handleBankPayment = () => {
    let deeplink = "";
    const clipboardText = "138910305992207";

    switch (selectedBank) {
      case "toss":
        deeplink = "supertoss://send?account=508116542988&amount=190000";
        break;
      case "kakaopay":
        deeplink = "kakaopay://";
        break;
      case "won":
        deeplink = "SFG-SHB-sbank://?";
        break;
      case "kb":
        deeplink = "kBbank://?";
        break;
      default:
        alert("은행을 선택해 주세요.");
        return;
    }

    navigator.clipboard.writeText(clipboardText).then(() => {
      alert("계좌번호가 복사되었습니다.");
    });

    window.location.href = deeplink;
  };

  // 직접 이체 결제 완료 처리
  const handleDirectPayment = async () => {
    try {
      // 결제 정보 저장
      localStorage.setItem("paymentType", "direct");
      localStorage.setItem("selectedDate", selectedDate || "");
      localStorage.setItem("selectedTime", selectedTime || "");
      localStorage.setItem("consultMethod", consultMethod || "");
      
      // amount가 null이나 undefined일 수 있으므로 안전하게 처리
      if (amount) {
        localStorage.setItem("amount", String(amount));
      }
      
      if (designerId) {
        localStorage.setItem("designerId", designerId);
      }
      
      localStorage.setItem("approved_at", new Date().toISOString());
  
      // 예약 생성 API 호출
      const reservationSuccess = await createReservation('direct');
  
      if (reservationSuccess) {
        navigate('/reservationcomplete');
      } else {
        throw new Error("예약 생성에 실패했습니다.");
      }
    } catch (error) {
      console.error("계좌이체 결제 처리 오류:", error);
      alert(`결제 처리 중 오류가 발생했습니다: ${(error as Error).message}`);
    }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!userId) return; // 🚨 userId가 없으면 실행 안 함

      try {
        const userData = await apiRequest(`/api/users/${userId}`);
        console.log("✅ 유저 정보 가져오기 성공:", userData);

        setUserInfo({
          name: userData.name,
          email: userData.mail,
        });
      } catch (error) {
        console.error("❌ 유저 정보 가져오기 실패:", error);
      }
    };

    fetchUserInfo(); // ✅ 비동기 함수 실행
  }, [userId]);

  const convertToKoreanNumber = (num: number) => {
    if (num >= 10000) {
      const man = Math.floor(num / 10000);
      return `${man}만원`;
    }
    return `${num}원`;
  };

  return (
    <div className="payment-container">
      {/* 고정된 헤더 */}
      <div className="payment-header">
        <Header title="결제하기" />
      </div>

      <div className="payment-wrapper" style={{ overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
        <div className="payment-content">
          <div className="info-section">
            <div className={`toggle-container ${isReservationInfoOpen ? 'open' : ''}`}>
              <div className="toggle-info" onClick={toggleReservationInfo}>
                <span className="toggle-title">예약자 정보</span>
                <span className={`arrow ${isReservationInfoOpen ? 'open' : ''}`}>
                  <img src="/icons/toggle-before.svg" alt="toggle" />
                </span>
              </div>
              {isReservationInfoOpen && (
                <div className="toggle-details">
                  <div className="info-row">
                    <span className="info-label">성함</span>
                    <span className="info-value">{userInfo?.name}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">이메일</span>
                    <span className="info-value">{userInfo?.email}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="payment-method-section">
            <h2 className="section-title">결제 방식을 선택해 주세요</h2>
            <div className="payment-buttons">
              <button
                className={`payment-method-button ${paymentMethod === 'account' ? 'selected' : ''}`}
                onClick={handleAccountTransfer}
              >
                계좌이체
              </button>
              <button
                className={`payment-method-button ${paymentMethod === '카카오페이' ? 'selected' : ''}`}
                onClick={handleKakaoPay}
              >
                <img src="/icons/kakaopay.svg" alt="kakaopay" className="kakao-icon" />
                카카오페이
              </button>
            </div>

            {isAppTransferVisible && (
              <div className="app-transfer-options">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="transferMethod"
                    value="app"
                    checked={transferMethod === "app"}
                    onChange={() => handleTransferMethodChange("app")}
                  />
                  <span className="send-money-text">앱으로 이체하기</span>
                </label>
                {transferMethod === 'app' && (
                  <div className="app-buttons">
                    <button
                      className={`app-button ${selectedBank === 'toss' ? 'selected' : ''}`}
                      onClick={() => handleBankSelection('toss')}
                    >
                      <img src="/icons/toss.svg" alt="Toss" />
                      토스 송금하기
                    </button>
                    <button
                      className={`app-button ${selectedBank === 'kakaopay' ? 'selected' : ''}`}
                      onClick={() => handleBankSelection('kakaopay')}
                    >
                      <img src="/icons/kakaopay.svg" alt="KakaoPay" />
                      카카오페이 송금하기
                    </button>
                    <button
                      className={`app-button ${selectedBank === 'won' ? 'selected' : ''}`}
                      onClick={() => handleBankSelection('won')}
                    >
                      <img src="/icons/won.svg" alt="WON" />
                      우리WON뱅킹 송금하기
                    </button>
                    <button
                      className={`app-button ${selectedBank === 'kb' ? 'selected' : ''}`}
                      onClick={() => handleBankSelection('kb')}
                    >
                      <img src="/icons/kb.svg" alt="KB" />
                      KB스타뱅킹 송금하기
                    </button>
                  </div>
                )}

                <label className="radio-option">
                  <input
                    type="radio"
                    name="transferMethod"
                    value="direct"
                    checked={transferMethod === "direct"}
                    onChange={() => handleTransferMethodChange("direct")}
                  />
                  <span className="send-money-text">직접 이체하기</span>
                </label>

                {transferMethod === 'direct' && (
                  <div className="deposit-info">
                    <h3 className="deposit-title">입금 정보</h3>
                    <div className="deposit-grid">
                      <div className="deposit-item">
                        <span className="deposit-label">예금주 명</span>
                        <span className="deposit-value">블리츠</span>
                      </div>
                      <div className="deposit-item">
                        <span className="deposit-label">은행명</span>
                        <span className="deposit-value">하나은행</span>
                      </div>
                      <div className="deposit-item">
                        <span className="deposit-label">계좌번호</span>
                        <div className="account-number">
                          <span className="deposit-value">138910305992207</span>
                        </div>
                      </div>
                      <div className="deposit-item">
                        <span className="deposit-label">금액</span>
                        <span className="deposit-value">
                          {amount ? `${amount.toLocaleString()}원 (${convertToKoreanNumber(amount)})` : '0원'}
                        </span>
                      </div>
                      <button onClick={() => {
                        navigator.clipboard.writeText('138910305992207');
                        alert('계좌번호가 복사되었습니다.');
                      }} className="deposit-copy-button">
                        클립보드 복사하기
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <footer className="payment-footer">
          <button
            className={`payment-button ${!paymentMethod ? 'disabled' : ''}`}
            disabled={!paymentMethod}
            onClick={() => {
              if (!paymentMethod) return;

              if (paymentMethod === "account") {
                if (transferMethod === "app") {
                  handleBankPayment();
                } else if (transferMethod === "direct") {
                  // 직접 이체 시 예약 생성 후 완료 페이지로 이동
                  handleDirectPayment();
                }
              } else if (paymentMethod === "카카오페이") {
                handlePayment();
              }
            }}
          >
            {amount ? `${amount.toLocaleString()}원` : '0원'} 결제하기
          </button>
        </footer>
      </div>
    </div>
  );
}